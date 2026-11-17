import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "slider",
  description: "A number or range on a track, set by drag, keyboard or agent.",
  usage: `import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider"

export function VolumeSlider() {
  return (
    <Slider defaultValue={50}>
      <SliderLabel>Volume</SliderLabel>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}`,
  anatomy: `<Slider>
  <SliderLabel />
  <SliderValue />
  <SliderControl>
    <SliderTrack>
      <SliderRange />
      <SliderThumb />
    </SliderTrack>
  </SliderControl>
</Slider>`,

  examples: ["slider-default", "slider-value", "slider-range", "slider-step", "slider-disabled"],

  parts: [
    {
      name: "Slider",
      summary: "Holds the value, the bounds and the step.",
      props: [
        { name: "value", type: "number | number[]", description: "Controlled value. An array gives one thumb per entry." },
        { name: "defaultValue", type: "number | number[]", default: "min", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every move, for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "onValueCommitted", type: "(value, details) => void", description: "Runs when a drag ends, and once after an agent's change.", agent: true },
        { name: "min", type: "number", default: "0", description: "The lowest value. Agents are refused below it.", agent: true },
        { name: "max", type: "number", default: "100", description: "The highest value. Agents are refused above it.", agent: true },
        { name: "step", type: "number", default: "1", description: "The increment. Agent values snap to it.", agent: true },
        { name: "largeStep", type: "number", default: "10", description: "The increment for Page Up, Page Down and Shift with an arrow." },
        { name: "minStepsBetweenValues", type: "number", default: "0", description: "Keeps range thumbs this many steps apart." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "The direction of the track." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "format", type: "Intl.NumberFormatOptions", description: "How SliderValue and the announced text format the number." },
        { name: "name", type: "string", description: "Submits the value with a form." },
      ],
    },
    {
      name: "SliderLabel",
      summary: "The visible label, tied to the thumbs.",
      props: [{ name: "children", type: "ReactNode", description: "Also the name the agent reads.", agent: true }],
    },
    {
      name: "SliderValue",
      summary: "Shows the current value as text.",
      props: [
        { name: "children", type: "(formattedValues, values) => ReactNode", description: "Formats the values yourself, for example a range as `20 to 80`." },
      ],
    },
    {
      name: "SliderControl",
      summary: "The area that takes pointer input.",
      props: [],
    },
    {
      name: "SliderTrack",
      summary: "The rail the thumbs move along.",
      props: [],
    },
    {
      name: "SliderRange",
      summary: "The filled part of the track.",
      props: [],
    },
    {
      name: "SliderThumb",
      summary: "A draggable handle, one per value.",
      props: [
        { name: "index", type: "number", description: "Which value this thumb holds. Required with more than one thumb." },
        { name: "aria-label", type: "string", description: "Names the thumb. The agent uses it when the slider has no label.", agent: true },
        { name: "getAriaValueText", type: "(formattedValue, value, index) => string", description: "The text screen readers announce for this thumb." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks this thumb only." },
      ],
    },
    {
      name: "SliderDirectionProvider",
      summary: "Sets text direction for arrow keys.",
      props: [{ name: "direction", type: '"ltr" | "rtl"', default: '"ltr"', description: "The reading direction." }],
    },
  ],

  notes: [
    {
      title: "Single value or range",
      body: "A number gives one thumb and an array gives a range. In a range, `onValueChange` receives an array, and each `SliderThumb` needs its `index`.",
    },
    {
      title: "Naming a range",
      body: "Without a `SliderLabel`, the agent lists a range under its first thumb's `aria-label`. Add a `SliderLabel` or an `aria-label` on `Slider` to name the whole control.",
    },
  ],

  agent: {
    kind: "slider",
    reads: [
      { field: "label", means: "The SliderLabel or the slider's aria-label, else the first thumb's aria-label." },
      { field: "value", means: "The number, or [low, high] for a range." },
      { field: "min / max / step", means: "The bounds and the increment." },
      { field: "disabled", means: "True when the slider is blocked." },
    ],
    actions: [
      {
        call: "setValue(60)",
        does: "Snaps to the step. Rejects values out of range, values that are not numbers, and a range sent out of order or with the wrong count.",
      },
      { call: "setValue([20, 80])", does: "Sets both ends of a range at once." },
    ],
    refusal:
      "An agent's change runs through onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told the app refused. A disabled slider refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Volume", action: "setValue", args: [60] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves the focused thumb by one step" },
    { keys: ["↑", "↓"], does: "Moves the focused thumb by one step" },
    { keys: ["Shift"], does: "Held with an arrow, moves by the large step" },
    { keys: ["Page Up", "Page Down"], does: "Moves by the large step" },
    { keys: ["Home", "End"], does: "Jumps to the minimum or maximum, or up to the neighbouring thumb in a range" },
  ],

  accessibility: [
    "Each thumb holds a range input that announces its value and bounds.",
    "Name it with a SliderLabel or an aria-label per thumb. The agent reads the same name.",
    "In a range, label each thumb, for example \"Minimum price\" and \"Maximum price\".",
    "Reduced motion turns off the thumb's grow on drag.",
  ],
} satisfies ComponentDoc;
