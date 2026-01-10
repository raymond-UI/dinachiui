# Dialog

A popup that opens on top of the entire page, providing a modal interface for user interactions.

## Installation

```bash
npx @dinachi/cli add dialog
```

## Usage

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@/components/dialog"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of what the dialog does.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## API Reference

### Dialog

Groups all parts of the dialog. This is the root component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| open | `boolean` | `undefined` | Controls the open state (controlled mode) |
| onOpenChange | `(open: boolean) => void` | `undefined` | Called when open state changes |
| defaultOpen | `boolean` | `false` | Default open state (uncontrolled mode) |

### DialogTrigger

A button that opens the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### DialogContent

A container for the dialog contents. Includes backdrop and popup automatically.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### DialogTitle

A heading that labels the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### DialogDescription

A paragraph with additional information about the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### DialogClose

A button that closes the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### DialogHeader

Container for dialog header content (title and description).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### DialogFooter

Container for dialog footer content (action buttons).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

## Examples

### Basic Usage

```typescript
<Dialog>
  <DialogTrigger>Open Settings</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription>
        Manage your account settings and preferences.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Form content here */}
    </div>
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <DialogClose>Save changes</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Controlled Dialog

```typescript
function ControlledDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Controlled Dialog</DialogTitle>
          <DialogDescription>
            This dialog's state is controlled by React state.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Dialog with Form

```typescript
<Dialog>
  <DialogTrigger>Create Account</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Account</DialogTitle>
      <DialogDescription>
        Fill in the information below to create your account.
      </DialogDescription>
    </DialogHeader>
    <form className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="name" className="text-right">
          Name
        </label>
        <input
          id="name"
          placeholder="Enter your name"
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="email" className="text-right">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="col-span-3"
        />
      </div>
    </form>
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <DialogClose type="submit">Create Account</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dialog with Custom Styling

```typescript
<Dialog>
  <DialogTrigger className="bg-blue-500 hover:bg-blue-600">
    Open Blue Dialog
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-blue-600">Custom Styled Dialog</DialogTitle>
      <DialogDescription className="text-gray-600">
        This dialog has custom styling applied.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Custom content with styling...
    </div>
    <DialogFooter className="bg-gray-50 -m-6 mt-6 p-6 rounded-b-lg">
      <DialogClose className="border-gray-300">Cancel</DialogClose>
      <DialogClose className="bg-blue-500 text-white border-blue-500">
        Confirm
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Accessibility

- Automatically manages focus when opening and closing
- Supports keyboard navigation (Tab, Shift+Tab, Escape)
- Includes proper ARIA attributes for screen readers
- Backdrop clicks close the dialog by default
- Escape key closes the dialog
- Focus returns to trigger when dialog closes
- Supports nested dialogs

## Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Tab` | Move focus to next focusable element |
| `Shift + Tab` | Move focus to previous focusable element |
| `Escape` | Close the dialog |
| `Enter` | Activate focused button or trigger |
| `Space` | Activate focused button or trigger |

## Base UI Foundation

This component is built on top of `@base-ui/react/dialog`. For more advanced usage and customization options, refer to the [Base UI documentation](https://base-ui.mui.com/react/dialog). 