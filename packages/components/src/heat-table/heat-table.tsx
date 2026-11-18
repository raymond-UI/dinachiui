"use client"

import * as React from "react"
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

export interface HeatTableProps<Row extends HeatRow = HeatRow>
  extends Omit<React.TableHTMLAttributes<HTMLTableElement>, "children"> {
  columns: string[]
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
  containerClassName?: string
}

const linear = (value: number, { min, max }: HeatScaleRange) =>
  max === min ? (value < min ? 0 : 1) : (value - min) / (max - min)

const isValue = (v: number | null | undefined): v is number => typeof v === "number" && Number.isFinite(v)

/**
 * The cell's shade: the primary colour mixed into the surface, with text that stays readable
 * on it. The mix skips 44% to 54%, where neither text colour reaches 4.5:1 on either theme.
 */
export function heatShade(amount: number): React.CSSProperties {
  const a = Math.min(1, Math.max(0, Number.isNaN(amount) ? 0 : amount))
  const dark = a > 0.5
  return {
    background: `color-mix(in oklab, var(--primary) ${Math.round(dark ? 54 + (a - 0.5) * 64 : 6 + a * 76)}%, var(--popover))`,
    color: dark ? "var(--primary-foreground)" : "var(--popover-foreground)",
  }
}

type At = { r: number; c: number }

// A tint as well as the text colour, since themes often set muted text close to the foreground.
const lift =
  "rounded-md transition-colors duration-100 motion-reduce:transition-none data-[active]:bg-[color:color-mix(in_oklab,var(--foreground)_9%,transparent)] data-[active]:text-foreground"

/**
 * A grid of values shaded by size, with the number always printed so colour is never the
 * only signal. Pointing at a cell lights its row and column headers. Below 768px the cells
 * become squares and the chosen one is read out under the grid.
 */
function HeatTableInner<Row extends HeatRow>(props: HeatTableProps<Row>, ref: React.ForwardedRef<HTMLTableElement>) {
  const {
    columns,
    phoneColumns,
    rows,
    rowHeader,
    format = (v: number) => String(v),
    label,
    min: minProp,
    max: maxProp,
    scale = linear,
    footer,
    readout,
    defaultCell,
    className,
    containerClassName,
    onFocus,
    onBlur,
    onMouseLeave,
    ...rest
  } = props

  const filled = React.useMemo(() => {
    const at: At[] = []
    rows.forEach((row, r) => columns.forEach((_, c) => isValue(row.values[c]) && at.push({ r, c })))
    return at
  }, [rows, columns])
  const values = filled.map(({ r, c }) => rows[r].values[c] as number)
  const min = minProp ?? Math.min(...values)
  // A max under the min would turn the scale upside down.
  const range = { min, max: Math.max(min, maxProp ?? Math.max(...values)) }

  const has = (at: At | null): at is At => !!at && isValue(rows[at.r]?.values[at.c])
  const [chosen, setChosen] = React.useState<At | null>(defaultCell ? { r: defaultCell.row, c: defaultCell.column } : null)
  const current = has(chosen) ? chosen : (filled[0] ?? null)
  const [hover, setHover] = React.useState<At | null>(null)
  const [focused, setFocused] = React.useState(false)
  const lit = hover ?? (focused ? current : null)

  const cellOf = (at: At): HeatCell<Row> => ({
    row: rows[at.r],
    rowIndex: at.r,
    column: columns[at.c],
    columnIndex: at.c,
    value: rows[at.r].values[at.c] as number,
  })

  const grid = React.useRef<HTMLTableElement | null>(null)
  const setRef = (el: HTMLTableElement | null) => {
    grid.current = el
    if (typeof ref === "function") ref(el)
    else if (ref) ref.current = el
  }

  const move = (to: At | undefined) => {
    if (!to) return
    setChosen(to)
    grid.current?.querySelector<HTMLElement>(`[data-cell="${to.r}-${to.c}"]`)?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, at: At) => {
    const inRow = filled.filter((f) => f.r === at.r)
    const inCol = filled.filter((f) => f.c === at.c)
    const step: Record<string, () => At | undefined> = {
      ArrowRight: () => inRow.find((f) => f.c > at.c),
      ArrowLeft: () => [...inRow].reverse().find((f) => f.c < at.c),
      ArrowDown: () => inCol.find((f) => f.r > at.r),
      ArrowUp: () => [...inCol].reverse().find((f) => f.r < at.r),
      Home: () => (event.ctrlKey || event.metaKey ? filled[0] : inRow[0]),
      End: () => (event.ctrlKey || event.metaKey ? filled[filled.length - 1] : inRow[inRow.length - 1]),
    }
    const go = step[event.key]
    if (!go) return
    event.preventDefault()
    move(go())
  }

  const head = (c: number) => lit?.c === c || undefined
  const shown = current ? cellOf(current) : null

  return (
    <div data-slot="heat-table" className={cn("w-full", containerClassName)}>
      <Table
        ref={setRef}
        role="grid"
        dividers="none"
        containerClassName="max-md:overflow-visible"
        className={cn(
          "w-auto border-spacing-[3px] text-[12.5px] tabular-nums",
          "max-md:w-full max-md:table-fixed",
          className
        )}
        {...rest}
        onMouseLeave={(e) => {
          setHover(null)
          onMouseLeave?.(e)
        }}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
          onBlur?.(e)
        }}
      >
        <TableHeader>
          <TableRow role="row">
            <TableHead
              role="columnheader"
              className="h-[26px] border-b-0 pe-2 ps-1 text-[11.5px] font-medium max-md:w-[58px] max-md:text-xs"
            >
              {rowHeader}
            </TableHead>
            {columns.map((column, c) => (
              <TableHead
                key={c}
                role="columnheader"
                data-active={head(c)}
                className={cn("h-[26px] border-b-0 px-2 text-center text-[11.5px] font-medium max-md:px-0 max-md:text-xs", lift)}
              >
                {/* Screen readers keep the full name on a phone, where the short one is shown. */}
                <span className="max-md:sr-only">{column}</span>
                <span className="md:hidden" aria-hidden>
                  {phoneColumns?.[c] ?? column}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="[&>tr:hover]:bg-transparent">
          {rows.map((row, r) => (
            <TableRow key={r} role="row">
              <TableHead
                role="rowheader"
                data-active={lit?.r === r || undefined}
                className={cn("h-auto pe-2 ps-1 text-[11.5px] font-medium text-muted-foreground max-md:text-xs", lift)}
              >
                {row.label}
                {row.meta != null && <span className="ms-2 font-normal text-muted-foreground max-md:hidden">{row.meta}</span>}
              </TableHead>
              {columns.map((_, c) => {
                const value = row.values[c]
                if (!isValue(value)) return <TableCell key={c} role="gridcell" className="h-auto p-0" />
                const at = { r, c }
                const cell = cellOf(at)
                const printed = format(value, cell)
                const isCurrent = current?.r === r && current.c === c
                return (
                  <TableCell
                    key={c}
                    role="gridcell"
                    data-cell={`${r}-${c}`}
                    data-active={(hover?.r === r && hover.c === c) || undefined}
                    data-selected={isCurrent || undefined}
                    tabIndex={isCurrent ? 0 : -1}
                    aria-label={label ? label(cell) : `${row.label}, ${columns[c]}: ${printed}`}
                    onMouseEnter={() => setHover(at)}
                    onClick={() => move(at)}
                    onFocus={() => setChosen(at)}
                    onKeyDown={(e) => onKeyDown(e, at)}
                    className="group h-auto cursor-default p-0 outline-none"
                  >
                    <span
                      data-slot="heat-table-cell"
                      style={heatShade(scale(value, range))}
                      className={cn(
                        "flex h-[38px] w-14 items-center justify-center rounded-md transition-shadow duration-100 motion-reduce:transition-none",
                        "group-focus-visible:shadow-[0_0_0_2px_var(--foreground)] md:group-data-[active]:shadow-[0_0_0_2px_var(--foreground)]",
                        "max-md:aspect-square max-md:h-auto max-md:w-full max-md:rounded-[5px]",
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
          ))}
        </TableBody>
        {footer && (
          <TableFooter className="max-md:hidden [&>tr:first-child>*]:border-t-0 [&>tr:last-child]:text-[12.5px]">
            <TableRow role="row">
              <TableHead role="rowheader" className="h-[30px] pe-2 ps-1 pt-1.5 text-[11.5px] font-medium text-muted-foreground">
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
                {shown.row.label}, {shown.column}
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
