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
import { cn } from "@/lib/utils"
import { changeAsAgent, createAgentChangeDetails, isAgentChange, useAgentControl, useAgentState, useHasAgent } from "@/components/ui/agent"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/menu"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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
  /** Runs after any slice changes, with the whole state. */
  onStateChange?: (state: DataTableState, details: DataTableChangeDetails) => void

  /** The total on the server. Setting it hands sorting, filtering and paging to you. */
  rowCount?: number
  pageSizes?: number[]

  loading?: boolean
  /** `true` reads Couldn't load orders. A node replaces the message. */
  error?: boolean | React.ReactNode
  onRetry?: () => void
  emptyState?: (context: DataTableEmptyContext) => React.ReactNode

  density?: "comfortable" | "compact"
  /** Adds the checkbox column and the selection bar. */
  selectable?: boolean
  /** Buttons for the selection bar, given the selected rows. */
  selectionActions?: (rows: T[], clear: () => void) => React.ReactNode
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

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const resolve = <V,>(updater: Updater<V>, old: V): V =>
  typeof updater === "function" ? (updater as (old: V) => V)(old) : updater
const seed = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280
  return x - Math.floor(x)
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
  open: (id: string) => void
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
          if (!event.defaultPrevented) row.open(row.id)
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
  "[&>td]:bg-popover",
  "hover:[&>td]:[background-color:color-mix(in_oklab,var(--muted)_85%,var(--popover))]",
  "aria-selected:[&>td]:[background-color:color-mix(in_oklab,var(--secondary)_55%,var(--popover))]",
  "aria-selected:hover:[&>td]:[background-color:color-mix(in_oklab,var(--secondary)_75%,var(--popover))]"
)
const inView = "sticky left-0 w-[var(--data-table-viewport,100%)]"
const subRowCell =
  "h-[34px] border-b-0 text-[12.5px] text-muted-foreground [background-color:color-mix(in_oklab,var(--muted)_60%,var(--popover))]"
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
  latest.current = { sorting, columnFilters, globalFilter, pagination, rowSelection, columnVisibility }

  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [sizes, setSizes] = React.useState<Record<string, number>>({})
  const [order, setOrder] = React.useState<string[]>([])
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
    if (!details.isCanceled) backToFirstPage(details)
  }
  const setSearch: Change<string> = (next, details) => {
    changeSearch(next, details)
    if (!details.isCanceled) backToFirstPage(details)
  }

  /* ---- columns ---- */
  const expandable = Boolean(getSubRows || renderSubComponent)
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
      list.push(facet && id === facet.column && !column.filterFn ? { ...column, filterFn: "equalsString" } : column)
    }
    if (rowActions) list.push({ id: ACTIONS, size: SYSTEM_WIDTH[ACTIONS], enableSorting: false, enableHiding: false })
    return list
  }, [columns, selectable, expandable, rowActions, facet])

  const pinned = React.useMemo(() => {
    const left = [selectable && SELECT, expandable && EXPAND].filter(Boolean) as string[]
    for (const column of columns) {
      const id = column.id ?? (column as { accessorKey?: string }).accessorKey
      if (id && column.meta?.pin === "left") left.push(id)
    }
    return { left, right: rowActions ? [ACTIONS] : [] }
  }, [columns, selectable, expandable, rowActions])

  const columnOrder = order.length ? order : userIds
  // The system columns go in the order too, so every list of leaf columns matches the header.
  const fullOrder = [...pinned.left.filter((id) => SYSTEM.has(id)), ...columnOrder, ...pinned.right]

  const table = useReactTable<T>({
    data,
    columns: allColumns,
    getRowId:
      getRowId ??
      ((row, index, parent) => {
        const id = (row as { id?: unknown }).id
        return id != null ? String(id) : parent ? `${parent.id}.${index}` : String(index)
      }),
    getSubRows,
    getRowCanExpand: getRowCanExpand ?? (renderSubComponent ? () => true : (row) => row.subRows.length > 0),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
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
    onRowSelectionChange: (u) => changeSelection(resolve(u, latest.current.rowSelection), personDetails("select")),
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
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id])
  const selectedCount = selectedIds.length
  const clearSelection = () => changeSelection({}, personDetails("clear"))
  const selectedRows = selectedIds
    .map((id) => table.getCoreRowModel().rowsById[id]?.original)
    .filter((row): row is T => row !== undefined)
  const loadedAll = !manual || data.length >= total
  const matching = manual ? selectableRows(table.getCoreRowModel().rows) : selectableRows(table.getFilteredRowModel().rows)
  const pageSelectable = selectableRows(pageRows)
  const pageAll = pageSelectable.length > 0 && pageSelectable.every((r) => r.getIsSelected())
  const pageSome = pageSelectable.some((r) => r.getIsSelected())

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
    const apply = (next: RowSelectionState) => changeAsAgent(changeSelection, next, "select")
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
  const announcement = touched && !loading ? [sortSpeech, `${total.toLocaleString()} ${total === 1 ? noun.singular : plural}.`].filter(Boolean).join(". ") : ""

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

  /* ---- grid keyboard ---- */
  const gridRef = React.useRef<HTMLTableElement>(null)
  const active = React.useRef<Position>({ row: 1, cell: 0, stop: 0 })
  React.useLayoutEffect(() => {
    if (gridRef.current) rove(gridRef.current, active.current)
  })
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
  const resizeBy = (id: string, delta: number) =>
    setSizes((prev) => {
      const th = gridRef.current?.querySelector<HTMLElement>(`th[data-column="${CSS.escape(id)}"]`)
      const current = prev[id] ?? (widthOf(id) || th?.getBoundingClientRect().width || FLEX_MIN)
      return { ...prev, [id]: Math.max(48, Math.round(current + delta)) }
    })
  const moveColumn = (id: string, to: number) => {
    const center = columnOrder.filter((c) => !pinned.left.includes(c))
    const from = center.indexOf(id)
    if (from < 0 || to < 0 || to >= center.length) return
    center.splice(from, 1)
    center.splice(to, 0, id)
    setOrder([...pinned.left.filter((c) => userIds.includes(c)), ...center])
  }
  const centerIds = columnOrder.filter((c) => !pinned.left.includes(c) && table.getColumn(c)?.getIsVisible())

  /* ---- rendering helpers ---- */
  const rowContext = (row: Row<T>, inert: boolean): RowContextValue => ({ id: row.id, inert, open: setSheet })
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
  const status: "loading" | "error" | "empty" | "rows" = loading
    ? "loading"
    : error
      ? "error"
      : pageRows.length === 0
        ? "empty"
        : "rows"

  const stateBlock = (() => {
    if (status === "error")
      return (
        <div data-slot="data-table-state" data-state="error" className="grid h-[var(--data-table-state-height)] place-content-center justify-items-center gap-3 text-center">
          <p className="m-0 text-sm">{error === true ? `Couldn't load ${plural}.` : error}</p>
          {onRetry && (
            <Button variant="outline" size="sm" className="h-8" onClick={onRetry}>
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
              {count !== undefined && <span className="font-normal tabular-nums opacity-70">{count}</span>}
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
        value={globalFilter}
        disabled={disabled}
        onValueChange={(value, details) => setSearch(value, details as unknown as DataTableChangeDetails)}
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
      <div ref={ref} data-slot="data-table" data-layout="phone" className={cn("flex flex-col", className)}>
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
            className="mt-3 flex min-h-[42px] items-center gap-2 rounded-xl px-3.5 text-[15px] [background-color:color-mix(in_oklab,var(--secondary)_70%,var(--popover))]"
          >
            <span className="mr-auto whitespace-nowrap">
              <b className="font-semibold tabular-nums">{selectedCount}</b> selected
            </span>
            {selectedCount > 0 && selectionActions?.(selectedRows, clearSelection)}
            <Button variant="ghost" className="-mr-2 h-11 px-3 text-[15px]" disabled={disabled} onClick={finish}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-3">{search("phone")}</div>
            {facet && <div className="mt-3">{chips("phone")}</div>}
          </>
        )}
        {live}
        {status === "rows" ? (
          <ul
            ref={phoneListRef}
            data-slot="data-table-phone-list"
            aria-label={capitalize(plural)}
            aria-busy={loading || undefined}
            className="m-0 mt-2 list-none p-0"
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
                      onClick={() => {
                        if (press.current?.fired) {
                          press.current = null
                          return
                        }
                        if (choosing) row.toggleSelected()
                        else setSheet(row.id)
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
    const content =
      id === SELECT ? (
        pageSelectable.length > 0 && status === "rows" ? (
          <span data-agent-hidden={hasAgent ? "" : undefined} className="inline-flex">
            <Checkbox
              aria-label="Select page"
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
                if (dragColumn.current && dragColumn.current !== id) moveColumn(dragColumn.current, centerIds.indexOf(id))
                dragColumn.current = null
              }
            : undefined
        }
        onDragEnd={() => (dragColumn.current = null)}
        className={cn(
          "group/th sticky top-0 z-[2] overflow-hidden text-ellipsis bg-popover",
          pinClass(id, true),
          id === SELECT && "pr-0",
          id === EXPAND && "p-0",
          width === 0 && "min-w-[140px]"
        )}
      >
        {content}
        {resizable && !SYSTEM.has(id) && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={`Resize ${label}`}
            aria-valuenow={Math.round(width || 0) || undefined}
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
              const next = Math.max(48, Math.round(d.width + event.clientX - d.x))
              setSizes((prev) => (prev[d.id] === next ? prev : { ...prev, [d.id]: next }))
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
          <Menu>
            <MenuTrigger
              aria-label={`Actions for ${rowLabel(row)}`}
              disabled={disabled}
              className={cn(
                "h-7 w-7 border-0 bg-transparent p-0 text-muted-foreground opacity-0",
                "group-hover/row:opacity-100 group-focus-within/row:opacity-100 data-[popup-open]:opacity-100 focus-visible:opacity-100"
              )}
            >
              <Ellipsis className="h-4 w-4" />
            </MenuTrigger>
            <MenuContent align="end" className="min-w-[180px]">
              {rowActions(row.original)}
            </MenuContent>
          </Menu>
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

  const bodyRow = (row: Row<T>, index: number) => (
    <React.Fragment key={row.id}>
      <TableRow
        data-row-id={row.id}
        data-depth={row.depth || undefined}
        aria-rowindex={virtualize ? index + 2 : pagination.pageIndex * pagination.pageSize + index + 2}
        aria-selected={row.depth === 0 && selectable ? row.getIsSelected() : undefined}
        className={cn("group/row", rowBg)}
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
    </React.Fragment>
  )

  const span = table.getVisibleLeafColumns().length
  const rowHeight = density === "compact" ? 36 : 48

  const skeletonRows = Array.from({ length: Math.min(pagination.pageSize, 10) }, (_, i) => (
    <TableRow key={`loading-${i}`} className="[&>td]:bg-popover">
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
      <div className="overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-sm">
        {selectedCount > 0 && status === "rows" ? (
          <div
            data-slot="data-table-selection-bar"
            className="flex h-14 items-center gap-2 border-b px-3 text-[13px] [background-color:color-mix(in_oklab,var(--secondary)_70%,var(--popover))]"
          >
            <span>
              <b className="font-semibold tabular-nums">{selectedCount}</b> selected
            </span>
            {pageAll && loadedAll && selectedCount < matching.length && (
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  changeSelection(
                    { ...rowSelection, ...Object.fromEntries(matching.map((r) => [r.id, true])) },
                    personDetails("select-all")
                  )
                }
                className="cursor-pointer underline decoration-[color:color-mix(in_oklab,currentColor_40%,transparent)] underline-offset-[3px] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Select all {matching.length.toLocaleString()}
              </button>
            )}
            <span className="flex-1" />
            {selectionActions?.(selectedRows, clearSelection)}
            <Button variant="ghost" size="sm" className="h-8" disabled={disabled} onClick={clearSelection}>
              Clear
            </Button>
          </div>
        ) : (
          <div data-slot="data-table-toolbar" className="flex h-14 items-center gap-2 border-b px-3">
            {search("desktop")}
            {chips("desktop")}
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
                              <MenuItem closeOnClick={false} disabled={i === 0} onClick={() => moveColumn(id, i - 1)} className="text-[13px]">
                                Move {name} left
                              </MenuItem>
                              <MenuItem
                                closeOnClick={false}
                                disabled={i === centerIds.length - 1}
                                onClick={() => moveColumn(id, i + 1)}
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
        )}
        {live}
        <Table
          ref={gridRef}
          role="grid"
          aria-label={typeof titleText === "string" ? titleText : capitalize(plural)}
          aria-rowcount={total + 1}
          aria-multiselectable={selectable || undefined}
          aria-busy={loading || undefined}
          density={density}
          containerRef={containerRef}
          containerClassName="group/dt max-h-[var(--data-table-max-height)] overflow-auto overscroll-contain [scrollbar-width:thin]"
          className="table-fixed"
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
          <TableBody ref={bodyRef} className="[&>tr:hover]:bg-transparent">
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
                <VirtualRows rows={pageRows} scroller={scroller} rowHeight={rowHeight} span={span} render={bodyRow} />
              )
            ) : (
              pageRows.map((row, i) => bodyRow(row, i))
            )}
          </TableBody>
        </Table>
        {status === "rows" ? (
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

function VirtualRows<T>({
  rows,
  scroller,
  rowHeight,
  span,
  render,
}: {
  rows: Row<T>[]
  scroller: HTMLDivElement
  rowHeight: number
  span: number
  render: (row: Row<T>, index: number) => React.ReactNode
}) {
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scroller,
    // Sub rows are a fixed 34px; counting them as full rows would leave the spacers wrong.
    estimateSize: (i) => (rows[i]?.depth ? 34 : rowHeight),
    overscan: 8,
    initialRect: { width: 0, height: 452 },
  })
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
