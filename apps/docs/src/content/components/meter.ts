import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "meter",
  description: "A reading within a known range, such as storage used.",
  usage: `import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@/components/ui/meter"

export function StorageMeter() {
  return (
    <Meter value={72}>
      <div className="flex items-center justify-between">
        <MeterLabel>Storage used</MeterLabel>
        <MeterValue />
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  )
}`,
  anatomy: `<Meter>
  <MeterLabel />
  <MeterValue />
  <MeterTrack>
    <MeterIndicator />
  </MeterTrack>
</Meter>`,

  examples: ["meter-label", "meter-default", "meter-levels"],

  parts: [
    {
      name: "Meter",
      summary: "Holds value and range; lays parts out in a grid.",
      props: [
        { name: "value", type: "number", description: "The current reading. Clamped to `min` and `max`.", agent: true },
        { name: "min", type: "number", default: "0", description: "The low end of the range.", agent: true },
        { name: "max", type: "number", default: "100", description: "The high end of the range.", agent: true },
        { name: "format", type: "Intl.NumberFormatOptions", description: "Formats the value. Defaults to a percent of the range." },
        { name: "locale", type: "Intl.LocalesArgument", description: "Locale for formatting the value." },
        { name: "getAriaValueText", type: "(formattedValue, value) => string", description: "Text screen readers announce for the value." },
      ],
    },
    {
      name: "MeterLabel",
      summary: "The visible label; names the meter.",
      props: [{ name: "children", type: "ReactNode", description: "Also the name the agent reads.", agent: true }],
    },
    {
      name: "MeterValue",
      summary: "Shows the formatted value.",
      props: [
        { name: "children", type: "(formattedValue, value) => ReactNode", description: "Renders the value yourself. Defaults to the formatted value." },
      ],
    },
    {
      name: "MeterTrack",
      summary: "The full-width bar behind the indicator.",
      props: [],
    },
    {
      name: "MeterIndicator",
      summary: "The filled part; width follows the value.",
      props: [{ name: "className", type: "string", description: "Recolour it, for example by level." }],
    },
  ],

  notes: [
    {
      title: "Meter or Progress",
      body: "Meter shows a measurement anywhere in its range, such as disk space. For a task moving towards done, use [Progress](/docs/components/progress).",
    },
    {
      title: "Agent",
      body: "Meter does not register with the [agent bridge](/docs/components/agent). The bridge reads it from the accessibility tree as `meter`, with `value`, `min` and `max`, and no actions.\n\n```ts\nagent.snapshot()\n// [{ component: \"meter\", label: \"Storage used\", value: 72, min: 0, max: 100, actions: [] }]\n```",
    },
  ],

  accessibility: [
    "The root has the meter role with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.",
    "MeterLabel names it via `aria-labelledby`; otherwise give the root an `aria-label`.",
    "`aria-valuetext` is the formatted value, or what `getAriaValueText` returns.",
    "Reduced motion turns off the indicator transition.",
  ],
} satisfies ComponentDoc;
