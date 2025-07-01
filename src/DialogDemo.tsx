import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@dinachi/components"
import * as React from "react"

export function DialogDemo() {
  const [controlledOpen, setControlledOpen] = React.useState(false)

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dialog Demo</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Dialog</h3>
        <Dialog>
          <DialogTrigger>Open Basic Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Basic Dialog</DialogTitle>
              <DialogDescription>
                This is a basic dialog with a title and description. You can close it by clicking the close button, pressing Escape, or clicking outside.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Form Dialog</h3>
        <Dialog>
          <DialogTrigger>Create Account</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>
                Fill in the information below to create your account.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  placeholder="Enter your name"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="password" className="text-right text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </form>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <DialogClose className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Account
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Controlled Dialog</h3>
        <div className="flex gap-2">
          <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
            <DialogTrigger>Open Controlled Dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Controlled Dialog</DialogTitle>
                <DialogDescription>
                  This dialog's state is controlled by React state. The open state is: {controlledOpen ? 'open' : 'closed'}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <button
            onClick={() => setControlledOpen(!controlledOpen)}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Toggle Externally
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Confirmation Dialog</h3>
        <Dialog>
          <DialogTrigger className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete Account
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <DialogClose className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Account
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styled Dialog</h3>
        <Dialog>
          <DialogTrigger className="bg-blue-600 text-white hover:bg-blue-700">
            Open Blue Dialog
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-blue-600">Custom Styled Dialog</DialogTitle>
              <DialogDescription className="text-gray-600">
                This dialog demonstrates custom styling with a wider layout and different colors.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Information</h4>
                <p className="text-blue-700 text-sm">
                  This content area can contain any custom styling and layout you need for your specific use case.
                </p>
              </div>
            </div>
            <DialogFooter className="bg-gray-50 -m-6 mt-6 p-6 rounded-b-lg">
              <DialogClose className="border-gray-300">Cancel</DialogClose>
              <DialogClose className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700">
                Confirm
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings Dialog</h3>
        <Dialog>
          <DialogTrigger>Open Settings</DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Configure your application preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <label htmlFor="notifications" className="text-sm font-medium">
                  Notifications
                </label>
                <input type="checkbox" id="notifications" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="dark-mode" className="text-sm font-medium">
                  Dark Mode
                </label>
                <input type="checkbox" id="dark-mode" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="auto-save" className="text-sm font-medium">
                  Auto Save
                </label>
                <input type="checkbox" id="auto-save" className="rounded" defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <DialogClose className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 