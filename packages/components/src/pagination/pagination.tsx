"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@dinachi/core"
import { Button } from "../button"
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "../agent"

export type PageItem = number | "gap"

/**
 * The pages a bar shows. Past seven pages it always returns seven slots, so the bar keeps
 * its width and the arrows stay under the pointer as the page changes.
 */
export function pageItems(page: number, count: number): PageItem[] {
  const total = Math.max(0, Math.floor(count))
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const p = clampPage(page, total)
  if (p <= 4) return [1, 2, 3, 4, 5, "gap", total]
  if (p >= total - 3) return [1, "gap", total - 4, total - 3, total - 2, total - 1, total]
  return [1, "gap", p - 1, p, p + 1, "gap", total]
}

function clampPage(page: number, count: number) {
  const n = Number.isFinite(page) ? Math.round(page) : 1
  return Math.min(Math.max(1, n), Math.max(1, count))
}

export type PaginationChangeReason = "page-press" | "previous" | "next" | "jump" | "none"

export interface PaginationChangeDetails {
  reason: PaginationChangeReason | (string & {})
  event?: Event
  isCanceled: boolean
  cancel(): void
}

function changeDetails(reason: PaginationChangeReason, event?: Event): PaginationChangeDetails {
  const details: PaginationChangeDetails = {
    reason,
    event,
    isCanceled: false,
    cancel() {
      details.isCanceled = true
    },
  }
  return details
}

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange" | "defaultValue"> {
  /** How many pages there are. Below one, the bar still shows page 1. */
  count: number
  /** The current page, from 1. */
  page?: number
  defaultPage?: number
  /** Runs on every change, for people and agents. `details.cancel()` refuses it. */
  onPageChange?: (page: number, details: PaginationChangeDetails) => void
  /** Each page's URL. Pages then render as links, through Button's `render`. */
  getHref?: (page: number) => string
  /** `full` shows page numbers. `compact` reads Page 6 of 25, with the number as the jump field. */
  variant?: "full" | "compact"
  /** `lg` makes every target 44px, for touch. */
  size?: "default" | "lg"
  disabled?: boolean
}

const sizes = {
  default: { field: "h-8 w-[3.25rem] text-[13px]", text: "text-[13px]", arrow: "h-8 w-8" },
  lg: { field: "h-11 w-[5.25rem] rounded-xl text-[17px]", text: "text-[15px]", arrow: "h-11 w-11 rounded-xl border border-border text-foreground" },
}

/**
 * Pages of a list: prev and next, the pages near the current one, and gaps that open a
 * field to jump anywhere. The current page is the only filled shape.
 */
const Pagination = React.forwardRef<HTMLElement, PaginationProps>((props, ref) => {
  const {
    count: countProp,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    getHref,
    variant = "full",
    size = "default",
    disabled,
    className,
    "aria-label": ariaLabel = "Pagination",
    ...rest
  } = props
  const hasAgent = useHasAgent()
  const part = hasAgent ? "" : undefined
  const count = Number.isFinite(countProp) ? Math.max(1, Math.floor(countProp)) : 1
  const [raw, change] = useAgentState<number, PaginationChangeDetails>(pageProp, defaultPage, onPageChange)
  const page = clampPage(raw, count)
  const nav = React.useRef<HTMLElement | null>(null)
  const navRef = useMergedRef(ref, nav)
  const s = sizes[size]

  // Which jump field is open: a gap's index, or the compact page number. A gap's index
  // points at another slot once the page moves, so a new page closes it.
  const [editing, setEditing] = React.useState<number | "current" | null>(null)
  const [editingAt, setEditingAt] = React.useState(page)
  if (editingAt !== page) {
    setEditingAt(page)
    if (editing !== null) setEditing(null)
  }
  // Where focus goes on the next render, once what had it is gone or disabled: the
  // current page, or the gap a jump field was opened from.
  const refocus = React.useRef<"current" | number | null>(null)

  const go = (next: number, reason: PaginationChangeReason, event?: Event) => {
    if (disabled || next === page || next < 1 || next > count) return false
    const details = changeDetails(reason, event)
    change(next, details)
    return !details.isCanceled
  }

  // Pages with their own URL load it when the change comes from somewhere a link cannot.
  const visit = (next: number) => {
    if (getHref && typeof window !== "undefined") window.location.assign(getHref(next))
  }

  const pressLink = (next: number, reason: PaginationChangeReason) => (e: React.MouseEvent) => {
    // A new tab or window leaves this page where it is.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    // A refused change keeps the browser where it is too, so the app can route it itself.
    if (!go(next, reason, e.nativeEvent) && next !== page) e.preventDefault()
  }

  React.useLayoutEffect(() => {
    const target = refocus.current
    if (target === null) return
    refocus.current = null
    const el =
      target === "current"
        ? nav.current?.querySelector('[aria-current="page"], [data-slot="pagination-current"]')
        : nav.current?.querySelectorAll('[data-slot="pagination-gap"]')[target]
    ;(el as HTMLElement | null | undefined)?.focus()
  })

  /* ---- agent ---- */
  const whole = (value: unknown) => Number(String(value ?? "").trim() || NaN)
  const to = (next: number) => {
    if (next < 1 || next > count) return `Page ${next} is out of range. Pages run from 1 to ${count}.`
    if (next === page) return undefined
    return changeAsAgent((n: number, details: PaginationChangeDetails) => change(n, details), next) ?? visit(next)
  }
  const step = (steps: unknown, dir: 1 | -1) => {
    const n = whole(steps)
    return Number.isInteger(n) ? to(page + dir * n) : `"${String(steps)}" is not a whole number of pages.`
  }

  useAgentControl(() => ({
    kind: "number",
    element: nav.current,
    value: page,
    min: 1,
    max: count,
    step: 1,
    disabled,
    actions: {
      setValue: (wanted: unknown) => {
        const n = whole(wanted)
        return Number.isInteger(n) ? to(n) : `"${String(wanted)}" is not a page number.`
      },
      increment: (steps: unknown = 1) => step(steps, 1),
      decrement: (steps: unknown = 1) => step(steps, -1),
    },
  }))

  /* ---- parts ---- */
  // `opener` is the gap a field came from, as its place among the gaps.
  const field = (label: string, opener: number | "current") => (
    <JumpField
      key="jump"
      label={label}
      page={page}
      count={count}
      className={s.field}
      part={part}
      onDone={(n, event, returnFocus) => {
        setEditing(null)
        if (returnFocus) refocus.current = n === null ? opener : "current"
        if (n !== null && go(n, "jump", event)) visit(n)
      }}
    />
  )

  const arrow = (dir: -1 | 1) => {
    const target = page + dir
    const off = disabled || target < 1 || target > count
    const href = getHref && !off ? getHref(target) : undefined
    const reason = dir < 0 ? "previous" : "next"
    return (
      <Button
        variant="ghost"
        aria-label={dir < 0 ? "Previous page" : "Next page"}
        data-slot={dir < 0 ? "pagination-previous" : "pagination-next"}
        data-agent-part={part}
        disabled={off}
        render={href ? <a href={href} /> : undefined}
        // Base UI names a non-button element a button; a link keeps its own role.
        {...(href ? { role: undefined } : {})}
        onClick={
          href
            ? pressLink(target, reason)
            : (e: React.MouseEvent) => {
                // The arrow is disabled at the end it reaches, which would drop focus.
                if (go(target, reason, e.nativeEvent) && (target === 1 || target === count) && e.currentTarget === document.activeElement) {
                  refocus.current = "current"
                }
              }
        }
        className={cn("shrink-0 p-0 text-muted-foreground hover:text-foreground disabled:opacity-40", s.arrow)}
      >
        {dir < 0 ? <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden /> : <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />}
      </Button>
    )
  }

  // Every slot is as wide as the widest page number, so the bar never changes width.
  const slot = { "--pagination-digits": String(count).length } as React.CSSProperties
  const slotClass = cn(
    "py-0 px-1.5 font-normal tabular-nums text-muted-foreground hover:text-foreground",
    size === "lg"
      ? "h-11 min-w-[max(2.75rem,calc(var(--pagination-digits)*1ch+0.75rem))] text-[15px]"
      : "h-8 min-w-[max(2rem,calc(var(--pagination-digits)*1ch+0.75rem))] text-[13px]"
  )

  let middle: React.ReactNode
  if (variant === "compact") {
    middle =
      editing === "current" ? (
        field("Go to page", "current")
      ) : (
        <button
          type="button"
          data-slot="pagination-current"
          data-agent-part={part}
          aria-label={`Page ${page} of ${count}, go to page`}
          disabled={disabled}
          onClick={() => setEditing("current")}
          className={cn(
            "inline-block rounded-md px-2 tabular-nums transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            size === "lg" && "rounded-[10px] px-3",
            s.text,
            // Last, so merging in the text size cannot drop the line height that sets the target.
            size === "lg" ? "h-11 leading-[2.75rem]" : "h-8 leading-8"
          )}
        >
          Page{" "}
          <b
            className="inline-block text-center font-medium underline decoration-foreground/40 decoration-dotted underline-offset-4"
            style={{ minWidth: `${String(count).length}ch` }}
          >
            {page}
          </b>{" "}
          of {count}
        </button>
      )
  } else {
    const items = pageItems(page, count)
    middle = items.map((item, i) =>
      item === "gap" ? (
        editing === i ? (
          field(`Page 1 to ${count}`, items.slice(0, i).filter((x) => x === "gap").length)
        ) : (
          <Button
            key={`gap-${i}`}
            variant="ghost"
            data-slot="pagination-gap"
            data-agent-part={part}
            aria-label="Jump to a page"
            disabled={disabled}
            onClick={() => setEditing(i)}
            style={slot}
            className={cn(slotClass, "tracking-[1px]")}
          >
            …
          </Button>
        )
      ) : (
        <Button
          key={item}
          variant="ghost"
          data-slot="pagination-page"
          data-agent-part={part}
          aria-label={`Page ${item}`}
          aria-current={item === page ? "page" : undefined}
          disabled={disabled}
          render={getHref && !disabled ? <a href={getHref(item)} /> : undefined}
          {...(getHref && !disabled ? { role: undefined } : {})}
          onClick={getHref && !disabled ? pressLink(item, "page-press") : (e: React.MouseEvent) => go(item, "page-press", e.nativeEvent)}
          style={slot}
          className={cn(
            slotClass,
            "aria-[current=page]:bg-primary aria-[current=page]:font-medium aria-[current=page]:text-primary-foreground",
            "aria-[current=page]:hover:bg-primary aria-[current=page]:hover:text-primary-foreground"
          )}
        >
          {item}
        </Button>
      )
    )
  }

  return (
    <nav
      {...rest}
      ref={navRef}
      aria-label={ariaLabel}
      data-slot="pagination"
      data-variant={variant}
      data-disabled={disabled || undefined}
      className={cn("inline-flex items-center", variant === "compact" ? (size === "lg" ? "gap-1" : "gap-1.5") : "gap-0.5", s.text, className)}
    >
      {arrow(-1)}
      {middle}
      {arrow(1)}
    </nav>
  )
})
Pagination.displayName = "Pagination"

/** The go-to-page field a gap or the compact page number opens into. */
function JumpField({
  label,
  page,
  count,
  className,
  part,
  onDone,
}: {
  label: string
  page: number
  count: number
  className: string
  part: string | undefined
  /** `returnFocus` is false on blur, where focus has already gone where the person sent it. */
  onDone: (page: number | null, event: Event | undefined, returnFocus: boolean) => void
}) {
  const input = React.useRef<HTMLInputElement>(null)
  const done = React.useRef(false)
  React.useLayoutEffect(() => {
    input.current?.focus()
  }, [])
  const finish = (commit: boolean, returnFocus: boolean, event?: Event) => {
    if (done.current) return
    done.current = true
    const n = parseInt(input.current?.value ?? "", 10)
    onDone(commit && Number.isFinite(n) ? clampPage(n, count) : null, event, returnFocus)
  }
  return (
    // A plain input rather than Input, so the field stays part of this control for the agent.
    <input
      ref={input}
      data-slot="pagination-jump"
      data-agent-part={part}
      inputMode="numeric"
      autoComplete="off"
      aria-label={label}
      placeholder={String(page)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          finish(true, true, e.nativeEvent)
        } else if (e.key === "Escape") {
          e.preventDefault()
          finish(false, true)
        }
      }}
      onBlur={(e) => finish(true, false, e.nativeEvent)}
      className={cn(
        "shrink-0 rounded-md border border-input bg-background px-1 text-center tabular-nums outline-none placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
    />
  )
}

export { Pagination }
