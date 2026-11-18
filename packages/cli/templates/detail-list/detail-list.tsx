"use client"

import * as React from "react"
import { Check, Copy, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent } from "@/components/ui/agent"
import { Button } from "@/components/ui/button"

export type DetailListLayout = "side" | "stacked"

export interface DetailListChangeDetails {
  reason: string
  event: Event | undefined
  isCanceled: boolean
  cancel(): void
}

const LayoutContext = React.createContext<DetailListLayout>("side")

interface ItemContextValue {
  termId: string
  value: string
  editing: boolean
  setEditing: (editing: boolean) => void
  save: (value: string, event: Event) => string | undefined
  copyable: boolean
  editable: boolean
  multiline: boolean
  disabled: boolean
  hasAgent: boolean
}

const ItemContext = React.createContext<ItemContextValue | null>(null)

export interface DetailListProps extends React.HTMLAttributes<HTMLDListElement> {
  /** Labels beside values, or above them. Below 768px labels always sit above. */
  layout?: DetailListLayout
}

/** A list of labelled values, as a native `dl`. */
const DetailList = React.forwardRef<HTMLDListElement, DetailListProps>(
  ({ layout = "side", className, ...props }, ref) => (
    <LayoutContext.Provider value={layout}>
      <dl ref={ref} data-slot="detail-list" data-layout={layout} className={cn("m-0", className)} {...props} />
    </LayoutContext.Provider>
  )
)
DetailList.displayName = "DetailList"

export interface DetailListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** The row's text, which copy copies and edit changes. Controlled. */
  value?: string
  defaultValue?: string
  /** Runs on every saved edit, a person's or an agent's. `details.cancel()` refuses it. */
  onValueChange?: (value: string, details: DetailListChangeDetails) => void
  /** Returns a message to refuse a value, shown under the field or sent back to the agent. */
  validate?: (value: string) => string | undefined
  /** Adds a button that copies the value. */
  copyable?: boolean
  /** Adds a button that edits the value in place. */
  editable?: boolean
  /** Edits in a textarea, saved with Cmd or Ctrl and Enter. */
  multiline?: boolean
  /** Blocks editing, by people and agents. Copy still works. */
  disabled?: boolean
}

/** One row: a term and its details. Holds the value, and the copy and edit state. */
const DetailListItem = React.forwardRef<HTMLDivElement, DetailListItemProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onValueChange,
      validate,
      copyable = false,
      editable = false,
      multiline = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const layout = React.useContext(LayoutContext)
    const termId = React.useId()
    const [value, change] = useAgentState<string, DetailListChangeDetails>(valueProp, defaultValue, onValueChange)
    const [editing, setEditing] = React.useState(false)
    const row = React.useRef<HTMLDivElement | null>(null)
    const hasAgent = useHasAgent()

    const setRef = (el: HTMLDivElement | null) => {
      row.current = el
      if (typeof ref === "function") ref(el)
      else if (ref) ref.current = el
    }

    // Two frames tinted, then the tint fades over 250ms, so the whole flash stays under 300ms.
    const flash = () => {
      const el = row.current
      if (!el) return
      el.setAttribute("data-saved", "")
      requestAnimationFrame(() => requestAnimationFrame(() => el.removeAttribute("data-saved")))
    }

    // Returns a message when the value is refused, so the caller decides how to show it.
    const commit = (next: string, apply: (next: string) => string | undefined) => {
      const invalid = validate?.(next)
      if (invalid) return invalid
      if (next === value) return
      const refused = apply(next)
      if (refused) return refused
      flash()
    }

    const save = (next: string, event: Event) =>
      commit(next, (v) => {
        const details: DetailListChangeDetails = {
          reason: "none",
          event,
          isCanceled: false,
          cancel: () => void (details.isCanceled = true),
        }
        change(v, details)
        return details.isCanceled ? "The app refused the change." : undefined
      })

    useAgentControl(() =>
      editable
        ? {
            kind: multiline ? "textarea" : "input",
            element: row.current,
            label: row.current?.ownerDocument.getElementById(termId)?.textContent?.trim(),
            value,
            disabled,
            actions: {
              setValue: (next: string) =>
                editing
                  ? "A person is editing this row."
                  : commit(String(next ?? ""), (v) => changeAsAgent(change, v)),
            },
          }
        : null
    )

    return (
      <ItemContext.Provider
        value={{ termId, value, editing, setEditing, save, copyable, editable, multiline, disabled, hasAgent }}
      >
        <div
          ref={setRef}
          data-slot="detail-list-item"
          className={cn(
            "group/item grid min-h-12 items-start gap-x-3 gap-y-0.5 border-t py-3.5 md:py-3",
            layout === "side" && "md:grid-cols-[150px_minmax(0,1fr)]",
            "transition-[background-color] duration-[250ms] ease-out motion-reduce:transition-none",
            "data-[saved]:bg-[color:color-mix(in_oklab,var(--success)_18%,transparent)] data-[saved]:duration-0",
            "motion-reduce:data-[saved]:bg-transparent",
            className
          )}
          {...props}
        />
      </ItemContext.Provider>
    )
  }
)
DetailListItem.displayName = "DetailListItem"

/** The label, as a `dt`. */
const DetailListTerm = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const item = React.useContext(ItemContext)
    return (
      <dt
        ref={ref}
        id={item?.termId}
        data-slot="detail-list-term"
        className={cn("pt-0.5 text-sm text-muted-foreground md:text-[13px]", className)}
        {...props}
      />
    )
  }
)
DetailListTerm.displayName = "DetailListTerm"

export interface DetailListDetailsProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** What the row shows. Defaults to the item's value; a function gets the value to show it your way. */
  children?: React.ReactNode | ((value: string) => React.ReactNode)
}

const iconButton =
  "inline-grid size-11 shrink-0 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 md:size-[30px]"

/** The value, as a `dd`, with the row's copy and edit buttons and its editor. */
const DetailListDetails = React.forwardRef<HTMLElement, DetailListDetailsProps>(
  ({ className, children, ...props }, ref) => {
    const item = React.useContext(ItemContext)
    const [copied, setCopied] = React.useState(false)
    const editButton = React.useRef<HTMLButtonElement | null>(null)
    const refocus = React.useRef(false)
    const editing = !!item?.editing

    React.useEffect(() => {
      if (editing || !refocus.current) return
      refocus.current = false
      editButton.current?.focus()
    }, [editing])

    React.useEffect(() => {
      if (!copied) return
      const t = setTimeout(() => setCopied(false), 1400)
      return () => clearTimeout(t)
    }, [copied])

    const shown = typeof children === "function" ? children(item?.value ?? "") : (children ?? item?.value)
    const labelledBy = (id: string) => (item ? `${id} ${item.termId}` : undefined)
    const copyId = React.useId()
    const editId = React.useId()

    const close = () => {
      refocus.current = true
      item?.setEditing(false)
    }

    return (
      <dd
        ref={ref}
        data-slot="detail-list-details"
        className={cn("m-0 flex min-w-0 items-start gap-2 text-base leading-[1.45] md:text-sm", className)}
        {...props}
      >
        {item && editing ? (
          <Editor item={item} onClose={close} />
        ) : (
          <div className="min-w-0 flex-1 whitespace-pre-line break-words pt-px">{shown}</div>
        )}
        {item && (item.copyable || item.editable) && (
          <div
            className={cn(
              "-my-2.5 -me-2.5 flex shrink-0 gap-0.5 md:-my-[5px] md:-me-1.5",
              "transition-opacity duration-100 motion-reduce:transition-none",
              "md:opacity-0 md:group-hover/item:opacity-100 md:group-focus-within/item:opacity-100",
              editing && "max-md:hidden md:invisible"
            )}
          >
            {item.copyable && (
              <button
                type="button"
                className={iconButton}
                aria-labelledby={labelledBy(copyId)}
                onClick={() =>
                  navigator.clipboard?.writeText(item.value).then(
                    () => setCopied(true),
                    () => {}
                  )
                }
              >
                <span id={copyId} className="sr-only">
                  Copy
                </span>
                {copied ? <Check className="size-[15px] text-foreground" aria-hidden /> : <Copy className="size-[15px]" aria-hidden />}
              </button>
            )}
            {item.editable && (
              <button
                ref={editButton}
                type="button"
                className={iconButton}
                aria-labelledby={labelledBy(editId)}
                disabled={item.disabled}
                data-agent-part={item.hasAgent ? "" : undefined}
                onClick={() => item.setEditing(true)}
              >
                <span id={editId} className="sr-only">
                  Edit
                </span>
                <Pencil className="size-[15px]" aria-hidden />
              </button>
            )}
            <span className="sr-only" aria-live="polite">
              {copied ? "Copied" : ""}
            </span>
          </div>
        )}
      </dd>
    )
  }
)
DetailListDetails.displayName = "DetailListDetails"

const fieldClass =
  "w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 text-base outline-none transition-[box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[invalid=true]:border-destructive md:text-sm"

function Editor({ item, onClose }: { item: ItemContextValue; onClose: () => void }) {
  const [draft, setDraft] = React.useState(item.value)
  const [error, setError] = React.useState<string>()
  const errorId = React.useId()

  const save = (event: Event) => {
    const refused = item.save(draft.trim(), event)
    if (refused) setError(refused)
    else onClose()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    } else if (event.key === "Enter" && (!item.multiline || event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      save(event.nativeEvent)
    }
  }

  const field = {
    autoFocus: true,
    value: draft,
    "aria-labelledby": item.termId,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "data-agent-part": item.hasAgent ? "" : undefined,
    onKeyDown,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft(e.target.value)
      setError(undefined)
    },
  }

  return (
    <div className="grid min-w-0 flex-1 gap-2">
      {item.multiline ? (
        <textarea {...field} rows={Math.max(2, draft.split("\n").length)} className={cn(fieldClass, "resize-none py-[7px] leading-[1.45]")} />
      ) : (
        <input {...field} className={cn(fieldClass, "h-11 md:h-[34px]")} />
      )}
      {error && (
        <p id={errorId} className="text-[13px] text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <Button size="sm" className="h-11 md:h-8" onClick={(e) => save(e.nativeEvent)}>
          Save
        </Button>
        <Button size="sm" variant="ghost" className="h-11 md:h-8" onClick={onClose}>
          Cancel
        </Button>
        <span className="ms-auto text-[11.5px] text-muted-foreground max-md:hidden">
          {item.multiline ? "⌘ Enter" : "Enter"} to save · Esc to cancel
        </span>
      </div>
    </div>
  )
}

export { DetailList, DetailListItem, DetailListTerm, DetailListDetails }
