"use client"

import * as React from "react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { type AgentOpenParts, useAgentOpen, useHasAgent, useMergedRef } from "@/components/ui/agent"

const DialogAgentContext = React.createContext<AgentOpenParts | null>(null)

/**
 * Base UI's root, holding its own open state so an agent can open and close it the way a
 * parent would. Controlled use is unchanged, and `onOpenChange` sees the agent's changes
 * first and can cancel them. Closed, the agent sees the trigger; open, the popup.
 */
function Dialog<Payload>({ open, defaultOpen, onOpenChange, ...props }: BaseDialog.Root.Props<Payload>) {
  const [state, change, parts] = useAgentOpen("dialog", open, defaultOpen, onOpenChange)
  return (
    <DialogAgentContext.Provider value={useHasAgent() ? parts : null}>
      <BaseDialog.Root<Payload> {...props} open={state} onOpenChange={change} />
    </DialogAgentContext.Provider>
  )
}

function DialogTrigger<Payload>({ ref, ...props }: BaseDialog.Trigger.Props<Payload> & React.RefAttributes<HTMLElement>) {
  const dialog = React.useContext(DialogAgentContext)
  return <BaseDialog.Trigger<Payload> ref={useMergedRef(ref, dialog?.trigger)} {...props} />
}

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
      "transition-opacity duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
      "data-[ending-style]:duration-[var(--motion-duration-fast,150ms)]",
      className
    )}
    {...props}
  />
))
DialogBackdrop.displayName = "DialogBackdrop"

const DialogViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDialog.Viewport>
>(({ className, ...props }, ref) => (
  <BaseDialog.Viewport
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center overflow-auto",
      className
    )}
    {...props}
  />
))
DialogViewport.displayName = "DialogViewport"

const DialogPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDialog.Popup>
>(({ className, ...props }, ref) => {
  const dialog = React.useContext(DialogAgentContext)
  const mergedRef = useMergedRef(ref, dialog?.popup)
  return (
  <BaseDialog.Popup
    ref={mergedRef}
    className={cn(
      "w-[95%] max-w-lg gap-4 rounded-lg border bg-background p-6 shadow-lg",
      // A dialog is not anchored to its trigger, so scaling from the centre is correct
      // here in a way it is not for a popover.
      "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
      "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
      "motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
      "transition-[transform,scale,opacity] duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
      // Slower in than out. The user is deciding on the way in and has already decided
      // on the way out.
      "data-[ending-style]:duration-[var(--motion-duration-fast,150ms)]",
      className
    )}
    {...props}
  />
  )
})
DialogPopup.displayName = "DialogPopup"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn("text-lg font-medium leading-none tracking-tight", className)}
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
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors",
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
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-1.5",
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
    <DialogViewport>
      <DialogPopup ref={ref} className={className} {...props}>
        {children}
      </DialogPopup>
    </DialogViewport>
  </DialogPortal>
))
DialogContent.displayName = "DialogContent"

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogViewport,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
}
