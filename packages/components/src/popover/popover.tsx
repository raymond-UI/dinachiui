"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@dinachi/core"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverPortal = PopoverPrimitive.Portal
const PopoverClose = PopoverPrimitive.Close
const createPopoverHandle = PopoverPrimitive.createHandle

const PopoverPositioner = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Positioner>,
  React.ComponentProps<typeof PopoverPrimitive.Positioner>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
))
PopoverPositioner.displayName = "PopoverPositioner"

const PopoverPopup = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Popup>,
  React.ComponentProps<typeof PopoverPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Popup
    ref={ref}
    className={cn(
      "rounded-lg border bg-popover px-6 py-4 text-popover-foreground shadow-lg outline-none",
      "origin-(--transform-origin)",
      "data-starting-style:scale-90 data-starting-style:opacity-0",
      "data-ending-style:scale-90 data-ending-style:opacity-0",
      "transition-[transform,opacity] duration-150",
      className
    )}
    {...props}
  />
))
PopoverPopup.displayName = "PopoverPopup"

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Popup>,
  React.ComponentProps<typeof PopoverPrimitive.Popup> & {
    readonly side?: React.ComponentProps<typeof PopoverPrimitive.Positioner>["side"]
    readonly align?: React.ComponentProps<typeof PopoverPrimitive.Positioner>["align"]
    readonly sideOffset?: number
    readonly alignOffset?: number
    readonly collisionBoundary?: React.ComponentProps<typeof PopoverPrimitive.Positioner>["collisionBoundary"]
    readonly collisionPadding?: React.ComponentProps<typeof PopoverPrimitive.Positioner>["collisionPadding"]
    readonly sticky?: boolean
    readonly portal?: boolean
  }
>(({
  className,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  alignOffset,
  collisionBoundary,
  collisionPadding,
  sticky,
  portal = true,
  ...props
}, ref) => {
  const content = (
    <PopoverPositioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      sticky={sticky}
    >
      <PopoverPopup ref={ref} className={className} {...props} />
    </PopoverPositioner>
  )

  if (!portal) return content

  return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>
})
PopoverContent.displayName = "PopoverContent"

const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentProps<typeof PopoverPrimitive.Arrow>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn(
      "data-[side=bottom]:top-[-8px]",
      "data-[side=left]:right-[-13px] data-[side=left]:rotate-90",
      "data-[side=right]:left-[-13px] data-[side=right]:-rotate-90",
      "data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180",
      className
    )}
    {...props}
  >
    {children || (
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <path
          d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
          className="fill-popover"
        />
        <path
          d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
          className="fill-border"
        />
        <path
          d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
          className="fill-border"
        />
      </svg>
    )}
  </PopoverPrimitive.Arrow>
))
PopoverArrow.displayName = "PopoverArrow"

const PopoverViewport = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Viewport>,
  React.ComponentProps<typeof PopoverPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Viewport
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
))
PopoverViewport.displayName = "PopoverViewport"

const PopoverTitle = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Title>,
  React.ComponentProps<typeof PopoverPrimitive.Title>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Title
    ref={ref}
    className={cn("mb-2 text-base font-medium leading-none", className)}
    {...props}
  />
))
PopoverTitle.displayName = "PopoverTitle"

const PopoverDescription = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Description>,
  React.ComponentProps<typeof PopoverPrimitive.Description>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Description
    ref={ref}
    className={cn("text-base text-muted-foreground", className)}
    {...props}
  />
))
PopoverDescription.displayName = "PopoverDescription"

const PopoverBackdrop = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Backdrop>,
  React.ComponentProps<typeof PopoverPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/50",
      "data-starting-style:opacity-0 data-ending-style:opacity-0",
      "transition-opacity duration-150",
      className
    )}
    {...props}
  />
))
PopoverBackdrop.displayName = "PopoverBackdrop"

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
  PopoverViewport,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverPortal,
  PopoverBackdrop,
  createPopoverHandle,
}
