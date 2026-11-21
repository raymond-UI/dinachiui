import * as React from "react"
import { cn } from "@dinachi/core"

type Density = "comfortable" | "compact"
type Dividers = "rows" | "none"
type Section = "header" | "body" | "footer"
type StackRole = "title" | "value" | "meta"

interface TableContextValue {
  density: Density
  dividers: Dividers
  stack: boolean
}

const TableContext = React.createContext<TableContextValue>({ density: "comfortable", dividers: "rows", stack: false })
const SectionContext = React.createContext<Section>("body")

// Browsers drop a table's semantics once its parts stop displaying as table parts, so a
// stacked table names them explicitly.
const role = (stack: boolean, name: string) => (stack ? name : undefined)

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Row height. Compact also suits nested or dense data. */
  density?: Density
  /** Lines between body rows. */
  dividers?: Dividers
  /**
   * When the table's container is under 512px wide, each row becomes a block, with cells
   * placed by their `stack` role, so nothing scrolls sideways.
   */
  stack?: boolean
  /** Classes for the element that scrolls the table sideways. */
  containerClassName?: string
  /** The element that scrolls the table, for a virtualiser or a scroll listener. */
  containerRef?: React.Ref<HTMLDivElement>
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, containerRef, density = "comfortable", dividers = "rows", stack = false, ...props }, ref) => {
    const context = React.useMemo(() => ({ density, dividers, stack }), [density, dividers, stack])
    return (
      <TableContext.Provider value={context}>
        <div
          ref={containerRef}
          data-slot="table-container"
          className={cn("relative w-full overflow-x-auto", stack && "[container-type:inline-size]", containerClassName)}
        >
          <table
            ref={ref}
            role={role(stack, "table")}
            data-slot="table"
            data-density={density}
            data-dividers={dividers}
            data-stack={stack || undefined}
            className={cn(
              "w-full border-separate border-spacing-0 text-[13px]",
              stack && "[@container(width<32rem)]:block [@container(width<32rem)]:text-[15px]",
              className
            )}
            {...props}
          />
        </div>
      </TableContext.Provider>
    )
  }
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { stack } = React.useContext(TableContext)
    return (
      <SectionContext.Provider value="header">
        <thead
          ref={ref}
          role={role(stack, "rowgroup")}
          data-slot="table-header"
          // The stacked rows say what each value is, so the column names are left to screen readers.
          className={cn(stack && "[@container(width<32rem)]:sr-only", className)}
          {...props}
        />
      </SectionContext.Provider>
    )
  }
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { stack } = React.useContext(TableContext)
    return (
      <SectionContext.Provider value="body">
        <tbody
          ref={ref}
          role={role(stack, "rowgroup")}
          data-slot="table-body"
          className={cn(
            "[&>tr:last-child>td]:border-b-0 [&>tr:last-child>th]:border-b-0",
            "[&>tr:hover]:bg-muted/70",
            stack && "[@container(width<32rem)]:block",
            className
          )}
          {...props}
        />
      </SectionContext.Provider>
    )
  }
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { stack } = React.useContext(TableContext)
    return (
      <SectionContext.Provider value="footer">
        <tfoot
          ref={ref}
          role={role(stack, "rowgroup")}
          data-slot="table-footer"
          className={cn(
            // The first row rules off the body; the last is the total. Stacked rows already
            // end on a divider, so the rule is for the table layout only.
            stack
              ? "md:[&>tr:first-child>*]:border-t md:[&>tr:first-child>*]:pt-1.5"
              : "[&>tr:first-child>*]:border-t [&>tr:first-child>*]:pt-1.5",
            "[&>tr:last-child]:text-sm [&>tr:last-child]:font-semibold",
            // A total with nothing above it already sits under the last row's divider.
            stack &&
              "[@container(width<32rem)]:grid [@container(width<32rem)]:gap-2.5 [@container(width<32rem)]:py-4 [@container(width<32rem)]:[&>tr:last-child:not(:first-child)]:border-t [@container(width<32rem)]:[&>tr:last-child]:pt-2 [@container(width<32rem)]:[&>tr:last-child]:text-lg",
            className
          )}
          {...props}
        />
      </SectionContext.Provider>
    )
  }
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    const { stack, density, dividers } = React.useContext(TableContext)
    const section = React.useContext(SectionContext)
    return (
      <tr
        ref={ref}
        role={role(stack, "row")}
        data-slot="table-row"
        className={cn(
          "transition-colors duration-100 motion-reduce:transition-none",
          stack &&
            section === "body" &&
            cn(
              // Title and value share the first line; the break after them sends the meta cells under it.
              "[@container(width<32rem)]:flex [@container(width<32rem)]:flex-wrap [@container(width<32rem)]:items-baseline [@container(width<32rem)]:gap-x-1.5 [@container(width<32rem)]:gap-y-[3px]",
              "[@container(width<32rem)]:after:order-3 [@container(width<32rem)]:after:basis-full [@container(width<32rem)]:after:content-['']",
              density === "compact" ? "[@container(width<32rem)]:py-2" : "[@container(width<32rem)]:py-[13px]",
              dividers === "rows" && "[@container(width<32rem)]:border-b"
            ),
          stack && section === "footer" && "[@container(width<32rem)]:flex [@container(width<32rem)]:items-baseline [@container(width<32rem)]:justify-between [@container(width<32rem)]:gap-3",
          className
        )}
        {...props}
      />
    )
  }
)
TableRow.displayName = "TableRow"

const stackClasses: Record<StackRole, string> = {
  title: "[@container(width<32rem)]:order-1 [@container(width<32rem)]:min-w-0 [@container(width<32rem)]:flex-1 [@container(width<32rem)]:pe-3 [@container(width<32rem)]:text-base [@container(width<32rem)]:font-medium",
  value: "[@container(width<32rem)]:order-2 [@container(width<32rem)]:text-right [@container(width<32rem)]:text-base [@container(width<32rem)]:tabular-nums",
  meta: "[@container(width<32rem)]:order-4 [@container(width<32rem)]:text-[13px] [@container(width<32rem)]:text-muted-foreground",
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligns the column's name over its figures. */
  numeric?: boolean
  /** Where a row's header goes when the table stacks, as on `TableCell`. Defaults to `title`. */
  stack?: StackRole
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, numeric, scope, stack: place, ...props }, ref) => {
    const { stack, density, dividers } = React.useContext(TableContext)
    const section = React.useContext(SectionContext)
    return (
      <th
        ref={ref}
        scope={scope ?? (section === "header" ? "col" : "row")}
        role={role(stack, section === "header" ? "columnheader" : "rowheader")}
        data-slot="table-head"
        data-numeric={numeric || undefined}
        data-stack={stack && section === "body" ? (place ?? "title") : undefined}
        className={cn(
          "whitespace-nowrap px-3 text-left align-middle font-medium",
          section === "header" && "border-b text-xs text-muted-foreground",
          section === "body" && dividers === "rows" && "border-b",
          section === "header" && (density === "compact" ? "h-[34px]" : "h-10"),
          section === "body" && (density === "compact" ? "h-9" : "h-12"),
          section === "footer" && "h-9",
          numeric && "text-right tabular-nums",
          stack && section !== "header" && "[@container(width<32rem)]:block [@container(width<32rem)]:h-auto [@container(width<32rem)]:whitespace-normal [@container(width<32rem)]:border-0 [@container(width<32rem)]:p-0",
          stack && section === "body" && stackClasses[place ?? "title"],
          className
        )}
        {...props}
      />
    )
  }
)
TableHead.displayName = "TableHead"

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-aligns the cell in tabular figures, so a column reads as one figure. */
  numeric?: boolean
  /**
   * Where the cell goes when the table stacks: `title` and `value` share the first line,
   * `meta` sits under them. Body cells without one are meta.
   */
  stack?: StackRole
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, numeric, stack: place, ...props }, ref) => {
    const { stack, density, dividers } = React.useContext(TableContext)
    const section = React.useContext(SectionContext)
    return (
      <td
        ref={ref}
        role={role(stack, "cell")}
        data-slot="table-cell"
        data-numeric={numeric || undefined}
        data-stack={stack && section === "body" ? (place ?? "meta") : undefined}
        className={cn(
          "whitespace-nowrap px-3 align-middle",
          section === "footer" ? "h-9" : cn(density === "compact" ? "h-9" : "h-12", dividers === "rows" && "border-b"),
          numeric && "text-right tabular-nums",
          stack && "[@container(width<32rem)]:block [@container(width<32rem)]:h-auto [@container(width<32rem)]:whitespace-normal [@container(width<32rem)]:border-0 [@container(width<32rem)]:p-0",
          stack && section === "body" && stackClasses[place ?? "meta"],
          className
        )}
        {...props}
      />
    )
  }
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => {
    const { stack } = React.useContext(TableContext)
    return (
      <caption
        ref={ref}
        data-slot="table-caption"
        className={cn("caption-top px-3 pb-3 text-left text-sm text-muted-foreground", stack && "[@container(width<32rem)]:block [@container(width<32rem)]:px-0", className)}
        {...props}
      />
    )
  }
)
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }
