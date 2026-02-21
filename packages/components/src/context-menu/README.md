# ContextMenu

A menu that appears at the pointer on right click or long press.

## Installation

```bash
npx @dinachi/cli@latest add context-menu
```

## Usage

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu"
```

```tsx
<ContextMenu>
  <ContextMenuTrigger>
    <div className="flex h-36 w-64 items-center justify-center rounded-md border border-dashed">
      Right click here
    </div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      Back <ContextMenuShortcut>Cmd+[</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>
      Forward <ContextMenuShortcut>Cmd+]</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuSub>
      <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Save Page As...</ContextMenuItem>
        <ContextMenuItem>Create Shortcut...</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>
```

## API Reference

- **ContextMenu** -- Root component that manages state. Wraps `ContextMenu.Root` from Base UI.
- **ContextMenuTrigger** -- The area that responds to right click or long press. Extends `ContextMenu.Trigger` from Base UI.
- **ContextMenuContent** -- The popup menu container. Wraps `ContextMenu.Popup` from Base UI with portal and positioner. Animates on open/close. Accepts an optional `container` prop for custom portal targets.
- **ContextMenuItem** -- A menu item. Extends `ContextMenu.Item` from Base UI. Accepts an optional `inset` prop for additional left padding.
- **ContextMenuCheckboxItem** -- A menu item with a checkbox indicator. Extends `ContextMenu.CheckboxItem` from Base UI. Accepts `checked` and `onCheckedChange` props.
- **ContextMenuRadioGroup** -- Groups radio items together. Extends `ContextMenu.RadioGroup` from Base UI. Accepts `value` and `onValueChange` props.
- **ContextMenuRadioItem** -- A menu item within a radio group. Extends `ContextMenu.RadioItem` from Base UI. Shows a circle indicator when selected.
- **ContextMenuLabel** -- A non-interactive label for a section. Extends `ContextMenu.GroupLabel` from Base UI. Accepts an optional `inset` prop.
- **ContextMenuSeparator** -- A visual divider between menu sections. Extends `ContextMenu.Separator` from Base UI.
- **ContextMenuShortcut** -- Displays a keyboard shortcut hint. A plain `span` styled with muted text, typically placed inside a `ContextMenuItem`.
- **ContextMenuSub** -- Root for a submenu. Wraps `Menu.SubmenuRoot` from Base UI.
- **ContextMenuSubTrigger** -- Menu item that opens a submenu. Extends `Menu.SubmenuTrigger` from Base UI. Includes a chevron icon. Accepts an optional `inset` prop.
- **ContextMenuSubContent** -- The submenu popup container. Wraps `Menu.Popup` from Base UI with portal and positioner. Animates on open/close.
