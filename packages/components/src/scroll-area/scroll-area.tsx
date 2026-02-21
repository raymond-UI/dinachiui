"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "@dinachi/core"

const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  />
))
ScrollArea.displayName = "ScrollArea"

const ScrollAreaViewport = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn("size-full rounded-[inherit]", className)}
    {...props}
  />
))
ScrollAreaViewport.displayName = "ScrollAreaViewport"

const ScrollAreaContent = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Content
    ref={ref}
    className={cn("min-w-full", className)}
    {...props}
  />
))
ScrollAreaContent.displayName = "ScrollAreaContent"

const ScrollAreaScrollbar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none p-0.5 transition-colors",
      orientation === "vertical"
        ? "h-full w-2.5 border-l border-l-transparent"
        : "h-2.5 w-full flex-col border-t border-t-transparent",
      className
    )}
    {...props}
  />
))
ScrollAreaScrollbar.displayName = "ScrollAreaScrollbar"

const ScrollAreaThumb = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb
    ref={ref}
    className={cn("relative flex-1 rounded-full bg-border", className)}
    {...props}
  />
))
ScrollAreaThumb.displayName = "ScrollAreaThumb"

const ScrollAreaCorner = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Corner>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Corner>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Corner
    ref={ref}
    className={cn("bg-background", className)}
    {...props}
  />
))
ScrollAreaCorner.displayName = "ScrollAreaCorner"

export {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
}
