import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "progress",
  description: "How far a task has run, as an accessible bar.",
  usage: `import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress"

export function UploadProgress() {
  return (
    <Progress value={40}>
      <ProgressLabel>Upload</ProgressLabel>
      <ProgressValue />
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  )
}`,
  anatomy: `<Progress>
  <ProgressLabel />
  <ProgressValue />
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
</Progress>`,

  examples: ["progress-label", "progress-default", "progress-animated"],

  parts: [
    {
      name: "Progress",
      summary: "Holds the value and exposes it as a progressbar.",
      props: [
        { name: "value", type: "number | null", description: "Current value. `null` makes the bar indeterminate." },
        { name: "min", type: "number", default: "0", description: "The value at an empty bar." },
        { name: "max", type: "number", default: "100", description: "The value at a full bar." },
        { name: "format", type: "Intl.NumberFormatOptions", description: "Number format for ProgressValue and the announced text." },
        { name: "locale", type: "Intl.LocalesArgument", description: "Locale for formatting the value." },
        { name: "getAriaValueText", type: "(formattedValue, value) => string", description: "Text announced in place of the number." },
      ],
    },
    {
      name: "ProgressLabel",
      summary: "The visible name of the bar.",
      props: [{ name: "children", type: "ReactNode", description: "Names the progressbar for screen readers and the agent." }],
    },
    {
      name: "ProgressValue",
      summary: "Shows the formatted value as text.",
      props: [
        { name: "children", type: "(formattedValue, value) => ReactNode", description: "Custom formatting. Both are `null` while indeterminate." },
      ],
    },
    {
      name: "ProgressTrack",
      summary: "The full-width rail behind the indicator.",
      props: [],
    },
    {
      name: "ProgressIndicator",
      summary: "The filled part, sized to the value.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Indeterminate",
      body: "Pass `value={null}` when the amount of work is unknown. The root then sets `data-indeterminate` instead of `data-progressing` or `data-complete`; style the indicator from these.",
    },
    {
      title: "Agent",
      body: "Not registered with the [agent bridge](/docs/components/agent); read from the accessibility tree like any `progressbar`. Listed as `progress` with `value`, `min` and `max`, and no actions. Indeterminate, it has no `value`.\n\n```ts\nagent.snapshot()\n// [{ component: \"progress\", label: \"Upload\", value: 40, min: 0, max: 100, actions: [] }]\n```",
    },
  ],

  accessibility: [
    "The root is a progressbar with aria-valuenow, aria-valuemin and aria-valuemax.",
    "ProgressLabel names the bar through aria-labelledby. Without one, pass aria-label on Progress.",
    "Use getAriaValueText when a percentage is unclear, such as \"3 of 10 files\".",
    "Reduced motion turns off the indicator's width transition.",
  ],
} satisfies ComponentDoc;
