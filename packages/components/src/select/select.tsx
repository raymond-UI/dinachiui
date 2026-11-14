"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "@dinachi/core"
import { Check, ChevronDown } from "lucide-react"
import {
  agentNodeText,
  changeAsAgent,
  matchAgentChoice,
  sameAgentValue,
  useAgentControl,
  useAgentState,
  useHasAgent,
  useMergedRef,
  waitForAgent,
} from "../agent"

interface SelectAgent {
  trigger: React.MutableRefObject<HTMLElement | null>
  /** Items in the open popup. */
  items: Map<HTMLElement, unknown>
  /** The same items, rendered hidden while the popup is closed so the agent can see them. */
  catalog: Map<HTMLElement, unknown>
  labels: Map<unknown, string>
  value: unknown
  multiple: boolean
  open: boolean
  disabled: boolean
  setOpen: (open: boolean) => void
  change: (value: unknown) => string | void
}

const SelectAgentContext = React.createContext<SelectAgent | null>(null)
const SelectCatalogContext = React.createContext(false)

function itemLabels(items: SelectPrimitive.Root.Props<unknown>["items"]): Map<unknown, string> {
  const labels = new Map<unknown, string>()
  if (!items) return labels
  const entries = Array.isArray(items)
    ? (items as ReadonlyArray<{ value: unknown; label: React.ReactNode }>).map((i) => [i.value, i.label] as const)
    : Object.entries(items as Record<string, React.ReactNode>)
  for (const [value, label] of entries) labels.set(value, agentNodeText(label))
  return labels
}

/**
 * Base UI's root, holding its own value and open state so an agent can set them the way
 * a parent would. Controlled use is unchanged: the props win and every change, the
 * agent's included, goes through `onValueChange` and `onOpenChange` first.
 */
function Select<Value, Multiple extends boolean | undefined = false>({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: SelectPrimitive.Root.Props<Value, Multiple>) {
  type Props = SelectPrimitive.Root.Props<Value, Multiple>
  type ValueChange = NonNullable<Props["onValueChange"]>
  type OpenChange = NonNullable<Props["onOpenChange"]>
  type Details = Parameters<ValueChange>[1]
  type OpenDetails = Parameters<OpenChange>[1]
  type Current = Parameters<ValueChange>[0]

  const [value, changeValue] = useAgentState<Current, Details>(
    valueProp as Current | undefined,
    (defaultValue ?? (props.multiple ? [] : null)) as Current,
    onValueChange
  )
  const [open, changeOpen] = useAgentState<boolean, OpenDetails>(openProp, defaultOpen, onOpenChange)

  const trigger = React.useRef<HTMLElement | null>(null)
  const [items] = React.useState(() => new Map<HTMLElement, unknown>())
  const [catalog] = React.useState(() => new Map<HTMLElement, unknown>())

  const agent: SelectAgent = {
    trigger,
    items,
    catalog,
    labels: itemLabels(props.items as Props["items"]),
    value,
    multiple: Boolean(props.multiple),
    open,
    disabled: Boolean(props.disabled),
    setOpen: (next) => changeAsAgent(changeOpen, next),
    // A person cannot choose a different option either, though they can open it to look.
    change: (next) => (props.readOnly ? "The select is read-only." : changeAsAgent(changeValue, next as Current)),
  }

  return (
    <SelectAgentContext.Provider value={useHasAgent() ? agent : null}>
      <SelectPrimitive.Root<Value, Multiple>
        {...props}
        value={value as Props["value"]}
        onValueChange={changeValue}
        open={open}
        onOpenChange={changeOpen}
      />
    </SelectAgentContext.Provider>
  )
}

const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    readonly children?: React.ReactNode
  }
>(({ className, children, ...props }, ref) => {
  const select = React.useContext(SelectAgentContext)
  const mergedRef = useMergedRef(ref, select?.trigger)

  useAgentControl(() => {
    if (!select) return null
    const element = select.trigger.current
    const choices = () => {
      const read = (map: Map<HTMLElement, unknown>) =>
        Array.from(map, ([el, value]) => ({
          value,
          label: agentNodeText(el.textContent),
          disabled: el.hasAttribute("data-disabled"),
        }))
      const live = read(select.items)
      if (live.length) return live
      const hidden = read(select.catalog)
      if (hidden.length) return hidden
      return Array.from(select.labels, ([value, label]) => ({ value, label, disabled: false }))
    }
    const labelOf = (value: unknown) =>
      choices().find((c) => sameAgentValue(c.value, value))?.label ?? (value == null ? "" : String(value))
    const find = (wanted: unknown) => matchAgentChoice(choices(), wanted)
    // Waits for the popup when nothing has listed the choices yet, outside the catalog.
    const ready = async () => {
      if (choices().length) return
      select.setOpen(true)
      await waitForAgent(() => (choices().length ? true : null))
    }
    const current: unknown[] = Array.isArray(select.value) ? select.value : []
    const items = choices().map((c) => c.label)

    return {
      kind: "select",
      element,
      value: select.multiple ? current.map(labelOf) : labelOf(select.value),
      open: select.open,
      disabled: select.disabled,
      ...(select.multiple ? { multiple: true } : {}),
      ...(items.length ? { items } : {}),
      actions: {
        select: async (wanted: string) => {
          await ready()
          const match = find(wanted)
          if (typeof match === "string") return match
          if (!select.multiple) {
            const refused = select.change(match.value)
            select.setOpen(false)
            return refused
          }
          if (current.some((v) => sameAgentValue(v, match.value))) return
          return select.change([...current, match.value])
        },
        ...(select.multiple
          ? {
              setValue: async (wanted: unknown) => {
                await ready()
                const list = Array.isArray(wanted) ? wanted : [wanted]
                const next: unknown[] = []
                for (const one of list) {
                  const match = find(one)
                  if (typeof match === "string") return match
                  next.push(match.value)
                }
                return select.change(next)
              },
            }
          : {}),
        [select.open ? "close" : "open"]: () => select.setOpen(!select.open),
      },
    }
  })

  return (
  <SelectPrimitive.Trigger
    ref={mergedRef}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> & {
    readonly alignItemWithTrigger?: boolean
    readonly sideOffset?: number
    readonly portal?: boolean
    /**
     * Set this to `"absolute"` if the dropdown lands away from its trigger in Safari.
     * A `filter`, `backdrop-filter` or `transform` on any ancestor makes that ancestor
     * the containing block for a fixed-positioned descendant, and the positioning
     * library skips those two filter properties on WebKit — so it measures against the
     * viewport while Safari lays out against the ancestor. `"absolute"` resolves
     * against the nearest positioned ancestor instead, which no filter can change.
     */
    readonly positionMethod?: "absolute" | "fixed"
  }
>(({ className, children, alignItemWithTrigger = false, sideOffset = 4, portal = false, positionMethod = "fixed", ...props }, ref) => {
  const content = (
    <SelectPrimitive.Positioner
      sideOffset={sideOffset}
      alignItemWithTrigger={alignItemWithTrigger}
      positionMethod={positionMethod}
      // The stacking context that keeps sibling form controls from painting over an
      // open dropdown comes from this z-index, not from the position method.
      className="z-50"
    >
      <SelectPrimitive.Popup
        ref={ref}
        className={cn(
          "relative max-h-96 min-w-[var(--anchor-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "origin-[var(--transform-origin)]",
          "transition-[transform,scale,opacity] duration-[var(--motion-duration-fast,150ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          "motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
          !alignItemWithTrigger &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectScrollUpArrow />
        <SelectPrimitive.List className="overflow-y-auto p-1">
          {children}
        </SelectPrimitive.List>
        <SelectScrollDownArrow />
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  )

  const select = React.useContext(SelectAgentContext)
  // Base UI unmounts a closed popup, which would leave the agent nothing to choose from.
  // Inside AgentProvider the items also render hidden while it is closed.
  const catalog =
    select && !select.open ? (
      <SelectCatalogContext.Provider value>
        <div hidden data-agent-hidden>
          {children}
        </div>
      </SelectCatalogContext.Provider>
    ) : null

  const popup = portal ? <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal> : content
  if (!catalog) return popup
  return (
    <>
      {popup}
      {catalog}
    </>
  )
})
SelectContent.displayName = "SelectContent"

const SelectBackdrop = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-40", className)}
    {...props}
  />
))
SelectBackdrop.displayName = "SelectBackdrop"

const SelectScrollUpArrow = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpArrow>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpArrow>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpArrow
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4 rotate-180" />
  </SelectPrimitive.ScrollUpArrow>
))
SelectScrollUpArrow.displayName = "SelectScrollUpArrow"

const SelectScrollDownArrow = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownArrow>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownArrow>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownArrow
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownArrow>
))
SelectScrollDownArrow.displayName = "SelectScrollDownArrow"

const SelectFieldLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
))
SelectFieldLabel.displayName = "SelectFieldLabel"

const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.GroupLabel
    ref={ref}
    className={cn("py-1.5 pl-2 pr-2 text-sm font-medium", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    readonly showIndicator?: boolean
  }
>(({ className, children, showIndicator = false, ...props }, ref) => {
  const select = React.useContext(SelectAgentContext)
  const inCatalog = React.useContext(SelectCatalogContext)
  const element = React.useRef<HTMLDivElement | null>(null)
  const mergedRef = useMergedRef(ref, element)
  const { value } = props
  const registry = select ? (inCatalog ? select.catalog : select.items) : null

  React.useEffect(() => {
    const el = element.current
    if (!registry || !el) return
    registry.set(el, value)
    return () => {
      registry.delete(el)
    }
  }, [registry, value])

  if (inCatalog) {
    return (
      <div ref={element} data-disabled={props.disabled ? "" : undefined}>
        {children}
      </div>
    )
  }

  return (
  <SelectPrimitive.Item
    ref={mergedRef}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      showIndicator ? "pl-8 pr-2" : "px-2",
      className
    )}
    {...props}
  >
    {showIndicator && (
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    )}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
  )
})
SelectItem.displayName = "SelectItem"

const SelectItemIndicator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemIndicator>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.ItemIndicator
    ref={ref}
    className={cn("flex h-3.5 w-3.5 items-center justify-center", className)}
    {...props}
  >
    {children ?? <Check className="h-4 w-4" />}
  </SelectPrimitive.ItemIndicator>
))
SelectItemIndicator.displayName = "SelectItemIndicator"

const SelectArrow = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Arrow
    ref={ref}
    className={cn("fill-popover stroke-border", className)}
    {...props}
  />
))
SelectArrow.displayName = "SelectArrow"

const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectBackdrop,
  SelectFieldLabel,
  SelectLabel,
  SelectItem,
  SelectItemIndicator,
  SelectArrow,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
  SelectSeparator,
}
