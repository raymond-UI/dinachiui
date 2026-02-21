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
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
```

```tsx
<AlertDialog>
  <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
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
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogPopup>
  </AlertDialogPortal>
</AlertDialog>
```

## API Reference

- **AlertDialog** -- Root component that manages open state. Wraps `AlertDialog.Root` from Base UI.
- **AlertDialogTrigger** -- Button that opens the dialog. Extends `AlertDialog.Trigger` from Base UI. Styled as a primary button by default.
- **AlertDialogPortal** -- Renders children into a portal. Wraps `AlertDialog.Portal` from Base UI.
- **AlertDialogBackdrop** -- Semi-transparent overlay behind the dialog. Extends `AlertDialog.Backdrop` from Base UI. Animates opacity on open/close.
- **AlertDialogPopup** -- The centered dialog container. Extends `AlertDialog.Popup` from Base UI. Animates scale and opacity on open/close.
- **AlertDialogTitle** -- The dialog title. Extends `AlertDialog.Title` from Base UI.
- **AlertDialogDescription** -- The dialog description text. Extends `AlertDialog.Description` from Base UI.
- **AlertDialogAction** -- A button that confirms the action and closes the dialog. Extends `AlertDialog.Close` from Base UI. Styled as a primary button.
- **AlertDialogCancel** -- A button that cancels and closes the dialog. Extends `AlertDialog.Close` from Base UI. Styled as an outline button.
- **AlertDialogHeader** -- Layout wrapper for title and description. A plain `div` with flex column styling.
- **AlertDialogFooter** -- Layout wrapper for action buttons. A plain `div` with responsive flex row styling.
