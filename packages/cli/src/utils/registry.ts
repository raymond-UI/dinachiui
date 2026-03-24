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
  targetDir?: string
  integration?: boolean
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

interface RawConfig {
  style?: unknown
  rsc?: unknown
  tsx?: unknown
  tailwind?: {
    config?: unknown
    css?: unknown
    baseColor?: unknown
    cssVariables?: unknown
  }
  aliases?: {
    components?: unknown
    utils?: unknown
    ui?: unknown
    lib?: unknown
    hooks?: unknown
  }
}

function dirnameLike(input: string): string {
  const normalized = input.replace(/\/+$/, '')
  const idx = normalized.lastIndexOf('/')
  if (idx <= 0) {
    return normalized
  }
  return normalized.slice(0, idx)
}

function normalizeConfig(raw: RawConfig): Config {
  const style = typeof raw.style === 'string' ? raw.style : 'default'
  const rsc = typeof raw.rsc === 'boolean' ? raw.rsc : false
  const tsx = typeof raw.tsx === 'boolean' ? raw.tsx : true

  const tailwindConfig = typeof raw.tailwind?.config === 'string' ? raw.tailwind.config : 'tailwind.config.js'
  const tailwindCss = typeof raw.tailwind?.css === 'string' ? raw.tailwind.css : 'src/index.css'
  const tailwindBaseColor = typeof raw.tailwind?.baseColor === 'string' ? raw.tailwind.baseColor : 'slate'
  const tailwindCssVariables = typeof raw.tailwind?.cssVariables === 'boolean' ? raw.tailwind.cssVariables : true

  const rawComponentsAlias =
    typeof raw.aliases?.components === 'string' ? raw.aliases.components : './src/components'
  const hasLegacyUiPathInComponents = rawComponentsAlias.replace(/\/+$/, '').endsWith('/ui')
  const componentsAlias = hasLegacyUiPathInComponents ? dirnameLike(rawComponentsAlias) : rawComponentsAlias
  const uiAlias = typeof raw.aliases?.ui === 'string'
    ? raw.aliases.ui
    : hasLegacyUiPathInComponents
      ? rawComponentsAlias
      : `${componentsAlias}/ui`

  const utilsAlias =
    typeof raw.aliases?.utils === 'string' ? raw.aliases.utils : './src/lib/utils'
  const libAlias =
    typeof raw.aliases?.lib === 'string' ? raw.aliases.lib : dirnameLike(utilsAlias)

  const hooksAlias =
    typeof raw.aliases?.hooks === 'string' ? raw.aliases.hooks : './src/hooks'

  return {
    style,
    rsc,
    tsx,
    tailwind: {
      config: tailwindConfig,
      css: tailwindCss,
      baseColor: tailwindBaseColor,
      cssVariables: tailwindCssVariables,
    },
    aliases: {
      components: componentsAlias,
      utils: utilsAlias,
      ui: uiAlias,
      lib: libAlias,
      hooks: hooksAlias,
    },
  }
}

// Utility registry - this defines all available utility files
export function getUtilityRegistry(): Record<string, UtilityFile> {
  return {
    cn: {
      name: 'utils',
      dependencies: ['clsx', 'tailwind-merge']
    },
    variants: {
      name: 'variants',
      dependencies: ['class-variance-authority']
    }
  }
}

// Component registry - this defines all available components
export function getComponentRegistry(): Record<string, Component> {
  return {
    accordion: {
      name: 'accordion',
      description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
      files: [{ name: 'accordion.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react', 'tailwindcss-animate'],
      utilityDependencies: ['cn']
    },
    'alert-dialog': {
      name: 'alert-dialog',
      description: 'A modal dialog that interrupts the user with important content and expects a response.',
      files: [{ name: 'alert-dialog.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    autocomplete: {
      name: 'autocomplete',
      description: 'A text input with dynamic suggestions that helps users find and select values quickly.',
      files: [{ name: 'autocomplete.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    avatar: {
      name: 'avatar',
      description: 'An image element with a fallback for representing a user.',
      files: [{ name: 'avatar.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'class-variance-authority'],
      utilityDependencies: ['cn']
    },
    badge: {
      name: 'badge',
      description: 'A small status indicator for highlighting information.',
      files: [{ name: 'badge.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'class-variance-authority'],
      utilityDependencies: ['cn']
    },
    button: {
      name: 'button',
      description: 'A customizable button component with multiple variants.',
      files: [{ name: 'button.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'class-variance-authority'],
      utilityDependencies: ['cn', 'variants']
    },
    card: {
      name: 'card',
      description: 'A container for grouping related content with header, body, and footer sections.',
      files: [{ name: 'card.tsx' }, { name: 'index.ts' }],
      dependencies: [],
      utilityDependencies: ['cn']
    },
    checkbox: {
      name: 'checkbox',
      description: 'A control that allows the user to select one or more options from a set.',
      files: [{ name: 'checkbox.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    'checkbox-group': {
      name: 'checkbox-group',
      description: 'A group of checkboxes that share a common state.',
      files: [{ name: 'checkbox-group.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      componentDependencies: ['checkbox'],
      utilityDependencies: ['cn']
    },
    collapsible: {
      name: 'collapsible',
      description: 'A collapsible panel controlled by a button.',
      files: [{ name: 'collapsible.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'tailwindcss-animate'],
      utilityDependencies: ['cn']
    },
    combobox: {
      name: 'combobox',
      description: 'A combobox that combines text input with a selectable popup list of options.',
      files: [{ name: 'combobox.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    'context-menu': {
      name: 'context-menu',
      description: 'A menu that appears at the pointer on right click or long press.',
      files: [{ name: 'context-menu.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    dialog: {
      name: 'dialog',
      description: 'A popup that opens on top of the entire page, providing a modal interface for user interactions.',
      files: [{ name: 'dialog.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    drawer: {
      name: 'drawer',
      description: 'A panel that slides in from the edge of the screen for focused workflows.',
      files: [{ name: 'drawer.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    field: {
      name: 'field',
      description: 'A component for building accessible forms with custom styling and validation.',
      files: [{ name: 'field.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    fieldset: {
      name: 'fieldset',
      description: 'A grouping container for related form controls with an accessible legend.',
      files: [{ name: 'fieldset.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    form: {
      name: 'form',
      description: 'A native form element with consolidated error handling, built on Base UI foundation.',
      files: [{ name: 'form.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    input: {
      name: 'input',
      description: 'A customizable input field component with variants and sizes.',
      files: [{ name: 'input.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    label: {
      name: 'label',
      description: 'A styled label component for form fields.',
      files: [{ name: 'label.tsx' }, { name: 'index.ts' }],
      dependencies: [],
      utilityDependencies: ['cn']
    },
    link: {
      name: 'link',
      description: 'A semantic anchor element with style variants and support for external links and framework router composition.',
      files: [{ name: 'link.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'class-variance-authority'],
      utilityDependencies: ['cn']
    },
    menu: {
      name: 'menu',
      description: 'A popup menu for actions and options triggered by a button.',
      files: [{ name: 'menu.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    menubar: {
      name: 'menubar',
      description: 'A visually persistent menu common in desktop applications that provides access to a consistent set of commands.',
      files: [{ name: 'menubar.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    meter: {
      name: 'meter',
      description: 'A visual representation of a scalar measurement within a known range.',
      files: [{ name: 'meter.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    'navigation-menu': {
      name: 'navigation-menu',
      description: 'A collection of links and menus for website navigation.',
      files: [{ name: 'navigation-menu.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    'number-field': {
      name: 'number-field',
      description: 'A numeric input with increment, decrement, and optional scrubbing controls.',
      files: [{ name: 'number-field.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    popover: {
      name: 'popover',
      description: 'An anchored floating panel for contextual information and lightweight interactions.',
      files: [{ name: 'popover.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    'preview-card': {
      name: 'preview-card',
      description: 'A popup that appears when a link is hovered, showing a preview for sighted users.',
      files: [{ name: 'preview-card.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    progress: {
      name: 'progress',
      description: 'A progress bar that communicates task completion to users and assistive technology.',
      files: [{ name: 'progress.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    radio: {
      name: 'radio',
      description: 'A radio input and group for selecting a single option from a set.',
      files: [{ name: 'radio.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    'scroll-area': {
      name: 'scroll-area',
      description: 'A custom scroll container with styled scrollbars and optional corner rendering.',
      files: [{ name: 'scroll-area.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    select: {
      name: 'select',
      description: 'A common form component for choosing a predefined value in a dropdown menu.',
      files: [{ name: 'select.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    separator: {
      name: 'separator',
      description: 'A visual divider used to separate and organize content.',
      files: [{ name: 'separator.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    skeleton: {
      name: 'skeleton',
      description: 'A placeholder loading animation component.',
      files: [{ name: 'skeleton.tsx' }, { name: 'index.ts' }],
      dependencies: [],
      utilityDependencies: ['cn']
    },
    slider: {
      name: 'slider',
      description: 'An input where the user selects a value from within a given range.',
      files: [{ name: 'slider.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    switch: {
      name: 'switch',
      description: 'A control that allows users to toggle a setting on or off.',
      files: [{ name: 'switch.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    tabs: {
      name: 'tabs',
      description: 'A component for toggling between related panels on the same page.',
      files: [{ name: 'tabs.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    text: {
      name: 'text',
      description: 'A typography component for headings, paragraphs, and text styles.',
      files: [{ name: 'text.tsx' }, { name: 'index.ts' }],
      dependencies: ['class-variance-authority'],
      utilityDependencies: ['cn']
    },
    textarea: {
      name: 'textarea',
      description: 'A multi-line text input for longer form content.',
      files: [{ name: 'textarea.tsx' }, { name: 'index.ts' }],
      dependencies: [],
      utilityDependencies: ['cn']
    },
    toast: {
      name: 'toast',
      description: 'Generates toast notifications with support for different types, promises, actions, and global management.',
      files: [{ name: 'toast.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'class-variance-authority', 'lucide-react'],
      utilityDependencies: ['cn']
    },
    toggle: {
      name: 'toggle',
      description: 'A two-state button that can be on or off.',
      files: [{ name: 'toggle.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'class-variance-authority'],
      utilityDependencies: ['cn']
    },
    'toggle-group': {
      name: 'toggle-group',
      description: 'A grouped set of toggles supporting single or multiple pressed states.',
      files: [{ name: 'toggle-group.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react', 'class-variance-authority'],
      utilityDependencies: ['cn']
    },
    toolbar: {
      name: 'toolbar',
      description: 'A container for grouping a set of controls, such as buttons, toggle groups, or dropdown menus.',
      files: [{ name: 'toolbar.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    tooltip: {
      name: 'tooltip',
      description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
      files: [{ name: 'tooltip.tsx' }, { name: 'index.ts' }],
      dependencies: ['@base-ui/react'],
      utilityDependencies: ['cn']
    },
    'json-render': {
      name: 'json-render',
      description: 'Adapter for @json-render — renders DinachiUI components from JSON specs with state binding, validation, and actions.',
      files: [
        { name: 'catalog.ts' },
        { name: 'components.tsx' },
        { name: 'registry.ts' },
        { name: 'index.ts' },
      ],
      dependencies: ['@json-render/core', '@json-render/react', 'zod'],
      componentDependencies: [
        'accordion', 'alert-dialog', 'avatar', 'badge', 'button', 'card',
        'checkbox', 'collapsible', 'dialog', 'drawer', 'fieldset', 'input',
        'label', 'number-field', 'popover', 'progress', 'radio', 'scroll-area',
        'select', 'separator', 'skeleton', 'slider', 'switch', 'tabs',
        'text', 'textarea', 'toast', 'toggle', 'toggle-group', 'tooltip',
      ],
      utilityDependencies: ['cn'],
      targetDir: 'json-render',
      integration: true,
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
    const parsed = JSON.parse(configContent) as RawConfig
    return normalizeConfig(parsed)
  } catch {
    return null
  }
}

export async function updateConfig(updates: Partial<Config>): Promise<void> {
  const configPath = path.join(process.cwd(), 'components.json')
  const currentConfig = await getConfig()

  if (!currentConfig) {
    throw new Error('No configuration file found')
  }

  const newConfig: Config = {
    ...currentConfig,
    ...updates,
    tailwind: {
      ...currentConfig.tailwind,
      ...(updates.tailwind ?? {})
    },
    aliases: {
      ...currentConfig.aliases,
      ...(updates.aliases ?? {})
    }
  }
  await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2))
}
