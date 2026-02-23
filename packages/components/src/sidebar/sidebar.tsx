"use client"

import * as React from "react"
import { cn } from "@dinachi/core"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../drawer/drawer"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip/tooltip"
import { useIsMobile } from "../hooks/useIsMobile"
import { Button } from "../button/button"
import { Input } from "../input/input"
import { Separator } from "../separator/separator"

// Constants
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

// Types
interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

// Context
const SidebarContext = React.createContext<SidebarContextValue | null>(null)

// Hook
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Provider
interface SidebarProviderProps extends React.ComponentProps<"div"> {}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ className, style, children, ...props }, ref) => {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false)

    const toggleSidebar = React.useCallback(() => {
      setOpen((prev) => !prev)
    }, [])

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({ open, setOpen, isMobile, toggleSidebar }),
      [open, isMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider>
          <div
            ref={ref}
            data-sidebar="provider"
            data-slot="sidebar-provider"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-provider flex min-h-screen w-full",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

// Sidebar
interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, open, setOpen } = useSidebar()

    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="bg-sidebar text-sidebar-foreground w-[--sidebar-width-mobile] p-0 [&>button]:hidden"
            side={side}
          >
            <DrawerHeader className="sr-only">
              <DrawerTitle>Sidebar</DrawerTitle>
              <DrawerDescription>Displays the mobile sidebar.</DrawerDescription>
            </DrawerHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </DrawerContent>
        </Drawer>
      )
    }

    return (
      <div
        className="group peer text-sidebar-foreground hidden md:block"
        data-variant={variant}
        data-side={side}
        data-sidebar="sidebar"
      >
        {/* Sidebar gap */}
        <div
          data-sidebar="gap"
          className={cn(
            "relative w-[--sidebar-width] bg-transparent",
            "group-data-[side=right]:rotate-180"
          )}
        />

        {/* Sidebar container */}
        <div
          ref={ref}
          data-sidebar="container"
          className={cn(
            "fixed inset-y-0 z-10 hidden h-screen w-[--sidebar-width] md:flex",
            side === "left" ? "left-0" : "right-0",
            variant === "floating" || variant === "inset"
              ? "p-2"
              : "group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "bg-sidebar flex h-full w-full flex-col",
              (variant === "floating" || variant === "inset") &&
                "rounded-lg border shadow-sm"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

// Sidebar Trigger
const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// Sidebar Inset
const SidebarInset = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    data-sidebar="inset"
    className={cn(
      "bg-background relative flex w-full flex-1 flex-col",
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm",
      className
    )}
    {...props}
  />
))
SidebarInset.displayName = "SidebarInset"

// Sidebar Input
const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    data-sidebar="input"
    className={cn("bg-background h-8 w-full shadow-none", className)}
    {...props}
  />
))
SidebarInput.displayName = "SidebarInput"

// Sidebar Header
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

// Sidebar Footer
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

// Sidebar Separator
const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    className={cn("bg-sidebar-border mx-2 w-auto", className)}
    {...props}
  />
))
SidebarSeparator.displayName = "SidebarSeparator"

// Sidebar Content
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

// Sidebar Group
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group"
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

// Sidebar Group Label
const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-label"
    className={cn(
      "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      className
    )}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

// Sidebar Group Content
const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

// Sidebar Menu
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

// Sidebar Menu Item
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

// Sidebar Menu Button variants
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Sidebar Menu Button
interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
  render?: React.ReactElement
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      render,
      children,
      ...props
    },
    ref
  ) => {
    const buttonProps = {
      ref,
      "data-sidebar": "menu-button" as const,
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props,
    }

    const button = render
      ? React.cloneElement(render, buttonProps, children)
      : <button {...buttonProps}>{children}</button>

    if (!tooltip) {
      return button
    }

    const tooltipProps =
      typeof tooltip === "string" ? { children: tooltip } : tooltip

    return (
      <Tooltip>
        <TooltipTrigger
          {...buttonProps}
          render={render}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent side="right" align="center" {...tooltipProps} />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

export type {
  SidebarContextValue,
  SidebarMenuButtonProps,
  SidebarProps,
  SidebarProviderProps,
}
