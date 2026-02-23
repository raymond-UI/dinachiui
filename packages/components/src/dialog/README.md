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
  DialogViewport,
  DialogPopup,
  DialogBackdrop,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
```

```tsx
<Dialog>
  <DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>
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
- **DialogTrigger** -- Direct re-export of `Dialog.Trigger`. Renders a `<button>`. Compose with the `render` prop for styling (e.g., `render={<Button />}`).
- **DialogPortal** -- Direct re-export of `Dialog.Portal`. Renders children into a portal outside the DOM tree.
- **DialogBackdrop** -- Styled wrapper around `Dialog.Backdrop`. Semi-transparent overlay behind the dialog.
- **DialogViewport** -- Styled wrapper around `Dialog.Viewport`. Full-screen centering container with scroll support. Provides `data-nested` and `data-nested-dialog-open` attributes for nested dialog patterns.
- **DialogPopup** -- Styled wrapper around `Dialog.Popup`. The raw popup panel (used internally by `DialogContent`).
- **DialogContent** -- Convenience component that composes `DialogPortal`, `DialogBackdrop`, `DialogViewport`, and `DialogPopup` together. This is what you typically use.
- **DialogHeader** -- Layout wrapper (`div`) for the title and description area.
- **DialogTitle** -- Styled wrapper around `Dialog.Title`. Renders the dialog heading.
- **DialogDescription** -- Styled wrapper around `Dialog.Description`. Renders supporting text below the title.
- **DialogFooter** -- Layout wrapper (`div`) for action buttons.
- **DialogClose** -- Styled wrapper around `Dialog.Close`. Button that closes the dialog.
