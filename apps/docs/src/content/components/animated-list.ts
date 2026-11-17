import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "animated-list",
  description: "A live list that animates rows arriving, leaving, and the rows they push aside.",
  usage: `import { useState } from "react"
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list"

export function Notifications({ initial }: { initial: { id: string; title: string }[] }) {
  const [rows, setRows] = useState(initial)
  const [dismissed, setDismissed] = useState<string | null>(null)

  const dismiss = (id: string) => {
    setDismissed(id)
    setRows((current) => current.filter((row) => row.id !== id))
  }

  return (
    <AnimatedList dismissed={dismissed}>
      {rows.map((row) => (
        <AnimatedListItem key={row.id} itemKey={row.id}>
          {row.title}
          <button type="button" onClick={() => dismiss(row.id)}>
            Dismiss
          </button>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  )
}`,
  anatomy: `<AnimatedList>
  <AnimatedListItem />
</AnimatedList>`,

  examples: ["animated-list-default", "animated-list-two-exits", "animated-list-from-bottom"],

  parts: [
    {
      name: "AnimatedList",
      summary: "A `ul` that reconciles its rows with motion.",
      props: [
        { name: "from", type: '"top" | "bottom"', default: '"top"', description: "The edge new rows arrive from. A feed that grows downward wants bottom." },
        { name: "dismissed", type: "string | null", default: "null", description: "The itemKey of the row the reader closed. Set it in the same update that removes the row." },
        { name: "duration", type: "number", default: "0.3", description: "Seconds for each row's own animation. The reflow spring is scaled from it." },
      ],
    },
    {
      name: "AnimatedListItem",
      summary: "One row, an animated `li`.",
      props: [
        { name: "itemKey", type: "string", description: "The same string as React's key, which a component cannot read back. Only needed with dismissed." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "What animates",
      body: "- A new row fades in from the `from` edge.\n- A removed row leaves layout at once, so the gap closes immediately.\n- Every other row springs to its new position.",
    },
    {
      title: "Dismissed rows",
      body: "Pass the key of a row the reader closed as `dismissed`, in the same update that removes it. That row slides out sideways; other removals collapse in place.\n\n```tsx\nconst dismiss = (id: string) => {\n  setDismissed(id)\n  setRows((current) => current.filter((row) => row.id !== id))\n}\n```",
    },
    {
      title: "When to use it",
      body: "- A feed, inbox or activity stream that changes a row or two at a time while someone watches.\n- For a list that only appears, use [Stagger List](/docs/components/stagger-list).\n- Skip it when the whole list changes on every keystroke.",
    },
    {
      title: "Behaviour",
      body: "- Nothing animates on first render.\n- `AnimatedListItem` throws outside an `AnimatedList`.",
    },
  ],

  accessibility: [
    "Keeps ul and li semantics.",
    "Reduced motion drops the travel; rows still move to their new place in one frame.",
    "Changes are not announced. Use a live region if a new row matters.",
  ],
} satisfies ComponentDoc;
