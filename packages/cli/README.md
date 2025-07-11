# @dinachi/cli

A CLI for adding Dinachi UI components to your project. Just like shadcn/ui, this tool copies component source code directly into your project, giving you full ownership and control.

## Installation

```bash
npm install -g @dinachi/cli
# or
npx @dinachi/cli@latest init
```

## Usage

### Initialize Dinachi UI in your project

```bash
npx dinachi init
```

This will:
- Set up the project configuration
- Install required dependencies
- Create utility functions
- Generate a `components.json` config file

### Add components

```bash
npx dinachi add button
```

This will:
- Copy the button component source code to your project
- Place it in your configured components directory
- Show you which dependencies are required

### Available Commands

- `dinachi init` - Initialize Dinachi UI in your project
- `dinachi add <component>` - Add a component to your project
- `dinachi add <component> --overwrite` - Overwrite existing component files

### Available Components

- `accordion` - Collapsible content sections
- `alert-dialog` - Modal dialogs for important actions
- `avatar` - User profile images with fallbacks
- `button` - Clickable buttons with variants
- `checkbox` - Checkbox inputs
- `checkbox-group` - Grouped checkboxes
- `collapsible` - Collapsible content panels
- `context-menu` - Right-click context menus
- `dialog` - Modal dialogs
- `field` - Form field wrapper
- `form` - Form component with validation
- `input` - Text input fields
- `menubar` - Desktop-style menu bars
- `navigation-menu` - Navigation menu systems
- `preview-card` - Hover preview cards
- `select` - Dropdown select inputs
- `slider` - Range slider inputs
- `tabs` - Tabbed interfaces
- `toast` - Notification toasts
- `toggle` - Toggle switches
- `toolbar` - Tool button groups
- `tooltip` - Hover tooltips

## How it works

Unlike traditional component libraries, Dinachi UI copies the actual source code into your project. This means:

✅ **Full ownership** - The code is yours to modify
✅ **No runtime dependencies** - Only peer dependencies for utilities
✅ **Complete customization** - Change variants, styles, and behavior as needed
✅ **Zero abstractions** - See exactly how components work

## Configuration

After running `dinachi init`, you'll have a `components.json` file:

```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "./src/components/ui",
    "utils": "./src/lib/utils"
  }
}
```

## Modifying Button Variants

Once you add the button component, you can modify the variants directly in your project:

```tsx
// In your project: src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Add your own variants:
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
      },
      // Add your own size variants:
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10", // Your custom size
        icon: "h-10 w-10",
      },
    },
    // ...
  }
)
```

The variants live in **your** code, so you have complete control!
