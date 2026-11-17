import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "progress-ring",
  description: "A radial progress arc, determinate or indeterminate.",
  usage: `import { ProgressRing } from "@/components/ui/progress-ring"

export function Upload() {
  return <ProgressRing value={64} label="Upload" />
}`,

  examples: ["progress-ring-default", "progress-ring-indeterminate", "progress-ring-sizes"],

  parts: [
    {
      name: "ProgressRing",
      summary: "An SVG arc with the percentage in the middle.",
      props: [
        { name: "value", type: "number", description: "0 to 100. Omit it for the indeterminate arc.", agent: true },
        { name: "label", type: "string", default: "\"Progress\" or \"Loading\"", description: "The accessible name, also read by the agent.", agent: true },
        { name: "size", type: "number", default: "96", description: "Outer diameter, in pixels." },
        { name: "thickness", type: "number", description: "Stroke width in pixels. Scales with size by default." },
        { name: "showValue", type: "boolean", default: "true", description: "Shows the percentage. Ignored when indeterminate." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Value changes",
      body: "The arc springs to each new value from wherever it is, so rapid updates merge into one sweep. The centre number follows the same spring, shared with [number ticker](/docs/components/number-ticker).",
    },
    {
      title: "Indeterminate",
      body: "Omit `value` for an arc that lengthens and shortens while it rotates.",
    },
    {
      title: "When to use it",
      body: "- One operation being waited on, such as an upload, import or quota, or a compact spot with no room for a bar.\n- For progress per row in a list, use [Progress](/docs/components/progress). The arc animates `stroke-dashoffset`, which repaints.\n- Avoid it under about 40px, where the number stops fitting.",
    },
    {
      title: "Agent",
      body: "ProgressRing does not register with the [agent bridge](/docs/components/agent). The bridge reads it from the accessibility tree as `progress` with `value`, `min` and `max`, and no actions. While indeterminate it is a status and is not listed.\n\n```ts\nagent.snapshot()\n// [{ component: \"progress\", label: \"Upload\", value: 64, min: 0, max: 100, actions: [] }]\n```",
    },
  ],

  accessibility: [
    "A determinate ring is a progressbar with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext`, such as \"64 percent\".",
    "An indeterminate ring is a status with no value.",
    "`label` is the accessible name; defaults to \"Progress\" or \"Loading\".",
    "The centre number is aria-hidden; the ring announces the value.",
    "Reduced motion jumps to the value and shows a static gap instead of the sweep.",
  ],
} satisfies ComponentDoc;
