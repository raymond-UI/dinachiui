// @ts-nocheck
import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import { cn } from "@/lib/utils";

const Tabs = React.forwardRef<
  React.ElementRef<typeof BaseTabs.Root>,
  React.ComponentProps<typeof BaseTabs.Root>
>(({ className, ...props }, ref) => (
  <BaseTabs.Root
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  React.ElementRef<typeof BaseTabs.List>,
  React.ComponentProps<typeof BaseTabs.List>
>(({ className, ...props }, ref) => (
  <BaseTabs.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof BaseTabs.Tab>,
  React.ComponentProps<typeof BaseTabs.Tab>
>(({ className, ...props }, ref) => (
  <BaseTabs.Tab
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
      "hover:text-foreground",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof BaseTabs.Panel>,
  React.ComponentProps<typeof BaseTabs.Panel>
>(({ className, ...props }, ref) => (
  <BaseTabs.Panel
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

const TabsIndicator = React.forwardRef<
  React.ElementRef<typeof BaseTabs.Indicator>,
  React.ComponentProps<typeof BaseTabs.Indicator>
>(({ className, ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    className={cn(
      "absolute bottom-0 left-0 z-10 h-1 w-[var(--active-tab-width)] -translate-y-1/2 translate-x-[var(--active-tab-left)] rounded-sm bg-muted-foreground transition-all duration-200 ease-in-out",
      className
    )}
    {...props}
  />
));
TabsIndicator.displayName = "TabsIndicator";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
}; 