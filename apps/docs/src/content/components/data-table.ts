import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "data-table",
  description: "Rows to sort, search, filter, select and page, on TanStack Table, with a phone layout of its own.",
  usage: `import { DataTable, createColumnHelper } from "@/components/ui/data-table"

type Order = { id: number; customer: string; status: string; amount: number }
const col = createColumnHelper<Order>()

const columns = [
  col.accessor("id", { header: "Order", size: 84, meta: { pin: "left", phone: "meta" } }),
  col.accessor("customer", { header: "Customer", meta: { phone: "title" } }),
  col.accessor("status", { header: "Status", size: 100, meta: { phone: "meta" } }),
  col.accessor("amount", { header: "Amount", size: 96, meta: { numeric: true, phone: "value" } }),
]

export function Orders({ orders }: { orders: Order[] }) {
  return (
    <DataTable
      data={orders}
      columns={columns}
      noun={{ singular: "order", plural: "orders" }}
      facet={{ column: "status" }}
    />
  )
}`,

  anatomy: `<DataTable>
  <DataTableRowTrigger />
  <DataTableAction />
</DataTable>`,

  examples: ["data-table-basic", "data-table-server", "data-table-virtual"],

  parts: [
    {
      name: "DataTable",
      summary: "The toolbar, the grid, the footer and the detail sheet. Columns are TanStack `ColumnDef`s.",
      props: [
        { name: "data", type: "T[]", description: "The rows. In server mode, only the page on show." },
        { name: "columns", type: "ColumnDef<T>[]", description: "TanStack column definitions. Build them with `createColumnHelper`. Extras go on `meta`, below." },
        { name: "getRowId", type: "(row, index) => string", default: "row.id", description: "A stable id per row, so selection survives sorting and paging." },
        { name: "getRowLabel", type: "(row, id) => string", default: '"Order 4821"', description: "What a row is called in checkbox names, the sheet title and the agent.", agent: true },
        { name: "noun", type: "{ singular, plural }", default: '{ "row", "rows" }', description: "What the rows are. Names the count, the empty states and the agent's controls.", agent: true },
        { name: "title", type: "ReactNode | null", default: '"248 orders"', description: "The heading over the table. `null` hides it." },
        { name: "facet", type: "{ column, options? }", description: "A column whose values become filter chips, with counts. Pass `options` with a `count` each in server mode.", agent: true },
        { name: "sorting, defaultSorting, onSortingChange", type: "SortingState", description: "Controlled or starting sort. Shift-click adds a column.", agent: true },
        { name: "columnFilters, defaultColumnFilters, onColumnFiltersChange", type: "ColumnFiltersState", description: "The facet filter and any of your own.", agent: true },
        { name: "globalFilter, defaultGlobalFilter, onGlobalFilterChange", type: "string", description: "The search.", agent: true },
        { name: "pagination, defaultPagination, onPaginationChange", type: "{ pageIndex, pageSize }", description: "The page, from 0, and its size.", agent: true },
        { name: "rowSelection, defaultRowSelection, onRowSelectionChange", type: "Record<id, boolean>", description: "Selected rows by id.", agent: true },
        { name: "columnVisibility, defaultColumnVisibility, onColumnVisibilityChange", type: "Record<id, boolean>", description: "Columns hidden from the Columns menu." },
        { name: "onStateChange", type: "(state, details) => void", description: "Runs after any slice changes, with all of them. One handler for server mode." },
        { name: "rowCount", type: "number", description: "The total on the server. Setting it turns off client sorting, filtering and paging." },
        { name: "pageSizes", type: "number[]", default: "[10, 25, 50]", description: "Choices in the Rows select. One entry hides it." },
        { name: "loading", type: "boolean", default: "false", description: "Skeleton rows under the real header." },
        { name: "error", type: "boolean | ReactNode", description: "`true` reads Couldn't load orders. A node replaces the message." },
        { name: "onRetry", type: "() => void", description: "Adds Try again to the error." },
        { name: "emptyState", type: "(context) => ReactNode", description: "Replaces the empty message. Gets the query, the facet value and `clear()`." },
        { name: "density", type: '"comfortable" | "compact"', default: '"comfortable"', description: "48px or 36px rows." },
        { name: "selectable", type: "boolean", default: "true", description: "The checkbox column and the selection bar.", agent: true },
        { name: "selectionActions", type: "(rows, clear) => ReactNode", description: "Buttons in the selection bar." },
        { name: "rowActions", type: "(row) => ReactNode", description: "Items for each row's menu, usually `DataTableAction`s." },
        { name: "getSubRows", type: "(row) => T[] | undefined", description: "Child rows, shown under a chevron." },
        { name: "renderSubComponent", type: "(row) => ReactNode", description: "A panel under an expanded row. Not drawn while virtualized, where every row has a fixed height; use `getSubRows` there." },
        { name: "resizable", type: "boolean", default: "true", description: "Drag a header's edge, or focus it and press the arrows." },
        { name: "reorderable", type: "boolean", default: "true", description: "Drag a header, or use Move columns in the Columns menu." },
        { name: "virtualize", type: "boolean", default: "false", description: "Draws only the rows in view, in a scrolling body, instead of pages." },
        { name: "maxHeight", type: "number", description: "Height of the scrolling area in px. 452 when virtualized." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
      ],
    },
    {
      name: "ColumnDef meta",
      summary: "Typed through `ColumnMeta`, so `meta` autocompletes in your columns.",
      props: [
        { name: "label", type: "string", description: "The column's name where its header is not shown: menus, the sheet, the agent. Defaults to a string header." },
        { name: "numeric", type: "boolean", description: "Right-aligned, in tabular figures, sorting high to low first." },
        { name: "pin", type: '"left"', description: "Stays at the left edge when the table scrolls sideways." },
        { name: "phone", type: '"title" | "value" | "meta"', description: "Where the column goes in the phone list. Columns without it are in the sheet only." },
        { name: "phoneOrder", type: "number", default: "0", description: "Order within its phone line, lowest first. Ties keep column order." },
        { name: "phoneCell", type: "(context) => ReactNode", description: "Renders the cell in the phone list instead of `cell`. The sheet still uses `cell`." },
        { name: "sortLabels", type: "[ascending, descending]", description: 'Names for the phone sort and the agent, such as `["Oldest", "Newest"]`.', agent: true },
      ],
    },
    {
      name: "DataTableRowTrigger",
      summary: "A button in a cell that opens the row's detail sheet. Plain text in the phone list and the sheet.",
      props: [{ name: "...props", type: "ButtonHTMLAttributes", description: "Passed to the `<button>`." }],
    },
    {
      name: "DataTableAction",
      summary: "An item in a row's actions menu.",
      props: [{ name: "destructive", type: "boolean", default: "false", description: "Colours the item as a warning, for Refund or Delete." }],
    },
  ],

  notes: [
    {
      title: "Server mode",
      body: "Set `rowCount` and the table stops sorting, filtering and paging on its own. Control the state, fetch on each change and pass the page back as `data`. `onStateChange` hands you every slice at once:\n\n```tsx\n<DataTable\n  data={page.rows}\n  rowCount={page.total}\n  loading={pending}\n  sorting={state.sorting}\n  pagination={state.pagination}\n  globalFilter={state.globalFilter}\n  columnFilters={state.columnFilters}\n  onStateChange={setState}\n/>\n```\n\nThe state holds selection and column visibility too, so refetch only when sorting, filters, search or paging changed; the Server-side example compares them.\n\nSelect all appears only once every row is loaded; with a page at a time, the header checkbox selects the page. Selection is kept by id across pages, and `selectionActions` gets only the rows in `data`, so act on the rest by `rowSelection`.",
    },
    {
      title: "Phone",
      body: "Below 768px the table becomes a list with no sideways scroll. Each row is two lines from the `phone` meta: the `title` and `value` columns, then the `meta` ones, ordered by `phoneOrder`. `phoneCell` renders a column there more briefly, such as a date without its time. Filters scroll as a chip row, one control by the title sorts, and tapping a row opens it in a sheet listing every visible column, with the row actions in its header.\n\nSelect, by the title, turns the rows into checkboxes and the search into the selection bar; a long press does the same and selects that row. Done clears the selection.",
    },
    {
      title: "Changes and details",
      body: "Every handler gets `(value, details)`. `details.cancel()` refuses the change, and `isAgentChange(details)` tells you an agent made it. A sort, filter or search also sends the page back to 1, as a second change with its own details.",
    },
    {
      title: "Pinned columns",
      body: "The checkbox, the expander and any `pin: \"left\"` column stay put as the rest scrolls, with a shadow only while something is under them. Give pinned columns a `size`.",
    },
  ],

  agent: {
    kind: "select",
    reads: [
      { field: "Sort orders", means: "A multiple `select`. Its value is the sort in order, such as Amount descending; its items, each column both ways." },
      { field: "Select orders", means: "A `checkbox-group` of the rows on the page, by their `getRowLabel`. Its value is every selected row. On phone too." },
      { field: "Search orders", means: "The search `input`." },
      { field: "Filter orders by Status", means: "The facet's `toggle-group`." },
      { field: "Pages of orders", means: "The page, a `number`." },
      { field: "Rows per page", means: "The page size, a `select`." },
    ],
    actions: [
      { call: 'select("Amount descending")', does: "Sorts by a column. A bare column name takes its natural first direction; `sortLabels` such as Newest work too." },
      { call: 'setValue(["Status ascending", "Amount descending"])', does: "Sorts by several columns." },
      { call: "clear()", does: "Back to the default sort, on Sort; no rows selected, on Select." },
      { call: 'select("Order #4821")', does: "Selects rows by label or id, on Select. `\"all\"` selects everything that matches." },
    ],
    refusal:
      "An agent's change runs through the same handlers as a person's, with `isAgentChange(details)` true; `details.cancel()` refuses it. A column that cannot sort, or a row that is not there, is refused with what is.",
    example: `await agent.act({
  steps: [
    { ref: "Filter orders by Status", action: "select", args: ["Paid"] },
    { ref: "Sort orders", action: "select", args: ["Amount descending"] },
    { ref: "Select orders", action: "select", args: ["Order #4821"] },
  ],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves into the grid and out again, one stop" },
    { keys: ["←", "→", "↑", "↓"], does: "Moves between cells and the controls in them" },
    { keys: ["Home", "End"], does: "First or last cell in the row" },
    { keys: ["Ctrl", "Home"], does: "First cell in the grid; Ctrl End, the last" },
    { keys: ["Space"], does: "Selects the row" },
    { keys: ["Enter"], does: "Uses the control in the cell: sort, open, expand" },
    { keys: ["Shift", "Click"], does: "Adds a column to the sort" },
    { keys: ["←", "→"], does: "On a resize handle, narrows or widens the column" },
  ],

  accessibility: [
    'An ARIA `grid` named by its title, with `aria-rowcount` for every row, not just the page, and `aria-rowindex` on each.',
    "Sorted headers carry `aria-sort`, and a polite live region reads the new sort and count.",
    'Checkboxes are named Select page and Select Order #4821; selected rows have `aria-selected`.',
    'Resize handles are `separator`s named Resize Amount, with their width as `aria-valuenow`.',
    "Column order changes from the Columns menu as well as by drag.",
    "Phone rows are buttons, at least 44px tall, and paging uses 44px targets. In Select mode each row is a `checkbox`.",
    "Long press is a shortcut only; the Select button reaches the same mode by tap, keyboard or screen reader.",
  ],
} satisfies ComponentDoc;
