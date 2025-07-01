import * as React from "react";
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
} from "@dinachi/components/alert-dialog";

export function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    alert("Action confirmed!");
    setOpen(false);
  };

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">Alert Dialog Demo</h2>

      {/* Basic Alert Dialog */}
      <div>
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <AlertDialog>
          <AlertDialogTrigger className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Open Dialog
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
      </div>

      {/* Controlled Alert Dialog */}
      <div>
        <h3 className="text-lg font-semibold">Controlled Dialog</h3>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600">
            {open ? "Close Dialog" : "Open Controlled Dialog"}
          </AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogBackdrop />
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Controlled Action</AlertDialogTitle>
                <AlertDialogDescription>
                  This dialog is controlled by state. Confirm to proceed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialogPortal>
        </AlertDialog>
      </div>

      {/* Alert Dialog with Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <AlertDialog>
          <AlertDialogTrigger className="rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600">
            Styled Dialog
          </AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogBackdrop className="bg-purple-900/50" />
            <AlertDialogPopup className="border-purple-500 bg-purple-100 text-purple-900">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-purple-800">
                  Custom Styled Alert
                </AlertDialogTitle>
                <AlertDialogDescription className="text-purple-700">
                  This dialog has custom background and popup styles.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-purple-500 text-purple-700 hover:bg-purple-200">
                  Dismiss
                </AlertDialogCancel>
                <AlertDialogAction className="bg-purple-600 hover:bg-purple-700">
                  Accept
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialogPortal>
        </AlertDialog>
      </div>
    </div>
  );
}
