import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "expandable-card",
  description: "A card that expands into its own detail view.",
  usage: `import {
  ExpandableCard,
  ExpandableCardBody,
  ExpandableCardPanel,
  ExpandableCardShared,
  ExpandableCardTrigger,
} from "@/components/ui/expandable-card"

export function Story() {
  return (
    <ExpandableCard>
      <ExpandableCardTrigger>
        <ExpandableCardShared part="art" className="h-24 bg-muted" />
        <ExpandableCardShared part="title" className="p-4 text-sm font-medium">
          Shared layout
        </ExpandableCardShared>
      </ExpandableCardTrigger>

      <ExpandableCardPanel title="Shared layout">
        <ExpandableCardShared part="art" className="h-40 bg-muted" />
        <ExpandableCardShared part="title" className="px-5 pt-4 text-lg font-medium">
          Shared layout
        </ExpandableCardShared>
        <ExpandableCardBody className="px-5 pb-5">
          Content that only exists in the panel.
        </ExpandableCardBody>
      </ExpandableCardPanel>
    </ExpandableCard>
  )
}`,
  anatomy: `<ExpandableCard>
  <ExpandableCardTrigger>
    <ExpandableCardShared />
  </ExpandableCardTrigger>
  <ExpandableCardPanel>
    <ExpandableCardShared />
    <ExpandableCardBody />
  </ExpandableCardPanel>
</ExpandableCard>`,

  examples: ["expandable-card-default", "expandable-card-controlled", "expandable-card-fullscreen", "expandable-card-row"],

  parts: [
    {
      name: "ExpandableCard",
      summary: "Holds open state; scopes shared ids.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs before open or close, for people and agents. details.cancel() refuses it.", agent: true },
      ],
    },
    {
      name: "ExpandableCardTrigger",
      summary: "The card itself, a button.",
      props: [
        { name: "children", type: "ReactNode", description: "Card content. Its text is the agent's label while closed.", agent: true },
        { name: "onClick", type: "(event) => void", description: "Runs first. event.preventDefault() stops the card opening." },
      ],
    },
    {
      name: "ExpandableCardPanel",
      summary: "The opened card, portalled, mounted while open.",
      props: [
        { name: "title", type: "string", description: "Dialog name, and the agent's label while open.", agent: true },
        { name: "showClose", type: "boolean", default: "true", description: "Set false to supply your own close control." },
        { name: "fullscreen", type: "boolean", default: "false", description: "Fills the viewport; long content scrolls." },
        { name: "closeLabel", type: "string", default: '"Close"', description: "Accessible name for the close button." },
        { name: "backdropClassName", type: "string", description: "Classes for the backdrop." },
        { name: "container", type: "Element | null", default: "document.body", description: "Where the overlay is portalled." },
      ],
    },
    {
      name: "ExpandableCardShared",
      summary: "An element that travels between both sides.",
      props: [{ name: "part", type: "string", description: "Names the pair. Use it once on the card, once in the panel." }],
    },
    {
      name: "ExpandableCardBody",
      summary: "Panel-only content, fades in after landing.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "When to use it",
      body: "- A hero item, or a short list where opening one is a deliberate choice.\n- Skip it on large grids, where the travel slows every glance.\n- If the detail view shares nothing with the card, use a Dialog.",
    },
    {
      title: "Pairing parts",
      body: "- Use each `part` once per side. A `part` used twice on one side makes the layout engine pick one.\n- Put anything on only one side in `ExpandableCardBody`.\n- Ids are scoped per card, so a grid of cards works.",
    },
    {
      title: "Controlled",
      body: "Use `open` and `onOpenChange` to close the panel from your own control. With `showClose={false}`, your control must set `open` back to false.",
    },
    {
      title: "Full screen",
      body: "- Centred: sized by content, never scrolls; rounded, bordered and shadowed.\n- `fullscreen`: fills the screen, content scrolls inside, no radius, border or shadow.\n- The close button stays fixed outside the scroller.",
    },
    {
      title: "Behaviour",
      body: "- The travel is a 420ms spring; the backdrop a 200ms fade.\n- Reduced motion cuts. An app-level `MotionConfig reducedMotion` is honoured.\n- The panel portals to `document.body`. An ancestor with a transform, filter, backdrop-filter, perspective or paint containment breaks `position: fixed`; pass `container` to portal elsewhere.",
    },
  ],

  agent: {
    kind: "disclosure",
    reads: [
      { field: "label", means: "The card's text while closed. The panel's `title` while open." },
      { field: "open", means: "Whether the panel is showing." },
    ],
    actions: [
      { call: "open()", does: "While closed. Opens the panel like a click on the card." },
      { call: "close()", does: "While open. Closes the panel." },
    ],
    refusal:
      "An agent's open or close runs through onOpenChange with `details.reason` set to `imperative-action`. isAgentChange(details) is true for it; details.cancel() keeps the card as it was and tells the agent the app refused.",
    example: `await agent.act({
  steps: [{ ref: "The card travels", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Opens the card" },
    { keys: ["Tab", "Shift + Tab"], does: "Cycles focus inside the open panel" },
    { keys: ["Esc"], does: "Closes and returns focus to the card" },
  ],

  accessibility: [
    "The panel is a modal dialog with `aria-modal`, named by its `title`.",
    "Focus moves to the panel's first control on open and back to the card on close.",
    "The card is `inert` while open.",
    "Page scroll is locked, with scrollbar compensation so layout does not shift.",
    "The trigger is a button with `aria-haspopup=\"dialog\"` and `aria-expanded`.",
  ],
} satisfies ComponentDoc;
