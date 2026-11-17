import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "preview-card",
  description: "Previews a link's target on hover or focus.",
  usage: `import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@/components/ui/preview-card"

export function ProfileLink() {
  return (
    <PreviewCard>
      <PreviewCardTrigger href="/people/ada">Ada Lovelace</PreviewCardTrigger>
      <PreviewCardContent>
        <p className="text-sm">Mathematician. Wrote the first published program.</p>
      </PreviewCardContent>
    </PreviewCard>
  )
}`,
  anatomy: `<PreviewCard>
  <PreviewCardTrigger />
  <PreviewCardPortal>
    <PreviewCardBackdrop />
    <PreviewCardPositioner>
      <PreviewCardPopup>
        <PreviewCardArrow />
        <PreviewCardViewport />
      </PreviewCardPopup>
    </PreviewCardPositioner>
  </PreviewCardPortal>
</PreviewCard>`,

  examples: ["preview-card-default", "preview-card-image", "preview-card-viewport"],

  parts: [
    {
      name: "PreviewCard",
      summary: "Holds the open state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "onOpenChangeComplete", type: "(open) => void", description: "Runs once the open or close animation ends." },
        { name: "handle", type: "PreviewCardHandle", description: "Links the card to triggers elsewhere. Make one with createPreviewCardHandle()." },
        { name: "children", type: "ReactNode | ({ payload }) => ReactNode", description: "A function receives the opening trigger's payload." },
      ],
    },
    {
      name: "PreviewCardTrigger",
      summary: "The link that opens the card.",
      props: [
        { name: "href", type: "string", description: "Where the link goes." },
        { name: "delay", type: "number", default: "600", description: "Milliseconds before opening on hover." },
        { name: "closeDelay", type: "number", default: "300", description: "Milliseconds before closing after the pointer leaves." },
        { name: "handle", type: "PreviewCardHandle", description: "Ties a trigger outside the PreviewCard to it." },
        { name: "payload", type: "unknown", description: "Passed to the children function when this trigger opens." },
        { name: "children", type: "ReactNode", description: "The link text. Also the name the agent reads.", agent: true },
      ],
    },
    {
      name: "PreviewCardContent",
      summary: "The portal, positioner, popup and arrow in one.",
      props: [{ name: "children", type: "ReactNode", description: "The card's content." }],
    },
    {
      name: "PreviewCardPortal",
      summary: "Renders its children into the body.",
      props: [],
    },
    {
      name: "PreviewCardBackdrop",
      summary: "A full-screen layer under the card.",
      props: [],
    },
    {
      name: "PreviewCardPositioner",
      summary: "Places the card against the trigger.",
      props: [
        { name: "side", type: "\"top\" | \"right\" | \"bottom\" | \"left\" | \"inline-start\" | \"inline-end\"", default: "\"bottom\"", description: "Which side of the trigger to open on." },
        { name: "sideOffset", type: "number", default: "8", description: "Gap to the trigger, in pixels." },
        { name: "align", type: "\"start\" | \"center\" | \"end\"", default: "\"center\"", description: "Alignment along that side." },
        { name: "collisionPadding", type: "number", default: "5", description: "Space kept from the viewport edge." },
      ],
    },
    {
      name: "PreviewCardPopup",
      summary: "The card itself, 280px wide.",
      props: [],
    },
    {
      name: "PreviewCardArrow",
      summary: "A pointer from the card to the trigger.",
      props: [{ name: "children", type: "ReactNode", default: "<PreviewCardArrowSvg />", description: "Replaces the built-in arrow." }],
    },
    {
      name: "PreviewCardViewport",
      summary: "Animates content when a shared card switches triggers.",
      props: [],
    },
    {
      name: "PreviewCardArrowSvg",
      summary: "The arrow's SVG, for a custom PreviewCardArrow.",
      props: [],
    },
    {
      name: "createPreviewCardHandle",
      summary: "Links detached triggers to one PreviewCard.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Content only",
      body: "For reading only. Touch screens have no hover, so keep essential content on the linked page and put controls in a [Popover](/docs/components/popover).",
    },
    {
      title: "One card, many triggers",
      body: "Pass a `createPreviewCardHandle()` handle to the `PreviewCard` and each `PreviewCardTrigger`, and give each trigger a `payload`; the children function receives it. Triggers outside the `PreviewCard` are not tied to its agent entry, so the agent sees them as plain links.",
    },
  ],

  agent: {
    kind: "popover",
    reads: [
      { field: "label", means: "The trigger's text." },
      { field: "open", means: "Whether the card is showing." },
    ],
    actions: [
      { call: "open()", does: "Opens the card. Only while closed." },
      { call: "close()", does: "Closes the card. Only while open." },
    ],
    refusal:
      "Once open, the trigger stays the control and the card is read as content. An agent's change runs through onOpenChange. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused.",
    example: `await agent.act({
  steps: [{ ref: "Base UI", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Focusing the trigger opens the card" },
    { keys: ["Esc"], does: "Closes the card" },
  ],

  accessibility: [
    "The trigger is a plain link; it works if the card never opens.",
    "Opens on hover and on keyboard focus of the trigger.",
  ],
} satisfies ComponentDoc;
