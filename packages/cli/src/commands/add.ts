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

/**
 * Resolves alias paths to actual file system paths
 * Handles different project structures (with/without src folder)
 */
function resolveAliasPath(aliasPath: string, projectRoot: string): string {
  // Remove the @ prefix if present
  const cleanPath = aliasPath.replace(/^@\//, '')
  
  // Try different common project structures in order of preference
  const possibleBasePaths = [
    path.join(projectRoot, 'src'),  // src/ prefix (most common)
    path.join(projectRoot, 'app'),  // app/ prefix (Next.js app router)
    projectRoot,                    // Direct in project root
  ]
  
  // For each base path, check if the directory structure exists
  for (const basePath of possibleBasePaths) {
    const fullPath = path.join(basePath, cleanPath)
    
    // Check if the base path exists (meaning this structure is used)
    if (fs.existsSync(basePath)) {
      return fullPath
    }
  }
  
  // Fallback to src/ structure (traditional approach)
  return path.join(projectRoot, 'src', cleanPath)
}

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

async function handleIndexFile(sourcePath: string, targetPath: string, componentName: string, allFilesAdded: { name: string; path: string }[], aliasPath: string) {
  // Read the template index.ts content
  let templateContent = await fs.readFile(sourcePath, 'utf-8')
  
  // Remove @ts-nocheck comment and any empty lines it creates
  templateContent = templateContent.replace(/^\/\/ @ts-nocheck\s*\n/m, '')
  
  if (!fs.existsSync(targetPath)) {
    // Create new index.ts file
    await fs.writeFile(targetPath, templateContent)
    allFilesAdded.push({ name: 'index.ts', path: path.join(aliasPath, 'index.ts') })
  } else {
    // Merge with existing index.ts file
    const existingContent = await fs.readFile(targetPath, 'utf-8')
    
    // Extract export statements from template
    const exportRegex = /export\s+\*\s+from\s+['"]\.\/([^'"]+)['"]/g
    const templateExports = []
    let match
    
    while ((match = exportRegex.exec(templateContent)) !== null) {
      templateExports.push(match[1])
    }
    
    // Check if component export already exists
    const componentExportExists = existingContent.includes(`export * from './${componentName}'`)
    
    if (!componentExportExists && templateExports.includes(componentName)) {
      // Add the new export to existing content
      const newExportLine = `export * from './${componentName}'`
      const updatedContent = existingContent.trim() + '\n' + newExportLine + '\n'
      
      await fs.writeFile(targetPath, updatedContent)
      allFilesAdded.push({ name: 'index.ts', path: path.join(aliasPath, 'index.ts') })
    }
  }
}

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('[component]', 'Name of the component (optional when using --all)')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-a, --all', 'Install all available components')
  .action(async (componentName: string | undefined, options: { yes?: boolean; overwrite?: boolean; all?: boolean }) => {
    const spinner = ora('Adding component...').start()

    try {
      const config = await getConfig()
      if (!config) {
        spinner.fail('❌ No components.json found. Run `dinachi init` first.')
        process.exit(1)
      }

      const registry = getComponentRegistry()
      
      let componentsToInstall: string[] = []
      
      if (options.all) {
        // Install all components
        const allComponents = Object.keys(registry)
        spinner.text = `Installing all ${allComponents.length} components...`
        
        // Get all components with their dependencies
        const allComponentsWithDeps = new Set<string>()
        for (const name of allComponents) {
          allComponentsWithDeps.add(name)
          const deps = getComponentDependencies(name)
          deps.forEach(dep => allComponentsWithDeps.add(dep))
        }
        
        componentsToInstall = Array.from(allComponentsWithDeps)
      } else {
        // Install single component (existing functionality)
        if (!componentName) {
          spinner.fail('❌ Component name is required when not using --all flag.')
          console.log('Available components:')
          Object.keys(registry).forEach(name => {
            console.log(`  ${chalk.cyan(name)}`)
          })
          process.exit(1)
        }
        
        const component = registry[componentName]
        if (!component) {
          spinner.fail(`❌ Component "${componentName}" not found.`)
          console.log('Available components:')
          Object.keys(registry).forEach(name => {
            console.log(`  ${chalk.cyan(name)}`)
          })
          process.exit(1)
        }
        
        componentsToInstall = [componentName, ...getComponentDependencies(componentName)]
      }
      
      if (!options.all) {
        spinner.text = `Installing ${componentsToInstall.join(', ')}...`
      }

      const componentDir = resolveAliasPath(config.aliases.ui, process.cwd())
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
      const utilsDir = resolveAliasPath(config.aliases.lib, process.cwd())
      
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

          if (file.name === 'index.ts') {
            // Handle index.ts file specially - merge exports instead of overwriting
            await handleIndexFile(sourcePath, targetPath, name, allFilesAdded, config.aliases.ui)
          } else {
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

      // Check which dependencies are missing
      const packageJsonPath = path.join(process.cwd(), 'package.json')
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      const missingDeps = [...new Set(allDepsInstalled)].filter(dep => !allDeps[dep])
      
      if (allDepsInstalled.length > 0) {
        spinner.text = 'Installing dependencies...'
        
        if (missingDeps.length > 0) {
          try {
            const packageManager = getPackageManager()
            const installCmd = `${packageManager} ${packageManager === 'npm' ? 'install' : 'add'} ${missingDeps.join(' ')}`
            
            execSync(installCmd, { stdio: 'inherit' })
          } catch (error) {
            spinner.warn(`⚠️  Failed to install dependencies. Please install manually: ${missingDeps.join(' ')}`)
          }
        } else {
          spinner.text = 'All dependencies already installed.'
        }
      }
      
      if (options.all) {
        spinner.succeed(`✅ Added all ${componentsToInstall.length} components!`)
      } else {
        spinner.succeed(`✅ Added ${componentsToInstall.join(', ')} component(s)!`)
      }
      
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
      
      if (missingDeps.length > 0) {
        console.log()
        console.log('Dependencies installed:')
        missingDeps.forEach(dep => {
          console.log(`  ${chalk.green('✓')} ${dep}`)
        })
      } else if (allDepsInstalled.length > 0) {
        console.log()
        console.log('Dependencies (already installed):')
        ;[...new Set(allDepsInstalled)].forEach(dep => {
          console.log(`  ${chalk.blue('~')} ${dep}`)
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
