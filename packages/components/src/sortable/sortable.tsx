"use client"

import * as React from "react"
import {
  motion,
  MotionConfigContext,
  Reorder,
  useDragControls,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"
import { cn } from "@dinachi/core"
import { changeAsAgent, matchAgentChoice, useAgentControl, useHasAgent, useMergedRef } from "../agent"

/** `useReducedMotion` reads the OS setting only, and only at mount. Also honour an
 *  app-level `<MotionConfig reducedMotion>`, so a user preference in the host app
 *  reaches this component. */
function useReducedMotionConfig() {
  const config = React.useContext(MotionConfigContext)
  const prefersReduced = useReducedMotion()
  if (config.reducedMotion === "always") return true
  if (config.reducedMotion === "never") return false
  return prefersReduced ?? false
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

interface SortableContextValue {
  value: string[]
  grabbed: string | null
  grab: (id: string, label: string) => void
  drop: (id: string, label: string) => void
  cancel: (id: string, label: string) => void
  move: (id: string, delta: number, label: string) => void
  reducedMotion: boolean
  disabled: boolean
  /** Row labels by id, kept only inside an AgentProvider. */
  labels: Map<string, string> | null
}

const SortableContext = React.createContext<SortableContextValue | null>(null)

interface SortableItemContextValue {
  id: string
  label: string
  grabbed: boolean
  dragControls: ReturnType<typeof useDragControls>
  setDragging: (dragging: boolean) => void
}

const SortableItemContext = React.createContext<SortableItemContextValue | null>(null)

export interface SortableProps
  extends Omit<HTMLMotionProps<"ul">, "values" | "onReorder" | "children"> {
  /** The current order, as stable ids. Ids rather than objects because identity is what a
   *  reorder is about, and it is what React's keys need anyway. */
  value: string[]
  onValueChange: (next: string[], details: SortableChangeDetails) => void
  /** Turns off the handles, so no row can be moved. */
  disabled?: boolean
  children?: React.ReactNode
}

export interface SortableChangeDetails {
  reason: "drag" | "keyboard" | "escape-key" | "imperative-action"
  event: Event | undefined
  isCanceled: boolean
  /** Marks the change as refused. The order is yours, so this only tells an agent it failed. */
  cancel: () => void
}

function personChange(reason: Exclude<SortableChangeDetails["reason"], "imperative-action">): SortableChangeDetails {
  const details: SortableChangeDetails = {
    reason,
    event: undefined,
    isCanceled: false,
    cancel: () => {
      details.isCanceled = true
    },
  }
  return details
}

/**
 * A list the reader can reorder.
 *
 * The drag is the easy half. What makes this a component rather than a snippet is that
 * reordering by pointer and reordering by keyboard have to end at the same place, and only
 * one of them can be expressed as a gesture. The handle is a real button: Space picks the
 * row up, the arrows move it, Space drops it, Escape puts it back where it started — and
 * every one of those goes through the same reorder the drag does.
 *
 * Rows that move because another row passed them animate with FLIP, so a displaced row
 * reads as having been pushed rather than repainted somewhere else.
 */
const Sortable = React.forwardRef<HTMLUListElement, SortableProps>(
  ({ value, onValueChange, disabled = false, className, children, ...props }, ref) => {
    const reducedMotion = useReducedMotionConfig()
    const [grabbed, setGrabbed] = React.useState<string | null>(null)
    const [announcement, setAnnouncement] = React.useState("")

    /**
     * The order at the moment the row was picked up.
     *
     * Escape has one meaning everywhere else in a UI — undo what this interaction did — and
     * a sortable list that drops the row wherever it currently sits is the one place people
     * expect it to hold. Keeping the pre-grab order is what lets Escape mean the same thing
     * here.
     */
    const snapshot = React.useRef<string[] | null>(null)

    const positionOf = (list: string[], id: string) => list.indexOf(id) + 1

    const grab = React.useCallback(
      (id: string, label: string) => {
        snapshot.current = value
        setGrabbed(id)
        setAnnouncement(
          `${label} grabbed, position ${positionOf(value, id)} of ${value.length}. Use the arrow keys to move, Escape to cancel.`
        )
      },
      [value]
    )

    const drop = React.useCallback(
      (id: string, label: string) => {
        snapshot.current = null
        setGrabbed(null)
        setAnnouncement(
          `${label} dropped at position ${positionOf(value, id)} of ${value.length}.`
        )
      },
      [value]
    )

    const cancel = React.useCallback(
      (id: string, label: string) => {
        const original = snapshot.current
        snapshot.current = null
        setGrabbed(null)
        if (original) onValueChange(original, personChange("escape-key"))
        setAnnouncement(
          `Cancelled. ${label} back at position ${positionOf(original ?? value, id)} of ${value.length}.`
        )
      },
      [value, onValueChange]
    )

    const move = React.useCallback(
      (id: string, delta: number, label: string) => {
        const from = value.indexOf(id)
        const to = from + delta
        if (from < 0 || to < 0 || to >= value.length) return

        const next = [...value]
        ;[next[from], next[to]] = [next[to], next[from]]
        const details = personChange("keyboard")
        onValueChange(next, details)
        if (details.isCanceled) return
        setAnnouncement(`${label}, position ${to + 1} of ${value.length}`)
      },
      [value, onValueChange]
    )

    const hasAgent = useHasAgent()
    const [labelMap] = React.useState(() => new Map<string, string>())
    const labels = hasAgent ? labelMap : null
    const root = React.useRef<HTMLUListElement>(null)
    useAgentControl(() => {
      const choices = value.map((id) => ({ value: id, label: labelMap.get(id) ?? id }))
      return {
        kind: "list",
        element: root.current,
        value: choices.map((c) => c.label).join(", "),
        items: choices.map((c) => c.label),
        disabled,
        actions: {
          move: (wanted: unknown, position: unknown) => {
            if (wanted === null || typeof wanted === "object") {
              return `move takes an item and a position from 1 as two args, e.g. ["${choices[0]?.label ?? "Item"}", 1].`
            }
            const match = matchAgentChoice(choices, wanted)
            if (typeof match === "string") return match
            const to = Number(position)
            if (!Number.isInteger(to) || to < 1 || to > value.length) {
              return `Position must be a whole number from 1 to ${value.length}.`
            }
            if (value[to - 1] === match.value) return
            const next = value.filter((id) => id !== match.value)
            next.splice(to - 1, 0, match.value)
            return changeAsAgent<string[], SortableChangeDetails>(onValueChange, next)
          },
        },
      }
    })

    const context = React.useMemo(
      () => ({ value, grabbed, grab, drop, cancel, move, reducedMotion, disabled, labels }),
      [value, grabbed, grab, drop, cancel, move, reducedMotion, disabled, labels]
    )

    return (
      <SortableContext.Provider value={context}>
        <Reorder.Group
          ref={useMergedRef(ref, root)}
          as="ul"
          axis="y"
          values={value}
          onReorder={(next: string[]) => onValueChange(next, personChange("drag"))}
          data-disabled={disabled ? "" : undefined}
          className={cn("list-none space-y-2", className)}
          {...props}
        >
          {children}
        </Reorder.Group>

        {/* A reorder produces no DOM event a screen reader reports on its own. Assertive
            rather than polite: the reader is mid-interaction and the position is the only
            thing telling them where the row went. */}
        <span aria-live="assertive" className="sr-only">
          {announcement}
        </span>
      </SortableContext.Provider>
    )
  }
)
Sortable.displayName = "Sortable"

export interface SortableItemProps
  extends Omit<React.ComponentProps<typeof Reorder.Item>, "value" | "children"> {
  /** The id this row carries in `value`. Give the same string to React's `key`. */
  id: string
  /** Names the row in the reorder announcements, and in the handle's accessible name. */
  label: string
  children?: React.ReactNode
}

/**
 * One reorderable row. Its children are yours; put a `<SortableHandle />` among them.
 *
 * A row being dragged is above the page rather than in it, so it scales up a hair and takes
 * a shadow. Without that, a row in flight and a row at rest are the same object in two
 * places.
 */
const SortableItem = React.forwardRef<HTMLLIElement, SortableItemProps>(
  ({ id, label, className, children, ...props }, ref) => {
    const list = React.useContext(SortableContext)

    if (!list) {
      throw new Error("SortableItem must be used within a Sortable")
    }

    const dragControls = useDragControls()
    const [dragging, setDragging] = React.useState(false)
    const grabbed = list.grabbed === id
    const lifted = dragging || grabbed
    const labels = list.labels
    React.useEffect(() => {
      labels?.set(id, label)
    }, [labels, id, label])

    const item = React.useMemo(
      () => ({ id, label, grabbed, dragControls, setDragging }),
      [id, label, grabbed, dragControls]
    )

    return (
      <SortableItemContext.Provider value={item}>
        <Reorder.Item
          ref={ref}
          as="li"
          value={id}
          // The row only moves from the handle. A whole-row drag target fights text
          // selection and swallows every click inside it.
          dragListener={false}
          dragControls={dragControls}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
          animate={{ scale: lifted && !list.reducedMotion ? 1.02 : 1 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
          className={cn(
            "relative flex items-center gap-3 rounded-xl border bg-background px-3 py-3",
            lifted ? "z-10 border-primary/50" : "border-border",
            className
          )}
          {...props}
        >
          {/* The lift is a shadow fading in, not a `boxShadow` being interpolated. A
              shadow keyframe repaints the blur on every frame; an opacity change on a
              layer that already has one does not. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_8px_24px_rgb(0_0_0/0.14)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: lifted ? 1 : 0 }}
            transition={{
              duration: list.reducedMotion ? 0 : 0.2,
              ease: EASE_OUT,
            }}
          />
          {children}
        </Reorder.Item>
      </SortableItemContext.Provider>
    )
  }
)
SortableItem.displayName = "SortableItem"

export type SortableHandleProps = React.ComponentProps<"button">


/**
 * The grip. A real button, so the reorder has a keyboard path at all.
 *
 * Space or Enter picks the row up, the arrows move it, Space drops it, Escape restores the
 * order from before the grab. Tabbing away drops the row where it is rather than
 * cancelling: focus left, but the moves already made were deliberate.
 */
const SortableHandle = React.forwardRef<HTMLButtonElement, SortableHandleProps>(
  ({ className, children, onKeyDown, onPointerDown, onBlur, ...props }, ref) => {
    const list = React.useContext(SortableContext)
    const item = React.useContext(SortableItemContext)

    if (!list || !item) {
      throw new Error("SortableHandle must be used within a SortableItem")
    }

    const { id, label, grabbed, dragControls } = item

    // Flagged on CRAP, which scores complexity against coverage that is estimated here
    // rather than measured — so the keyboard tests below it cannot move the number.
    // fallow-ignore-next-line complexity
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault()
        if (grabbed) list.drop(id, label)
        else list.grab(id, label)
        return
      }

      if (event.key === "Escape" && grabbed) {
        // Stopped here: Escape inside a dialog or a popover would otherwise close the
        // container out from under a reorder the reader was in the middle of cancelling.
        event.preventDefault()
        event.stopPropagation()
        list.cancel(id, label)
        return
      }

      if (!grabbed) return

      if (event.key === "ArrowUp") {
        event.preventDefault()
        list.move(id, -1, label)
      }
      if (event.key === "ArrowDown") {
        event.preventDefault()
        list.move(id, 1, label)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={`Reorder ${label}`}
        aria-pressed={grabbed}
        disabled={list.disabled}
        data-agent-part={list.labels ? "" : undefined}
        onPointerDown={(event) => {
          onPointerDown?.(event)
          if (event.defaultPrevented || list.disabled) return
          dragControls.start(event)
        }}
        onKeyDown={handleKeyDown}
        onBlur={(event) => {
          onBlur?.(event)
          if (grabbed) list.drop(id, label)
        }}
        className={cn(
          "relative cursor-grab touch-none rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
          className
        )}
        {...props}
      >
        {children ?? <GripIcon />}
      </button>
    )
  }
)
SortableHandle.displayName = "SortableHandle"

/** The default grip. Inlined rather than pulled from an icon package, so the component
 *  installs with nothing but `motion`. */
function GripIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  )
}

export { Sortable, SortableItem, SortableHandle }
