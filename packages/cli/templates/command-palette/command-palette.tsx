"use client"

import * as React from "react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  changeAsAgent,
  createAgentChangeDetails,
  isAgentChange,
  matchAgentChoice,
  useAgentControl,
  useAgentLatest,
  useHasAgent,
  useMergedRef,
  waitForAgent,
} from "@/components/ui/agent"
import { filterCommands, type CommandAction, type CommandItem, type CommandRunDetails, type CommandRunReason } from "@/components/ui/command-items"
import { DialogBackdrop, DialogPopup, DialogPortal, DialogViewport } from "@/components/ui/dialog"

export { filterCommands }
export type { CommandAction, CommandItem, CommandRunDetails, CommandRunReason }

/** @deprecated Kept for the first release's name; use `CommandRunDetails`. */
export type CommandPaletteRunDetails = CommandRunDetails

type OpenDetails = BaseDialog.Root.ChangeEventDetails
type ValueDetails = AutocompletePrimitive.Root.ChangeEventDetails
type Group = { key: string; label: string; items: CommandItem[] }

/** The Recent group's key, apart from any group the items name. */
const RECENT = "recent"

function groupsOf(items: CommandItem[]): Group[] {
  const groups: Group[] = []
  for (const item of items) {
    const label = item.group ?? ""
    const last = groups.find((g) => g.label === label)
    if (last) last.items.push(item)
    else groups.push({ key: `group:${label}`, label, items: [item] })
  }
  return groups
}

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
const never = () => () => {}

/** False on the server and through hydration, so the first client render matches. */
function useMac(): boolean {
  return React.useSyncExternalStore(never, isMac, () => false)
}

/** Cmd on a Mac, Ctrl elsewhere. Not both: Ctrl+K on a Mac is a text field's kill-line. */
function isMod(event: { metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean }): boolean {
  if (event.altKey || event.shiftKey) return false
  return isMac() ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey
}

/** Matches by the letter, or by the physical key when the layout types another script. */
function isKey(event: KeyboardEvent, key: string): boolean {
  if (event.key.toLowerCase() === key) return true
  if (/^[a-z0-9]$/i.test(event.key)) return false
  return event.code === `Key${key.toUpperCase()}` || event.code === `Digit${key}`
}

const reversed = new WeakSet<Event>()

interface PaletteContext {
  /** Inside an AgentProvider: marks the palette's own buttons so the agent sees one control. */
  part: "" | undefined
  label: string
  open: boolean
  disabled: boolean
  phone: boolean
  mac: boolean
  shortcut: string | false
  query: string
  setQuery: (query: string, details: ValueDetails) => void
  page: CommandItem | undefined
  pop: () => void
  shown: Group[]
  highlighted: CommandItem | undefined
  setHighlighted: (item: CommandItem | undefined) => void
  detail: CommandItem | undefined
  setDetail: (item: CommandItem | undefined) => void
  pick: (item: CommandItem) => void
  run: (item: CommandItem, action: CommandAction | undefined, details: CommandRunDetails) => string | undefined
  close: (event?: Event) => void
  trigger: React.MutableRefObject<HTMLElement | null>
  input: React.MutableRefObject<HTMLInputElement | null>
}

const PaletteContext = React.createContext<PaletteContext | null>(null)

function usePalette(part: string): PaletteContext {
  const context = React.useContext(PaletteContext)
  if (!context) throw new Error(`${part} must be inside <CommandPalette>.`)
  return context
}

export interface CommandPaletteProps {
  /** Every command, in the order groups and items are listed. */
  items: CommandItem[]
  /** Ids listed first, under "Recent", while the search is empty. */
  recent?: string[]
  recentLabel?: string
  /** Ids listed after the recent ones while the search is empty, under their own groups. */
  suggested?: string[]
  /** How many rows show while the search is empty, when `recent` or `suggested` is set. */
  idleLimit?: number
  /** Runs a picked item. `details.cancel()` keeps the palette open. */
  onRun?: (item: CommandItem, action: CommandAction | undefined, details: CommandRunDetails) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: OpenDetails) => void
  /** The search text. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, details: ValueDetails) => void
  /** The key that opens it with Cmd on a Mac and Ctrl elsewhere. `false` turns the shortcut off. */
  shortcut?: string | false
  /** Names the dialog and the search field, and is what an agent finds it by. */
  label?: string
  filter?: (item: CommandItem, query: string) => boolean
  disabled?: boolean
  children?: React.ReactNode
}

/**
 * A Base UI dialog holding the search, list and preview. Opens on Cmd or Ctrl+K and
 * forgets the search, sub-list and highlight when it closes.
 */
function CommandPalette({
  items,
  recent,
  recentLabel = "Recent",
  suggested,
  idleLimit = 8,
  onRun,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  shortcut: shortcutProp = "k",
  label = "Command palette",
  filter = filterCommands,
  disabled = false,
  children,
}: CommandPaletteProps) {
  const [openInner, setOpenInner] = React.useState(defaultOpen)
  const [queryInner, setQueryInner] = React.useState(defaultValue)
  const [pages, setPages] = React.useState<CommandItem[]>([])
  const [detail, setDetail] = React.useState<CommandItem | undefined>()
  const [highlighted, setHighlighted] = React.useState<CommandItem | undefined>()
  const open = openProp ?? openInner
  const query = valueProp ?? queryInner
  const page = pages[pages.length - 1]
  const phone = usePhone()
  const mac = useMac()
  const shortcut = shortcutProp === false ? false : shortcutProp.toLowerCase()
  const trigger = React.useRef<HTMLElement | null>(null)
  const input = React.useRef<HTMLInputElement | null>(null)

  // Closed by the app or by the palette, it starts over next time.
  const [wasOpen, setWasOpen] = React.useState(open)
  if (wasOpen !== open) {
    setWasOpen(open)
    if (!open) {
      setPages([])
      setDetail(undefined)
      setHighlighted(undefined)
    }
  }

  // Remembers who closed it, so clearing the search afterwards is marked the same way.
  const closedBy = React.useRef<OpenDetails | undefined>(undefined)
  const changeOpen = React.useCallback(
    (next: boolean, details: OpenDetails) => {
      if (!next) closedBy.current = details
      onOpenChange?.(next, details)
      if (!details.isCanceled && openProp === undefined) setOpenInner(next)
    },
    [onOpenChange, openProp]
  )
  const setQuery = React.useCallback(
    (next: string, details: ValueDetails) => {
      onValueChange?.(next, details)
      if (!details.isCanceled && valueProp === undefined) setQueryInner(next)
    },
    [onValueChange, valueProp]
  )
  const resetQuery = () => setQuery("", personDetails("none"))

  // Cleared through `setQuery` in both modes, so a controlled search hears about it.
  const latestQuery = useAgentLatest({ query, setQuery })
  const wasOpenRef = React.useRef(open)
  React.useEffect(() => {
    const closed = wasOpenRef.current && !open
    wasOpenRef.current = open
    if (!closed || !latestQuery.current.query) return
    const details = isAgentChange(closedBy.current) ? createAgentChangeDetails<ValueDetails>("none") : personDetails<ValueDetails>("none")
    latestQuery.current.setQuery("", details)
  }, [open])

  const shown = React.useMemo(() => {
    const list = page?.items ?? items
    if (query.trim()) return groupsOf(list.filter((item) => filter(item, query)))
    if (page || (!recent?.length && !suggested)) return groupsOf(list)
    const byId = (ids: string[]) => ids.map((id) => list.find((item) => item.id === id)).filter((item): item is CommandItem => !!item)
    const first = byId(recent ?? []).slice(0, idleLimit)
    const rest = (suggested ? byId(suggested) : list).filter((item) => !first.includes(item)).slice(0, idleLimit - first.length)
    return [{ key: RECENT, label: recentLabel, items: first }, ...groupsOf(rest)].filter((g) => g.items.length)
  }, [items, page, query, recent, recentLabel, suggested, idleLimit, filter])

  const close = (event?: Event) => changeOpen(false, personDetails("imperative-action", event))

  const latest = useAgentLatest({ open, disabled })
  const run: PaletteContext["run"] = (item, action, details) => {
    if (item.disabled) return "That command is disabled."
    onRun?.(item, action, details)
    if (details.isCanceled) return "The app refused the command."
    if (!latest.current.open) return undefined
    if (isAgentChange(details)) changeOpen(false, createAgentChangeDetails<OpenDetails>())
    else close(details.event)
    return undefined
  }

  const push = (item: CommandItem) => {
    setPages((p) => [...p, item])
    setDetail(undefined)
    resetQuery()
    // The row that opened it is gone, so the field keeps focus for the next search.
    requestAnimationFrame(() => input.current?.focus())
  }

  const pop = () => {
    if (detail) return setDetail(undefined)
    setPages((p) => p.slice(0, -1))
    resetQuery()
  }

  const pick = (item: CommandItem) => {
    if (item.disabled) return
    if (item.items) return push(item)
    if (phone && (item.actions?.length ?? 0) > 1) {
      input.current?.blur()
      return setDetail(item)
    }
    run(item, item.actions?.[0], personDetails("item-press"))
  }

  // Escape steps back out of a detail or sub-list before it closes the palette.
  const onDialogOpenChange = (next: boolean, details: OpenDetails) => {
    if (!next && details.reason === "escape-key" && (detail || page)) {
      details.cancel()
      return pop()
    }
    changeOpen(next, details)
  }

  // Back from a record, the field shows again and takes focus with the keyboard.
  const hadDetail = React.useRef(false)
  React.useEffect(() => {
    if (hadDetail.current && !detail && open) input.current?.focus()
    hadDetail.current = Boolean(detail)
  }, [detail, open])

  React.useEffect(() => {
    if (shortcut === false || disabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || !isMod(event) || !isKey(event, shortcut)) return
      event.preventDefault()
      changeOpen(!latest.current.open, personDetails("none", event))
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [shortcut, disabled, changeOpen])

  const context: PaletteContext = {
    part: useHasAgent() ? "" : undefined,
    label,
    open,
    disabled,
    phone,
    mac,
    shortcut,
    query,
    setQuery,
    page,
    pop,
    shown,
    highlighted,
    setHighlighted,
    detail,
    setDetail,
    pick,
    run,
    close,
    trigger,
    input,
  }

  usePaletteAgent(context, page?.items ?? items, pages[pages.length - 2]?.items ?? items, changeOpen, push)

  return (
    <PaletteContext.Provider value={context}>
      <BaseDialog.Root open={open} onOpenChange={onDialogOpenChange}>
        {children}
      </BaseDialog.Root>
    </PaletteContext.Provider>
  )
}

const describe = (item: CommandItem) => ({
  label: item.label,
  ...(item.group ? { group: item.group } : {}),
  ...(item.actions ? { actions: item.actions.map((a) => a.label) } : {}),
  ...(item.items ? { opens: item.items.length + " more" } : {}),
})

/**
 * One combobox control for the agent: the trigger while closed, the search field while
 * open. It lists every command on the current level while closed and the matches while open.
 */
function usePaletteAgent(
  c: PaletteContext,
  level: CommandItem[],
  parent: CommandItem[],
  changeOpen: (next: boolean, details: OpenDetails) => void,
  push: (item: CommandItem) => void
) {
  const latest = useAgentLatest(c)
  const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve))
    await waitForAgent(() => latest.current.open && latest.current.input.current?.isConnected)
    return latest.current.shown.flatMap((g) => g.items).map(describe)
  }
  const opened = () => (latest.current.open ? undefined : changeAsAgent(changeOpen, true))

  useAgentControl(() => ({
    kind: "combobox",
    element: c.open ? c.input.current : c.trigger.current,
    label: c.label,
    open: c.open,
    disabled: c.disabled,
    ...(c.open ? { value: c.query } : {}),
    items: (c.open ? c.shown.flatMap((g) => g.items) : level).map((i) => i.label),
    actions: {
      [c.open ? "close" : "open"]: () => changeAsAgent(changeOpen, !c.open),
      ...(c.page ? { back: () => (c.pop(), { result: parent.map(describe) }) } : {}),
      search: async (text: unknown) => {
        const refused = opened() || changeAsAgent(c.setQuery, String(text ?? ""))
        if (refused) return refused
        return { result: await settle() }
      },
      select: async (wanted: unknown, actionName?: unknown) => {
        const choices = level.map((item) => ({ value: item, label: item.label, disabled: item.disabled }))
        const match = matchAgentChoice(choices, wanted)
        if (typeof match === "string") return match
        const item = match.value
        if (item.items) {
          const refused = opened()
          if (refused) return refused
          push(item)
          return { result: item.items.map(describe) }
        }
        if (item.disabled) return "That command is disabled."
        let action = item.actions?.[0]
        let reason: CommandRunReason = "item-press"
        if (actionName != null) {
          const found = matchAgentChoice((item.actions ?? []).map((a) => ({ value: a, label: a.label })), actionName)
          if (typeof found === "string") return found
          action = found.value
          reason = "action-press"
        }
        return c.run(item, action, createAgentChangeDetails(reason))
      },
    },
  }))
}

const CommandPaletteTrigger = React.forwardRef<HTMLButtonElement, BaseDialog.Trigger.Props>(
  ({ className, children, disabled, ...props }, ref) => {
    const c = usePalette("CommandPaletteTrigger")
    return (
      <BaseDialog.Trigger
        ref={useMergedRef(ref, c.trigger)}
        data-agent-part={c.part}
        disabled={disabled || c.disabled}
        data-slot="command-palette-trigger"
        className={cn(
          "inline-flex h-9 w-full max-w-64 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground",
          "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <Search className="h-4 w-4" aria-hidden />
            <span className="flex-1 text-left">Search</span>
            {c.shortcut && (
              <CommandPaletteShortcut className="hidden sm:inline-block">{`${c.mac ? "⌘" : "Ctrl"} ${c.shortcut.toUpperCase()}`}</CommandPaletteShortcut>
            )}
          </>
        )}
      </BaseDialog.Trigger>
    )
  }
)
CommandPaletteTrigger.displayName = "CommandPaletteTrigger"

/** Keeps the phone layout above the on-screen keyboard, which `100dvh` does not account for. */
function useKeyboardFit(el: HTMLElement | null, active: boolean) {
  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!active || !viewport || !el) return
    const fit = () => {
      el.style.setProperty("--command-palette-height", `${viewport.height}px`)
      el.style.setProperty("--command-palette-top", `${viewport.offsetTop}px`)
    }
    fit()
    viewport.addEventListener("resize", fit)
    viewport.addEventListener("scroll", fit)
    return () => {
      viewport.removeEventListener("resize", fit)
      viewport.removeEventListener("scroll", fit)
    }
  }, [el, active])
}

// Opened from the keyboard many times a day, so it never animates: these undo the
// Dialog's fade and scale.
const STILL = "transition-none data-[starting-style]:opacity-100 data-[ending-style]:opacity-100"

/**
 * The dialog, with Base UI's Autocomplete held open inside it. Full screen on a phone,
 * with the search at the bottom and the best match just above it.
 */
const CommandPaletteContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseDialog.Popup>>(
  ({ className, children, ...props }, ref) => {
    const c = usePalette("CommandPaletteContent")
    // State, not a ref: the portal mounts the popup after this renders.
    const [popup, setPopup] = React.useState<HTMLDivElement | null>(null)
    const merged = useMergedRef(ref, setPopup)
    useKeyboardFit(popup, c.open && c.phone)
    return (
      <DialogPortal>
        <DialogBackdrop className={cn(STILL, "hidden bg-black/30 sm:block dark:bg-black/55")} />
        <DialogViewport className="items-stretch sm:items-start sm:justify-center sm:px-5 sm:pt-[min(12vh,7rem)]">
          <DialogPopup
            ref={merged}
            data-agent-part={c.part}
            aria-label={c.label}
            initialFocus={c.input}
            data-slot="command-palette-content"
            className={cn(
              STILL,
              "data-[starting-style]:scale-100 data-[ending-style]:scale-100",
              "relative flex flex-col gap-0 overflow-hidden bg-background p-0 text-foreground outline-none",
              "fixed inset-x-0 top-[var(--command-palette-top,0px)] h-[var(--command-palette-height,100dvh)] w-full max-w-none rounded-none border-0 shadow-none",
              "sm:static sm:h-auto sm:w-[720px] sm:max-w-full sm:rounded-2xl sm:border sm:bg-popover sm:text-popover-foreground sm:shadow-[0_30px_80px_-20px_rgb(0_0_0/0.4)]",
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
              onItemHighlighted={(item: CommandItem | undefined) => c.setHighlighted(item)}
            >
              {children}
            </AutocompletePrimitive.Root>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    )
  }
)
CommandPaletteContent.displayName = "CommandPaletteContent"

interface CommandPaletteInputProps extends React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Input> {
  /** The phone's button that closes the palette. */
  cancelLabel?: string
}

/**
 * The search field. On a desktop it sits on top with an Esc hint; on a phone it sits at
 * the bottom with a Cancel button. Inside a sub-list it shows where you are.
 */
const CommandPaletteInput = React.forwardRef<HTMLInputElement, CommandPaletteInputProps>(
  ({ className, cancelLabel = "Cancel", placeholder = "Search or run a command", onKeyDown, ...props }, ref) => {
    const c = usePalette("CommandPaletteInput")
    const assign = useMergedRef(ref, c.input)
    return (
      <div
        className={cn(
          "order-last flex flex-none items-center border-t pb-[env(safe-area-inset-bottom)] sm:order-none sm:border-b sm:border-t-0 sm:pb-0",
          // A phone's record screen stands alone, with the keyboard down.
          c.detail && "hidden"
        )}
      >
        <div className="ml-3 mr-0.5 my-2 flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-muted px-3 sm:m-0 sm:h-auto sm:rounded-none sm:bg-transparent sm:px-4 sm:py-3.5">
          <Search className="h-4 w-4 flex-none text-muted-foreground" aria-hidden />
          {c.page && (
            <button
              type="button"
              data-agent-part={c.part}
              onClick={c.pop}
              className="flex h-11 min-w-11 flex-none items-center justify-center sm:h-auto sm:min-w-0"
              aria-label={`Back from ${c.page.label}`}
            >
              <span className="rounded-md bg-background px-2 py-0.5 text-xs font-medium text-foreground sm:bg-muted">{c.page.label}</span>
            </button>
          )}
          <AutocompletePrimitive.Input
            ref={assign}
            data-slot="command-palette-input"
            aria-label={c.label}
            placeholder={c.page ? `Search ${c.page.label.toLowerCase()}` : placeholder}
            enterKeyHint="go"
            onKeyDown={(event) => {
              onKeyDown?.(event)
              if (event.nativeEvent.isComposing) return
              if (event.key === "Backspace" && event.currentTarget.value === "" && c.page) {
                event.preventDefault()
                return c.pop()
              }
              // Tab completes the highlighted item into the search, or opens its sub-list.
              // Once the search already reads it, Tab moves on to the preview's actions.
              const item = c.highlighted
              if (event.key === "Tab" && !event.shiftKey && !isMod(event) && item && !item.disabled) {
                if (item.items) {
                  event.preventDefault()
                  return c.pick(item)
                }
                if (c.query !== item.label) {
                  event.preventDefault()
                  return c.setQuery(item.label, personDetails("none", event.nativeEvent))
                }
              }
              if (event.key === "Enter" && isMod(event)) {
                event.preventDefault()
                event.preventBaseUIHandler()
                if (item && !item.items && !item.disabled) {
                  c.run(item, item.actions?.[1] ?? item.actions?.[0], personDetails("keyboard", event.nativeEvent))
                }
                return
              }
              // The phone list runs bottom up, so each arrow moves the other way through it.
              const flip = { ArrowUp: "ArrowDown", ArrowDown: "ArrowUp" }[event.key]
              if (c.phone && flip && !reversed.has(event.nativeEvent)) {
                event.preventDefault()
                event.preventBaseUIHandler()
                const next = new KeyboardEvent("keydown", { key: flip, code: flip, bubbles: true, cancelable: true })
                reversed.add(next)
                event.currentTarget.dispatchEvent(next)
              }
            }}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-[15px]",
              className
            )}
            {...props}
          />
          <kbd className="hidden rounded border border-b-2 bg-background px-[5px] py-px font-mono text-[10.5px] text-muted-foreground sm:inline-block">
            esc
          </kbd>
        </div>
        <button
          type="button"
          data-agent-part={c.part}
          onClick={(event) => c.close(event.nativeEvent)}
          className="h-11 flex-none pl-0.5 pr-3.5 text-[15px] text-[color:var(--info)] sm:hidden"
        >
          {cancelLabel}
        </button>
      </div>
    )
  }
)
CommandPaletteInput.displayName = "CommandPaletteInput"

/** Lays the list and the preview side by side. */
const CommandPaletteBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="command-palette-body"
      className={cn("relative flex min-h-0 flex-1 sm:h-[380px] sm:flex-none", className)}
      {...props}
    />
  )
)
CommandPaletteBody.displayName = "CommandPaletteBody"

function Highlight({ text, query }: { text: string; query: string }) {
  const words = query.split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  if (!words.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${words.join("|")})`, "ig"))
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

const iconBox =
  "grid flex-none place-items-center bg-muted text-muted-foreground [&_svg]:h-4 [&_svg]:w-4 group-data-[highlighted]:bg-background group-data-[highlighted]:text-foreground"

interface CommandPaletteItemProps extends Omit<React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Item>, "value"> {
  item: CommandItem
}

/** One row. Its children replace the icon, label, meta and shortcut it shows by default. */
const CommandPaletteItem = React.forwardRef<HTMLDivElement, CommandPaletteItemProps>(
  ({ item, className, children, onClick, ...props }, ref) => {
    const c = usePalette("CommandPaletteItem")
    const drills = Boolean(item.items) || (item.actions?.length ?? 0) > 1
    return (
      <AutocompletePrimitive.Item
        ref={ref}
        value={item}
        disabled={item.disabled}
        data-slot="command-palette-item"
        onClick={(event) => {
          onClick?.(event)
          c.pick(item)
        }}
        className={cn(
          // The highlight follows the keys and the pointer, so it moves with no transition.
          "group relative flex cursor-default select-none items-center gap-2.5 rounded-[9px] px-2.5 py-[11px] text-[15px] outline-none sm:py-2 sm:text-[13.5px]",
          "data-[highlighted]:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            {item.icon && <span className={cn(iconBox, "h-8 w-8 rounded-[9px] sm:h-[26px] sm:w-[26px] sm:rounded-[7px]")}>{item.icon}</span>}
            <span className="min-w-0 flex-1">
              <Highlight text={item.label} query={c.query} />
              {item.description && (
                <span className="block text-[13px] text-muted-foreground sm:ml-1.5 sm:inline sm:text-[12.5px]">
                  <Highlight text={item.description} query={c.query} />
                </span>
              )}
            </span>
            <span className="ml-auto flex flex-none items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
              {item.meta}
              {item.shortcut && <CommandPaletteShortcut className="hidden sm:inline-block">{item.shortcut}</CommandPaletteShortcut>}
              {drills && <ChevronRight className="h-4 w-4 sm:hidden" aria-hidden />}
            </span>
          </>
        )}
      </AutocompletePrimitive.Item>
    )
  }
)
CommandPaletteItem.displayName = "CommandPaletteItem"

interface CommandPaletteListProps extends Omit<React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.List>, "children"> {
  /** Renders each row. Defaults to a `CommandPaletteItem` for the item. */
  children?: (item: CommandItem) => React.ReactNode
  /** Shown when nothing matches. */
  empty?: React.ReactNode | ((query: string) => React.ReactNode)
}

/**
 * The grouped results. On a phone the groups and rows run bottom up, so the best match is
 * nearest the field and the thumb, while the reading order stays best match first.
 */
const CommandPaletteList = React.forwardRef<HTMLDivElement, CommandPaletteListProps>(
  ({ className, children, empty, ...props }, ref) => {
    const c = usePalette("CommandPaletteList")
    const row = children ?? ((item: CommandItem) => <CommandPaletteItem key={item.id} item={item} />)
    const count = c.shown.reduce((n, g) => n + g.items.length, 0)
    return (
      // A phone's record covers the list, so it leaves the tab order and the reading order.
      <div className="flex min-h-0 min-w-0 flex-1 flex-col" inert={Boolean(c.detail)}>
        {/* The empty state is its own live region, so this only counts matches. */}
        <AutocompletePrimitive.Status className="sr-only">
          {c.query.trim() && count ? `${count} ${count === 1 ? "result" : "results"}` : null}
        </AutocompletePrimitive.Status>
        <AutocompletePrimitive.Empty
          data-slot="command-palette-empty"
          className="mt-auto px-3 py-[30px] text-center text-[13px] text-muted-foreground empty:hidden sm:mt-0"
        >
          {typeof empty === "function" ? empty(c.query) : (empty ?? `Nothing matches “${c.query}”`)}
        </AutocompletePrimitive.Empty>
        <AutocompletePrimitive.List
          ref={ref}
          data-slot="command-palette-list"
          aria-label={`${c.label} results`}
          className={cn(
            "flex min-h-0 flex-1 flex-col-reverse overflow-y-auto px-2 pb-1 pt-1.5 [scrollbar-width:thin] sm:flex-col sm:px-1.5 sm:pb-2 sm:pt-1",
            className
          )}
          {...props}
        >
          {(group: Group) => (
            <AutocompletePrimitive.Group key={group.key} items={group.items} data-slot="command-palette-group">
              {group.label && (
                <AutocompletePrimitive.GroupLabel
                  data-slot="command-palette-group-label"
                  className="px-2.5 pb-1 pt-2.5 text-[11.5px] font-medium text-muted-foreground"
                >
                  {group.label}
                </AutocompletePrimitive.GroupLabel>
              )}
              <div className="flex flex-col-reverse sm:flex-col">
                <AutocompletePrimitive.Collection>{(item: CommandItem) => row(item)}</AutocompletePrimitive.Collection>
              </div>
            </AutocompletePrimitive.Group>
          )}
        </AutocompletePrimitive.List>
      </div>
    )
  }
)
CommandPaletteList.displayName = "CommandPaletteList"

/** A key hint. */
const CommandPaletteShortcut = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      data-slot="command-palette-shortcut"
      className={cn(
        "rounded border border-b-2 bg-background px-[5px] py-px font-mono text-[10.5px] font-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
CommandPaletteShortcut.displayName = "CommandPaletteShortcut"

interface CommandPalettePreviewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The body under the item's name, such as a record's fields. Defaults to its description. */
  children?: (item: CommandItem) => React.ReactNode
  /** Shown while nothing is highlighted. */
  placeholder?: React.ReactNode
  /** The button for an item with no actions of its own. */
  actionLabel?: string
  /** The phone's button back to the results. */
  backLabel?: string
}

/**
 * The highlighted item, with its actions. Beside the list on a desktop; on a phone it is
 * the screen a record opens into, with the keyboard down and the actions at the bottom.
 */
const CommandPalettePreview = React.forwardRef<HTMLDivElement, CommandPalettePreviewProps>(
  ({ className, children, placeholder, actionLabel = "Open", backLabel = "Search", ...props }, ref) => {
    const c = usePalette("CommandPalettePreview")
    const item = c.phone ? c.detail : c.highlighted
    // A record opening on a phone takes focus, so it is announced and the keys stay in it.
    const backButton = React.useRef<HTMLButtonElement | null>(null)
    React.useEffect(() => {
      if (c.phone && c.detail) backButton.current?.focus()
    }, [c.phone, c.detail])
    if (c.phone && !item) return null
    const mod = c.mac ? "⌘" : "Ctrl"
    const actions = item?.actions ?? [{ id: "", label: actionLabel }]
    const press = (action: CommandAction, event: React.MouseEvent) => {
      if (!item || item.disabled) return
      if (item.items) return c.pick(item)
      c.run(item, item.actions ? action : undefined, personDetails("action-press", event.nativeEvent))
    }
    const back = () => c.setDetail(undefined)
    return (
      <div
        ref={ref}
        data-slot="command-palette-preview"
        className={cn(
          "absolute inset-0 z-10 flex flex-col bg-background",
          "sm:static sm:z-auto sm:w-[270px] sm:flex-none sm:gap-3.5 sm:border-l sm:bg-card sm:p-[18px]",
          className
        )}
        {...props}
      >
        {c.phone && (
          <div className="flex items-center px-3.5 py-2.5">
            <button
              ref={backButton}
              type="button"
              onClick={back}
              className="flex h-11 min-w-11 items-center rounded-md px-0.5 text-base text-[color:var(--info)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
              {backLabel}
            </button>
          </div>
        )}
        {item ? (
          <>
            <div className="grid gap-4 px-5 py-1.5 sm:flex sm:flex-col sm:gap-3.5 sm:p-0">
              <div className="flex items-center gap-2.5">
                {item.icon && <span className={cn(iconBox, "hidden h-[34px] w-[34px] rounded-[9px] sm:grid")}>{item.icon}</span>}
                <div className="min-w-0">
                  <div className="text-[22px] font-semibold tracking-[-0.02em] sm:text-[15px] sm:tracking-normal">{item.label}</div>
                  {(c.phone ? item.description : item.kind) && (
                    <div className="mt-1 text-[15px] text-muted-foreground sm:mt-0 sm:text-[12.5px]">
                      {c.phone ? item.description : item.kind}
                    </div>
                  )}
                </div>
              </div>
              {children ? (
                children(item)
              ) : (
                item.description && !c.phone && <div className="text-[12.5px] leading-normal text-muted-foreground">{item.description}</div>
              )}
            </div>
            <div className="mt-auto grid gap-2 px-4 pb-[max(30px,env(safe-area-inset-bottom))] pt-3.5 sm:gap-1 sm:p-0">
              {actions.map((action, i) => (
                <button
                  key={action.id || i}
                  type="button"
                  disabled={item.disabled}
                  data-agent-part={c.part}
                  onClick={(event) => press(action, event)}
                  className={cn(
                    "flex items-center justify-center rounded-[13px] border bg-card p-3.5 text-base",
                    "sm:justify-between sm:rounded-[9px] sm:bg-background sm:px-2.5 sm:py-[7px] sm:text-[13px]",
                    i === 0 && "border-transparent bg-primary text-primary-foreground sm:bg-primary"
                  )}
                >
                  {action.label}
                  {i < 2 && (
                    <CommandPaletteShortcut
                      className={cn(
                        "hidden sm:inline-block",
                        i === 0 && "border-[color:color-mix(in_srgb,var(--primary-foreground)_35%,transparent)] bg-transparent text-inherit"
                      )}
                    >
                      {i === 0 ? "↵" : `${mod} ↵`}
                    </CommandPaletteShortcut>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-[12.5px] leading-normal text-muted-foreground">{placeholder}</div>
        )}
      </div>
    )
  }
)
CommandPalettePreview.displayName = "CommandPalettePreview"

export {
  CommandPalette,
  CommandPaletteTrigger,
  CommandPaletteContent,
  CommandPaletteInput,
  CommandPaletteBody,
  CommandPaletteList,
  CommandPaletteItem,
  CommandPaletteShortcut,
  CommandPalettePreview,
}
export type { CommandPaletteInputProps, CommandPaletteItemProps, CommandPaletteListProps, CommandPalettePreviewProps }
