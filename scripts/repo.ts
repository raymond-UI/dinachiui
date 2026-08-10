import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

/**
 * What every check here needs before it can start: where the repo is, where the templates
 * the CLI ships live, and the registry that claims to describe them.
 *
 * The registry is TypeScript inside a package that has not necessarily been built, so it is
 * imported through its source rather than its dist. Reading the built copy would let a check
 * pass against a stale artifact, which is the one thing a release gate must not do.
 */
export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

export const templatesDir = path.join(repoRoot, "packages/cli/templates")

const registrySource = path.join(repoRoot, "packages/cli/src/utils/registry.ts")

export const { getComponentRegistry, getUtilityRegistry } = (await import(
  pathToFileURL(registrySource).href
)) as typeof import("../packages/cli/src/utils/registry.ts")
