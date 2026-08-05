import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  getDocumentedPublicComponents,
  publicComponents,
} from "../packages/components/src/component-inventory"
import { getComponentRegistry } from "../packages/cli/src/utils/registry.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")

const componentsSrcDir = path.join(repoRoot, "packages/components/src")
const componentIndexPath = path.join(componentsSrcDir, "index.ts")
const docsContentDir = path.join(repoRoot, "apps/docs/content/components")

const ignoredSourceDirs = new Set(["hooks", "test", "sidebar"])

function readSourceDirectories(): string[] {
  return fs
    .readdirSync(componentsSrcDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignoredSourceDirs.has(entry.name))
    .map((entry) => entry.name)
    .sort()
}

function readPublicExports(): string[] {
  const source = fs.readFileSync(componentIndexPath, "utf8")

  return source
    .split("\n")
    .map((line) => {
      const match = line.match(/export \* from ['"]\.\/([^'"]+)['"]/)
      return match?.[1]
    })
    .filter(
      (slug): slug is string => Boolean(slug) && slug !== "component-inventory"
    )
    .sort()
}

function readDocumentedSlugsFromContent(): string[] {
  return fs
    .readdirSync(docsContentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .sort()
}

function diff(left: string[], right: string[]): string[] {
  const rightSet = new Set(right)
  return left.filter((item) => !rightSet.has(item))
}

function assertNoDiff(label: string, actual: string[], expected: string[]) {
  const missing = diff(expected, actual)
  const unexpected = diff(actual, expected)

  if (missing.length === 0 && unexpected.length === 0) {
    return
  }

  console.error(`\n${label} mismatch:`)

  if (missing.length > 0) {
    console.error(`  Missing: ${missing.join(", ")}`)
  }

  if (unexpected.length > 0) {
    console.error(`  Unexpected: ${unexpected.join(", ")}`)
  }

  process.exitCode = 1
}

const registry = getComponentRegistry()

/**
 * `add --all` and `add --motion` both read the tier off the registry, so a component
 * reaches users through whichever flag its entry claims. Nothing else declares the
 * tier, and the one signal that cannot be forgotten is the dependency: a motion
 * component imports `motion` and a core one does not.
 */
function assertTiersMatchDependencies() {
  const mismatched = Object.entries(registry)
    .filter(([, component]) => !component.integration)
    .flatMap(([name, component]) => {
      const declaresTier = component.tier === "motion"
      const importsMotion = component.dependencies?.includes("motion") ?? false
      if (declaresTier === importsMotion) return []
      return declaresTier
        ? [`  ${name}: tier is 'motion' but the entry does not depend on 'motion'`]
        : [`  ${name}: depends on 'motion' but is not in the motion tier`]
    })

  if (mismatched.length === 0) return

  console.error("\nRegistry tiers do not match their dependencies:")
  console.error(mismatched.join("\n"))
  console.error(
    "\nA motion component left in the core tier arrives with `add --all`, which is\n" +
      "meant to install nothing that pulls in an animation library.\n"
  )
  process.exitCode = 1
}

const inventorySlugs = publicComponents.map((component) => component.slug).sort()
const documentedInventorySlugs = getDocumentedPublicComponents()
  .map((component) => component.slug)
  .sort()

const sourceDirs = readSourceDirectories()
const publicExports = readPublicExports()
const docsContentSlugs = readDocumentedSlugsFromContent()

assertNoDiff("Public inventory vs component source folders", sourceDirs, inventorySlugs)
assertNoDiff("Public inventory vs package exports", publicExports, inventorySlugs)
assertNoDiff(
  "Documented inventory vs docs content",
  docsContentSlugs,
  documentedInventorySlugs
)

// Integrations are registry entries without a component of their own, so the registry
// is allowed to hold more than the inventory does — but never less, or `dinachi add`
// cannot install something the package exports.
const missingFromRegistry = diff(inventorySlugs, Object.keys(registry))
if (missingFromRegistry.length > 0) {
  console.error("\nPublic components missing from the CLI registry:")
  console.error(`  ${missingFromRegistry.join(", ")}`)
  process.exitCode = 1
}

assertTiersMatchDependencies()

if (process.exitCode !== 1) {
  const motionTier = Object.values(registry).filter(
    (component) => component.tier === "motion"
  ).length

  console.log(
    [
      "Component inventory is in sync.",
      `Public components: ${inventorySlugs.length}`,
      `Documented components: ${documentedInventorySlugs.length}`,
      `Registry: ${Object.keys(registry).length} entries, ${motionTier} in the motion tier`,
      "Excluded source dirs: hooks, test, sidebar",
    ].join("\n")
  )
}
