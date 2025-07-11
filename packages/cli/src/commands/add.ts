import { Command } from 'commander'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import chalk from 'chalk'
import { getConfig, getComponentRegistry, getUtilityRegistry, type Component } from '../utils/registry.js'

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

async function ensureTailwindConfig(deps: string[]) {
  const needsAnimatePlugin = deps.includes('tailwindcss-animate')
  if (!needsAnimatePlugin) return

  const configPath = path.join(process.cwd(), 'tailwind.config.js')
  
  if (!fs.existsSync(configPath)) {
    // Create new tailwind.config.js with animate plugin
    const configContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};`
    
    await fs.writeFile(configPath, configContent)
    return { created: true }
  } else {
    // Check if animate plugin is already added
    const configContent = await fs.readFile(configPath, 'utf-8')
    
    if (!configContent.includes('tailwindcss-animate')) {
      // Add the plugin to existing config
      let updatedContent = configContent
      
      // Simple regex to add plugin to plugins array
      if (configContent.includes('plugins:')) {
        // Add to existing plugins array
        updatedContent = configContent.replace(
          /plugins:\s*\[([\s\S]*?)\]/,
          (match, pluginsContent) => {
            const cleanPlugins = pluginsContent.trim()
            const newPlugin = 'require("tailwindcss-animate")'
            
            if (cleanPlugins === '') {
              return `plugins: [\n    ${newPlugin},\n  ]`
            } else {
              return `plugins: [\n${pluginsContent},\n    ${newPlugin},\n  ]`
            }
          }
        )
      } else {
        // Add plugins array
        updatedContent = configContent.replace(
          /}\s*;?\s*$/,
          '  plugins: [\n    require("tailwindcss-animate"),\n  ],\n};'
        )
      }
      
      await fs.writeFile(configPath, updatedContent)
      return { updated: true }
    }
  }
  
  return { exists: true }
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

      const componentDir = path.join(process.cwd(), config.aliases.ui.replace('@/', 'src/'))
      await fs.ensureDir(componentDir)

      let allFilesAdded: { name: string; path: string }[] = []
      let allDepsInstalled: string[] = []
      let allUtilityDeps: string[] = []

      // Collect all utility dependencies
      for (const name of componentsToInstall) {
        const comp = registry[name]
        if (!comp) continue

        if (comp.utilityDependencies?.length) {
          allUtilityDeps.push(...comp.utilityDependencies)
        }
      }

      // Install utility files if needed
      const utilityRegistry = getUtilityRegistry()
      const uniqueUtilityDeps = [...new Set(allUtilityDeps)]
      const utilsDir = path.join(process.cwd(), config.aliases.lib.replace('@/', 'src/'))
      
      if (uniqueUtilityDeps.length > 0) {
        await fs.ensureDir(utilsDir)
        
        for (const utilityName of uniqueUtilityDeps) {
          const utility = utilityRegistry[utilityName]
          if (!utility) continue

          const utilityFilename = `${utility.name}.ts`
          const sourcePath = path.join(__dirname, '../templates/utils', utilityFilename)
          const targetPath = path.join(utilsDir, utilityFilename)

          if (!fs.existsSync(targetPath)) {
            // Read, process, and write utility file to strip template-specific comments
            let content = await fs.readFile(sourcePath, 'utf-8')
            
            // Remove @ts-nocheck comment and any empty lines it creates
            content = content.replace(/^\/\/ @ts-nocheck\s*\n/m, '')
            
            await fs.writeFile(targetPath, content)
            allFilesAdded.push({ 
              name: utilityFilename, 
              path: path.join(config.aliases.lib, utilityFilename) 
            })

            if (utility.dependencies?.length) {
              allDepsInstalled.push(...utility.dependencies)
            }
          }
        }
      }

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

          // Read, process, and write file to strip template-specific comments
          let content = await fs.readFile(sourcePath, 'utf-8')
          
          // Remove @ts-nocheck comment and any empty lines it creates
          content = content.replace(/^\/\/ @ts-nocheck\s*\n/m, '')
          
          await fs.writeFile(targetPath, content)
          allFilesAdded.push({ name: file.name, path: path.join(config.aliases.ui, file.name) })
        }

        if (comp.dependencies?.length) {
          allDepsInstalled.push(...comp.dependencies)
        }
      }

      // Handle Tailwind config for animation plugin
      let tailwindConfigInfo: any = null
      if (allDepsInstalled.includes('tailwindcss-animate')) {
        spinner.text = 'Updating Tailwind configuration...'
        tailwindConfigInfo = await ensureTailwindConfig(allDepsInstalled)
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
      
      if (tailwindConfigInfo) {
        console.log()
        if (tailwindConfigInfo.created) {
          console.log(`  ${chalk.green('+')} tailwind.config.js (created with tailwindcss-animate plugin)`)
        } else if (tailwindConfigInfo.updated) {
          console.log(`  ${chalk.blue('~')} tailwind.config.js (updated with tailwindcss-animate plugin)`)
        }
      }
      
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
