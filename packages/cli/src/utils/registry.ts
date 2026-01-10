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
    ui: string
    lib: string
    hooks?: string
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
        '@base-ui/react',
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
        '@base-ui/react'
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
        '@base-ui/react'
      ],
      utilityDependencies: ['cn']
    },
    form: {
      name: 'form',
      description: 'A native form element with consolidated error handling, built on Base UI foundation.',
      files: [
        { name: 'form.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react'
      ],
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
        '@base-ui/react',
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
        '@base-ui/react',
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
        '@base-ui/react'
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
        '@base-ui/react'
      ],
      utilityDependencies: ['cn']
    },
    avatar: {
      name: 'avatar',
      description: 'An image element with a fallback for representing a user.',
      files: [
        { name: 'avatar.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'class-variance-authority'
      ],
      utilityDependencies: ['cn']
    },
    checkbox: {
      name: 'checkbox',
      description: 'A control that allows the user to select one or more options from a set.',
      files: [
        { name: 'checkbox.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'lucide-react'
      ],
      utilityDependencies: ['cn']
    },
    'checkbox-group': {
      name: 'checkbox-group',
      description: 'A group of checkboxes that share a common state.',
      files: [
        { name: 'checkbox-group.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react'
      ],
      componentDependencies: ['checkbox'],
      utilityDependencies: ['cn']
    },
    'collapsible': {
      name: 'collapsible',
      description: 'A collapsible panel controlled by a button.',
      files: [
        { name: 'collapsible.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'tailwindcss-animate'
      ],
      utilityDependencies: ['cn']
    },
    dialog: {
      name: 'dialog',
      description: 'A popup that opens on top of the entire page, providing a modal interface for user interactions.',
      files: [
        { name: 'dialog.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react'
      ],
      utilityDependencies: ['cn']
    },
    toast: {
      name: 'toast',
      description: 'Generates toast notifications with support for different types, promises, actions, and global management.',
      files: [
        { name: 'toast.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'class-variance-authority'
      ],
      utilityDependencies: ['cn']
    },
    select: {
      name: 'select',
      description: 'A common form component for choosing a predefined value in a dropdown menu.',
      files: [
        { name: 'select.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'lucide-react'
      ],
      utilityDependencies: ['cn']
    },
    'context-menu': {
      name: 'context-menu',
      description: 'A menu that appears at the pointer on right click or long press.',
      files: [
        { name: 'context-menu.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'lucide-react'
      ],
      utilityDependencies: ['cn']
    },
    menubar: {
      name: 'menubar',
      description: 'A visually persistent menu common in desktop applications that provides access to a consistent set of commands.',
      files: [
        { name: 'menubar.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'lucide-react'
      ],
      utilityDependencies: ['cn']
    },
    'navigation-menu': {
      name: 'navigation-menu',
      description: 'A collection of links and menus for website navigation.',
      files: [
        { name: 'navigation-menu.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'lucide-react'
      ],
      utilityDependencies: ['cn']
    },
    'preview-card': {
      name: 'preview-card',
      description: 'A popup that appears when a link is hovered, showing a preview for sighted users.',
      files: [
        { name: 'preview-card.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react'
      ],
      utilityDependencies: ['cn']
    },
    toggle: {
      name: 'toggle',
      description: 'A two-state button that can be on or off.',
      files: [
        { name: 'toggle.tsx' },
        { name: 'index.ts' }
      ],
      dependencies: [
        '@base-ui/react',
        'class-variance-authority'
      ],
      utilityDependencies: ['cn']
    },
    "toolbar": {
      "name": "toolbar",
      "description": "A container for grouping a set of controls, such as buttons, toggle groups, or dropdown menus.",
      "files": [
        {
          "name": "toolbar.tsx"
        },
        {
          "name": "index.ts"
        }
      ],
      "dependencies": [
        "@base-ui/react"
      ],
      "utilityDependencies": [
        "cn"
      ]
    },
    "tooltip": {
      "name": "tooltip",
      "description": "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
      "files": [
        {
          "name": "tooltip.tsx"
        },
        {
          "name": "index.ts"
        }
      ],
      "dependencies": [
        "@base-ui/react"
      ],
      "utilityDependencies": [
        "cn"
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
