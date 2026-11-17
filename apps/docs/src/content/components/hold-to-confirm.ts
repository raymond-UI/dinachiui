import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "hold-to-confirm",
  description: "A destructive button that fires only after a held press.",
  usage: `import { HoldToConfirm } from "@/components/ui/hold-to-confirm"

export function DeleteProject() {
  return (
    <HoldToConfirm onConfirm={() => deleteProject()} confirmedLabel="Deleted">
      Hold to delete
    </HoldToConfirm>
  )
}`,

  examples: ["hold-to-confirm-default", "hold-to-confirm-variants", "hold-to-confirm-tuning"],

  parts: [
    {
      name: "HoldToConfirm",
      summary: "Confirms after a press held for `duration`.",
      props: [
        { name: "onConfirm", type: "(details) => void", description: "Runs when the hold completes or an agent presses. `details.cancel()` unwinds instead.", agent: true },
        { name: "variant", type: '"fill" | "ring" | "border"', default: '"fill"', description: "How progress is drawn. See **Variants**." },
        { name: "duration", type: "number", default: "1600", description: "Milliseconds the press must be held." },
        { name: "resetAfter", type: "number", default: "1600", description: "Milliseconds the confirmed state lasts. `0` stays confirmed." },
        { name: "confirmedLabel", type: "ReactNode", description: "Replaces the label while confirmed; announced." },
        { name: "holdHint", type: "string", default: '"Press and hold to confirm"', description: "The description assistive tech reads." },
        { name: "fillClassName", type: "string", description: "Class for the progress fill or stroke." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "render", type: "ReactElement | (props, state) => ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Variants",
      body: "- `fill` (default): a bar sweeps from the left behind the label.\n- `ring`: a stroke closes around the button. For square icon-only buttons.\n- `border`: the button's outline draws itself. For dense UI.",
    },
    {
      title: "When to use it",
      body: "- Actions with no undo: deleting a project, revoking a key, ending a session.\n- Skip it for repeated actions; each use costs the full hold.\n- Skip it for reversible actions; offer undo instead.",
    },
    {
      title: "Timing",
      body: "- Progress fills over `duration` and unwinds in 200ms.\n- Pressing again mid-unwind resumes from the current progress.\n- The hold survives a small drag off the button.",
    },
    {
      title: "State attributes",
      body: "`data-holding` is set while held, `data-confirmed` once confirmed. Style on these instead of `:active`.",
    },
  ],

  agent: {
    kind: "button",
    reads: [
      { field: "label", means: "The button's text, or its aria-label." },
      { field: "disabled", means: "True when the button is disabled." },
      { field: "confirm", means: "Set by default: a person approves each press." },
    ],
    actions: [
      { call: "press()", does: "Completes the hold at once and runs onConfirm. Fails if already confirmed." },
    ],
    refusal:
      "A press needs a person's approval by default: the step fails unless the agent's `allow` grants it, or `data-agent-confirm=\"none\"` lifts it. The press runs through onConfirm, where isAgentChange(details) is true and details.cancel() refuses it; the agent is told the app refused. A disabled button refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Hold to delete", action: "press" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Hold to fill the progress. Releasing the key cancels" },
    { keys: ["Tab"], does: "Moving focus away cancels the hold" },
  ],

  accessibility: [
    "A native button. With a non-button `render`, disabled becomes aria-disabled.",
    "`holdHint` is linked through aria-describedby.",
    "`confirmedLabel` is announced from a polite live region beside the button.",
    "Key repeat is ignored, so a held key is one hold.",
    "Give a `ring` button an aria-label.",
    "Reduced motion drops the press scale and keeps the progress.",
  ],
} satisfies ComponentDoc;
