import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "marquee",
  description: "A looping strip that moves only when content overflows.",
  usage: `import { Marquee } from "@/components/ui/marquee"

const logos = ["Vercel", "Linear", "Supabase", "Resend"]

export function Logos() {
  return (
    <Marquee>
      {logos.map((name) => (
        <span key={name}>{name}</span>
      ))}
    </Marquee>
  )
}`,

  examples: ["marquee-default", "marquee-direction", "marquee-links", "marquee-fits"],

  parts: [
    {
      name: "Marquee",
      summary: "Lays out children in a looping row.",
      props: [
        { name: "duration", type: "number", default: "24", description: "Seconds for one full pass of the content." },
        { name: "direction", type: '"left" | "right"', default: '"left"', description: "Which way the strip travels." },
        { name: "pauseOnHover", type: "boolean", default: "true", description: "Pauses while hovered. Focus always pauses it." },
        { name: "fade", type: "boolean", default: "true", description: "Fades the leading and trailing edges while the strip moves." },
        { name: "label", type: "string", default: '"Scrolling content"', description: "Names the strip when reduced motion makes it a scroller." },
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
      body: "- Content narrower than the container stays still; no prop turns the loop off.\n- Stops while out of view, hovered or focused.\n- Pausing eases out over 160ms; resuming takes 240ms.\n- Touch does not trigger the hover pause.\n- Resizes and prop changes keep its place in the loop.",
    },
  ],

  keyboard: [
    { keys: ["Tab"], does: "Moves into the strip and pauses it" },
    { keys: ["←", "→"], does: "Scrolls the strip under reduced motion, once it has focus" },
  ],

  accessibility: [
    "The duplicate copy is aria-hidden and inert: not announced, not reachable by Tab.",
    "Focus pauses the strip regardless of `pauseOnHover`.",
    "Reduced motion makes it a focusable scroller, role region, named by `label`.",
  ],
} satisfies ComponentDoc;
