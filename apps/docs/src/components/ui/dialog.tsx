"use client"
import * as React from "react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

const Dialog = BaseDialog.Root

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Trigger>
>(({ className, ...props }, ref) => (
  <BaseDialog.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "bg-primary text-primary-foreground hover:bg-primary/90",
      "h-10 px-4 py-2",
      className
    )}
    {...props}
  />
))
DialogTrigger.displayName = "DialogTrigger"

const DialogPortal = BaseDialog.Portal

const DialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-all duration-150",
      className
    )}
    {...props}
  />
))
DialogBackdrop.displayName = "DialogBackdrop"

const DialogPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDialog.Popup>
>(({ className, ...props }, ref) => (
  <BaseDialog.Popup
    ref={ref}
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
      "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
      "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
      "transition-all duration-150",
      className
    )}
    {...props}
  />
))
DialogPopup.displayName = "DialogPopup"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseDialog.Close
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold shadow-sm transition-colors",
      "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
DialogClose.displayName = "DialogClose"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDialog.Popup>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogBackdrop />
    <DialogPopup ref={ref} className={className} {...props}>
      {children}
    </DialogPopup>
  </DialogPortal>
))
DialogContent.displayName = "DialogContent"

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
} 