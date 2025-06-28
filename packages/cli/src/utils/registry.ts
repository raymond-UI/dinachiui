import fs from 'fs-extra'
import path from 'path'

export interface ComponentFile {
  name: string
  content?: string
}

export interface Component {
  name: string
  description: string
  files: ComponentFile[]
  dependencies?: string[]
  componentDependencies?: string[]
  devDependencies?: string[]
}

export interface Config {
  style: string
  rsc: boolean
  tsx: boolean
  tailwind: {
    config: string
    css: string
    baseColor: string
    cssVariables: boolean
  }
  aliases: {
    components: string
    utils: string
  }
}

// Component registry - this defines all available components
export function getComponentRegistry(): Record<string, Component> {
  return {
    button: {
      name: 'button',
      description: 'A customizable button component with multiple variants',
      files: [
        { name: 'button.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ],
      componentDependencies: ['core']
    },
    input: {
      name: 'input',
      description: 'A customizable input field component with variants and sizes',
      files: [
        { name: 'input.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ]
    },
    field: {
      name: 'field',
      description: 'A component for building accessible forms with custom styling and validation.',
      files: [
        { name: 'field.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react'
      ],
      componentDependencies: ['input']
    },
    'alert-dialog': {
      name: 'alert-dialog',
      description: 'A modal dialog that interrupts the user with important content and expects a response.',
      files: [
        { name: 'alert-dialog.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react'
      ]
    }
  }
}

export async function getConfig(): Promise<Config | null> {
  const configPath = path.join(process.cwd(), 'components.json')
  
  if (!fs.existsSync(configPath)) {
    return null
  }

  try {
    const configContent = await fs.readFile(configPath, 'utf-8')
    return JSON.parse(configContent) as Config
  } catch (error) {
    return null
  }
}

export async function updateConfig(updates: Partial<Config>): Promise<void> {
  const configPath = path.join(process.cwd(), 'components.json')
  const currentConfig = await getConfig()
  
  if (!currentConfig) {
    throw new Error('No configuration file found')
  }

  const newConfig = { ...currentConfig, ...updates }
  await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2))
}
