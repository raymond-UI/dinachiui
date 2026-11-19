"use client"

import * as React from "react"
import type { useRender } from "@base-ui/react/use-render"
import { ChevronLeft, ChevronRight, ListTree } from "lucide-react"
import { cn } from "@dinachi/core"
import {
  AgentProvider,
  changeAsAgent,
  matchAgentChoice,
  useAgentControl,
  useHasAgent,
  useMergedRef,
  waitForAgent,
  type Agent,
} from "../agent"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../drawer"
import { Link } from "../link"
import { Menu, MenuContent, MenuLinkItem, MenuTrigger } from "../menu"

export interface BreadcrumbItem {
  label: string
  /** Where the level lives. Without one the level is plain text. */
  href?: string
  /** Renders the link as your router's, e.g. `<NextLink href="/rooms" />`. */
  render?: useRender.RenderProp
}

export type BreadcrumbNavigateReason = "link-press" | "menu-press" | "back-press" | "sheet-press"

export interface BreadcrumbNavigateDetails {
  reason: BreadcrumbNavigateReason | (string & {})
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
  /** Runs before every move, for people and agents. `details.cancel()` keeps the browser where it is. */
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
}

/**
 * How many levels to keep after the root, collapsing the ones between into a menu. Keeps
 * as many as fit; at `widths.length` nothing collapses.
 */
export function breadcrumbFit({ widths, separator, ellipsis, gap = 0, available, minKeep }: BreadcrumbFitInput): number {
  const n = widths.length
  const sum = (from: number) => widths.slice(from).reduce((a, b) => a + b, 0)
  const row = (parts: number, width: number) => width + Math.max(0, parts - 1) * gap
  const full = row(2 * n - 1, sum(0) + Math.max(0, n - 1) * separator)
  if (full <= available + 0.5) return n
  for (let keep = n - 2; keep >= Math.max(1, minKeep); keep--) {
    const width = widths[0] + ellipsis + sum(n - keep) + (keep + 1) * separator
    if (row(2 * keep + 3, width) <= available + 0.5) return keep
  }
  return n - 1 <= minKeep ? n : Math.max(1, minKeep)
}

const WIDE = "(min-width: 768px)"

function usePresentation(presentation: "auto" | "trail" | "back"): "trail" | "back" {
  const wide = React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia?.(WIDE)
      query?.addEventListener("change", onChange)
      return () => query?.removeEventListener("change", onChange)
    },
    () => window.matchMedia?.(WIDE).matches ?? true,
    () => true
  )
  return presentation === "auto" ? (wide ? "trail" : "back") : presentation
}

/** The menu and sheet are part of the breadcrumb to an agent, so they don't register their own. */
const Unlisted = ({ children }: { children: React.ReactNode }) => (
  <AgentProvider agent={null as unknown as Agent}>{children}</AgentProvider>
)

const crumb = "block truncate rounded-md px-1.5 py-[3px]"
// Levels before the last are capped, so one long name cannot push the rest out.
const capped = "max-w-[12rem]"
const linkClass = cn(
  crumb,
  "text-muted-foreground hover:bg-muted hover:text-foreground",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50"
)

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

  /* ---- fitting ---- */
  const measure = React.useRef<HTMLSpanElement | null>(null)
  const [keep, setKeep] = React.useState(n)
  const labels = shown.map((i) => i.label).join("\u0000")
  const fit = React.useCallback(() => {
    const box = nav.current
    const m = measure.current
    if (!box || !m) return
    const width = (el: Element | null) => el?.getBoundingClientRect().width ?? 0
    const widths = Array.from(m.querySelectorAll("[data-measure-item]"), width)
    const gap = parseFloat(getComputedStyle(m).columnGap) || 0
    const next = breadcrumbFit({
      widths,
      separator: width(m.querySelector("[data-measure-separator]")),
      ellipsis: width(m.querySelector("[data-measure-ellipsis]")),
      gap,
      available: width(box),
      minKeep,
    })
    setKeep((k) => (k === next ? k : next))
  }, [minKeep])

  React.useLayoutEffect(() => {
    if (presentation !== "trail") return
    fit()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => fit())
    if (nav.current) observer.observe(nav.current)
    if (measure.current) observer.observe(measure.current)
    return () => observer.disconnect()
  }, [fit, labels, presentation])

  const collapsed = keep < n - 1
  const hiddenFrom = 1
  const hiddenTo = collapsed ? n - keep : 1
  const visible = collapsed ? [0, ...shown.slice(n - keep).map((_, i) => n - keep + i)] : shown.map((_, i) => i)

  /* ---- navigating ---- */
  const press = (index: number, reason: BreadcrumbNavigateReason) => (e: React.MouseEvent) => {
    if (disabled) return e.preventDefault()
    const details = pending.current ?? navigateDetails(reason, e.nativeEvent)
    pending.current = null
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
          if (presentation === "trail") setMenuOpen(true)
          else setSheetOpen(true)
          el = await waitForAgent(() => elementFor(index, (presentation === "trail" ? menuPopup : sheetPopup).current))
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

  if (presentation === "back") {
    const parentIndex = last - 1
    if (parentIndex < 0) return null
    return (
      <nav
        {...rest}
        ref={navRef}
        aria-label={ariaLabel}
        data-slot="breadcrumb"
        data-presentation="back"
        data-floating={floating || undefined}
        className={cn("flex min-w-0 items-center justify-between gap-1", className)}
      >
        {items[parentIndex].href ? (
          link(parentIndex, "back-press", backClass(floating), {
            ...hold,
            "data-slot": "breadcrumb-back",
            children: backLabel(items[parentIndex].label),
          } as React.ComponentProps<typeof Link>)
        ) : (
          <span data-slot="breadcrumb-back" className={backClass(floating)}>
            {backLabel(items[parentIndex].label)}
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
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                floating &&
                  "size-10 rounded-full bg-background/80 text-foreground shadow-[0_2px_12px_rgb(0_0_0/0.12)] backdrop-blur-md"
              )}
            >
              <ListTree aria-hidden className="size-5" />
            </DrawerTrigger>
            <DrawerContent
              ref={sheetPopup}
              side="bottom"
              data-slot="breadcrumb-sheet"
              className="max-h-[85dvh] gap-0 rounded-t-[20px] border-0 bg-popover px-2 pb-[26px] pt-2 text-popover-foreground"
            >
              <div aria-hidden className="mx-auto mb-2.5 mt-0.5 h-[5px] w-9 shrink-0 rounded-full bg-muted-foreground/30" />
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
                          className="block truncate rounded-xl px-3.5 py-3 text-[15px] font-semibold text-foreground"
                        >
                          {item.label}
                        </span>
                      ) : item.href ? (
                        link(i, "sheet-press", "block truncate rounded-xl px-3.5 py-3 text-[15px] text-muted-foreground active:bg-muted aria-disabled:pointer-events-none aria-disabled:opacity-50")
                      ) : (
                        <span className="block truncate px-3.5 py-3 text-[15px] text-muted-foreground">{item.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </DrawerContent>
          </Drawer>
        </Unlisted>
      </nav>
    )
  }

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
                  "h-auto border-0 bg-transparent font-normal tracking-[1px] text-muted-foreground",
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
        className={cn("flex", tail ? "min-w-12 shrink-[1000]" : "min-w-0 shrink")}
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
      ref={navRef}
      aria-label={ariaLabel}
      data-slot="breadcrumb"
      data-presentation="trail"
      data-collapsed={collapsed || undefined}
      className={cn("relative block w-full min-w-0 text-[13px]", className)}
    >
      <ol data-slot="breadcrumb-list" className="m-0 flex min-w-0 list-none flex-nowrap items-center gap-0.5 overflow-hidden whitespace-nowrap p-0">
        {parts}
      </ol>
      {/* Every level at its natural width, read to decide what folds. */}
      <span
        ref={measure}
        aria-hidden="true"
        data-agent-hidden={part}
        className="pointer-events-none invisible absolute left-0 top-0 flex h-0 gap-0.5 overflow-hidden whitespace-nowrap"
      >
        {shown.map((item, i) => (
          <span
            key={i}
            data-measure-item=""
            className={cn(crumb, "shrink-0 overflow-visible", i < n - 1 && capped, !hideCurrent && i === last && "font-medium")}
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
    </nav>
  )
})
Breadcrumb.displayName = "Breadcrumb"

const backClass = (floating: boolean) =>
  cn(
    "flex min-w-0 select-none items-center gap-0.5 [-webkit-touch-callout:none]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:pointer-events-none aria-disabled:opacity-50",
    floating
      ? "h-10 rounded-full bg-background/80 pl-2 pr-3.5 text-[15px] font-medium text-foreground shadow-[0_2px_12px_rgb(0_0_0/0.12)] backdrop-blur-md"
      : "rounded-md px-1 py-1.5 text-base text-info"
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
  const end = () => window.clearTimeout(timer.current)
  React.useEffect(() => end, [])
  return {
    onPointerDown: (e: React.PointerEvent) => {
      held.current = false
      if (disabled || e.button !== 0) return
      end()
      timer.current = window.setTimeout(() => {
        held.current = true
        onHold()
      }, HOLD_MS)
    },
    onPointerUp: end,
    onPointerLeave: end,
    onPointerCancel: end,
    // A touch hold opens the browser's link menu otherwise.
    onContextMenu: (e: React.MouseEvent) => {
      if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") e.preventDefault()
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
