# Toolbar

A container for grouping a set of controls, such as buttons, toggle groups, or dropdown menus.

## Installation

```bash
npx @dinachi/cli@latest add toolbar
```

## Usage

```tsx
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarInput,
} from "@/components/ui/toolbar"
```

```tsx
<Toolbar>
  <ToolbarGroup>
    <ToolbarButton>Bold</ToolbarButton>
    <ToolbarButton>Italic</ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarInput placeholder="Search..." />
  <ToolbarSeparator />
  <ToolbarLink href="/help">Help</ToolbarLink>
</Toolbar>
```

The `Toolbar` export also supports a compound component pattern via `Toolbar.Button`, `Toolbar.Group`, `Toolbar.Separator`, `Toolbar.Link`, and `Toolbar.Input`.

## API Reference

- **Toolbar** (also exported as **ToolbarRoot**) -- The root container that manages keyboard navigation. Extends Base UI `Toolbar.Root`. Accepts `orientation` (`"horizontal"` | `"vertical"`), `loop`, and `disabled` props.

- **ToolbarButton** -- A button control within the toolbar. Extends Base UI `Toolbar.Button`. Supports the `render` prop for element composition.

- **ToolbarLink** -- A styled link element within the toolbar. Extends Base UI `Toolbar.Link`.

- **ToolbarGroup** -- Groups related toolbar items together. Extends Base UI `Toolbar.Group`.

- **ToolbarSeparator** -- A visual divider between toolbar sections. Extends Base UI `Toolbar.Separator`. Accepts `orientation` (`"horizontal"` | `"vertical"`, defaults to `"vertical"`).

- **ToolbarInput** -- A text input control within the toolbar. Extends Base UI `Toolbar.Input`.
