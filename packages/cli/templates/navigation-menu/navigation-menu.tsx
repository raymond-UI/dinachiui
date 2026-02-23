"use client"

import * as React from "react"
import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof BaseNavigationMenu.Root>,
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
  React.ComponentRef<typeof BaseNavigationMenu.List>,
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
  React.ComponentRef<typeof BaseNavigationMenu.Item>,
  React.ComponentProps<typeof BaseNavigationMenu.Item>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Item
    ref={ref}
    className={className}
    {...props}
  />
))
NavigationMenuItem.displayName = "NavigationMenuItem"

const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseNavigationMenu.Trigger>,
  React.ComponentProps<typeof BaseNavigationMenu.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseNavigationMenu.Trigger
    ref={ref}
    className={cn(
      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
  React.ComponentRef<typeof BaseNavigationMenu.Content>,
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
  React.ComponentRef<typeof BaseNavigationMenu.Link>,
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

const NavigationMenuPortal: React.FC<
  React.ComponentProps<typeof BaseNavigationMenu.Portal>
> = (props) => <BaseNavigationMenu.Portal {...props} />
NavigationMenuPortal.displayName = "NavigationMenuPortal"

const NavigationMenuPositioner = React.forwardRef<
  React.ComponentRef<typeof BaseNavigationMenu.Positioner>,
  React.ComponentProps<typeof BaseNavigationMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Positioner
    ref={ref}
    className={cn("absolute left-0 top-full z-50 flex justify-center", className)}
    {...props}
  />
))
NavigationMenuPositioner.displayName = "NavigationMenuPositioner"

const NavigationMenuPopup = React.forwardRef<
  React.ComponentRef<typeof BaseNavigationMenu.Popup>,
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
  React.ComponentRef<typeof BaseNavigationMenu.Viewport>,
  React.ComponentProps<typeof BaseNavigationMenu.Viewport>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Viewport
    ref={ref}
    className={cn(
      "origin-top-center relative mt-1.5 h-auto w-auto overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg",
      className
    )}
    style={{
      perspective: "2000px",
    }}
    {...props}
  />
))
NavigationMenuViewport.displayName = "NavigationMenuViewport"

const NavigationMenuArrow = React.forwardRef<
  React.ComponentRef<typeof BaseNavigationMenu.Arrow>,
  React.ComponentProps<typeof BaseNavigationMenu.Arrow>
>(({ className, children, ...props }, ref) => (
  <BaseNavigationMenu.Arrow
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
  </BaseNavigationMenu.Arrow>
))
NavigationMenuArrow.displayName = "NavigationMenuArrow"

const NavigationMenuBackdrop = React.forwardRef<
  React.ComponentRef<typeof BaseNavigationMenu.Backdrop>,
  React.ComponentProps<typeof BaseNavigationMenu.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/40 pointer-events-none",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-opacity duration-150",
      className
    )}
    {...props}
  />
))
NavigationMenuBackdrop.displayName = "NavigationMenuBackdrop"

const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<"div">,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
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
  NavigationMenuArrow,
  NavigationMenuBackdrop,
}