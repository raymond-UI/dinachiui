import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "time-slots",
  description: "A day as a track to drag a booking across. Busy time and time already past stop the drag.",
  usage: `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TimeSlots, type TimeSlot } from "@/components/ui/time-slots"

export function Room({ busy }: { busy: TimeSlot[] }) {
  const [slot, setSlot] = useState<TimeSlot | null>(null)
  return (
    <TimeSlots aria-label="Room" timeZone="GMT" busy={busy} value={slot} onValueChange={setSlot}>
      <Button size="sm" disabled={!slot}>Book</Button>
    </TimeSlots>
  )
}`,

  examples: ["time-slots-default", "time-slots-rows"],

  parts: [
    {
      name: "TimeSlots",
      summary: "The day's heading, the track or rows, and the readout with whatever action sits beside it.",
      props: [
        { name: "value", type: "{ start, end } | null", description: "The booking, in minutes since midnight. 10:45 to 12:00 is `{ start: 645, end: 720 }`.", agent: true },
        { name: "defaultValue", type: "{ start, end } | null", description: "Starting booking when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every change, for people and agents, including each step of a drag. details.cancel() refuses it.", agent: true },
        { name: "timeZone", type: "string", description: "Required. Named beside the booking, such as GMT. Nothing converts between zones." },
        { name: "min", type: "number", default: "480", description: "Where the day starts, in minutes. 08:00 by default.", agent: true },
        { name: "max", type: "number", default: "1200", description: "Where the day ends, in minutes. 20:00 by default.", agent: true },
        { name: "step", type: "number", default: "15", description: "Minutes a booking snaps to.", agent: true },
        { name: "busy", type: "{ start, end }[]", description: "Taken time. A booking can't cross it.", agent: true },
        { name: "now", type: "number", description: "The time now, in minutes. Time before it is shaded and can't be booked.", agent: true },
        { name: "minDuration", type: "number", default: "step", description: "The shortest booking, in minutes. Rounded up to a whole number of steps.", agent: true },
        { name: "maxDuration", type: "number", description: "The longest booking, in minutes. The whole day by default. Rounded down to a whole number of steps.", agent: true },
        { name: "date", type: "Date", description: "The day being booked, named above the track." },
        { name: "formatTime", type: "(minutes: number) => string", default: "24-hour HH:MM", description: "How a time reads in the ticks, rows and readout." },
        { name: "layout", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "`horizontal` is a track to drag across. `vertical` is rows of half an hour, or the nearest whole number of steps, to tap. `auto` switches at 768px." },
        { name: "locale", type: "Locale", description: "A date-fns locale for the day's name." },
        { name: "dir", type: '"ltr" | "rtl"', description: "Reading direction. The track and arrow keys follow it." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "name", type: "string", description: "Submits the booking as `HH:MM/HH:MM`." },
        { name: "required", type: "boolean", default: "false", description: "Fails form validation until a time is booked." },
        { name: "children", type: "ReactNode", description: "Sits beside the readout, such as a Book button." },
      ],
    },
  ],

  notes: [
    {
      title: "Minutes and zones",
      body: "Every time is minutes since midnight, in whatever zone `timeZone` names. Convert before you pass `busy` and `now`, and after you read `value`.",
    },
    {
      title: "Pressing the track",
      body: "Pressing free time starts a new booking there, even on top of the current one. Only the handles at either end resize it. Near the end of a free stretch, the new booking runs back from the press so it still fits.",
    },
    {
      title: "Phone and desktop",
      body: "Below 768px the day turns vertical, as half-hour rows. Tap a free row, then a later one to stretch the booking to it. Tapping a lone booked row clears it.",
    },
  ],

  agent: {
    kind: "slider",
    reads: [
      { field: "label", means: 'The aria-label, "Booking" by default.' },
      { field: "value", means: 'The booking as ["HH:MM", "HH:MM"], or nothing.' },
    ],
    actions: [
      { call: 'setValue(["10:45", "12:00"])', does: 'Books a span. "11am to 12:30" works too; null clears it.' },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it. A span that crosses busy time, starts before now, leaves the day, misses the step, or is shorter or longer than allowed is refused with the reason.",
    example: `await agent.act({
  steps: [{ ref: "Room", action: "setValue", args: [["14:00", "15:00"]] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→", "↑", "↓"], does: "Moves the booking a step, past busy time it can't fit beside. Books the first free step when empty" },
    { keys: ["Shift", "←", "→"], does: "Moves the end, to shorten or lengthen it" },
    { keys: ["PageUp", "PageDown"], does: "Moves the booking an hour" },
    { keys: ["Home", "End"], does: "Moves it to the first or last free time it fits" },
    { keys: ["Delete", "Backspace"], does: "Clears the booking" },
    { keys: ["↑", "↓", "Home", "End"], does: "In rows, moves between rows" },
  ],

  accessibility: [
    "The track is a slider. Its value text is the booking with its zone and length, such as 10:45 to 12:00 GMT, 1 h 15 min.",
    "In rows, each row is a button named with its time and whether it is free, booked, busy, past or unavailable. Only one row is in the tab order.",
    "In rows, the readout is a live region, so the booking is announced as it changes. On the track, the slider announces it instead.",
  ],
} satisfies ComponentDoc;
