import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "date-picker",
  description: "A date field you type into. It reads next fri, 21 nov or in 2 weeks, and keeps a calendar one press away.",
  usage: `import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

export function DueDate() {
  const [due, setDue] = useState<Date | null>(null)
  return <DatePicker aria-label="Due date" value={due} onValueChange={setDue} min={new Date()} />
}`,

  examples: ["date-picker-default", "date-picker-weekdays"],

  parts: [
    {
      name: "DatePicker",
      summary: "The field, the calendar button, the line under the field, and the popover or drawer.",
      props: [
        { name: "value", type: "Date | null", description: "Controlled value, a day at local midnight.", agent: true },
        { name: "defaultValue", type: "Date | null", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs when a day commits: on Enter, on leaving the field, on a calendar pick, or on the drawer's button. details.cancel() refuses it.", agent: true },
        { name: "min", type: "Date", description: "The earliest day. Typing an earlier one shows why it can't be used.", agent: true },
        { name: "max", type: "Date", description: "The latest day.", agent: true },
        { name: "isDateDisabled", type: "(date: Date) => boolean", description: "Blocks single days, typed or picked.", agent: true },
        { name: "parseDate", type: "(text, { today }) => Date | null", description: "Replaces the parser, for other languages or formats." },
        { name: "formatDate", type: "(date: Date) => string", default: "Fri, 21 Nov 2026", description: "How a committed day reads in the field." },
        { name: "presets", type: "{ label: string; value: Date }[]", description: "Chips in the phone drawer. Defaults to today, tomorrow, Saturday, next Monday and in a week. Blocked ones are dropped." },
        { name: "presentation", type: '"auto" | "popover" | "drawer"', default: '"auto"', description: "A popover from 768px up and a drawer below, unless one is named." },
        { name: "label", type: "string", default: '"Choose a date"', description: "Names the calendar button and popover, and titles the drawer." },
        { name: "confirmLabel", type: "string", default: '"Set date"', description: "The drawer's button." },
        { name: "placeholder", type: "string", default: '"next fri or 21 nov"', description: "Shows what can be typed." },
        { name: "name", type: "string", description: "Submits the day with a form as `YYYY-MM-DD`." },
        { name: "required", type: "boolean", default: "false", description: "Validated on the field itself, so the browser points at it." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "weekNumbers, locale, weekStartsOn, dir, today", type: "As Calendar", description: "Passed to the calendar. `locale` also sets how 3/12 is read." },
      ],
    },
  ],

  notes: [
    {
      title: "Typing first",
      body: "The line under the field shows the day it reads before anything commits, and how far away it is. Text that isn't a date, or a day that can't be picked, says why there and marks the field invalid; it is never thrown away. Esc puts back the last committed day.",
    },
    {
      title: "On phones",
      body: "Below 768px the calendar opens in a drawer with its own field, preset chips and a confirm button. Nothing commits until that button is pressed, so swiping the drawer away leaves the value as it was.",
    },
  ],

  agent: {
    kind: "date",
    reads: [
      { field: "label", means: "The field's aria-label." },
      { field: "value", means: "YYYY-MM-DD, or absent when empty." },
      { field: "invalid, errors", means: "Set while the field holds text that doesn't read, with the message the person sees." },
      { field: "disabled", means: "True when the picker is blocked." },
    ],
    actions: [
      { call: 'setValue("2026-12-24")', does: "Commits the day. Phrases work too: next fri, in 2 weeks, 21 nov." },
      { call: "clear()", does: "Empties the value." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it. Days the field would refuse are refused with the same words.",
    example: `await agent.act({
  steps: [{ ref: "Due date", action: "setValue", args: ["next fri"] }],
})`,
  },

  keyboard: [
    { keys: ["Enter"], does: "Commits what the field reads" },
    { keys: ["↓"], does: "Opens the calendar on the picked day" },
    { keys: ["Esc"], does: "Closes the calendar, or puts back the last committed day" },
    { keys: ["Tab"], does: "Commits and moves on" },
  ],

  accessibility: [
    "The line under the field is a live region tied to the field by aria-describedby, so the reading is announced as you type.",
    "An unreadable entry sets aria-invalid and the field's validation message.",
    "The calendar button's name includes the committed day.",
    "Picking a day returns focus to the field.",
  ],
} satisfies ComponentDoc;
