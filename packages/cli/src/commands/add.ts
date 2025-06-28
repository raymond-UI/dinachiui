import { Command } from 'commander'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import chalk from 'chalk'
import { getConfig, getComponentRegistry } from '../utils/registry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('<component>', 'Name of the component')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .action(async (componentName: string, options: { yes?: boolean; overwrite?: boolean }) => {
    const spinner = ora('Adding component...').start()

    try {
      // Get project config
      const config = await getConfig()
      if (!config) {
        spinner.fail('❌ No components.json found. Run `dinachi init` first.')
        process.exit(1)
      }

      // Get component from registry
      const component = getComponentRegistry()[componentName]
      if (!component) {
        spinner.fail(`❌ Component "${componentName}" not found.`)
        console.log('\nAvailable components:')
        Object.keys(getComponentRegistry()).forEach(name => {
          console.log(`  ${chalk.cyan(name)}`)
        })
        process.exit(1)
      }

      spinner.text = `Installing ${componentName}...`

      // Create component directory
      const componentDir = path.join(process.cwd(), config.aliases.components)
      await fs.ensureDir(componentDir)

      // Copy component files
      for (const file of component.files) {
        const sourcePath = path.join(__dirname, '../templates', componentName, file.name)
        const targetPath = path.join(componentDir, file.name)

        // Check if file exists
        if (fs.existsSync(targetPath) && !options.overwrite) {
          spinner.warn(`⚠️  ${file.name} already exists. Use --overwrite to replace it.`)
          continue
        }

        await fs.copy(sourcePath, targetPath)
      }

      spinner.succeed(`✅ Added ${componentName} component!`)
      
      console.log()
      console.log('Files added:')
      component.files.forEach(file => {
        console.log(`  ${chalk.green('+')} ${path.join(config.aliases.components, file.name)}`)
      })
      
      if (component.dependencies?.length) {
        console.log()
        console.log('Dependencies required:')
        component.dependencies.forEach(dep => {
          console.log(`  ${chalk.yellow('•')} ${dep}`)
        })
        console.log(`\nInstall them with: ${chalk.cyan('npm install ' + component.dependencies.join(' '))}`)
      }

    } catch (error) {
      spinner.fail(`❌ Failed to add component: ${error instanceof Error ? error.message : error}`)
      process.exit(1)
    }
  })
