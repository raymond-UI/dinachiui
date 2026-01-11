import { Command } from 'commander'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'
import ora from 'ora'

export const initCommand = new Command('init')
  .description('Initialize Dinachi UI in your project')
  .action(async () => {
    console.log(chalk.bold.cyan('🎨 Welcome to Dinachi UI!'))
    console.log()

    // Check if this is a valid project
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      console.log(chalk.red('❌ No package.json found. Please run this command in a valid project.'))
      process.exit(1)
    }

    // Detect project type and get appropriate defaults
    const projectConfig = detectProjectType()
    
    console.log(chalk.gray(`Detected ${projectConfig.framework} project`))
    console.log()

    const response = await prompts([
      {
        type: 'text',
        name: 'componentsPath',
        message: 'Where would you like to install components?',
        initial: projectConfig.componentsPath
      },
      {
        type: 'text',
        name: 'utilsPath',
        message: 'Where would you like to install utilities?',
        initial: projectConfig.utilsPath
      }
    ])

    if (!response.componentsPath || !response.utilsPath) {
      console.log(chalk.red('❌ Setup cancelled.'))
      process.exit(1)
    }

    const spinner = ora('Setting up Dinachi UI...').start()

    try {
      // Normalize paths - remove leading ./ if present
      const normalizedComponentsPath = normalizePath(response.componentsPath)
      const normalizedUtilsPath = normalizePath(response.utilsPath)
      
      // Create directories
      await fs.ensureDir(normalizedComponentsPath)
      await fs.ensureDir(normalizedUtilsPath)

      // Create utils file
      const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
      await fs.writeFile(path.join(normalizedUtilsPath, 'utils.ts'), utilsContent)

      // Install dependencies
      spinner.text = 'Installing dependencies...'
      
      const deps = [
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ]

      const packageManager = getPackageManager()
      const installCmd = getInstallCommand(packageManager, deps)
      
      execSync(installCmd, { stdio: 'inherit' })

      // Convert paths to alias format for components.json
      const componentsAlias = pathToAlias(normalizedComponentsPath)
      const libAlias = pathToAlias(normalizedUtilsPath)
      const uiAlias = componentsAlias // Components path is the UI path
      
      // Get parent of utils path for lib alias (e.g., ./lib from ./lib/utils)
      const libParentAlias = pathToAlias(path.dirname(normalizedUtilsPath) === '.' ? normalizedUtilsPath : normalizedUtilsPath)

      // Create config file with user-specified paths
      const rscEnabled = projectConfig.framework === 'next.js'
      const configContent = JSON.stringify({
        style: "default",
        rsc: rscEnabled,
        tsx: true,
        tailwind: {
          config: projectConfig.tailwindConfig,
          css: projectConfig.cssPath,
          baseColor: "slate",
          cssVariables: true
        },
        aliases: {
          components: pathToAlias(path.dirname(normalizedComponentsPath)),
          utils: `${libAlias}/utils`,
          ui: uiAlias,
          lib: libAlias,
          hooks: `${pathToAlias(projectConfig.srcDir)}/hooks`
        },
        iconLibrary: "lucide"
      }, null, 2)

      await fs.writeFile('components.json', configContent)

      spinner.succeed('✅ Dinachi UI setup complete!')
      
      console.log()
      console.log('Next steps:')
      console.log(`  1. Add a component: ${chalk.cyan('npx @dinachi/cli add button')}`)
      console.log(`  2. Components will be installed to: ${chalk.cyan(normalizedComponentsPath)}`)
      console.log(`  3. Utils available at: ${chalk.cyan(path.join(normalizedUtilsPath, 'utils.ts'))}`)
      
      // Framework-specific guidance
      if (projectConfig.framework === 'next.js') {
        console.log()
        console.log(chalk.blue('📝 Next.js specific notes:'))
        console.log(`  - RSC (React Server Components) enabled in config`)
        console.log(`  - Make sure to add "use client" directive if needed`)
        console.log(`  - Tailwind config: ${chalk.cyan(projectConfig.tailwindConfig)}`)
      } else if (projectConfig.framework === 'remix') {
        console.log()
        console.log(chalk.blue('📝 Remix specific notes:'))
        console.log(`  - Components will be installed to: ${chalk.cyan(normalizedComponentsPath)}`)
        console.log(`  - Utils will be installed to: ${chalk.cyan(normalizedUtilsPath)}`)
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

/**
 * Normalize path - remove leading ./ and ensure consistent format
 */
function normalizePath(inputPath: string): string {
  return inputPath.replace(/^\.\//, '').replace(/\/$/, '')
}

/**
 * Convert a file path to @/ alias format
 */
function pathToAlias(filePath: string): string {
  const normalized = normalizePath(filePath)
  return `@/${normalized}`
}

/**
 * Detect package manager based on lock files
 */
function getPackageManager(): 'bun' | 'pnpm' | 'yarn' | 'npm' {
  if (fs.existsSync('bun.lockb') || fs.existsSync('bun.lock')) return 'bun'
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
  if (fs.existsSync('yarn.lock')) return 'yarn'
  return 'npm'
}

/**
 * Get install command for package manager
 */
function getInstallCommand(pm: string, deps: string[]): string {
  const depsStr = deps.join(' ')
  switch (pm) {
    case 'bun': return `bun add ${depsStr}`
    case 'pnpm': return `pnpm add ${depsStr}`
    case 'yarn': return `yarn add ${depsStr}`
    default: return `npm install ${depsStr}`
  }
}

interface ProjectConfig {
  framework: string
  componentsPath: string
  utilsPath: string
  tailwindConfig: string
  cssPath: string
  srcDir: string
}

/**
 * Detect project type and structure accurately
 */
function detectProjectType(): ProjectConfig {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    return getDefaultConfig('react', false)
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

  // Detect actual project structure
  const hasSrcDir = fs.existsSync(path.join(process.cwd(), 'src'))
  const hasAppDir = fs.existsSync(path.join(process.cwd(), 'app'))
  const hasSrcAppDir = fs.existsSync(path.join(process.cwd(), 'src', 'app'))
  
  // Detect tailwind config
  const tailwindConfig = detectTailwindConfig()
  
  // Detect CSS file
  const cssPath = detectCssPath(hasSrcDir, hasSrcAppDir)

  // Next.js detection
  if (deps.next) {
    // Next.js with src/ directory
    if (hasSrcDir && hasSrcAppDir) {
      return {
        framework: 'next.js',
        componentsPath: './src/components/ui',
        utilsPath: './src/lib',
        tailwindConfig,
        cssPath,
        srcDir: 'src'
      }
    }
    // Next.js without src/ (app/ at root)
    if (hasAppDir && !hasSrcDir) {
      return {
        framework: 'next.js',
        componentsPath: './components/ui',
        utilsPath: './lib',
        tailwindConfig,
        cssPath,
        srcDir: '.'
      }
    }
    // Default Next.js
    return {
      framework: 'next.js',
      componentsPath: hasSrcDir ? './src/components/ui' : './components/ui',
      utilsPath: hasSrcDir ? './src/lib' : './lib',
      tailwindConfig,
      cssPath,
      srcDir: hasSrcDir ? 'src' : '.'
    }
  }

  // Vite detection
  if (deps.vite || deps['@vitejs/plugin-react']) {
    return {
      framework: 'vite',
      componentsPath: hasSrcDir ? './src/components/ui' : './components/ui',
      utilsPath: hasSrcDir ? './src/lib' : './lib',
      tailwindConfig,
      cssPath,
      srcDir: hasSrcDir ? 'src' : '.'
    }
  }

  // Create React App detection
  if (deps['react-scripts']) {
    return {
      framework: 'create-react-app',
      componentsPath: './src/components/ui',
      utilsPath: './src/lib',
      tailwindConfig,
      cssPath,
      srcDir: 'src'
    }
  }

  // Remix detection
  if (deps['@remix-run/react']) {
    return {
      framework: 'remix',
      componentsPath: './app/components/ui',
      utilsPath: './app/lib',
      tailwindConfig,
      cssPath: detectCssPath(false, false, true),
      srcDir: 'app'
    }
  }

  return getDefaultConfig('react', hasSrcDir)
}

function getDefaultConfig(framework: string, hasSrcDir: boolean): ProjectConfig {
  return {
    framework,
    componentsPath: hasSrcDir ? './src/components/ui' : './components/ui',
    utilsPath: hasSrcDir ? './src/lib' : './lib',
    tailwindConfig: detectTailwindConfig(),
    cssPath: hasSrcDir ? 'src/index.css' : 'index.css',
    srcDir: hasSrcDir ? 'src' : '.'
  }
}

/**
 * Detect actual tailwind config file
 */
function detectTailwindConfig(): string {
  if (fs.existsSync(path.join(process.cwd(), 'tailwind.config.ts'))) {
    return 'tailwind.config.ts'
  }
  if (fs.existsSync(path.join(process.cwd(), 'tailwind.config.js'))) {
    return 'tailwind.config.js'
  }
  if (fs.existsSync(path.join(process.cwd(), 'tailwind.config.mjs'))) {
    return 'tailwind.config.mjs'
  }
  // Default to .js if none found
  return 'tailwind.config.js'
}

/**
 * Detect actual CSS file path
 */
function detectCssPath(hasSrcDir: boolean, hasSrcAppDir: boolean, isRemix: boolean = false): string {
  const cwd = process.cwd()
  
  // Common CSS file locations to check
  const possiblePaths = [
    // Next.js App Router
    'app/globals.css',
    'src/app/globals.css',
    // Next.js Pages / General
    'styles/globals.css',
    'src/styles/globals.css',
    // Vite / CRA
    'src/index.css',
    'index.css',
    // Remix
    'app/tailwind.css',
    'app/styles/tailwind.css',
  ]
  
  for (const cssPath of possiblePaths) {
    if (fs.existsSync(path.join(cwd, cssPath))) {
      return cssPath
    }
  }
  
  // Fallback based on detected structure
  if (isRemix) return 'app/tailwind.css'
  if (hasSrcAppDir) return 'src/app/globals.css'
  if (hasSrcDir) return 'src/index.css'
  return 'app/globals.css'
}
