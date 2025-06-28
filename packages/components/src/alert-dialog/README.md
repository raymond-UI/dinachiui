# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response.

## Features

- Built on top of Base UI's AlertDialog for full accessibility
- Keyboard navigation support (Escape to close, Tab navigation)
- Focus management and trapping
- Backdrop click to close
- Controlled and uncontrolled modes
- Fully customizable with Tailwind CSS
- TypeScript support

## Usage

### Basic Alert Dialog

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@dinachi/components";

export function BasicAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete account</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Yes, delete account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
```

### Controlled Alert Dialog

```tsx
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@dinachi/components";

export function ControlledAlertDialog() {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    // Perform your action here
    console.log("Confirmed!");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>Delete item</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
```

### Custom Styling

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@dinachi/components";

export function CustomAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-red-600 hover:bg-red-700">
        Dangerous action
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop className="bg-red-900/20" />
        <AlertDialogPopup className="border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-900">
              Danger Zone
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-700">
              This is a destructive action that cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              I understand the risks
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
```

## API Reference

### AlertDialog

The root component that manages the dialog state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | Whether the dialog is open (controlled mode) |
| `defaultOpen` | `boolean` | `false` | Whether the dialog is open initially (uncontrolled mode) |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired when the open state changes |

### AlertDialogTrigger

A button that opens the dialog when clicked.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |
| `asChild` | `boolean` | `false` | Render as a different element |

### AlertDialogPortal

Renders the dialog content in a portal (typically at the end of the document body).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `HTMLElement` | `document.body` | The container element to render the portal into |

### AlertDialogBackdrop

The backdrop/overlay behind the dialog.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |

### AlertDialogPopup

The dialog content container.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |
| `initialFocus` | `RefObject<HTMLElement>` | `undefined` | Element to focus when the dialog opens |
| `finalFocus` | `RefObject<HTMLElement>` | `undefined` | Element to focus when the dialog closes |

### AlertDialogTitle

The dialog title (used for accessibility).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |

### AlertDialogDescription

The dialog description (used for accessibility).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |

### AlertDialogAction

A button that performs the primary action and closes the dialog.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onClick` | `() => void` | `undefined` | Click handler |

### AlertDialogCancel

A button that cancels the action and closes the dialog.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onClick` | `() => void` | `undefined` | Click handler |

### AlertDialogHeader

A wrapper for the title and description.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |

### AlertDialogFooter

A wrapper for the action buttons.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `undefined` | Additional CSS classes |

## Accessibility

The AlertDialog component is built with accessibility in mind:

- **Focus Management**: Focus is trapped within the dialog when open
- **Keyboard Navigation**: 
  - `Escape` closes the dialog
  - `Tab` and `Shift+Tab` cycle through focusable elements
- **Screen Reader Support**: Proper ARIA attributes are applied
- **Initial Focus**: The first focusable element receives focus when opened
- **Return Focus**: Focus returns to the trigger when closed

## Examples

### Confirmation Dialog

```tsx
function DeleteConfirmation({ onConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected items. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
```

### Warning Dialog

```tsx
function WarningDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-yellow-600 hover:bg-yellow-700">
        Proceed with caution
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Warning</AlertDialogTitle>
            <AlertDialogDescription>
              This action may have unintended consequences. Please review before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction>I understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
``` 