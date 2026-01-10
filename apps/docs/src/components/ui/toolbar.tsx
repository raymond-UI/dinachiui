import * as React from "react";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import { cn } from "@/lib/utils";

const ToolbarRoot = React.forwardRef<
  React.ComponentRef<typeof BaseToolbar.Root>,
  React.ComponentProps<typeof BaseToolbar.Root>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Root
    ref={ref}
    className={cn(
      "flex items-center gap-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
));
ToolbarRoot.displayName = "ToolbarRoot";

const ToolbarButton = React.forwardRef<
  React.ComponentRef<typeof BaseToolbar.Button>,
  React.ComponentProps<typeof BaseToolbar.Button>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    {...props}
  />
));
ToolbarButton.displayName = "ToolbarButton";

const ToolbarLink = React.forwardRef<
  React.ComponentRef<typeof BaseToolbar.Link>,
  React.ComponentProps<typeof BaseToolbar.Link>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Link
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium transition-colors",
      "text-primary hover:text-primary/80 hover:underline",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    {...props}
  />
));
ToolbarLink.displayName = "ToolbarLink";

const ToolbarSeparator = React.forwardRef<
  React.ComponentRef<typeof BaseToolbar.Separator>,
  React.ComponentProps<typeof BaseToolbar.Separator>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <BaseToolbar.Separator
    ref={ref}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-4 w-px",
      className
    )}
    {...props}
  />
));
ToolbarSeparator.displayName = "ToolbarSeparator";

const ToolbarGroup = React.forwardRef<
  React.ComponentRef<typeof BaseToolbar.Group>,
  React.ComponentProps<typeof BaseToolbar.Group>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Group
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
ToolbarGroup.displayName = "ToolbarGroup";

const ToolbarInput = React.forwardRef<
  React.ComponentRef<typeof BaseToolbar.Input>,
  React.ComponentProps<typeof BaseToolbar.Input>
>(({ className, ...props }, ref) => (
  <BaseToolbar.Input
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[highlighted]:ring-2 data-[highlighted]:ring-ring data-[highlighted]:ring-offset-2",
      className
    )}
    {...props}
  />
));
ToolbarInput.displayName = "ToolbarInput";

const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Separator: ToolbarSeparator,
  Group: ToolbarGroup,
  Input: ToolbarInput,
});

export {
  Toolbar,
  ToolbarRoot,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarGroup,
  ToolbarInput,
}; 