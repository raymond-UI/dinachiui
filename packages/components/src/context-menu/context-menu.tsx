"use client"

import * as React from "react"
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu"
import { cn } from "@dinachi/core"
import { Check, ChevronRight, Circle } from "lucide-react"

const ContextMenu: React.FC<React.ComponentProps<typeof BaseContextMenu.Root>> = (props) => (
  <BaseContextMenu.Root {...props} />
)
ContextMenu.displayName = "ContextMenu"

const ContextMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Trigger>,
  React.ComponentProps<typeof BaseContextMenu.Trigger>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Trigger
    ref={ref}
    className={cn("select-none", className)}
    {...props}
  />
))
ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuPortal: React.FC<
  React.ComponentProps<typeof BaseContextMenu.Portal>
> = (props) => <BaseContextMenu.Portal {...props} />
ContextMenuPortal.displayName = "ContextMenuPortal"

const ContextMenuPositioner = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Positioner>,
  React.ComponentProps<typeof BaseContextMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Positioner
    ref={ref}
    className={cn("outline-none", className)}
    {...props}
  />
))
ContextMenuPositioner.displayName = "ContextMenuPositioner"

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Popup>,
  React.ComponentProps<typeof BaseContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <ContextMenuPortal>
    <ContextMenuPositioner>
      <BaseContextMenu.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
          "origin-(--transform-origin)",
          "outline-none focus:outline-none focus-visible:outline-none",
          "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
          "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
          className
        )}
        {...props}
      />
    </ContextMenuPositioner>
  </ContextMenuPortal>
))
ContextMenuContent.displayName = "ContextMenuContent"

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Item>,
  React.ComponentProps<typeof BaseContextMenu.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <BaseContextMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuLinkItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.LinkItem>,
  React.ComponentProps<typeof BaseContextMenu.LinkItem>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.LinkItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
ContextMenuLinkItem.displayName = "ContextMenuLinkItem"

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.CheckboxItem>,
  React.ComponentProps<typeof BaseContextMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <BaseContextMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    {...props}
  >
    <BaseContextMenu.CheckboxItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </BaseContextMenu.CheckboxItemIndicator>
    {children}
  </BaseContextMenu.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

const ContextMenuRadioGroup = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.RadioGroup>,
  React.ComponentProps<typeof BaseContextMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioGroup ref={ref} className={className} {...props} />
))
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup"

const ContextMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.RadioItem>,
  React.ComponentProps<typeof BaseContextMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <BaseContextMenu.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    {...props}
  >
    <BaseContextMenu.RadioItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current" />
    </BaseContextMenu.RadioItemIndicator>
    {children}
  </BaseContextMenu.RadioItem>
))
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

const ContextMenuGroup = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Group>,
  React.ComponentProps<typeof BaseContextMenu.Group>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Group ref={ref} className={className} {...props} />
))
ContextMenuGroup.displayName = "ContextMenuGroup"

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.GroupLabel>,
  React.ComponentProps<typeof BaseContextMenu.GroupLabel> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <BaseContextMenu.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-medium text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = "ContextMenuLabel"

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Separator>,
  React.ComponentProps<typeof BaseContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = "ContextMenuSeparator"

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className
    )}
    {...props}
  />
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

const ContextMenuSub: React.FC<React.ComponentProps<typeof BaseContextMenu.SubmenuRoot>> = (props) => (
  <BaseContextMenu.SubmenuRoot {...props} />
)
ContextMenuSub.displayName = "ContextMenuSub"

const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.SubmenuTrigger>,
  React.ComponentProps<typeof BaseContextMenu.SubmenuTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <BaseContextMenu.SubmenuTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </BaseContextMenu.SubmenuTrigger>
))
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Popup>,
  React.ComponentProps<typeof BaseContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Portal>
    <BaseContextMenu.Positioner className="outline-none" alignOffset={-4} sideOffset={8}>
      <BaseContextMenu.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
          "origin-(--transform-origin)",
          "outline-none focus:outline-none focus-visible:outline-none",
          "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
          "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
          className
        )}
        {...props}
      />
    </BaseContextMenu.Positioner>
  </BaseContextMenu.Portal>
))
ContextMenuSubContent.displayName = "ContextMenuSubContent"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
}
