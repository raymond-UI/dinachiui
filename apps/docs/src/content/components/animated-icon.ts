import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "animated-icon",
  description: "Two icons in one place that swap with a transition.",
  usage: `import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { AnimatedIcon } from "@/components/ui/animated-icon"

export function PlayButton() {
  const [playing, setPlaying] = useState(false)
  return (
    <button
      type="button"
      aria-label={playing ? "Pause" : "Play"}
      onClick={() => setPlaying((p) => !p)}
    >
      <AnimatedIcon active={playing} from={<Play />} to={<Pause />} />
    </button>
  )
}`,

  examples: ["animated-icon-default", "animated-icon-modes", "animated-icon-sizes"],

  parts: [
    {
      name: "AnimatedIcon",
      summary: "A shell stacking two icons.",
      props: [
        { name: "active", type: "boolean", description: "Which icon shows. false shows `from`, true shows `to`." },
        { name: "from", type: "ReactNode", description: "The resting icon. Any element: a lucide icon, inline svg or emoji." },
        { name: "to", type: "ReactNode", description: "The icon for the active state." },
        { name: "mode", type: '"scale" | "rotate" | "flip" | "fade"', default: '"scale"', description: "How the two trade places." },
        { name: "className", type: "string", default: '"size-5"', description: "Sizes and colours both icons." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Bring your own icons",
      body: "Ships no icons. Pass any two.\n\n```tsx\n<AnimatedIcon active={muted} from={<Volume2 />} to={<VolumeX />} />\n<AnimatedIcon active={copied} from={<Copy />} to={<Check />} />\n<AnimatedIcon active={open} from={<Menu />} to={<X />} mode=\"rotate\" />\n```\n\nIt does not morph paths; it swaps with a transform.",
    },
    {
      title: "Modes",
      body: "- `scale` (default): the outgoing icon shrinks to 0.7 and fades; the incoming one grows from 0.7.\n- `rotate`: adds a quarter turn each way.\n- `flip`: rotates about the horizontal axis, with perspective.\n- `fade`: opacity only.",
    },
    {
      title: "Timing",
      body: "150ms, no bounce, no delay. Nothing animates on mount.",
    },
    {
      title: "Sizing",
      body: "Size the shell with `className`; both icons fill it. Do not size the icons individually, or they jump as they swap.\n\n```tsx\n<AnimatedIcon active={dark} from={<Sun />} to={<Moon />} className=\"size-8\" />\n```",
    },
    {
      title: "When to use it",
      body: "- A two-state control: play, mute, a disclosure.\n- A one-off confirmation, such as copy becoming a check.\n- Skip it for icons that never change or are decorative.",
    },
  ],

  accessibility: [
    "The shell is aria-hidden. Name the control around it.",
    "If the button's label does not change with state, use aria-pressed or aria-expanded.",
    "Reduced motion, from the OS or an app-level MotionConfig, cuts straight to the new icon.",
  ],
} satisfies ComponentDoc;
