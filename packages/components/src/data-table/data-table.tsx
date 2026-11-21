"use client"

import * as React from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type ColumnOrderState,
  type ColumnSizingState,
  type CellContext,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type Header,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Columns3, Ellipsis, Search, X } from "lucide-react"
import { cn } from "@dinachi/core"
import { changeAsAgent, createAgentChangeDetails, isAgentChange, useAgentControl, useAgentState, useHasAgent } from "../agent"
import { Button } from "../button"
import { Checkbox } from "../checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "../drawer"
import { Input } from "../input"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "../menu"
import { Pagination } from "../pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { Skeleton } from "../skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { ToggleGroup, ToggleGroupItem } from "../toggle-group"

declare module "@tanstack/react-table" {
  // TanStack declares ColumnMeta with these parameters, and a merge must repeat them.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** The column's name wherever the header itself is not shown: menus, the sheet, the agent. */
    label?: string
    /** Right-aligns the column in tabular figures. */
    numeric?: boolean
    /** Keeps the column at the left edge while the table scrolls sideways. */
    pin?: "left"
    /** Where the column goes in the phone list: the first line's `title` or `value`, or the `meta` line under it. */
    phone?: "title" | "value" | "meta"
    /** Order within its phone line, lowest first. Ties keep column order. Defaults to 0. */
    phoneOrder?: number
    /** Renders the cell in the phone list instead of `cell`, such as a date without its time. The sheet still uses `cell`. */
    phoneCell?: (context: CellContext<TData, TValue>) => React.ReactNode
    /** What the phone sort calls each direction, ascending first, such as `["Oldest", "Newest"]`. */
    sortLabels?: [ascending: string, descending: string]
  }
}

export { createColumnHelper }
export type { ColumnDef }

export interface DataTableChangeDetails {
  reason: string
  event?: Event
  isCanceled: boolean
  cancel(): void
}

export interface DataTableState {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  globalFilter: string
  pagination: PaginationState
  rowSelection: RowSelectionState
  columnVisibility: VisibilityState
  /** The movable columns, left to right, by id. Pinned and built-in columns keep their place. */
  columnOrder: ColumnOrderState
  /** Widths in px by column id, for the columns someone has resized. */
  columnSizing: ColumnSizingState
}

/** What the selection bar's actions act on. */
export interface DataTableSelection {
  /** The selected ids the filters show. In server mode, every selected id loaded so far. */
  ids: string[]
  /** True once someone chose every row on the server, including pages never loaded. */
  all: boolean
  /** How many rows are selected: the server's total when `all`, otherwise `ids.length`. */
  count: number
  /** Selected ids the current filters hide. Actions get neither these rows nor their ids. */
  hidden: string[]
}

type Change<V> = (value: V, details: DataTableChangeDetails) => void

export interface DataTableFacetOption {
  value: string
  label?: string
  /** Shown on the chip. Server mode has no rows to count, so it reads these. */
  count?: number
}

export interface DataTableEmptyContext {
  /** The search, when one is set. */
  query: string
  /** The facet's value, when one is set. */
  filter: string | undefined
  /** True once rows exist and the filters hide them all. */
  filtered: boolean
  clear: () => void
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  /** A stable id per row. Defaults to the row's `id` field, then its index. */
  getRowId?: (row: T, index: number, parent?: Row<T>) => string
  /** What a row is called in checkbox names, the sheet title and the agent. Defaults to `Order ord_1`. */
  getRowLabel?: (row: T, id: string) => string
  /** What the rows are, for counts, empty states and names. */
  noun?: { singular: string; plural: string }
  /** The heading over the table. Defaults to the count, such as `248 orders`; `null` hides it. */
  title?: React.ReactNode
  /** The column whose values become filter chips. */
  facet?: { column: string; options?: (string | DataTableFacetOption)[] }

  sorting?: SortingState
  defaultSorting?: SortingState
  onSortingChange?: Change<SortingState>
  columnFilters?: ColumnFiltersState
  defaultColumnFilters?: ColumnFiltersState
  onColumnFiltersChange?: Change<ColumnFiltersState>
  globalFilter?: string
  defaultGlobalFilter?: string
  onGlobalFilterChange?: Change<string>
  pagination?: PaginationState
  defaultPagination?: PaginationState
  onPaginationChange?: Change<PaginationState>
  rowSelection?: RowSelectionState
  defaultRowSelection?: RowSelectionState
  onRowSelectionChange?: Change<RowSelectionState>
  columnVisibility?: VisibilityState
  defaultColumnVisibility?: VisibilityState
  onColumnVisibilityChange?: Change<VisibilityState>
  columnOrder?: ColumnOrderState
  defaultColumnOrder?: ColumnOrderState
  onColumnOrderChange?: Change<ColumnOrderState>
  columnSizing?: ColumnSizingState
  defaultColumnSizing?: ColumnSizingState
  onColumnSizingChange?: Change<ColumnSizingState>
  /** Runs after any slice changes, with the whole state. */
  onStateChange?: (state: DataTableState, details: DataTableChangeDetails) => void

  /** The total on the server. Setting it hands sorting, filtering and paging to you. */
  rowCount?: number
  pageSizes?: number[]

  /** Marks the table busy. Rows on screen stay, dimmed; with none, skeleton rows stand in. */
  loading?: boolean
  /** `true` reads Couldn't load orders. A node replaces the message. */
  error?: boolean | React.ReactNode
  onRetry?: () => void
  emptyState?: (context: DataTableEmptyContext) => React.ReactNode

  density?: "comfortable" | "compact"
  /** Adds the checkbox column and the selection bar. */
  selectable?: boolean
  /** Buttons for the selection bar, given the selected rows the filters show. */
  selectionActions?: (rows: T[], clear: () => void, selection: DataTableSelection) => React.ReactNode
  /** Opens a row on click, Enter or its row trigger, in place of the built-in sheet. */
  onRowOpen?: (row: T, details: DataTableChangeDetails) => void
  /** Waits this many ms after the last keystroke before searching. */
  searchDelay?: number
  /** More controls for the toolbar, after the filter chips, such as a second filter. */
  toolbar?: React.ReactNode
  /** Runs with the rows left after search and filters, before paging. Client mode only. */
  onFilteredRowsChange?: (rows: T[]) => void
  /** Menu items for a row's actions menu, such as `DataTableAction`. */
  rowActions?: (row: T) => React.ReactNode
  getSubRows?: (row: T, index: number) => T[] | undefined
  /** A panel under an expanded row. Not drawn while virtualized. */
  renderSubComponent?: (row: Row<T>) => React.ReactNode
  getRowCanExpand?: (row: Row<T>) => boolean
  /** Drag a header edge to resize, or focus it and press the arrows. */
  resizable?: boolean
  /** Drag a header to move its column, or use the Columns menu. */
  reorderable?: boolean
  /** Renders only the rows in view and scrolls instead of paging. */
  virtualize?: boolean
  /** Height of the scrolling area in px. Virtualized tables default to 452. */
  maxHeight?: number
  disabled?: boolean
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

const SELECT = "select"
const EXPAND = "expand"
const ACTIONS = "actions"
const SYSTEM = new Set([SELECT, EXPAND, ACTIONS])
const SYSTEM_WIDTH: Record<string, number> = { [SELECT]: 44, [EXPAND]: 28, [ACTIONS]: 44 }
const FLEX_MIN = 140
const ALL = "all"

const INTERACTIVE = "button, a, input, select, textarea, label, [role='checkbox'], [role='separator'], [role='menuitem']"

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const resolve = <V,>(updater: Updater<V>, old: V): V =>
  typeof updater === "function" ? (updater as (old: V) => V)(old) : updater
const seed = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function defaultRowId<T>(row: T, index: number, parent?: Row<T>) {
  const id = (row as { id?: unknown }).id
  return id != null ? String(id) : parent ? `${parent.id}.${index}` : String(index)
}

function personDetails(reason: string, event?: Event): DataTableChangeDetails {
  const details: DataTableChangeDetails = {
    reason,
    event,
    isCanceled: false,
    cancel() {
      details.isCanceled = true
    },
  }
  return details
}

/** Details for a change another one causes, such as the page going back to 1 on a sort, kept as the agent's when it was. */
function follow(details: DataTableChangeDetails): DataTableChangeDetails {
  return isAgentChange(details)
    ? createAgentChangeDetails<DataTableChangeDetails>(details.reason)
    : personDetails(details.reason, details.event)
}

function labelOf<T>(column: Column<T, unknown>): string {
  const meta = column.columnDef.meta
  if (meta?.label) return meta.label
  const header = column.columnDef.header
  return typeof header === "string" ? header : column.id
}

const PHONE = "(max-width: 767px)"
function subscribePhone(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {}
  const query = window.matchMedia(PHONE)
  query.addEventListener?.("change", callback)
  return () => query.removeEventListener?.("change", callback)
}
const phoneNow = () => typeof window !== "undefined" && Boolean(window.matchMedia?.(PHONE).matches)
const phoneOnServer = () => false

/* ---------------- grid keyboard ---------------- */

const STOPS = 'button:not([disabled]), a[href], input:not([disabled]), [role="checkbox"], [role="separator"]'

function stopsOf(cell: HTMLElement): HTMLElement[] {
  // A checkbox keeps a hidden native input beside it for forms, which is never a stop.
  const inner = Array.from(cell.querySelectorAll<HTMLElement>(STOPS)).filter(
    (el) => !el.hidden && !el.closest("[aria-hidden=\"true\"]")
  )
  return inner.length ? inner : [cell]
}

function gridRows(grid: HTMLElement): HTMLElement[] {
  return Array.from(grid.querySelectorAll<HTMLElement>(":scope > thead > tr, :scope > tbody > tr")).filter(
    (tr) => tr.children.length > 0 && !tr.hasAttribute("data-spacer")
  )
}

interface Position {
  row: number
  cell: number
  stop: number
}

/** One tab stop for the whole grid: the active cell's control, or the cell itself. */
function rove(grid: HTMLElement, active: Position) {
  const rows = gridRows(grid)
  if (!rows.length) return
  const row = Math.min(active.row, rows.length - 1)
  rows.forEach((tr, r) =>
    Array.from(tr.children as HTMLCollectionOf<HTMLElement>).forEach((cell, c) => {
      const stops = stopsOf(cell)
      stops.forEach((stop, s) => {
        const on = r === row && c === Math.min(active.cell, tr.children.length - 1) && s === Math.min(active.stop, stops.length - 1)
        stop.tabIndex = on ? 0 : -1
      })
    })
  )
}

function positionOf(grid: HTMLElement, target: HTMLElement): Position | null {
  const cell = target.closest<HTMLElement>("td, th")
  const tr = cell?.parentElement
  if (!cell || !tr) return null
  const row = gridRows(grid).indexOf(tr)
  if (row < 0) return null
  return { row, cell: Array.prototype.indexOf.call(tr.children, cell), stop: Math.max(0, stopsOf(cell).indexOf(target)) }
}

function moveFocus(grid: HTMLElement, from: Position, key: string, ctrl: boolean): Position | null {
  const rows = gridRows(grid)
  const cellsOf = (r: number) => Array.from(rows[r].children as HTMLCollectionOf<HTMLElement>)
  const flat = (r: number) => cellsOf(r).flatMap((cell, c) => stopsOf(cell).map((_, s) => ({ row: r, cell: c, stop: s })))
  const here = flat(from.row)
  const index = here.findIndex((p) => p.cell === from.cell && p.stop === from.stop)
  const vertical = (r: number) => ({ row: r, cell: Math.min(from.cell, cellsOf(r).length - 1), stop: 0 })
  switch (key) {
    case "ArrowRight":
      return here[Math.min(index + 1, here.length - 1)]
    case "ArrowLeft":
      return here[Math.max(index - 1, 0)]
    case "ArrowDown":
      return vertical(Math.min(from.row + 1, rows.length - 1))
    case "ArrowUp":
      return vertical(Math.max(from.row - 1, 0))
    case "Home":
      return ctrl ? flat(0)[0] : here[0]
    case "End": {
      if (!ctrl) return here[here.length - 1]
      const last = flat(rows.length - 1)
      return last[last.length - 1]
    }
  }
  return null
}

function focusAt(grid: HTMLElement, p: Position) {
  const cell = gridRows(grid)[p.row]?.children[p.cell] as HTMLElement | undefined
  if (!cell) return
  const stops = stopsOf(cell)
  stops[Math.min(p.stop, stops.length - 1)]?.focus()
}

/* ---------------- parts ---------------- */

interface RowContextValue {
  id: string
  /** Set inside the phone list and the sheet, where the row trigger has nothing to open. */
  inert: boolean
  open: (id: string, event?: Event) => void
}

const RowContext = React.createContext<RowContextValue | null>(null)

/** Opens the row's detail sheet. Inside the phone list or the sheet it is plain text, as the row already opens it. */
const DataTableRowTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, children, ...props }, ref) => {
    const row = React.useContext(RowContext)
    if (!row || row.inert) return <span data-slot="data-table-row-trigger" className={className}>{children}</span>
    return (
      <button
        ref={ref}
        type="button"
        data-slot="data-table-row-trigger"
        className={cn(
          "cursor-pointer rounded-sm font-mono text-[12.5px] underline-offset-[3px] hover:underline",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) row.open(row.id, event.nativeEvent)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DataTableRowTrigger.displayName = "DataTableRowTrigger"

/** An item in a row's actions menu. `destructive` colours it as a warning. */
const DataTableAction = React.forwardRef<
  React.ComponentRef<typeof MenuItem>,
  React.ComponentProps<typeof MenuItem> & { destructive?: boolean }
>(({ className, destructive, ...props }, ref) => (
  <MenuItem
    ref={ref}
    data-slot="data-table-action"
    className={cn(
      "text-[13px]",
      destructive &&
        "text-destructive focus:bg-[color:color-mix(in_oklab,var(--destructive)_10%,transparent)] focus:text-destructive data-[highlighted]:bg-[color:color-mix(in_oklab,var(--destructive)_10%,transparent)] data-[highlighted]:text-destructive",
      className
    )}
    {...props}
  />
))
DataTableAction.displayName = "DataTableAction"

const rowBg = cn(
  "[&>td]:bg-card",
  "hover:[&>td]:[background-color:color-mix(in_oklab,var(--muted)_85%,var(--card))]",
  "aria-selected:[&>td]:[background-color:color-mix(in_oklab,var(--secondary)_55%,var(--card))]",
  "aria-selected:hover:[&>td]:[background-color:color-mix(in_oklab,var(--secondary)_75%,var(--card))]"
)
const inView = "sticky left-0 w-[var(--data-table-viewport,100%)]"
const subRowCell =
  "h-[34px] border-b-0 text-[12.5px] text-muted-foreground [background-color:color-mix(in_oklab,var(--muted)_60%,var(--card))]"
const indeterminate =
  "data-[indeterminate]:bg-primary data-[indeterminate]:text-primary-foreground data-[indeterminate]:[&_svg]:hidden data-[indeterminate]:after:h-0.5 data-[indeterminate]:after:w-2 data-[indeterminate]:after:rounded-full data-[indeterminate]:after:bg-current data-[indeterminate]:after:content-[''] inline-flex items-center justify-center"

/* ---------------- DataTable ---------------- */

function DataTable<T>(props: DataTableProps<T>) {
  const {
    data,
    columns,
    getRowId,
    getRowLabel,
    noun = { singular: "row", plural: "rows" },
    facet,
    rowCount,
    pageSizes = [10, 25, 50],
    loading = false,
    error,
    onRetry,
    emptyState,
    density = "comfortable",
    selectable = true,
    selectionActions,
    onRowOpen,
    searchDelay,
    onFilteredRowsChange,
    rowActions,
    getSubRows,
    renderSubComponent,
    getRowCanExpand,
    resizable = true,
    reorderable = true,
    virtualize = false,
    disabled = false,
    className,
    ref,
  } = props
  const maxHeight = props.maxHeight ?? (virtualize ? 452 : undefined)
  const manual = rowCount !== undefined
  const plural = noun.plural
  const hasAgent = useHasAgent()
  const phone = React.useSyncExternalStore(subscribePhone, phoneNow, phoneOnServer)

  /* ---- state ---- */
  const latest = React.useRef<DataTableState>(null as unknown as DataTableState)
  const [touched, setTouched] = React.useState(false)
  const slice = <K extends keyof DataTableState>(key: K, own?: Change<DataTableState[K]>) =>
    ((value: DataTableState[K], details: DataTableChangeDetails) => {
      own?.(value, details)
      if (details.isCanceled) return
      // A sort also resets the page, a second change in the same event; it must see the first.
      latest.current = { ...latest.current, [key]: value }
      props.onStateChange?.(latest.current, details)
      if (!details.isCanceled && (key === "sorting" || key === "columnFilters" || key === "globalFilter")) setTouched(true)
    }) as Change<DataTableState[K]>

  const [sorting, changeSorting] = useAgentState(props.sorting, props.defaultSorting ?? [], slice("sorting", props.onSortingChange))
  const [columnFilters, changeFilters] = useAgentState(
    props.columnFilters,
    props.defaultColumnFilters ?? [],
    slice("columnFilters", props.onColumnFiltersChange)
  )
  const [globalFilter, changeSearch] = useAgentState(
    props.globalFilter,
    props.defaultGlobalFilter ?? "",
    slice("globalFilter", props.onGlobalFilterChange)
  )
  const [pagination, changePagination] = useAgentState(
    props.pagination,
    props.defaultPagination ?? { pageIndex: 0, pageSize: pageSizes[0] ?? 10 },
    slice("pagination", props.onPaginationChange)
  )
  const [rowSelection, changeSelection] = useAgentState(
    props.rowSelection,
    props.defaultRowSelection ?? {},
    slice("rowSelection", props.onRowSelectionChange)
  )
  const [columnVisibility, changeVisibility] = useAgentState(
    props.columnVisibility,
    props.defaultColumnVisibility ?? {},
    slice("columnVisibility", props.onColumnVisibilityChange)
  )
  const [order, changeOrder] = useAgentState(
    props.columnOrder,
    props.defaultColumnOrder ?? [],
    slice("columnOrder", props.onColumnOrderChange)
  )
  const [sizes, changeSizing] = useAgentState(
    props.columnSizing,
    props.defaultColumnSizing ?? {},
    slice("columnSizing", props.onColumnSizingChange)
  )

  // Server mode: every row on the server is selected, so each page that loads arrives selected.
  const [everything, setEverything] = React.useState(false)
  const rowIdOf = getRowId ?? defaultRowId
  const effectiveSelection = React.useMemo(() => {
    if (!everything || !manual) return rowSelection
    const next = { ...rowSelection }
    data.forEach((row, i) => (next[rowIdOf(row, i)] = true))
    return next
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [everything, manual, rowSelection, data])
  React.useEffect(() => {
    if (effectiveSelection !== rowSelection && Object.keys(effectiveSelection).some((id) => !rowSelection[id]))
      changeSelection(effectiveSelection, personDetails("select-all"))
  }, [effectiveSelection, rowSelection, changeSelection])

  latest.current = {
    sorting,
    columnFilters,
    globalFilter,
    pagination,
    rowSelection: effectiveSelection,
    columnVisibility,
    columnOrder: order,
    columnSizing: sizes,
  }

  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [sheet, setSheet] = React.useState<string | null>(null)
  const [picking, setPicking] = React.useState(false)
  const press = React.useRef<{ timer: number; fired: boolean } | null>(null)
  React.useEffect(() => () => window.clearTimeout(press.current?.timer), [])

  // Sorting, filtering or searching changes which rows page 1 holds, so it goes back there.
  const backToFirstPage = (details: DataTableChangeDetails) => {
    const current = latest.current.pagination
    if (current.pageIndex !== 0) changePagination({ ...current, pageIndex: 0 }, follow(details))
  }
  const setSorting: Change<SortingState> = (next, details) => {
    changeSorting(next, details)
    if (!details.isCanceled) backToFirstPage(details)
  }
  const setFilters: Change<ColumnFiltersState> = (next, details) => {
    changeFilters(next, details)
    if (details.isCanceled) return
    setEverything(false)
    backToFirstPage(details)
  }
  const setSearch: Change<string> = (next, details) => {
    window.clearTimeout(searchTimer.current)
    setDraft(null)
    changeSearch(next, details)
    if (details.isCanceled) return
    setEverything(false)
    backToFirstPage(details)
  }
  const [draft, setDraft] = React.useState<string | null>(null)
  const searchTimer = React.useRef(0)
  React.useEffect(() => () => window.clearTimeout(searchTimer.current), [])
  const typeSearch = (value: string, details: DataTableChangeDetails) => {
    if (!searchDelay) return setSearch(value, details)
    setDraft(value)
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => setSearch(value, details), searchDelay)
  }
  const setSelection: Change<RowSelectionState> = (next, details) => {
    const before = latest.current.rowSelection
    if (Object.keys(before).some((id) => before[id] && !next[id])) setEverything(false)
    changeSelection(next, details)
  }

  /* ---- columns ---- */
  const expandable = Boolean(getSubRows || renderSubComponent)
  const hasActions = Boolean(rowActions)
  const facetId = facet?.column
  const userIds = React.useMemo(
    () => columns.map((c) => c.id ?? (c as { accessorKey?: string }).accessorKey ?? "").filter(Boolean),
    [columns]
  )
  const allColumns = React.useMemo<ColumnDef<T, any>[]>(() => {
    const list: ColumnDef<T, any>[] = []
    if (selectable) list.push({ id: SELECT, size: SYSTEM_WIDTH[SELECT], enableSorting: false, enableHiding: false })
    if (expandable) list.push({ id: EXPAND, size: SYSTEM_WIDTH[EXPAND], enableSorting: false, enableHiding: false })
    for (const column of columns) {
      const id = column.id ?? (column as { accessorKey?: string }).accessorKey
      list.push(facetId && id === facetId && !column.filterFn ? { ...column, filterFn: "equalsString" } : column)
    }
    if (hasActions) list.push({ id: ACTIONS, size: SYSTEM_WIDTH[ACTIONS], enableSorting: false, enableHiding: false })
    return list
  }, [columns, selectable, expandable, hasActions, facetId])

  const pinned = React.useMemo(() => {
    const left = [selectable && SELECT, expandable && EXPAND].filter(Boolean) as string[]
    for (const column of columns) {
      const id = column.id ?? (column as { accessorKey?: string }).accessorKey
      if (id && column.meta?.pin === "left") left.push(id)
    }
    return { left, right: hasActions ? [ACTIONS] : [] }
  }, [columns, selectable, expandable, hasActions])

  // A saved order may predate a column, or name one since removed.
  const columnOrder = React.useMemo(() => {
    const known = order.filter((id) => userIds.includes(id))
    return [...known, ...userIds.filter((id) => !known.includes(id))]
  }, [order, userIds])
  const deferredSearch = React.useDeferredValue(globalFilter)
  // The system columns go in the order too, so every list of leaf columns matches the header.
  const fullOrder = [...pinned.left.filter((id) => SYSTEM.has(id)), ...columnOrder, ...pinned.right]

  const table = useReactTable<T>({
    data,
    columns: allColumns,
    getRowId: rowIdOf,
    getSubRows,
    getRowCanExpand: getRowCanExpand ?? (renderSubComponent ? () => true : (row) => row.subRows.length > 0),
    state: {
      sorting,
      columnFilters,
      globalFilter: deferredSearch,
      pagination,
      rowSelection: effectiveSelection,
      columnVisibility,
      columnOrder: fullOrder,
      columnPinning: pinned,
      expanded,
    },
    // Against the latest state, not this render's, so two changes in one event both count.
    onSortingChange: (u) => setSorting(resolve(u, latest.current.sorting), personDetails("sort")),
    onColumnFiltersChange: (u) => setFilters(resolve(u, latest.current.columnFilters), personDetails("filter")),
    onGlobalFilterChange: (u) => setSearch(resolve(u, latest.current.globalFilter), personDetails("search")),
    onPaginationChange: (u) => changePagination(resolve(u, latest.current.pagination), personDetails("page")),
    onRowSelectionChange: (u) => setSelection(resolve(u, latest.current.rowSelection), personDetails("select")),
    onColumnVisibilityChange: (u) => changeVisibility(resolve(u, latest.current.columnVisibility), personDetails("visibility")),
    onExpandedChange: setExpanded,
    enableRowSelection: (row) => selectable && row.depth === 0 && !disabled,
    enableSortingRemoval: false,
    manualSorting: manual,
    manualFiltering: manual,
    manualPagination: manual || virtualize,
    rowCount,
    autoResetPageIndex: false,
    autoResetExpanded: false,
    maxLeafRowFilterDepth: 0,
    paginateExpandedRows: virtualize,
    // Zero marks a column with no width of its own, which shares what the fixed ones leave.
    defaultColumn: { size: 0 },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const widthOf = (id: string) => sizes[id] ?? table.getColumn(id)?.columnDef.size ?? 0
  const userColumns = table.getAllLeafColumns().filter((c) => !SYSTEM.has(c.id))
  const visibleUser = table.getVisibleLeafColumns().filter((c) => !SYSTEM.has(c.id))
  const leftOffsets = new Map<string, number>()
  {
    let left = 0
    for (const column of table.getLeftVisibleLeafColumns()) {
      leftOffsets.set(column.id, left)
      left += widthOf(column.id) || 160
    }
  }
  const lastPinned = table.getLeftVisibleLeafColumns().slice(-1)[0]?.id

  const total = manual ? (rowCount ?? 0) : table.getFilteredRowModel().rows.length
  const pageRows = table.getRowModel().rows
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize))
  const rowLabel = (row: Row<T>) => (getRowLabel ? getRowLabel(row.original, row.id) : `${capitalize(noun.singular)} ${row.id}`)
  const selectableRows = (rows: Row<T>[]) => rows.filter((r) => r.depth === 0 && r.getCanSelect())

  /* ---- facet ---- */
  const facetColumn = facet ? table.getColumn(facet.column) : undefined
  const facetValue = columnFilters.find((f) => f.id === facet?.column)?.value as string | undefined
  const facetOptions = React.useMemo<DataTableFacetOption[]>(() => {
    if (!facet) return []
    if (facet.options) return facet.options.map((o) => (typeof o === "string" ? { value: o } : o))
    const counts = new Map<string, number>()
    for (const row of data) {
      const value = (row as Record<string, unknown>)[facet.column]
      if (value != null) counts.set(String(value), (counts.get(String(value)) ?? 0) + 1)
    }
    return Array.from(counts, ([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
  }, [data, facet])
  const facetCounts = manual ? undefined : facetColumn?.getFacetedUniqueValues()
  const setFacet = (value: string, details: DataTableChangeDetails) => {
    if (!facet) return
    const rest = columnFilters.filter((f) => f.id !== facet.column)
    setFilters(value === ALL ? rest : [...rest, { id: facet.column, value }], details)
  }

  const clearFilters = () => {
    const details = personDetails("clear-filters")
    if (globalFilter) setSearch("", details)
    if (columnFilters.length) setFilters([], globalFilter ? personDetails("clear-filters") : details)
  }

  /* ---- selection ---- */
  const coreModel = table.getCoreRowModel()
  const filteredModel = table.getFilteredRowModel()
  const filteredRef = React.useRef(onFilteredRowsChange)
  filteredRef.current = onFilteredRowsChange
  React.useEffect(() => {
    if (!manual) filteredRef.current?.(filteredModel.rows.map((r) => r.original))
  }, [manual, filteredModel])

  // Selected rows the filters hide stay selected, but are counted apart and kept from the actions.
  const picked = React.useMemo(() => {
    const ids: string[] = []
    const hidden: string[] = []
    const rows: T[] = []
    for (const id in effectiveSelection) {
      if (!effectiveSelection[id]) continue
      const shown = (manual ? coreModel : filteredModel).rowsById[id]
      if (shown) {
        ids.push(id)
        rows.push(shown.original)
      } else if (manual) ids.push(id)
      else if (coreModel.rowsById[id]) hidden.push(id)
    }
    return { ids, hidden, rows }
  }, [effectiveSelection, manual, coreModel, filteredModel])
  const selectedCount = picked.ids.length + picked.hidden.length
  const shownCount = everything && manual ? total : picked.ids.length
  const selection: DataTableSelection = { ids: picked.ids, all: everything && manual, count: shownCount, hidden: picked.hidden }
  const clearSelection = () => {
    setEverything(false)
    changeSelection({}, personDetails("clear"))
  }
  const loadedAll = !manual || data.length >= total
  const matching = React.useMemo(
    () => selectableRows(manual ? coreModel.rows : filteredModel.rows),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manual, coreModel, filteredModel, disabled, selectable]
  )
  const pageSelectable = React.useMemo(
    () => selectableRows(pageRows),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageRows, disabled, selectable]
  )
  const pageOn = React.useMemo(
    () => pageSelectable.filter((r) => effectiveSelection[r.id]).length,
    [pageSelectable, effectiveSelection]
  )
  const pageAll = pageSelectable.length > 0 && pageOn === pageSelectable.length
  const pageSome = pageOn > 0

  /* ---- sorting choices, for the phone picker and the agent ---- */
  const sortable = visibleUser.filter((c) => c.getCanSort())
  const sortLabel = (id: string, desc: boolean) => {
    const column = table.getColumn(id)
    return column ? `${labelOf(column)} ${desc ? "descending" : "ascending"}` : id
  }
  const parseSort = (wanted: unknown): { id: string; desc: boolean } | string => {
    const want = String(wanted ?? "").trim().toLowerCase()
    for (const column of sortable) {
      const named = column.columnDef.meta?.sortLabels
      if (named) {
        if (named[0].toLowerCase() === want) return { id: column.id, desc: false }
        if (named[1].toLowerCase() === want) return { id: column.id, desc: true }
      }
      const label = labelOf(column).toLowerCase()
      if (want !== label && !want.startsWith(`${label} `) && want !== column.id.toLowerCase()) continue
      const rest = want === label || want === column.id.toLowerCase() ? "" : want.slice(label.length).trim()
      if (!rest) return { id: column.id, desc: column.getFirstSortDir() === "desc" }
      if (/^(asc|ascending|up|a-z|low.*)$/.test(rest)) return { id: column.id, desc: false }
      if (/^(desc|descending|down|z-a|high.*)$/.test(rest)) return { id: column.id, desc: true }
    }
    return `No column "${String(wanted)}" to sort by. Sortable: ${sortable.map((c) => labelOf(c)).join(", ")}.`
  }
  const phoneSorts = React.useMemo(() => {
    const named = sortable.filter((c) => c.columnDef.meta?.sortLabels)
    return (named.length ? named : sortable).flatMap((c) => {
      const labels = c.columnDef.meta?.sortLabels
      return [
        { key: `${c.id}:desc`, id: c.id, desc: true, label: labels ? labels[1] : `${labelOf(c)}, descending` },
        { key: `${c.id}:asc`, id: c.id, desc: false, label: labels ? labels[0] : `${labelOf(c)}, ascending` },
      ]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortable.map((c) => c.id).join()])

  /* ---- agent ---- */
  const headRef = React.useRef<HTMLTableSectionElement>(null)
  const bodyRef = React.useRef<HTMLTableSectionElement>(null)
  const phoneHeadRef = React.useRef<HTMLDivElement>(null)
  const phoneListRef = React.useRef<HTMLUListElement>(null)

  useAgentControl(() => {
    if (!sortable.length) return null
    const parse = (list: unknown[]) => {
      const next: SortingState = []
      for (const one of list) {
        const sort = parseSort(one)
        if (typeof sort === "string") return sort
        if (!next.some((s) => s.id === sort.id)) next.push(sort)
      }
      return next
    }
    const apply = (next: SortingState | string) =>
      typeof next === "string"
        ? next
        : JSON.stringify(next) === JSON.stringify(sorting)
          ? undefined
          : changeAsAgent(setSorting, next, "sort")
    return {
      kind: "select",
      element: phone ? phoneHeadRef.current : headRef.current,
      label: `Sort ${plural}`,
      value: sorting.map((s) => sortLabel(s.id, s.desc)),
      items: sortable.flatMap((c) => [sortLabel(c.id, false), sortLabel(c.id, true)]),
      multiple: true,
      disabled,
      actions: {
        select: (wanted: unknown) => apply(parse([wanted])),
        setValue: (wanted: unknown) => apply(parse(Array.isArray(wanted) ? wanted : [wanted])),
        clear: () => apply(props.defaultSorting ?? []),
      },
    }
  })

  useAgentControl(() => {
    if (!selectable) return null
    const shown = virtualize ? matching : pageSelectable
    const pool = selectableRows(table.getCoreRowModel().rows)
    const pick = (wanted: unknown[]): string[] | string => {
      const ids: string[] = []
      for (const one of wanted.flat()) {
        const want = String(one ?? "").trim().toLowerCase()
        if (want === "all") {
          ids.push(...matching.map((r) => r.id))
          continue
        }
        const row = pool.find((r) => r.id.toLowerCase() === want || rowLabel(r).toLowerCase() === want)
        if (!row) return `No ${noun.singular} "${String(one)}". On this page: ${shown.map(rowLabel).join(", ")}.`
        ids.push(row.id)
      }
      return ids
    }
    const apply = (next: RowSelectionState) => changeAsAgent(setSelection, next, "select")
    return {
      kind: "checkbox-group",
      element: phone ? phoneListRef.current : bodyRef.current,
      label: `Select ${plural}`,
      value: pool.filter((r) => r.getIsSelected()).map(rowLabel),
      items: shown.map(rowLabel),
      multiple: true,
      disabled,
      actions: {
        select: (...wanted: unknown[]) => {
          const ids = pick(wanted)
          if (typeof ids === "string") return ids
          const fresh = ids.filter((id) => !rowSelection[id])
          if (!fresh.length) return undefined
          return apply({ ...rowSelection, ...Object.fromEntries(fresh.map((id) => [id, true])) })
        },
        setValue: (...wanted: unknown[]) => {
          const ids = pick(wanted)
          return typeof ids === "string" ? ids : apply(Object.fromEntries(ids.map((id) => [id, true])))
        },
        clear: () => (selectedCount ? apply({}) : undefined),
      },
    }
  })

  /* ---- announcements ---- */
  const sortSpeech = sorting
    .map((s, i) => `${i ? "then " : "Sorted by "}${labelOf(table.getColumn(s.id) ?? ({ id: s.id, columnDef: {} } as Column<T, unknown>))}, ${s.desc ? "descending" : "ascending"}`)
    .join(", ")
  const announcement = touched && !loading && !error ? [sortSpeech, `${total.toLocaleString()} ${total === 1 ? noun.singular : plural}.`].filter(Boolean).join(". ") : ""

  /* ---- scroll container ---- */
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const [scroller, setScroller] = React.useState<HTMLDivElement | null>(null)
  const containerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollRef.current = node
      if (virtualize) setScroller(node)
    },
    [virtualize]
  )
  React.useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    // An attribute rather than state, so scrolling never renders the table again.
    const onScroll = () => node.toggleAttribute("data-scrolled", node.scrollLeft > 0)
    onScroll()
    node.addEventListener("scroll", onScroll, { passive: true })
    // Messages and expanded panels span every column, so they size to what is in view, not to the table.
    const fit = () => node.style.setProperty("--data-table-viewport", `${node.clientWidth}px`)
    fit()
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit)
    observer?.observe(node)
    return () => {
      node.removeEventListener("scroll", onScroll)
      observer?.disconnect()
    }
  }, [phone])

  /* ---- opening a row ---- */
  const openRef = React.useRef<(id: string, event?: Event) => void>(() => {})
  openRef.current = (id, event) => {
    const row = table.getCoreRowModel().rowsById[id] ?? table.getRowModel().rowsById[id]
    if (!row) return
    if (onRowOpen) onRowOpen(row.original, personDetails("open", event))
    else setSheet(id)
  }
  const openRow = React.useCallback((id: string, event?: Event) => openRef.current(id, event), [])
  const onRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement
    // Clicks bubble out of portalled menus too, and a drag to select text is not a click on the row.
    if (!event.currentTarget.contains(target) || target.closest(INTERACTIVE)) return
    if (window.getSelection?.()?.toString()) return
    const id = event.currentTarget.getAttribute("data-row-id")
    if (id) openRow(id, event.nativeEvent)
  }

  /* ---- grid keyboard ---- */
  const gridRef = React.useRef<HTMLTableElement>(null)
  const active = React.useRef<Position>({ row: 1, cell: 0, stop: 0 })
  React.useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    rove(grid, active.current)
    // Retry took focus to the grid while the rows loaded; hand it back to the cell it left.
    if (document.activeElement === grid && !loading && !error && pageRows.length) focusAt(grid, active.current)
  })
  const retry = () => {
    gridRef.current?.focus()
    onRetry?.()
  }
  const onGridFocus = (event: React.FocusEvent<HTMLTableElement>) => {
    const grid = gridRef.current
    if (!grid || !grid.contains(event.target)) return
    const p = positionOf(grid, event.target as HTMLElement)
    if (p) {
      active.current = p
      rove(grid, p)
    }
  }
  const onGridKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    const grid = gridRef.current
    const target = event.target as HTMLElement
    // React sends events from portalled menus through here too; only the grid's own count.
    if (!grid || !grid.contains(target) || event.altKey || event.metaKey) return
    if (target.getAttribute("role") === "separator" && (event.key === "ArrowLeft" || event.key === "ArrowRight")) return
    if (event.key === "Enter" && !target.closest(INTERACTIVE)) {
      const id = target.closest("tbody > tr")?.getAttribute("data-row-id")
      if (id) {
        event.preventDefault()
        openRow(id, event.nativeEvent)
      }
      return
    }
    if (event.key === " " && !target.closest("button, a, input, [role='checkbox']")) {
      const id = target.closest("tr")?.getAttribute("data-row-id")
      const row = id ? table.getRow(id) : undefined
      if (row?.getCanSelect()) {
        event.preventDefault()
        row.toggleSelected()
      }
      return
    }
    const from = positionOf(grid, target)
    if (!from) return
    const to = moveFocus(grid, from, event.key, event.ctrlKey)
    if (!to) return
    event.preventDefault()
    event.stopPropagation()
    active.current = to
    rove(grid, to)
    focusAt(grid, to)
  }

  /* ---- resize and reorder ---- */
  const drag = React.useRef<{ id: string; x: number; width: number } | null>(null)
  const dragColumn = React.useRef<string | null>(null)
  const setWidth = (id: string, width: number) => {
    const prev = latest.current.columnSizing
    const next = Math.max(48, Math.round(width))
    if (prev[id] !== next) changeSizing({ ...prev, [id]: next }, personDetails("resize"))
  }
  const resizeBy = (id: string, delta: number) => {
    const th = gridRef.current?.querySelector<HTMLElement>(`th[data-column="${CSS.escape(id)}"]`)
    setWidth(id, (widthOf(id) || th?.getBoundingClientRect().width || FLEX_MIN) + delta)
  }
  /** Moves a column to the other side of `target`, its visible neighbour, wherever hidden columns sit. */
  const moveColumn = (id: string, target: string) => {
    const center = columnOrder.filter((c) => !pinned.left.includes(c))
    const from = center.indexOf(id)
    const at = center.indexOf(target)
    if (from < 0 || at < 0 || from === at) return
    center.splice(from, 1)
    center.splice(center.indexOf(target) + (from < at ? 1 : 0), 0, id)
    changeOrder([...pinned.left.filter((c) => userIds.includes(c)), ...center], personDetails("move"))
  }
  const centerIds = columnOrder.filter((c) => !pinned.left.includes(c) && table.getColumn(c)?.getIsVisible())

  /* ---- rows ---- */
  const uid = React.useId()
  const actionsRef = React.useRef(rowActions)
  actionsRef.current = rowActions
  const drawRef = React.useRef<(row: Row<T>, index: number) => React.ReactNode>(() => null)
  const drawRow = React.useCallback((row: Row<T>, index: number) => drawRef.current(row, index), [])
  // Everything a row draws from besides itself. While it holds, a row renders again only when its own data,
  // place, selection or expansion changes.
  const view = React.useMemo(
    () => ({}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allColumns, fullOrder.join(), columnVisibility, sizes, disabled, hasAgent, density, virtualize, selectable, renderSubComponent, Boolean(onRowOpen), noun.singular, getSubRows]
  )

  /* ---- rendering helpers ---- */
  const rowContext = (row: Row<T>, inert: boolean): RowContextValue => ({ id: row.id, inert, open: openRow })
  const sheetRow = sheet ? table.getCoreRowModel().rowsById[sheet] ?? table.getRowModel().rowsById[sheet] : undefined
  const stickyStyle = (id: string): React.CSSProperties | undefined =>
    leftOffsets.has(id) ? { left: leftOffsets.get(id) } : undefined
  const pinClass = (id: string, head: boolean) =>
    leftOffsets.has(id) &&
    cn(
      "sticky",
      head ? "z-[3]" : "z-[1]",
      id === lastPinned &&
        "group-data-[scrolled]/dt:shadow-[8px_0_8px_-8px_rgb(0_0_0/0.18)] group-data-[scrolled]/dt:[clip-path:inset(0_-12px_0_0)]"
    )

  const emptyContext: DataTableEmptyContext = {
    query: globalFilter,
    filter: facetValue,
    filtered: data.length > 0 || Boolean(globalFilter || columnFilters.length),
    clear: clearFilters,
  }
  // Rows already on screen stay, dimmed, while the next ones load.
  const stale = loading && pageRows.length > 0
  const status: "loading" | "error" | "empty" | "rows" = stale
    ? "rows"
    : loading
      ? "loading"
      : error
        ? "error"
        : pageRows.length === 0
          ? "empty"
          : "rows"
  // Dims over the fast token and returns at once, so the new rows never fade in.
  const dim =
    "data-[stale]:opacity-60 data-[stale]:transition-opacity data-[stale]:duration-[var(--motion-duration-fast,150ms)] data-[stale]:ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]"

  const stateBlock = (() => {
    if (status === "error")
      return (
        <div role="alert" data-slot="data-table-state" data-state="error" className="grid h-[var(--data-table-state-height)] place-content-center justify-items-center gap-3 text-center">
          <p className="m-0 text-sm">{error === true ? `Couldn't load ${plural}.` : error}</p>
          {onRetry && (
            <Button variant="outline" size="sm" className="h-8" onClick={retry}>
              Try again
            </Button>
          )}
        </div>
      )
    if (status !== "empty") return null
    if (emptyState) return emptyState(emptyContext)
    const message = globalFilter
      ? `No ${plural} match “${globalFilter}”`
      : facetValue
        ? `No ${String(facetValue).toLowerCase()} ${plural}`
        : `No ${plural} yet`
    return (
      <div data-slot="data-table-state" data-state="empty" className="grid h-[var(--data-table-state-height)] place-content-center justify-items-center gap-3 text-center">
        <p className="m-0 text-sm">{message}</p>
        {(globalFilter || columnFilters.length > 0) && (
          <Button variant="outline" size="sm" className="h-8" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  })()

  const chips = (layout: "desktop" | "phone") =>
    facet && facetColumn ? (
      <ToggleGroup
        data-slot="data-table-filters"
        aria-label={`Filter ${plural} by ${labelOf(facetColumn)}`}
        value={[facetValue ?? ALL]}
        disabled={disabled}
        onValueChange={(next, details) => {
          if (next.length) setFacet(String(next[next.length - 1]), details as DataTableChangeDetails)
        }}
        className={cn(
          "justify-start",
          layout === "desktop" ? "gap-0.5" : "-mx-4 flex-nowrap gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]"
        )}
      >
        {[{ value: ALL, label: "All", count: undefined } as DataTableFacetOption, ...facetOptions].map((option) => {
          const count = option.value === ALL ? undefined : manual ? option.count : (facetCounts?.get(option.value) ?? 0)
          return (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className={cn(
                "shrink-0 gap-1.5 rounded-full font-normal",
                layout === "desktop"
                  ? "h-7 border-0 px-2.5 text-[12.5px] text-muted-foreground hover:bg-transparent hover:text-foreground data-[pressed]:bg-secondary data-[pressed]:font-medium data-[pressed]:text-foreground"
                  : "h-[34px] border-border px-3.5 text-sm data-[pressed]:border-primary data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
              )}
            >
              {option.label ?? option.value}
              {count !== undefined && " "}
              {count !== undefined && <span className="font-normal tabular-nums">{count}</span>}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    ) : null

  const search = (layout: "desktop" | "phone") => (
    <div data-slot="data-table-search" className={cn("relative", layout === "desktop" ? "w-[220px]" : "w-full")}>
      <Search
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          layout === "desktop" ? "left-2.5 h-4 w-4" : "left-[13px] h-[18px] w-[18px]"
        )}
      />
      <Input
        type="search"
        aria-label={`Search ${plural}`}
        placeholder={`Search ${plural}`}
        value={draft ?? globalFilter}
        disabled={disabled}
        onValueChange={(value, details) => typeSearch(value, details as unknown as DataTableChangeDetails)}
        className={cn(
          "[&::-webkit-search-cancel-button]:hidden",
          layout === "desktop"
            ? "h-8 pl-8 text-[13px] md:text-[13px]"
            : "h-[42px] rounded-xl border-0 bg-muted pl-[38px] text-base md:text-base"
        )}
      />
    </div>
  )

  const titleText = props.title === undefined ? `${total.toLocaleString()} ${total === 1 ? noun.singular : plural}` : props.title

  const sheetPart = (
    <Drawer
      open={sheetRow !== undefined}
      onOpenChange={(open) => {
        if (!open) setSheet(null)
      }}
      swipeDirection={phone ? "down" : "right"}
    >
      <DrawerContent
        side={phone ? "bottom" : "right"}
        data-slot="data-table-sheet"
        className={cn("gap-0 p-0", phone ? "max-h-[85vh] rounded-t-[22px]" : "w-[380px] max-w-[90vw]")}
      >
        {sheetRow && (
          <RowContext.Provider value={rowContext(sheetRow, true)}>
            <div className="flex items-center gap-1 px-5 pb-3 pt-5">
              <DrawerTitle className="mr-auto text-[17px] font-semibold">{rowLabel(sheetRow)}</DrawerTitle>
              {rowActions && sheetRow.depth === 0 && (
                <Menu>
                  <MenuTrigger
                    aria-label={`Actions for ${rowLabel(sheetRow)}`}
                    disabled={disabled}
                    data-slot="data-table-sheet-actions"
                    className={cn("border-0 bg-transparent p-0 text-muted-foreground", phone ? "h-11 w-11" : "h-8 w-8")}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </MenuTrigger>
                  <MenuContent align="end" className="min-w-[180px]">
                    {rowActions(sheetRow.original)}
                  </MenuContent>
                </Menu>
              )}
              <DrawerClose
                aria-label="Close"
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  phone ? "-mr-2.5 h-11 w-11" : "h-8 w-8"
                )}
              >
                <X className="h-4 w-4" />
              </DrawerClose>
            </div>
            <dl className="m-0 px-5 pb-6">
              {sheetRow
                .getVisibleCells()
                .filter((cell) => !SYSTEM.has(cell.column.id))
                .map((cell) => (
                  <div key={cell.id} className="grid min-h-12 grid-cols-[150px_1fr] items-center gap-3 border-t py-2">
                    <dt className="text-[13px] text-muted-foreground">{labelOf(cell.column)}</dt>
                    <dd className="m-0 min-w-0 text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</dd>
                  </div>
                ))}
            </dl>
          </RowContext.Provider>
        )}
      </DrawerContent>
    </Drawer>
  )

  const live = (
    <div role="status" aria-live="polite" className="sr-only">
      {announcement}
    </div>
  )

  /* ---------------- phone ---------------- */
  if (phone) {
    const byRole = (role: "title" | "value" | "meta") =>
      visibleUser
        .filter((c) => c.columnDef.meta?.phone === role)
        .sort((a, b) => (a.columnDef.meta?.phoneOrder ?? 0) - (b.columnDef.meta?.phoneOrder ?? 0))
    const currentSort = sorting[0] ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}` : ""
    const currentLabel = phoneSorts.find((s) => s.key === currentSort)?.label ?? "Sort"
    const cellOf = (row: Row<T>, column: Column<T, unknown>) => {
      const cell = row.getAllCells().find((c) => c.column.id === column.id)
      return cell ? flexRender(column.columnDef.meta?.phoneCell ?? cell.column.columnDef.cell, cell.getContext()) : null
    }
    // Selecting is a mode on phone: there is no room for a checkbox column, and a tap already opens the row.
    const choosing = selectable && status === "rows" && (picking || selectedCount > 0)
    const finish = () => {
      setPicking(false)
      if (selectedCount) clearSelection()
    }
    const endPress = () => {
      if (press.current) window.clearTimeout(press.current.timer)
    }
    const startPress = (event: React.PointerEvent, row: Row<T>) => {
      // A long-press whose click never came must not swallow this one.
      press.current = null
      if (!selectable || choosing || disabled || event.pointerType === "mouse" || !row.getCanSelect()) return
      const held = { fired: false, timer: 0 }
      held.timer = window.setTimeout(() => {
        held.fired = true
        setPicking(true)
        changeSelection({ ...rowSelection, [row.id]: true }, personDetails("long-press", event.nativeEvent))
      }, 500)
      press.current = held
    }
    return (
      <div
        ref={ref}
        data-slot="data-table"
        data-layout="phone"
        className={cn("flex flex-col", className)}
        style={{ "--data-table-max-height": maxHeight ? `${maxHeight}px` : "none" } as React.CSSProperties}
      >
        <div ref={phoneHeadRef} data-slot="data-table-heading" className="flex items-baseline justify-between gap-3">
          {titleText !== null && <h2 className="m-0 text-[28px] font-semibold tracking-[-0.015em]">{titleText}</h2>}
          {selectable && status === "rows" && !choosing && (
            <button
              type="button"
              disabled={disabled}
              data-slot="data-table-select-mode"
              onClick={() => setPicking(true)}
              className="ml-auto h-11 cursor-pointer text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-50"
            >
              Select
            </button>
          )}
          {phoneSorts.length > 0 && (
            <span data-agent-hidden={hasAgent ? "" : undefined}>
              <Menu>
                <MenuTrigger
                  disabled={disabled}
                  aria-label={`Sort ${plural}: ${currentLabel}`}
                  className="h-11 gap-1 border-0 bg-transparent px-0 text-[15px] font-normal text-muted-foreground hover:bg-transparent hover:text-foreground data-[popup-open]:bg-transparent"
                >
                  {currentLabel}
                  <ArrowUpDown aria-hidden className="h-4 w-4" />
                </MenuTrigger>
                <MenuContent align="end">
                  <MenuRadioGroup
                    value={currentSort}
                    onValueChange={(key) => {
                      const pick = phoneSorts.find((s) => s.key === key)
                      if (pick) setSorting([{ id: pick.id, desc: pick.desc }], personDetails("sort"))
                    }}
                  >
                    {phoneSorts.map((s) => (
                      <MenuRadioItem key={s.key} value={s.key} className="min-h-11 text-[15px]">
                        {s.label}
                      </MenuRadioItem>
                    ))}
                  </MenuRadioGroup>
                </MenuContent>
              </Menu>
            </span>
          )}
        </div>
        {choosing ? (
          <div
            data-slot="data-table-selection-bar"
            className="mt-3 flex min-h-[42px] items-center gap-2 rounded-xl px-3.5 text-[15px] [background-color:color-mix(in_oklab,var(--secondary)_70%,var(--card))]"
          >
            <span className="mr-auto whitespace-nowrap">
              <b className="font-semibold tabular-nums">{shownCount.toLocaleString()}</b> selected
            </span>
            {shownCount > 0 && selectionActions?.(picked.rows, clearSelection, selection)}
            <Button variant="ghost" className="-mr-2 h-11 px-3 text-[15px]" disabled={disabled} onClick={finish}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-3">{search("phone")}</div>
            {facet && <div className="mt-3">{chips("phone")}</div>}
            {props.toolbar && <div className="mt-3 flex flex-wrap items-center gap-2">{props.toolbar}</div>}
          </>
        )}
        {live}
        {status === "rows" ? (
          <ul
            ref={phoneListRef}
            data-slot="data-table-phone-list"
            aria-label={capitalize(plural)}
            aria-busy={loading || undefined}
            data-stale={stale || undefined}
            className={cn("m-0 mt-2 max-h-[var(--data-table-max-height)] list-none overflow-y-auto overscroll-contain p-0 [-webkit-overflow-scrolling:touch]", dim)}
          >
            {pageRows
              .filter((row) => row.depth === 0)
              .map((row) => (
                <li key={row.id} className="border-b">
                  <RowContext.Provider value={rowContext(row, true)}>
                    <button
                      type="button"
                      role={choosing ? "checkbox" : undefined}
                      aria-checked={choosing ? row.getIsSelected() : undefined}
                      disabled={disabled || (choosing && !row.getCanSelect())}
                      data-slot="data-table-phone-row"
                      onPointerDown={(event) => startPress(event, row)}
                      onPointerUp={endPress}
                      onPointerLeave={endPress}
                      onPointerCancel={endPress}
                      onContextMenu={(event) => {
                        // Android opens a context menu on long-press, which would cut selection short.
                        if (selectable && (event.nativeEvent as PointerEvent).pointerType !== "mouse") event.preventDefault()
                      }}
                      onClick={(event) => {
                        if (press.current?.fired) {
                          press.current = null
                          return
                        }
                        if (choosing) row.toggleSelected()
                        else openRow(row.id, event.nativeEvent)
                      }}
                      className={cn(
                        "grid w-full cursor-pointer select-none grid-cols-[1fr_auto] gap-x-3 gap-y-[3px] py-[13px] text-left [-webkit-touch-callout:none]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        choosing && "grid-cols-[auto_1fr_auto]"
                      )}
                    >
                      {choosing && (
                        <span
                          aria-hidden
                          data-checked={row.getIsSelected() ? "" : undefined}
                          className="row-span-2 inline-flex h-5 w-5 items-center justify-center self-center rounded-[5px] border border-primary data-[checked]:bg-primary data-[checked]:text-primary-foreground"
                        >
                          {row.getIsSelected() && (
                            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M3.5 8.5l3 3 6-7" />
                            </svg>
                          )}
                        </span>
                      )}
                      <span className="min-w-0 truncate text-base font-medium">
                        {byRole("title").map((c) => (
                          <React.Fragment key={c.id}>{cellOf(row, c)}</React.Fragment>
                        ))}
                      </span>
                      <span className="text-right text-base tabular-nums">
                        {byRole("value").map((c) => (
                          <React.Fragment key={c.id}>{cellOf(row, c)}</React.Fragment>
                        ))}
                      </span>
                      <span className="col-span-2 col-end-[-1] flex min-w-0 flex-wrap items-center gap-x-2 text-[13px] text-muted-foreground">
                        {byRole("meta").map((c) => (
                          <span key={c.id} className="inline-flex items-center">
                            {cellOf(row, c)}
                          </span>
                        ))}
                      </span>
                    </button>
                  </RowContext.Provider>
                </li>
              ))}
          </ul>
        ) : status === "loading" ? (
          <ul aria-busy className="m-0 mt-2 list-none p-0" aria-label={capitalize(plural)}>
            {Array.from({ length: Math.min(pagination.pageSize, 8) }, (_, i) => (
              <li key={i} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 border-b py-[15px]">
                <Skeleton className="h-4" style={{ width: `${40 + seed(i) * 30}%` }} />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="col-span-2 h-3" style={{ width: `${50 + seed(i + 3) * 30}%` }} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-[60px] text-center text-[15px] text-muted-foreground">
            {status === "error" || emptyState ? stateBlock : globalFilter ? `No ${plural} match` : (stateBlock ?? null)}
          </div>
        )}
        {status === "rows" && !virtualize && pageCount > 1 && (
          <div data-slot="data-table-footer" className="mt-4 flex justify-center">
            <Pagination
              aria-label={`Pages of ${plural}`}
              variant="compact"
              size="lg"
              count={pageCount}
              page={pagination.pageIndex + 1}
              disabled={disabled}
              onPageChange={(page, details) => changePagination({ ...pagination, pageIndex: page - 1 }, details)}
            />
          </div>
        )}
        {sheetPart}
      </div>
    )
  }

  /* ---------------- desktop ---------------- */
  const headerCell = (header: Header<T, unknown>) => {
    const column = header.column
    const id = column.id
    const meta = column.columnDef.meta
    const width = widthOf(id)
    const sorted = column.getIsSorted()
    const index = column.getSortIndex()
    const label = labelOf(column)
    const draggable = reorderable && !SYSTEM.has(id) && !leftOffsets.has(id)
    const labelId = `${uid}-h${header.index}`
    const content =
      id === SELECT ? (
        pageSelectable.length > 0 && status === "rows" ? (
          <span data-agent-hidden={hasAgent ? "" : undefined} className="inline-flex">
            <Checkbox
              // A virtualized table has one page, so this box covers every row.
              aria-label={virtualize ? "Select all" : "Select page"}
              checked={pageAll}
              indeterminate={!pageAll && pageSome}
              disabled={disabled}
              className={indeterminate}
              onCheckedChange={(on) => table.toggleAllPageRowsSelected(Boolean(on))}
            />
          </span>
        ) : null
      ) : SYSTEM.has(id) ? (
        id === ACTIONS ? <span className="sr-only">Actions</span> : null
      ) : column.getCanSort() ? (
        <button
          type="button"
          data-slot="data-table-sort"
          data-agent-part={hasAgent ? "" : undefined}
          disabled={disabled}
          onClick={column.getToggleSortingHandler()}
          className={cn(
            "group/sort -mx-0.5 inline-flex h-[26px] max-w-full cursor-pointer items-center gap-0.5 rounded-md hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            meta?.numeric && "flex-row-reverse",
            sorted && "text-foreground"
          )}
        >
          <span className="truncate">{flexRender(column.columnDef.header, header.getContext())}</span>
          <span
            aria-hidden
            className={cn(
              "inline-grid w-3.5 shrink-0 place-items-center opacity-0 transition-opacity duration-100 group-hover/sort:opacity-100 motion-reduce:transition-none",
              // The arrow hangs into the cell padding, so a short header is not cut to make room for it.
              meta?.numeric ? "-ml-2" : "-mr-2",
              sorted && "opacity-100"
            )}
          >
            {sorted === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          </span>
          {sorted && sorting.length > 1 && <sup className="-ml-0.5 text-[9px] text-muted-foreground">{index + 1}</sup>}
        </button>
      ) : (
        flexRender(column.columnDef.header, header.getContext())
      )
    return (
      <TableHead
        key={header.id}
        data-column={id}
        numeric={meta?.numeric}
        // Named by its label alone, so the resize handle's width is not read with it.
        aria-labelledby={SYSTEM.has(id) ? undefined : labelId}
        aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined}
        style={stickyStyle(id)}
        draggable={draggable && !disabled}
        onDragStart={
          draggable
            ? (event) => {
                if (drag.current) return event.preventDefault()
                dragColumn.current = id
                event.dataTransfer.effectAllowed = "move"
                event.dataTransfer.setData("text/plain", id)
              }
            : undefined
        }
        onDragOver={draggable ? (event) => dragColumn.current && event.preventDefault() : undefined}
        onDrop={
          draggable
            ? (event) => {
                event.preventDefault()
                if (dragColumn.current && dragColumn.current !== id) moveColumn(dragColumn.current, id)
                dragColumn.current = null
              }
            : undefined
        }
        onDragEnd={() => (dragColumn.current = null)}
        className={cn(
          "group/th sticky top-0 z-[2] overflow-hidden text-ellipsis bg-card",
          pinClass(id, true),
          id === SELECT && "pr-0",
          id === EXPAND && "p-0",
          width === 0 && "min-w-[140px]"
        )}
      >
        {SYSTEM.has(id) ? content : <span id={labelId} className="contents">{content}</span>}
        {resizable && !SYSTEM.has(id) && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={`Resize ${label}`}
            aria-valuemin={48}
            // An unsized column reports the width it rendered at, since a focusable separator needs a value.
            aria-valuenow={Math.round(width) || undefined}
            ref={(el) => {
              if (el && !width) el.setAttribute("aria-valuenow", String(Math.round(el.parentElement?.getBoundingClientRect().width ?? 0)))
            }}
            data-slot="data-table-resize"
            tabIndex={-1}
            onPointerDown={(event) => {
              event.preventDefault()
              event.stopPropagation()
              const th = event.currentTarget.parentElement
              drag.current = { id, x: event.clientX, width: th?.getBoundingClientRect().width ?? width }
              event.currentTarget.setPointerCapture?.(event.pointerId)
            }}
            onPointerMove={(event) => {
              const d = drag.current
              if (!d) return
              setWidth(d.id, d.width + event.clientX - d.x)
            }}
            onPointerUp={() => (drag.current = null)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
              event.preventDefault()
              resizeBy(id, event.key === "ArrowLeft" ? -16 : 16)
            }}
            className={cn(
              "absolute right-0 top-0 h-full w-2 cursor-col-resize touch-none select-none opacity-0",
              "after:absolute after:right-0.5 after:top-1/4 after:h-1/2 after:w-px after:bg-border after:content-['']",
              "hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:after:w-0.5 focus-visible:after:bg-ring group-hover/th:opacity-100"
            )}
          />
        )}
      </TableHead>
    )
  }

  const bodyCell = (cell: Cell<T, unknown>, row: Row<T>) => {
    const id = cell.column.id
    const meta = cell.column.columnDef.meta
    const sub = row.depth > 0
    let content: React.ReactNode = null
    if (id === SELECT) {
      content = row.getCanSelect() ? (
        <span data-agent-hidden={hasAgent ? "" : undefined} className="inline-flex">
          <Checkbox
            aria-label={`Select ${rowLabel(row)}`}
            checked={row.getIsSelected()}
            disabled={disabled}
            onCheckedChange={(on) => row.toggleSelected(Boolean(on))}
          />
        </span>
      ) : null
    } else if (id === EXPAND) {
      content = row.getCanExpand() ? (
        <button
          type="button"
          aria-label={row.getIsExpanded() ? "Hide details" : "Show details"}
          aria-expanded={row.getIsExpanded()}
          disabled={disabled}
          onClick={row.getToggleExpandedHandler()}
          className={cn(
            "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
            "transition-transform [transition-duration:160ms] aria-expanded:rotate-90 motion-reduce:transition-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null
    } else if (id === ACTIONS) {
      content =
        rowActions && !sub ? (
          <RowMenu label={`Actions for ${rowLabel(row)}`} disabled={disabled} items={() => actionsRef.current?.(row.original)} />
        ) : null
    } else if (!sub || cell.getValue() != null) {
      content = flexRender(cell.column.columnDef.cell, cell.getContext())
    }
    return (
      <TableCell
        key={cell.id}
        numeric={meta?.numeric}
        style={stickyStyle(id)}
        className={cn(
          "overflow-hidden text-ellipsis",
          pinClass(id, false),
          id === SELECT && "pr-0",
          id === EXPAND && "p-0 text-center",
          id === ACTIONS && "px-1.5",
          sub && subRowCell,
          sub && row.getParentRow()?.subRows.slice(-1)[0] === row && "border-b"
        )}
      >
        {content}
      </TableCell>
    )
  }

  drawRef.current = (row: Row<T>, index: number) => (
    <>
      <TableRow
        data-row-id={row.id}
        data-depth={row.depth || undefined}
        aria-rowindex={index}
        aria-selected={row.depth === 0 && selectable ? row.getIsSelected() : undefined}
        onClick={onRowOpen ? onRowClick : undefined}
        className={cn("group/row", rowBg, onRowOpen && "cursor-pointer")}
      >
        <RowContext.Provider value={rowContext(row, false)}>
          {row.getVisibleCells().map((cell) => bodyCell(cell, row))}
        </RowContext.Provider>
      </TableRow>
      {renderSubComponent && !virtualize && row.getIsExpanded() && (
        <TableRow data-slot="data-table-sub-row">
          <TableCell colSpan={row.getVisibleCells().length} className="h-auto whitespace-normal bg-[color:color-mix(in_oklab,var(--muted)_40%,transparent)] p-0">
            <div data-slot="data-table-sub-panel" className={inView}>
              {renderSubComponent(row)}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
  const bodyRow = (row: Row<T>, i: number) => (
    <DataTableBodyRow
      key={row.id}
      row={row}
      index={virtualize ? i + 2 : pagination.pageIndex * pagination.pageSize + i + 2}
      selected={row.getIsSelected()}
      expanded={row.getIsExpanded()}
      view={view}
      render={drawRow}
    />
  )

  const span = table.getVisibleLeafColumns().length
  const rowHeight = density === "compact" ? 36 : 48

  const skeletonRows = Array.from({ length: Math.min(pagination.pageSize, 10) }, (_, i) => (
    <TableRow key={`loading-${i}`} className="[&>td]:bg-card">
      {table.getVisibleLeafColumns().map((column, j) => (
        <TableCell
          key={column.id}
          numeric={column.columnDef.meta?.numeric}
          style={stickyStyle(column.id)}
          className={cn(pinClass(column.id, false), column.id === SELECT && "pr-0")}
        >
          {column.id === SELECT ? (
            <Skeleton className="h-4 w-4 rounded-[4px]" />
          ) : SYSTEM.has(column.id) ? null : (
            <Skeleton
              className={cn("h-3 max-w-full", column.columnDef.meta?.numeric && "ml-auto")}
              style={{
                width: `${Math.round((column.columnDef.meta?.numeric ? 50 + seed(i * 9 + j) * 40 : 60 + seed(i * 7 + j) * 60) / 1.4)}%`,
              }}
            />
          )}
        </TableCell>
      ))}
    </TableRow>
  ))

  const minWidth = table
    .getVisibleLeafColumns()
    .reduce((sum, column) => sum + (widthOf(column.id) || FLEX_MIN), 0)

  const from = total ? pagination.pageIndex * pagination.pageSize + 1 : 0
  const to = Math.min(total, (pagination.pageIndex + 1) * pagination.pageSize)

  return (
    <div
      ref={ref}
      data-slot="data-table"
      className={cn("flex flex-col gap-3.5", className)}
      style={
        {
          "--data-table-max-height": maxHeight ? `${maxHeight}px` : "none",
          // A message taller than the scroll area would centre itself out of view; 44px leaves room for the header.
          "--data-table-state-height": maxHeight ? `${Math.min(300, Math.max(120, maxHeight - 44))}px` : "300px",
        } as React.CSSProperties
      }
    >
      {titleText !== null && (
        <h2 data-slot="data-table-title" className="m-0 text-xl font-semibold tracking-[-0.015em]">
          {titleText}
        </h2>
      )}
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <div data-slot="data-table-toolbar" className="flex h-14 items-center gap-2 border-b px-3">
          {search("desktop")}
          {chips("desktop")}
          {props.toolbar}
          <span className="flex-1" />
          <Menu>
            <MenuTrigger
              aria-label="Columns"
              disabled={disabled}
              data-slot="data-table-columns"
              className="h-8 w-8 border-0 bg-transparent p-0 text-muted-foreground hover:text-foreground"
            >
              <Columns3 className="h-4 w-4" />
            </MenuTrigger>
            <MenuContent align="end" className="min-w-[180px]">
              {userColumns
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <MenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    closeOnClick={false}
                    onCheckedChange={(on) => column.toggleVisibility(Boolean(on))}
                    className="group gap-2.5 pl-2 text-[13px] [&>span.absolute]:hidden"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-primary group-data-[checked]:bg-primary group-data-[checked]:text-primary-foreground"
                    >
                      <svg viewBox="0 0 16 16" className="hidden h-3 w-3 group-data-[checked]:block" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M3.5 8.5l3 3 6-7" />
                      </svg>
                    </span>
                    {labelOf(column)}
                  </MenuCheckboxItem>
                ))}
              {reorderable && centerIds.length > 1 && (
                <>
                  <MenuSeparator />
                  <MenuSub>
                    <MenuSubTrigger className="text-[13px]">Move columns</MenuSubTrigger>
                    <MenuSubContent className="min-w-[200px]">
                      {centerIds.map((id, i) => {
                        const name = labelOf(table.getColumn(id)!)
                        return (
                          <React.Fragment key={id}>
                            <MenuItem closeOnClick={false} disabled={i === 0} onClick={() => moveColumn(id, centerIds[i - 1])} className="text-[13px]">
                              Move {name} left
                            </MenuItem>
                            <MenuItem
                              closeOnClick={false}
                              disabled={i === centerIds.length - 1}
                              onClick={() => moveColumn(id, centerIds[i + 1])}
                              className="text-[13px]"
                            >
                              Move {name} right
                            </MenuItem>
                          </React.Fragment>
                        )
                      })}
                    </MenuSubContent>
                  </MenuSub>
                </>
              )}
            </MenuContent>
          </Menu>
        </div>
        {selectedCount > 0 && (status === "rows" || status === "loading") && (
          <div
            data-slot="data-table-selection-bar"
            className="flex h-12 items-center gap-2 border-b px-3 text-[13px] [background-color:color-mix(in_oklab,var(--secondary)_70%,var(--card))]"
          >
            <span className="whitespace-nowrap">
              {selection.all && "All "}
              <b className="font-semibold tabular-nums">{shownCount.toLocaleString()}</b> selected
            </span>
            {picked.hidden.length > 0 && (
              <span className="whitespace-nowrap text-muted-foreground">
                <span aria-hidden>· </span>
                {picked.hidden.length.toLocaleString()} hidden by filters
              </span>
            )}
            {pageAll && !selection.all && (loadedAll ? picked.ids.length < matching.length : picked.ids.length < total) && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!loadedAll) return setEverything(true)
                  changeSelection(
                    { ...rowSelection, ...Object.fromEntries(matching.map((r) => [r.id, true])) },
                    personDetails("select-all")
                  )
                }}
                className="cursor-pointer underline decoration-[color:color-mix(in_oklab,currentColor_40%,transparent)] underline-offset-[3px] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Select all {(loadedAll ? matching.length : total).toLocaleString()}
              </button>
            )}
            <span className="flex-1" />
            {shownCount > 0 && selectionActions?.(picked.rows, clearSelection, selection)}
            <Button variant="ghost" size="sm" className="h-8" disabled={disabled} onClick={clearSelection}>
              Clear
            </Button>
          </div>
        )}
        {live}
        <Table
          ref={gridRef}
          role="grid"
          aria-label={typeof titleText === "string" ? titleText : capitalize(plural)}
          aria-rowcount={total + 1}
          aria-multiselectable={selectable || undefined}
          aria-busy={loading || undefined}
          tabIndex={-1}
          density={density}
          containerRef={containerRef}
          containerClassName="group/dt max-h-[var(--data-table-max-height)] overflow-auto overscroll-contain [scrollbar-width:thin]"
          className="table-fixed focus:outline-none"
          style={{ minWidth }}
          onFocus={onGridFocus}
          onKeyDown={onGridKeyDown}
        >
          <colgroup>
            {table.getVisibleLeafColumns().map((column) => {
              const width = widthOf(column.id)
              return <col key={column.id} style={width ? { width } : undefined} />
            })}
          </colgroup>
          <TableHeader ref={headRef}>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} aria-rowindex={1}>
                {group.headers.map((header) => headerCell(header))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody ref={bodyRef} data-stale={stale || undefined} className={cn("[&>tr:hover]:bg-transparent", dim)}>
            {status === "loading" ? (
              skeletonRows
            ) : status !== "rows" ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={span} className="h-auto border-0 p-0">
                  <div className={inView}>{stateBlock}</div>
                </TableCell>
              </TableRow>
            ) : virtualize ? (
              scroller && (
                <VirtualRows
                rows={pageRows}
                scroller={scroller}
                rowHeight={rowHeight}
                height={maxHeight ?? 452}
                span={span}
                render={bodyRow}
              />
              )
            ) : (
              pageRows.map((row, i) => bodyRow(row, i))
            )}
          </TableBody>
        </Table>
        {/* The pager stays while a page loads, so the button pressed keeps focus. */}
        {status === "rows" || (status === "loading" && total > 0 && !virtualize) ? (
          <div
            data-slot="data-table-footer"
            className="flex items-center gap-4 border-t px-3 py-2.5 text-[12.5px] text-muted-foreground"
          >
            {virtualize ? (
              <span data-slot="data-table-range" className="tabular-nums">
                {total.toLocaleString()} {total === 1 ? noun.singular : plural}
              </span>
            ) : (
              <>
                <span data-slot="data-table-range" className="whitespace-nowrap tabular-nums">
                  {from}–{to} of {total.toLocaleString()}
                </span>
                {pageSizes.length > 1 && (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    Rows
                    <Select
                      items={pageSizes.map((n) => ({ value: n, label: String(n) }))}
                      value={pagination.pageSize}
                      disabled={disabled}
                      onValueChange={(size, details) => {
                        if (size != null)
                          changePagination({ pageIndex: 0, pageSize: Number(size) }, details as unknown as DataTableChangeDetails)
                      }}
                    >
                      <SelectTrigger aria-label="Rows per page" className="h-7 w-auto gap-1 px-2 text-[12.5px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pageSizes.map((n) => (
                          <SelectItem key={n} value={n} className="text-[13px]">
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </span>
                )}
                <span className="flex-1" />
                <Pagination
                  aria-label={`Pages of ${plural}`}
                  count={pageCount}
                  page={pagination.pageIndex + 1}
                  disabled={disabled}
                  onPageChange={(page, details) => {
                    changePagination({ ...pagination, pageIndex: page - 1 }, details)
                    if (!details.isCanceled && scrollRef.current) scrollRef.current.scrollTop = 0
                  }}
                />
              </>
            )}
          </div>
        ) : status === "loading" ? (
          <div data-slot="data-table-footer" className="flex items-center gap-4 border-t px-3 py-2.5">
            <Skeleton className="h-3 w-[90px]" />
            <span className="flex-1" />
            <Skeleton className="h-3 w-[220px]" />
          </div>
        ) : null}
      </div>
      {sheetPart}
    </div>
  )
}

interface BodyRowProps {
  row: Row<any>
  /** The row's aria-rowindex. */
  index: number
  selected: boolean
  expanded: boolean
  view: object
  render: (row: Row<any>, index: number) => React.ReactNode
}

const DataTableBodyRow = React.memo(
  function DataTableBodyRow({ row, index, render }: BodyRowProps) {
    return <>{render(row, index)}</>
  },
  // A sort copies every row object, so a row is the same when its data and id are.
  (a, b) =>
    a.row.original === b.row.original &&
    a.row.id === b.row.id &&
    a.index === b.index &&
    a.selected === b.selected &&
    a.expanded === b.expanded &&
    a.view === b.view
)

const rowMenuClass = cn(
  "inline-flex h-7 w-7 items-center justify-center rounded-md border-0 bg-transparent p-0 text-muted-foreground opacity-0",
  "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "group-hover/row:opacity-100 group-focus-within/row:opacity-100 data-[popup-open]:opacity-100 focus-visible:opacity-100",
  "disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
)

/** A row's actions button. Its menu mounts the first time it opens, so a page of rows costs one button each. */
function RowMenu({ label, disabled, items }: { label: string; disabled: boolean; items: () => React.ReactNode }) {
  const [open, setOpen] = React.useState<boolean | null>(null)
  const trigger = React.useRef<HTMLButtonElement>(null)
  React.useLayoutEffect(() => {
    if (open) trigger.current?.focus()
  }, [open])
  if (open === null)
    return (
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={false}
        disabled={disabled}
        className={rowMenuClass}
        onClick={() => setOpen(true)}
      >
        <Ellipsis className="h-4 w-4" />
      </button>
    )
  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger ref={trigger} aria-label={label} disabled={disabled} className={rowMenuClass}>
        <Ellipsis className="h-4 w-4" />
      </MenuTrigger>
      <MenuContent align="end" className="min-w-[180px]">
        {items()}
      </MenuContent>
    </Menu>
  )
}

function VirtualRows<T>({
  rows,
  scroller,
  rowHeight,
  height,
  span,
  render,
}: {
  rows: Row<T>[]
  scroller: HTMLDivElement
  rowHeight: number
  /** The scroll area's height, for the first render before it is measured. */
  height: number
  span: number
  render: (row: Row<T>, index: number) => React.ReactNode
}) {
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scroller,
    // Sub rows are a fixed 34px; counting them as full rows would leave the spacers wrong.
    estimateSize: (i) => (rows[i]?.depth ? 34 : rowHeight),
    overscan: 8,
    initialRect: { width: 0, height },
  })
  // Sizes are cached per row, so a density change has to drop them.
  React.useEffect(() => {
    virtualizer.measure()
  }, [virtualizer, rowHeight])
  const items = virtualizer.getVirtualItems()
  const top = items[0]?.start ?? 0
  const bottom = virtualizer.getTotalSize() - (items[items.length - 1]?.end ?? 0)
  return (
    <>
      {top > 0 && (
        <tr data-spacer aria-hidden>
          <td colSpan={span} style={{ height: top, padding: 0, border: 0 }} />
        </tr>
      )}
      {items.map((item) => render(rows[item.index], item.index))}
      {bottom > 0 && (
        <tr data-spacer aria-hidden>
          <td colSpan={span} style={{ height: bottom, padding: 0, border: 0 }} />
        </tr>
      )}
    </>
  )
}

export type { TanstackTable as DataTableInstance }
export { DataTable, DataTableAction, DataTableRowTrigger }
