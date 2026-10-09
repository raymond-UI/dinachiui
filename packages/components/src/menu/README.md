# Menu

A popup menu for actions and options triggered by a button.

## Installation

```bash
npx @dinachi/cli@latest add menu
```

## Usage

```tsx
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuShortcut,
} from "@/components/ui/menu"
```

```tsx
<Menu>
  <MenuTrigger>Options</MenuTrigger>
  <MenuContent>
    <MenuLabel>Account</MenuLabel>
    <MenuItem>
      Profile <MenuShortcut>Ctrl+P</MenuShortcut>
    </MenuItem>
    <MenuItem>Settings</MenuItem>
    <MenuSeparator />
    <MenuItem>Log out</MenuItem>
  </MenuContent>
</Menu>
```

## API Reference

- **Menu** -- Wraps `Menu.Root` from Base UI. Controls the menu open state.
- **MenuTrigger** -- Styled wrapper around `Menu.Trigger`. Button that opens the menu.
- **MenuPortal** -- Wraps `Menu.Portal`. Renders children into a portal (used internally by `MenuContent`).
- **MenuPositioner** -- Styled wrapper around `Menu.Positioner`. Handles popup positioning with a default `sideOffset` of `6`.
- **MenuContent** -- Convenience component that composes the portal, positioner, and popup. This is what you typically use.
- **MenuItem** -- Styled wrapper around `Menu.Item`. A single actionable item. Accepts an `inset` prop to align with checkbox/radio items.
- **MenuCheckboxItem** -- Styled wrapper around `Menu.CheckboxItem`. A togglable item with a check indicator.
- **MenuRadioGroup** -- Wraps `Menu.RadioGroup`. Groups radio items for single selection.
- **MenuRadioItem** -- Styled wrapper around `Menu.RadioItem`. A radio-selectable item with a dot indicator.
- **MenuLabel** -- Styled wrapper around `Menu.GroupLabel`. A non-interactive label for a group of items. Accepts an `inset` prop.
- **MenuSeparator** -- Styled wrapper around `Menu.Separator`. A horizontal divider between menu sections.
- **MenuShortcut** -- A `<span>` that displays a keyboard shortcut hint, right-aligned within a menu item.
- **MenuSub** -- Wraps `Menu.Root` for nested submenus.
- **MenuSubTrigger** -- Styled wrapper around `Menu.SubmenuTrigger`. Opens a submenu with a chevron icon. Accepts an `inset` prop.
- **MenuSubContent** -- Renders the submenu popup with its own portal and positioner.
- **MenuFilter** -- Wraps `Menu.FilterProvider`. Makes the menu or submenu it wraps filterable. Wrap each filterable submenu in its own `MenuFilter`.
- **MenuInput** -- Styled wrapper around `Menu.Input` with a search icon. Accepts `children`, rendered after the input (for `MenuClear`).
- **MenuClear** -- Styled wrapper around `Menu.Clear`. Clears the filter query. Renders an X icon unless given children.
- **MenuEmpty** -- Styled wrapper around `Menu.Empty`. Shown only when no item matches.
- **MenuList** -- Styled wrapper around `Menu.List`. Holds the filterable items and scrolls past `--available-height`.
