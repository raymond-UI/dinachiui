import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "animated-tabs",
  description: "Tabs with a pill that travels to the selected trigger.",
  usage: `import {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from "@/components/ui/animated-tabs"

export function ProjectViews() {
  return (
    <AnimatedTabs aria-label="Views" defaultValue="overview">
      <AnimatedTabsList>
        <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="activity">Activity</AnimatedTabsTrigger>
      </AnimatedTabsList>
      <AnimatedTabsContent value="overview">Everything at a glance.</AnimatedTabsContent>
      <AnimatedTabsContent value="activity">Who changed what, and when.</AnimatedTabsContent>
    </AnimatedTabs>
  )
}`,
  anatomy: `<AnimatedTabs>
  <AnimatedTabsList>
    <AnimatedTabsTrigger />
  </AnimatedTabsList>
  <AnimatedTabsContent />
</AnimatedTabs>`,

  examples: ["animated-tabs-default", "animated-tabs-styled", "animated-tabs-controlled"],

  parts: [
    {
      name: "AnimatedTabs",
      summary: "Holds the selected tab and pill spring.",
      props: [
        { name: "value", type: "any", description: "Controlled selected tab." },
        { name: "defaultValue", type: "any", description: "Starting tab when uncontrolled. The pill shows only on a matching tab, so set one." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "transition", type: "Transition", default: '{ type: "spring", bounce: 0, duration: 0.3 }', description: "Overrides the pill's motion." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Which arrow keys move between tabs." },
        { name: "aria-label", type: "string", description: "Names the tabs. Also the name the agent reads.", agent: true },
      ],
    },
    {
      name: "AnimatedTabsList",
      summary: "The strip that holds the triggers.",
      props: [
        { name: "activateOnFocus", type: "boolean", default: "false", description: "Selects on arrow key instead of Enter or Space." },
        { name: "loopFocus", type: "boolean", default: "true", description: "Wraps arrow-key focus from the last tab to the first." },
      ],
    },
    {
      name: "AnimatedTabsTrigger",
      summary: "One tab. Holds the pill when selected.",
      props: [
        { name: "value", type: "any", description: "Which panel it selects." },
        { name: "indicatorClassName", type: "string", description: "Class for the pill; themes it without restyling the tab." },
        { name: "disabled", type: "boolean", default: "false", description: "Skipped by the keyboard, refused for agents.", agent: true },
        { name: "children", type: "ReactNode", description: "The tab label. Also the name the agent selects by.", agent: true },
      ],
    },
    {
      name: "AnimatedTabsContent",
      summary: "One tab's panel. Switches without animation.",
      props: [
        { name: "value", type: "any", description: "The tab this panel belongs to." },
        { name: "keepMounted", type: "boolean", default: "false", description: "Keeps the panel in the DOM while hidden." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "When to use it",
      body: "- A short, stable strip of three to five tabs: a settings pane, a profile, a chart's time range.\n- For a strip that scrolls or has a dozen entries, use [Tabs](/docs/components/tabs).",
    },
    {
      title: "Styling",
      body: "- The selected tab carries `data-active`. Recolour its label with `data-[active]:text-primary-foreground` when the pill is dark.\n- The pill is measured, so labels of uneven width need no offsets.",
    },
    {
      title: "Behaviour",
      body: "- Pointer changes travel; keyboard changes and reduced motion cut.\n- The default spring has no bounce.",
    },
  ],

  agent: {
    kind: "tabs",
    reads: [
      { field: "label", means: "The AnimatedTabs aria-label, or tabs when it has none." },
      { field: "value", means: "The selected tab's label." },
      { field: "items", means: "Every tab's label, in order." },
      { field: "disabled", means: "True when every tab is disabled." },
    ],
    actions: [
      { call: 'select("Activity")', does: "Picks by label, then by value. A miss lists the tabs." },
    ],
    refusal:
      "The agent clicks the tab, so the change runs through onValueChange. isAgentChange(details) is true for it, and details.cancel() refuses it; the agent is told the app refused. A disabled tab refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "tabs", action: "select", args: ["Activity"] }],
})`,
  },

  keyboard: [
    { keys: ["←", "→"], does: "Moves focus between tabs, or ↑ ↓ when vertical" },
    { keys: ["Home", "End"], does: "Moves focus to the first or last tab" },
    { keys: ["Space", "Enter"], does: "Selects the focused tab" },
    { keys: ["Tab"], does: "Moves focus from the tab list into the panel" },
  ],

  accessibility: [
    "Roving focus, aria-selected and aria-controls come from Base UI Tabs.",
    "Tablist, tab and tabpanel roles; each panel is labelled by its tab.",
    "The pill is aria-hidden; selection is announced via aria-selected.",
    "Give AnimatedTabs an aria-label when a page has several tab sets. The agent reads it.",
  ],
} satisfies ComponentDoc;
