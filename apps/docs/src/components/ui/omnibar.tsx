"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { MoreHorizontal, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  changeAsAgent,
  createAgentChangeDetails,
  matchAgentChoice,
  useAgentControl,
  useAgentLatest,
  useHasAgent,
  useMergedRef,
  waitForAgent,
} from "@/components/ui/agent"
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer"

// The item shape the Command Palette uses too, so one list feeds both.
import { filterCommands, type CommandAction, type CommandItem, type CommandRunDetails, type CommandRunReason } from "@/components/ui/command-items"
export { filterCommands }
export type { CommandAction, CommandItem, CommandRunDetails, CommandRunReason }

/** A slice of the list, picked by chip or by typing its prefix first. */
export interface OmnibarScope {
  id: string
  /** The chip's text. By default the scope holds the items whose `group` is this. */
  label: string
  /** Typed at the start of the search, such as "@", it switches to this scope. */
  prefix?: string
  /** Which items the scope holds, when `group` is not the way to tell. */
  match?: (item: CommandItem) => boolean
}

/** How `onRun` was reached. `cancel()` keeps the omnibar open and tells an agent it was refused. */
export type OmnibarRunDetails = CommandRunDetails

type OpenDetails = PopoverPrimitive.Root.ChangeEventDetails
type ValueDetails = AutocompletePrimitive.Root.ChangeEventDetails
type Group = { value: string; items: CommandItem[] }

function groupsOf(items: CommandItem[]): Group[] {
  const groups: Group[] = []
  for (const item of items) {
    const value = item.group ?? ""
    const last = groups.find((g) => g.value === value)
    if (last) last.items.push(item)
    else groups.push({ value, items: [item] })
  }
  return groups
}

/** A sub-list has no level of its own here: its items are listed in its place. */
const flatten = (items: CommandItem[]): CommandItem[] => items.flatMap((i) => (i.items ? flatten(i.items) : [i]))

/**
 * Disabled items last in their group, and groups with nothing to run last, so the
 * highlight Base UI puts on the first row lands where Enter does something.
 */
const usableFirst = (groups: Group[]): Group[] =>
  groups
    .map((g) => ({ ...g, items: [...g.items.filter((i) => !i.disabled), ...g.items.filter((i) => i.disabled)] }))
    .sort((a, b) => Number(Boolean(a.items[0]?.disabled)) - Number(Boolean(b.items[0]?.disabled)))

const inScope = (scope: OmnibarScope, item: CommandItem) => (scope.match ? scope.match(item) : item.group === scope.label)

/** Change details for a person's change that Base UI did not make itself. */
function personDetails<D>(reason: string, event?: Event): D {
  const details = {
    reason,
    event,
    isCanceled: false,
    isPropagationAllowed: false,
    trigger: undefined,
    cancel() {
      details.isCanceled = true
    },
    allowPropagation() {},
    preventUnmountOnClose() {},
  }
  return details as unknown as D
}

const PHONE = "(max-width: 639px)"

function usePhone(): boolean {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia?.(PHONE)
      query?.addEventListener?.("change", onChange)
      return () => query?.removeEventListener?.("change", onChange)
    },
    () => Boolean(window.matchMedia?.(PHONE).matches),
    () => false
  )
}

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

/** A field, a text area or anything editable, where a typed "/" belongs to the text. */
const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

interface OmnibarContext {
  /** Inside an AgentProvider: marks the omnibar's own buttons so the agent sees one control. */
  part: "" | undefined
  label: string
  open: boolean
  disabled: boolean
  phone: boolean
  query: string
  setQuery: (query: string, details: ValueDetails) => void
  scopes: OmnibarScope[]
  scope: OmnibarScope | undefined
  /** `quiet` when the change already announces itself, as a chip's aria-pressed does. */
  setScope: (id: string | null, quiet?: boolean) => void
  shown: Group[]
  /** How many matched before `limit` cut the list. */
  total: number
  /** The search's words, for bolding them in a row. */
  marks: RegExp | null
  sheet: CommandItem | undefined
  /** Opens the action sheet for `item` from the button `from`, or closes it. */
  showSheet: (item?: CommandItem, from?: HTMLElement) => void
  run: (item: CommandItem, action: CommandAction | undefined, details: OmnibarRunDetails) => string | undefined
  close: (event?: Event) => void
  shortcut: string | false
  trigger: React.MutableRefObject<HTMLElement | null>
  /** The ⋯ button that opened the sheet, where focus goes back to. */
  opener: React.MutableRefObject<HTMLElement | null>
  input: React.MutableRefObject<HTMLInputElement | null>
  live: Live
  /** The id of the text naming what Enter runs on the highlighted row. */
  hintId: string
}

interface LiveState {
  highlighted: CommandItem | undefined
  /** Which of the highlighted row's actions Enter runs. Tab moves it. */
  action: number
  /** The latest polite announcement. */
  say: string
}

/**
 * The highlight lives outside React state, so moving it re-renders only the two rows it
 * leaves and lands on, not the whole list.
 */
function createLive() {
  let state: LiveState = { highlighted: undefined, action: 0, say: "" }
  const subs = new Set<() => void>()
  return {
    get: () => state,
    set(next: Partial<LiveState>) {
      state = { ...state, ...next }
      subs.forEach((f) => f())
    },
    subscribe(f: () => void) {
      subs.add(f)
      return () => void subs.delete(f)
    },
  }
}
type Live = ReturnType<typeof createLive>

function useLive<T>(live: Live, pick: (state: LiveState) => T): T {
  return React.useSyncExternalStore(live.subscribe, () => pick(live.get()), () => pick(live.get()))
}

/** A stable function that always calls the latest `fn`. */
function useStable<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const latest = useAgentLatest(fn)
  return React.useCallback((...args: A) => latest.current(...args), [latest])
}

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const OmnibarContext = React.createContext<OmnibarContext | null>(null)

function useOmnibar(part: string): OmnibarContext {
  const context = React.useContext(OmnibarContext)
  if (!context) throw new Error(`${part} must be inside <Omnibar>.`)
  return context
}

export interface OmnibarProps {
  /** Every command, in the order groups and items are listed. */
  items: CommandItem[]
  /** The chips after All. A typed `prefix` switches to its scope. */
  scopes?: OmnibarScope[]
  /** Ids listed first, under "Recent", while the search is empty and no scope is picked. */
  recent?: string[]
  recentLabel?: string
  /** Ids listed after Recent while the search is empty and no scope is picked, under their own groups. */
  suggested?: string[]
  /** How many rows show while the search is empty, when `recent` or `suggested` is set. */
  idleLimit?: number
  /** The most rows the list renders. Keep typing to narrow past it. */
  limit?: number
  /** Runs a picked item. `details.cancel()` keeps the omnibar open. */
  onRun?: (item: CommandItem, action: CommandAction | undefined, details: OmnibarRunDetails) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: OpenDetails) => void
  /** The search text. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, details: ValueDetails) => void
  /** The picked scope's id, or null for All. */
  scope?: string | null
  defaultScope?: string | null
  onScopeChange?: (scope: string | null) => void
  /**
   * The key that focuses it from anywhere but another field, such as "/". "mod+j" asks for
   * Cmd or Ctrl and works in fields too. `false` turns it off.
   */
  shortcut?: string | false
  /** Names the field and the panel, and is what an agent finds it by. */
  label?: string
  filter?: (item: CommandItem, query: string) => boolean
  disabled?: boolean
  children?: React.ReactNode
}

/**
 * The header's search field and the results panel it grows into: a Base UI popover over
 * the field, holding an Autocomplete. No dialog and no scrim, so the page stays in view.
 * Forgets the search and scope when it closes.
 */
function Omnibar({
  items,
  scopes = [],
  recent,
  recentLabel = "Recent",
  suggested,
  idleLimit = 8,
  limit = 50,
  onRun,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  scope: scopeProp,
  defaultScope = null,
  onScopeChange,
  shortcut = "/",
  label = "Search",
  filter = filterCommands,
  disabled = false,
  children,
}: OmnibarProps) {
  const [openInner, setOpenInner] = React.useState(defaultOpen)
  const [queryInner, setQueryInner] = React.useState(defaultValue)
  const [scopeInner, setScopeInner] = React.useState(defaultScope)
  const [live] = React.useState(createLive)
  const hintId = React.useId()
  const [sheet, setSheet] = React.useState<CommandItem | undefined>()
  const open = openProp ?? openInner
  const query = valueProp ?? queryInner
  const scopeId = scopeProp === undefined ? scopeInner : scopeProp
  const scope = scopes.find((s) => s.id === scopeId)
  const phone = usePhone()
  const trigger = React.useRef<HTMLElement | null>(null)
  const input = React.useRef<HTMLInputElement | null>(null)
  const opener = React.useRef<HTMLElement | null>(null)

  const setScope = useStable((id: string | null, quiet?: boolean) => {
    onScopeChange?.(id)
    if (scopeProp === undefined) setScopeInner(id)
    const picked = scopes.find((s) => s.id === id)
    live.set({ action: 0, say: quiet ? "" : `Scope: ${picked ? picked.label : "All"}` })
  })

  // Closed by the app or by the omnibar, it starts over next time.
  React.useEffect(() => {
    if (!open) live.set({ highlighted: undefined, action: 0, say: "" })
  }, [open, live])
  const [wasOpen, setWasOpen] = React.useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) {
      setSheet(undefined)
      if (valueProp === undefined) setQueryInner("")
      if (scopeProp === undefined) setScopeInner(null)
    }
  }

  const changeOpen = React.useCallback(
    (next: boolean, details: OpenDetails) => {
      onOpenChange?.(next, details)
      if (!details.isCanceled && openProp === undefined) setOpenInner(next)
    },
    [onOpenChange, openProp]
  )

  // A typed prefix picks its scope and leaves the field.
  const setQuery = useStable((next: string, details: ValueDetails) => {
    const typed = scope ? undefined : scopes.find((s) => s.prefix && next.startsWith(s.prefix))
    if (typed) {
      setScope(typed.id)
      next = next.slice(typed.prefix!.length).trimStart()
    }
    onValueChange?.(next, details)
    if (!details.isCanceled && valueProp === undefined) setQueryInner(next)
    live.set({ action: 0 })
  })

  const all = React.useMemo(() => flatten(items), [items])
  const { shown, total } = React.useMemo(() => {
    const cap = (groups: Group[]) => {
      let left = limit
      const kept = groups.map((g) => {
        const items = g.items.slice(0, Math.max(0, left))
        left -= items.length
        return { ...g, items }
      })
      return { shown: kept.filter((g) => g.items.length), total: groups.reduce((n, g) => n + g.items.length, 0) }
    }
    const list = scope ? all.filter((item) => inScope(scope, item)) : all
    if (query.trim()) return cap(usableFirst(groupsOf(list.filter((item) => filter(item, query)))))
    if (scope || (!recent?.length && !suggested)) return cap(usableFirst(groupsOf(list)))
    const pick = (ids: string[]) => ids.map((id) => list.find((item) => item.id === id)).filter((item): item is CommandItem => !!item)
    const first = pick(recent ?? []).slice(0, idleLimit)
    const next = (suggested ? pick(suggested) : list).filter((item) => !first.includes(item)).slice(0, idleLimit - first.length)
    return cap(usableFirst([{ value: recentLabel, items: first }, ...groupsOf(next)].filter((g) => g.items.length)))
  }, [all, scope, query, recent, recentLabel, suggested, idleLimit, limit, filter])

  const marks = React.useMemo(() => {
    const words = query.split(/\s+/).filter(Boolean).map(escape)
    return words.length ? new RegExp(`(${words.join("|")})`, "ig") : null
  }, [query])

  const showSheet = useStable((item?: CommandItem, from?: HTMLElement) => {
    if (item) {
      opener.current = from!
      input.current?.blur()
    }
    setSheet(item)
  })

  const close = useStable((event?: Event) => changeOpen(false, personDetails("imperative-action", event)))

  const run = useStable((item: CommandItem, action: CommandAction | undefined, details: OmnibarRunDetails) => {
    onRun?.(item, action, details)
    if (details.isCanceled) return "The app refused the command."
    if (details.event?.type === "agent") changeOpen(false, createAgentChangeDetails<OpenDetails>())
    else close(details.event)
    return undefined
  })

  const latest = useAgentLatest({ open, disabled, changeOpen })
  React.useEffect(() => {
    if (shortcut === false || disabled) return
    const mod = shortcut.toLowerCase().startsWith("mod+")
    const key = mod ? shortcut.slice(4).toLowerCase() : shortcut
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat || latest.current.open || event.altKey) return
      if (mod ? event.key.toLowerCase() !== key || !(event.metaKey || event.ctrlKey) : event.key !== key || event.metaKey || event.ctrlKey || isEditable(event.target)) return
      event.preventDefault()
      latest.current.changeOpen(true, personDetails("none", event))
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [shortcut, disabled, latest])

  const part = useHasAgent() ? "" : undefined
  const context = React.useMemo<OmnibarContext>(
    () => ({ part, label, open, disabled, phone, query, setQuery, scopes, scope, setScope, shown, total, marks, sheet, showSheet, run, close, shortcut, trigger, opener, input, live, hintId }),
    [part, label, open, disabled, phone, query, setQuery, scopes, scope, setScope, shown, total, marks, sheet, showSheet, run, close, shortcut, live, hintId]
  )

  useOmnibarAgent(context, all, changeOpen)

  // An open action sheet is part of the omnibar, so a tap on it does not close the panel.
  const onPopoverOpenChange = (next: boolean, details: OpenDetails) => {
    if (!next && sheet && details.reason === "outside-press") return details.cancel()
    changeOpen(next, details)
  }

  return (
    <OmnibarContext.Provider value={context}>
      <PopoverPrimitive.Root open={open} onOpenChange={onPopoverOpenChange} modal={phone}>
        {children}
      </PopoverPrimitive.Root>
    </OmnibarContext.Provider>
  )
}

const describe = (item: CommandItem) => ({
  label: item.label,
  ...(item.group ? { group: item.group } : {}),
  ...(item.actions ? { actions: item.actions.map((a) => a.label) } : {}),
})

/**
 * One combobox control for the agent: the field while closed, the search while open. It
 * lists every command while closed and the matches while open.
 */
function useOmnibarAgent(c: OmnibarContext, all: CommandItem[], changeOpen: (next: boolean, details: OpenDetails) => void) {
  const latest = useAgentLatest(c)
  const opened = () => (latest.current.open ? undefined : changeAsAgent(changeOpen, true))

  useAgentControl(() => ({
    kind: "combobox",
    element: c.open ? c.input.current : c.trigger.current,
    label: c.label,
    open: c.open,
    disabled: c.disabled,
    ...(c.open ? { value: (c.scope?.prefix ?? "") + c.query } : {}),
    items: (c.open ? c.shown : groupsOf(all)).flatMap((g) => g.items).map((i) => i.label),
    actions: {
      [c.open ? "close" : "open"]: () => changeAsAgent(changeOpen, !c.open),
      search: async (text: unknown, scopeName?: unknown) => {
        let id = c.scope?.id ?? null
        if (scopeName != null) {
          const found = matchAgentChoice([{ value: null, label: "All" }, ...c.scopes.map((s) => ({ value: s.id, label: s.label }))], scopeName)
          if (typeof found === "string") return found
          id = found.value
        }
        const refused = opened()
        if (refused) return refused
        c.setScope(id)
        const failed = changeAsAgent(latest.current.setQuery, String(text ?? ""))
        if (failed) return failed
        await new Promise((resolve) => setTimeout(resolve))
        await waitForAgent(() => latest.current.open && latest.current.input.current?.isConnected)
        return { result: latest.current.shown.flatMap((g) => g.items).map(describe) }
      },
      select: (wanted: unknown, actionName?: unknown) => {
        const match = matchAgentChoice(all.map((item) => ({ value: item, label: item.label, disabled: item.disabled })), wanted)
        if (typeof match === "string") return match
        const item = match.value
        let action = item.actions?.[0]
        if (actionName != null) {
          const found = matchAgentChoice((item.actions ?? []).map((a) => ({ value: a, label: a.label })), actionName)
          if (typeof found === "string") return found
          action = found.value
        }
        return c.run(item, action, createAgentChangeDetails("item-press"))
      },
    },
  }))
}

const kbd = "rounded border border-b-2 bg-background px-[5px] py-px font-mono text-[10.5px] font-normal leading-normal text-muted-foreground"

/** The shortcut as a person reads it: "/" as is, "mod+j" as ⌘ J or Ctrl J. */
const keyHint = (shortcut: string) =>
  shortcut.toLowerCase().startsWith("mod+") ? `${isMac() ? "⌘" : "Ctrl"} ${shortcut.slice(4).toUpperCase()}` : shortcut

/**
 * The field in the header while closed. A click, Enter or its shortcut opens the panel
 * over it, and typing a letter here starts the search with it.
 */
interface OmnibarTriggerProps extends PopoverPrimitive.Trigger.Props {
  /** The field's text while closed. */
  placeholder?: string
}

const OmnibarTrigger = React.forwardRef<HTMLButtonElement, OmnibarTriggerProps>(
  ({ className, children, disabled, placeholder = "Search or run a command", onKeyDown, ...props }, ref) => {
    const c = useOmnibar("OmnibarTrigger")
    return (
      <PopoverPrimitive.Trigger
        ref={useMergedRef(ref, c.trigger)}
        data-agent-part={c.part}
        disabled={disabled || c.disabled}
        aria-label={c.label}
        data-slot="omnibar-trigger"
        onKeyDown={(event) => {
          onKeyDown?.(event)
          // The shortcut only opens it; the global listener sees the same key.
          if (event.key === c.shortcut) return
          if (event.key.length !== 1 || event.key === " " || event.metaKey || event.ctrlKey || event.altKey) return
          event.preventDefault()
          c.setQuery(event.key, personDetails("input-change", event.nativeEvent))
          event.currentTarget.click()
        }}
        className={cn(
          "relative flex h-10 w-full items-center gap-2 rounded-[10px] bg-muted px-3 after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] sm:after:hidden text-left text-base text-muted-foreground outline-none",
          "sm:h-8 sm:w-56 sm:rounded-[9px] sm:border sm:bg-card sm:pl-2.5 sm:pr-2 sm:text-[13px]",
          "focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:flex-none",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <Search aria-hidden />
            <span className="min-w-0 flex-1 truncate">{placeholder}</span>
            {c.shortcut && <kbd className={cn(kbd, "hidden sm:inline-block")}>{keyHint(c.shortcut)}</kbd>}
          </>
        )}
      </PopoverPrimitive.Trigger>
    )
  }
)
OmnibarTrigger.displayName = "OmnibarTrigger"

/** Keeps the phone layout above the on-screen keyboard, which `100dvh` does not account for. */
function useKeyboardFit(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  React.useEffect(() => {
    const viewport = window.visualViewport
    const el = ref.current
    if (!active || !viewport || !el) return
    const fit = () => {
      el.style.setProperty("--omnibar-height", `${viewport.height}px`)
      el.style.setProperty("--omnibar-top", `${viewport.offsetTop}px`)
    }
    fit()
    viewport.addEventListener("resize", fit)
    viewport.addEventListener("scroll", fit)
    return () => {
      viewport.removeEventListener("resize", fit)
      viewport.removeEventListener("scroll", fit)
    }
  }, [ref, active])
}

/**
 * Hides the rest of the page from assistive tech while the full-screen panel is up, but
 * not live regions, so toasts and other announcements still speak.
 */
function useHideOthers(el: HTMLElement | null, active: boolean) {
  React.useEffect(() => {
    if (!active || !el) return
    const keep = [el, ...document.querySelectorAll("[aria-live]")]
    const hidden: Element[] = []
    const walk = (parent: Element): void =>
      Array.from(parent.children).forEach((n) => {
        if (keep.includes(n) || n.hasAttribute("aria-hidden")) return
        if (keep.some((k) => n.contains(k))) return walk(n)
        hidden.push(n)
        n.setAttribute("aria-hidden", "true")
      })
    walk(document.body)
    return () => hidden.forEach((n) => n.removeAttribute("aria-hidden"))
  }, [el, active])
}

// The panel sits over the field and lines its search up with it.
const overField: PopoverPrimitive.Positioner.Props["sideOffset"] = ({ anchor }) => -anchor.height - (40 - anchor.height) / 2
const FILL: React.CSSProperties = { position: "fixed", inset: 0, transform: "none" }

interface OmnibarContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> {
  /** Which edge of the field the panel keeps when it is wider. */
  align?: PopoverPrimitive.Positioner.Props["align"]
}

/**
 * The panel the field grows into: 560px wide over the field on a desktop, the whole
 * screen on a phone. Opened many times a day, so it appears and changes with no motion.
 */
const OmnibarContent = React.forwardRef<HTMLDivElement, OmnibarContentProps>(
  ({ className, children, align = "end", ...props }, ref) => {
    const c = useOmnibar("OmnibarContent")
    const popup = React.useRef<HTMLDivElement | null>(null)
    const [node, setNode] = React.useState<HTMLDivElement | null>(null)
    const merged = useMergedRef(ref, popup, setNode)
    useKeyboardFit(popup, c.open && c.phone)
    useHideOthers(node, c.open && c.phone)
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side="bottom"
          align={align}
          sideOffset={overField}
          collisionAvoidance={{ side: "none", align: "shift" }}
          collisionPadding={8}
          style={c.phone ? FILL : undefined}
          className="z-50"
        >
          <PopoverPrimitive.Popup
            ref={merged}
            data-agent-part={c.part}
            aria-label={c.label}
            aria-modal={c.phone || undefined}
            initialFocus={c.input}
            data-slot="omnibar-content"
            className={cn(
              "flex flex-col overflow-hidden text-popover-foreground outline-none",
              c.phone
                ? "fixed inset-x-0 top-[var(--omnibar-top,0px)] h-[var(--omnibar-height,100dvh)] bg-background"
                : "w-[560px] min-w-[var(--anchor-width)] max-w-[var(--available-width,calc(100vw-16px))] rounded-[13px] border bg-popover shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)]",
              className
            )}
            {...props}
          >
            <AutocompletePrimitive.Root
              inline
              open
              items={c.shown}
              filteredItems={c.shown}
              value={c.query}
              onValueChange={c.setQuery}
              autoHighlight="always"
              keepHighlight
              itemToStringValue={(item: CommandItem) => item.label}
              // A move the person made clears the last announcement, so the same text can speak again.
              onItemHighlighted={(item: CommandItem | undefined, { reason }) =>
                c.live.set({ highlighted: item, action: 0, ...(reason !== "none" && { say: "" }) })
              }
            >
              {children}
            </AutocompletePrimitive.Root>
            <Spoken />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    )
  }
)
OmnibarContent.displayName = "OmnibarContent"

/** What Enter runs on the highlighted row. */
function enterHint(state: LiveState): string {
  const action = state.highlighted?.disabled ? undefined : state.highlighted?.actions?.[state.action]
  return action ? `Enter: ${action.label}. Tab: next action` : ""
}

/** The text the highlighted row is described by, and the polite announcements. */
function Spoken() {
  const c = useOmnibar("OmnibarContent")
  const hint = useLive(c.live, enterHint)
  const say = useLive(c.live, (s) => s.say)
  return (
    <>
      <span id={c.hintId} hidden>
        {hint}
      </span>
      <span aria-live="polite" className="sr-only">
        {say}
      </span>
    </>
  )
}

interface OmnibarInputProps extends React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Input> {
  /** The phone's button that closes the omnibar. */
  cancelLabel?: string
  /** The placeholder on a phone, where the field is narrower. Defaults to `placeholder`. */
  phonePlaceholder?: string
}

/**
 * The search, with the picked scope as a chip before it. Backspace on an empty search
 * drops the scope, and Tab moves between the highlighted row's actions.
 */
const OmnibarInput = React.forwardRef<HTMLInputElement, OmnibarInputProps>(
  ({ className, cancelLabel = "Cancel", placeholder = "Search or run a command", phonePlaceholder = placeholder, onKeyDown, ...props }, ref) => {
    const c = useOmnibar("OmnibarInput")
    const assign = useMergedRef(ref, c.input)
    return (
      <div
        className={cn(
          "flex flex-none items-center gap-2 border-b [&>svg]:h-4 [&>svg]:w-4 [&>svg]:flex-none [&>svg]:text-muted-foreground",
          c.phone ? "h-[52px] pl-3.5 pr-1" : "h-10 px-2.5"
        )}
      >
        <Search aria-hidden />
        {c.scope && !c.phone && (
          <span className="flex-none rounded-md bg-primary px-[7px] py-0.5 text-xs font-medium text-primary-foreground">{c.scope.label}</span>
        )}
        <AutocompletePrimitive.Input
          ref={assign}
          data-slot="omnibar-input"
          aria-label={c.label}
          placeholder={c.scope ? `Search ${c.scope.label.toLowerCase()}` : c.phone ? phonePlaceholder : placeholder}
          enterKeyHint="go"
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (event.key === "Backspace" && !c.query && c.scope) {
              event.preventDefault()
              return c.setScope(null)
            }
            const { highlighted, action } = c.live.get()
            const count = highlighted?.disabled ? 0 : (highlighted?.actions?.length ?? 0)
            if (event.key === "Tab" && count > 1) {
              event.preventDefault()
              const next = (action + (event.shiftKey ? count - 1 : 1)) % count
              c.live.set({ action: next, say: `Enter: ${highlighted!.actions![next].label}` })
            }
          }}
          className={cn(
            "min-w-0 flex-1 text-ellipsis bg-transparent outline-none placeholder:text-muted-foreground",
            c.phone ? "text-base" : "text-sm",
            className
          )}
          {...props}
        />
        {c.phone ? (
          <button
            type="button"
            data-agent-part={c.part}
            onClick={(event) => c.close(event.nativeEvent)}
            className="h-11 flex-none px-2.5 text-[15px] text-[color:color-mix(in_oklab,var(--info),var(--foreground)_20%)]"
          >
            {cancelLabel}
          </button>
        ) : (
          <kbd className={kbd}>esc</kbd>
        )}
      </div>
    )
  }
)
OmnibarInput.displayName = "OmnibarInput"

/** All and one chip per scope, with its prefix on a desktop. Changes are instant. */
const OmnibarScopes = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { allLabel?: string }>(
  ({ className, allLabel = "All", "aria-label": ariaLabel = "Scope", ...props }, ref) => {
    const c = useOmnibar("OmnibarScopes")
    if (!c.scopes.length) return null
    const chips = [{ id: null, label: allLabel, prefix: undefined }, ...c.scopes]
    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        data-slot="omnibar-scopes"
        className={cn(
          "flex flex-none overflow-x-auto [scrollbar-width:none]",
          c.phone ? "gap-1.5 px-3.5 pb-1.5 pt-2.5 after:flex-[0_0_8px] after:content-['']" : "gap-1 px-2.5 pb-1 pt-2",
          className
        )}
        {...props}
      >
        {chips.map((s) => (
          <button
            key={s.id ?? ""}
            type="button"
            data-agent-part={c.part}
            aria-pressed={(c.scope?.id ?? null) === s.id}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              c.setScope(s.id, true)
              c.input.current?.focus()
            }}
            className={cn(
              "flex-none whitespace-nowrap rounded-full border text-muted-foreground",
              "aria-pressed:border-transparent aria-pressed:bg-muted aria-pressed:text-foreground",
              c.phone ? "relative min-h-9 px-3 text-[13.5px] after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']" : "px-[9px] py-[3px] text-xs"
            )}
          >
            {s.label}
            {s.prefix && !c.phone && <span className="ml-[3px] font-mono text-foreground">{s.prefix}</span>}
          </button>
        ))}
      </div>
    )
  }
)
OmnibarScopes.displayName = "OmnibarScopes"

function Highlight({ text, marks }: { text: string; marks: RegExp | null }) {
  if (!marks) return <>{text}</>
  const parts = text.split(marks)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <mark key={i} className="bg-transparent font-semibold text-foreground">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

const actionHint = "whitespace-nowrap rounded-[7px] border bg-background px-2 py-[3px] text-xs"
const primary = "border-transparent bg-primary text-primary-foreground"

interface OmnibarItemProps extends Omit<React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Item>, "value"> {
  item: CommandItem
}

/**
 * One result. Highlighted on a desktop, it shows its actions inline: a click on one runs
 * it, and Tab picks which one Enter runs. On a phone the top hit carries them as buttons
 * and other rows keep them behind a menu beside the row.
 */
const OmnibarItemRow = React.forwardRef<HTMLDivElement, OmnibarItemProps>(({ item, className, children, onClick, ...props }, ref) => {
  const c = useOmnibar("OmnibarItem")
  const actions = item.actions ?? []
  const many = actions.length > 1 && !item.disabled
  // The picked action while this row is highlighted, otherwise -1.
  const picked = useLive(c.live, (s) => (s.highlighted === item ? s.action : -1))
  const on = picked >= 0
  const top = c.phone && many && Boolean(c.query.trim()) && c.shown[0]?.items[0] === item
  const menu = c.phone && many && !top
  const press = (action: CommandAction | undefined, event: React.MouseEvent) => {
    event.stopPropagation()
    c.run(item, action, personDetails("action-press", event.nativeEvent))
  }
  const row = (
    <AutocompletePrimitive.Item
      ref={ref}
      value={item}
      disabled={item.disabled}
      data-slot="omnibar-item"
      aria-describedby={on && many ? c.hintId : undefined}
      onClick={(event) => {
        onClick?.(event)
        const hint = (event.target as Element).closest?.("[data-omnibar-action]")
        const index = hint ? Number(hint.getAttribute("data-omnibar-action")) : Math.max(picked, 0)
        c.run(item, actions[index], personDetails(hint ? "action-press" : "item-press", event.nativeEvent))
      }}
      className={cn(
        // The highlight follows the keys and the pointer, so it moves with no transition.
        "group relative flex cursor-default select-none items-center gap-2.5 rounded-[9px] outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        c.phone ? "min-h-11 px-2 py-[11px] text-[15px]" : "px-2.5 py-2 text-[13.5px] data-[highlighted]:bg-muted",
        menu && "min-w-0 flex-1",
        className
      )}
      {...props}
      // Base UI leaves it unset in autocomplete mode; after the spread so it always holds.
      aria-selected={on}
    >
      {children ?? (
        <>
          {item.icon && (
            <span
              className={cn(
                "grid flex-none place-items-center bg-muted text-muted-foreground [&_svg]:h-4 [&_svg]:w-4",
                c.phone ? "h-8 w-8 rounded-[9px]" : "h-[26px] w-[26px] rounded-[7px] group-data-[highlighted]:bg-background group-data-[highlighted]:text-foreground",
                top && "bg-background text-foreground"
              )}
            >
              {item.icon}
            </span>
          )}
          <span className={cn("min-w-0 flex-1", !c.phone && "truncate")}>
            <Highlight text={item.label} marks={c.marks} />
            {item.description && (
              <span className={cn("text-muted-foreground", c.phone ? "block text-[13px]" : "ml-1.5 text-[12.5px]")}>
                <Highlight text={item.description} marks={c.marks} />
              </span>
            )}
          </span>
          {menu ? null : on && many && !c.phone ? (
            // Pointer targets only: the row is the one control, and aria-describedby names what Enter runs.
            <span aria-hidden className="ml-2 flex flex-none items-center gap-1">
              {actions.map((action, i) => (
                <span key={action.id} data-omnibar-action={i} className={cn(actionHint, "cursor-pointer", i === picked && primary)}>
                  {action.label}
                </span>
              ))}
              <kbd className={cn(kbd, "ml-1")}>tab</kbd>
            </span>
          ) : (
            <span className="ml-auto flex flex-none items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
              {item.meta}
              {item.shortcut && !c.phone && <kbd className={kbd}>{item.shortcut}</kbd>}
            </span>
          )}
        </>
      )}
    </AutocompletePrimitive.Item>
  )
  if (menu) {
    // Touch targets only, like the top hit's buttons: OmnibarList lists the same menus outside the listbox.
    return (
      <div className="flex items-center">
        {row}
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={(event) => c.showSheet(item, event.currentTarget)}
          className="grid h-11 w-11 flex-none place-items-center rounded-[9px] text-muted-foreground [&_svg]:h-4 [&_svg]:w-4"
        >
          <MoreHorizontal aria-hidden />
        </button>
      </div>
    )
  }
  if (!top) return row
  return (
    <div className="mb-1.5 mt-0.5 rounded-[14px] bg-muted pb-2.5 pt-0.5">
      {row}
      <div aria-hidden className="flex gap-1.5 px-2">
        {actions.map((action, i) => (
          <button
            key={action.id}
            type="button"
            tabIndex={-1}
            onClick={(event) => press(action, event)}
            className={cn("relative h-10 min-w-0 flex-1 after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] truncate rounded-[10px] border bg-background px-2 text-sm font-medium", i === Math.max(picked, 0) && primary)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
})
OmnibarItemRow.displayName = "OmnibarItem"

/** Memoized, so a row renders again only when its item, the search or its highlight changes. */
const OmnibarItem = React.memo(OmnibarItemRow)


interface OmnibarListProps extends Omit<React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.List>, "children"> {
  /** Renders each row. Defaults to an `OmnibarItem` for the item. */
  children?: (item: CommandItem) => React.ReactNode
  /** Shown when nothing matches. */
  empty?: React.ReactNode | ((query: string) => React.ReactNode)
}

/** The grouped results, and on a phone the sheet a row's menu opens. */
const OmnibarList = React.forwardRef<HTMLDivElement, OmnibarListProps>(({ className, children, empty, ...props }, ref) => {
  const c = useOmnibar("OmnibarList")
  const row = children ?? ((item: CommandItem) => <OmnibarItem key={item.id} item={item} />)
  const sheet = c.sheet
  const count = c.shown.reduce((n, g) => n + g.items.length, 0)
  return (
    <>
      <AutocompletePrimitive.Status className="sr-only">
        {/* Empty announces itself when nothing matches. */}
        {c.query.trim() && count ? (count < c.total ? `${count} of ${c.total} results` : count === 1 ? "1 result" : `${count} results`) : ""}
      </AutocompletePrimitive.Status>
      <AutocompletePrimitive.Empty
        data-slot="omnibar-empty"
        className="px-3 py-[30px] text-center text-[13px] text-muted-foreground empty:hidden"
      >
        {typeof empty === "function" ? empty(c.query) : (empty ?? `Nothing matches “${c.query}”`)}
      </AutocompletePrimitive.Empty>
      <AutocompletePrimitive.List
        ref={ref}
        aria-label={c.label}
        data-slot="omnibar-list"
        className={cn(
          "overflow-y-auto [scrollbar-width:thin] empty:hidden",
          c.phone ? "min-h-0 flex-1 px-2 pb-5 pt-1" : "max-h-[360px] px-1.5 pb-1.5 pt-1",
          className
        )}
        {...props}
      >
        {(group: Group) => (
          <AutocompletePrimitive.Group key={group.value} items={group.items} data-slot="omnibar-group">
            {group.value && (
              <AutocompletePrimitive.GroupLabel
                data-slot="omnibar-group-label"
                className="px-2.5 pb-1 pt-2.5 text-[11.5px] font-medium text-muted-foreground"
              >
                {group.value}
              </AutocompletePrimitive.GroupLabel>
            )}
            <AutocompletePrimitive.Collection>{(item: CommandItem) => row(item)}</AutocompletePrimitive.Collection>
          </AutocompletePrimitive.Group>
        )}
      </AutocompletePrimitive.List>
      {c.phone && (
        // A screen reader's way to each row's ⋯ menu, which is a touch target inside the listbox.
        <div className="sr-only">
          {c.shown.flatMap((g) => g.items).map(
            (item) =>
              !item.disabled &&
              item.actions?.[1] && (
                <button key={item.id} type="button" tabIndex={-1} onClick={(event) => c.showSheet(item, event.currentTarget)}>
                  Actions for {item.label}
                </button>
              )
          )}
        </div>
      )}
      {c.phone && (
        <Drawer open={Boolean(sheet)} onOpenChange={(next) => !next && c.showSheet()}>
          <DrawerContent
            side="bottom"
            finalFocus={() => (c.opener.current?.isConnected ? c.opener.current : c.input.current)}
            className="gap-0 rounded-t-[20px] border-0 bg-popover px-2 pb-[max(26px,env(safe-area-inset-bottom))] pt-2">
            <div aria-hidden className="mx-auto mb-2.5 mt-0.5 h-[5px] w-9 rounded-full bg-muted-foreground opacity-40" />
            {sheet && (
              <>
                <DrawerTitle className="px-3.5 text-[15px] font-semibold leading-snug tracking-normal">{sheet.label}</DrawerTitle>
                {sheet.description && <DrawerDescription className="px-3.5 text-[13px]">{sheet.description}</DrawerDescription>}
                <div className="mt-2">
                  {sheet.actions?.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={(event) => {
                        c.showSheet()
                        c.run(sheet, action, personDetails("action-press", event.nativeEvent))
                      }}
                      className="block min-h-[50px] w-full rounded-xl px-3.5 text-left text-base hover:bg-muted active:bg-muted"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
})
OmnibarList.displayName = "OmnibarList"

export { Omnibar, OmnibarTrigger, OmnibarContent, OmnibarInput, OmnibarScopes, OmnibarList, OmnibarItem }
export type { OmnibarTriggerProps, OmnibarContentProps, OmnibarInputProps, OmnibarItemProps, OmnibarListProps }
