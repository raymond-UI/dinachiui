import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "scroll-reveal",
  description: "A block that wipes into view when first scrolled to.",
  usage: `import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function Features() {
  return (
    <ScrollReveal>
      <FeatureGrid />
    </ScrollReveal>
  )
}`,

  examples: ["scroll-reveal-default", "scroll-reveal-direction", "scroll-reveal-cascade"],

  parts: [
    {
      name: "ScrollReveal",
      summary: "Wraps the block; takes any `motion.div` prop.",
      props: [
        { name: "direction", type: '"up" | "down" | "left" | "right"', default: '"up"', description: "Direction of travel. The aperture opens against it." },
        { name: "distance", type: "number", default: "8", description: "Travel in pixels." },
        { name: "duration", type: "number", default: "0.3", description: "Seconds. The easing front-loads the travel." },
        { name: "delay", type: "number", default: "0", description: "Seconds after entering view. Keep cascade steps between 0.03 and 0.08." },
        { name: "repeat", type: "boolean", default: "false", description: "Replays each time the block re-enters view." },
        { name: "margin", type: "string", default: '"0px 0px -100px 0px"', description: 'Root margin for the trigger. Pass `"0px"` for trailing content with nothing below it.' },
        { name: "amount", type: 'number | "some" | "all"', default: '"some"', description: "How much must be visible. A block taller than the root never reaches a number." },
        { name: "root", type: "RefObject<Element>", description: "A scrollable ancestor to observe instead of the viewport." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Direction",
      body: "The aperture opens against the travel. Use `up` for content read top to bottom.\n\n| Direction | Content travels | Aperture opens from |\n| --- | --- | --- |\n| `up` | Up | Top |\n| `down` | Down | Bottom |\n| `left` | Left | Right |\n| `right` | Right | Left |",
    },
    {
      title: "When to use it",
      body: "- One hero block or feature grid the reader has not seen yet.\n- Skip it for content reached by deep link or revisited, and for content that must show without JS: the hidden state is a real style.\n- For a list, use [Stagger List](/docs/components/stagger-list).",
    },
    {
      title: "Behaviour",
      body: "- Reveals once by default. With `repeat`, leaving view resets the block instantly.\n- A block shorter than the `margin` inset at the very bottom of the page never reveals. Pass `\"0px\"` for trailing content.\n- `root` must be an ancestor of the content, or the block stays hidden. Set it inside a dialog body, sidebar or other scroll container.\n- A plain wrapper `div` is observed. `ref`, `className` and other props go to the inner animated element.",
    },
  ],

  accessibility: [
    "Reduced motion keeps the fade, drops the wipe and travel. `<MotionConfig reducedMotion>` is honoured.",
    "The hidden block stays in the DOM, so screen readers reach it early.",
  ],
} satisfies ComponentDoc;
