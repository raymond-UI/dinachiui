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

function walkUpDirectories(startDir: string): string[] {
  const dirs: string[] = []
  let current = path.resolve(startDir)

  while (true) {
    dirs.push(current)
    const parent = path.dirname(current)
    if (parent === current) {
      break
    }
    current = parent
  }

  return dirs
}

function detectManagerFromPackageJson(startDir: string): PackageManager | null {
  for (const dir of walkUpDirectories(startDir)) {
    const packageJsonPath = path.join(dir, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      continue
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
        packageManager?: string
      }
      const value = packageJson.packageManager ?? ''

      if (value.startsWith('pnpm@')) return 'pnpm'
      if (value.startsWith('yarn@')) return 'yarn'
      if (value.startsWith('bun@')) return 'bun'
      if (value.startsWith('npm@')) return 'npm'
    } catch {
      continue
    }
  }

  return null
}

export function detectPackageManager(startDir: string = process.cwd()): PackageManager {
  const packageJsonManager = detectManagerFromPackageJson(startDir)
  if (packageJsonManager) {
    return packageJsonManager
  }

  for (const dir of walkUpDirectories(startDir)) {
    for (const entry of LOCK_FILE_MAP) {
      if (fs.existsSync(path.join(dir, entry.file))) {
        return entry.manager
      }
    }
  }

  return 'npm'
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

