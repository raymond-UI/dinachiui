import { Command } from 'commander'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import chalk from 'chalk'
import prompts from 'prompts'
import { getConfig, getComponentRegistry, getUtilityRegistry } from '../utils/registry.js'
import { detectPackageManager, getInstallCommand } from '../utils/package-manager.js'
import { parseJsonWithComments } from '../utils/json.js'
import { toInstallSpec } from '../utils/dependencies.js'

interface CompilerPathConfig {
  baseUrl: string
  paths: Record<string, string[]>
}

interface TailwindConfigUpdate {
  path: string
  created?: boolean
  updated?: boolean
  exists?: boolean
  skipped?: boolean
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function stripTemplateDirective(content: string): string {
  return content.replace(/^\/\/ @ts-nocheck\s*\n/m, '')
}

function stripExtension(filePath: string): string {
  return filePath.replace(/\.[^./\\]+$/, '')
}

function toImportPath(fromFilePath: string, toFilePath: string): string {
  const relativePath = path
    .relative(path.dirname(fromFilePath), stripExtension(toFilePath))
    .replace(/\\/g, '/')

  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

function matchPathPattern(pattern: string, input: string): string | null {
  if (!pattern.includes('*')) {
    return pattern === input ? '' : null
  }

  const [prefix, suffix] = pattern.split('*')
  if (!input.startsWith(prefix) || !input.endsWith(suffix)) {
    return null
  }

  return input.slice(prefix.length, input.length - suffix.length)
}

function readCompilerPathConfig(projectRoot: string): CompilerPathConfig | null {
  const configFiles = ['tsconfig.json', 'jsconfig.json']

  for (const configFile of configFiles) {
    const configPath = path.join(projectRoot, configFile)
    if (!fs.existsSync(configPath)) {
      continue
    }

    try {
      const content = fs.readFileSync(configPath, 'utf-8')
      const parsed = parseJsonWithComments<{
        compilerOptions?: {
          baseUrl?: unknown
          paths?: Record<string, unknown>
        }
      }>(content)
      const compilerOptions = parsed.compilerOptions ?? {}
      const baseUrl = path.resolve(
        projectRoot,
        typeof compilerOptions.baseUrl === 'string' ? compilerOptions.baseUrl : '.'
      )

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

      return { baseUrl, paths }
    } catch {
      continue
    }
  }

  return null
}

function resolveConfiguredPath(aliasOrPath: string, projectRoot: string, compilerConfig: CompilerPathConfig | null): string {
  const normalized = aliasOrPath.replace(/\\/g, '/').trim()

  if (path.isAbsolute(normalized)) {
    return normalized
  }

  if (normalized.startsWith('./') || normalized.startsWith('../')) {
    return path.resolve(projectRoot, normalized)
  }

  if (normalized.startsWith('/')) {
    return path.resolve(projectRoot, `.${normalized}`)
  }

  if (compilerConfig) {
    for (const [pattern, targets] of Object.entries(compilerConfig.paths)) {
      const wildcard = matchPathPattern(pattern, normalized)
      if (wildcard === null) {
        continue
      }

      const target = targets[0]
      if (!target) {
        continue
      }

      const mappedTarget = target.includes('*') ? target.replace('*', wildcard) : target
      return path.resolve(compilerConfig.baseUrl, mappedTarget)
    }
  }

  if (normalized.startsWith('@/') || normalized.startsWith('~/')) {
    return path.resolve(projectRoot, normalized.slice(2))
  }

  return path.resolve(projectRoot, normalized)
}

function rewriteTemplateImports(content: string, targetFilePath: string, utilsFilePath: string, libDirPath: string): string {
  const utilsImportPath = toImportPath(targetFilePath, utilsFilePath)
  const variantsImportPath = toImportPath(targetFilePath, path.join(libDirPath, 'variants.ts'))

  return content
    .replace(/(['"])@\/lib\/utils\1/g, `$1${utilsImportPath}$1`)
    .replace(/(['"])@\/lib\/variants\1/g, `$1${variantsImportPath}$1`)
}

function getComponentDependencies(componentName: string, visited: Set<string> = new Set()): string[] {
  if (visited.has(componentName)) {
    return []
  }
  visited.add(componentName)

  const registry = getComponentRegistry()
  const component = registry[componentName]
  if (!component) return []

  const dependencies: string[] = []

  for (const dep of component.componentDependencies || []) {
    if (!registry[dep]) {
      continue
    }
    dependencies.push(dep, ...getComponentDependencies(dep, visited))
  }

  return [...new Set(dependencies)]
}

function detectTailwindConfigPath(projectRoot: string, configuredName: string): string {
  const preferred = resolveConfiguredPath(configuredName, projectRoot, null)
  if (fs.existsSync(preferred)) {
    return preferred
  }

  const alternatives = [
    'tailwind.config.ts',
    'tailwind.config.js',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
    'tailwind.config.cts',
    'tailwind.config.mts',
  ]

  for (const candidate of alternatives) {
    const candidatePath = path.join(projectRoot, candidate)
    if (fs.existsSync(candidatePath)) {
      return candidatePath
    }
  }

  return preferred
}

function insertTailwindPlugin(content: string, pluginExpression: string): string | null {
  if (/plugins\s*:\s*\[/.test(content)) {
    return content.replace(/plugins\s*:\s*\[([\s\S]*?)\]/m, (_match, pluginsContent: string) => {
      const trimmedPlugins = pluginsContent.trim()
      if (trimmedPlugins.length === 0) {
        return `plugins: [\n    ${pluginExpression},\n  ]`
      }

      const normalizedPlugins = pluginsContent.trimEnd()
      const withTrailingComma = normalizedPlugins.endsWith(',')
        ? normalizedPlugins
        : `${normalizedPlugins},`

      return `plugins: [\n${withTrailingComma}\n    ${pluginExpression},\n  ]`
    })
  }

  const trimmed = content.trimEnd()
  const hasSemicolon = trimmed.endsWith(';')
  const withoutSemicolon = hasSemicolon ? trimmed.slice(0, -1) : trimmed
  const closingBraceIndex = withoutSemicolon.lastIndexOf('}')

  if (closingBraceIndex === -1) {
    return null
  }

  const beforeClosingBrace = withoutSemicolon.slice(0, closingBraceIndex).trimEnd()
  const needsComma = beforeClosingBrace.length > 0 && !beforeClosingBrace.endsWith(',') && !beforeClosingBrace.endsWith('{')

  const next = `${withoutSemicolon.slice(0, closingBraceIndex)}${
    needsComma ? ',' : ''
  }\n  plugins: [\n    ${pluginExpression},\n  ],\n}${hasSemicolon ? ';' : ''}\n`

  return next
}

function detectTailwindMajorVersion(projectRoot: string): number {
  const packageJsonPath = path.join(projectRoot, 'package.json')
  if (!fs.existsSync(packageJsonPath)) return 4

  try {
    const raw = fs.readFileSync(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(raw) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const deps = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }
    const twVersion = deps.tailwindcss
    if (!twVersion) return 4

    const match = twVersion.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 4
  } catch {
    return 4
  }
}

async function ensureTW4Plugin(deps: string[], cssFilePath: string): Promise<TailwindConfigUpdate | null> {
  if (!deps.includes('tw-animate-css') && !deps.includes('tailwindcss-animate')) {
    return null
  }

  if (!fs.existsSync(cssFilePath)) {
    return { skipped: true, path: cssFilePath }
  }

  const content = await fs.readFile(cssFilePath, 'utf-8')
  if (content.includes('tw-animate-css') || content.includes('tailwindcss-animate')) {
    return { exists: true, path: cssFilePath }
  }

  const importLine = '@import "tw-animate-css";'
  const importMatch = content.match(/^@import\s+["']tailwindcss["'];?\s*$/m)
  let updated: string
  if (importMatch) {
    updated = content.replace(importMatch[0], `${importMatch[0].trimEnd()}\n${importLine}\n`)
  } else {
    updated = `${importLine}\n${content}`
  }

  await fs.writeFile(cssFilePath, updated)
  return { updated: true, path: cssFilePath }
}

async function ensureTailwindConfig(deps: string[], projectRoot: string, configuredFileName: string): Promise<TailwindConfigUpdate | null> {
  if (!deps.includes('tailwindcss-animate')) {
    return null
  }

  const configPath = detectTailwindConfigPath(projectRoot, configuredFileName || 'tailwind.config.js')

  if (!fs.existsSync(configPath)) {
    const ext = path.extname(configPath)
    const isCjs = ext === '.cjs'
    const configContent = isCjs
      ? `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
`
      : `import tailwindcssAnimate from "tailwindcss-animate"

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssAnimate],
}
`

    await fs.ensureDir(path.dirname(configPath))
    await fs.writeFile(configPath, configContent)
    return { created: true, path: configPath }
  }

  const currentContent = await fs.readFile(configPath, 'utf-8')
  if (currentContent.includes('tailwindcss-animate')) {
    return { exists: true, path: configPath }
  }

  const ext = path.extname(configPath)
  const isCjs = ext === '.cjs' || /module\.exports\s*=/.test(currentContent)
  const pluginExpression = isCjs ? 'require("tailwindcss-animate")' : 'tailwindcssAnimate'

  let updatedContent = currentContent
  if (!isCjs && !/from\s+['"]tailwindcss-animate['"]/.test(updatedContent)) {
    updatedContent = `import tailwindcssAnimate from "tailwindcss-animate"\n${updatedContent}`
  }

  const merged = insertTailwindPlugin(updatedContent, pluginExpression)
  if (!merged) {
    return { skipped: true, path: configPath }
  }

  await fs.writeFile(configPath, merged)
  return { updated: true, path: configPath }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractExportBlocks(content: string): { block: string; modulePath: string }[] {
  const results: { block: string; modulePath: string }[] = []

  // Match single-line: export { X, Y } from './foo'
  // Match multi-line:  export {\n  X,\n  Y,\n} from './foo'
  // Match export type variants of both
  const regex = /export\s+(?:type\s+)?{[^}]*}\s*from\s+['"]\.\/([^'"]+)['"]\s*;?/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    results.push({ block: match[0].trimEnd(), modulePath: match[1] })
  }

  // Match single-line: export * from './foo'
  const starRegex = /export\s+\*\s+from\s+['"]\.\/([^'"]+)['"]\s*;?/g
  while ((match = starRegex.exec(content)) !== null) {
    results.push({ block: match[0].trimEnd(), modulePath: match[1] })
  }

  return results
}

async function handleIndexFile(
  sourcePath: string,
  targetPath: string,
  allFilesAdded: { name: string; path: string }[],
  targetDir: string
) {
  const templateContent = stripTemplateDirective(await fs.readFile(sourcePath, 'utf-8'))

  if (!fs.existsSync(targetPath)) {
    await fs.writeFile(targetPath, templateContent)
    allFilesAdded.push({ name: 'index.ts', path: path.join(targetDir, 'index.ts') })
    return
  }

  const existingContent = await fs.readFile(targetPath, 'utf-8')
  const exportBlocks = extractExportBlocks(templateContent)

  const blocksToAppend: string[] = []
  for (const { block, modulePath } of exportBlocks) {
    const modulePathPattern = new RegExp(`from\\s+['"]\\./${escapeRegex(modulePath)}['"]`)
    if (modulePathPattern.test(existingContent)) {
      continue
    }
    const normalized = block.endsWith(';') ? block : `${block};`
    blocksToAppend.push(normalized)
  }

  if (blocksToAppend.length === 0) {
    return
  }

  const updatedContent = `${existingContent.trimEnd()}\n${blocksToAppend.join('\n')}\n`
  await fs.writeFile(targetPath, updatedContent)
  const indexPath = path.join(targetDir, 'index.ts')
  if (!allFilesAdded.some(f => f.path === indexPath)) {
    allFilesAdded.push({ name: 'index.ts', path: indexPath })
  }
}

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Names of the components to add (optional when using --all)')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-a, --all', 'Install all available components')
  .option('--skip-install', 'Skip package installation')
  .action(
    async (
      componentNames: string[],
      options: { yes?: boolean; overwrite?: boolean; all?: boolean; skipInstall?: boolean }
    ) => {
      const spinner = ora('Adding component...').start()

      try {
        const config = await getConfig()
        if (!config) {
          spinner.fail('❌ No components.json found. Run `dinachi init` first.')
          process.exit(1)
        }

        const projectRoot = process.cwd()
        const compilerPathConfig = readCompilerPathConfig(projectRoot)
        const registry = getComponentRegistry()

        let componentsToInstall: string[] = []

        if (options.all) {
          const allComponents = Object.keys(registry)
          spinner.text = `Installing all ${allComponents.length} components...`

          const allComponentsWithDeps = new Set<string>()
          for (const name of allComponents) {
            allComponentsWithDeps.add(name)
            const deps = getComponentDependencies(name)
            deps.forEach(dep => allComponentsWithDeps.add(dep))
          }

          componentsToInstall = Array.from(allComponentsWithDeps)
        } else {
          if (componentNames.length === 0) {
            spinner.fail('❌ Component name is required when not using --all flag.')
            console.log('Available components:')
            Object.keys(registry).forEach(name => {
              console.log(`  ${chalk.cyan(name)}`)
            })
            process.exit(1)
          }

          for (const name of componentNames) {
            if (!registry[name]) {
              spinner.fail(`❌ Component "${name}" not found.`)
              console.log('Available components:')
              Object.keys(registry).forEach(n => {
                console.log(`  ${chalk.cyan(n)}`)
              })
              process.exit(1)
            }
          }

          const allWithDeps = new Set<string>()
          for (const name of componentNames) {
            allWithDeps.add(name)
            const deps = getComponentDependencies(name)
            deps.forEach(dep => allWithDeps.add(dep))
          }
          componentsToInstall = Array.from(allWithDeps)
        }

        if (!options.all) {
          spinner.text = `Installing ${componentsToInstall.join(', ')}...`
        }

        const componentDir = resolveConfiguredPath(config.aliases.ui, projectRoot, compilerPathConfig)
        const libDir = resolveConfiguredPath(config.aliases.lib, projectRoot, compilerPathConfig)
        const utilsFilePath = resolveConfiguredPath(config.aliases.utils, projectRoot, compilerPathConfig)

        await fs.ensureDir(componentDir)
        await fs.ensureDir(libDir)

        const allFilesAdded: { name: string; path: string }[] = []
        const allDepsInstalled: string[] = []
        const allUtilityDeps: string[] = []

        for (const name of componentsToInstall) {
          const comp = registry[name]
          if (!comp) continue
          if (comp.utilityDependencies?.length) {
            allUtilityDeps.push(...comp.utilityDependencies)
          }
        }

        const utilityRegistry = getUtilityRegistry()
        const uniqueUtilityDeps = [...new Set(allUtilityDeps)]

        if (uniqueUtilityDeps.length > 0) {
          for (const utilityName of uniqueUtilityDeps) {
            const utility = utilityRegistry[utilityName]
            if (!utility) continue

            const utilityFilename = `${utility.name}.ts`
            const sourcePath = path.join(__dirname, '../templates/utils', utilityFilename)
            const targetPath = path.join(libDir, utilityFilename)

            if (!fs.existsSync(targetPath)) {
              const content = stripTemplateDirective(await fs.readFile(sourcePath, 'utf-8'))
              await fs.writeFile(targetPath, content)
              allFilesAdded.push({
                name: utilityFilename,
                path: targetPath,
              })
            }

            if (utility.dependencies?.length) {
              allDepsInstalled.push(...utility.dependencies)
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
              await handleIndexFile(sourcePath, targetPath, allFilesAdded, componentDir)
              continue
            }

            if (fs.existsSync(targetPath) && !options.overwrite) {
              spinner.stop()
              const { overwrite } = await prompts({
                type: 'confirm',
                name: 'overwrite',
                message: `${file.name} already exists. Overwrite?`,
                initial: false,
              })
              if (!overwrite) {
                console.log(`  ${chalk.yellow('⊘')} Skipped ${file.name}`)
                spinner.start()
                continue
              }
              spinner.start()
            }

            const templateContent = stripTemplateDirective(await fs.readFile(sourcePath, 'utf-8'))
            const rewrittenContent = rewriteTemplateImports(templateContent, targetPath, utilsFilePath, libDir)
            await fs.writeFile(targetPath, rewrittenContent)
            allFilesAdded.push({ name: file.name, path: targetPath })
          }

          if (comp.dependencies?.length) {
            allDepsInstalled.push(...comp.dependencies)
          }
        }

        spinner.text = 'Updating Tailwind configuration...'
        const tailwindMajor = detectTailwindMajorVersion(projectRoot)

        // For Tailwind v4, swap tailwindcss-animate → tw-animate-css (v4-compatible)
        if (tailwindMajor >= 4) {
          const idx = allDepsInstalled.indexOf('tailwindcss-animate')
          if (idx !== -1) {
            allDepsInstalled[idx] = 'tw-animate-css'
          }
          // Replace any remaining occurrences
          for (let i = 0; i < allDepsInstalled.length; i++) {
            if (allDepsInstalled[i] === 'tailwindcss-animate') {
              allDepsInstalled[i] = 'tw-animate-css'
            }
          }
        }

        const tailwindConfigInfo = tailwindMajor >= 4
          ? await ensureTW4Plugin(
              allDepsInstalled,
              path.resolve(projectRoot, config.tailwind?.css || 'src/index.css')
            )
          : await ensureTailwindConfig(
              allDepsInstalled,
              projectRoot,
              config.tailwind?.config || 'tailwind.config.js'
            )

        const packageJsonPath = path.join(projectRoot, 'package.json')
        if (!fs.existsSync(packageJsonPath)) {
          throw new Error('No package.json found in the current directory.')
        }

        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8')) as {
          dependencies?: Record<string, string>
          devDependencies?: Record<string, string>
        }

        const declaredDeps = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }
        const uniqueDeps = [...new Set(allDepsInstalled)]
        const missingDeps = uniqueDeps.filter(dep => !declaredDeps[dep])

        if (!options.skipInstall && missingDeps.length > 0) {
          spinner.text = 'Installing dependencies...'
          try {
            const packageManager = detectPackageManager(projectRoot)
            const installCmd = getInstallCommand(packageManager, missingDeps.map(toInstallSpec))
            execSync(installCmd, { stdio: 'inherit', cwd: projectRoot })
          } catch {
            spinner.warn(`⚠️  Failed to install dependencies. Please install manually: ${missingDeps.join(' ')}`)
          }
        } else if (!options.skipInstall && uniqueDeps.length > 0) {
          spinner.text = 'All dependencies already installed.'
        }

        if (options.all) {
          spinner.succeed(`✅ Added all ${componentsToInstall.length} components!`)
        } else {
          spinner.succeed(`✅ Added ${componentsToInstall.join(', ')}!`)
        }

        console.log()
        console.log('Files added:')
        allFilesAdded.forEach(file => {
          console.log(`  ${chalk.green('+')} ${file.path}`)
        })

        if (tailwindConfigInfo) {
          const animatePackage = tailwindMajor >= 4 ? 'tw-animate-css' : 'tailwindcss-animate'
          console.log()
          if (tailwindConfigInfo.created) {
            console.log(`  ${chalk.green('+')} ${tailwindConfigInfo.path} (created with ${animatePackage} plugin)`)
          } else if (tailwindConfigInfo.updated) {
            console.log(`  ${chalk.blue('~')} ${tailwindConfigInfo.path} (updated with ${animatePackage} plugin)`)
          } else if (tailwindConfigInfo.skipped) {
            console.log(
              `  ${chalk.yellow('!')} ${tailwindConfigInfo.path} (could not safely update automatically; add ${animatePackage} manually)`
            )
          }
        }

        if (options.skipInstall && missingDeps.length > 0) {
          console.log()
          console.log('Dependencies to install manually:')
          missingDeps.forEach(dep => {
            console.log(`  ${chalk.yellow('•')} ${toInstallSpec(dep)}`)
          })
        } else if (missingDeps.length > 0) {
          console.log()
          console.log('Dependencies installed:')
          missingDeps.forEach(dep => {
            console.log(`  ${chalk.green('✓')} ${toInstallSpec(dep)}`)
          })
        } else if (uniqueDeps.length > 0) {
          console.log()
          console.log('Dependencies (already installed):')
          uniqueDeps.forEach(dep => {
            console.log(`  ${chalk.blue('~')} ${dep}`)
          })
        }
      } catch (error) {
        spinner.fail(`❌ Failed to add component: ${error instanceof Error ? error.message : error}`)
        process.exit(1)
      }
    }
  )
