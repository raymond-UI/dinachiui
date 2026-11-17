import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "agent",
  description: "Lets an AI agent read and operate page controls, each step gated.",
  usage: `import { AgentProvider, useAgent } from "@/components/ui/agent"

function App() {
  const agent = useAgent({
    allow: (step) => step.action !== "press" || confirm(\`Press \${step.label}?\`),
  })
  return <AgentProvider agent={agent}>{/* your app */}</AgentProvider>
}

agent.snapshot()
// [{ ref: "c1", component: "input", label: "Project name", value: "Apollo", actions: ["setValue", "clear"] }, ...]

await agent.act({
  steps: [
    { ref: "Project name", action: "setValue", args: ["Atlas"] },
    { ref: "Region", action: "select", args: ["Europe"] },
  ],
})`,

  examples: ["agent-bridge"],

  parts: [
    {
      name: "useAgent",
      summary: "Creates the agent. Pass it to AgentProvider.",
      props: [
        { name: "root", type: "ParentNode", default: "document", description: "Where to look for controls. The default finds portalled popups." },
        { name: "allow", type: "(step, { signal }) => boolean | Promise<boolean>", description: "Approves or refuses each step. Without it, every step runs except ones needing a person, which fail.", agent: true },
        { name: "timeout", type: "number", default: "300000", description: "Milliseconds allow may take before the step fails." },
        { name: "onAction", type: "(step) => void", description: "Runs after each step that ran." },
        { name: "webmcp", type: "{ allow }", description: "Registers the tools with the browser's agent. Its allow is required and runs after the bridge's own.", agent: true },
      ],
    },
    {
      name: "AgentProvider",
      summary: "The bridge components inside register with.",
      props: [{ name: "agent", type: "Agent", description: "From useAgent or createAgent." }],
    },
    {
      name: "Agent",
      summary: "What useAgent returns.",
      props: [
        { name: "snapshot", type: "() => AgentComponent[]", description: "Every control on the page, with its ref, label, value and actions. Open dialogs first." },
        { name: "query", type: "({ text?, kind? }) => AgentComponent[]", description: "Controls whose label or choices contain the text, or of one kind." },
        { name: "act", type: "({ steps }) => Promise<AgentActResult>", description: "Runs steps in order, stopping at the first failure. Returns each new value and any controls that appeared." },
        { name: "actions", type: "() => AgentActionInfo[]", description: "The app actions on the page, with their input as JSON Schema." },
      ],
    },
    {
      name: "createAgent",
      summary: "The agent outside React; useAgent options minus webmcp.",
      props: [],
    },
    {
      name: "isAgentChange",
      summary: "True when a change's details came from the agent.",
      props: [{ name: "details", type: "unknown", description: "The details passed to onValueChange or onOpenChange." }],
    },
    {
      name: "useAgentAction",
      summary: "Offers an app action while mounted.",
      props: [
        { name: "name", type: "string", description: "What the agent calls." },
        { name: "description", type: "string", description: "What it does and what follows. The model reads this." },
        { name: "input", type: "Standard Schema", description: "Checked before run. zod 4.2+ and arktype 2.1.28+ work as they are; wrap valibot in toStandardJsonSchema." },
        { name: "confirm", type: "string", description: "Needs a person's approval, for this reason." },
        { name: "disabled", type: "boolean", description: "Refuses the action while true." },
        { name: "element", type: "RefObject<Element>", description: "Attaches the action to an element, so each card gets its own." },
        { name: "run", type: "(input) => unknown", description: "Its return value goes to the agent. Throwing fails the step with the message." },
      ],
    },
    {
      name: "useAgentControl",
      summary: "Registers a custom control, read on every look.",
      props: [
        { name: "read", type: "() => AgentControl | null", description: "The kind, element, state and actions as they are now. null hides it." },
      ],
    },
    {
      name: "agentToolsFor",
      summary: "snapshot, query and act tools for any SDK.",
      props: [
        { name: "actions", type: '"tools" | "act"', default: '"tools"', description: "tools adds one tool per app action. act lists them in the snapshot, keeping requests small." },
      ],
    },
    {
      name: "runAgentTool",
      summary: "Runs one tool with the model's input.",
      props: [{ name: "(agent, name, input, options?)", type: "Promise<unknown>", description: "Pass the same actions option as agentToolsFor." }],
    },
    {
      name: "agentTools",
      summary: "The three base tool definitions, without app actions.",
      props: [],
    },
    {
      name: "registerTools",
      summary: "Registers WebMCP tools outside useAgent; returns an unregister function.",
      props: [{ name: "allow", type: "(step, { signal }) => boolean | Promise<boolean>", description: "Required. Gates every step the browser's agent takes." }],
    },
  ],

  notes: [
    {
      title: "How it works",
      body: "Inside `AgentProvider`, form controls and dialogs register their state and actions. An action calls the component's own state setter, so it runs through your `onValueChange` and `onOpenChange` like any other change. Unregistered elements are still reached through the accessibility tree. The agent gets a short list of labelled controls and names them by label.",
    },
    {
      title: "What the agent sees",
      body: "- Input, Textarea, OTPField: `value`, and `length` for OTPField. `setValue`, `clear`.\n- NumberField: `value`, `min`, `max`, `step`. `setValue`, `increment`, `decrement`.\n- Slider, CompareSlider: `value`, a number or `[low, high]`, with `min`, `max`, `step`. `setValue`.\n- Select: `value`, `open`, `items`. `select`, `open`, `close`.\n- Combobox: `value`, `open`, `items`, `multiple`. `select`, `search`, `open`, `close`, and `setValue` when `multiple`.\n- Autocomplete: `value` (the text), `items`. `setValue`, `search`.\n- RadioGroup, ToggleGroup: `value`, `items`, `multiple`. `select`, and `setValue` when `multiple`.\n- CheckboxGroup: `value`, `items`. `setValue`; each checkbox in it also takes `toggle` and `setChecked`.\n- Checkbox, Switch, Toggle: `checked`, `\"mixed\"` when indeterminate. `toggle`, `setChecked`.\n- Dialog, AlertDialog, Drawer, Popover, PreviewCard, Collapsible, ExpandableCard: `open`. `open`, `close`.\n- Accordion item: `open`, and `value` as the panel's text while open. `open`, `close`.\n- Menu, ContextMenu, Menubar menu: `open`. `open`, `close`; each item takes `press`, and `setChecked` when it can be checked.\n- NavigationMenu: `open` for an item with a trigger. `open`, `close`; links take `press`.\n- Tabs, AnimatedTabs: `value`, `items`. `select`.\n- Carousel: `value`, `items`. `goTo`, by label or by number from 1.\n- Sortable: `items` in order. `move`, an item to a position from 1.\n- SwipeableRow: its content as a region, its actions as buttons. `press`, and `dismiss` with `onDismiss`.\n- HoldToConfirm: needs approval by default. `press` completes the hold.\n- Button: `open` for dialog triggers. `press`.\n- Link: `value` (the href). `press`.\n- Progress, ProgressRing, Meter: `value`, `min`, `max`. Read only.\n- Toast: `value` (the description), `type`. `dismiss`.\n\nInside a Field, a control also reports `required`, `invalid` and the Field's `errors`, and `in` names its Fieldset or Form. A popup with no title of its own goes by its trigger's name.",
    },
    {
      title: "Naming a control",
      body: "A step names its control by `ref`, exact label, partial label, or kind when only one of that kind is on the page. Choices match by label, then value; a miss lists the options. Steps stop at the first failure; earlier steps are not undone.",
    },
    {
      title: "Agent changes",
      body: "```tsx\n<Select\n  onValueChange={(value, details) => {\n    if (isAgentChange(details)) track(\"agent-picked-region\", value)\n    if (value === \"ap\") details.cancel()\n  }}\n/>\n```\n\n`isAgentChange(details)` is true for an agent's change. `details.cancel()` refuses it; the step fails with \"The app refused the change.\"",
    },
    {
      title: "Controlling access",
      body: "- `data-agent-hidden` removes a region from the snapshot.\n- `data-agent-part` marks an element belonging to a `useAgentControl` control, so it is not listed twice. Controls inside it are still found.\n- `data-agent-secret` reports a value as `[redacted]`. Password, one-time-code and card fields are secret already.\n- `data-agent-confirm=\"Reason\"` marks a control that needs a person. Without `allow` the step fails with that reason; with it, `allow` gets the reason as `confirm`.\n- `data-agent-label` names a control when its accessible name is not what an agent should use.\n- `data-agent-dismiss` marks the button `dismiss` presses in a toast.\n- Content behind an open modal is left out of the snapshot.",
    },
    {
      title: "WebMCP",
      body: "```tsx\nuseAgent({ webmcp: { allow: (step) => confirm(`Let the browser agent ${step.action} ${step.label}?`) } })\n```\n\nRegisters `snapshot`, `query`, `act` and one tool per app action with the browser's agent. Does nothing without WebMCP.\n\nFor other model SDKs, `agentToolsFor(agent)` returns the tool definitions and `runAgentTool(agent, name, input)` runs one.",
    },
  ],

  accessibility: [
    "The agent reads the same accessible names a screen reader does.",
    "Label every control. Two unnamed controls of one kind cannot be told apart.",
  ],
} satisfies ComponentDoc;
