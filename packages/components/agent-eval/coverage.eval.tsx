import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

// The Orbit app is meant to exercise every component, so a new one fails here until it is used.
const SRC = path.resolve(__dirname, "../src")
const APP = fs.readFileSync(path.join(__dirname, "page-app.tsx"), "utf8")
const SKIP = new Set(["agent", "hooks", "test"])

const components = fs
  .readdirSync(SRC, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !SKIP.has(entry.name))
  .map((entry) => entry.name)
  .sort()

describe("page-app coverage", () => {
  it("finds the components", () => {
    expect(components.length).toBeGreaterThan(40)
  })

  it.each(components)("imports %s", (name) => {
    expect(APP).toMatch(new RegExp(`from "\\.\\./src/${name}"`))
  })
})
