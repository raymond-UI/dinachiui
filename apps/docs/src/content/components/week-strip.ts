import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "week-strip",
  description: "Days in a row that move a week at a time.",
  usage: `import { useState } from "react"
import { WeekStrip } from "@/components/ui/week-strip"

export function Schedule() {
  const [day, setDay] = useState(new Date())
  return (
    <WeekStrip aria-label="Schedule" value={day} onValueChange={setDay} counts={{ "2026-11-18": 3 }}>
      <Agenda day={day} />
    </WeekStrip>
  )
}`,

  examples: ["week-strip-default", "week-strip-bookings"],


  parts: [
    {
      name: "WeekStrip",
      summary: "The title with Today and week steps, the row of days, and whatever the selected day shows under it.",
      props: [
        { name: "value", type: "Date", description: "Controlled day. Defaults to today.", agent: true },
        { name: "defaultValue", type: "Date", description: "Starting day when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every pick, for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "min", type: "Date", default: "Start of last week", description: "The first day in the strip.", agent: true },
        { name: "max", type: "Date", default: "End of the third week ahead", description: "The last day in the strip.", agent: true },
        { name: "counts", type: "Record<string, number>", description: "How busy each day is, keyed `YYYY-MM-DD`. Up to three dots show under the date." },
        { name: "thresholds", type: "[number, number, number]", description: "Counts at or above each step get one more dot. Defaults to one dot per count, up to three." },
        { name: "formatCount", type: "(count: number) => string", default: '"2 events"', description: "How a day's count reads to screen readers." },
        { name: "locale", type: "Locale", description: "A date-fns locale for day names and the first day of the week." },
        { name: "weekStartsOn", type: "0 to 6", default: "1", description: "The first day of the week, 0 for Sunday. Defaults to the locale's." },
        { name: "dir", type: '"ltr" | "rtl"', description: "Reading direction. Arrow keys follow it." },
        { name: "today", type: "Date", description: "Overrides the current day." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "name", type: "string", description: "Submits the day as `YYYY-MM-DD`." },
        { name: "children", type: "ReactNode", description: "The content under the strip, for the selected day." },
      ],
    },
  ],

  notes: [
    {
      title: "Server rendering",
      body: "Pass `today` when the page renders on a server, so the server and the browser agree on which day it is.",
    },
    {
      title: "Phone and desktop",
      body: "Below 768px the title is the screen's own: large, and Today when it is.",
    },
    {
      title: "Long ranges",
      body: "Only the eight weeks either side of the selected one render, and more join as the strip scrolls toward an end, so a range of a year or more stays light.",
    },
  ],

  agent: {
    kind: "date",
    reads: [
      { field: "label", means: 'The aria-label, "Day" by default.' },
      { field: "value", means: "The selected day as YYYY-MM-DD." },
    ],
    actions: [
      { call: 'setValue("2026-11-20")', does: 'Selects a day. Phrases such as "next fri" work too.' },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it. A day off the strip is refused with its first or last day.",
    example: `await agent.act({
  steps: [{ ref: "Schedule", action: "setValue", args: ["next fri"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Selects the day before or after" },
    { keys: ["PageUp", "PageDown"], does: "Selects the same day a week before or after, or the first or last day when less than a week is left" },
    { keys: ["Home"], does: "Goes back to today" },
    { keys: ["End"], does: "Goes to the last day" },
  ],

  accessibility: [
    "The days are a horizontal listbox; the selected day has aria-selected and is the only one in the tab order.",
    "Each day is named in full, with its count when `counts` is given, such as Wednesday 18 November, 3 events. Days in another year than today's carry the year, and so does the title.",
    "The title is a live region, so the selected day is announced as it changes.",
  ],
} satisfies ComponentDoc;
