import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "comparison-table",
  description: "Plans side by side, feature by feature.",
  usage: `import { ComparisonTable } from "@/components/ui/comparison-table"

const perSeat = { monthly: "a month", yearly: "a month, billed yearly" }

const plans = [
  { id: "starter", name: "Starter", price: { monthly: "£0", yearly: "£0" }, cta: { label: "Start free" } },
  { id: "team", name: "Team", price: { monthly: "£24", yearly: "£20" }, per: perSeat, highlighted: true },
  { id: "business", name: "Business", price: { monthly: "£79", yearly: "£66" }, per: perSeat },
]

const groups = [
  {
    label: "Usage",
    features: [
      { label: "Projects", values: { starter: "3", team: "Unlimited", business: "Unlimited" } },
      { label: "Single sign-on", values: { business: true } },
    ],
  },
]

export function Pricing() {
  return <ComparisonTable plans={plans} groups={groups} note="Prices per seat, ex. VAT" />
}`,

  examples: ["comparison-table-default", "comparison-table-controlled"],

  parts: [
    {
      name: "ComparisonTable",
      summary:
        "The toolbar, the plan table and the phone layout, drawn from `plans` and `groups`. Both layouts and the hidden count come from the same data, which is why it takes data rather than parts.",
      props: [
        { name: "plans", type: "ComparisonPlan[]", description: "Each plan: `id`, `name`, `price` and `per` for each billing period, `cta`, and `highlighted` for the one to tint." },
        { name: "groups", type: "ComparisonGroup[]", description: "Sections of features. Each feature has a `label` and `values` by plan id: `true`, `false` or text. A missing value is not included." },
        { name: "billing", type: '"monthly" | "yearly"', description: "Controlled billing period.", agent: true },
        { name: "defaultBilling", type: '"monthly" | "yearly"', default: '"monthly"', description: "Starting period when uncontrolled." },
        { name: "onBillingChange", type: "(billing, details) => void", description: "Runs on every change, for people and agents. `details.cancel()` refuses it.", agent: true },
        { name: "onlyDifferences", type: "boolean", description: "Controlled filter that hides features every plan shares.", agent: true },
        { name: "defaultOnlyDifferences", type: "boolean", default: "false", description: "Starting filter when uncontrolled." },
        { name: "onOnlyDifferencesChange", type: "(on, details) => void", description: "Runs on every change to the filter. `details.cancel()` refuses it.", agent: true },
        { name: "note", type: "ReactNode", description: "Small text over the feature names, such as Prices per seat, ex. VAT." },
        { name: "defaultPhonePlans", type: "[string, string]", description: "The two plan ids a phone compares first. Defaults to the highlighted plan and the next." },
        { name: "maxHeight", type: "number | string", description: "Caps the height so features scroll under the plan row. Without it the plan row sticks to the page, below `--comparison-table-top`." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
      ],
    },
    {
      name: "ComparisonValue",
      summary: "One value: a tick read as Included, a dash read as Not included, or the text. The table uses it; use it in your own layouts too.",
      props: [{ name: "value", type: "boolean | string | number | null", description: "`true` is a tick. `false` or nothing is a dash." }],
    },
  ],

  notes: [
    {
      title: "Highlight without a badge",
      body: "The highlighted plan is a tinted column and the only filled button. The other buttons are outlined, so the eye goes to one choice.",
    },
    {
      title: "Only differences",
      body: "The switch hides every feature where all plans agree, drops a section that ends up empty, and says how many it hid. On a phone it compares the two plans on screen.",
    },
    {
      title: "Sticky plan row",
      body: "The plan row sticks with its price and button, so a choice is one click away while reading. Set `--comparison-table-top` to clear a sticky site header, or `maxHeight` to scroll inside the table.",
    },
    {
      title: "Phone",
      body: "Below 768px it compares two plans at a time, picked at the top. Each feature is a label with the two values under it, aligned to the pickers, so nothing scrolls sideways.",
    },
  ],

  agent: {
    kind: "toggle-group",
    reads: [
      { field: "label", means: '"Billing".' },
      { field: "value", means: "Monthly or Yearly." },
      { field: "items", means: "Monthly and Yearly." },
    ],
    actions: [{ call: 'setValue("Yearly")', does: "Switches the billing period." }],
    refusal:
      'An agent\'s change runs through onBillingChange like anyone\'s. isAgentChange(details) is true for it; details.cancel() refuses it. A period that is not Monthly or Yearly is refused with both listed. "Only differences" is a switch the agent flips with toggle or setChecked, and the plan buttons are buttons or links it can press.',
    example: `await agent.act({
  steps: [
    { ref: "Billing", action: "setValue", args: ["Yearly"] },
    { ref: "Only differences", action: "setChecked", args: [true] },
  ],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves to the switch, the billing period, then each plan's button" },
    { keys: ["Space"], does: "Flips Only differences" },
    { keys: ["←", "→"], does: "Moves between Monthly and Yearly" },
    { keys: ["Enter"], does: "Chooses the focused billing period" },
  ],

  accessibility: [
    "A native table, read by row: features are row headers and plans are column headers.",
    "Each section is a header row that spans the plans, with `scope=\"colgroup\"`.",
    "A tick is announced as Included and a dash as Not included, not as symbols.",
    "The hidden count is a polite live region, so turning the filter on says what it did.",
    "On a phone the two pickers are named First plan and Second plan, and each value is prefixed with its plan's name for screen readers.",
  ],
} satisfies ComponentDoc;
