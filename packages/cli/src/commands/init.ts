import { Command } from 'commander'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'
import ora from 'ora'
import { detectPackageManager, getInstallCommand } from '../utils/package-manager.js'
import { toInstallSpec } from '../utils/dependencies.js'
import { parseJsonWithComments } from '../utils/json.js'

interface ProjectConfig {
  framework: string
  componentsPath: string
  utilsPath: string
  tailwindConfig: string
  cssPath: string
  srcDir: string
  isTypeScript: boolean
}

interface AliasConfigUpdate {
  path: string
  created?: boolean
  updated?: boolean
  skipped?: boolean
}

function normalizeProjectPath(inputPath: string, projectRoot: string): string {
  const absolutePath = path.isAbsolute(inputPath)
    ? path.normalize(inputPath)
    : path.resolve(projectRoot, inputPath)

  const relativePath = path.relative(projectRoot, absolutePath).replace(/\\/g, '/')
  const withoutPrefix = relativePath.replace(/^\.\//, '').replace(/\/$/, '')
  return withoutPrefix.length > 0 ? withoutPrefix : '.'
}

function toConfigPath(relativePath: string): string {
  return relativePath === '.' ? '.' : `./${relativePath.replace(/\\/g, '/')}`
}

function createUtilsFileContent(): string {
  return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
}

function readJsonConfig<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return parseJsonWithComments<T>(content)
  } catch {
    return null
  }
}

async function ensureAtAlias(projectRoot: string, srcDir: string, isTypeScript: boolean): Promise<AliasConfigUpdate> {
  const tsConfigPath = path.join(projectRoot, 'tsconfig.json')
  const jsConfigPath = path.join(projectRoot, 'jsconfig.json')

  const configPath = fs.existsSync(tsConfigPath)
    ? tsConfigPath
    : fs.existsSync(jsConfigPath)
      ? jsConfigPath
      : path.join(projectRoot, isTypeScript ? 'tsconfig.json' : 'jsconfig.json')
  const existedBefore = fs.existsSync(configPath)

  const parsedConfig = readJsonConfig<{
    compilerOptions?: {
      baseUrl?: unknown
      paths?: Record<string, unknown>
    }
  }>(configPath)

  if (existedBefore && !parsedConfig) {
    return { path: configPath, skipped: true }
  }

  const parsed = parsedConfig ?? {}

  const compilerOptions = parsed.compilerOptions ?? {}
  const rawPaths = compilerOptions.paths ?? {}
  const paths: Record<string, string[]> = {}

  for (const [key, value] of Object.entries(rawPaths)) {
    if (!Array.isArray(value)) {
      continue
    }
    const targets = value.filter((entry): entry is string => typeof entry === 'string')
    if (targets.length > 0) {
      paths[key] = targets
    }
  }

  const aliasTarget = srcDir === '.' ? '*' : `${srcDir}/*`
  const alreadyConfigured =
    compilerOptions.baseUrl === '.' &&
    Array.isArray(paths['@/*']) &&
    paths['@/*'][0] === aliasTarget

  if (alreadyConfigured) {
    return { path: configPath }
  }

  const nextConfig = {
    ...parsed,
    compilerOptions: {
      ...compilerOptions,
      baseUrl: '.',
      paths: {
        ...paths,
        '@/*': [aliasTarget],
      },
    },
  }

  try {
    await fs.writeFile(configPath, `${JSON.stringify(nextConfig, null, 2)}\n`)
    return { path: configPath, [existedBefore ? 'updated' : 'created']: true }
  } catch {
    return { path: configPath, skipped: true }
  }
}

export const initCommand = new Command('init')
  .description('Initialize Dinachi UI in your project')
  .option('--skip-install', 'Skip package installation')
  .action(async (options: { skipInstall?: boolean }) => {
    console.log(chalk.bold.cyan('🎨 Welcome to Dinachi UI!'))
    console.log()

    const projectRoot = process.cwd()
    const packageJsonPath = path.join(projectRoot, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      console.log(chalk.red('❌ No package.json found. Please run this command in a valid project.'))
      process.exit(1)
    }

    const projectConfig = detectProjectType()

    console.log(chalk.gray(`Detected ${projectConfig.framework} project`))
    console.log()

    const response = await prompts([
      {
        type: 'text',
        name: 'componentsPath',
        message: 'Where would you like to install components?',
        initial: projectConfig.componentsPath,
      },
      {
        type: 'text',
        name: 'utilsPath',
        message: 'Where would you like to install utilities?',
        initial: projectConfig.utilsPath,
      },
    ])

    if (!response.componentsPath || !response.utilsPath) {
      console.log(chalk.red('❌ Setup cancelled.'))
      process.exit(1)
    }

    const spinner = ora('Setting up Dinachi UI...').start()

    try {
      const normalizedComponentsPath = normalizeProjectPath(response.componentsPath, projectRoot)
      const normalizedUtilsPath = normalizeProjectPath(response.utilsPath, projectRoot)

      const componentsDirPath = path.resolve(projectRoot, normalizedComponentsPath)
      const utilsDirPath = path.resolve(projectRoot, normalizedUtilsPath)
      const utilsFilePath = path.join(utilsDirPath, 'utils.ts')

      await fs.ensureDir(componentsDirPath)
      await fs.ensureDir(utilsDirPath)

      const utilsContent = createUtilsFileContent()
      await fs.writeFile(utilsFilePath, utilsContent)

      spinner.text = 'Installing dependencies...'
      const deps = ['class-variance-authority', 'clsx', 'tailwind-merge']
      if (!options.skipInstall) {
        const packageManager = detectPackageManager(projectRoot)
        const installCmd = getInstallCommand(packageManager, deps.map(toInstallSpec))
        execSync(installCmd, { stdio: 'inherit', cwd: projectRoot })
      }

      const hooksPath =
        projectConfig.srcDir === '.'
          ? 'hooks'
          : path.join(projectConfig.srcDir, 'hooks').replace(/\\/g, '/')

      const configContent = JSON.stringify(
        {
          style: 'default',
          rsc: projectConfig.framework === 'next.js',
          tsx: true,
          tailwind: {
            config: projectConfig.tailwindConfig,
            css: projectConfig.cssPath,
            baseColor: 'slate',
            cssVariables: true,
          },
          aliases: {
            components: toConfigPath(path.dirname(normalizedComponentsPath)),
            utils: toConfigPath(path.join(normalizedUtilsPath, 'utils')),
            ui: toConfigPath(normalizedComponentsPath),
            lib: toConfigPath(normalizedUtilsPath),
            hooks: toConfigPath(hooksPath),
          },
          iconLibrary: 'lucide',
        },
        null,
        2
      )

      await fs.writeFile(path.join(projectRoot, 'components.json'), `${configContent}\n`)

      const aliasConfigUpdate = await ensureAtAlias(projectRoot, projectConfig.srcDir, projectConfig.isTypeScript)

      spinner.succeed('✅ Dinachi UI setup complete!')

      console.log()
      console.log('Next steps:')
      console.log(`  1. Add a component: ${chalk.cyan('npx @dinachi/cli add button')}`)
      console.log(`  2. Components will be installed to: ${chalk.cyan(componentsDirPath)}`)
      console.log(`  3. Utils available at: ${chalk.cyan(utilsFilePath)}`)

      console.log()
      if (aliasConfigUpdate.created) {
        console.log(`  ${chalk.green('+')} Added @/* path alias in ${aliasConfigUpdate.path}`)
      } else if (aliasConfigUpdate.updated) {
        console.log(`  ${chalk.blue('~')} Updated @/* path alias in ${aliasConfigUpdate.path}`)
      } else if (aliasConfigUpdate.skipped) {
        console.log(
          `  ${chalk.yellow('!')} Could not update ${aliasConfigUpdate.path}. Configure @/* manually if you use alias imports.`
        )
      }

      if (!projectConfig.isTypeScript) {
        console.log()
        console.log(
          chalk.yellow(
            '⚠️  Dinachi components are TypeScript-first. Your project can still consume TSX files, but type-check tooling is recommended.'
          )
        )
      }

      if (projectConfig.framework === 'next.js') {
        console.log()
        console.log(chalk.blue('📝 Next.js specific notes:'))
        console.log('  - RSC (React Server Components) enabled in config')
        console.log('  - Add "use client" for interactive components where needed')
        console.log(`  - Tailwind config: ${chalk.cyan(projectConfig.tailwindConfig)}`)
      } else if (projectConfig.framework === 'remix') {
        console.log()
        console.log(chalk.blue('📝 Remix specific notes:'))
        console.log(`  - Components directory: ${chalk.cyan(componentsDirPath)}`)
        console.log(`  - Utilities directory: ${chalk.cyan(utilsDirPath)}`)
      }

      if (options.skipInstall) {
        console.log()
        console.log('Dependencies to install manually:')
        deps.forEach(dep => {
          console.log(`  ${chalk.yellow('•')} ${toInstallSpec(dep)}`)
        })
      }

      console.log()
      console.log('💡 Tip: Install globally for shorter commands:')
      console.log(`  ${chalk.cyan('npm install -g @dinachi/cli')}`)
      console.log(`  Then use: ${chalk.cyan('dinachi add button')}`)
    } catch (error) {
      spinner.fail(`❌ Setup failed: ${(error as Error).message}`)
      process.exit(1)
    }
  })

function detectProjectType(): ProjectConfig {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return getDefaultConfig('react', false)
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  const deps = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }

  const hasSrcDir = fs.existsSync(path.join(process.cwd(), 'src'))
  const hasAppDir = fs.existsSync(path.join(process.cwd(), 'app'))
  const hasSrcAppDir = fs.existsSync(path.join(process.cwd(), 'src', 'app'))
  const isTypeScript =
    fs.existsSync(path.join(process.cwd(), 'tsconfig.json')) ||
    fs.existsSync(path.join(process.cwd(), 'tsconfig.base.json')) ||
    Boolean(deps.typescript)

  const tailwindConfig = detectTailwindConfig()
  const cssPath = detectCssPath(hasSrcDir, hasSrcAppDir)

  if (deps.next) {
    if (hasSrcDir && hasSrcAppDir) {
      return {
        framework: 'next.js',
        componentsPath: './src/components/ui',
        utilsPath: './src/lib',
        tailwindConfig,
        cssPath,
        srcDir: 'src',
        isTypeScript,
      }
    }
    if (hasAppDir && !hasSrcDir) {
      return {
        framework: 'next.js',
        componentsPath: './components/ui',
        utilsPath: './lib',
        tailwindConfig,
        cssPath,
        srcDir: '.',
        isTypeScript,
      }
    }
    return {
      framework: 'next.js',
      componentsPath: hasSrcDir ? './src/components/ui' : './components/ui',
      utilsPath: hasSrcDir ? './src/lib' : './lib',
      tailwindConfig,
      cssPath,
      srcDir: hasSrcDir ? 'src' : '.',
      isTypeScript,
    }
  }

  if (deps.vite || deps['@vitejs/plugin-react']) {
    return {
      framework: 'vite',
      componentsPath: hasSrcDir ? './src/components/ui' : './components/ui',
      utilsPath: hasSrcDir ? './src/lib' : './lib',
      tailwindConfig,
      cssPath,
      srcDir: hasSrcDir ? 'src' : '.',
      isTypeScript,
    }
  }

  if (deps['react-scripts']) {
    return {
      framework: 'create-react-app',
      componentsPath: './src/components/ui',
      utilsPath: './src/lib',
      tailwindConfig,
      cssPath,
      srcDir: 'src',
      isTypeScript,
    }
  }

  if (deps['@remix-run/react']) {
    return {
      framework: 'remix',
      componentsPath: './app/components/ui',
      utilsPath: './app/lib',
      tailwindConfig,
      cssPath: detectCssPath(false, false, true),
      srcDir: 'app',
      isTypeScript,
    }
  }

  return getDefaultConfig('react', hasSrcDir)
}

function getDefaultConfig(framework: string, hasSrcDir: boolean): ProjectConfig {
  const isTypeScript =
    fs.existsSync(path.join(process.cwd(), 'tsconfig.json')) ||
    fs.existsSync(path.join(process.cwd(), 'tsconfig.base.json'))

  return {
    framework,
    componentsPath: hasSrcDir ? './src/components/ui' : './components/ui',
    utilsPath: hasSrcDir ? './src/lib' : './lib',
    tailwindConfig: detectTailwindConfig(),
    cssPath: hasSrcDir ? 'src/index.css' : 'index.css',
    srcDir: hasSrcDir ? 'src' : '.',
    isTypeScript,
  }
}

function detectTailwindConfig(): string {
  const configCandidates = [
    'tailwind.config.ts',
    'tailwind.config.js',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
    'tailwind.config.cts',
    'tailwind.config.mts',
  ]

  for (const config of configCandidates) {
    if (fs.existsSync(path.join(process.cwd(), config))) {
      return config
    }
  }

  return 'tailwind.config.js'
}

function detectCssPath(hasSrcDir: boolean, hasSrcAppDir: boolean, isRemix: boolean = false): string {
  const cwd = process.cwd()
  const possiblePaths = [
    'app/globals.css',
    'src/app/globals.css',
    'styles/globals.css',
    'src/styles/globals.css',
    'src/index.css',
    'index.css',
    'app/tailwind.css',
    'app/styles/tailwind.css',
  ]

  for (const cssPath of possiblePaths) {
    if (fs.existsSync(path.join(cwd, cssPath))) {
      return cssPath
    }
  }

  if (isRemix) return 'app/tailwind.css'
  if (hasSrcAppDir) return 'src/app/globals.css'
  if (hasSrcDir) return 'src/index.css'
  return 'index.css'
}
