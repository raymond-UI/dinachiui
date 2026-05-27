import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  getDocumentedPublicComponents,
  publicComponents,
} from "../packages/components/src/component-inventory"

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

if (process.exitCode !== 1) {
  console.log(
    [
      "Component inventory is in sync.",
      `Public components: ${inventorySlugs.length}`,
      `Documented components: ${documentedInventorySlugs.length}`,
      "Excluded source dirs: hooks, test, sidebar",
    ].join("\n")
  )
}
