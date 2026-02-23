"use client"

import * as React from "react"
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog"
import { cn } from "@/lib/utils"

const AlertDialog = BaseAlertDialog.Root
const AlertDialogTrigger = BaseAlertDialog.Trigger
const AlertDialogPortal = BaseAlertDialog.Portal

const AlertDialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAlertDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Backdrop
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
AlertDialogBackdrop.displayName = "AlertDialogBackdrop"

const AlertDialogViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAlertDialog.Viewport>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Viewport
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center overflow-auto",
      className
    )}
    {...props}
  />
))
AlertDialogViewport.displayName = "AlertDialogViewport"

const AlertDialogPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAlertDialog.Popup>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Popup
    ref={ref}
    className={cn(
      "w-[95%] max-w-lg gap-4 rounded-lg border bg-background p-6 shadow-lg",
      "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
      "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
      "transition-all duration-150",
      className
    )}
    {...props}
  />
))
AlertDialogPopup.displayName = "AlertDialogPopup"

const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseAlertDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Title
    ref={ref}
    className={cn("text-lg font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseAlertDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors",
      "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAlertDialog.Close>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Close
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors",
      "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-1.5",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAlertDialog.Popup>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogBackdrop />
    <AlertDialogViewport>
      <AlertDialogPopup ref={ref} className={className} {...props}>
        {children}
      </AlertDialogPopup>
    </AlertDialogViewport>
  </AlertDialogPortal>
))
AlertDialogContent.displayName = "AlertDialogContent"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogViewport,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
}
