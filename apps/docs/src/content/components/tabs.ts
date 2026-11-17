import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "tabs",
  description: "Panels shown one at a time, switched by a person or an agent.",
  usage: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AccountTabs() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Manage your account.</TabsContent>
      <TabsContent value="password">Change your password.</TabsContent>
    </Tabs>
  )
}`,
  anatomy: `<Tabs>
  <TabsList>
    <TabsTrigger />
    <TabsIndicator />
  </TabsList>
  <TabsContent />
</Tabs>`,

  examples: ["tabs-default", "tabs-controlled", "tabs-indicator", "tabs-disabled"],

  parts: [
    {
      name: "Tabs",
      summary: "Holds the active tab.",
      props: [
        { name: "value", type: "Value", description: "Controlled active tab. `null` shows none." },
        { name: "defaultValue", type: "Value", default: "0", description: "Starting tab when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Which arrow keys move between tabs." },
        { name: "aria-label", type: "string", description: "Names the tabs for the agent. Defaults to `tabs`.", agent: true },
      ],
    },
    {
      name: "TabsList",
      summary: "The row of tabs.",
      props: [
        { name: "activateOnFocus", type: "boolean", default: "false", description: "Selects a tab on arrow focus, not on Enter or Space." },
        { name: "loopFocus", type: "boolean", default: "true", description: "Wraps arrow keys from last tab to first." },
      ],
    },
    {
      name: "TabsTrigger",
      summary: "One tab.",
      props: [
        { name: "value", type: "Value", description: "Matches its TabsContent. Also what onValueChange receives." },
        { name: "children", type: "ReactNode", description: "The tab's text; the agent selects by it.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Focusable but not selectable. Refused for agents.", agent: true },
      ],
    },
    {
      name: "TabsContent",
      summary: "The panel for one tab.",
      props: [
        { name: "value", type: "Value", description: "The TabsTrigger value it belongs to." },
        { name: "keepMounted", type: "boolean", default: "false", description: "Keeps the panel in the DOM while hidden." },
      ],
    },
    {
      name: "TabsIndicator",
      summary: "Slides to the active tab. Needs a `relative` TabsList.",
      props: [
        { name: "renderBeforeHydration", type: "boolean", default: "false", description: "Places the bar before hydration, so it shows sooner after SSR." },
      ],
    },
  ],

  notes: [
    {
      title: "Automatic changes",
      body: "Uncontrolled Tabs pick a fallback when the active tab is missing or disabled, calling onValueChange with `details.reason` `\"initial\"`, `\"missing\"` or `\"disabled\"`. These cannot be cancelled.",
    },
  ],

  agent: {
    kind: "tabs",
    reads: [
      { field: "label", means: "The Tabs' aria-label, or `tabs`." },
      { field: "value", means: "The active tab's label." },
      { field: "items", means: "Every tab's label, in order." },
      { field: "disabled", means: "True when every tab is disabled." },
    ],
    actions: [
      { call: 'select("Password")', does: "Selects by label, then value. A miss lists the tabs; disabled tabs are refused." },
    ],
    refusal:
      "An agent's choice clicks the tab and reaches onValueChange with the agent's details. isAgentChange(details) is true for it; details.cancel() refuses it and the agent is told. Disabled tabs refuse on their own.",
    example: `await agent.act({
  steps: [{ ref: "tabs", action: "select", args: ["Password"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves focus between tabs. ↑ and ↓ when vertical" },
    { keys: ["Home", "End"], does: "Moves focus to the first or last tab" },
    { keys: ["Space", "Enter"], does: "Selects the focused tab" },
    { keys: ["Tab"], does: "Moves focus from the tab list into the open panel" },
  ],

  accessibility: [
    "Tablist, tabs with `aria-selected`, and tabpanels labelled by their tab.",
    "With several tab sets on a page, give each an aria-label.",
    "Disabled tabs stay focusable and announced.",
    "Hidden panels leave the DOM unless keepMounted is set.",
  ],
} satisfies ComponentDoc;
