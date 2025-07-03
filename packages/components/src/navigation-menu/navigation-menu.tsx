"use client"

import * as React from "react"
import { NavigationMenu as BaseNavigationMenu } from "@base-ui-components/react/navigation-menu"
import { useRender } from "@base-ui-components/react/use-render"
import { cn } from "@dinachi/core"
import { ChevronDown } from "lucide-react"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Root>,
  React.ComponentProps<typeof BaseNavigationMenu.Root>
>(({ className, children, ...props }, ref) => (
  <BaseNavigationMenu.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
  </BaseNavigationMenu.Root>
))
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.List>,
  React.ComponentProps<typeof BaseNavigationMenu.List>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = "NavigationMenuList"

const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Item>,
  React.ComponentProps<typeof BaseNavigationMenu.Item>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Item
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
NavigationMenuItem.displayName = "NavigationMenuItem"

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Trigger>,
  React.ComponentProps<typeof BaseNavigationMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseNavigationMenu.Trigger
    ref={ref}
    className={cn(
      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[popup-open]:bg-accent/50",
      className
    )}
    {...props}
  >
    {children}{" "}
    <BaseNavigationMenu.Icon
      render={
        <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[popup-open]:rotate-180" />
      }
    />
  </BaseNavigationMenu.Trigger>
))
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Content>,
  React.ComponentProps<typeof BaseNavigationMenu.Content>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full",
      "data-[starting-style]:animate-in data-[starting-style]:fade-in",
      "data-[ending-style]:animate-out data-[ending-style]:fade-out",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = "NavigationMenuContent"

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Link>,
  React.ComponentProps<typeof BaseNavigationMenu.Link>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Link
    ref={ref}
    className={cn(
      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  />
))
NavigationMenuLink.displayName = "NavigationMenuLink"

const NavigationMenuPortal = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Portal>,
  React.ComponentProps<typeof BaseNavigationMenu.Portal>
>(({ ...props }, ref) => {
  const element = useRender({
    render: <BaseNavigationMenu.Portal />,
    props,
    ref,
  });
  return element;
});
NavigationMenuPortal.displayName = "NavigationMenuPortal"

const NavigationMenuPositioner = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Positioner>,
  React.ComponentProps<typeof BaseNavigationMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Positioner
    ref={ref}
    className={cn("absolute left-0 top-full flex justify-center", className)}
    {...props}
  />
))
NavigationMenuPositioner.displayName = "NavigationMenuPositioner"

const NavigationMenuPopup = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Popup>,
  React.ComponentProps<typeof BaseNavigationMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Popup
    ref={ref}
    className={cn(
      "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-90",
      "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-90",
      className
    )}
    {...props}
  />
))
NavigationMenuPopup.displayName = "NavigationMenuPopup"

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof BaseNavigationMenu.Viewport>,
  React.ComponentProps<typeof BaseNavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Viewport
    ref={ref}
    className={cn(
      "origin-top-center relative mt-1.5 h-auto w-auto overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg",
      "data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=open]:fade-in",
      "data-[state=closed]:animate-out data-[state=closed]:zoom-out-90 data-[state=closed]:fade-out",
      className
    )}
    style={{
      perspective: "2000px",
    }}
    {...props}
  />
))
NavigationMenuViewport.displayName = "NavigationMenuViewport"

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<"div">,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </div>
))
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
  NavigationMenuViewport,
} 