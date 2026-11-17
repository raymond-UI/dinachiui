import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "compare-slider",
  description: "Two aligned layers split by a movable divider.",
  usage: `import { CompareSlider } from "@/components/ui/compare-slider"

export function Retouch() {
  return (
    <CompareSlider
      label="Compare the two revisions"
      before={<img src="/before.jpg" alt="Before retouching" />}
      after={<img src="/after.jpg" alt="After retouching" />}
    />
  )
}`,

  examples: ["compare-slider-default", "compare-slider-panel", "compare-slider-live"],

  parts: [
    {
      name: "CompareSlider",
      summary: "The panel, both layers and the handle.",
      props: [
        { name: "before", type: "ReactNode", description: "The layer left of the divider." },
        { name: "after", type: "ReactNode", description: "The layer right of the divider." },
        { name: "defaultPosition", type: "number", default: "50", description: "Starting divider position, 0 to 100." },
        { name: "onPositionChange", type: "(position, details) => void", description: "Runs on release, each key step and for agents. details.cancel() puts the divider back.", agent: true },
        { name: "step", type: "number", default: "2", description: "Percentage points per arrow key. Shift moves five times as far." },
        { name: "drag", type: '"handle" | "panel"', default: '"handle"', description: "What starts a drag. `handle` keeps both layers interactive." },
        { name: "label", type: "string", default: '"Compare position"', description: "Accessible name for the handle. Also the name the agent reads.", agent: true },
        { name: "stickyHandle", type: "boolean", default: "false", description: "Keeps the knob mid-viewport. Use when the panel is taller than the screen." },
        { name: "disabled", type: "boolean", default: "false", description: "Ignores drags and keys, dims the panel and blocks agents.", agent: true },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Drag modes",
      body: "- `handle` (default): only the divider starts a drag; both layers stay interactive. Use when either side is real UI.\n- `panel`: pressing anywhere jumps the divider there and makes both layers inert. Use when both sides are images.",
    },
    {
      title: "When to use it",
      body: "- Before and after photos, design diffs, a map with a layer toggled.\n- Both layers must share the same frame, position and size.\n- For two unaligned things, use side-by-side panels.",
    },
    {
      title: "Behaviour",
      body: "- A pointer drag tracks 1:1 with no easing.\n- A keyboard step animates over 100ms; a held arrow key moves continuously.\n- Grabbing the handle keeps the grab offset. In `panel` mode the divider jumps to the press.\n- A second pointer mid-drag is ignored until the first lifts.\n- `onPositionChange` runs only when the rounded position changes.",
    },
  ],

  agent: {
    kind: "slider",
    reads: [
      { field: "label", means: "The `label` prop, the handle's aria-label." },
      { field: "value", means: "The divider position, a whole number from 0 to 100." },
      { field: "min / max", means: "Always 0 and 100." },
      { field: "disabled", means: "True when the slider is disabled." },
    ],
    actions: [
      { call: "setValue(70)", does: "Moves the divider. Rounds the input; refuses non-numbers and out-of-range values." },
    ],
    refusal:
      "An agent's move runs through onPositionChange with `details.reason` set to `imperative-action`. isAgentChange(details) is true for it, and details.cancel() refuses it; the divider stays and the agent is told the app refused. A disabled slider refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Compare the two revisions", action: "setValue", args: [70] }],
})`,
  },

  keyboard: [
    { keys: ["←", "↓"], does: "Moves the divider left by one step" },
    { keys: ["→", "↑"], does: "Moves the divider right by one step" },
    { keys: ["Shift", "Arrow"], does: "Moves five steps at once" },
    { keys: ["Home", "End"], does: "Jumps to either end" },
  ],

  accessibility: [
    "The handle is a slider with min, max, live valuenow and a percentage valuetext.",
    "The announced value updates on key press and stays current during a drag.",
    "Give it a `label` naming what is compared; the default describes only the control.",
    "Disabled, the handle leaves the tab order and gets aria-disabled.",
    "Reduced motion applies each keyboard step immediately.",
  ],
} satisfies ComponentDoc;
