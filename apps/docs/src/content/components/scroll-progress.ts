import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "scroll-progress",
  description: "A thin bar that fills as a page or container scrolls.",
  usage: `import { ScrollProgress } from "@/components/ui/scroll-progress"

export function Article() {
  return <ScrollProgress />
}`,

  examples: ["scroll-progress-default", "scroll-progress-smooth", "scroll-progress-styled"],

  parts: [
    {
      name: "ScrollProgress",
      summary: "The bar. Any `motion.div` prop reaches it.",
      props: [
        { name: "containerRef", type: "RefObject<HTMLElement> | string", description: "Container to track: a ref or CSS selector. Omit to track the page." },
        { name: "smooth", type: "boolean", default: "true", description: "Smooths the bar with a spring. False tracks 1:1." },
        { name: "fixed", type: "boolean", default: "true", description: "Pins the bar to the top of the viewport. False to place it yourself." },
        { name: "className", type: "string", description: "Height, colour and position. Defaults to `h-0.5 bg-primary`." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "When to use it",
      body: "- Articles, changelogs and documentation pages.\n- Skip it on short pages.",
    },
    {
      title: "Scroll containers",
      body: "When an inner element scrolls instead of the document, point the bar at it or it stays at zero.\n\n```tsx\nconst scrollport = useRef<HTMLDivElement>(null)\n\n<ScrollProgress containerRef={scrollport} fixed={false} />\n<article ref={scrollport} className=\"overflow-y-auto\">…</article>\n```\n\nA CSS selector also works, for layouts with no ref available. A selector that matches nothing falls back to the page without throwing.\n\n```tsx\n<ScrollProgress containerRef=\"#reader\" />\n```",
    },
    {
      title: "Behaviour",
      body: "- Tracks vertical scroll only.\n- The spring is critically damped, so it never overshoots.",
    },
  ],

  accessibility: [
    "The bar is aria-hidden; the scrollbar already exposes progress.",
    "A fixed bar has pointer-events-none, so it never blocks clicks.",
    "Reduced motion drops the spring and tracks scroll 1:1.",
    "Honours an app-level `<MotionConfig reducedMotion>`.",
  ],
} satisfies ComponentDoc;
