# @dinachi/cli

A CLI for adding Dinachi UI components to your project. Just like shadcn/ui, this tool copies component source code directly into your project, giving you full ownership and control.

Best fit: React projects using Tailwind CSS (Next.js, Vite, Remix, CRA, and similar layouts).

> **What's new?** See the [changelog](./CHANGELOG.md) or the [releases page](https://github.com/raymond-UI/dinachiUI/releases) for the latest fixes and additions.

## Installation

```bash
npm install -g @dinachi/cli
```

**Or use npx without global install:**

```bash
npx @dinachi/cli@latest init
```

## Usage

### Two ways to use the CLI

**Option 1: Install globally (recommended)**

```bash
npm install -g @dinachi/cli

# Then use short commands
dinachi init
dinachi add button
```

**Option 2: Use npx (no global install)**

```bash
# Always use the full package name
npx @dinachi/cli@latest init
npx @dinachi/cli@latest add button
```

### Initialize Dinachi UI in your project

```bash
dinachi init
# or
npx @dinachi/cli@latest init
```

This will:
- Set up the project configuration
- Install required dependencies
- Create utility functions
- Generate a `components.json` config file with normalized project paths

### Add components

```bash
dinachi add button
# or
npx @dinachi/cli@latest add button
```

This will:
- Copy the button component source code to your project
- Place it in your configured components directory
- Install any missing dependencies (or print them when using `--skip-install`)

### Available Commands

- `dinachi init` - Initialize Dinachi UI in your project
- `dinachi init --skip-install` - Initialize without package installation
- `dinachi add <component>` - Add a component to your project
- `dinachi add <component> --overwrite` - Overwrite existing component files
- `dinachi add --all` - Install every core component
- `dinachi add --motion` - Install every motion component
- `dinachi add <component> --skip-install` - Add files without installing packages

### Available Components

Components come in two tiers. `add --all` installs the core tier; the motion tier is
separate because it depends on [motion](https://motion.dev). Naming a motion component
installs it on its own, whichever tier flag you use or skip.

#### Core (45)

- `accordion` - Collapsible content sections
- `alert-dialog` - Modal dialogs for important actions
- `autocomplete` - Text input with dynamic suggestions
- `avatar` - User profile images with fallbacks
- `badge` - Small status indicator
- `button` - Clickable buttons with variants
- `card` - Container with header, body, and footer
- `checkbox` - Checkbox inputs
- `checkbox-group` - Grouped checkboxes
- `collapsible` - Collapsible content panels
- `combobox` - Input + dropdown selection
- `context-menu` - Right-click context menus
- `dialog` - Modal dialogs
- `drawer` - Edge-anchored slide-in panel
- `field` - Form field wrapper
- `fieldset` - Group related form controls
- `form` - Form component with validation
- `input` - Text input fields
- `json-render` - Renders DinachiUI components from JSON specs
- `label` - Styled form label
- `link` - Semantic anchor with variants and router composition
- `menu` - Button-triggered action menu
- `menubar` - Desktop-style menu bars
- `meter` - Scalar measurement indicator
- `navigation-menu` - Navigation menu systems
- `number-field` - Numeric input with steppers
- `otp-field` - Verification code input with paste handling
- `popover` - Anchored floating panel
- `preview-card` - Hover preview cards
- `progress` - Task completion indicator
- `radio` - Single-select radio controls
- `scroll-area` - Custom scroll container
- `select` - Dropdown select inputs
- `separator` - Visual content divider
- `skeleton` - Placeholder loading animation
- `slider` - Range slider inputs
- `switch` - On/off toggle control
- `tabs` - Tabbed interfaces
- `text` - Typography for headings and paragraphs
- `textarea` - Multi-line text input
- `toast` - Notification toasts
- `toggle` - Toggle switches
- `toggle-group` - Grouped toggles
- `toolbar` - Tool button groups
- `tooltip` - Hover tooltips

#### Motion (10)

- `animated-tabs` - Tabs whose active pill travels between triggers
- `compare-slider` - Draggable divider for comparing two layers
- `hold-to-confirm` - Destructive action gated behind a press-and-hold
- `marquee` - Seamless ticker that pauses on hover and focus
- `number-ticker` - Number that springs to its value
- `scroll-progress` - Bar tracking how far a container has been scrolled
- `scroll-reveal` - Content that wipes into view as it enters the viewport
- `stagger-list` - List whose items rise into place one after another
- `text-morph` - Text that swaps with a blur-bridged crossfade
- `text-shimmer` - Highlight sweeping across text for pending states

## How it works

Unlike traditional component libraries, Dinachi UI copies the actual source code into your project. This means:

✅ **Full ownership** - The code is yours to modify
✅ **Dependencies stay in your app** - Required packages are installed directly into your project
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
    "components": "./src/components",
    "utils": "./src/lib/utils",
    "ui": "./src/components/ui",
    "lib": "./src/lib",
    "hooks": "./src/hooks"
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
