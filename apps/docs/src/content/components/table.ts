import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "table",
  description: "Rows and columns of figures, styled native table parts that scroll sideways or stack into blocks on a phone.",
  usage: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function Orders({ orders }: { orders: { id: string; customer: string; total: string }[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead numeric>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell>{o.id}</TableCell>
            <TableCell>{o.customer}</TableCell>
            <TableCell numeric>{o.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`,
  anatomy: `<Table>
  <TableCaption />
  <TableHeader>
    <TableRow>
      <TableHead />
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell />
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell />
    </TableRow>
  </TableFooter>
</Table>`,

  examples: ["table-invoice", "table-compact"],

  parts: [
    {
      name: "Table",
      summary: "The `<table>`, inside a container that scrolls it sideways when it is wider than its parent.",
      props: [
        { name: "density", type: '"comfortable" | "compact"', default: '"comfortable"', description: "Row height: 48px or 36px." },
        { name: "dividers", type: '"rows" | "none"', default: '"rows"', description: "Lines between body rows." },
        { name: "stack", type: "boolean", default: "false", description: "Below 768px each row becomes a block, its cells placed by their `stack` role." },
        { name: "containerClassName", type: "string", description: "Classes for the scrolling container." },
      ],
    },
    { name: "TableHeader", summary: "The `<thead>`. Hidden visually, not from screen readers, when the table stacks.", props: [] },
    { name: "TableBody", summary: "The `<tbody>`. Rows tint on hover.", props: [] },
    { name: "TableFooter", summary: "The `<tfoot>`, ruled off the body. Its last row is the total, in heavier type.", props: [] },
    { name: "TableRow", summary: "A `<tr>`.", props: [] },
    {
      name: "TableHead",
      summary: "A `<th>`. Scoped to its column in the header and to its row elsewhere.",
      props: [{ name: "numeric", type: "boolean", default: "false", description: "Right-aligns the name over a column of figures." }],
    },
    {
      name: "TableCell",
      summary: "A `<td>`.",
      props: [
        { name: "numeric", type: "boolean", default: "false", description: "Right-aligned tabular figures, so a column reads as one figure." },
        { name: "stack", type: '"title" | "value" | "meta"', default: '"meta"', description: "Where the cell goes when the table stacks. `title` and `value` share the first line; `meta` sits under them." },
      ],
    },
    { name: "TableCaption", summary: "The `<caption>`, above the table. Names it for screen readers.", props: [] },
  ],

  notes: [
    {
      title: "Phone and desktop",
      body: "Without `stack`, a wide table scrolls sideways inside its container. With it, each row below 768px reads as a line item: the `title` cell and the `value` cell on the first line, the `meta` cells under them, and the footer rows as label and figure. Give every body row one `title` and at most one `value`.",
    },
    {
      title: "Sorting, selection and large data",
      body: "Table is the markup and the look. Sorting, row selection and virtualised rows build on it in their own components.",
    },
  ],

  accessibility: [
    "The parts are native table elements, so screen readers announce rows, columns and headers.",
    "A stacked table sets the table roles on its parts, since browsers drop them once the parts stop displaying as a table.",
    "Header cells are scoped to their column, and `TableHead` in a body row to its row.",
    "Give the table a `TableCaption` or an `aria-label` so it is named.",
  ],
} satisfies ComponentDoc;
