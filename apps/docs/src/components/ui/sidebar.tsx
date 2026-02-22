"use client";

import { cn } from "@/lib/utils";
import { useRender } from "@base-ui/react/use-render";
import { cva, VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";

// Constants
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "15rem";
const SIDEBAR_WIDTH_MOBILE = "min(24rem,92vw)";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Types
interface SidebarContextValue {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  collapsible: "offcanvas" | "icon" | "none";
}

// Context
const SidebarContext = React.createContext<SidebarContextValue | null>(null);

// Hook
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// Provider Props
interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Provider Component
const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const [collapsible, setCollapsible] = React.useState<
      "offcanvas" | "icon" | "none"
    >("offcanvas");

    const open = openProp ?? internalOpen;

    const setOpen = React.useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (onOpenChange) {
          onOpenChange(openState);
        } else {
          setInternalOpen(openState);
        }

        // Set cookie to persist sidebar state
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [open, onOpenChange],
    );

    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        setOpenMobile((prev) => !prev);
      } else {
        setOpen((prev) => !prev);
      }
    }, [isMobile, setOpen]);

    // Keyboard shortcut
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
        collapsible, // Add this to the context value
      }),
      [
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
        collapsible,
      ],
    );

    // Add method to update collapsible state from child components
    React.useEffect(() => {
      const handleCollapsibleChange = (
        event: CustomEvent<"offcanvas" | "icon" | "none">,
      ) => {
        setCollapsible(event.detail);
      };

      window.addEventListener(
        "sidebar-collapsible-change",
        handleCollapsibleChange as EventListener,
      );
      return () =>
        window.removeEventListener(
          "sidebar-collapsible-change",
          handleCollapsibleChange as EventListener,
        );
    }, []);

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider>
          <div
            ref={ref}
            data-sidebar="provider"
            data-state={state}
            data-slot="sidebar-provider"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-provider flex min-h-screen w-full",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);

SidebarProvider.displayName = "SidebarProvider";

// Sidebar Component Props
interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  render?: React.ReactElement;
}

// Main Sidebar Component
const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      render = <div />,
      children,
      ...props
    },
    ref,
  ) => {
    const { state, isMobile, openMobile, setOpenMobile } = useSidebar();

    // Notify provider about collapsible state changes
    React.useEffect(() => {
      const event = new CustomEvent("sidebar-collapsible-change", {
        detail: collapsible,
      });
      window.dispatchEvent(event);
    }, [collapsible]);

    // Always call useRender, but conditionally use the result
    const renderedContent = useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-[--sidebar-width] flex-col",
          className,
        ),
        ...props,
      }),
      props: { children },
    });

    const sidebarInnerContent = useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "sidebar-inner",
        className: cn(
          "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col",
          "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
        ),
      }),
      props: { children },
    });

    if (collapsible === "none") {
      return renderedContent;
    }

    if (isMobile) {
      return (
        <Drawer open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerContent
            data-sidebar="sidebar"
            data-mobile="true"
            className={cn(
              "bg-sidebar text-sidebar-foreground w-[--sidebar-width-mobile] p-0 [&>button]:hidden",
              className,
            )}
            side={side}
          >
            <DrawerHeader className="sr-only">
              <DrawerTitle>Sidebar</DrawerTitle>
              <DrawerDescription>
                Displays the mobile sidebar.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <div
        className="group peer text-sidebar-foreground hidden md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        data-sidebar="sidebar"
      >
        {/* Sidebar gap - matches sidebar height */}
        <div
          data-sidebar="gap"
          className={cn(
            "relative h-[calc(100vh-3.5rem)] w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          )}
        />

        {/* Sidebar container - offset for header (h-14 = 3.5rem) */}
        <div
          data-sidebar="container"
          className={cn(
            "fixed top-14 bottom-0 z-10 hidden h-[calc(100vh-3.5rem)] w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className,
          )}
          {...props}
        >
          {sidebarInnerContent}
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

// Sidebar Trigger
interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
  render?: React.ReactElement;
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(
          event as React.MouseEvent<HTMLButtonElement> & {
            preventBaseUIHandler: () => void;
          },
        );
        toggleSidebar();
      },
      [onClick, toggleSidebar],
    );

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("size-7", className)}
        onClick={handleClick}
        {...props}
      >
        <PanelLeftIcon className="h-4 w-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  },
);

SidebarTrigger.displayName = "SidebarTrigger";

// Sidebar Rail
interface SidebarRailProps extends React.ComponentProps<"button"> {
  render?: React.ReactElement;
}

const SidebarRail = React.forwardRef<HTMLButtonElement, SidebarRailProps>(
  ({ className, render = <button />, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "rail",
        type: "button",
        "aria-label": "Toggle Sidebar",
        tabIndex: -1,
        onClick: toggleSidebar,
        title: "Toggle Sidebar",
        className: cn(
          "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
          "group-data-[side=left]:cursor-w-resize group-data-[side=right]:cursor-e-resize",
          "group-data-[state=collapsed]:group-data-[side=left]:cursor-e-resize group-data-[state=collapsed]:group-data-[side=right]:cursor-w-resize",
          "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
          "group-data-[collapsible=offcanvas]:group-data-[side=left]:-right-2",
          "group-data-[collapsible=offcanvas]:group-data-[side=right]:-left-2",
          className,
        ),
        ...props,
      }),
      props: {},
    });
  },
);

SidebarRail.displayName = "SidebarRail";

// Sidebar Inset
interface SidebarInsetProps extends React.ComponentProps<"main"> {
  render?: React.ReactElement;
}

const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, render = <main />, ...props }, ref) => {
    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "inset",
        className: cn(
          "bg-background relative flex w-full flex-1 flex-col",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
          className,
        ),
        ...props,
      }),
      props: {},
    });
  },
);

SidebarInset.displayName = "SidebarInset";

// Sidebar Input
const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
});

SidebarInput.displayName = "SidebarInput";

// Sidebar Header
interface SidebarHeaderProps extends React.ComponentProps<"div"> {
  render?: React.ReactElement<React.ComponentProps<"div">>;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, render = <div />, children, ...props }, ref) => {
    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "header",
        className: cn("flex flex-col gap-2 p-2", className),
        ...props,
      }),
      props: { children },
    });
  },
);

SidebarHeader.displayName = "SidebarHeader";

// Sidebar Footer
interface SidebarFooterProps extends React.ComponentProps<"div"> {
  render?: React.ReactElement;
}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, render = <div />, ...props }, ref) => {
    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "footer",
        className: cn("flex flex-col gap-2 p-2", className),
        ...props,
      }),
      props: {},
    });
  },
);

SidebarFooter.displayName = "SidebarFooter";

// Sidebar Separator
interface SidebarSeparatorProps extends React.ComponentProps<typeof Separator> {
  render?: React.ReactElement;
}

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  SidebarSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  );
});

SidebarSeparator.displayName = "SidebarSeparator";

// Sidebar Content
interface SidebarContentProps extends React.ComponentProps<"div"> {
  render?: React.ReactElement;
}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, render = <div />, children, ...props }, ref) => {
    const { state, collapsible } = useSidebar();

    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "content",
        className: cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
          collapsible === "icon" && state === "collapsed" && "overflow-hidden",
          className,
        ),
        ...props,
      }),
      props: { children },
    });
  },
);

SidebarContent.displayName = "SidebarContent";

// Sidebar Group
interface SidebarGroupProps extends React.ComponentProps<"div"> {
  render?: React.ReactElement;
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, render = <div />, ...props }, ref) => {
    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "group",
        className: cn("relative flex w-full min-w-0 flex-col p-2", className),
        ...props,
      }),
      props: {},
    });
  },
);

SidebarGroup.displayName = "SidebarGroup";

// Sidebar Group Label
interface SidebarGroupLabelProps extends React.ComponentProps<"div"> {
  render?: React.ReactElement;
}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, render = <div />, ...props }, ref) => {
  return useRender({
    render: React.cloneElement(render, {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      ),
      ...props,
    }),
    props: {},
  });
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

// Sidebar Group Content
interface SidebarGroupContentProps extends React.ComponentProps<"div"> {
  render?: React.ReactElement;
}

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, render = <div />, ...props }, ref) => {
  return useRender({
    render: React.cloneElement(render, {
      ref,
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props,
    }),
    props: {},
  });
});

SidebarGroupContent.displayName = "SidebarGroupContent";

// Sidebar Menu
interface SidebarMenuProps extends React.ComponentProps<"ul"> {
  render?: React.ReactElement;
}

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, render = <ul />, ...props }, ref) => {
    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "menu",
        className: cn("flex w-full min-w-0 flex-col gap-1", className),
        ...props,
      }),
      props: {},
    });
  },
);

SidebarMenu.displayName = "SidebarMenu";

// Sidebar Menu Item
interface SidebarMenuItemProps extends React.ComponentProps<"li"> {
  render?: React.ReactElement;
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, render = <li />, ...props }, ref) => {
    return useRender({
      render: React.cloneElement(render, {
        ref,
        "data-sidebar": "menu-item",
        className: cn("group/menu-item relative", className),
        ...props,
      }),
      props: {},
    });
  },
);

SidebarMenuItem.displayName = "SidebarMenuItem";

// Sidebar Menu Button variants
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Sidebar Menu Button
interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  render?: React.ReactElement;
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
      render = <button />,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state } = useSidebar();

    const buttonProps = {
      ref,
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props,
    };

    // Always call useRender hook to avoid conditional hook calls
    const renderedButton = useRender({
      render: React.cloneElement(render, buttonProps),
      props: {},
    });

    if (!tooltip) {
      return renderedButton;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger {...buttonProps} render={render}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  },
);

SidebarMenuButton.displayName = "SidebarMenuButton";

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
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

export type {
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInsetProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
};
