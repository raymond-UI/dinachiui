import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import type { Component } from "../packages/cli/src/utils/registry.ts"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")

const templatesDir = path.join(repoRoot, "packages/cli/templates")

const { getComponentRegistry, getUtilityRegistry } = (await import(
  pathToFileURL(path.join(repoRoot, "packages/cli/src/utils/registry.ts")).href
)) as typeof import("../packages/cli/src/utils/registry.ts")

const registry = getComponentRegistry()
const utilities = getUtilityRegistry()

/**
 * Imports every template is entitled to without declaring anything. React is a peer of
 * the host app, and the two aliases are written by `init` rather than installed.
 */
const AMBIENT = new Set(["react", "react-dom"])
const UTILS_ALIAS = "@/lib/utils"
const COMPONENT_ALIAS = "@/components/ui/"

/**
 * Reached through Tailwind rather than through an import — `animate-in` and `animate-out`
 * are class names, so no file names the package that defines them. Declaring one is still
 * correct, and the import check has to be told so.
 */
const NOT_IMPORTED = new Set(["tailwindcss-animate", "tw-animate-css"])

/** `@base-ui/react/checkbox-group` → `@base-ui/react`; `motion/react` → `motion`. */
function packageOf(specifier: string): string {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

/**
 * Every module specifier the file imports, including `export ... from` and type-only
 * imports — those still have to resolve for the user's build.
 */
function specifiersIn(contents: string): string[] {
  const found: string[] = []
  const regex = /(?:^|\n)\s*(?:import|export)[\s\S]*?from\s*["']([^"']+)["']/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(contents)) !== null) found.push(match[1])

  // A side-effect import has no `from` clause.
  const bare = /(?:^|\n)\s*import\s*["']([^"']+)["']/g
  while ((match = bare.exec(contents)) !== null) found.push(match[1])

  return found
}

function directoryOf(component: Component): string {
  return path.join(templatesDir, component.targetDir ?? component.name)
}

const problems: string[] = []

function report(slug: string, message: string) {
  problems.push(`  ${slug}: ${message}`)
}

for (const [slug, component] of Object.entries(registry)) {
  const dir = directoryOf(component)

  const declared = new Set([
    ...(component.dependencies ?? []),
    ...(component.devDependencies ?? []),
  ])
  const declaredComponents = new Set(component.componentDependencies ?? [])
  const declaredUtilities = new Set(component.utilityDependencies ?? [])

  const imported = new Set<string>()
  const importedComponents = new Set<string>()
  let usesUtils = false

  for (const file of component.files) {
    const filePath = path.join(dir, file.name)
    if (!fs.existsSync(filePath)) {
      // `add` reads this list to decide what to copy, so a name that does not exist is
      // a file the user silently never receives.
      report(slug, `declares ${file.name}, which is not in ${path.relative(repoRoot, dir)}`)
      continue
    }
    if (!/\.tsx?$/.test(file.name)) continue

    for (const specifier of specifiersIn(fs.readFileSync(filePath, "utf8"))) {
      if (specifier.startsWith(".")) continue
      if (specifier === UTILS_ALIAS) {
        usesUtils = true
        continue
      }
      if (specifier.startsWith(COMPONENT_ALIAS)) {
        importedComponents.add(specifier.slice(COMPONENT_ALIAS.length))
        continue
      }
      const name = packageOf(specifier)
      if (!AMBIENT.has(name)) imported.add(name)
    }
  }

  for (const name of imported) {
    if (!declared.has(name)) {
      report(slug, `imports ${name} without declaring it`)
    }
  }
  for (const name of declared) {
    if (!imported.has(name) && !NOT_IMPORTED.has(name)) {
      // An over-declared dependency is a package installed into the user's project that
      // nothing they received imports.
      report(slug, `declares ${name}, which no file imports`)
    }
  }

  for (const name of importedComponents) {
    if (!declaredComponents.has(name)) {
      report(slug, `imports the ${name} component without declaring it`)
    }
  }
  for (const name of declaredComponents) {
    if (!registry[name]) {
      report(slug, `declares the ${name} component, which is not in the registry`)
      continue
    }
    // Only meaningful for a component that imports siblings at all. Where none are
    // imported the list is a composition choice rather than a resolvable one —
    // CheckboxGroup takes Checkbox children it never names itself.
    if (importedComponents.size > 0 && !importedComponents.has(name)) {
      report(slug, `imports siblings but not the ${name} component it declares`)
    }
  }

  if (usesUtils && !declaredUtilities.has("cn")) {
    report(slug, `imports ${UTILS_ALIAS} without declaring the cn utility`)
  }
  for (const name of declaredUtilities) {
    const utility = utilities[name]
    if (!utility) {
      report(slug, `declares the ${name} utility, which is not in the utility registry`)
      continue
    }
    if (name === "cn" && !usesUtils) {
      report(slug, `declares the cn utility, which no file imports`)
    }
  }
}

for (const [name, utility] of Object.entries(utilities)) {
  const filePath = path.join(templatesDir, "utils", `${utility.name}.ts`)
  if (!fs.existsSync(filePath)) {
    report(`utils/${name}`, `points at ${utility.name}.ts, which does not exist`)
  }
  const used = Object.values(registry).some((component) =>
    (component.utilityDependencies ?? []).includes(name)
  )
  if (!used) {
    report(`utils/${name}`, "is in the utility registry but no component asks for it")
  }
}

if (problems.length > 0) {
  console.error("\nThe CLI registry does not describe the templates it ships:\n")
  console.error(problems.join("\n"))
  console.error(
    [
      "",
      "The registry is what `dinachi add` copies and installs from. A declaration that",
      "does not match the template either withholds a file or installs a package for",
      "nothing. Fix it in packages/cli/src/utils/registry.ts.",
      "",
    ].join("\n")
  )
  process.exit(1)
}

const files = Object.values(registry).reduce(
  (count, component) => count + component.files.length,
  0
)

console.log(
  [
    "The CLI registry matches the templates.",
    `Components: ${Object.keys(registry).length}`,
    `Files: ${files}`,
    `Utilities: ${Object.keys(utilities).length}`,
  ].join("\n")
)
