import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "month-picker",
  description: "Months a year at a time, for billing and reporting periods.",
  usage: `import { useState } from "react"
import { MonthPicker } from "@/components/ui/month-picker"

export function BillingMonth() {
  const [month, setMonth] = useState<Date | null>(null)
  return <MonthPicker aria-label="Billing month" value={month} onValueChange={setMonth} max={new Date()} />
}`,

  examples: ["month-picker-default", "month-picker-range"],

  parts: [
    {
      name: "MonthPicker",
      summary: "The year header, the twelve months and, in range mode, a readout of the span.",
      props: [
        { name: "mode", type: '"single" | "range"', default: '"single"', description: "One month, or a from and to." },
        { name: "value", type: "Date | null | DateRange", description: "Controlled value. A month is the first of the month. Its type follows `mode`.", agent: true },
        { name: "defaultValue", type: "Date | null | DateRange", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every pick, for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "min", type: "Date", description: "The earliest month that can be picked.", agent: true },
        { name: "max", type: "Date", description: "The latest month that can be picked. Set it to today for reports.", agent: true },
        { name: "isMonthDisabled", type: "(month: Date) => boolean", description: "Blocks single months. Called with the first of the month.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "locale", type: "Locale", description: "A date-fns locale for month names." },
        { name: "dir", type: '"ltr" | "rtl"', description: "Reading direction. Arrow keys follow it." },
        { name: "today", type: "Date", description: "Overrides the current day. Its month carries a ring." },
        { name: "name", type: "string", description: "Submits `YYYY-MM`, or `YYYY-MM/YYYY-MM` for a range." },
        { name: "required", type: "boolean", default: "false", description: "Fails form validation with no month." },
      ],
    },
  ],

  notes: [
    {
      title: "Server rendering",
      body: "Pass `today` when the page renders on a server, so the server and the browser agree on which month it is.",
    },
    {
      title: "Picking a span",
      body: "The first pick starts the span and the second ends it. A third pick, or one before the start, starts again. The readout names both years only when the span crosses one.",
    },
  ],

  agent: {
    kind: "date",
    reads: [
      { field: "label", means: 'The aria-label, "Month" or "Months" by default.' },
      { field: "value", means: "YYYY-MM, or [from, to] in range mode, [from] while the end is still to pick. Absent when empty." },
      { field: "multiple", means: "True in range mode." },
    ],
    actions: [
      { call: 'setValue("2026-03")', does: 'Picks a month. "mar 2026" and "march" work too.' },
      { call: 'setValue(["2026-06", "2026-11"])', does: 'Picks a span in range mode. "jun to nov 2026" works too.' },
      { call: "clear()", does: "Empties the value." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it. A month outside `min` and `max`, a blocked month, or a span that ends before it starts is refused with the reason.",
    example: `await agent.act({
  steps: [{ ref: "Billing month", action: "setValue", args: ["2026-10"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves a month, crossing into the next or last year" },
    { keys: ["↑", "↓"], does: "Moves a quarter" },
    { keys: ["PageUp", "PageDown"], does: "Moves a year" },
    { keys: ["Home", "End"], does: "Goes to January or December, or the nearest month allowed" },
    { keys: ["Enter", "Space"], does: "Picks the month" },
  ],

  accessibility: [
    "Each month is a toggle button named with its year, such as March 2026; picked months have aria-pressed.",
    "This month has aria-current=\"date\". Blocked months have aria-disabled and stay focusable.",
    "Only one month is in the tab order. The year above the grid follows focus and is announced when it changes. It is not a heading, so it never breaks the page's outline.",
    "The range readout is a live region.",
  ],
} satisfies ComponentDoc;
