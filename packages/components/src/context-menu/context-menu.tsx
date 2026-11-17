"use client"

import * as React from "react"
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu"
import { cn } from "@dinachi/core"
import { Check, ChevronRight, Circle } from "lucide-react"
import { type AgentOpenParts, useAgentOpen, useHasAgent, useMergedRef } from "../agent"

const ContextMenuAgentContext = React.createContext<(AgentOpenParts & { disabled?: boolean }) | null>(null)

/**
 * Base UI places the popup at the point a right-click or long press set. Opened any other
 * way, by an agent or a controlled `open`, there is no such point and it lands in the top
 * left corner, so the positioner anchors on the middle of the trigger area instead.
 */
const ContextMenuAnchorContext = React.createContext<{
  pointed: React.RefObject<boolean>
  trigger: React.RefObject<HTMLElement | null>
} | null>(null)

/**
 * Base UI's root, holding its own open state so an agent can open and close it. Closed,
 * the agent sees the trigger area, named by its `aria-label` or text; open, the popup.
 * The trigger area carries the root's `disabled`, which Base UI does not mark on it.
 */
const ContextMenu: React.FC<React.ComponentProps<typeof BaseContextMenu.Root>> = ({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}) => {
  const [state, change, parts] = useAgentOpen("menu", open, defaultOpen, onOpenChange)
  const pointed = React.useRef(false)
  const trigger = React.useRef<HTMLElement | null>(null)
  const anchor = React.useMemo(() => ({ pointed, trigger }), [])
  if (!state) pointed.current = false
  const onChange: typeof change = (next, details) => {
    if (next) pointed.current = details.reason === "trigger-press"
    change(next, details)
  }
  return (
    <ContextMenuAnchorContext.Provider value={anchor}>
      <ContextMenuAgentContext.Provider value={useHasAgent() ? { ...parts, disabled: props.disabled } : null}>
        <BaseContextMenu.Root {...props} open={state} onOpenChange={onChange} />
      </ContextMenuAgentContext.Provider>
    </ContextMenuAnchorContext.Provider>
  )
}
ContextMenu.displayName = "ContextMenu"

const ContextMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Trigger>,
  React.ComponentProps<typeof BaseContextMenu.Trigger>
>(({ className, ...props }, ref) => {
  const agent = React.useContext(ContextMenuAgentContext)
  const anchor = React.useContext(ContextMenuAnchorContext)
  return (
    <BaseContextMenu.Trigger
      ref={useMergedRef(ref, agent?.trigger, anchor?.trigger)}
      data-disabled={agent?.disabled ? "" : undefined}
      className={cn("select-none", className)}
      data-slot="context-menu-trigger"
      {...props}
    />
  )
})
ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuPortal: React.FC<
  React.ComponentProps<typeof BaseContextMenu.Portal>
> = (props) => <BaseContextMenu.Portal data-slot="context-menu-portal" {...props} />
ContextMenuPortal.displayName = "ContextMenuPortal"

const ContextMenuPositioner = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Positioner>,
  React.ComponentProps<typeof BaseContextMenu.Positioner>
>(({ className, anchor, ...props }, ref) => {
  const ctx = React.useContext(ContextMenuAnchorContext)
  const middle = React.useMemo(
    () =>
      ctx && {
        getBoundingClientRect() {
          const r = ctx.trigger.current?.getBoundingClientRect()
          return r ? DOMRect.fromRect({ x: r.x + r.width / 2, y: r.y + r.height / 2, width: 0, height: 0 }) : new DOMRect()
        },
      },
    [ctx]
  )
  return (
    <BaseContextMenu.Positioner
      ref={ref}
      anchor={anchor ?? (ctx && !ctx.pointed.current ? middle : undefined)}
      className={cn("z-50 outline-none", className)}
      data-slot="context-menu-positioner"
      {...props}
    />
  )
})
ContextMenuPositioner.displayName = "ContextMenuPositioner"

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Popup>,
  React.ComponentProps<typeof BaseContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <ContextMenuPortal>
    <ContextMenuPositioner>
      <BaseContextMenu.Popup
        ref={useMergedRef(ref, React.useContext(ContextMenuAgentContext)?.popup)}
        className={cn(
          "min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
          "origin-[var(--transform-origin)]",
          "outline-none focus:outline-none focus-visible:outline-none",
          "transition-[transform,scale,opacity] duration-[var(--motion-duration-fast,150ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          "motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
          className
        )}
        data-slot="context-menu-content"
        {...props}
      />
    </ContextMenuPositioner>
  </ContextMenuPortal>
))
ContextMenuContent.displayName = "ContextMenuContent"

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Item>,
  React.ComponentProps<typeof BaseContextMenu.Item> & {
    inset?: boolean
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
    data-slot="context-menu-item"
    {...props}
  />
))
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuLinkItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.LinkItem>,
  React.ComponentProps<typeof BaseContextMenu.LinkItem>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.LinkItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    data-slot="context-menu-link-item"
    {...props}
  />
))
ContextMenuLinkItem.displayName = "ContextMenuLinkItem"

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.CheckboxItem>,
  React.ComponentProps<typeof BaseContextMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <BaseContextMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    data-slot="context-menu-checkbox-item"
    {...props}
  >
    <BaseContextMenu.CheckboxItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </BaseContextMenu.CheckboxItemIndicator>
    {children}
  </BaseContextMenu.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

const ContextMenuRadioGroup = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.RadioGroup>,
  React.ComponentProps<typeof BaseContextMenu.RadioGroup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.RadioGroup ref={ref} className={className} data-slot="context-menu-radio-group" {...props} />
))
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup"

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
    data-slot="context-menu-radio-item"
    {...props}
  >
    <BaseContextMenu.RadioItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Circle className="h-2 w-2 fill-current" />
    </BaseContextMenu.RadioItemIndicator>
    {children}
  </BaseContextMenu.RadioItem>
))
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

const ContextMenuGroup = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Group>,
  React.ComponentProps<typeof BaseContextMenu.Group>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Group ref={ref} className={className} data-slot="context-menu-group" {...props} />
))
ContextMenuGroup.displayName = "ContextMenuGroup"

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.GroupLabel>,
  React.ComponentProps<typeof BaseContextMenu.GroupLabel> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <BaseContextMenu.GroupLabel
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-medium text-foreground",
      inset && "pl-8",
      className
    )}
    data-slot="context-menu-label"
    {...props}
  />
))
ContextMenuLabel.displayName = "ContextMenuLabel"

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Separator>,
  React.ComponentProps<typeof BaseContextMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    data-slot="context-menu-separator"
    {...props}
  />
))
ContextMenuSeparator.displayName = "ContextMenuSeparator"

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-muted-foreground",
      className
    )}
    data-slot="context-menu-shortcut"
    {...props}
  />
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

const ContextMenuSub: React.FC<React.ComponentProps<typeof BaseContextMenu.SubmenuRoot>> = (props) => (
  <BaseContextMenu.SubmenuRoot {...props} />
)
ContextMenuSub.displayName = "ContextMenuSub"

const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.SubmenuTrigger>,
  React.ComponentProps<typeof BaseContextMenu.SubmenuTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <BaseContextMenu.SubmenuTrigger
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
    data-slot="context-menu-sub-trigger"
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </BaseContextMenu.SubmenuTrigger>
))
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof BaseContextMenu.Popup>,
  React.ComponentProps<typeof BaseContextMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseContextMenu.Portal>
    <BaseContextMenu.Positioner className="z-50 outline-none" alignOffset={-4} sideOffset={8}>
      <BaseContextMenu.Popup
        ref={ref}
        className={cn(
          "min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
          "origin-[var(--transform-origin)]",
          "outline-none focus:outline-none focus-visible:outline-none",
          "transition-[transform,scale,opacity] duration-[var(--motion-duration-fast,150ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          "motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
          className
        )}
        data-slot="context-menu-sub-content"
        {...props}
      />
    </BaseContextMenu.Positioner>
  </BaseContextMenu.Portal>
))
ContextMenuSubContent.displayName = "ContextMenuSubContent"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLinkItem,
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
}
