import fs from 'fs-extra'
import path from 'path'

export type PackageManager = 'bun' | 'pnpm' | 'yarn' | 'npm'

const LOCK_FILE_MAP: Array<{ file: string; manager: PackageManager }> = [
  { file: 'bun.lockb', manager: 'bun' },
  { file: 'bun.lock', manager: 'bun' },
  { file: 'pnpm-lock.yaml', manager: 'pnpm' },
  { file: 'yarn.lock', manager: 'yarn' },
  { file: 'package-lock.json', manager: 'npm' },
]

function fromPackageManagerField(dir: string): PackageManager | null {
  const packageJsonPath = path.join(dir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) return null
  try {
    const value = (JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as { packageManager?: string }).packageManager ?? ''
    for (const pm of ['pnpm', 'yarn', 'bun', 'npm'] as const) if (value.startsWith(`${pm}@`)) return pm
  } catch {
    // ignore
  }
  return null
}

function fromUserAgent(): PackageManager | null {
  const agent = process.env.npm_config_user_agent ?? ''
  for (const pm of ['pnpm', 'yarn', 'bun'] as const) if (agent.startsWith(`${pm}/`)) return pm
  return null
}

/**
 * The nearest lockfile, workspace file or packageManager field wins, walking up from
 * startDir so an app inside a monorepo uses the repo's manager. The invoking agent is the
 * fallback.
 */
export function detectPackageManager(startDir: string = process.cwd()): PackageManager {
  let dir = path.resolve(startDir)
  while (true) {
    for (const entry of LOCK_FILE_MAP) {
      if (fs.existsSync(path.join(dir, entry.file))) return entry.manager
    }
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return 'pnpm'
    const field = fromPackageManagerField(dir)
    if (field) return field
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return fromUserAgent() ?? 'npm'
}

export function getInstallCommand(pm: PackageManager, deps: string[]): string {
  const depsStr = deps.join(' ')

  switch (pm) {
    case 'bun':
      return `bun add ${depsStr}`
    case 'pnpm':
      return `pnpm add ${depsStr}`
    case 'yarn':
      return `yarn add ${depsStr}`
    default:
      return `npm install ${depsStr}`
  }
}

