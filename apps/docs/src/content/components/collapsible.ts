import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "collapsible",
  description: "One section shown and hidden by a person or an agent.",
  usage: `import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible"

export function ShippingDetails() {
  return (
    <Collapsible className="max-w-sm">
      <CollapsibleTrigger>
        <span>Shipping details</span>
        <ChevronDown className="h-4 w-4 transition-transform" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <p className="px-4 pb-4 text-muted-foreground">Ships in 2 to 3 working days.</p>
      </CollapsiblePanel>
    </Collapsible>
  )
}`,
  anatomy: `<Collapsible>
  <CollapsibleTrigger />
  <CollapsiblePanel />
</Collapsible>`,

  examples: ["collapsible-default", "collapsible-controlled"],

  parts: [
    {
      name: "Collapsible",
      summary: "Holds the open state.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting state when uncontrolled." },
        {
          name: "onOpenChange",
          type: "(open, details) => void",
          description: "Runs for people and agents. details.cancel() refuses the change.",
          agent: true,
        },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the trigger, for people and agents.", agent: true },
      ],
    },
    {
      name: "CollapsibleTrigger",
      summary: "The full-width button that toggles the panel.",
      props: [
        { name: "children", type: "ReactNode", description: "Also the name the agent reads.", agent: true },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
    {
      name: "CollapsiblePanel",
      summary: "The content. Height animates open and closed.",
      props: [
        { name: "keepMounted", type: "boolean", default: "false", description: "Keeps the content in the DOM while closed." },
        {
          name: "hiddenUntilFound",
          type: "boolean",
          default: "false",
          description: "Lets find in page reach the content and open the panel.",
        },
      ],
    },
  ],

  notes: [
    {
      title: "Chevron",
      body: "The trigger rotates a direct child `svg` 180 degrees while open. Put the icon directly inside `CollapsibleTrigger`, unwrapped, with `transition-transform` to animate it.",
    },
    {
      title: "Several sections",
      body: "For related sections sharing one open state, use [Accordion](/docs/components/accordion).",
    },
  ],

  agent: {
    kind: "disclosure",
    reads: [
      { field: "label", means: "The trigger's text, or its aria-label." },
      { field: "open", means: "Whether the panel is showing." },
      { field: "disabled", means: "True when the collapsible is disabled." },
    ],
    actions: [{ call: "open() / close()", does: "Whichever fits the current state. Panel content is listed once open." }],
    refusal:
      "An agent's change runs through onOpenChange like a click on the trigger. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused. A disabled collapsible refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "View more details", action: "open" }],
})`,
  },

  keyboard: [{ keys: ["Enter", "Space"], does: "Opens or closes the panel" }],

  accessibility: [
    "The trigger is a button with aria-expanded, and aria-controls on the panel while open.",
    "The trigger's text is its name, for screen readers and the agent.",
    "Reduced motion turns off the height animation.",
  ],
} satisfies ComponentDoc;
