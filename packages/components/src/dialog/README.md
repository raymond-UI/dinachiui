# Dialog

A popup that opens on top of the entire page, providing a modal interface for user interactions.

## Installation

```bash
npx @dinachi/cli@latest add dialog
```

## Usage

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
```

```tsx
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## API Reference

- **Dialog** -- Wraps `Dialog.Root` from Base UI. Controls open state.
- **DialogTrigger** -- Styled wrapper around `Dialog.Trigger`. Renders a button that opens the dialog.
- **DialogPortal** -- Wraps `Dialog.Portal`. Renders children into a portal outside the DOM tree.
- **DialogBackdrop** -- Styled wrapper around `Dialog.Backdrop`. Semi-transparent overlay behind the dialog.
- **DialogPopup** -- Styled wrapper around `Dialog.Popup`. The raw popup panel (used internally by `DialogContent`).
- **DialogContent** -- Convenience component that composes `DialogPortal`, `DialogBackdrop`, and `DialogPopup` together. This is what you typically use.
- **DialogHeader** -- Layout wrapper (`div`) for the title and description area.
- **DialogTitle** -- Styled wrapper around `Dialog.Title`. Renders the dialog heading.
- **DialogDescription** -- Styled wrapper around `Dialog.Description`. Renders supporting text below the title.
- **DialogFooter** -- Layout wrapper (`div`) for action buttons.
- **DialogClose** -- Styled wrapper around `Dialog.Close`. Button that closes the dialog.
