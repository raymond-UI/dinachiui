import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "stagger-list",
  description: "A list whose items arrive one after another, in reading order.",
  usage: `import { StaggerList, StaggerListItem } from "@/components/ui/stagger-list"

const results = ["Frankfurt", "London", "Tokyo"]

export function Results() {
  return (
    <StaggerList>
      {results.map((city) => (
        <StaggerListItem key={city}>{city}</StaggerListItem>
      ))}
    </StaggerList>
  )
}`,
  anatomy: `<StaggerList>
  <StaggerListItem />
</StaggerList>`,

  examples: ["stagger-list-default", "stagger-list-variants", "stagger-list-grid"],

  parts: [
    {
      name: "StaggerList",
      summary: "The `ul` that sequences its items.",
      props: [
        { name: "variant", type: '"rise" | "scale" | "blur"', default: '"rise"', description: "How each item enters." },
        { name: "stagger", type: "number", default: "0.05", description: "Seconds between items. Keep it between 0.03 and 0.08." },
        { name: "delay", type: "number", default: "0", description: "Seconds before the first item." },
        { name: "duration", type: "number", default: "0.3", description: "Seconds for each item's own animation." },
        { name: "distance", type: "number", default: "8", description: "Travel in px. Ignored by `scale`." },
        { name: "startOnView", type: "boolean", default: "true", description: "Starts on scroll into view instead of mount. Runs once." },
      ],
    },
    {
      name: "StaggerListItem",
      summary: "One `li`. Throws outside a StaggerList.",
      props: [{ name: "children", type: "ReactNode", description: "The item's content." }],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Variants",
      body: `- \`rise\` lifts items in from below. Use it for top-to-bottom lists.
- \`scale\` grows items in place. Use it for grids and card walls.
- \`blur\` brings items into focus as they rise. Use it sparingly: it animates a filter, so its cost grows with item count.`,
    },
    {
      title: "When to use it",
      body: "- A list seen for the first time: search results, a dashboard's first paint, a feed's first page.\n- Skip it for lists that re-render on every keystroke, or content scrolled back to.",
    },
    {
      title: "Behaviour",
      body: `- \`blur\` leaves \`filter: blur(0px)\` on each item, which makes it a containing block for fixed-position descendants. Use \`rise\` or \`scale\` if items contain one.
- \`startOnView\` triggers 100px inside the viewport edge, not at a visible fraction.`,
    },
  ],

  accessibility: [
    "Keeps `ul` and `li` semantics.",
    "Reduced motion keeps the fade and stagger; drops travel, scale and blur.",
  ],
} satisfies ComponentDoc;
