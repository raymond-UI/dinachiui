import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { Menu } from "@base-ui/react/menu";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@dinachi/core";
import { Check, ChevronRight, Circle } from "lucide-react";

const ContextMenu = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Root>,
  React.ComponentProps<typeof BaseContextMenu.Root>
>(({ children, ...props }, ref) => {
  const element = useRender({
    render: <BaseContextMenu.Root>{children}</BaseContextMenu.Root>,
    props,
    ref,
  });
  return element;
});
ContextMenu.displayName = "ContextMenu";

const ContextMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Trigger>,
  React.ComponentProps<typeof BaseContextMenu.Trigger>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Trigger
    ref={ref}
    className={cn("select-none", className)}
    {...props}
  />
));
ContextMenuTrigger.displayName = "ContextMenuTrigger";

const ContextMenuPortal = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Portal>,
  React.ComponentProps<typeof BaseContextMenu.Portal>
>(({ ...props }, ref) => {
  const element = useRender({
    render: <BaseContextMenu.Portal />,
    props,
    ref,
  });
  return element;
});
ContextMenuPortal.displayName = "ContextMenuPortal";

const ContextMenuPositioner = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Positioner>,
  React.ComponentProps<typeof BaseContextMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Positioner
    ref={ref}
    className={cn("outline-none", className)}
    {...props}
  />
));
ContextMenuPositioner.displayName = "ContextMenuPositioner";

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Popup>,
  React.ComponentProps<typeof BaseContextMenu.Popup> & {
    container?: HTMLElement | React.RefObject<HTMLElement | null> | null;
  }
>(({ className, container, ...props }, ref) => {
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    // If container is provided, use it
    if (container) {
      if (container instanceof HTMLElement) {
        setPortalContainer(container);
      } else if (container.current) {
        setPortalContainer(container.current);
      }
      return;
    }

    // Otherwise create/use the high-level portal root
    let portalRoot = document.getElementById(
      "context-menu-portal-root"
    ) as HTMLElement;
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = "context-menu-portal-root";
      portalRoot.style.cssText =
        "position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none; isolation: isolate;";
      document.body.appendChild(portalRoot);
    }
    setPortalContainer(portalRoot);
  }, [container]);

  return (
    <ContextMenuPortal container={portalContainer}>
      <ContextMenuPositioner>
        <BaseContextMenu.Popup
          ref={ref}
          className={cn(
            "z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg pointer-events-auto",
            "origin-[var(--transform-origin)]",
            "outline-none focus:outline-none focus-visible:outline-none",
            "data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95",
            "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
            className
          )}
          {...props}
        />
      </ContextMenuPositioner>
    </ContextMenuPortal>
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Item>,
  React.ComponentProps<typeof BaseContextMenu.Item> & {
    inset?: boolean;
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
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.CheckboxItem>,
  React.ComponentProps<typeof BaseContextMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <BaseContextMenu.CheckboxItem
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
  </BaseContextMenu.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioGroup = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.RadioGroup>,
  React.ComponentProps<typeof BaseContextMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioGroup ref={ref} className={cn(className)} {...props} />
));
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup";

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
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current data-[checked]:block data-[unchecked]:hidden" />
    </span>
    {children}
  </BaseContextMenu.RadioItem>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuGroup = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Group>,
  React.ComponentProps<typeof BaseContextMenu.Group>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Group ref={ref} className={cn(className)} {...props} />
));
ContextMenuGroup.displayName = "ContextMenuGroup";

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.GroupLabel>,
  React.ComponentProps<typeof BaseContextMenu.GroupLabel> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <BaseContextMenu.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Separator>,
  React.ComponentProps<typeof BaseContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

const ContextMenuShortcut = ({
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
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

// Submenu components using Menu from @base-ui-components
const ContextMenuSub = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Menu.Root>
>(({ children, ...props }, ref) => {
  const element = useRender({
    render: <Menu.Root>{children}</Menu.Root>,
    props,
    ref,
  });
  return element;
});
ContextMenuSub.displayName = "ContextMenuSub";

const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof Menu.SubmenuTrigger>,
  React.ComponentProps<typeof Menu.SubmenuTrigger> & {
    inset?: boolean;
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
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof Menu.Popup>,
  React.ComponentProps<typeof Menu.Popup>
>(({ className, ...props }, ref) => {
  const [portalContainer, setPortalContainer] =
    React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    // Use the same high-level portal root for submenus
    let portalRoot = document.getElementById(
      "context-menu-portal-root"
    ) as HTMLElement;
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.id = "context-menu-portal-root";
      portalRoot.style.cssText =
        "position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none; isolation: isolate;";
      document.body.appendChild(portalRoot);
    }
    setPortalContainer(portalRoot);
  }, []);

  return (
    <Menu.Portal container={portalContainer}>
      <Menu.Positioner className="outline-none" alignOffset={-4} sideOffset={8}>
        <Menu.Popup
          ref={ref}
          className={cn(
            "z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg pointer-events-auto",
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
  );
});
ContextMenuSubContent.displayName = "ContextMenuSubContent";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuContent,
  ContextMenuItem,
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
};
