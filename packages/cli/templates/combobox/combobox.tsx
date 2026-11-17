"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  agentNodeText,
  changeAsAgent,
  createAgentChangeDetails,
  matchAgentChoice,
  sameAgentValue,
  useAgentControl,
  useAgentState,
  useHasAgent,
  useMergedRef,
  waitForAgent,
  type AgentChoice,
  type AgentControl,
} from "@/components/ui/agent"

type ElementRef = React.MutableRefObject<HTMLElement | null>

interface ComboboxAgent {
  input: ElementRef
  list: ElementRef
  /** Items in the open list, by element. */
  items: Map<HTMLElement, unknown>
  /** Set while the agent types, so the callbacks it causes carry the agent's details. */
  typing?: boolean
  refused?: boolean
}

const ComboboxAgentContext = React.createContext<ComboboxAgent | null>(null)

type Choice = AgentChoice<string> & { item: unknown }
type ToLabel = ((item: never) => string) | undefined

type Item = { label?: unknown; value?: unknown } | null | undefined

/** Base UI's own label for an item: `itemToStringLabel`, then `label`, then `value`. */
function labelOf(item: unknown, toLabel?: ToLabel): string {
  const o = item as Item
  if (toLabel && o != null) return (toLabel as (i: unknown) => string)(o) ?? ""
  return String(o?.label ?? o?.value ?? o ?? "")
}

const choiceOf = (item: unknown, label: string): Choice => ({
  item,
  label,
  value: String((item as Item)?.value ?? item),
})

const leavesOf = (data: readonly unknown[] = []) =>
  data.flatMap((e) => ((e as { items?: unknown })?.items instanceof Array ? (e as { items: unknown[] }).items : [e]))

/** Every choice the `items` prop lists, filtered or not, so the agent can choose while closed. */
function catalogOf(items: unknown, toLabel: ToLabel): Choice[] {
  const c = (
    Array.isArray(items)
      ? {
          data: items,
          value: (i: unknown) => i,
          itemLabel: (i: unknown) => labelOf(i, toLabel),
        }
      : items
  ) as
    | {
        data?: unknown[]
        value(i: unknown): unknown
        itemLabel(i: unknown): string
      }
    | undefined
  return c ? leavesOf(c.data).map((i) => choiceOf(c.value(i), c.itemLabel(i))) : []
}

const liveOf = (items: Map<HTMLElement, unknown>): Choice[] =>
  Array.from(items, ([el, item]) => ({
    ...choiceOf(item, agentNodeText(el.textContent)),
    disabled: el.hasAttribute("data-disabled"),
  }))

/** Hands Base UI's callback the agent's details while the agent types, and its refusal back. */
function relay<V, D extends { cancel(): void }>(s: ComboboxAgent, handler?: (value: V, details: D) => void) {
  return (value: V, details: D) => {
    if (!s.typing) return handler?.(value, details)
    const mine = createAgentChangeDetails<D & { isCanceled: boolean }>()
    handler?.(value, mine)
    if (mine.isCanceled) {
      s.refused = true
      details.cancel()
    }
  }
}

/** Types into the input the way a person would, so Base UI filters exactly as it does for them. */
function typeInto(s: ComboboxAgent, input: HTMLInputElement, text: string) {
  s.typing = true
  s.refused = false
  try {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, text)
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }))
    return s.refused ? "The app refused the change." : undefined
  } finally {
    s.typing = false
  }
}

/** Waits a turn for React to filter, then for the list to be open with every item registered. */
async function settled({ list, items }: ComboboxAgent) {
  await new Promise((resolve) => setTimeout(resolve))
  await waitForAgent(
    () => list.current?.isConnected && list.current.querySelectorAll('[role="option"]').length === items.size
  )
}

interface ComboboxState {
  s: ComboboxAgent
  catalog: Choice[]
  value: unknown
  open: boolean
  props: RootProps
  change: (value: unknown) => string | undefined
  setOpen: (open: boolean) => string | undefined
}

const READ_ONLY = "The combobox is read-only."

/** Searches as a person would by typing, and returns what the list then offers. */
async function search(c: ComboboxState, text: unknown) {
  const query = String(text ?? "")
  if (c.props.readOnly) return READ_ONLY
  const notOpened = c.open ? undefined : c.setOpen(true)
  if (notOpened) return notOpened
  const refused = typeInto(c.s, c.s.input.current as HTMLInputElement, query)
  if (refused) {
    // Leave the list as the agent found it.
    if (!c.open) c.setOpen(false)
    return refused
  }
  await settled(c.s)
  return { result: liveOf(c.s.items).map((i) => i.label) }
}

function comboboxActions(c: ComboboxState, choices: () => Choice[]): AgentControl["actions"] {
  // Without an `items` prop, the choices are only known once the list renders them.
  // Returns whether it opened the list, so the action closes it again.
  const load = async () => {
    const opening = !c.open && !choices().length
    if (opening) c.setOpen(true)
    await waitForAgent(() => choices().length)
    return opening
  }
  const find = (wanted: unknown) => matchAgentChoice(choices(), wanted) as Choice | string
  const current: unknown[] = Array.isArray(c.value) ? c.value : []
  return {
    select: async (wanted: unknown) => {
      const opened = await load()
      const match = find(wanted)
      const close = (result: string | undefined) => {
        if (opened || (c.open && !c.props.multiple)) c.setOpen(false)
        return result
      }
      if (typeof match === "string") return close(match)
      if (c.props.multiple)
        return close(current.some((v) => sameAgentValue(v, match.item)) ? undefined : c.change([...current, match.item]))
      return close(c.change(match.item))
    },
    ...(c.props.multiple && {
      setValue: async (wanted: unknown) => {
        const opened = await load()
        const found = [wanted].flat().map(find)
        const result = found.find((m) => typeof m === "string") ?? c.change(found.map((m) => (m as Choice).item))
        if (opened) c.setOpen(false)
        return result
      },
    }),
    search: (text: unknown) => search(c, text),
    [c.open ? "close" : "open"]: () => c.setOpen(!c.open),
  }
}

function comboboxControl(c: ComboboxState): AgentControl {
  const { multiple, disabled, itemToStringLabel } = c.props
  const choices = () => (c.catalog.length ? c.catalog : liveOf(c.s.items))
  const labelFor = (v: unknown) =>
    choices().find((i) => sameAgentValue(i.item, v))?.label ?? labelOf(v, itemToStringLabel)
  const items = choices().map((i) => i.label)
  return {
    kind: "combobox",
    element: c.s.input.current,
    value: multiple ? (c.value as unknown[]).map(labelFor) : labelFor(c.value),
    open: c.open,
    disabled,
    multiple,
    items: items.length ? items : undefined,
    actions: comboboxActions(c, choices),
  }
}

type RootProps = ComboboxPrimitive.Root.Props<unknown, boolean | undefined> & {
  itemToStringLabel?: ToLabel
}
type Details = ComboboxPrimitive.Root.ChangeEventDetails
type OpenDetails = ComboboxPrimitive.Root.OpenChangeEventDetails

/**
 * Base UI's root, holding its value and open state inside AgentProvider so an agent can
 * set them the way a parent would. The input text stays Base UI's: the agent types it, so
 * filtering and the selected label behave as they do for a person. Every change, the
 * agent's included, goes through the matching callback first, which can cancel it.
 */
function AgentCombobox({
  value: valueProp,
  defaultValue,
  onValueChange,
  onInputValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: RootProps) {
  const [value, changeValue] = useAgentState<unknown, Details>(
    valueProp,
    defaultValue ?? (props.multiple ? [] : null),
    onValueChange as (v: unknown, d: Details) => void
  )
  const [open, changeOpen] = useAgentState<boolean, OpenDetails>(openProp, defaultOpen, onOpenChange)
  const [s] = React.useState<ComboboxAgent>(() => ({
    input: { current: null },
    list: { current: null },
    items: new Map(),
  }))

  useAgentControl(() =>
    comboboxControl({
      s,
      catalog: catalogOf(props.items, props.itemToStringLabel),
      value,
      open,
      props,
      change: (next) => (props.readOnly ? READ_ONLY : changeAsAgent(changeValue, next)),
      setOpen: (next) => changeAsAgent(changeOpen, next),
    })
  )

  return (
    <ComboboxAgentContext.Provider value={s}>
      <ComboboxPrimitive.Root
        {...(props as ComboboxPrimitive.Root.Props<unknown>)}
        value={value}
        onValueChange={relay(s, changeValue)}
        onInputValueChange={relay(s, onInputValueChange)}
        open={open}
        onOpenChange={relay(s, changeOpen)}
      />
    </ComboboxAgentContext.Provider>
  )
}

/** Base UI's root as it is, until an AgentProvider is around it. */
function ComboboxRoot(props: RootProps) {
  if (!useHasAgent()) return <ComboboxPrimitive.Root {...(props as ComboboxPrimitive.Root.Props<unknown>)} />
  return <AgentCombobox {...props} />
}

const Combobox = ComboboxRoot as unknown as typeof ComboboxPrimitive.Root
const ComboboxValue = ComboboxPrimitive.Value
const ComboboxCollection = ComboboxPrimitive.Collection
const ComboboxPortal = ComboboxPrimitive.Portal
function ComboboxInputGroup(props: React.ComponentProps<typeof ComboboxPrimitive.InputGroup>) {
  return <ComboboxPrimitive.InputGroup data-slot="combobox-input-group" {...props} />
}
const createComboboxItems = ComboboxPrimitive.createItems

const ComboboxInput = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Input
    data-slot="combobox-input"
    ref={useMergedRef(ref, React.useContext(ComboboxAgentContext)?.input)}
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
ComboboxInput.displayName = "ComboboxInput"

const ComboboxTrigger = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    data-slot="combobox-trigger"
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
      <ComboboxPrimitive.Icon>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </ComboboxPrimitive.Icon>
    )}
  </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = "ComboboxTrigger"

const ComboboxClear = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Clear>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Clear>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Clear
    data-slot="combobox-clear"
    ref={ref}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground",
      "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children ?? <X className="h-4 w-4" />}
  </ComboboxPrimitive.Clear>
))
ComboboxClear.displayName = "ComboboxClear"

const ComboboxContent = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Popup> & {
    readonly portal?: boolean
  }
>(({ className, portal = true, ...props }, ref) => {
  const content = (
    <ComboboxPrimitive.Positioner sideOffset={4}>
      <ComboboxPrimitive.Popup
        data-slot="combobox-content"
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
    </ComboboxPrimitive.Positioner>
  )

  if (!portal) return content

  return <ComboboxPortal>{content}</ComboboxPortal>
})
ComboboxContent.displayName = "ComboboxContent"

const ComboboxList = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.List>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.List
    data-slot="combobox-list"
    ref={useMergedRef(ref, React.useContext(ComboboxAgentContext)?.list)}
    className={cn("max-h-80 overflow-y-auto p-1", className)}
    {...props}
  />
))
ComboboxList.displayName = "ComboboxList"

const ComboboxItem = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, children, inset, ...props }, ref) => {
  const combobox = React.useContext(ComboboxAgentContext)
  const element = React.useRef<HTMLDivElement | null>(null)
  const { value } = props

  React.useEffect(() => {
    const el = element.current
    if (!combobox || !el) return
    combobox.items.set(el, value)
    return () => {
      combobox.items.delete(el)
    }
  }, [combobox, value])

  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      ref={useMergedRef(ref, element)}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-10",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ComboboxPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </ComboboxPrimitive.ItemIndicator>
      </span>
      {children}
    </ComboboxPrimitive.Item>
  )
})
ComboboxItem.displayName = "ComboboxItem"

const ComboboxGroup = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Group>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Group data-slot="combobox-group" ref={ref} className={cn(className)} {...props} />
))
ComboboxGroup.displayName = "ComboboxGroup"

const ComboboxGroupLabel = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.GroupLabel
    data-slot="combobox-group-label"
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
))
ComboboxGroupLabel.displayName = "ComboboxGroupLabel"

const ComboboxEmpty = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Empty
    data-slot="combobox-empty"
    ref={ref}
    className={cn("p-2 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
))
ComboboxEmpty.displayName = "ComboboxEmpty"

const ComboboxStatus = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Status>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Status>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Status data-slot="combobox-status" ref={ref} className={cn("sr-only", className)} {...props} />
))
ComboboxStatus.displayName = "ComboboxStatus"

const ComboboxLabel = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Label
    data-slot="combobox-label"
    ref={ref}
    className={cn("block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
))
ComboboxLabel.displayName = "ComboboxLabel"

const ComboboxSeparator = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Separator
    data-slot="combobox-separator"
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ComboboxSeparator.displayName = "ComboboxSeparator"

export {
  Combobox,
  ComboboxValue,
  ComboboxCollection,
  ComboboxPortal,
  ComboboxInputGroup,
  createComboboxItems,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxLabel,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxSeparator,
}
