"use client"

import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { cn } from "@dinachi/core"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../table"

export interface HeatRow {
  label: string
  /** Shown after the label on desktop, such as the cohort's size. */
  meta?: React.ReactNode
  /** One value per column. `null` leaves the cell blank. */
  values: (number | null | undefined)[]
}

export interface HeatCell<Row extends HeatRow = HeatRow> {
  row: Row
  rowIndex: number
  column: string
  columnIndex: number
  value: number
}

export interface HeatScaleRange {
  min: number
  max: number
}

export interface HeatColumnGroup {
  label: React.ReactNode
  /** How many columns it spans. */
  span: number
}

export interface HeatTableProps<Row extends HeatRow = HeatRow>
  extends Omit<React.TableHTMLAttributes<HTMLTableElement>, "children"> {
  /** The column names as printed over the cells. */
  columns: string[]
  /** Each column's full name for screen readers and cell names, such as "Wed 18 Nov 2026" over "18". Defaults to `columns`. */
  columnLabels?: string[]
  /** Spanning headers over the columns, such as months over days. */
  columnGroups?: HeatColumnGroup[]
  /** Column names below 768px, where each column is a narrow square. Defaults to `columns`. */
  phoneColumns?: string[]
  rows: Row[]
  /** The name over the row labels, such as "Cohort". */
  rowHeader?: React.ReactNode
  /** A value as printed. Defaults to the number as it is. */
  format?: (value: number, cell: HeatCell<Row>) => string
  /** A cell's accessible name. Defaults to "{row}, {column}: {value}". */
  label?: (cell: HeatCell<Row>) => string
  /** The value that shades lightest. Defaults to the lowest value in `rows`. */
  min?: number
  /** The value that shades darkest. Defaults to the highest value in `rows`. */
  max?: number
  /** Maps a value to 0 to 1. Defaults to a straight line from `min` to `max`. */
  scale?: (value: number, range: HeatScaleRange) => number
  /** A summary row under the grid, such as the average. */
  footer?: { label: React.ReactNode; values: React.ReactNode[] }
  /** What the line under the grid says about the chosen cell on a phone. */
  readout?: (cell: HeatCell<Row>) => React.ReactNode
  /** The cell chosen at first, which takes the tab stop and fills the phone readout. Defaults to the first filled cell. */
  defaultCell?: { row: number; column: number }
  /** Cell size. Compact fits about twice the columns. */
  density?: "comfortable" | "compact"
  /** Height of the scrolling area in px. Virtualized grids default to 480. */
  maxHeight?: number
  /** Renders only the rows in view. For grids of thousands of rows. */
  virtualize?: boolean
  /** Keeps the column headers and row labels in view while the grid scrolls. Defaults to on once `maxHeight` is set. */
  sticky?: boolean
  /** Runs as the pointer enters a filled cell, and with `null` as it leaves the grid. */
  onCellHover?: (cell: HeatCell<Row> | null) => void
  /** Runs when a cell takes focus, by keyboard or click. */
  onCellFocus?: (cell: HeatCell<Row>) => void
  onCellClick?: (cell: HeatCell<Row>, event: React.MouseEvent<HTMLTableCellElement>) => void
  /** Classes for the element that scrolls the grid. */
  containerClassName?: string
  /** The element that scrolls the grid. */
  containerRef?: React.Ref<HTMLDivElement>
}

const linear = (value: number, { min, max }: HeatScaleRange) =>
  max === min ? (value < min ? 0 : 1) : (value - min) / (max - min)
const plain = (value: number) => String(value)

const isValue = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v)

/**
 * The cell's shade: the primary colour mixed into the surface, with text that stays readable
 * on it. The mix skips 34% to 55%, where neither text colour reaches 4.5:1 on either theme.
 */
export function heatShade(amount: number): React.CSSProperties {
  const a = Math.min(1, Math.max(0, Number.isNaN(amount) ? 0 : amount))
  const dark = a > 0.5
  return {
    background: `color-mix(in oklab, var(--primary) ${Math.round(dark ? 56 + (a - 0.5) * 60 : 6 + a * 54)}%, var(--card))`,
    color: dark ? "var(--primary-foreground)" : "var(--card-foreground)",
  }
}

type At = { r: number; c: number }

const SIZES = {
  comfortable: { width: 56, height: 38, text: "12.5px" },
  compact: { width: 32, height: 26, text: "11px" },
}
// Up to this many columns fit a phone as squares; past it they keep a size and scroll.
const PHONE_FIT = 12
const GAP = 3

const radius = "rounded-[min(0.375rem,var(--radius,0.375rem))]"
const tint = "color-mix(in_oklab,var(--foreground)_9%,transparent)"
// A tint as well as the text colour, since themes often set muted text close to the foreground.
// It is a background image so a sticky header keeps its opaque surface under it.
const lift = cn(
  radius,
  "transition-colors duration-100 motion-reduce:transition-none data-[active]:text-foreground",
  `data-[active]:bg-[linear-gradient(${tint},${tint})]`
)
const surface = "bg-[var(--heat-table-surface,var(--background))]"
// Square corners and a halo over the border spacing, or cells scrolling under show through.
const pinned = cn("md:rounded-none md:shadow-[0_0_0_3px_var(--heat-table-surface,var(--background))]", surface)

const box = (fit: boolean) =>
  cn(
    "flex h-[var(--heat-table-cell-height)] w-[var(--heat-table-cell-width)] items-center justify-center",
    radius,
    fit ? "max-md:aspect-square max-md:h-auto max-md:w-full max-md:rounded-[5px]" : "max-md:h-7 max-md:w-7 max-md:rounded-[5px]"
  )

const atOf = (el: EventTarget | null): { at: At; el: HTMLTableCellElement } | null => {
  const td = (el as HTMLElement | null)?.closest?.<HTMLTableCellElement>("td[data-cell]")
  if (!td) return null
  const [r, c] = td.getAttribute("data-cell")!.split("-").map(Number)
  return { at: { r, c }, el: td }
}

interface Shared<Row extends HeatRow> {
  columns: string[]
  names: string[]
  format: (value: number, cell: HeatCell<Row>) => string
  label?: (cell: HeatCell<Row>) => string
  scale: (value: number, range: HeatScaleRange) => number
  range: HeatScaleRange
  fit: boolean
  sticky: boolean
}

interface BodyRowProps<Row extends HeatRow> {
  row: Row
  r: number
  /** The chosen column when this row holds the chosen cell, or -1. */
  chosen: number
  shared: Shared<Row>
  index?: number
}

// Memoised so a new choice draws only the two rows it touches. Hover never renders at all.
const HeatBodyRow = React.memo(function HeatBodyRow<Row extends HeatRow>({ row, r, chosen, shared, index }: BodyRowProps<Row>) {
  const { columns, names, format, label, scale, range, fit, sticky } = shared
  return (
    <TableRow role="row" aria-rowindex={index === undefined ? undefined : index + 2}>
      <TableHead
        role="rowheader"
        className={cn(
          "h-auto pe-2 ps-1 text-[11.5px] font-medium text-muted-foreground max-md:text-xs",
          lift,
          sticky && cn("md:sticky md:left-0 md:z-[1]", pinned)
        )}
      >
        {row.label}
        {row.meta != null && (
          <span className="ms-2 font-normal text-muted-foreground max-md:hidden">
            <span className="sr-only">,</span> {row.meta}
          </span>
        )}
      </TableHead>
      {columns.map((column, c) => {
        const value = row.values[c]
        if (!isValue(value))
          return (
            <TableCell key={c} role="gridcell" className="h-auto p-0">
              <span data-slot="heat-table-blank" aria-hidden className={cn("block", box(fit))} />
            </TableCell>
          )
        const cell: HeatCell<Row> = { row, rowIndex: r, column, columnIndex: c, value }
        const printed = format(value, cell)
        const isChosen = chosen === c
        return (
          <TableCell
            key={c}
            role="gridcell"
            data-cell={`${r}-${c}`}
            data-selected={isChosen || undefined}
            aria-selected={isChosen}
            tabIndex={isChosen ? 0 : -1}
            aria-label={label ? label(cell) : `${row.label}, ${names[c]}: ${printed}`}
            className="group h-auto cursor-default p-0 outline-none"
          >
            <span
              data-slot="heat-table-cell"
              style={heatShade(scale(value, range))}
              className={cn(
                box(fit),
                "transition-shadow duration-100 motion-reduce:transition-none",
                "group-focus-visible:shadow-[0_0_0_2px_var(--foreground)] md:group-data-[active]:shadow-[0_0_0_2px_var(--foreground)]",
                "max-md:group-data-[selected]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--foreground)]"
              )}
            >
              <span className="max-md:hidden" aria-hidden>
                {printed}
              </span>
            </span>
          </TableCell>
        )
      })}
    </TableRow>
  )
}) as <Row extends HeatRow>(props: BodyRowProps<Row>) => React.ReactElement

function setRef<V>(ref: React.Ref<V> | undefined, value: V | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) (ref as React.MutableRefObject<V | null>).current = value
}

/**
 * A grid of values shaded by size, with the number always printed so colour is never the
 * only signal. Pointing at a cell lights its row and column headers. Below 768px the cells
 * become squares and the chosen one is read out under the grid.
 */
function HeatTableInner<Row extends HeatRow>(props: HeatTableProps<Row>, ref: React.ForwardedRef<HTMLTableElement>) {
  const {
    columns,
    columnLabels,
    columnGroups,
    phoneColumns,
    rows,
    rowHeader,
    format = plain,
    label,
    min: minProp,
    max: maxProp,
    scale = linear,
    footer,
    readout,
    defaultCell,
    density = "comfortable",
    virtualize = false,
    onCellHover,
    onCellFocus,
    onCellClick,
    className,
    containerClassName,
    containerRef,
    style,
    onFocus,
    onBlur,
    onClick,
    onKeyDown,
    onMouseOver,
    onMouseLeave,
    ...rest
  } = props
  const maxHeight = props.maxHeight ?? (virtualize ? 480 : undefined)
  const sticky = props.sticky ?? maxHeight !== undefined
  const n = columns.length
  const fit = n <= PHONE_FIT

  // A loop, since spreading a large grid into Math.min overflows the stack.
  const range = React.useMemo<HeatScaleRange>(() => {
    let lo = Infinity
    let hi = -Infinity
    if (minProp === undefined || maxProp === undefined)
      for (const row of rows)
        for (let c = 0; c < n; c++) {
          const v = row.values[c]
          if (!isValue(v)) continue
          if (v < lo) lo = v
          if (v > hi) hi = v
        }
    const min = minProp ?? lo
    // A max under the min would turn the scale upside down.
    return { min, max: Math.max(min, maxProp ?? hi) }
  }, [rows, n, minProp, maxProp])

  const has = (at: At | null): at is At => !!at && at.c < n && isValue(rows[at.r]?.values[at.c])
  const scan = (from: At, dr: number, dc: number): At | undefined => {
    for (let r = from.r + dr, c = from.c + dc; r >= 0 && r < rows.length && c >= 0 && c < n; r += dr, c += dc)
      if (isValue(rows[r].values[c])) return { r, c }
  }
  const first = React.useMemo(() => {
    for (let r = 0; r < rows.length; r++) for (let c = 0; c < n; c++) if (isValue(rows[r].values[c])) return { r, c }
    return null
  }, [rows, n])
  const last = () => {
    for (let r = rows.length - 1; r >= 0; r--) for (let c = n - 1; c >= 0; c--) if (isValue(rows[r].values[c])) return { r, c }
  }

  const [chosen, setChosen] = React.useState<At | null>(defaultCell ? { r: defaultCell.row, c: defaultCell.column } : null)
  const current = has(chosen) ? chosen : first

  const names = React.useMemo(() => columns.map((column, c) => columnLabels?.[c] ?? column), [columns, columnLabels])
  const shared = React.useMemo<Shared<Row>>(
    () => ({ columns, names, format, label, scale, range, fit, sticky }),
    [columns, names, format, label, scale, range, fit, sticky]
  )
  const cellOf = (at: At): HeatCell<Row> => ({
    row: rows[at.r],
    rowIndex: at.r,
    column: columns[at.c],
    columnIndex: at.c,
    value: rows[at.r].values[at.c] as number,
  })

  const grid = React.useRef<HTMLTableElement | null>(null)
  const [scroller, setScroller] = React.useState<HTMLDivElement | null>(null)
  const scrollRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      setScroller(el)
      setRef(containerRef, el)
    },
    [containerRef]
  )

  /* ---- lighting, kept out of React so pointing at a cell renders nothing ---- */
  const hovered = React.useRef<HTMLTableCellElement | null>(null)
  const focused = React.useRef<HTMLTableCellElement | null>(null)
  const lit = React.useRef<HTMLElement[]>([])
  const paint = () => {
    for (const el of lit.current) el.removeAttribute("data-active")
    lit.current = []
    const td = hovered.current?.isConnected ? hovered.current : focused.current?.isConnected ? focused.current : null
    if (!td) return
    const c = Number(td.getAttribute("data-cell")!.split("-")[1])
    const on = [td.parentElement?.firstElementChild, grid.current?.querySelector(`thead th[data-column="${c}"]`)]
    // Hover rings the cell; focus has its own ring.
    if (td === hovered.current) on.push(td)
    for (const el of on)
      if (el instanceof HTMLElement) {
        el.setAttribute("data-active", "")
        lit.current.push(el)
      }
  }

  /* ---- virtualisation ---- */
  const size = SIZES[density]
  const virtualizer = useVirtualizer({
    count: virtualize ? rows.length : 0,
    getScrollElement: () => scroller,
    // Cells are a fixed size, so the estimate is the height.
    estimateSize: () => size.height + GAP,
    overscan: 6,
    initialRect: { width: 0, height: maxHeight ?? 480 },
  })
  React.useEffect(() => {
    if (virtualize) virtualizer.measure()
  }, [virtualize, virtualizer, size.height])

  /* ---- keyboard ---- */
  const pending = React.useRef<At | null>(null)
  const focusAt = (to: At) => {
    const el = grid.current?.querySelector<HTMLElement>(`[data-cell="${to.r}-${to.c}"]`)
    if (el) {
      pending.current = null
      el.focus()
    } else pending.current = to
  }
  React.useLayoutEffect(() => {
    if (pending.current) focusAt(pending.current)
  })
  const move = (to: At | undefined | null) => {
    if (!to) return
    setChosen(to)
    if (virtualize) virtualizer.scrollToIndex(to.r, { align: "auto" })
    focusAt(to)
  }
  const keys = (event: React.KeyboardEvent, at: At) => {
    const ctrl = event.ctrlKey || event.metaKey
    const step: Record<string, () => At | undefined | null> = {
      ArrowRight: () => scan(at, 0, 1),
      ArrowLeft: () => scan(at, 0, -1),
      ArrowDown: () => scan(at, 1, 0),
      ArrowUp: () => scan(at, -1, 0),
      Home: () => (ctrl ? first : scan({ r: at.r, c: -1 }, 0, 1)),
      End: () => (ctrl ? last() : scan({ r: at.r, c: n }, 0, -1)),
    }
    const go = step[event.key]
    if (!go) return
    event.preventDefault()
    move(go())
  }

  const shown = current ? cellOf(current) : null
  const bodyRow = (row: Row, r: number, index?: number) => (
    <HeatBodyRow<Row>
      key={r}
      row={row}
      r={r}
      chosen={current?.r === r ? current.c : -1}
      shared={shared}
      index={index}
    />
  )
  const items = virtualize ? virtualizer.getVirtualItems() : []
  const top = items[0]?.start ?? 0
  const bottom = virtualize ? virtualizer.getTotalSize() - (items[items.length - 1]?.end ?? 0) : 0
  const spacer = (height: number) =>
    height > 0 && (
      <tr data-spacer aria-hidden>
        <td colSpan={n + 1} style={{ height: Math.max(0, height - GAP), padding: 0 }} />
      </tr>
    )
  const headerRows = columnGroups?.length ? 2 : 1

  return (
    <div
      data-slot="heat-table"
      data-density={density}
      className="w-full"
      style={
        {
          "--heat-table-cell-width": `${size.width}px`,
          "--heat-table-cell-height": `${size.height}px`,
          ...(maxHeight !== undefined && { "--heat-table-max-height": `${maxHeight}px` }),
        } as React.CSSProperties
      }
    >
      <Table
        ref={(el) => {
          grid.current = el
          setRef(ref, el)
        }}
        role="grid"
        dividers="none"
        containerRef={scrollRef}
        containerClassName={cn(
          fit ? "max-md:overflow-visible" : "overflow-x-auto",
          maxHeight !== undefined && "max-h-[var(--heat-table-max-height)] overflow-auto overscroll-contain",
          containerClassName
        )}
        className={cn("w-auto border-spacing-[3px] tabular-nums", fit && "max-md:w-full max-md:table-fixed", className)}
        aria-rowcount={virtualize ? rows.length + headerRows + (footer ? 1 : 0) : undefined}
        style={{ fontSize: size.text, ...style }}
        {...rest}
        onMouseOver={(e) => {
          const hit = atOf(e.target)
          if (hit && hit.el !== hovered.current) {
            hovered.current = hit.el
            paint()
            onCellHover?.(cellOf(hit.at))
          }
          onMouseOver?.(e)
        }}
        onMouseLeave={(e) => {
          if (hovered.current) {
            hovered.current = null
            paint()
            onCellHover?.(null)
          }
          onMouseLeave?.(e)
        }}
        onFocus={(e) => {
          const hit = atOf(e.target)
          if (hit) {
            focused.current = hit.el
            setChosen((prev) => (prev?.r === hit.at.r && prev.c === hit.at.c ? prev : hit.at))
            paint()
            onCellFocus?.(cellOf(hit.at))
          }
          onFocus?.(e)
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            focused.current = null
            paint()
          }
          onBlur?.(e)
        }}
        onClick={(e) => {
          const hit = atOf(e.target)
          if (hit) {
            move(hit.at)
            onCellClick?.(cellOf(hit.at), e as unknown as React.MouseEvent<HTMLTableCellElement>)
          }
          onClick?.(e)
        }}
        onKeyDown={(e) => {
          const hit = atOf(e.target)
          if (hit) keys(e, hit.at)
          onKeyDown?.(e)
        }}
      >
        <TableHeader className={cn(sticky && "md:sticky md:top-0 md:z-[2]")}>
          {columnGroups?.length ? (
            <TableRow role="row" aria-rowindex={virtualize ? 1 : undefined}>
              <TableHead role="columnheader" className={cn("h-[22px] border-b-0", sticky && cn("md:sticky md:left-0", pinned))} />
              {columnGroups.map((group, i) => (
                <TableHead
                  key={i}
                  role="columnheader"
                  colSpan={group.span}
                  className={cn(
                    "h-[22px] border-b-0 px-1 text-left text-[11.5px] font-semibold text-foreground max-md:text-xs",
                    sticky && surface
                  )}
                >
                  {group.label}
                </TableHead>
              ))}
            </TableRow>
          ) : null}
          <TableRow role="row" aria-rowindex={virtualize ? headerRows : undefined}>
            <TableHead
              role="columnheader"
              className={cn(
                "h-[26px] border-b-0 pe-2 ps-1 text-[11.5px] font-medium max-md:w-[58px] max-md:text-xs",
                sticky && cn("md:sticky md:left-0 md:z-[1]", pinned)
              )}
            >
              {rowHeader}
            </TableHead>
            {columns.map((column, c) => (
              <TableHead
                key={c}
                role="columnheader"
                data-column={c}
                className={cn(
                  "h-[26px] border-b-0 px-2 text-center text-[11.5px] font-medium max-md:px-0 max-md:text-xs",
                  density === "compact" && "px-0 text-[10.5px]",
                  lift,
                  sticky && pinned
                )}
              >
                {columnLabels?.[c] !== undefined ? (
                  <>
                    <span className="sr-only">{columnLabels[c]}</span>
                    <span className="max-md:hidden" aria-hidden>
                      {column}
                    </span>
                  </>
                ) : (
                  // Screen readers keep the full name on a phone, where the short one is shown.
                  <span className="max-md:sr-only">{column}</span>
                )}
                <span className="md:hidden" aria-hidden>
                  {phoneColumns?.[c] ?? column}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="[&>tr:hover]:bg-transparent">
          {virtualize ? (
            <>
              {spacer(top)}
              {items.map((item) => bodyRow(rows[item.index], item.index, item.index + headerRows - 1))}
              {spacer(bottom)}
            </>
          ) : (
            rows.map((row, r) => bodyRow(row, r))
          )}
        </TableBody>
        {footer && (
          <TableFooter className="max-md:hidden [&>tr:first-child>*]:border-t-0">
            <TableRow role="row" aria-rowindex={virtualize ? rows.length + headerRows + 1 : undefined}>
              <TableHead
                role="rowheader"
                className={cn(
                  "h-[30px] pe-2 ps-1 pt-1.5 text-[11.5px] font-medium text-muted-foreground",
                  sticky && cn("md:sticky md:left-0", pinned)
                )}
              >
                {footer.label}
              </TableHead>
              {columns.map((_, c) => (
                <TableCell key={c} role="gridcell" className="h-[30px] px-0 pt-1.5 text-center font-semibold">
                  {footer.values[c]}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        )}
      </Table>
      <div
        data-slot="heat-table-readout"
        aria-live="polite"
        className="mt-5 min-h-[96px] border-t py-4 md:hidden"
      >
        {shown &&
          (readout ? (
            readout(shown)
          ) : (
            <>
              <div className="text-[30px] font-semibold tabular-nums tracking-[-0.02em]">{format(shown.value, shown)}</div>
              <div className="mt-0.5 text-[15px]">
                {shown.row.label}, {names[shown.columnIndex]}
              </div>
            </>
          ))}
      </div>
    </div>
  )
}

const HeatTable = React.forwardRef(HeatTableInner) as <Row extends HeatRow = HeatRow>(
  props: HeatTableProps<Row> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => React.ReactElement
;(HeatTable as { displayName?: string }).displayName = "HeatTable"

export { HeatTable }
