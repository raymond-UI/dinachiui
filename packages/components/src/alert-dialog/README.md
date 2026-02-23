# AlertDialog

A modal dialog that interrupts the user with important content and expects a response.

## Installation

```bash
npx @dinachi/cli@latest add alert-dialog
```

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogViewport,
  AlertDialogPopup,
  AlertDialogBackdrop,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
```

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>
    Delete Account
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## API Reference

- **AlertDialog** -- Wraps `AlertDialog.Root` from Base UI. Controls open state.
- **AlertDialogTrigger** -- Direct re-export of `AlertDialog.Trigger`. Renders a `<button>`. Compose with the `render` prop for styling (e.g., `render={<Button variant="destructive" />}`).
- **AlertDialogPortal** -- Direct re-export of `AlertDialog.Portal`. Renders children into a portal outside the DOM tree.
- **AlertDialogBackdrop** -- Styled wrapper around `AlertDialog.Backdrop`. Semi-transparent overlay behind the dialog.
- **AlertDialogViewport** -- Styled wrapper around `AlertDialog.Viewport`. Full-screen centering container with scroll support.
- **AlertDialogPopup** -- Styled wrapper around `AlertDialog.Popup`. The raw popup panel (used internally by `AlertDialogContent`).
- **AlertDialogContent** -- Convenience component that composes `AlertDialogPortal`, `AlertDialogBackdrop`, `AlertDialogViewport`, and `AlertDialogPopup` together. This is what you typically use.
- **AlertDialogHeader** -- Layout wrapper (`div`) for the title and description area.
- **AlertDialogTitle** -- Styled wrapper around `AlertDialog.Title`. Renders the dialog heading.
- **AlertDialogDescription** -- Styled wrapper around `AlertDialog.Description`. Renders supporting text below the title.
- **AlertDialogFooter** -- Layout wrapper (`div`) for action buttons.
- **AlertDialogAction** -- Styled wrapper around `AlertDialog.Close`. Primary button that confirms the action and closes the dialog.
- **AlertDialogCancel** -- Styled wrapper around `AlertDialog.Close`. Outline button that cancels and closes the dialog.
