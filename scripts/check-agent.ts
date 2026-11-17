import fs from "node:fs"
import path from "node:path"
import { gzipSync } from "node:zlib"
import { build } from "esbuild"

import { publicComponents } from "../packages/components/src/component-inventory.ts"
import { getComponentRegistry, repoRoot } from "./repo.ts"

/**
 * Holds every component that registers with the agent bridge to the same bar: it
 * registers, it installs the bridge alongside it, it runs the conformance suite, and
 * neither it nor the bridge grows past its budget.
 */

const BRIDGE_BUDGET = 9 * 1024
const COMPONENT_BUDGET = 1.5 * 1024

/**
 * Gzipped size of each component before it registered with the bridge, measured the same
 * way as below, plus the data-slot attributes every part gained since. A component's agent
 * code is what it has grown by beyond that.
 */
const BEFORE: Record<string, number> = {
  accordion: 705,
  "alert-dialog": 1118,
  "animated-tabs": 1212,
  autocomplete: 1295,
  carousel: 2312,
  checkbox: 452,
  "checkbox-group": 238,
  collapsible: 585,
  combobox: 1416,
  "compare-slider": 1864,
  "context-menu": 1318,
  dialog: 1053,
  drawer: 1044,
  "expandable-card": 2265,
  "hold-to-confirm": 2471,
  input: 494,
  menu: 1868,
  menubar: 1437,
  "navigation-menu": 1852,
  "number-field": 723,
  "otp-field": 580,
  popover: 1514,
  "preview-card": 1364,
  radio: 541,
  select: 1562,
  slider: 776,
  sortable: 1773,
  "swipeable-row": 1661,
  switch: 606,
  tabs: 738,
  textarea: 342,
  toggle: 625,
  "toggle-group": 634,
}

const src = path.join(repoRoot, "packages/components/src")
const registry = getComponentRegistry()
const failures: string[] = []

async function gzipped(file: string): Promise<number> {
  const result = await build({
    entryPoints: [file],
    bundle: true,
    write: false,
    minify: true,
    format: "esm",
    jsx: "automatic",
    packages: "external",
    external: ["../agent"],
    logLevel: "silent",
  })
  return gzipSync(result.outputFiles[0].contents).length
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`

const marked = new Set(publicComponents.filter((c) => c.agent).map((c) => c.slug))

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

  const before = BEFORE[slug]
  if (before === undefined) {
    failures.push(`${slug}: no size before the bridge in BEFORE, so its agent code cannot be measured.`)
    continue
  }
  const grown = (await gzipped(file)) - before
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
