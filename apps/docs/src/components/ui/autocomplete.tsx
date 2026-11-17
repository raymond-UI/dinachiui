"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  agentNodeText,
  changeAsAgent,
  useAgentControl,
  useAgentState,
  useHasAgent,
  useMergedRef,
  waitForAgent,
  type AgentControl,
} from "@/components/ui/agent"

type ElementRef = React.MutableRefObject<HTMLElement | null>

interface AutocompleteAgent {
  input: ElementRef
  list: ElementRef
  /** Suggestions in the open list, by element. */
  items: Set<HTMLElement>
}

const AutocompleteAgentContext = React.createContext<AutocompleteAgent | null>(null)

type ToText = ((item: never) => string) | undefined

/** Base UI's own text for an item: `itemToStringValue`, then `label`, then `value`. */
function textOf(item: unknown, toText: ToText): string {
  if (toText) return (toText as (i: unknown) => string)(item) ?? ""
  const o = item as { label?: unknown; value?: unknown }
  return String(item && typeof item === "object" ? (o.label ?? o.value ?? "") : item)
}

const leavesOf = (data: readonly unknown[] = []) =>
  data.flatMap((e) => ((e as { items?: unknown })?.items instanceof Array ? (e as { items: unknown[] }).items : [e]))

const liveOf = (items: Set<HTMLElement>) => Array.from(items, (el) => agentNodeText(el.textContent))

/** Waits a turn for React to filter, then for the list to be open with every item registered. */
async function settled({ list, items }: AutocompleteAgent) {
  await new Promise((resolve) => setTimeout(resolve))
  await waitForAgent(
    () => list.current?.isConnected && list.current.querySelectorAll('[role="option"]').length === items.size
  )
}

interface AutocompleteState {
  s: AutocompleteAgent
  value: string
  open: boolean
  catalog: string[]
  disabled: boolean
  change: (text: string) => string | undefined
  setOpen: (open: boolean) => string | undefined
}

function autocompleteControl(c: AutocompleteState): AgentControl {
  const live = liveOf(c.s.items)
  const items = live.length ? live : c.catalog
  return {
    kind: "combobox",
    element: c.s.input.current,
    value: c.value,
    disabled: c.disabled,
    ...(items.length ? { items } : {}),
    actions: {
      setValue: (text: unknown) => c.change(String(text ?? "")),
      search: async (text: unknown) => {
        const query = String(text ?? "")
        // Opens first, so a refusal at either step leaves the text and the list as they were.
        const notOpened = c.open ? undefined : c.setOpen(true)
        if (notOpened) return notOpened
        const refused = c.change(query)
        if (refused) {
          if (!c.open) c.setOpen(false)
          return refused
        }
        await settled(c.s)
        return { result: liveOf(c.s.items) }
      },
    },
  }
}

type RootProps = AutocompletePrimitive.Root.Props<unknown>
type Details = AutocompletePrimitive.Root.ChangeEventDetails
type OpenDetails = AutocompletePrimitive.Root.OpenChangeEventDetails

/**
 * Base UI's root, holding its text and open state inside AgentProvider so an agent can
 * set them the way a parent would. Every change, the agent's included, goes through
 * `onValueChange` and `onOpenChange` first, which can cancel it.
 */
function AgentAutocomplete({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: RootProps) {
  const [value, changeValue] = useAgentState<string, Details>(
    valueProp == null ? undefined : String(valueProp),
    String(defaultValue),
    onValueChange
  )
  const [open, changeOpen] = useAgentState<boolean, OpenDetails>(openProp, defaultOpen, onOpenChange)
  const [s] = React.useState<AutocompleteAgent>(() => ({
    input: { current: null },
    list: { current: null },
    items: new Set(),
  }))

  useAgentControl(() =>
    autocompleteControl({
      s,
      value,
      open,
      catalog: leavesOf(props.items).map((i) => textOf(i, props.itemToStringValue)),
      disabled: Boolean(props.disabled),
      change: (next) => (props.readOnly ? "The autocomplete is read-only." : changeAsAgent(changeValue, next)),
      setOpen: (next) => changeAsAgent(changeOpen, next),
    })
  )

  return (
    <AutocompleteAgentContext.Provider value={s}>
      <AutocompletePrimitive.Root
        {...props}
        value={value}
        onValueChange={changeValue}
        open={open}
        onOpenChange={changeOpen}
      />
    </AutocompleteAgentContext.Provider>
  )
}

/** Base UI's root as it is, until an AgentProvider is around it. */
function AutocompleteRoot(props: RootProps) {
  if (!useHasAgent()) return <AutocompletePrimitive.Root {...props} />
  return <AgentAutocomplete {...props} />
}

const Autocomplete = AutocompleteRoot as unknown as typeof AutocompletePrimitive.Root
const AutocompleteValue = AutocompletePrimitive.Value
const AutocompleteCollection = AutocompletePrimitive.Collection
const AutocompletePortal = AutocompletePrimitive.Portal
function AutocompleteInputGroup(props: React.ComponentProps<typeof AutocompletePrimitive.InputGroup>) {
  return <AutocompletePrimitive.InputGroup data-slot="autocomplete-input-group" {...props} />
}

const AutocompleteInput = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Input>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Input
    data-slot="autocomplete-input"
    ref={useMergedRef(ref, React.useContext(AutocompleteAgentContext)?.input)}
    className={cn(
      "flex h-10 w-full bg-transparent px-3 py-2 text-sm",
      "placeholder:text-muted-foreground",
      "focus:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
))
AutocompleteInput.displayName = "AutocompleteInput"

const AutocompleteTrigger = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AutocompletePrimitive.Trigger
    data-slot="autocomplete-trigger"
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center px-3",
      "focus-visible:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children ?? (
      <AutocompletePrimitive.Icon>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </AutocompletePrimitive.Icon>
    )}
  </AutocompletePrimitive.Trigger>
))
AutocompleteTrigger.displayName = "AutocompleteTrigger"

const AutocompleteClear = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Clear>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Clear>
>(({ className, children, ...props }, ref) => (
  <AutocompletePrimitive.Clear
    data-slot="autocomplete-clear"
    ref={ref}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground",
      "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children ?? <X className="h-4 w-4" />}
  </AutocompletePrimitive.Clear>
))
AutocompleteClear.displayName = "AutocompleteClear"

const AutocompleteContent = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Popup> & {
    readonly portal?: boolean
  }
>(({ className, portal = true, ...props }, ref) => {
  const content = (
    <AutocompletePrimitive.Positioner sideOffset={4}>
      <AutocompletePrimitive.Popup
        data-slot="autocomplete-content"
        ref={ref}
        className={cn(
          "relative z-50 min-w-[var(--anchor-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "origin-[var(--transform-origin)] outline-none",
          "transition-[transform,scale,opacity] duration-[var(--motion-duration-fast,150ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          "motion-reduce:data-[starting-style]:scale-100 motion-reduce:data-[ending-style]:scale-100",
          className
        )}
        {...props}
      />
    </AutocompletePrimitive.Positioner>
  )

  if (!portal) return content

  return <AutocompletePortal>{content}</AutocompletePortal>
})
AutocompleteContent.displayName = "AutocompleteContent"

const AutocompleteList = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.List>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.List>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.List
    data-slot="autocomplete-list"
    ref={useMergedRef(ref, React.useContext(AutocompleteAgentContext)?.list)}
    className={cn("max-h-80 overflow-y-auto p-1", className)}
    {...props}
  />
))
AutocompleteList.displayName = "AutocompleteList"

const AutocompleteItem = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Item> & {
    inset?: boolean
  }
>(({ className, children, inset, ...props }, ref) => {
  const autocomplete = React.useContext(AutocompleteAgentContext)
  const element = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const el = element.current
    if (!autocomplete || !el) return
    autocomplete.items.add(el)
    return () => {
      autocomplete.items.delete(el)
    }
  }, [autocomplete])

  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      ref={useMergedRef(ref, element)}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm lg:text-base outline-none",
        "data-highlighted:bg-accent font-normal data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </AutocompletePrimitive.Item>
  )
})
AutocompleteItem.displayName = "AutocompleteItem"

const AutocompleteGroup = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Group>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Group data-slot="autocomplete-group" ref={ref} className={cn(className)} {...props} />
))
AutocompleteGroup.displayName = "AutocompleteGroup"

const AutocompleteGroupLabel = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.GroupLabel
    data-slot="autocomplete-group-label"
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
))
AutocompleteGroupLabel.displayName = "AutocompleteGroupLabel"

const AutocompleteEmpty = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Empty>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Empty
    data-slot="autocomplete-empty"
    ref={ref}
    className={cn("p-2 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
))
AutocompleteEmpty.displayName = "AutocompleteEmpty"

const AutocompleteStatus = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Status>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Status>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Status data-slot="autocomplete-status" ref={ref} className={cn("sr-only", className)} {...props} />
))
AutocompleteStatus.displayName = "AutocompleteStatus"

const AutocompleteSeparator = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Separator>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Separator
    data-slot="autocomplete-separator"
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
AutocompleteSeparator.displayName = "AutocompleteSeparator"

export {
  Autocomplete,
  AutocompleteValue,
  AutocompleteCollection,
  AutocompletePortal,
  AutocompleteInputGroup,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteStatus,
  AutocompleteSeparator,
}
