import { Command } from 'commander'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import chalk from 'chalk'
import { getConfig, getComponentRegistry, type Component } from '../utils/registry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getComponentDependencies(componentName: string): string[] {
  const registry = getComponentRegistry()
  const component = registry[componentName]
  if (!component) return []

  let dependencies = component.componentDependencies || []

  for (const dep of component.componentDependencies || []) {
    dependencies = [...dependencies, ...getComponentDependencies(dep)]
  }

  return [...new Set(dependencies)]
}

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('<component>', 'Name of the component')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .action(async (componentName: string, options: { yes?: boolean; overwrite?: boolean }) => {
    const spinner = ora('Adding component...').start()

    try {
      const config = await getConfig()
      if (!config) {
        spinner.fail('❌ No components.json found. Run `dinachi init` first.')
        process.exit(1)
      }

      const registry = getComponentRegistry()
      const component = registry[componentName]
      if (!component) {
        spinner.fail(`❌ Component "${componentName}" not found.`)
        console.log('Available components:')
        Object.keys(registry).forEach(name => {
          console.log(`  ${chalk.cyan(name)}`)
        })
        process.exit(1)
      }

      const componentsToInstall = [componentName, ...getComponentDependencies(componentName)]
      
      spinner.text = `Installing ${componentsToInstall.join(', ')}...`

      const componentDir = path.join(process.cwd(), config.aliases.components)
      await fs.ensureDir(componentDir)

      let allFilesAdded: { name: string; path: string }[] = []
      let allDepsInstalled: string[] = []

      for (const name of componentsToInstall) {
        const comp = registry[name]
        if (!comp) continue

        for (const file of comp.files) {
          const sourcePath = path.join(__dirname, '../templates', name, file.name)
          const targetPath = path.join(componentDir, file.name)

          if (fs.existsSync(targetPath) && !options.overwrite) {
            spinner.warn(`⚠️  ${file.name} already exists. Use --overwrite to replace it.`)
            continue
          }

          await fs.copy(sourcePath, targetPath)
          allFilesAdded.push({ name: file.name, path: path.join(config.aliases.components, file.name) })
        }

        if (comp.dependencies?.length) {
          allDepsInstalled.push(...comp.dependencies)
        }
      }

      if (allDepsInstalled.length > 0) {
        spinner.text = 'Installing dependencies...'
        
        const packageJsonPath = path.join(process.cwd(), 'package.json')
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
        
        const missingDeps = [...new Set(allDepsInstalled)].filter(dep => !allDeps[dep])
        
        if (missingDeps.length > 0) {
          try {
            const packageManager = getPackageManager()
            const installCmd = `${packageManager} ${packageManager === 'npm' ? 'install' : 'add'} ${missingDeps.join(' ')}`
            
            execSync(installCmd, { stdio: 'inherit' })
          } catch (error) {
            spinner.warn(`⚠️  Failed to install dependencies. Please install manually: ${missingDeps.join(' ')}`)
          }
        }
      }
      
      spinner.succeed(`✅ Added ${componentsToInstall.join(', ')} component(s)!`)
      
      console.log()
      console.log('Files added:')
      allFilesAdded.forEach(file => {
        console.log(`  ${chalk.green('+')} ${file.path}`)
      })
      
      if (allDepsInstalled.length > 0) {
        console.log()
        console.log('Dependencies installed:')
        ;[...new Set(allDepsInstalled)].forEach(dep => {
          console.log(`  ${chalk.green('✓')} ${dep}`)
        })
      }

    } catch (error) {
      spinner.fail(`❌ Failed to add component: ${error instanceof Error ? error.message : error}`)
      process.exit(1)
    }
  })

function getPackageManager(): string {
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
  if (fs.existsSync('yarn.lock')) return 'yarn'
  return 'npm'
}
''
