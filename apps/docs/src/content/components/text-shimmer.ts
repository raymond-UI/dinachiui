import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "text-shimmer",
  description: "A shimmering label for work in progress.",
  usage: `import { TextShimmer } from "@/components/ui/text-shimmer"

export function Thinking({ pending }: { pending: boolean }) {
  return pending ? <TextShimmer>Thinking…</TextShimmer> : null
}`,

  examples: ["text-shimmer-default", "text-shimmer-variants", "text-shimmer-pending", "text-shimmer-dim"],

  parts: [
    {
      name: "TextShimmer",
      summary: "A `role=\"status\"` span that loops while mounted.",
      props: [
        { name: "variant", type: '"sweep" | "pulse"', default: '"sweep"', description: "A highlight band across the text, or the whole label pulsing." },
        { name: "duration", type: "number", default: "1.6 sweep, 1.8 pulse", description: "Seconds for one cycle." },
        { name: "dim", type: "number", default: "0.7", description: "Brightness of un-lit text, 0 to 1. Keep it readable." },
      ],
    },
  ],

  notes: [
    {
      title: "Mounting",
      body: "It loops while mounted. Mount it when the work starts; unmount it when the work lands.",
    },
    {
      title: "Variants",
      body: `- \`sweep\` for label-sized text.
- \`pulse\` for dense or small text. It animates only opacity, so it is cheaper.

Both use \`currentColor\` and follow the theme.`,
    },
    {
      title: "Size",
      body: "`sweep` animates `background-position`, which repaints the box every frame. Use it on a label, never a paragraph.",
    },
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
  ],

  accessibility: [
    "The span has `role=\"status\"`.",
    "Reduced motion stops the loop; the dim colour remains.",
  ],
} satisfies ComponentDoc;
