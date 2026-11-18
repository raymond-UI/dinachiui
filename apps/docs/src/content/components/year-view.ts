import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "year-view",
  description: "A year of days shaded by how much happened on each.",
  usage: `import { useState } from "react"
import { YearView } from "@/components/ui/year-view"

export function Deploys({ counts }: { counts: Record<string, number> }) {
  const [day, setDay] = useState<Date | null>(null)
  return <YearView aria-label="Deploys" counts={counts} value={day} onValueChange={setDay} />
}`,

  examples: ["year-view-default", "year-view-months"],

  parts: [
    {
      name: "YearView",
      summary: "The total, the grid of days and a readout of the picked day.",
      props: [
        { name: "counts", type: "Record<string, number>", description: "How many things happened each day, keyed `YYYY-MM-DD`." },
        { name: "value", type: "Date | null", description: "The picked day.", agent: true },
        { name: "defaultValue", type: "Date | null", description: "Starting day when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every pick, for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "end", type: "Date", default: "today", description: "The last day shown. The view covers the 53 weeks up to its week.", agent: true },
        { name: "thresholds", type: "[number, number, number, number]", description: "Counts at or above each step get shades 1 to 4. Defaults to quarters of the busiest day." },
        { name: "formatCount", type: "(count: number) => string", default: '"3 events"', description: "How a count reads in the heading, the readout and each day's name." },
        { name: "heading", type: "(total: number) => ReactNode", description: "The line above the grid. Defaults to the total for the year shown." },
        { name: "layout", type: '"auto" | "weeks" | "months"', default: '"auto"', description: "Weeks side by side, or months stacked with squares big enough to tap. `auto` switches at 768px. Months scroll inside a box `--year-view-height` tall, 22rem by default." },
        { name: "locale", type: "Locale", description: "A date-fns locale for day and month names and the first day of the week." },
        { name: "weekStartsOn", type: "0 to 6", default: "1", description: "The first day of the week, 0 for Sunday. Defaults to the locale's." },
        { name: "dir", type: '"ltr" | "rtl"', description: "Reading direction. Arrow keys follow it." },
        { name: "today", type: "Date", description: "Overrides the current day. Days after it are outlined and can't be picked.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "name", type: "string", description: "Submits the picked day as `YYYY-MM-DD`." },
      ],
    },
  ],

  notes: [
    {
      title: "Server rendering",
      body: "Pass `today` when the page renders on a server, so the server and the browser agree on which day it is.",
    },
    {
      title: "Color",
      body: "The shades mix `--success` into `--muted`. Set `--year-view-color` on the view, or any parent, to shade with another color.",
    },
    {
      title: "Weeks and months",
      body: "The weeks layout fits a year across a desktop and scrolls to the latest week. On a phone the months layout stacks months latest first, so days are big enough to tap.",
    },
  ],

  agent: {
    kind: "date",
    reads: [
      { field: "label", means: 'The aria-label, "Activity" by default.' },
      { field: "value", means: "The picked day as YYYY-MM-DD, or absent." },
    ],
    actions: [
      { call: 'setValue("2026-11-11")', does: "Picks a day. Pressing a picked day clears it, for people too." },
      { call: "clear()", does: "Clears the pick." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it. A day before the view starts, or after today, is refused with the reason.",
    example: `await agent.act({
  steps: [{ ref: "Deploys", action: "setValue", args: ["2026-11-11"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Picks the day a week back or on in the weeks layout, or a day back or on in the months layout" },
    { keys: ["↑", "↓"], does: "Picks the day before or after in the weeks layout, or a week back or on in the months layout" },
    { keys: ["Enter", "Space"], does: "Picks the focused day, or clears it when it is already picked" },
  ],

  accessibility: [
    "Each day is a toggle button named with its date and count, such as Wednesday 11 November 2026: 8 events.",
    "Days after today, or after `end`, have aria-disabled. Only one day is in the tab order.",
    "Shade is never the only signal: every count is in the day's name and in the readout. Only the top shade reaches 3:1 against the page, so don't rely on the lighter ones to carry meaning.",
    "The readout is a live region.",
  ],
} satisfies ComponentDoc;
