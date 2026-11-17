import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "date-range-picker",
  description: "A button that names its range, opening presets beside a calendar. Nothing changes until Apply.",
  usage: `import { useState } from "react"
import { type DateRange } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export function Period() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null })
  return <DateRangePicker aria-label="Period" value={range} onValueChange={setRange} max={new Date()} />
}`,

  examples: ["date-range-picker-default", "date-range-picker-future"],

  parts: [
    {
      name: "DateRangePicker",
      summary: "The trigger, the presets, the calendar and the footer with Cancel and Apply.",
      props: [
        { name: "value", type: "DateRange", description: "Controlled `{ from, to }`.", agent: true },
        { name: "defaultValue", type: "DateRange", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on Apply, not while a range is being picked. details.cancel() refuses it.", agent: true },
        { name: "presets", type: "{ label: string; value: DateRange }[]", description: "Defaults to `pastPresets(today)`: today, yesterday, the last 7 and 30 days, this month and last month. Pass `[]` for none. Presets outside the bounds are dropped.", agent: true },
        { name: "formatRange", type: "({ from, to }) => string", default: "11 to 17 Nov 2026", description: "How a range reads on the trigger and in the footer." },
        { name: "min", type: "Date", description: "The earliest day.", agent: true },
        { name: "max", type: "Date", description: "The latest day. Set it to today for reports.", agent: true },
        { name: "isDateDisabled", type: "(date: Date) => boolean", description: "Blocks single days. A range can't run across one.", agent: true },
        { name: "presentation", type: '"auto" | "popover" | "drawer"', default: '"auto"', description: "A popover from 768px up and a drawer below, unless one is named." },
        { name: "label", type: "string", default: '"Date range"', description: "Names the popover and titles the drawer." },
        { name: "placeholder", type: "string", default: '"Pick dates"', description: "The trigger's text with no range." },
        { name: "name", type: "string", description: "Submits the range as `YYYY-MM-DD/YYYY-MM-DD`." },
        { name: "required", type: "boolean", default: "false", description: "Fails form validation without a range, and points the browser at the trigger." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "weekNumbers, locale, weekStartsOn, dir, today", type: "As Calendar", description: "Passed to the calendar." },
      ],
    },
  ],

  notes: [
    {
      title: "Server rendering",
      body: "Pass `today` when the page renders on a server, so the server and the browser agree on which day it is.",
    },
    {
      title: "Presets and Custom",
      body: "Picking on the calendar switches the preset to Custom. A preset range names itself on the trigger with its dates beside it; a custom one shows its dates. Pressing Custom clears the range to start again.",
    },
    {
      title: "Apply and Cancel",
      body: "The range is a draft until Apply, which stays off until the range has an end. Cancel, Esc and a click outside all leave the applied range as it was. While you pick the end, the footer counts the days to the one under the pointer.",
    },
  ],

  agent: {
    kind: "date",
    reads: [
      { field: "label", means: "The trigger's aria-label." },
      { field: "value", means: "[from, to] as YYYY-MM-DD, or absent when empty." },
      { field: "items", means: "The preset labels, any of which setValue accepts." },
      { field: "multiple", means: "Always true: the value is a list." },
    ],
    actions: [
      { call: 'setValue("Last 7 days")', does: "Applies a preset by its label." },
      { call: 'setValue(["2026-11-02", "2026-11-08"])', does: 'Applies two dates. "2 nov to 8 nov" works too.' },
      { call: "clear()", does: "Empties the range." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it. A range that ends before it starts, falls outside `min` and `max`, or runs across a blocked day is refused with the reason.",
    example: `await agent.act({
  steps: [{ ref: "Period", action: "setValue", args: ["Last 30 days"] }],
})`,
  },

  keyboard: [
    { keys: ["Enter", "Space"], does: "Opens the picker, or sets the start then the end on a day" },
    { keys: ["Esc"], does: "Closes without changing the range" },
    { keys: ["Tab"], does: "Moves between presets, the calendar and the footer" },
  ],

  accessibility: [
    "The trigger's name holds the range, after its label when one is given.",
    "Presets are toggle buttons; the active one has aria-pressed.",
    "The footer is a live region, so the range and day count are announced as they change.",
  ],
} satisfies ComponentDoc;
