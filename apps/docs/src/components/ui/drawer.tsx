"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "@/lib/utils"

const Drawer = DrawerPrimitive.Root
const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close
const DrawerSwipeArea = DrawerPrimitive.SwipeArea

const DrawerBackdrop = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      // Base UI writes --drawer-swipe-progress on this element as the drag runs: 0 while
      // the drawer is open, 1 once it has travelled far enough to be gone. Reading it
      // here is what makes the dim follow the finger instead of holding full strength
      // until the drawer lets go.
      "opacity-[calc(1_-_var(--drawer-swipe-progress,0))]",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-opacity duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-drawer,cubic-bezier(0.32,0.72,0,1))]",
      // During the drag the opacity is the finger's to set, not a transition's.
      "data-[swiping]:transition-none",
      className
    )}
    {...props}
  />
))
DrawerBackdrop.displayName = "DrawerBackdrop"

type DrawerSide = "top" | "right" | "bottom" | "left"

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Popup> & {
    side?: DrawerSide
  }
>(({ className, side = "right", children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerBackdrop />
    <DrawerPrimitive.Viewport>
      <DrawerPrimitive.Popup
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col gap-4 border bg-background p-6 shadow-lg",
          // A surface that travels in from an edge gets the drawer curve, which decays
          // more slowly than the standard one and reads as weight rather than snap.
          "transition-transform duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-drawer,cubic-bezier(0.32,0.72,0,1))]",
          // Base UI resolves a flick into --drawer-swipe-strength, a multiplier on how
          // long the rest of the journey should take: below 1 for a fast flick, above 1
          // for a slow drag released past the threshold. Without it every dismissal
          // takes the same 200ms and the drawer ignores how hard it was thrown. It is
          // registered with an initial value of 1, so a click-driven close is unchanged.
          "data-[ending-style]:duration-[calc(var(--motion-duration-base,200ms)_*_var(--drawer-swipe-strength,1))]",
          side === "top" &&
            "inset-x-0 top-0 border-b data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
          side === "bottom" &&
            "inset-x-0 bottom-0 border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
          className
        )}
        {...props}
      >
        <DrawerPrimitive.Content className="size-full overflow-y-auto">
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

function DrawerTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-lg font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerSwipeArea,
  DrawerHeader,
  DrawerFooter,
}
