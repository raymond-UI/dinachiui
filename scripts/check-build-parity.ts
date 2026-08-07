import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

import { getComponentRegistry, templatesDir } from "./repo.ts"

const registry = getComponentRegistry()

interface Surface {
  values: Set<string>
  types: Set<string>
}

function isExported(node: ts.Node): boolean {
  return ts.canHaveModifiers(node)
    ? (ts.getModifiers(node) ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    : false
}

function collectBinding(name: ts.BindingName, into: Set<string>) {
  if (ts.isIdentifier(name)) {
    into.add(name.text)
    return
  }
  for (const element of name.elements) {
    if (ts.isBindingElement(element)) collectBinding(element.name, into)
  }
}

/** `export { a, b }` and `export type { C }`, including a `type` marker on one element. */
function collectExportBlock(node: ts.ExportDeclaration, into: Surface) {
  const clause = node.exportClause
  if (!clause || !ts.isNamedExports(clause)) return

  clause.elements.forEach((element) => {
    const typeOnly = node.isTypeOnly || element.isTypeOnly
    ;(typeOnly ? into.types : into.values).add(element.name.text)
  })
}

type Guard = (node: ts.Node) => boolean

/** An enum is in both lists: it is reachable as a value and as a type. */
const DECLARES_TYPE: Guard[] = [
  ts.isInterfaceDeclaration,
  ts.isTypeAliasDeclaration,
  ts.isEnumDeclaration,
]
const DECLARES_VALUE: Guard[] = [
  ts.isEnumDeclaration,
  ts.isFunctionDeclaration,
  ts.isClassDeclaration,
]

function addNamed(node: ts.Statement, guards: Guard[], into: Set<string>) {
  if (!guards.some((guard) => guard(node))) return
  // A default-exported function or class can be anonymous.
  const name = (node as { name?: ts.Identifier }).name
  if (name) into.add(name.text)
}

/**
 * Declared and exported in one statement, which is how the interfaces reach an importer
 * and is exactly what a block-only reading of the file misses.
 */
function collectDeclaration(node: ts.Statement, into: Surface) {
  addNamed(node, DECLARES_TYPE, into.types)
  addNamed(node, DECLARES_VALUE, into.values)

  // The only one that can declare several names at once, and destructuring means they are
  // not all on the statement itself.
  if (!ts.isVariableStatement(node)) return
  for (const declaration of node.declarationList.declarations) {
    collectBinding(declaration.name, into.values)
  }
}

/**
 * Every name a file makes available to an importer, split by what an importer can do with
 * it. A type and a value are not interchangeable: dropping `ToastViewportProps` breaks a
 * `satisfies` where dropping `ToastList` breaks a render, and only the second is a runtime
 * error, so both have to be compared and neither can stand in for the other.
 */
function surfaceOf(file: string): Surface {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )

  const surface: Surface = { values: new Set(), types: new Set() }

  for (const node of source.statements) {
    if (ts.isExportDeclaration(node)) collectExportBlock(node, surface)
    else if (isExported(node)) collectDeclaration(node, surface)
  }

  return surface
}

function missing(from: Set<string>, against: Set<string>): string[] {
  return [...from].filter((name) => !against.has(name)).sort()
}

const problems: string[] = []

/**
 * A component's builds are one component installed two ways, so an importer cannot tell
 * them apart. The moment one exports a name the other does not, `add toast --motion` stops
 * being a reinstall and becomes an edit to every file that imports Toast — and nothing else
 * in the repo notices, because each build type-checks perfectly well on its own.
 */
for (const [key, component] of Object.entries(registry)) {
  const variants = Object.entries(component.variants ?? {})
  if (variants.length === 0) continue

  const dir = component.targetDir ?? component.name
  const sources = component.files.filter((file) => /\.tsx?$/.test(file.name))

  for (const [flag, variant] of variants) {
    for (const file of sources) {
      const defaultPath = path.join(templatesDir, dir, file.name)
      const variantPath = path.join(templatesDir, variant.templateDir, file.name)

      // Absence is check-cli-registry's to report, and reporting it twice helps nobody.
      if (!fs.existsSync(defaultPath) || !fs.existsSync(variantPath)) continue

      const base = surfaceOf(defaultPath)
      const build = surfaceOf(variantPath)
      const slug = `${key} (--${flag}) ${file.name}`

      for (const [kind, a, b] of [
        ["value", base.values, build.values],
        ["type", base.types, build.types],
      ] as const) {
        for (const name of missing(a, b)) {
          problems.push(`  ${slug}: the default build exports the ${kind} ${name}; this one does not`)
        }
        for (const name of missing(b, a)) {
          problems.push(`  ${slug}: exports the ${kind} ${name}, which the default build does not`)
        }
      }
    }
  }
}

if (problems.length > 0) {
  console.error("\nA component's builds do not export the same names:\n")
  console.error(problems.join("\n"))
  console.error(
    [
      "",
      "Both builds install to the same path under the same name, so whatever a project",
      "imports has to exist in either. A name in one and not the other turns switching",
      "builds from a reinstall into an edit. Fix it in packages/components/src, then",
      "run `pnpm sync`.",
      "",
    ].join("\n")
  )
  process.exit(1)
}

const counted = Object.values(registry).reduce(
  (total, component) => total + Object.keys(component.variants ?? {}).length,
  0
)

console.log(
  counted === 0
    ? "No component ships an alternative build."
    : `Every alternative build exports what its default build does.\nBuilds compared: ${counted}`
)
