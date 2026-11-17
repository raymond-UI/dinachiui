import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "sortable",
  description: "A list reordered by drag, keyboard or agent.",
  usage: `import { useState } from "react"
import { Sortable, SortableHandle, SortableItem } from "@/components/ui/sortable"

const pages: Record<string, string> = {
  overview: "Overview",
  install: "Installation",
  components: "Components",
}

export function PageOrder() {
  const [order, setOrder] = useState(["overview", "install", "components"])

  return (
    <Sortable aria-label="Pages" value={order} onValueChange={setOrder}>
      {order.map((id) => (
        <SortableItem key={id} id={id} label={pages[id]}>
          <SortableHandle />
          <span>{pages[id]}</span>
        </SortableItem>
      ))}
    </Sortable>
  )
}`,
  anatomy: `<Sortable>
  <SortableItem>
    <SortableHandle />
  </SortableItem>
</Sortable>`,

  examples: ["sortable-default", "sortable-keyboard", "sortable-custom-handle"],

  parts: [
    {
      name: "Sortable",
      summary: "The list. Renders the order you pass.",
      props: [
        { name: "value", type: "string[]", description: "The current order, as stable ids. Required.", agent: true },
        { name: "onValueChange", type: "(next, details) => void", description: "Runs for drags, keys and agents. `details.reason` says which. Required.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Turns off every handle. Agents are refused too.", agent: true },
        { name: "aria-label", type: "string", description: "Names the list. The agent reads the same name.", agent: true },
      ],
    },
    {
      name: "SortableItem",
      summary: "One row. Put a SortableHandle inside.",
      props: [
        { name: "id", type: "string", description: "The id this row carries in `value`. Give the same string to React's `key`." },
        { name: "label", type: "string", description: "Names the row in announcements, its handle and for the agent.", agent: true },
      ],
    },
    {
      name: "SortableHandle",
      summary: "The grip button; drags start here only.",
      props: [
        { name: "children", type: "ReactNode", default: "grip icon", description: "The affordance inside the button." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Ids as order",
      body: "`value` is a `string[]` of ids, not your objects. Keep the id-to-row lookup yourself.",
    },
    {
      title: "Refusing a change",
      body: "To refuse, do not apply `next`. `details.cancel()` undoes nothing itself; it marks the change refused, which tells an agent its move failed and suppresses the keyboard announcement.",
    },
    {
      title: "When to use it",
      body: "- Lists whose order is content: navigation, a playlist, a pinned set, form fields.\n- Short lists visible whole; it does not handle dragging across a long scroll.\n- Skip it for lists nobody reorders.",
    },
    {
      title: "Behaviour",
      body: `- Drags start only from the handle. Place it anywhere in the row.
- The lifted row scales slightly and takes a shadow.
- Displaced rows animate to their new positions.`,
    },
  ],

  agent: {
    kind: "list",
    reads: [
      { field: "label", means: "The list's aria-label. Without one, the bridge names it `list`." },
      { field: "value", means: "Every row's label in order, joined with commas." },
      { field: "items", means: "Every row's label, in order." },
      { field: "disabled", means: "True when the list is disabled." },
    ],
    actions: [
      { call: 'move("Components", 1)', does: "Moves a row, by label then by id, to a position counted from 1. A miss lists the rows." },
    ],
    refusal:
      "An agent's move runs through onValueChange like a drag. isAgentChange(details) is true for it; call details.cancel() and skip applying `next` to refuse, and the agent is told. A position outside the list fails; a disabled list refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "list", action: "move", args: ["CLI", 1] }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Picks the row up, or drops it if it is already up" },
    { keys: ["↑", "↓"], does: "Moves the grabbed row one position" },
    { keys: ["Esc"], does: "Restores the order from before the grab" },
    { keys: ["Tab"], does: "Drops the row where it is and moves focus on" },
  ],

  accessibility: [
    "Keeps `ul` and `li` semantics.",
    "Handles are named after their row, as in `Reorder Installation`; `aria-pressed` while lifted.",
    "Grab, move, drop and cancel are announced assertively, with position.",
    "Escape while lifted cancels the reorder without closing an enclosing dialog.",
    "Reduced motion drops the lifted row's scale and shadow fade.",
  ],
} satisfies ComponentDoc;
