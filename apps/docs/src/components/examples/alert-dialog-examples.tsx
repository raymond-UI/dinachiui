import React from 'react';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function DefaultAlertDialogExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        Delete Account
      </AlertDialogTrigger>
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
  );
}

export function ConfirmationAlertDialogExample() {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    // Perform action
    console.log('Action confirmed');
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        Save Changes
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before continuing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don&apos;t Save</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}

export function CustomActionsAlertDialogExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        Clear Data
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all your data including settings, preferences, and saved content.
              You can export your data before clearing if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
            <div className="flex gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Clear All Data
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}