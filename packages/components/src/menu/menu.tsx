"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@dinachi/core"

const Menu: React.FC<React.ComponentProps<typeof MenuPrimitive.Root>> = (props) => (
  <MenuPrimitive.Root {...props} />
)
Menu.displayName = "Menu"

const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof MenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
MenuTrigger.displayName = "MenuTrigger"

const MenuPortal: React.FC<
  React.ComponentProps<typeof MenuPrimitive.Portal>
> = (props) => <MenuPrimitive.Portal {...props} />
MenuPortal.displayName = "MenuPortal"

const MenuPositioner = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Positioner>,
  React.ComponentProps<typeof MenuPrimitive.Positioner>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Positioner
    ref={ref}
    className={cn("outline-none", className)}
    sideOffset={6}
    {...props}
  />
))
MenuPositioner.displayName = "MenuPositioner"

const MenuContent = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Popup>,
  React.ComponentProps<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <MenuPortal>
    <MenuPositioner>
      <MenuPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "origin-(--transform-origin) outline-none",
          "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
          "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
          className
        )}
        {...props}
      />
    </MenuPositioner>
  </MenuPortal>
))
MenuContent.displayName = "MenuContent"

const MenuItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Item>,
  React.ComponentProps<typeof MenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Item
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
MenuItem.displayName = "MenuItem"

const MenuLinkItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.LinkItem>,
  React.ComponentProps<typeof MenuPrimitive.LinkItem>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.LinkItem
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
MenuLinkItem.displayName = "MenuLinkItem"

const MenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentProps<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
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
    <MenuPrimitive.CheckboxItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </MenuPrimitive.CheckboxItemIndicator>
    {children}
  </MenuPrimitive.CheckboxItem>
))
MenuCheckboxItem.displayName = "MenuCheckboxItem"

const MenuRadioGroup = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.RadioGroup>,
  React.ComponentProps<typeof MenuPrimitive.RadioGroup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.RadioGroup ref={ref} className={className} {...props} />
))
MenuRadioGroup.displayName = "MenuRadioGroup"

const MenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentProps<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
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
    <MenuPrimitive.RadioItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current" />
    </MenuPrimitive.RadioItemIndicator>
    {children}
  </MenuPrimitive.RadioItem>
))
MenuRadioItem.displayName = "MenuRadioItem"

const MenuGroup = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Group>,
  React.ComponentProps<typeof MenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Group ref={ref} className={className} {...props} />
))
MenuGroup.displayName = "MenuGroup"

const MenuLabel = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.GroupLabel>,
  React.ComponentProps<typeof MenuPrimitive.GroupLabel> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-medium", inset && "pl-8", className)}
    {...props}
  />
))
MenuLabel.displayName = "MenuLabel"

const MenuSeparator = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Separator>,
  React.ComponentProps<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
MenuSeparator.displayName = "MenuSeparator"

const MenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
    {...props}
  />
)
MenuShortcut.displayName = "MenuShortcut"

const MenuSub: React.FC<React.ComponentProps<typeof MenuPrimitive.SubmenuRoot>> = (props) => (
  <MenuPrimitive.SubmenuRoot {...props} />
)
MenuSub.displayName = "MenuSub"

const MenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.SubmenuTrigger>,
  React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenuPrimitive.SubmenuTrigger
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
  </MenuPrimitive.SubmenuTrigger>
))
MenuSubTrigger.displayName = "MenuSubTrigger"

const MenuSubContent = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Popup>,
  React.ComponentProps<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner className="outline-none" alignOffset={-4} sideOffset={8}>
      <MenuPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "origin-(--transform-origin) outline-none",
          "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
          "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
          className
        )}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
))
MenuSubContent.displayName = "MenuSubContent"

export {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
}
