"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

// Re-export root components for better tree-shaking
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverPortal = PopoverPrimitive.Portal
const PopoverClose = PopoverPrimitive.Close

// Optimized PopoverContent with better positioning and animations
const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> & {
    readonly sideOffset?: number
    readonly align?: "start" | "center" | "end"
    readonly side?: "top" | "bottom" | "left" | "right"
    readonly portal?: boolean
  }
>(({ className, align = "center", side = "bottom", sideOffset = 8, portal = true, ...props }, ref) => {
  const content = (
    <PopoverPrimitive.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
    >
      <PopoverPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 rounded-lg border bg-popover px-6 py-4 text-popover-foreground shadow-lg outline-none",
          "origin-(--transform-origin)",
          "data-starting-style:scale-90 data-starting-style:opacity-0",
          "data-ending-style:scale-90 data-ending-style:opacity-0",
          "transition-[transform,opacity] duration-150",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  )

  if (!portal) return content

  return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>
})
PopoverContent.displayName = "PopoverContent"

// Optimized PopoverArrow
const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
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

// Optimized PopoverTitle
const PopoverTitle = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Title>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Title
    ref={ref}
    className={cn("mb-2 text-base font-medium leading-none", className)}
    {...props}
  />
))
PopoverTitle.displayName = "PopoverTitle"

// Optimized PopoverDescription
const PopoverDescription = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Description>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Description
    ref={ref}
    className={cn("text-base text-muted-foreground", className)}
    {...props}
  />
))
PopoverDescription.displayName = "PopoverDescription"

// Optimized PopoverBackdrop
const PopoverBackdrop = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Backdrop>
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
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverPortal,
  PopoverBackdrop,
}

