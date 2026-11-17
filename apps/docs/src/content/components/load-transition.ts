import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "load-transition",
  description: "Swaps a skeleton for content without a height jump.",
  usage: `import { LoadTransition } from "@/components/ui/load-transition"

export function Summary({ data, isLoading }) {
  return (
    <LoadTransition loading={isLoading} skeleton={<SummarySkeleton />}>
      <DeploymentSummary data={data} />
    </LoadTransition>
  )
}`,

  examples: ["load-transition-default", "load-transition-thresholds", "load-transition-bare"],

  parts: [
    {
      name: "LoadTransition",
      summary: "A panel that swaps skeleton for content.",
      props: [
        { name: "loading", type: "boolean", description: "Whether data is still loading. The skeleton follows the thresholds." },
        { name: "skeleton", type: "ReactNode", description: "The placeholder shown while waiting." },
        { name: "children", type: "ReactNode", description: "The loaded content." },
        { name: "delay", type: "number", default: "180", description: "Milliseconds of loading before the skeleton appears." },
        { name: "minimum", type: "number", default: "420", description: "Milliseconds the skeleton stays once shown." },
        { name: "radius", type: "number", default: "12", description: "Corner radius in px, applied inline. See **Radius**." },
        { name: "className", type: "string", description: "Merged over the panel's border, background and padding." },
      ],
    },
    {
      name: "useSkeletonVisibility",
      summary: "`useSkeletonVisibility(loading, delay, minimum)` returns whether to show a skeleton.",
      props: [
        { name: "loading", type: "boolean", description: "Whether data is still loading." },
        { name: "delay", type: "number", default: "180", description: "Milliseconds before it turns true." },
        { name: "minimum", type: "number", default: "420", description: "Milliseconds it stays true once on." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Behaviour",
      body: "- The panel animates its height across the swap, so content below does not jump.\n- The skeleton fades out in 120ms; content fades in over 260ms.\n- A load shorter than `delay` shows no skeleton.\n- Once shown, the skeleton stays for `minimum`.",
    },
    {
      title: "Radius",
      body: "Set corners with `radius`, not a class. A class radius stretches during the resize.",
    },
    {
      title: "When to use it",
      body: "- A region whose loaded height differs from its placeholder: a summary, a card, a detail panel.\n- Skip it for full-page loads and for content that streams in piece by piece; it swaps once.",
    },
  ],

  accessibility: [
    "Skeleton and content render as given. Mark a meaningless skeleton aria-hidden or give it a busy label.",
    "Reduced motion makes the resize, travel and crossfade instant; thresholds still apply.",
  ],
} satisfies ComponentDoc;
