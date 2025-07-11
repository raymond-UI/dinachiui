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
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install required dependencies?',
        initial: true
      }
    ])

    if (!response.componentsPath || !response.utilsPath) {
      console.log(chalk.red('❌ Setup cancelled.'))
      process.exit(1)
    }

    const spinner = ora('Setting up Dinachi UI...').start()

    try {
      // Create directories
      await fs.ensureDir(path.dirname(response.componentsPath))
      await fs.ensureDir(response.utilsPath)

      // Create utils file
      const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
      await fs.writeFile(path.join(response.utilsPath, 'utils.ts'), utilsContent)

      // Install dependencies if requested
      if (response.installDeps) {
        spinner.text = 'Installing dependencies...'
        
        const deps = [
          'class-variance-authority',
          'clsx',
          'tailwind-merge'
        ]

        const packageManager = getPackageManager()
        const installCmd = `${packageManager} ${packageManager === 'npm' ? 'install' : 'add'} ${deps.join(' ')}`
        
        execSync(installCmd, { stdio: 'inherit' })
      }

      // Create config file with framework-specific settings
      const rscEnabled = projectConfig.framework === 'next.js'
      const configContent = `{
  "style": "default",
  "rsc": ${rscEnabled},
  "tsx": true,
  "tailwind": {
    "config": "${projectConfig.tailwindConfig}",
    "css": "${projectConfig.cssPath}",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}`

      await fs.writeFile('components.json', configContent)

      spinner.succeed('✅ Dinachi UI setup complete!')
      
      console.log()
      console.log('Next steps:')
      console.log(`  1. Add a component: ${chalk.cyan('npx @dinachi/cli add button')}`)
      console.log(`  2. Components will be installed to: ${chalk.cyan('@/components/ui')}`)
      console.log(`  3. Utils available at: ${chalk.cyan('@/lib/utils')}`)
      
      // Framework-specific guidance
      if (projectConfig.framework === 'next.js') {
        console.log()
        console.log(chalk.blue('📝 Next.js specific notes:'))
        console.log(`  - RSC (React Server Components) enabled in config`)
        console.log(`  - Make sure to add "use client" directive if needed`)
        console.log(`  - Tailwind config set to: ${chalk.cyan(projectConfig.tailwindConfig)}`)
      } else if (projectConfig.framework === 'remix') {
        console.log()
        console.log(chalk.blue('📝 Remix specific notes:'))
        console.log(`  - Components will be installed to: ${chalk.cyan(projectConfig.componentsPath)}`)
        console.log(`  - Utils will be installed to: ${chalk.cyan(projectConfig.utilsPath)}`)
      }
      
      console.log()
      console.log('💡 Tip: Install globally for shorter commands:')
      console.log(`  ${chalk.cyan('npm install -g @dinachi/cli')}`)
      console.log(`  Then use: ${chalk.cyan('dinachi add button')}`)

    } catch (error) {
      spinner.fail(`❌ Setup failed: ${error.message}`)
      process.exit(1)
    }
  })

function getPackageManager(): string {
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
  if (fs.existsSync('yarn.lock')) return 'yarn'
  return 'npm'
}

interface ProjectConfig {
  framework: string
  componentsPath: string
  utilsPath: string
  tailwindConfig: string
  cssPath: string
  srcDir: string
}

function detectProjectType(): ProjectConfig {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    // Default fallback
    return {
      framework: 'react',
      componentsPath: './src/components/ui',
      utilsPath: './src/lib',
      tailwindConfig: 'tailwind.config.js',
      cssPath: 'src/index.css',
      srcDir: 'src'
    }
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }

  // Next.js detection
  if (deps.next) {
    return {
      framework: 'next.js',
      componentsPath: './src/components/ui',
      utilsPath: './src/lib',
      tailwindConfig: 'tailwind.config.ts',
      cssPath: 'src/app/globals.css',
      srcDir: 'src'
    }
  }

  // Vite detection
  if (deps.vite || deps['@vitejs/plugin-react']) {
    return {
      framework: 'vite',
      componentsPath: './src/components/ui',
      utilsPath: './src/lib',
      tailwindConfig: 'tailwind.config.js',
      cssPath: 'src/index.css',
      srcDir: 'src'
    }
  }

  // Create React App detection
  if (deps['react-scripts']) {
    return {
      framework: 'create-react-app',
      componentsPath: './src/components/ui',
      utilsPath: './src/lib',
      tailwindConfig: 'tailwind.config.js',
      cssPath: 'src/index.css',
      srcDir: 'src'
    }
  }

  // Remix detection
  if (deps['@remix-run/react']) {
    return {
      framework: 'remix',
      componentsPath: './app/components/ui',
      utilsPath: './app/lib',
      tailwindConfig: 'tailwind.config.ts',
      cssPath: 'app/tailwind.css',
      srcDir: 'app'
    }
  }

  // Generic React project
  return {
    framework: 'react',
    componentsPath: './src/components/ui',
    utilsPath: './src/lib',
    tailwindConfig: 'tailwind.config.js',
    cssPath: 'src/index.css',
    srcDir: 'src'
  }
}
