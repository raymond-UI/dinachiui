import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  utilityDependencies?: string[]
}

export interface UtilityFile {
  name: string
  dependencies?: string[]
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

// Utility registry - this defines all available utility files
export function getUtilityRegistry(): Record<string, UtilityFile> {
  return {
    cn: {
      name: 'utils',
      dependencies: [
        'clsx',
        'tailwind-merge'
      ]
    },
    variants: {
      name: 'variants',
      dependencies: [
        'class-variance-authority'
      ]
    }
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
        '@base-ui-components/react',
        'class-variance-authority'
      ],
      componentDependencies: ['core'],
      utilityDependencies: ['cn', 'variants']
    },
    input: {
      name: 'input',
      description: 'A customizable input field component with variants and sizes',
      files: [
        { name: 'input.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react'
      ],
      utilityDependencies: ['cn']
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
      componentDependencies: ['input'],
      utilityDependencies: ['cn']
    },
    'alert-dialog': {
      name: 'alert-dialog',
      description: 'A modal dialog that interrupts the user with important content and expects a response.',
      files: [
        { name: 'alert-dialog.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react',
        'lucide-react'
      ],
      utilityDependencies: ['cn']
    },
    accordion: {
      name: 'accordion',
      description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
      files: [
        { name: 'accordion.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react',
        'lucide-react',
        'tailwindcss-animate'
      ],
      utilityDependencies: ['cn']
    },
    tabs: {
      name: 'tabs',
      description: 'A component for toggling between related panels on the same page.',
      files: [
        { name: 'tabs.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react'
      ],
      utilityDependencies: ['cn']
    },
    slider: {
      name: 'slider',
      description: 'An input where the user selects a value from within a given range.',
      files: [
        { name: 'slider.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui-components/react'
      ],
      utilityDependencies: ['cn']
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
