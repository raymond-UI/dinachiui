# DinachiUI

A modern React component library built on [Base UI](https://base-ui.com/) primitives with [Tailwind CSS](https://tailwindcss.com/). Components are copied directly into your project via a CLI tool — no runtime dependency, full ownership of the code.

## Quick Start

Initialize DinachiUI in your project:

```bash
npx @dinachi/cli@latest init
```

Add components:

```bash
npx @dinachi/cli@latest add button input card
```

Or add every core component at once:

```bash
npx @dinachi/cli@latest add --all
```

The motion tier is separate, since it pulls in `motion`:

```bash
npx @dinachi/cli@latest add --motion
```

## Components

54 accessible, composable components in two tiers.

**Core (44)** — Accordion, Alert Dialog, Autocomplete, Avatar, Badge, Button, Card, Checkbox, Checkbox Group, Collapsible, Combobox, Context Menu, Dialog, Drawer, Field, Fieldset, Form, Input, Label, Link, Menu, Menubar, Meter, Navigation Menu, Number Field, OTP Field, Popover, Preview Card, Progress, Radio, Scroll Area, Select, Separator, Skeleton, Slider, Switch, Tabs, Text, Textarea, Toast, Toggle, Toggle Group, Toolbar, Tooltip.

**Motion (10)** — Animated Tabs, Compare Slider, Hold to Confirm, Marquee, Number Ticker, Scroll Progress, Scroll Reveal, Stagger List, Text Morph, Text Shimmer. These depend on [motion](https://motion.dev), so they install separately.

## Features

- **Base UI foundation** — Accessible primitives with WAI-ARIA compliance
- **Tailwind CSS styling** — Semantic color tokens with light/dark mode support
- **Copy-paste model** — Components live in your project, fully customizable
- **TypeScript** — Strict mode with full type safety
- **React 19** — Built for the latest React
- **Tailwind CSS 3 & 4** — CLI auto-detects and configures for both versions

## Documentation

Visit [dinachi.dev](https://dinachi.dev) for full documentation, installation guides, and live examples.

## AI Skills

Dinachi provides an installable agent skill for guided component decisions and generative UI planning.

Install the skill:

```bash
npx skills add raymond-ui/dinachiui
```

Optional global install:

```bash
npx skills add raymond-ui/dinachiui -g
```

After install, restart your agent app (Codex/Cursor/Claude Code) and invoke `/dinachi-assistant` or prompt naturally.

## Packages

| Package | Description |
|---|---|
| [`@dinachi/cli`](https://www.npmjs.com/package/@dinachi/cli) | CLI tool for initializing and adding components |
| `@dinachi/components` | Component source (used internally by the CLI) |
| `@dinachi/core` | Shared utilities (`cn`, `variants`) and design tokens |

## Development

```bash
pnpm install
pnpm dev
```

## License

[MIT](LICENSE)
