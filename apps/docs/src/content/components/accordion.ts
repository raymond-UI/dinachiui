import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "accordion",
  description: "Stacked sections that open and close under their headings.",
  usage: `import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
  return (
    <Accordion aria-label="FAQ" defaultValue={["returns"]}>
      <AccordionItem value="returns">
        <AccordionHeader>
          <AccordionTrigger>Returns</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Send it back within 30 days for a full refund.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="shipping">
        <AccordionHeader>
          <AccordionTrigger>Shipping</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Orders leave the warehouse within two working days.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}`,
  anatomy: `<Accordion>
  <AccordionItem>
    <AccordionHeader>
      <AccordionTrigger />
    </AccordionHeader>
    <AccordionPanel />
  </AccordionItem>
</Accordion>`,

  examples: ["accordion-default", "accordion-multiple", "accordion-controlled", "accordion-disabled", "accordion-persistent"],

  parts: [
    {
      name: "Accordion",
      summary: "Holds which items are open.",
      props: [
        { name: "value", type: "any[]", description: "Controlled open items. Always an array, even when only one can be open." },
        { name: "defaultValue", type: "any[]", default: "[]", description: "Starting open items when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "multiple", type: "boolean", default: "false", description: "Lets several items stay open. Otherwise opening one closes the rest.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks every item, for people and agents.", agent: true },
        { name: "keepMounted", type: "boolean", default: "false", description: "Keeps closed panels in the DOM. Also settable per panel." },
        { name: "hiddenUntilFound", type: "boolean", default: "false", description: "Lets find-in-page reveal text in a closed panel. Overrides keepMounted." },
        { name: "aria-label", type: "string", description: "Names the accordion. Its items report it to the agent as `in`.", agent: true },
      ],
    },
    {
      name: "AccordionItem",
      summary: "One section; its own disclosure to agents.",
      props: [
        { name: "value", type: "any", default: "useId()", description: "Identifies the item in the root's value. Generated when omitted." },
        { name: "disabled", type: "boolean", default: "false", description: "Locks this item only. Refused for agents.", agent: true },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs when this item opens or closes." },
      ],
    },
    {
      name: "AccordionHeader",
      summary: "The heading that wraps the trigger.",
      props: [{ name: "render", type: "ReactElement", default: "<h3>", description: "Swap the heading level, for example `<h2 />`." }],
    },
    {
      name: "AccordionTrigger",
      summary: "Toggles its item; built-in chevron turns when open.",
      props: [{ name: "children", type: "ReactNode", description: "The heading text. Also the name the agent reads.", agent: true }],
    },
    {
      name: "AccordionPanel",
      summary: "The content, animated by height.",
      props: [
        { name: "keepMounted", type: "boolean", default: "false", description: "Keeps this panel in the DOM while closed, so uncontrolled fields keep their state." },
        { name: "hiddenUntilFound", type: "boolean", default: "false", description: "Lets find-in-page reveal this panel while closed." },
        { name: "children", type: "ReactNode", description: "The panel text. The agent reads it as the item's value while open.", agent: true },
      ],
    },
  ],

  notes: [
    {
      title: "Values are arrays",
      body: "`value` and `defaultValue` are always arrays, even when `multiple` is false. When controlled, give each item a `value`.",
    },
    {
      title: "Horizontal layouts",
      body: "The bundled styles are vertical. A horizontal accordion needs its own styling.",
    },
  ],

  agent: {
    kind: "disclosure",
    reads: [
      { field: "label", means: "The item's trigger text." },
      { field: "open", means: "Whether the item is open." },
      { field: "value", means: "The panel's text while open. Nothing while closed." },
      { field: "in", means: "The Accordion's aria-label, when it has one." },
      { field: "disabled", means: "True when the item or the whole accordion is disabled." },
    ],
    actions: [
      { call: "open()", does: "Opens the item while closed. In a single accordion it closes the open one." },
      { call: "close()", does: "Closes the item while open. Other open items stay open." },
    ],
    refusal:
      "Each item is listed on its own. An agent's change runs through the root's onValueChange like anyone's. isAgentChange(details) is true for it; details.cancel() keeps the item as it was and the agent is told the app refused. A disabled item or a disabled accordion refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Is it styled?", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Opens or closes the focused item" },
    { keys: ["Tab"], does: "Moves to the next trigger or focusable content" },
  ],

  accessibility: [
    "Each trigger is a button with aria-expanded, and aria-controls on its panel while open.",
    "Each panel is a region labelled by its trigger.",
    "Disabled items keep their place but cannot be opened.",
    "AccordionHeader renders an h3. Pass `render` to match the page's heading level.",
  ],
} satisfies ComponentDoc;
