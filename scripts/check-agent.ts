import fs from "node:fs"
import path from "node:path"
import { gzipSync } from "node:zlib"
import { type Plugin, build } from "esbuild"
import ts from "typescript"

import { publicComponents } from "../packages/components/src/component-inventory.ts"
import { getComponentRegistry, repoRoot } from "./repo.ts"

/**
 * Holds every component that registers with the agent bridge to the same bar: it
 * registers, it installs the bridge alongside it, it runs the conformance suite, and
 * neither it nor the bridge grows past its budget.
 */

const BRIDGE_BUDGET = 9 * 1024
const COMPONENT_BUDGET = 1.5 * 1024

/** The calls that register a control. A component's agent code is what removing them saves. */
const REGISTRATIONS = new Set(["useAgentControl", "useAgentItem"])

/** `source` without its registration calls, so the helpers only they use drop out of the bundle. */
function withoutRegistrations(source: string, file: string): string {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const cuts: [number, number][] = []
  const visit = (node: ts.Node) => {
    const call = ts.isExpressionStatement(node) && ts.isCallExpression(node.expression) ? node.expression : null
    if (call && ts.isIdentifier(call.expression) && REGISTRATIONS.has(call.expression.text)) cuts.push([node.getStart(tree), node.getEnd()])
    else ts.forEachChild(node, visit)
  }
  visit(tree)
  for (const [from, to] of cuts.reverse()) source = source.slice(0, from) + source.slice(to)
  return source
}

const src = path.join(repoRoot, "packages/components/src")
const registry = getComponentRegistry()
const failures: string[] = []

const marked = new Set(publicComponents.filter((c) => c.agent).map((c) => c.slug))

/**
 * Another registered component is measured on its own, so its code stays out of this one's
 * bundle: week-strip is charged for its own agent code, not for the parseDate it reuses.
 */
const external = ["../agent", ...[...marked].map((slug) => `../${slug}`)]

async function gzipped(file: string, registered = true): Promise<number> {
  const strip: Plugin = {
    name: "strip-registrations",
    setup(b) {
      b.onLoad({ filter: /\.tsx$/ }, (args) => ({ contents: withoutRegistrations(fs.readFileSync(args.path, "utf8"), args.path), loader: "tsx" }))
    },
  }
  const result = await build({
    entryPoints: [file],
    bundle: true,
    write: false,
    minify: true,
    format: "esm",
    jsx: "automatic",
    packages: "external",
    external,
    plugins: registered ? [] : [strip],
    logLevel: "silent",
  })
  return gzipSync(result.outputFiles[0].contents).length
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`

for (const slug of fs.readdirSync(src)) {
  const file = path.join(src, slug, `${slug}.tsx`)
  if (slug === "agent" || !fs.existsSync(file)) continue
  const source = fs.readFileSync(file, "utf8")
  const imports = /from\s+["']\.\.\/agent["']/.test(source)
  if (imports && !marked.has(slug)) {
    failures.push(`${slug}: imports the agent bridge but is not marked \`agent: true\` in component-inventory.ts.`)
  }
}

for (const slug of marked) {
  const file = path.join(src, slug, `${slug}.tsx`)
  const test = path.join(src, slug, `${slug}.test.tsx`)
  if (!fs.existsSync(file)) {
    failures.push(`${slug}: marked \`agent: true\` but has no ${slug}.tsx.`)
    continue
  }
  if (!/useAgent(Control|Open)\(/.test(fs.readFileSync(file, "utf8"))) {
    failures.push(`${slug}: marked \`agent: true\` but never calls useAgentControl or useAgentOpen.`)
  }
  if (!fs.existsSync(test) || !fs.readFileSync(test, "utf8").includes("agentConformance(")) {
    failures.push(`${slug}: does not run agentConformance in ${slug}.test.tsx.`)
  }
  if (!registry[slug]?.componentDependencies?.includes("agent")) {
    failures.push(`${slug}: its registry entry does not list "agent" in componentDependencies.`)
  }

  const grown = (await gzipped(file)) - (await gzipped(file, false))
  if (grown > COMPONENT_BUDGET) {
    failures.push(`${slug}: agent code is ${kb(grown)} gzipped, over the ${kb(COMPONENT_BUDGET)} budget.`)
  }
  console.log(`${slug.padEnd(20)} agent code ${kb(Math.max(grown, 0))}`)
}

const bridge = await gzipped(path.join(src, "agent/agent.tsx"))
console.log(`${"bridge".padEnd(20)} ${kb(bridge)} of ${kb(BRIDGE_BUDGET)}`)
if (bridge > BRIDGE_BUDGET) failures.push(`agent.tsx is ${kb(bridge)} gzipped, over the ${kb(BRIDGE_BUDGET)} budget.`)

if (failures.length) {
  console.error(`\nagent:check failed:\n${failures.map((f) => `  - ${f}`).join("\n")}`)
  process.exit(1)
}
console.log("\nagent:check passed.")
