"use client"
import * as React from "react"
import { Menubar as BaseMenubar } from "@base-ui/react/menubar"
import { Menu } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, Circle } from "lucide-react"
import { useRender } from "@base-ui/react/use-render"


const Menubar = React.forwardRef<
  React.ComponentRef<typeof BaseMenubar>,
  React.ComponentProps<typeof BaseMenubar>
>(({ className, ...props }, ref) => (
  <BaseMenubar
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = "Menubar"

const MenubarMenu = React.forwardRef<
  React.ComponentRef<typeof Menu.Root>,
  React.ComponentProps<typeof Menu.Root>
>(({ children, ...props }, ref) => {
  const element = useRender({
    render: <Menu.Root>{children}</Menu.Root>,
    props,
    ref,
  });
  return element;
});
MenubarMenu.displayName = "MenubarMenu"

const MenubarTrigger = React.forwardRef<
  React.ComponentRef<typeof Menu.Trigger>,
  React.ComponentProps<typeof Menu.Trigger>
>(({ className, ...props }, ref) => (
  <Menu.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = "MenubarTrigger"

const MenubarPortal = React.forwardRef<
  React.ComponentRef<typeof Menu.Portal>,
  React.ComponentProps<typeof Menu.Portal>
>(({ ...props }, ref) => {
  const element = useRender({
    render: <Menu.Portal />,
    props,
    ref,
  });
  return element;
});
MenubarPortal.displayName = "MenubarPortal"

const MenubarPositioner = React.forwardRef<
  React.ComponentRef<typeof Menu.Positioner>,
  React.ComponentProps<typeof Menu.Positioner>
>(({ className, ...props }, ref) => (
  <Menu.Positioner
    ref={ref}
    className={cn("outline-none", className)}
    sideOffset={4}
    {...props}
  />
))
MenubarPositioner.displayName = "MenubarPositioner"

const MenubarContent = React.forwardRef<
  React.ComponentRef<typeof Menu.Popup>,
  React.ComponentProps<typeof Menu.Popup>
>(({ className, ...props }, ref) => (
  <Menu.Popup
    ref={ref}
    className={cn(
      "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "origin-[var(--transform-origin)]",
      "outline-none focus:outline-none focus-visible:outline-none",
      "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
      "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
      className
    )}
    {...props}
  />
))
MenubarContent.displayName = "MenubarContent"

const MenubarItem = React.forwardRef<
  React.ComponentRef<typeof Menu.Item>,
  React.ComponentProps<typeof Menu.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Menu.Item
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
MenubarItem.displayName = "MenubarItem"

const MenubarCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof Menu.CheckboxItem>,
  React.ComponentProps<typeof Menu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <Menu.CheckboxItem
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
  </Menu.CheckboxItem>
))
MenubarCheckboxItem.displayName = "MenubarCheckboxItem"

const MenubarRadioGroup = React.forwardRef<
  React.ComponentRef<typeof Menu.RadioGroup>,
  React.ComponentProps<typeof Menu.RadioGroup>
>(({ className, ...props }, ref) => (
  <Menu.RadioGroup ref={ref} className={cn(className)} {...props} />
))
MenubarRadioGroup.displayName = "MenubarRadioGroup"

const MenubarRadioItem = React.forwardRef<
  React.ComponentRef<typeof Menu.RadioItem>,
  React.ComponentProps<typeof Menu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <Menu.RadioItem
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
  </Menu.RadioItem>
))
MenubarRadioItem.displayName = "MenubarRadioItem"

const MenubarLabel = React.forwardRef<
  React.ComponentRef<typeof Menu.GroupLabel>,
  React.ComponentProps<typeof Menu.GroupLabel> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Menu.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = "MenubarLabel"

const MenubarSeparator = React.forwardRef<
  React.ComponentRef<typeof Menu.Separator>,
  React.ComponentProps<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
  <Menu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
MenubarSeparator.displayName = "MenubarSeparator"

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayName = "MenubarShortcut"

const MenubarSub = React.forwardRef<
  React.ComponentRef<typeof Menu.Root>,
  React.ComponentProps<typeof Menu.Root>
>(({ children, ...props }, ref) => {
  const element = useRender({
    render: <Menu.Root>{children}</Menu.Root>,
    props,
    ref,
  });
  return element;
});
MenubarSub.displayName = "MenubarSub"

const MenubarSubTrigger = React.forwardRef<
  React.ComponentRef<typeof Menu.SubmenuTrigger>,
  React.ComponentProps<typeof Menu.SubmenuTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <Menu.SubmenuTrigger
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
  </Menu.SubmenuTrigger>
))
MenubarSubTrigger.displayName = "MenubarSubTrigger"

const MenubarSubContent = React.forwardRef<
  React.ComponentRef<typeof Menu.Popup>,
  React.ComponentProps<typeof Menu.Popup>
>(({ className, ...props }, ref) => (
  <Menu.Portal>
    <Menu.Positioner className="outline-none" alignOffset={-4} sideOffset={8}>
      <Menu.Popup
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
          "origin-[var(--transform-origin)]",
          "outline-none focus:outline-none focus-visible:outline-none",
          "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
          "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
          className
        )}
        {...props}
      />
    </Menu.Positioner>
  </Menu.Portal>
))
MenubarSubContent.displayName = "MenubarSubContent"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} 