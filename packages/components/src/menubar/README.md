# Menubar

A visually persistent menu common in desktop applications that provides access to a consistent set of commands.

## Installation

```bash
npx @dinachi/cli add menubar
```

## Usage

```typescript
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/menubar"

export function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

## API Reference

### Menubar

The root container that holds multiple menus.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | The orientation of the menubar |
| loop | `boolean` | `true` | Whether to loop focus when reaching the end |

### MenubarMenu

A single menu within the menubar.

### MenubarTrigger

The button that activates a menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| disabled | `boolean` | `false` | Whether the trigger is disabled |

### MenubarContent

The popup that contains menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| align | `"start" \| "center" \| "end"` | `"start"` | How to align the content relative to the trigger |
| sideOffset | `number` | `4` | Distance from the trigger |

### MenubarItem

A menu item that can be activated.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| disabled | `boolean` | `false` | Whether the item is disabled |
| inset | `boolean` | `false` | Whether to add left padding for alignment |

### MenubarCheckboxItem

A menu item that works as a checkbox.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | `boolean` | - | Whether the item is checked |
| onCheckedChange | `(checked: boolean) => void` | - | Callback when checked state changes |
| className | `string` | - | Additional CSS classes |

### MenubarRadioGroup

Groups related radio items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | The controlled value |
| onValueChange | `(value: string) => void` | - | Callback when value changes |

### MenubarRadioItem

A menu item that works as a radio button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | The value for the radio item |
| className | `string` | - | Additional CSS classes |

### MenubarSeparator

A visual separator between menu items.

### MenubarShortcut

A component to display keyboard shortcuts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |

### MenubarSub, MenubarSubTrigger, MenubarSubContent

Components for creating nested submenus.

## Examples

### Basic Menubar

```typescript
export function BasicMenubar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
          <MenubarItem>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

### With Shortcuts

```typescript
export function MenubarWithShortcuts() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

### With Checkboxes and Radio Items

```typescript
export function MenubarWithToggles() {
  const [showToolbar, setShowToolbar] = useState(true)
  const [view, setView] = useState("list")

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={showToolbar}
            onCheckedChange={setShowToolbar}
          >
            Show Toolbar
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={view} onValueChange={setView}>
            <MenubarRadioItem value="list">List View</MenubarRadioItem>
            <MenubarRadioItem value="grid">Grid View</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

### With Submenus

```typescript
export function MenubarWithSubmenus() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>PDF</MenubarItem>
              <MenubarItem>PNG</MenubarItem>
              <MenubarItem>SVG</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
```

## Accessibility

- Supports keyboard navigation with arrow keys
- Enter and Space activate menu items
- Escape closes open menus
- Focus management between menubar and menu items
- Screen reader announcements for menu states
- Supports disabled states
- ARIA attributes for proper screen reader support

## Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Tab` | Move focus to the next/previous menu trigger |
| `Enter` / `Space` | Open the menu or activate a menu item |
| `Escape` | Close the open menu |
| `ArrowDown` | Open menu (if closed) or move focus to next item |
| `ArrowUp` | Open menu (if closed) or move focus to previous item |
| `ArrowRight` | Move focus to next menu trigger or open submenu |
| `ArrowLeft` | Move focus to previous menu trigger or close submenu |

## Base UI Foundation

This component is built on top of `@base-ui/react/menubar` and `@base-ui/react/menu`. For more advanced usage and customization options, refer to the [Base UI documentation](https://base-ui.mui.com/).

## Advanced Features

- **Multiple Menus**: Support for multiple menu triggers in a single menubar
- **Nested Submenus**: Create complex hierarchical menu structures
- **Controlled State**: Full control over open/closed states
- **Custom Positioning**: Configurable alignment and offset options
- **Keyboard Navigation**: Complete keyboard accessibility
- **Portal Support**: Render menus in a different DOM location
- **RTL Support**: Full right-to-left language support 