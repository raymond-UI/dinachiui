# Menubar

A visually persistent menu common in desktop applications that provides access to a consistent set of commands.

## Installation

```bash
npx @dinachi/cli@latest add menubar
```

## Usage

```tsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar"
```

```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarPortal>
      <MenubarPositioner>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>Ctrl+T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarPositioner>
    </MenubarPortal>
  </MenubarMenu>
</Menubar>
```

## API Reference

- **Menubar** -- Styled wrapper around `Menubar` from Base UI. The persistent horizontal bar that contains menu triggers.
- **MenubarMenu** -- Wraps `Menu.Root` from Base UI. Represents a single menu within the menubar.
- **MenubarTrigger** -- Styled wrapper around `Menu.Trigger`. The button label displayed in the menubar.
- **MenubarPortal** -- Wraps `Menu.Portal`. Renders dropdown content into a portal.
- **MenubarPositioner** -- Styled wrapper around `Menu.Positioner`. Positions the dropdown with a default `sideOffset` of `4`.
- **MenubarContent** -- Styled wrapper around `Menu.Popup`. The dropdown panel containing menu items.
- **MenubarItem** -- Styled wrapper around `Menu.Item`. A single actionable item. Accepts an `inset` prop.
- **MenubarCheckboxItem** -- Styled wrapper around `Menu.CheckboxItem`. A togglable item with a check indicator.
- **MenubarRadioGroup** -- Wraps `Menu.RadioGroup`. Groups radio items for single selection.
- **MenubarRadioItem** -- Styled wrapper around `Menu.RadioItem`. A radio-selectable item with a dot indicator.
- **MenubarGroup** -- Wraps `Menu.Group`. Groups related items together.
- **MenubarLabel** -- Styled wrapper around `Menu.GroupLabel`. A non-interactive label for a group. Accepts an `inset` prop.
- **MenubarSeparator** -- Styled wrapper around `Menu.Separator`. A horizontal divider.
- **MenubarShortcut** -- A `<span>` that displays a keyboard shortcut hint, right-aligned.
- **MenubarSub** -- Wraps `Menu.SubmenuRoot` for nested submenus.
- **MenubarSubTrigger** -- Styled wrapper around `Menu.SubmenuTrigger`. Opens a submenu with a chevron icon. Accepts an `inset` prop.
- **MenubarSubContent** -- Renders the submenu popup with its own portal and positioner.
