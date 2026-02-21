"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { useRender } from "@base-ui/react/use-render"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const Menu = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Root>,
  React.ComponentProps<typeof MenuPrimitive.Root>
>(({ children, ...props }, ref) => {
  const element = useRender({
    render: <MenuPrimitive.Root>{children}</MenuPrimitive.Root>,
    props,
    ref,
  })

  return element
})
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

const MenuPortal = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Portal>,
  React.ComponentProps<typeof MenuPrimitive.Portal>
>(({ ...props }, ref) => {
  const element = useRender({
    render: <MenuPrimitive.Portal />,
    props,
    ref,
  })

  return element
})
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
          "z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "origin-[var(--transform-origin)] outline-none",
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

const MenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentProps<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
))
MenuCheckboxItem.displayName = "MenuCheckboxItem"

const MenuRadioGroup = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.RadioGroup>,
  React.ComponentProps<typeof MenuPrimitive.RadioGroup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.RadioGroup ref={ref} className={cn(className)} {...props} />
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
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current data-[checked]:block data-[unchecked]:hidden" />
    </span>
    {children}
  </MenuPrimitive.RadioItem>
))
MenuRadioItem.displayName = "MenuRadioItem"

const MenuLabel = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.GroupLabel>,
  React.ComponentProps<typeof MenuPrimitive.GroupLabel> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
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

const MenuSub = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Root>,
  React.ComponentProps<typeof MenuPrimitive.Root>
>(({ children, ...props }, ref) => {
  const element = useRender({
    render: <MenuPrimitive.Root>{children}</MenuPrimitive.Root>,
    props,
    ref,
  })

  return element
})
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
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "origin-[var(--transform-origin)] outline-none",
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
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
}
