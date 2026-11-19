import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "calendar",
  description: "A month grid for picking a day, several days or a range.",
  usage: `import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

export function DueDate() {
  const [day, setDay] = useState<Date | null>(null)
  return <Calendar aria-label="Due date" value={day} onValueChange={setDay} />
}`,

  examples: ["calendar-default", "calendar-range", "calendar-multiple"],

  parts: [
    {
      name: "Calendar",
      summary: "The weekday header, the months and the Today button.",
      props: [
        { name: "mode", type: '"single" | "multiple" | "range"', default: '"single"', description: "One day, a set of days, or a from and to." },
        { name: "value", type: "Date | null | Date[] | DateRange", description: "Controlled value. Its type follows `mode`.", agent: true },
        { name: "defaultValue", type: "Date | null | Date[] | DateRange", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every pick, for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "layout", type: '"scroll" | "paged"', default: '"scroll"', description: "Scroll months as a column, or page them with arrows." },
        { name: "numberOfMonths", type: "number", default: "1", description: "Months side by side in the paged layout." },
        { name: "captionLayout", type: '"label" | "dropdown"', default: '"label"', description: "`dropdown` turns each month heading into month and year selects, for dates years away like a birthday. Years run from `min` to `max`, else a century back and twenty years ahead." },
        { name: "min", type: "Date", description: "The earliest day that can be picked. Agents are refused before it.", agent: true },
        { name: "max", type: "Date", description: "The latest day that can be picked. Agents are refused after it.", agent: true },
        { name: "isDateDisabled", type: "(date: Date) => boolean", description: "Blocks single days, such as weekends. A range can't run across one.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "weekNumbers", type: "boolean", default: "false", description: "Shows week numbers before each week: ISO 8601 when weeks start on Monday, else the locale's." },
        { name: "locale", type: "Locale", description: "A date-fns locale for month and weekday names." },
        { name: "weekStartsOn", type: "0 to 6", default: "1", description: "The first day of the week, 0 for Sunday. Defaults to the locale's." },
        { name: "dir", type: '"ltr" | "rtl"', description: "Reading direction. Arrow keys follow it." },
        { name: "today", type: "Date", description: "Overrides the current day, for tests and other time zones." },
        { name: "onPreview", type: "(range: DateRange | null) => void", description: "The range under the pointer while it waits for an end." },
        { name: "name", type: "string", description: "Submits the value with a form, as `YYYY-MM-DD` or `YYYY-MM-DD/YYYY-MM-DD`." },
        { name: "required", type: "boolean", default: "false", description: "A picked day can't be unpicked by pressing it again. The hidden input is not validated; use a picker for a required field." },
        { name: "autoFocus", type: "boolean", default: "false", description: "Focuses the picked day, or today, on mount." },
        { name: "allowDisabledEnd", type: "boolean", default: "false", description: "Lets a range end on the first disabled day after its start, as a stay checks out on a booked night. That day still can't start a range.", agent: true },
        { name: "renderDay", type: "(date: Date) => ReactNode", description: "Short content under a day's number, such as a price." },
        { name: "dayClassName", type: "(date: Date) => string | undefined", description: "Classes for a day's button, such as a sold-out style." },
        { name: "describeDay", type: "(date: Date) => string | undefined", description: "Words added to a day's name, such as \"sold out\", so it is heard as well as seen." },
      ],
    },
  ],

  notes: [
    {
      title: "What a day is",
      body: "A day is a `Date` at local midnight, so it names the same calendar day wherever it is read. Nothing converts time zones. Forms receive `YYYY-MM-DD`, and `toISODate` gives you the same string.",
    },
    {
      title: "Scrolling months",
      body: "The scroll layout renders a window of months around the value and adds more as you near either end, stopping at `min` and `max`. The Today button appears once today has scrolled out of view. Use `layout=\"paged\"` to embed the calendar where a scroll area doesn't fit.",
    },
    {
      title: "Ranges and blocked days",
      body: "A range can't run across a day that can't be picked. The preview stops short of one, and pressing past it starts a new range with the reason `range-blocked`, which you can cancel or explain. A value set from outside that breaks the rule marks the calendar `data-invalid` and paints the blocked days inside the band.",
    },
    {
      title: "Date helpers",
      body: "`calendar.tsx` also exports the helpers the date components share: `parseDate` reads what people type (today, next fri, in 2 weeks, 21 nov, 3/12, read in the order the page's language writes dates; a two-digit year lands inside `min` and `max`, else up to twenty years ahead), plus `toISODate`, `fromISODate`, `isSameDay`, `addDays`, `daysBetween` and `isoWeek`.",
    },
  ],

  agent: {
    kind: "date",
    reads: [
      { field: "label", means: "The calendar's aria-label." },
      { field: "value", means: "YYYY-MM-DD, a list of them in multiple mode, or [from, to] for a range." },
      { field: "multiple", means: "True in multiple and range modes, where the value is a list." },
      { field: "disabled", means: "True when the calendar is blocked." },
      { field: "invalid", means: "True when the value names a day that can't be picked, or a range runs across one." },
    ],
    actions: [
      { call: 'setValue("2026-12-24")', does: "Picks the day and scrolls to it. Phrases work too: next fri, in 2 weeks, 21 nov." },
      { call: 'setValue(["2026-12-21", "2026-12-24"])', does: "Sets a range, or the days in multiple mode. Refuses a range that ends before it starts." },
      { call: "clear()", does: "Empties the value." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told the app refused. Days outside `min` and `max`, days `isDateDisabled` blocks, and text that isn't a date are refused with the reason.",
    example: `await agent.act({
  steps: [{ ref: "Due date", action: "setValue", args: ["next fri"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves to the previous or next day" },
    { keys: ["↑", "↓"], does: "Moves by a week" },
    { keys: ["Page Up", "Page Down"], does: "Moves by a month, stopping at `min` and `max` and stepping off days that can't be picked" },
    { keys: ["Shift"], does: "Held with Page Up or Page Down, moves by a year" },
    { keys: ["Home", "End"], does: "Moves to the start or end of the week" },
    { keys: ["Enter", "Space"], does: "Picks the focused day" },
  ],

  accessibility: [
    "Each month is a grid. Every day is a button whose name is the full date.",
    "Picked days, and every day inside a picked range, carry aria-selected. A previewed range is drawn but not announced.",
    "Only one day is in the tab order: the picked day, else today. Arrows move from there.",
    "Today is marked with a dot as well as its name, not colour alone.",
    "The range band is a primary tint with a 3:1 edge against the surface, in light and dark.",
    "The paged arrows are plain buttons, Previous month and Next month, not a navigation landmark.",
    "If scrolling drops the month holding focus, focus moves to the nearest day still shown.",
    "Reduced motion turns off the smooth scroll to today.",
  ],
} satisfies ComponentDoc;
