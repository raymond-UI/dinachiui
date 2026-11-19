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
        { name: "plans", type: "ComparisonPlan[]", description: "Each plan: `id`, `name`, `price` and `per` as one node or keyed by period value, `cta` (`false` for none), `highlighted` for the one to tint, and `badge` for its label." },
        { name: "groups", type: "ComparisonGroup[]", description: "Sections of features. Each feature has a `label` and `values` by plan id: `true`, `false` or text. A missing value is not included." },
        { name: "billingPeriods", type: "{ value: string; label: string }[] | false", default: "Monthly and Yearly", description: "The toggle's periods, which `price` and `per` are keyed by. `false`, or fewer than two, drops the toggle, for plans with one price.", agent: true },
        { name: "billingLabel", type: "string", default: '"Billing"', description: "Names the toggle, for people and agents.", agent: true },
        { name: "billing", type: "string", description: "Controlled billing period, by value.", agent: true },
        { name: "defaultBilling", type: "string", default: "the first period", description: "Starting period when uncontrolled." },
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
      title: "Highlight",
      body: "The highlighted plan is a tinted column, the only filled button and a Recommended badge over its name, on a phone too. Set `badge` to word it your way, or to label any plan.",
    },
    {
      title: "Periods",
      body: "Monthly and Yearly by default. Pass `billingPeriods` for your own, such as rate types, and key each plan's `price` by their values. A plain `price` is the same for every period. `billingPeriods={false}` drops the toggle for plans with a single price.",
    },
    {
      title: "Buttons",
      body: "Each plan has a button, Choose and the plan's name unless `cta.label` says otherwise. `cta: false` leaves a plan without one, and the row of buttons goes when no plan has one.",
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
      { field: "label", means: '"Billing", or `billingLabel`.' },
      { field: "value", means: "The chosen period's label, such as Monthly." },
      { field: "items", means: "Every period's label." },
    ],
    actions: [{ call: 'setValue("Yearly")', does: "Switches the billing period." }],
    refusal:
      'An agent\'s change runs through onBillingChange like anyone\'s. isAgentChange(details) is true for it; details.cancel() refuses it. A period that is not on the toggle is refused with the periods listed. Without a toggle there is no Billing entry. "Only differences" is a switch the agent flips with toggle or setChecked, and the plan buttons are buttons or links it can press.',
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
    { keys: ["←", "→"], does: "Moves between billing periods" },
    { keys: ["Enter"], does: "Chooses the focused billing period" },
  ],

  accessibility: [
    "A native table, read by row: features are row headers and plans are column headers.",
    "Each section is a header row that spans the plans, with `scope=\"colgroup\"`.",
    "A tick is announced as Included and a dash as Not included, not as symbols.",
    "The hidden count is a polite live region, so turning the filter on says what it did.",
    "The badge is part of its plan's column header, and describes the plan's button and phone picker.",
    "A `cta.label` without the plan's name, such as Book, is read with it: Book, Team.",
    "Prices sit in a row under the plan names, so a column header reads as the plan alone.",
    "On a phone the two pickers are named First plan and Second plan, and each value is prefixed with its plan's name for screen readers.",
  ],
} satisfies ComponentDoc;
