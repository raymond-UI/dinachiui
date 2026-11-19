import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "time-slots",
  description: "A day as a track to drag a booking across.",
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
        { name: "timeZone", type: "string", description: "Required. Named beside the booking, such as GMT. When it is an IANA zone such as `Europe/London`, a `now` given as a Date is read in it." },
        { name: "mode", type: '"range" | "single"', default: '"range"', description: "`single` picks one time, such as an arrival, held for `minDuration`. Its value is still `{ start, end }`; forms and agents get `HH:MM`.", agent: true },
        { name: "min", type: "number", default: "480", description: "Where the day starts, in minutes. 08:00 by default.", agent: true },
        { name: "max", type: "number", default: "1200", description: "Where the day ends, in minutes. 20:00 by default.", agent: true },
        { name: "step", type: "number", default: "15", description: "Minutes a booking snaps to.", agent: true },
        { name: "busy", type: "{ start, end }[]", description: "Taken time. A booking can't cross it.", agent: true },
        { name: "now", type: "number | Date", description: "The time now. Time before it is shaded and can't be booked. Minutes, or a Date read in `timeZone` against `date`: a later day has no past, an earlier one is all past.", agent: true },
        { name: "minDuration", type: "number", default: "step", description: "The shortest booking, in minutes. Rounded up to a whole number of steps.", agent: true },
        { name: "maxDuration", type: "number", description: "The longest booking, in minutes. The whole day by default. Rounded down to a whole number of steps.", agent: true },
        { name: "date", type: "Date", description: "The day being booked, named above the track." },
        { name: "formatTime", type: "(minutes: number) => string", default: "24-hour HH:MM", description: "How a time reads in the ticks, rows and readout. Midnight reads 00:00 at either end of the day." },
        { name: "layout", type: '"auto" | "horizontal" | "vertical"', default: '"auto"', description: "`horizontal` is a track to drag across. `vertical` is rows of half an hour, or the nearest whole number of steps, to tap. `auto` switches at 768px." },
        { name: "locale", type: "Locale", description: "A date-fns locale for the day's name." },
        { name: "dir", type: '"ltr" | "rtl"', description: "Reading direction. The track and arrow keys follow it." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "name", type: "string", description: "Submits the booking as `HH:MM/HH:MM`, or `HH:MM` in single mode." },
        { name: "required", type: "boolean", default: "false", description: "Fails form validation until a time is booked." },
        { name: "children", type: "ReactNode", description: "Sits beside the readout, such as a Book button." },
      ],
    },
  ],

  notes: [
    {
      title: "Minutes and zones",
      body: "Every time is minutes since midnight, in whatever zone `timeZone` names. Convert before you pass `busy`, and after you read `value`. Pass `now` as a Date with an IANA `timeZone` and the track works out the time there.",
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
      { field: "value", means: 'The booking as ["HH:MM", "HH:MM"], "HH:MM" in single mode, or nothing.' },
    ],
    actions: [
      { call: 'setValue(["10:45", "12:00"])', does: 'Books a span. "11am to 12:30" works too; null clears it. In single mode one time, "3pm", is enough.' },
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
    "The track is a slider named Time span, or Time in single mode, inside a group carrying the component's label. Its value text is the booking with its zone and length, such as 10:45 to 12:00 GMT, 1 h 15 min.",
    "The slider's description lists busy and past time, since the arrows step over it.",
    "In rows, each row is a button named with its time and whether it is free, booked, busy, past or unavailable. Only one row is in the tab order.",
    "In rows, the readout is a live region, so the booking is announced as it changes. On the track, the slider announces it instead.",
    "Busy and unavailable time is hatched, at 3:1 or more against free time in both themes, so it reads without color. Past time sits behind the now line.",
  ],
} satisfies ComponentDoc;
