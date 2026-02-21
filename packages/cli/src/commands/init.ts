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

interface ThemeCSSResult {
  path: string
  created?: boolean
  updated?: boolean
  skipped?: boolean
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

// Known dinachi vars in @theme inline — anything else is user-custom and should be preserved
const DINACHI_THEME_PREFIXES = ['--color-', '--radius-']

function extractPreservedThemeVars(css: string): string[] {
  const themeMatch = css.match(/@theme\s+inline\s*\{([^}]*)\}/)
  if (!themeMatch) return []

  return themeMatch[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => {
      if (!line || line.startsWith('//') || line.startsWith('/*')) return false
      // Keep lines that don't match any dinachi prefix (e.g. --font-sans, --font-mono)
      return line.startsWith('--') && !DINACHI_THEME_PREFIXES.some(p => line.startsWith(p))
    })
}

function getThemeCSS(tailwindMajor: number, mode: 'full' | 'append', preservedThemeVars: string[] = []): string {
  const lightVars = `:root {
  --background: oklch(0.986 0.0034 145.5499);
  --foreground: oklch(0.1459 0.0497 142.4953);
  --card: oklch(0.9781 0.0017 145.5621);
  --card-foreground: oklch(0.1459 0.0497 142.4953);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.1324 0.0033 145.3864);
  --primary: oklch(0.1324 0.0033 145.3864);
  --primary-foreground: oklch(0.9729 0.0101 145.4971);
  --secondary: oklch(0.9248 0.0051 145.5339);
  --secondary-foreground: oklch(0.1324 0.0033 145.3864);
  --muted: oklch(0.9631 0.0017 145.5619);
  --muted-foreground: oklch(0.1849 0.0629 142.4953);
  --accent: oklch(0.9248 0.0051 145.5339);
  --accent-foreground: oklch(0.1459 0.0497 142.4953);
  --destructive: oklch(0.5248 0.1368 20.8317);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.9239 0.0017 145.5613);
  --input: oklch(0.8481 0.0105 145.4823);
  --ring: oklch(0.1459 0.0497 142.4953);
  --radius: 0.625rem;
}`

  const darkVars = `.dark {
  --background: oklch(0.1149 0 0);
  --foreground: oklch(0.7999 0.0218 134.1191);
  --card: oklch(0.133 0.0021 196.9098);
  --card-foreground: oklch(0.7996 0.023 132.5769);
  --popover: oklch(0.1663 0.0138 135.2766);
  --popover-foreground: oklch(0.9742 0.0101 131.3574);
  --primary: oklch(0.9729 0.0101 145.4971);
  --primary-foreground: oklch(0.1324 0.0033 145.3864);
  --secondary: oklch(0.1844 0.0062 122.0354);
  --secondary-foreground: oklch(0.8009 0.0399 133.2927);
  --muted: oklch(0.1579 0.0017 196.9874);
  --muted-foreground: oklch(0.7897 0.0171 133.8518);
  --accent: oklch(0.1391 0.0113 136.9894);
  --accent-foreground: oklch(0.9742 0.0101 131.3574);
  --destructive: oklch(0.2258 0.0524 12.6119);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.1811 0.0128 129.2819);
  --input: oklch(0.2213 0.0193 135.2915);
  --ring: oklch(0.9248 0.0051 145.5339);
}`

  const parts: string[] = []

  if (tailwindMajor >= 4) {
    if (mode === 'full') {
      parts.push('@import "tailwindcss";')
    }
    parts.push(lightVars, darkVars)
    const preservedLines = preservedThemeVars.length > 0
      ? '\n' + preservedThemeVars.map(v => `  ${v}`).join('\n')
      : ''
    parts.push(`@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);${preservedLines}
}`)
    parts.push(`@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}`)
  } else {
    if (mode === 'full') {
      parts.push('@tailwind base;\n@tailwind components;\n@tailwind utilities;')
    }
    parts.push(lightVars, darkVars)
    parts.push(`@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`)
  }

  return parts.join('\n\n') + '\n'
}

function stripConflictingCSS(css: string): string {
  let result = css

  // Order matters: strip outer wrappers first, then inner blocks

  // Remove @media (prefers-color-scheme: dark) { ... } blocks
  // These conflict with our .dark class strategy
  // Match nested braces: @media (...) { ... { ... } ... }
  result = result.replace(/@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{[\s\S]*?\n\}/g, '')

  // Remove :root { ... } blocks (will be replaced by our theme vars)
  result = result.replace(/:root\s*\{[^}]*\}/g, '')

  // Remove .dark { ... } blocks
  result = result.replace(/\.dark\s*\{[^}]*\}/g, '')

  // Remove existing @theme inline { ... } blocks (we provide a complete one)
  result = result.replace(/@theme\s+inline\s*\{[^}]*\}/g, '')

  // Remove bare body { ... } rules (our @layer base handles this)
  result = result.replace(/(?:^|\n)body\s*\{[^}]*\}/g, '')

  // Clean up excessive blank lines
  result = result.replace(/\n{3,}/g, '\n\n')

  return result.trim()
}

async function injectThemeCSS(
  cssFilePath: string,
  tailwindMajor: number,
): Promise<ThemeCSSResult> {
  await fs.ensureDir(path.dirname(cssFilePath))

  if (fs.existsSync(cssFilePath)) {
    const existing = await fs.readFile(cssFilePath, 'utf-8')
    if (existing.includes('--primary:')) {
      return { path: cssFilePath, skipped: true }
    }

    // Extract custom vars (e.g. font mappings) from existing @theme inline before stripping
    const preservedVars = tailwindMajor >= 4 ? extractPreservedThemeVars(existing) : []

    // Strip sections that conflict with our theme, preserve everything else
    const cleaned = stripConflictingCSS(existing)
    const theme = getThemeCSS(tailwindMajor, 'append', preservedVars)
    const result = cleaned.length > 0
      ? cleaned + '\n\n' + theme
      : getThemeCSS(tailwindMajor, 'full', preservedVars)
    await fs.writeFile(cssFilePath, result)
    return { path: cssFilePath, updated: true }
  }

  const theme = getThemeCSS(tailwindMajor, 'full')
  await fs.writeFile(cssFilePath, theme)
  return { path: cssFilePath, created: true }
}

function getTW3ColorExtend(): string {
  return `colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },`
}

function createTW3Config(isCjs: boolean): string {
  const colorExtend = getTW3ColorExtend()

  if (isCjs) {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ${colorExtend}
    },
  },
  plugins: [],
}
`
  }

  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ${colorExtend}
    },
  },
  plugins: [],
}
`
}

async function ensureTW3ColorConfig(
  projectRoot: string,
  configFileName: string,
): Promise<ThemeCSSResult> {
  const candidates = [
    configFileName,
    'tailwind.config.ts',
    'tailwind.config.js',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
  ]

  let configPath: string | null = null
  for (const candidate of candidates) {
    const candidatePath = path.join(projectRoot, candidate)
    if (fs.existsSync(candidatePath)) {
      configPath = candidatePath
      break
    }
  }

  // No config exists — create one with colors pre-configured
  if (!configPath) {
    configPath = path.join(projectRoot, configFileName)
    const ext = path.extname(configPath)
    const isCjs = ext === '.cjs'
    await fs.writeFile(configPath, createTW3Config(isCjs))
    return { path: configPath, created: true }
  }

  // Config exists — check if colors are already configured
  const content = await fs.readFile(configPath, 'utf-8')
  if (content.includes('"var(--primary)"') || content.includes("'var(--primary)'")) {
    return { path: configPath, skipped: true }
  }

  const colorExtend = getTW3ColorExtend()

  // Try: inject into existing `extend: {`
  const extendMatch = content.match(/extend\s*:\s*\{/)
  if (extendMatch && extendMatch.index !== undefined) {
    const insertPos = extendMatch.index + extendMatch[0].length
    const updated = content.slice(0, insertPos) + '\n      ' + colorExtend + content.slice(insertPos)
    await fs.writeFile(configPath, updated)
    return { path: configPath, updated: true }
  }

  // Try: inject `extend` into existing `theme: {`
  const themeMatch = content.match(/theme\s*:\s*\{/)
  if (themeMatch && themeMatch.index !== undefined) {
    const insertPos = themeMatch.index + themeMatch[0].length
    const extendBlock = `\n    extend: {\n      ${colorExtend}\n    },`
    const updated = content.slice(0, insertPos) + extendBlock + content.slice(insertPos)
    await fs.writeFile(configPath, updated)
    return { path: configPath, updated: true }
  }

  // Try: inject `theme` before closing export
  const closingBrace = content.lastIndexOf('}')
  if (closingBrace !== -1) {
    const before = content.slice(0, closingBrace).trimEnd()
    const needsComma = !before.endsWith(',') && !before.endsWith('{')
    const themeBlock = `${needsComma ? ',' : ''}\n  theme: {\n    extend: {\n      ${colorExtend}\n    },\n  },\n`
    const updated = before + themeBlock + content.slice(closingBrace)
    await fs.writeFile(configPath, updated)
    return { path: configPath, updated: true }
  }

  return { path: configPath, skipped: true }
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
  const aliasTargetAlt = srcDir === '.' ? './*' : `./${srcDir}/*`

  // Check if @/* is already correctly configured (handles both formats)
  // Next.js style: "@/*": ["./*"] (no baseUrl)
  // Our style:     "@/*": ["*"]  (with baseUrl: ".")
  const existingAlias = paths['@/*']?.[0]
  const alreadyConfigured =
    (compilerOptions.baseUrl === '.' && existingAlias === aliasTarget) ||
    (existingAlias === aliasTargetAlt)

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

      spinner.text = 'Setting up color theme...'
      const tailwindMajor = detectTailwindMajorVersion(projectRoot)
      const cssFilePath = path.resolve(projectRoot, projectConfig.cssPath)
      const themeCSSResult = await injectThemeCSS(cssFilePath, tailwindMajor)

      let twColorConfigResult: ThemeCSSResult | null = null
      if (tailwindMajor < 4) {
        spinner.text = 'Configuring Tailwind color mappings...'
        twColorConfigResult = await ensureTW3ColorConfig(projectRoot, projectConfig.tailwindConfig)
      }

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

      if (themeCSSResult.created) {
        console.log(`  ${chalk.green('+')} Created ${projectConfig.cssPath} with color theme (light + dark)`)
      } else if (themeCSSResult.updated) {
        console.log(`  ${chalk.blue('~')} Updated ${projectConfig.cssPath} with color theme (light + dark)`)
      } else if (themeCSSResult.skipped) {
        console.log(`  ${chalk.gray('-')} Color theme already configured in ${projectConfig.cssPath}`)
      }

      if (twColorConfigResult) {
        if (twColorConfigResult.created) {
          console.log(`  ${chalk.green('+')} Created ${projectConfig.tailwindConfig} with color mappings`)
        } else if (twColorConfigResult.updated) {
          console.log(`  ${chalk.blue('~')} Updated ${projectConfig.tailwindConfig} with color mappings`)
        } else if (twColorConfigResult.skipped) {
          console.log(`  ${chalk.gray('-')} Color mappings already in ${projectConfig.tailwindConfig}`)
        }
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
