import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "heat-table",
  description:
    "A grid of values shaded by size, with every number printed so colour is never the only signal. Pointing at a cell lights its row and column, and on a phone the cells become squares read out one at a time.",
  usage: `import { HeatTable } from "@/components/ui/heat-table"

const cohorts = [
  { label: "14 Sep", meta: "1,334", values: [52, 45, 37] },
  { label: "21 Sep", meta: "1,370", values: [56, 48] },
  { label: "28 Sep", meta: "1,188", values: [52] },
]

export function Retention() {
  return (
    <HeatTable
      aria-label="Weekly return by cohort"
      columns={["W1", "W2", "W3"]}
      rows={cohorts}
      rowHeader="Cohort"
      format={(v) => \`\${v}%\`}
    />
  )
}`,

  examples: ["heat-table-default", "heat-table-people"],

  parts: [
    {
      name: "HeatTable",
      summary:
        "The grid, its headers, an optional footer row and the phone readout, drawn from `columns` and `rows`. Shade, labels and keyboard all come from the same values, which is why it takes data rather than parts.",
      props: [
        { name: "columns", type: "string[]", description: "The column names, such as W1 to W9." },
        { name: "phoneColumns", type: "string[]", description: "Shorter column names below 768px, where each column is a narrow square. Defaults to `columns`." },
        { name: "rows", type: "HeatRow[]", description: "Each row: a `label`, optional `meta` shown after it on desktop, and `values` with one number per column. `null` leaves a cell blank." },
        { name: "rowHeader", type: "ReactNode", description: "The name over the row labels, such as Cohort." },
        { name: "format", type: "(value, cell) => string", description: "A value as printed. The shade follows the value, not the printed text." },
        { name: "label", type: "(cell) => string", description: "A cell's accessible name. Defaults to the row, the column and the printed value." },
        { name: "min", type: "number", description: "The value that shades lightest. Defaults to the lowest value." },
        { name: "max", type: "number", description: "The value that shades darkest. Defaults to the highest value." },
        { name: "scale", type: "(value, { min, max }) => number", description: "Maps a value to 0 to 1. Defaults to a straight line from `min` to `max`." },
        { name: "footer", type: "{ label, values }", description: "A summary row under the grid, such as the average. Hidden on a phone." },
        { name: "readout", type: "(cell) => ReactNode", description: "What the line under the grid says about the chosen square on a phone. Defaults to the value, then the row and column." },
        { name: "defaultCell", type: "{ row, column }", description: "The cell chosen at first, which holds the tab stop and fills the phone readout. Defaults to the first filled cell." },
        { name: "containerClassName", type: "string", description: "Class for the element around the grid and the readout." },
      ],
    },
  ],

  notes: [
    {
      title: "One fact per shade",
      body: "A cell's shade is the primary colour mixed into the surface by its place between `min` and `max`. Past the middle the text turns to the primary foreground so it stays readable. Use `heatShade(amount)` to shade a legend the same way.",
    },
    {
      title: "Blank cells",
      body: "A `null` value leaves its cell empty and out of the keyboard path, which gives cohort data its stair edge.",
    },
    {
      title: "Phone",
      body: "Below 768px the grid keeps its shape as squares with no numbers, which fits nine columns at 390px. Tapping a square rings it and fills the readout under the grid.",
    },
  ],

  keyboard: [
    { keys: ["Tab"], does: "Moves into the grid, to the last cell chosen" },
    { keys: ["←", "→", "↑", "↓"], does: "Moves to the next filled cell, skipping blanks" },
    { keys: ["Home", "End"], does: "Moves to the first or last cell in the row" },
    { keys: ["Ctrl", "Home"], does: "Moves to the first cell in the grid" },
    { keys: ["Ctrl", "End"], does: "Moves to the last cell in the grid" },
  ],

  accessibility: [
    "An ARIA grid with one tab stop. Arrows move between cells, so the page's tab order passes it in one step.",
    "Each cell is named by its row, its column and its value, so a screen reader never has to work out the headers.",
    "The number is always printed on desktop, and named on every cell, so the shade is never the only signal.",
    "The phone readout is a polite live region, so tapping a square says what it holds.",
    "Hover and focus rings respect reduced motion.",
  ],
} satisfies ComponentDoc;
