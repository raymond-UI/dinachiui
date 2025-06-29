# Context Menu

A context menu that appears on right-click or long press, providing contextual actions for the user.

## Installation

```bash
npx @dinachi/cli add context-menu
```

## Usage

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@dinachi/components/context-menu"

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          More Tools
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Developer Tools
          <ContextMenuShortcut>F12</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## With Checkbox Items

```tsx
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@dinachi/components/context-menu"

export function ContextMenuCheckboxDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Reload</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## With Radio Group

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@dinachi/components/context-menu"

export function ContextMenuRadioDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuRadioItem value="pedro">Pedro</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## With Submenu

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@dinachi/components/context-menu"

export function ContextMenuSubDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Save Page As...</ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## API Reference

### ContextMenu

The root component that manages the context menu state.

### ContextMenuTrigger

The element that triggers the context menu on right-click or long press.

### ContextMenuContent

The popup content that contains menu items.

**Props:**
- `className?` - Additional CSS classes
- All props from `BaseContextMenu.Popup`

### ContextMenuItem

A menu item that can be activated.

**Props:**
- `inset?` - Whether to add left padding for alignment with items that have icons
- `className?` - Additional CSS classes
- All props from `BaseContextMenu.Item`

### ContextMenuCheckboxItem

A menu item that works as a checkbox.

**Props:**
- `checked?` - Whether the item is checked
- `className?` - Additional CSS classes
- All props from `BaseContextMenu.CheckboxItem`

### ContextMenuRadioGroup

Groups related radio items.

### ContextMenuRadioItem

A menu item that works as a radio button.

**Props:**
- `value` - The value for the radio item
- `className?` - Additional CSS classes
- All props from `BaseContextMenu.RadioItem`

### ContextMenuSeparator

A visual separator between menu items.

### ContextMenuShortcut

Displays keyboard shortcuts for menu items.

### ContextMenuSub

Creates a submenu.

### ContextMenuSubTrigger

Triggers a submenu.

**Props:**
- `inset?` - Whether to add left padding for alignment
- `className?` - Additional CSS classes

### ContextMenuSubContent

The content of a submenu. 