"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { ArrowUp, Check, Sparkles } from "lucide-react"
import { cn } from "@dinachi/core"
import {
  agentNodeText,
  changeAsAgent,
  createAgentChangeDetails,
  matchAgentChoice,
  useAgentControl,
  useAgentLatest,
  useAgentState,
  useHasAgent,
  useMergedRef,
  waitForAgent,
} from "../agent"
// The command shape and matching the Command Palette uses, so one list serves both.
import { filterCommands, type CommandAction, type CommandItem } from "../command-items"

/** What the person typed values into, keyed by field id. */
export type AskValues = Record<string, string>

/** One value in a plan. */
export interface AskField {
  /** Referenced from the plan's `sentence`, and the key in `AskValues`. */
  id: string
  /** Names the input. A phone shows it beside the value. */
  label: string
  /** What the app read from the request. */
  value: string
  /** Read back as plain text, not an input. */
  fixed?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}

/** What running a plan did. */
export interface AskResult {
  /** The done line, such as "Archived 12 orders." */
  message: string
  /** Puts it back. Without it, the done line has no Undo. */
  undo?: () => void | Promise<void>
}

/** The change a request resolves to. Nothing runs until the person presses its button or Enter. */
export interface AskPlan {
  /** Names the plan for screen readers and the agent; the heading on a phone. */
  title: string
  /** The plan as one sentence: text, with `{ field: id }` where a field's value goes. */
  sentence: (string | { field: string })[]
  fields: AskField[]
  /** One line on what it touches. */
  touches?: React.ReactNode
  /** The exact call it makes with these values, shown on request. */
  call?: string | ((values: AskValues) => string)
  /** The button's label for these values, such as "Archive 12 orders". */
  verb: (values: AskValues) => string
  /** Makes the change. Throwing shows the message and keeps the plan. */
  run: (values: AskValues) => AskResult | Promise<AskResult>
  /** Why an agent's run needs a person's approval. Overrides the bar's `confirm`. */
  confirm?: string | false
}

/** How a change was reached. `cancel()` refuses it. */
export interface AskBarChangeDetails {
  reason: string
  event: Event | undefined
  isCanceled: boolean
  cancel(): void
}

function details(reason: string, event?: Event): AskBarChangeDetails {
  const d = { reason, event, isCanceled: false, cancel: () => void (d.isCanceled = true) }
  return d
}

/** Every word, as the Command Palette matches. If no command has them all, any one word. */
function matchCommands(commands: CommandItem[], query: string): CommandItem[] {
  const all = commands.filter((c) => filterCommands(c, query))
  if (all.length) return all
  const words = query.split(/\s+/).filter((w) => w.length > 2)
  return commands.filter((c) => words.some((w) => filterCommands(c, w)))
}

const valuesOf = (plan: AskPlan | null): AskValues =>
  Object.fromEntries((plan?.fields ?? []).map((f) => [f.id, f.value]))

/** The sentence with the values in, as a person reads it. */
const sentenceOf = (plan: AskPlan, values: AskValues) =>
  plan.sentence.map((p) => (typeof p === "string" ? p : (values[p.field] ?? ""))).join("")

const callOf = (plan: AskPlan, values: AskValues) => (typeof plan.call === "function" ? plan.call(values) : plan.call)

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

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/** Values the person can still change: tinted, and dark enough to read on the tint. */
const TINT = "text-[color-mix(in_oklab,var(--info)_70%,var(--foreground))]"

type View = "bar" | "typing" | "plan" | "done"

interface AskContext {
  part: "" | undefined
  label: string
  disabled: boolean
  phone: boolean
  view: View
  open: boolean
  setOpen: (open: boolean) => void
  setTyping: (typing: boolean) => void
  query: string
  change: (query: string, details: AskBarChangeDetails) => void
  plan: AskPlan | null
  pending: boolean
  values: AskValues
  setValue: (id: string, value: string) => void
  running: boolean
  error: string | undefined
  done: AskResult | null
  undoing: boolean
  undoError: string | undefined
  undoButton: React.MutableRefObject<HTMLButtonElement | null>
  commands: CommandItem[]
  highlight: number
  setHighlight: (index: number) => void
  suggestions: string[]
  above: boolean
  focused: boolean
  setFocused: (focused: boolean) => void
  confirm: string | undefined
  send: (event?: Event) => void
  run: (event?: Event) => Promise<string | AskResult>
  undo: () => void
  command: (command: CommandItem, action?: CommandAction, details?: AskBarChangeDetails) => string | undefined
  input: React.MutableRefObject<HTMLInputElement | null>
  content: React.MutableRefObject<HTMLElement | null>
  trigger: React.MutableRefObject<HTMLButtonElement | null>
}

const AskContext = React.createContext<AskContext | null>(null)

function useAsk(part: string): AskContext {
  const context = React.useContext(AskContext)
  if (!context) throw new Error(`${part} must be inside <AskBar>.`)
  return context
}

export interface AskBarProps {
  /**
   * Turns the text into a plan, or `null` when it is not one. Sync or async; only the
   * answer for the latest text is kept. Called as the text changes, never to run.
   */
  resolve?: (query: string) => AskPlan | null | undefined | Promise<AskPlan | null | undefined>
  /** Listed when the text resolves to no plan. */
  commands?: CommandItem[]
  /** Runs a picked command with its first action, or the one an agent asked for. */
  onCommand?: (command: CommandItem, action: CommandAction | undefined, details: AskBarChangeDetails) => void
  /** Decides which commands match. Defaults to every word, then any word. */
  filter?: (command: CommandItem, query: string) => boolean
  /** How many commands to list. */
  limit?: number
  /** Requests to offer as chips. */
  suggestions?: string[]
  /** `"focus"`: every chip while the empty field has focus. `"typing"`: only chips that contain the text. */
  suggest?: "focus" | "typing"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, details: AskBarChangeDetails) => void
  /** The letter that focuses it with Cmd or Ctrl. `false` turns the shortcut off. */
  shortcut?: string | false
  /** Names the bar and its field, and is what an agent finds it by. */
  label?: string
  /** Why an agent's run needs a person's approval. `false` lets an agent run plans unasked. */
  confirm?: string | false
  disabled?: boolean
  children?: React.ReactNode
}

/**
 * A bar docked at the bottom of the page that takes a request or a command name. The app
 * resolves the text to a plan, which reads back as a sentence with its values editable.
 */
function AskBar({
  resolve,
  commands = [],
  onCommand,
  filter,
  limit = 5,
  suggestions = [],
  suggest = "focus",
  value,
  defaultValue = "",
  onValueChange,
  shortcut = "k",
  label = "Ask",
  confirm = "Changes many records at once.",
  disabled = false,
  children,
}: AskBarProps) {
  const [query, setQuery] = useAgentState(value, defaultValue, onValueChange)
  const [resolved, setResolved] = React.useState<{ query: string; plan: AskPlan | null }>({ query: "", plan: null })
  const [values, setValues] = React.useState<AskValues>({})
  const [done, setDone] = React.useState<AskResult | null>(null)
  const [running, setRunning] = React.useState(false)
  const [error, setError] = React.useState<string>()
  const [undoing, setUndoing] = React.useState(false)
  const [undoError, setUndoError] = React.useState<string>()
  const [said, setSaid] = React.useState("")
  const undoButton = React.useRef<HTMLButtonElement | null>(null)
  const [focused, setFocused] = React.useState(false)
  const [open, setOpenState] = React.useState(false)
  const [typing, setTyping] = React.useState(true)
  const [highlight, setHighlight] = React.useState(0)
  const phone = usePhone()
  const input = React.useRef<HTMLInputElement | null>(null)
  const content = React.useRef<HTMLElement | null>(null)
  const trigger = React.useRef<HTMLButtonElement | null>(null)
  const resolver = useAgentLatest(resolve)

  // Only the answer for the latest text is kept; a stale plan stays on screen, unrunnable, meanwhile.
  const ticket = React.useRef(0)
  useIsomorphicLayoutEffect(() => {
    const id = ++ticket.current
    const apply = (plan: AskPlan | null | undefined) => {
      if (id !== ticket.current) return
      setResolved({ query, plan: plan ?? null })
      setValues(valuesOf(plan ?? null))
      setError(undefined)
    }
    const out = query.trim() ? resolver.current?.(query) : null
    if (out instanceof Promise) out.then(apply, () => apply(null))
    else if (out || resolved.plan || resolved.query !== query) apply(out)
  }, [query])

  const pending = resolved.query !== query
  const plan = done ? null : resolved.plan
  const shownCommands = React.useMemo(() => {
    if (!query.trim() || plan || done) return []
    const list = filter ? commands.filter((c) => filter(c, query)) : matchCommands(commands, query)
    return list.slice(0, limit)
  }, [commands, filter, limit, query, plan, done])
  const shownSuggestions =
    plan || done
      ? []
      : suggest === "focus"
        ? (phone ? open : focused) && !query
          ? suggestions
          : []
        : query.trim()
          ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase().trim()) && s !== query)
          : []

  const view: View = !phone ? "bar" : done ? "done" : plan && !typing ? "plan" : "typing"

  const change = React.useCallback(
    (next: string, d: AskBarChangeDetails) => {
      setQuery(next, d)
      if (d.isCanceled) return
      setDone(null)
      setHighlight(0)
    },
    [setQuery]
  )

  const setOpen = (next: boolean) => {
    setOpenState(next)
    setTyping(true)
    if (!next) {
      setDone(null)
      change("", details("close"))
    }
  }

  // Focus follows the bar's own outcome, but never leaves something the person moved to.
  const ours = () => {
    const active = document.activeElement
    return !active || active === document.body || Boolean(content.current?.contains(active))
  }

  const run = async (event?: Event): Promise<string | AskResult> => {
    if (!plan || pending || running) return "There is no plan to run."
    const asked = query
    const focus = ours()
    setRunning(true)
    setError(undefined)
    setUndoError(undefined)
    try {
      const result = await plan.run(values)
      if (now.current.query === asked) change("", details("run", event))
      setDone(result)
      if (focus) requestAnimationFrame(() => (undoButton.current ?? input.current)?.focus())
      return result
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      return message
    } finally {
      setRunning(false)
    }
  }

  const undo = async () => {
    if (!done?.undo || undoing) return
    const focus = ours()
    setUndoing(true)
    setUndoError(undefined)
    try {
      await done.undo()
      setDone(null)
      if (phone) setOpen(false)
      else if (focus) input.current?.focus()
    } catch (e) {
      setUndoError(e instanceof Error ? e.message : String(e))
    } finally {
      setUndoing(false)
    }
  }

  const command = (item: CommandItem, action = item.actions?.[0], d = details("command")) => {
    onCommand?.(item, action, d)
    if (d.isCanceled) return "The app refused the command."
    change("", d)
    if (phone) setOpen(false)
    else input.current?.blur()
    return undefined
  }

  // On a phone, sending drops the keyboard so the plan gets the sheet. On a desktop it runs.
  const send = (event?: Event) => {
    if (plan) {
      if (phone) setTyping(false)
      else void run(event)
    } else if (shownCommands[highlight]) command(shownCommands[highlight], undefined, details("command", event))
  }

  const latest = useAgentLatest({ phone, disabled })
  const now = useAgentLatest({ query, values })

  // One polite announcement per settled plan, then per result, from a node that is always there.
  const settled = pending ? null : plan
  React.useEffect(() => {
    if (done) setSaid(done.message)
    else if (settled) setSaid(`${sentenceOf(settled, now.current.values)} ${settled.verb(now.current.values)}`)
  }, [settled, done])
  React.useEffect(() => {
    if (shortcut === false || disabled) return
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
    const onKeyDown = (event: KeyboardEvent) => {
      // On a Mac only Cmd: Ctrl+K deletes to the end of the line.
      const mod = mac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey
      if (event.defaultPrevented || event.repeat || !mod || event.altKey || event.shiftKey || event.key.toLowerCase() !== shortcut.toLowerCase()) return
      event.preventDefault()
      if (latest.current.phone) setOpenState(true)
      else input.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [shortcut, disabled])

  const context: AskContext = {
    part: useHasAgent() ? "" : undefined,
    label,
    disabled,
    phone,
    view,
    open,
    setOpen,
    setTyping,
    query,
    change,
    plan,
    pending,
    values,
    setValue: (id, v) => setValues((prev) => ({ ...prev, [id]: v })),
    running,
    error,
    done,
    undoing,
    undoError,
    undoButton,
    commands: shownCommands,
    highlight,
    setHighlight,
    suggestions: shownSuggestions,
    above: Boolean(done || plan || shownCommands.length || shownSuggestions.length),
    focused,
    setFocused,
    confirm: approval(plan?.confirm ?? confirm),
    send,
    run,
    undo,
    command,
    input,
    content,
    trigger,
  }

  useAskAgent(context, commands, setOpenState, setTyping)

  return (
    <AskContext.Provider value={context}>
      {children}
      <span aria-live="polite" aria-atomic className="sr-only">
        {said}
      </span>
    </AskContext.Provider>
  )
}

/** The reason an agent's run waits for a person. Only `false` lifts it. */
const approval = (confirm: string | false) => (confirm === false ? undefined : confirm || "Needs a person's approval.")

/**
 * The bar is one combobox: `search` types a request and returns the plan it resolved to,
 * or the commands it matched. The plan's fields are inputs and its button a control of its own.
 */
function useAskAgent(c: AskContext, commands: CommandItem[], setOpen: (open: boolean) => void, setTyping: (typing: boolean) => void) {
  const latest = useAgentLatest(c)
  useAgentControl(() => ({
    kind: "combobox",
    element: c.input.current ?? c.content.current ?? c.trigger.current,
    label: c.label,
    disabled: c.disabled,
    value: c.query,
    items: c.commands.map((i) => i.label),
    actions: {
      search: async (text: unknown) => {
        const q = String(text ?? "")
        const refused = changeAsAgent(c.change, q)
        if (refused) return refused
        setOpen(true)
        setTyping(false)
        await waitForAgent(() => latest.current.query === q && !latest.current.pending, 30_000)
        const { plan, values } = latest.current
        return {
          result: plan
            ? {
                plan: plan.title,
                sentence: sentenceOf(plan, values),
                fields: plan.fields.map((f) => ({ label: f.label, value: values[f.id], ...(f.fixed ? { fixed: true } : {}) })),
                touches: agentNodeText(plan.touches),
                call: callOf(plan, values),
                run: plan.verb(values),
              }
            : { commands: latest.current.commands.map((i) => i.label) },
        }
      },
      select: (wanted: unknown, actionName?: unknown) => {
        const match = matchAgentChoice(commands.map((i) => ({ value: i, label: i.label, disabled: i.disabled })), wanted)
        if (typeof match === "string") return match
        const actions = match.value.actions ?? []
        const found = actionName == null ? { value: actions[0] } : matchAgentChoice(actions.map((a) => ({ value: a, label: a.label })), actionName)
        if (typeof found === "string") return found
        return c.command(match.value, found.value, createAgentChangeDetails("command"))
      },
    },
  }))
}

/** The floating Ask button that opens the bar on a phone. Renders nothing on a desktop. */
const AskBarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, onClick, ...props }, ref) => {
    const c = useAsk("AskBarTrigger")
    const merged = useMergedRef(ref, c.trigger)
    if (!c.phone) return null
    return (
      <button
        ref={merged}
        type="button"
        data-agent-part={c.part}
        disabled={c.disabled}
        data-slot="ask-bar-trigger"
        onClick={(event) => {
          onClick?.(event)
          c.setOpen(true)
        }}
        className={cn(
          "fixed bottom-[max(28px,env(safe-area-inset-bottom))] left-1/2 z-40 flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-primary pl-[18px] pr-[22px] text-base font-medium text-primary-foreground",
          "shadow-[0_14px_30px_-12px_rgb(0_0_0/0.45)] disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <Sparkles className="h-4 w-4 text-[color-mix(in_oklab,var(--info)_60%,var(--primary-foreground))]" aria-hidden />
            {c.label}
          </>
        )}
      </button>
    )
  }
)
AskBarTrigger.displayName = "AskBarTrigger"

/**
 * The dock: centred at the bottom of the page on a desktop, a sheet on a phone. With no
 * children it holds the done line, plan, commands, suggestions and field, in that order.
 */
const AskBarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const c = useAsk("AskBarContent")
    const merged = useMergedRef(ref, c.content)
    const body = children ?? (
      <>
        <AskBarDone />
        <AskBarPlan />
        <AskBarCommands />
        <AskBarSuggestions />
        <AskBarInput />
      </>
    )
    if (!c.phone) {
      return (
        <div
          ref={merged}
          role="region"
          aria-label={c.label}
          data-slot="ask-bar-content"
          className={cn(
            "fixed bottom-[18px] left-1/2 z-40 w-[640px] max-w-[calc(100%-32px)] -translate-x-1/2 overflow-hidden",
            "rounded-[18px] border bg-popover text-popover-foreground shadow-[0_24px_60px_-20px_rgb(0_0_0/0.4)]",
            className
          )}
          {...props}
        >
          {body}
        </div>
      )
    }
    const sheet = c.view === "plan" || c.view === "done"
    return (
      <DrawerPrimitive.Root open={c.open} onOpenChange={(next) => c.setOpen(next)}>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.VirtualKeyboardProvider>
            <DrawerPrimitive.Backdrop
              className={cn(
                "fixed inset-0 z-50 bg-black/30 opacity-[calc(1_-_var(--drawer-swipe-progress,0))] dark:bg-black/55",
                "transition-opacity duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-drawer,cubic-bezier(0.32,0.72,0,1))]",
                "data-[ending-style]:duration-[calc(var(--motion-duration-fast,150ms)_*_var(--drawer-swipe-strength,1))]",
                "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[swiping]:transition-none"
              )}
            />
            <DrawerPrimitive.Viewport>
              <DrawerPrimitive.Popup
                ref={merged}
                aria-label={c.label}
                initialFocus={c.input}
                data-slot="ask-bar-content"
                className={cn(
                  "fixed inset-x-0 bottom-[var(--drawer-keyboard-inset,0px)] z-50 flex max-h-[calc(100dvh-60px)] flex-col rounded-t-[20px] bg-popover pt-2.5 text-popover-foreground outline-none",
                  "shadow-[0_-20px_50px_-20px_rgb(0_0_0/0.3)]",
                  "transition-transform duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-drawer,cubic-bezier(0.32,0.72,0,1))]",
                  "data-[ending-style]:duration-[calc(var(--motion-duration-fast,150ms)_*_var(--drawer-swipe-strength,1))]",
                  "data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
                  "motion-reduce:transition-opacity motion-reduce:data-[starting-style]:translate-y-0 motion-reduce:data-[starting-style]:opacity-0",
                  "motion-reduce:data-[ending-style]:translate-y-0 motion-reduce:data-[ending-style]:opacity-0",
                  sheet && "max-h-[calc(100dvh-40px)] pb-[max(26px,env(safe-area-inset-bottom))] pt-0",
                  className
                )}
                {...props}
              >
                <DrawerPrimitive.Content className="flex min-h-0 flex-col overflow-y-auto">
                  {sheet && <div aria-hidden className="mx-auto mb-2.5 mt-2 h-[5px] w-9 flex-none rounded-full bg-accent" />}
                  {body}
                </DrawerPrimitive.Content>
              </DrawerPrimitive.Popup>
            </DrawerPrimitive.Viewport>
          </DrawerPrimitive.VirtualKeyboardProvider>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    )
  }
)
AskBarContent.displayName = "AskBarContent"

interface AskBarPlanProps extends React.HTMLAttributes<HTMLDivElement> {
  showCallLabel?: string
  hideCallLabel?: string
  /** The phone's button back to the request. */
  editLabel?: string
}

/**
 * The plan as one sentence, with the values you can still change as inputs that grow with
 * their text. On a phone, the fields are rows and the button sits at the bottom.
 */
const AskBarPlan = React.forwardRef<HTMLDivElement, AskBarPlanProps>(
  ({ className, showCallLabel = "Show call", hideCallLabel = "Hide call", editLabel = "Edit", ...props }, ref) => {
    const c = useAsk("AskBarPlan")
    const [call, setCall] = React.useState(false)
    const group = React.useRef<HTMLDivElement | null>(null)
    const button = React.useRef<HTMLButtonElement | null>(null)
    const merged = useMergedRef(ref, group)
    const callId = React.useId()
    const { plan, values } = c
    const shown = plan && (c.view === "bar" || c.view === "plan")
    const verb = plan ? plan.verb(values) : ""
    const callText = plan && callOf(plan, values)
    const blocked = c.disabled || c.pending || c.running

    // Sent from a phone, focus moves off the field so the keyboard drops.
    React.useEffect(() => {
      if (shown && c.phone) group.current?.focus()
    }, [shown, c.phone])

    useAgentControl(() =>
      shown && button.current
        ? {
            kind: "button",
            element: button.current,
            label: verb,
            disabled: blocked,
            confirm: c.confirm,
            actions: {
              press: async () => {
                const result = await c.run(new Event("agent"))
                return typeof result === "string" ? result : { result: result.message }
              },
            },
          }
        : null
    )

    if (!shown || !plan) return null
    const field = (f: AskField) => (
      <input
        key={f.id}
        aria-label={f.label}
        value={values[f.id] ?? ""}
        readOnly={f.fixed || c.running}
        inputMode={f.inputMode}
        size={Math.max(1, (values[f.id] ?? "").length)}
        disabled={c.disabled}
        onChange={(event) => c.setValue(f.id, event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.nativeEvent.isComposing) return
          event.preventDefault()
          if (c.phone) event.currentTarget.blur()
          else void c.run(event.nativeEvent)
        }}
        className={cn(
          c.phone
            ? cn("min-w-0 flex-1 bg-transparent text-right text-base tabular-nums outline-none", f.fixed ? "text-muted-foreground" : TINT)
            : cn(
                "mx-px rounded-md border-0 bg-[color-mix(in_oklab,var(--info)_10%,transparent)] px-[5px] py-0 tabular-nums outline-none [field-sizing:content] [font:inherit]",
                "shadow-[inset_0_-1.5px_0_color-mix(in_oklab,var(--info)_45%,transparent)] focus:shadow-[0_0_0_2px_color-mix(in_oklab,var(--info)_45%,transparent)]",
                TINT
              )
        )}
      />
    )
    const runButton = (
      <button
        ref={button}
        type="button"
        disabled={blocked}
        aria-busy={c.running || undefined}
        onClick={(event) => void c.run(event.nativeEvent)}
        className={cn(
          "rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50",
          c.phone ? "w-full rounded-[13px] p-[15px] text-base" : "ml-auto"
        )}
      >
        {verb}
      </button>
    )
    const note = c.error ? (
      <p role="alert" className="mt-1.5 text-[13.5px] leading-normal text-destructive">
        {c.error}
      </p>
    ) : (
      plan.touches && <p className="mt-1.5 text-[13.5px] leading-normal text-muted-foreground sm:mt-1.5 max-sm:mt-3 max-sm:text-sm">{plan.touches}</p>
    )
    return (
      <>
        {c.phone && (
          <button
            type="button"
            data-agent-part={c.part}
            onClick={() => c.setTyping(true)}
            className="mx-3 flex w-[calc(100%-24px)] flex-none items-center gap-2 rounded-xl bg-muted px-3 py-[11px] text-left text-[15px]"
          >
            <Sparkles className={cn("h-4 w-4 flex-none", TINT)} aria-hidden />
            <span className="min-w-0 truncate">{c.query}</span>
            <span className="ml-auto flex-none text-sm text-muted-foreground">{editLabel}</span>
          </button>
        )}
        <div
          ref={merged}
          role="group"
          aria-label={plan.title}
          aria-busy={c.pending || undefined}
          data-agent-in={plan.title}
          tabIndex={-1}
          data-slot="ask-bar-plan"
          className={cn(c.phone ? "px-[18px] pt-4" : "px-[22px] pb-4 pt-5", "outline-none", className)}
          {...props}
        >
          {c.phone ? (
            <>
              <div className="text-xl font-semibold tracking-[-0.015em]">{plan.title}</div>
              <div className="mt-2.5 border-t">
                {plan.fields.map((f) => (
                  <label key={f.id} className="flex min-h-[50px] items-center gap-3 border-b text-base focus-within:border-[color:var(--info)]">
                    <span aria-hidden className="flex-none text-muted-foreground">
                      {f.label}
                    </span>
                    {field(f)}
                  </label>
                ))}
              </div>
              {note}
              <div className="mt-4">{runButton}</div>
            </>
          ) : (
            <>
              <p className="m-0 text-lg font-medium leading-normal tracking-[-0.01em]">
                {plan.sentence.map((p, i) => {
                  if (typeof p === "string") return p
                  const f = plan.fields.find((x) => x.id === p.field)
                  if (!f) return null
                  return f.fixed ? <React.Fragment key={i}>{values[f.id]}</React.Fragment> : field(f)
                })}
              </p>
              {note}
              <div className="mt-[18px] flex flex-wrap items-center gap-3">
                {callText && (
                  <button
                    type="button"
                    data-agent-part={c.part}
                    aria-expanded={call}
                    aria-controls={callId}
                    onClick={() => setCall(!call)}
                    className="text-[12.5px] text-muted-foreground underline decoration-border underline-offset-[3px] hover:text-foreground"
                  >
                    {call ? hideCallLabel : showCallLabel}
                  </button>
                )}
                {runButton}
                {callText && call && (
                  <code id={callId} className="order-3 basis-full break-all font-mono text-xs text-muted-foreground">
                    {callText}
                  </code>
                )}
              </div>
            </>
          )}
        </div>
      </>
    )
  }
)
AskBarPlan.displayName = "AskBarPlan"

/** What ran, with Undo when the plan can be put back. Fades in. */
const AskBarDone = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { undoLabel?: string }>(
  ({ className, undoLabel = "Undo", ...props }, ref) => {
    const c = useAsk("AskBarDone")
    const [shown, setShown] = React.useState(false)
    const { done } = c
    React.useEffect(() => {
      setShown(false)
      if (!done) return
      const frame = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(frame)
    }, [done])
    if (!done) return null
    return (
      <div
        ref={ref}
        data-slot="ask-bar-done"
        className={cn(
          "m-2.5 flex items-center gap-2.5 rounded-[13px] bg-[color-mix(in_oklab,var(--success)_9%,var(--background))] px-3.5 py-3 text-[13.5px] max-sm:mx-3 max-sm:text-[15px]",
          "transition-opacity duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
          shown ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      >
        <Check className="h-4 w-4 flex-none text-success" aria-hidden />
        <span className="min-w-0 flex-1">
          {done.message}
          {c.undoError && (
            <span role="alert" className="block text-destructive">
              {c.undoError}
            </span>
          )}
        </span>
        {done.undo && (
          <button
            ref={c.undoButton}
            type="button"
            aria-busy={c.undoing || undefined}
            disabled={c.undoing}
            onClick={() => void c.undo()}
            className="flex-none font-medium underline underline-offset-[3px] disabled:opacity-50 max-sm:min-h-11 max-sm:px-1.5 max-sm:text-[15px]"
          >
            {undoLabel}
          </button>
        )}
      </div>
    )
  }
)
AskBarDone.displayName = "AskBarDone"

const listId = (label: string) => `ask-bar-${label.replace(/\W+/g, "-").toLowerCase()}`

/** The commands the text matched when it resolved to no plan. */
const AskBarCommands = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const c = useAsk("AskBarCommands")
  if (!c.commands.length || (c.view !== "bar" && c.view !== "typing")) return null
  const id = listId(c.label)
  return (
    <div
      ref={ref}
      id={id}
      role="listbox"
      aria-label={c.label}
      data-slot="ask-bar-commands"
      className={cn("max-h-[210px] flex-none overflow-y-auto px-1.5 py-1.5 max-sm:max-h-none max-sm:px-2", className)}
      {...props}
    >
      {c.commands.map((item, i) => (
        <div
          key={item.id}
          id={`${id}-${i}`}
          role="option"
          aria-selected={i === c.highlight}
          aria-disabled={item.disabled || undefined}
          data-highlighted={i === c.highlight ? "" : undefined}
          onMouseDown={(event) => event.preventDefault()}
          onPointerMove={() => c.setHighlight(i)}
          onClick={(event) => !item.disabled && c.command(item, undefined, details("command", event.nativeEvent))}
          // The highlight follows the keys and the pointer, so it moves with no transition.
          className={cn(
            "group flex cursor-default select-none items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13.5px] max-sm:px-2 max-sm:py-2.5 max-sm:text-[15px]",
            "data-[highlighted]:bg-muted aria-disabled:opacity-50"
          )}
        >
          {item.icon && (
            <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-[7px] bg-muted text-muted-foreground group-data-[highlighted]:bg-background group-data-[highlighted]:text-foreground max-sm:h-8 max-sm:w-8 max-sm:rounded-[9px] [&_svg]:h-4 [&_svg]:w-4">
              {item.icon}
            </span>
          )}
          <span className="min-w-0 flex-1">
            {item.label}
            {item.description && (
              <span className="ml-1.5 text-[12.5px] text-muted-foreground max-sm:ml-0 max-sm:block max-sm:text-[13px]">{item.description}</span>
            )}
          </span>
          {item.meta && <span className="ml-auto flex-none text-xs tabular-nums text-muted-foreground">{item.meta}</span>}
        </div>
      ))}
    </div>
  )
})
AskBarCommands.displayName = "AskBarCommands"

/** Requests to try, as chips. Picking one keeps focus in the field; on a phone it sends. */
const AskBarSuggestions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const c = useAsk("AskBarSuggestions")
  if (!c.suggestions.length || (c.view !== "bar" && c.view !== "typing")) return null
  return (
    <div
      ref={ref}
      data-slot="ask-bar-suggestions"
      className={cn(
        "flex flex-wrap gap-1.5 px-3 pb-2.5 pt-3",
        "max-sm:flex-none max-sm:flex-nowrap max-sm:gap-2 max-sm:overflow-x-auto max-sm:px-2.5 max-sm:pt-1.5 max-sm:[scrollbar-width:none]",
        className
      )}
      {...props}
    >
      {c.suggestions.map((s) => (
        <button
          key={s}
          type="button"
          data-agent-part={c.part}
          disabled={c.disabled || c.running}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            c.change(s, details("suggestion", event.nativeEvent))
            if (c.phone) c.setTyping(false)
          }}
          className="relative flex-none rounded-full border bg-background px-[11px] py-[5px] text-[13px] hover:bg-muted max-sm:px-[13px] max-sm:py-2 max-sm:text-sm max-sm:after:absolute max-sm:after:inset-x-0 max-sm:after:-inset-y-[4px] max-sm:after:content-['']"
        >
          {s}
        </button>
      ))}
    </div>
  )
})
AskBarSuggestions.displayName = "AskBarSuggestions"

/** The field and its send button. Enter runs the plan, or the highlighted command. */
const AskBarInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { sendLabel?: string }>(
  ({ className, placeholder = "Ask or type a command", sendLabel = "Send", onKeyDown, ...props }, ref) => {
    const c = useAsk("AskBarInput")
    const assign = useMergedRef(ref, c.input)
    if (c.view === "plan" || c.view === "done") return null
    const listed = c.commands.length > 0
    const id = listId(c.label)
    return (
      <div
        className={cn(
          "flex flex-none items-center gap-2.5 px-3.5 py-3",
          c.above && "border-t",
          "max-sm:mx-2.5 max-sm:mb-[max(10px,env(safe-area-inset-bottom))] max-sm:rounded-[22px] max-sm:border-t-0 max-sm:bg-muted max-sm:px-3 max-sm:py-2.5"
        )}
      >
        <Sparkles className={cn("h-4 w-4 flex-none", TINT)} aria-hidden />
        <input
          ref={assign}
          role="combobox"
          aria-label={c.label}
          aria-expanded={listed}
          aria-controls={listed ? id : undefined}
          aria-activedescendant={listed ? `${id}-${c.highlight}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          enterKeyHint="send"
          placeholder={placeholder}
          disabled={c.disabled}
          readOnly={c.running}
          value={c.query}
          data-slot="ask-bar-input"
          onChange={(event) => c.change(event.target.value, details("input-change", event.nativeEvent))}
          onFocus={() => c.setFocused(true)}
          onBlur={() => c.setFocused(false)}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (event.defaultPrevented || event.nativeEvent.isComposing) return
            const n = c.commands.length
            if (event.key === "Enter") {
              event.preventDefault()
              c.send(event.nativeEvent)
            } else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && n) {
              event.preventDefault()
              c.setHighlight((c.highlight + (event.key === "ArrowDown" ? 1 : n - 1)) % n)
            } else if (event.key === "Escape" && !c.phone) {
              c.change("", details("escape-key", event.nativeEvent))
              event.currentTarget.blur()
            }
          }}
          className={cn("min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-[15px]", className)}
          {...props}
        />
        <button
          type="button"
          aria-label={sendLabel}
          data-agent-part={c.part}
          disabled={c.disabled || !c.query.trim()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => c.send(event.nativeEvent)}
          className="relative grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-primary text-primary-foreground after:absolute after:-inset-1.5 after:content-[''] disabled:opacity-50 max-sm:h-8 max-sm:w-8 max-sm:rounded-full"
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  }
)
AskBarInput.displayName = "AskBarInput"

export { AskBar, AskBarTrigger, AskBarContent, AskBarPlan, AskBarDone, AskBarCommands, AskBarSuggestions, AskBarInput }
export type { AskBarPlanProps }
