"use client"

import * as React from "react"
import type { useRender } from "@base-ui/react/use-render"
import { ChevronLeft, ChevronRight, ListTree } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AgentProvider,
  changeAsAgent,
  matchAgentChoice,
  useAgentControl,
  useHasAgent,
  useMergedRef,
  waitForAgent,
  type Agent,
} from "@/components/ui/agent"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Link } from "@/components/ui/link"
import { Menu, MenuContent, MenuLinkItem, MenuTrigger } from "@/components/ui/menu"

export interface BreadcrumbItem {
  label: string
  /** Where the level lives. Without one the level is plain text. */
  href?: string
  /** Renders the link as your router's, e.g. `<NextLink href="/rooms" />`. */
  render?: useRender.RenderProp
}

/** Where a move came from. `imperative-action` is an agent's `goTo`. */
export type BreadcrumbNavigateReason = "link-press" | "menu-press" | "back-press" | "sheet-press" | "imperative-action"

export interface BreadcrumbNavigateDetails {
  reason: BreadcrumbNavigateReason | (string & {})
  /** The click, an agent's included. `event.preventDefault()` stops the link for a move your router makes. */
  event?: Event
  isCanceled: boolean
  cancel(): void
}

export interface BreadcrumbProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** From the root to the current page. The last item is the current page. */
  items: BreadcrumbItem[]
  /** Leaves the current page out of the trail, for pages whose heading already names it. */
  hideCurrent?: boolean
  /** `trail` lists the levels. `back` is one link to the parent, with the trail in a sheet. `auto` is `back` below 768px. */
  presentation?: "auto" | "trail" | "back"
  /** Draws `back` as frosted pills that read over a photo. */
  floating?: boolean
  /**
   * Runs before every move, for people and agents. `details.reason` says where it came from,
   * `imperative-action` for an agent. `details.cancel()` refuses the move. To make it through
   * your router, call it and `details.event.preventDefault()`: the move still counts as done.
   */
  onNavigate?: (item: BreadcrumbItem, details: BreadcrumbNavigateDetails) => void
  disabled?: boolean
}

function navigateDetails(reason: BreadcrumbNavigateReason, event?: Event): BreadcrumbNavigateDetails {
  const details: BreadcrumbNavigateDetails = {
    reason,
    event,
    isCanceled: false,
    cancel() {
      details.isCanceled = true
    },
  }
  return details
}

export interface BreadcrumbFitInput {
  /** Each shown level's width, root first. */
  widths: number[]
  separator: number
  ellipsis: number
  /** The flex gap between every two parts. */
  gap?: number
  available: number
  /** The fewest levels kept after the collapsed ones. */
  minKeep: number
  /** The narrowest a level may truncate to. When even the fewest levels cannot keep this, returns 0. */
  readable?: number
}

/**
 * How many levels to keep after the root, collapsing the ones between into a menu. Keeps
 * as many as fit without truncating any; at `widths.length` nothing collapses.
 */
export function breadcrumbFit({ widths, separator, ellipsis, gap = 0, available, minKeep, readable }: BreadcrumbFitInput): number {
  const n = widths.length
  if (n < 2) return n
  // Whole pixels, rounded up, so a level that is kept is never a fraction short.
  const up = Math.ceil
  // The width of the root, then `keep` levels from the end, folded between when they don't meet.
  const row = (keep: number, w: (x: number) => number = up) => {
    const folded = keep < n - 1
    const levels = [0, ...widths.slice(n - keep).map((_, i) => n - keep + i)]
    const parts = levels.length * 2 - 1 + (folded ? 2 : 0)
    return (
      levels.reduce((a, i) => a + w(widths[i]), 0) +
      (levels.length - 1 + (folded ? 1 : 0)) * up(separator) +
      (folded ? up(ellipsis) : 0) +
      Math.max(0, parts - 1) * gap
    )
  }
  if (row(n - 1) <= available) return n
  for (let keep = n - 2; keep >= Math.max(1, minKeep); keep--) {
    if (row(keep) <= available) return keep
  }
  const keep = n - 1 <= minKeep ? n : Math.max(1, minKeep)
  if (readable && row(Math.min(keep, n - 1), (x) => Math.min(up(x), readable)) > available) return 0
  return keep
}

const WIDE = "(min-width: 768px)"
// Below this a truncated level stops reading as a name; `auto` turns to `back` instead.
const READABLE = 64

/** `both` until the client knows the width: CSS shows the right one, so phones never flash the trail. */
function usePresentation(presentation: "auto" | "trail" | "back"): "trail" | "back" | "both" {
  const wide = React.useSyncExternalStore<boolean | null>(
    (onChange) => {
      const query = window.matchMedia?.(WIDE)
      query?.addEventListener("change", onChange)
      return () => query?.removeEventListener("change", onChange)
    },
    () => window.matchMedia?.(WIDE).matches ?? true,
    () => null
  )
  if (presentation !== "auto") return presentation
  return wide === null ? "both" : wide ? "trail" : "back"
}

/** The menu and sheet are part of the breadcrumb to an agent, so they don't register their own. */
const Unlisted = ({ children }: { children: React.ReactNode }) => (
  <AgentProvider agent={null as unknown as Agent}>{children}</AgentProvider>
)

const crumb = "block truncate rounded-md px-1.5 py-[3px]"
// Inset, so the list's overflow and the sheet's scroll area cannot clip it.
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:ring-offset-0"
const inert = "aria-disabled:pointer-events-none aria-disabled:opacity-50"
// Levels before the last are capped, so one long name cannot push the rest out.
const capped = "max-w-[12rem] focus-visible:max-w-none"
const linkClass = cn(crumb, ring, inert, "text-muted-foreground hover:bg-muted hover:text-foreground")

/**
 * Where a page sits, as a trail of links up to it. Middle levels fold into a menu as the
 * container narrows; on phones it is one back link with the whole trail in a sheet.
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>((props, ref) => {
  const {
    items,
    hideCurrent = false,
    presentation: presentationProp = "auto",
    floating = false,
    onNavigate,
    disabled,
    className,
    "aria-label": ariaLabel = "Breadcrumb",
    ...rest
  } = props
  const presentation = usePresentation(presentationProp)
  const hasAgent = useHasAgent()
  const part = hasAgent ? "" : undefined
  const nav = React.useRef<HTMLElement | null>(null)
  const navRef = useMergedRef(ref, nav)
  const menuPopup = React.useRef<HTMLDivElement | null>(null)
  const sheetPopup = React.useRef<HTMLDivElement | null>(null)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  // The details an agent's press carries into the click it makes.
  const pending = React.useRef<BreadcrumbNavigateDetails | null>(null)

  const last = items.length - 1
  const shown = hideCurrent ? items.slice(0, -1) : items
  const n = shown.length
  const minKeep = hideCurrent ? 1 : 2
  const auto = presentationProp === "auto"

  /* ---- fitting ---- */
  const measure = React.useRef<HTMLSpanElement | null>(null)
  // 0 when even the fewest levels would be unreadable: `auto` then shows `back`.
  const [keep, setKeep] = React.useState(n)
  const compact = auto && keep === 0
  const view = compact && presentation !== "back" ? "back" : presentation
  const labels = shown.map((i) => i.label).join("\u0000")
  const fit = React.useCallback(() => {
    const box = nav.current
    const m = measure.current
    if (!box || !m) return
    const width = (el: Element | null) => el?.getBoundingClientRect().width ?? 0
    // The nav's content box, the same in either view. Zero while hidden by CSS.
    const style = getComputedStyle(box)
    const edges = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"] as const
    const available = width(box) - edges.reduce((a, k) => a + (parseFloat(style[k]) || 0), 0)
    if (available <= 0) return
    const widths = Array.from(m.querySelectorAll("[data-measure-item]"), width)
    const gap = parseFloat(getComputedStyle(m).columnGap) || 0
    const next = breadcrumbFit({
      widths,
      separator: width(m.querySelector("[data-measure-separator]")),
      ellipsis: width(m.querySelector("[data-measure-ellipsis]")),
      gap,
      available,
      minKeep,
      readable: auto ? READABLE : undefined,
    })
    setKeep((k) => (k === next ? k : next))
  }, [minKeep, auto])

  // Both views fill the container, so switching between them cannot change what is measured.
  React.useLayoutEffect(() => {
    if (presentation === "back") return
    fit()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => fit())
    if (nav.current) observer.observe(nav.current)
    if (measure.current) observer.observe(measure.current)
    return () => observer.disconnect()
  }, [fit, labels, presentation, compact])

  const collapsed = keep < n - 1
  const hiddenFrom = 1
  const hiddenTo = collapsed ? n - keep : 1
  const visible = collapsed ? [0, ...shown.slice(n - keep).map((_, i) => n - keep + i)] : shown.map((_, i) => i)

  /* ---- navigating ---- */
  const press = (index: number, reason: BreadcrumbNavigateReason) => (e: React.MouseEvent) => {
    if (disabled || !items[index]?.href) return e.preventDefault()
    const details = pending.current ?? navigateDetails(reason, e.nativeEvent)
    pending.current = null
    // An agent's details too, so `event.preventDefault()` stops the link for either.
    details.event = e.nativeEvent
    onNavigate?.(items[index], details)
    if (details.isCanceled) e.preventDefault()
    if (reason === "sheet-press") setSheetOpen(false)
  }

  /* ---- agent ---- */
  const choices = items.map((item, i) => ({ value: i + 1, label: item.label, disabled: i !== last && !item.href }))
  const elementFor = (index: number, scope: ParentNode | null | undefined) =>
    scope?.querySelector<HTMLElement>(`[data-breadcrumb-index="${index}"]`) ?? null

  useAgentControl(() => ({
    kind: "list",
    element: nav.current,
    value: items[last]?.label,
    items: choices.map((c) => c.label),
    disabled,
    actions: {
      goTo: async (wanted: unknown) => {
        const match = matchAgentChoice(choices, wanted)
        if (typeof match === "string") return match
        const index = match.value - 1
        if (index === last) return undefined
        let el = elementFor(index, nav.current)
        if (!el) {
          const sheet = view === "back"
          if (sheet) setSheetOpen(true)
          else setMenuOpen(true)
          el = await waitForAgent(() => elementFor(index, (sheet ? sheetPopup : menuPopup).current))
        }
        if (!el) return `"${match.label}" did not appear.`
        return changeAsAgent<number, BreadcrumbNavigateDetails>((_, details) => {
          pending.current = details
          el!.click()
          pending.current = null
        }, index)
      },
    },
  }))

  const hold = useHold(() => setSheetOpen(true), disabled)

  /* ---- parts ---- */
  const link = (
    index: number,
    reason: BreadcrumbNavigateReason,
    className: string,
    extra: React.ComponentProps<typeof Link> = {}
  ) => {
    const item = items[index]
    const onClick = press(index, reason)
    return (
      <Link
        variant="unstyled"
        href={item.href}
        render={item.render}
        title={item.label}
        aria-disabled={disabled || undefined}
        data-slot="breadcrumb-link"
        data-breadcrumb-index={index}
        data-agent-part={part}
        {...extra}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          extra.onClick?.(e)
          if (!e.defaultPrevented) onClick(e)
        }}
        className={className}
      >
        {extra.children ?? item.label}
      </Link>
    )
  }

  // Every level at its natural width, read to decide what folds.
  const measurer = (
    <span
      ref={measure}
      aria-hidden="true"
      data-agent-hidden={part}
      className="pointer-events-none invisible absolute left-0 top-0 flex h-0 gap-0.5 overflow-hidden whitespace-nowrap text-[13px]"
    >
      {shown.map((item, i) => (
        <span
          key={i}
          data-measure-item=""
          className={cn(crumb, "shrink-0 overflow-visible", i < n - 1 && "max-w-[12rem]", !hideCurrent && i === last && "font-medium")}
        >
          {item.label}
        </span>
      ))}
      <span data-measure-separator="" className="flex shrink-0">
        <ChevronRight className="size-3.5" />
      </span>
      <span data-measure-ellipsis="" className={cn(crumb, "shrink-0 tracking-[1px]")}>
        …
      </span>
    </span>
  )

  const backView = (viewRef: React.Ref<HTMLElement> | undefined, only?: string) => {
    if (last < 1) return null
    // The nearest level up that can be gone to.
    let parentIndex = last - 1
    while (parentIndex > 0 && !items[parentIndex].href) parentIndex--
    const parent = items[parentIndex]
    return (
      <nav
        {...rest}
        ref={viewRef}
        aria-label={ariaLabel}
        data-slot="breadcrumb"
        data-presentation="back"
        data-floating={floating || undefined}
        className={cn("relative flex w-full min-w-0 items-center justify-between gap-1", className, only)}
      >
        {parent.href ? (
          link(parentIndex, "back-press", backClass(floating), {
            ...hold,
            "data-slot": "breadcrumb-back",
            children: backLabel(parent.label),
          } as React.ComponentProps<typeof Link>)
        ) : (
          <span data-slot="breadcrumb-back" className={cn(backClass(floating), "text-muted-foreground")}>
            <span className="truncate">{parent.label}</span>
          </span>
        )}
        <Unlisted>
          <Drawer open={sheetOpen} onOpenChange={setSheetOpen}>
            <DrawerTrigger
              disabled={disabled}
              aria-label="Show full path"
              data-slot="breadcrumb-path"
              data-agent-part={part}
              className={cn(
                "grid size-11 shrink-0 cursor-pointer place-items-center rounded-[10px] text-muted-foreground",
                ring,
                "disabled:pointer-events-none disabled:opacity-50",
                floating && cn("size-10 rounded-full text-foreground", frosted)
              )}
            >
              <ListTree aria-hidden className="size-5" />
            </DrawerTrigger>
            <DrawerContent
              ref={sheetPopup}
              side="bottom"
              data-slot="breadcrumb-sheet"
              className="max-h-[85dvh] gap-0 rounded-t-[20px] border-0 bg-popover px-2 pb-[calc(26px+env(safe-area-inset-bottom))] pt-2 text-popover-foreground"
            >
              <div aria-hidden className="mx-auto mb-2.5 mt-0.5 h-[5px] w-9 shrink-0 rounded-full bg-[color:color-mix(in_oklab,var(--muted-foreground)_30%,transparent)]" />
              <DrawerTitle className="sr-only">{ariaLabel}</DrawerTitle>
              <nav aria-label={ariaLabel}>
                {/* Root first, so the nearest levels sit lowest, by the thumb. */}
                <ol className="m-0 flex list-none flex-col p-0">
                  {items.map((item, i) => (
                    <li key={i} className="min-w-0">
                      {i === last ? (
                        <span
                          aria-current="page"
                          data-slot="breadcrumb-page"
                          className="block break-words rounded-xl px-3.5 py-3 text-[15px] font-semibold text-foreground"
                        >
                          {item.label}
                        </span>
                      ) : item.href ? (
                        link(i, "sheet-press", cn("block break-words rounded-xl px-3.5 py-3 text-[15px] text-muted-foreground active:bg-muted", ring, inert))
                      ) : (
                        <span className="block break-words px-3.5 py-3 text-[15px] text-muted-foreground">{item.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </DrawerContent>
          </Drawer>
        </Unlisted>
        {compact && measurer}
      </nav>
    )
  }

  const trailView = (viewRef: React.Ref<HTMLElement> | undefined, only?: string) => {
    const hidden = shown.slice(hiddenFrom, hiddenTo)
    const separator = (key: string) => (
      <li key={key} role="presentation" aria-hidden="true" data-slot="breadcrumb-separator" className="flex shrink-0 text-muted-foreground opacity-60">
        <ChevronRight className="size-3.5 rtl:rotate-180" />
      </li>
    )

    const parts: React.ReactNode[] = []
    visible.forEach((index, k) => {
      const tail = k === visible.length - 1
      const item = shown[index]
      if (k > 0) parts.push(separator(`s${index}`))
      if (k === 1 && collapsed) {
        parts.push(
          <li key="more" data-slot="breadcrumb-ellipsis" className="flex shrink-0">
            <Unlisted>
              <Menu open={menuOpen} onOpenChange={setMenuOpen}>
                <MenuTrigger
                  disabled={disabled}
                  aria-label={`Show ${hidden.length} more ${hidden.length === 1 ? "level" : "levels"}`}
                  data-agent-part={part}
                  className={cn(
                    crumb,
                    ring,
                    "h-auto border-0 bg-transparent text-[13px] font-normal leading-[inherit] tracking-[1px] text-muted-foreground",
                    "hover:bg-muted hover:text-foreground data-[popup-open]:bg-muted data-[popup-open]:text-foreground"
                  )}
                >
                  …
                </MenuTrigger>
                <MenuContent ref={menuPopup} align="start" sideOffset={4} className="min-w-[200px] max-w-[min(20rem,calc(100vw-2rem))]">
                  {hidden.map((h, i) => {
                    const at = hiddenFrom + i
                    return (
                      <MenuLinkItem
                        key={at}
                        href={h.href}
                        render={h.render as React.ComponentProps<typeof MenuLinkItem>["render"]}
                        closeOnClick
                        aria-disabled={disabled || !h.href || undefined}
                        data-breadcrumb-index={at}
                        data-slot="breadcrumb-menu-item"
                        onClick={press(at, "menu-press")}
                        className={cn(inert, "max-sm:min-h-11")}
                      >
                        <span className="truncate">{h.label}</span>
                      </MenuLinkItem>
                    )
                  })}
                </MenuContent>
              </Menu>
            </Unlisted>
          </li>
        )
        parts.push(separator("s-more"))
      }
      const isCurrent = !hideCurrent && index === last
      parts.push(
        <li
          key={index}
          data-slot="breadcrumb-item"
          className={cn("flex", tail ? "min-w-[3rem] shrink-[1000]" : "min-w-0 shrink")}
        >
          {isCurrent ? (
            <span aria-current="page" title={item.label} data-slot="breadcrumb-page" className={cn(crumb, "font-medium text-foreground")}>
              {item.label}
            </span>
          ) : item.href ? (
            link(index, "link-press", cn(linkClass, !tail && capped))
          ) : (
            <span title={item.label} className={cn(crumb, "text-muted-foreground", !tail && capped)}>
              {item.label}
            </span>
          )}
        </li>
      )
    })

    return (
      <nav
        {...rest}
        ref={viewRef}
        aria-label={ariaLabel}
        data-slot="breadcrumb"
        data-presentation="trail"
        data-collapsed={collapsed || undefined}
        className={cn("relative block w-full min-w-0 text-[13px]", className, only)}
      >
        <ol data-slot="breadcrumb-list" className="m-0 flex min-w-0 list-none flex-nowrap items-center gap-0.5 overflow-hidden whitespace-nowrap p-0">
          {parts}
        </ol>
        {measurer}
      </nav>
    )
  }

  if (view === "back") return backView(navRef)
  if (presentation === "trail") return trailView(navRef)
  // Before the client knows the width; the next render drops the hidden one.
  return (
    <>
      {backView(undefined, "md:hidden")}
      {trailView(navRef, "max-md:hidden")}
    </>
  )
})
Breadcrumb.displayName = "Breadcrumb"

// Arbitrary values, so they compile on Tailwind 3, where the tokens take no alpha modifier.
const frosted =
  "bg-[color:color-mix(in_oklab,var(--background)_80%,transparent)] shadow-[0_2px_12px_rgb(0_0_0/0.12)] backdrop-blur-md"

const backClass = (floating: boolean) =>
  cn(
    "flex min-w-0 select-none items-center gap-0.5 [-webkit-touch-callout:none]",
    ring,
    inert,
    floating
      ? cn("h-10 rounded-full pl-2 pr-3.5 text-[15px] font-medium text-foreground", frosted)
      : // Toward the foreground, so it passes 4.5:1 in either theme.
        "rounded-md px-1 py-1.5 text-base text-[color:color-mix(in_oklab,var(--info)_80%,var(--foreground))]",
    // A 44px target on phones, the look unchanged.
    "relative max-sm:after:absolute max-sm:after:inset-x-0 max-sm:after:top-1/2 max-sm:after:h-11 max-sm:after:-translate-y-1/2 max-sm:after:content-['']"
  )

const backLabel = (label: string) => (
  <>
    <ChevronLeft aria-hidden className="size-[22px] shrink-0 rtl:rotate-180" />
    <span className="sr-only">Back to {label}</span>
    <span aria-hidden="true" className="truncate">
      {label}
    </span>
  </>
)

const HOLD_MS = 450

/** Holding the back link opens the trail, as a platform back button does. */
function useHold(onHold: () => void, disabled: boolean | undefined) {
  const timer = React.useRef<number | undefined>(undefined)
  const held = React.useRef(false)
  const pointer = React.useRef("")
  const end = () => window.clearTimeout(timer.current)
  // After the click that a hold ends in, so a later Enter is not swallowed.
  const release = () => {
    end()
    if (held.current) window.setTimeout(() => (held.current = false))
  }
  React.useEffect(() => end, [])
  return {
    onPointerDown: (e: React.PointerEvent) => {
      held.current = false
      pointer.current = e.pointerType
      if (disabled || e.button !== 0) return
      end()
      timer.current = window.setTimeout(() => {
        held.current = true
        onHold()
      }, HOLD_MS)
    },
    onPointerUp: release,
    onPointerLeave: end,
    onPointerCancel: release,
    onKeyDown: () => {
      held.current = false
    },
    // A touch hold opens the browser's link menu otherwise.
    onContextMenu: (e: React.MouseEvent) => {
      if (pointer.current && pointer.current !== "mouse") e.preventDefault()
    },
    // The click that ends a hold does not also go back.
    onClick: (e: React.MouseEvent) => {
      if (!held.current) return
      held.current = false
      e.preventDefault()
    },
  }
}

export { Breadcrumb }
