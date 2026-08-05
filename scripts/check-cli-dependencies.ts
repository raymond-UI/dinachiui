import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, "..")

const dependencyMapPath = path.join(
  repoRoot,
  "packages/cli/src/utils/dependencies.ts"
)

const registryPath = path.join(repoRoot, "packages/cli/src/utils/registry.ts")

/**
 * The packages that build and test the components. Their versions are what CI
 * actually exercises, so they are the floor the CLI has to admit.
 */
const workspaceManifests = [
  "packages/components/package.json",
  "packages/core/package.json",
  "apps/docs/package.json",
  // The CLI declares the templates' own imports as devDependencies so that
  // `type-check:templates` can resolve them. That makes this manifest the closest
  // statement of what the shipped files are known to compile against.
  "packages/cli/package.json",
]

interface Floor {
  range: string
  /** The range's floor as one sortable number, so comparing is `>`. */
  version: number
  from: string
}

/** `^1.7.0` → a sortable number. A range carrying no version has no floor to compare. */
function floorOf(range: string): number | undefined {
  const match = range.match(/(\d+)\.(\d+)\.(\d+)/)
  if (!match) return undefined
  return Number(match[1]) * 1e12 + Number(match[2]) * 1e6 + Number(match[3])
}

function dependenciesOf(manifest: string): [string, string][] {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(repoRoot, manifest), "utf8")
  ) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }

  return Object.entries({
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
  })
}

/**
 * Both files are imported rather than read as text. A regex over the source has to guess
 * at formatting — the previous one needed a trailing comma on every pin and could not see
 * an array written across more than one line, so it quietly under-reported both.
 */
async function readCliVersionMap(): Promise<Map<string, string>> {
  const { DEPENDENCY_VERSION_MAP } = (await import(
    pathToFileURL(dependencyMapPath).href
  )) as typeof import("../packages/cli/src/utils/dependencies.ts")

  return new Map(Object.entries(DEPENDENCY_VERSION_MAP))
}

/** Every npm package the registry hands to `dinachi add`, across all components. */
async function readRegistryDependencies(): Promise<Set<string>> {
  const { getComponentRegistry, getUtilityRegistry } = (await import(
    pathToFileURL(registryPath).href
  )) as typeof import("../packages/cli/src/utils/registry.ts")

  return new Set([
    ...Object.values(getComponentRegistry()).flatMap((component) => [
      ...(component.dependencies ?? []),
      ...(component.devDependencies ?? []),
    ]),
    // `add` writes the utility files too, and installs what they import.
    ...Object.values(getUtilityRegistry()).flatMap(
      (utility) => utility.dependencies ?? []
    ),
  ])
}

/**
 * The highest floor any building package declares. `packages/core` is published, so it
 * floors its own dependencies loosely on purpose; taking the maximum reads the version
 * we build against rather than the oldest one some manifest tolerates.
 */
/** Whichever of the two floors is higher, keeping the one already held on a tie. */
function higherFloor(
  range: string,
  manifest: string,
  held: Floor | undefined
): Floor | undefined {
  const version = floorOf(range)
  if (version === undefined) return held
  if (held !== undefined && held.version >= version) return held
  return { range, version, from: manifest }
}

function readWorkspaceFloors(): Map<string, Floor> {
  const floors = new Map<string, Floor>()

  for (const manifest of workspaceManifests) {
    for (const [name, range] of dependenciesOf(manifest)) {
      const winner = higherFloor(range, manifest, floors.get(name))
      if (winner) floors.set(name, winner)
    }
  }

  return floors
}

const cliVersions = await readCliVersionMap()
const workspaceFloors = readWorkspaceFloors()

if (cliVersions.size === 0) {
  console.error(
    `${path.relative(repoRoot, dependencyMapPath)} exports an empty map.`
  )
  process.exit(1)
}

/**
 * A dependency the registry names but the map omits is worse than a stale pin:
 * `toInstallSpec` falls back to the bare name, so the user gets whatever `latest`
 * is that day, which can be a major ahead of anything here builds against.
 */
const unpinned = [...(await readRegistryDependencies())].filter(
  (name) => !cliVersions.has(name)
)

if (unpinned.length > 0) {
  console.error("\nThe registry installs packages the CLI does not pin:\n")
  console.error(unpinned.map((name) => `  ${name}`).join("\n"))
  console.error(
    [
      "",
      "An unpinned dependency installs `latest` into the user's project.",
      `Add it to ${path.relative(repoRoot, dependencyMapPath)}.`,
      "",
    ].join("\n")
  )
  process.exit(1)
}

const drifted: string[] = []

for (const [name, cliRange] of cliVersions) {
  const workspace = workspaceFloors.get(name)
  // Nothing in the workspace to compare against, so there is no drift to detect.
  if (!workspace) continue

  const cliFloor = floorOf(cliRange)
  if (cliFloor === undefined || cliFloor >= workspace.version) continue

  drifted.push(
    `  ${name}: CLI installs ${cliRange}, but ${workspace.from} builds against ${workspace.range}`
  )
}

if (drifted.length > 0) {
  console.error("\nCLI dependency versions have drifted below the workspace:\n")
  console.error(drifted.join("\n"))
  console.error(
    [
      "",
      "DEPENDENCY_VERSION_MAP is what `dinachi add` installs into user projects.",
      "A floor below the workspace ships users a version nothing here tests.",
      `Raise it in ${path.relative(repoRoot, dependencyMapPath)}.`,
      "",
    ].join("\n")
  )
  process.exit(1)
}

const compared = [...cliVersions.keys()].filter((name) =>
  workspaceFloors.has(name)
)

console.log(
  [
    "CLI dependency versions are in sync with the workspace.",
    `Compared: ${compared.length}`,
    `Not built here, so not compared: ${
      [...cliVersions.keys()].filter((name) => !workspaceFloors.has(name)).join(", ") ||
      "none"
    }`,
  ].join("\n")
)
