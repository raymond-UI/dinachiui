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

export function detectPackageManager(startDir: string = process.cwd()): PackageManager {
  // 1. Check lock files in the project root first (most reliable signal)
  for (const entry of LOCK_FILE_MAP) {
    if (fs.existsSync(path.join(startDir, entry.file))) {
      return entry.manager
    }
  }

  // 2. Check packageManager field in package.json (project root only)
  const packageJsonPath = path.join(startDir, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
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
      // ignore
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

