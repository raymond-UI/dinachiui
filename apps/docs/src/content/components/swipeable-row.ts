import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "swipeable-row",
  description: "A row that swipes open to actions; a full swipe commits.",
  usage: `import { Archive, Trash2 } from "lucide-react"
import { SwipeableRow, SwipeableRowGroup } from "@/components/ui/swipeable-row"

export function Inbox({ onArchive, onDelete }: { onArchive: () => void; onDelete: () => void }) {
  return (
    <SwipeableRowGroup>
      <SwipeableRow
        actions={[
          { label: "Archive Weekly digest", icon: <Archive className="h-4 w-4" />, onSelect: onArchive },
          { label: "Delete Weekly digest", icon: <Trash2 className="h-4 w-4" />, onSelect: onDelete, destructive: true },
        ]}
        onDismiss={onDelete}
      >
        Weekly digest
      </SwipeableRow>
    </SwipeableRowGroup>
  )
}`,
  anatomy: `<SwipeableRowGroup>
  <SwipeableRow />
</SwipeableRowGroup>`,

  examples: ["swipeable-row-default", "swipeable-row-no-dismiss", "swipeable-row-keyboard"],

  parts: [
    {
      name: "SwipeableRow",
      summary: "The row, its actions and the gesture.",
      props: [
        { name: "actions", type: "SwipeableRowAction[]", description: "Revealed under the row, right to left. Each is `{ label, icon, onSelect(details), destructive?, disabled?, className? }`. Required.", agent: true },
        { name: "onDismiss", type: "(details) => void", description: "Runs on a full swipe. Omit it and the row only opens. `details.cancel()` slides it back.", agent: true },
        { name: "dismissAt", type: "number", default: "0.5", description: "Fraction of row width past which release commits `onDismiss`." },
        { name: "actionWidth", type: "number", default: "68", description: "Width of each action button in px." },
        { name: "aria-label", type: "string", description: "Names the row. Without it the agent uses its text.", agent: true },
      ],
    },
    {
      name: "SwipeableRowGroup",
      summary: "Optional. Keeps at most one row open.",
      props: [{ name: "children", type: "ReactNode", description: "The rows, at any depth." }],
    },
  ],

  notes: [
    {
      title: "Release",
      body: "On release the row projects where its momentum would carry it and compares that point with the thresholds. A short fast flick opens the row; a slow drag that stops short falls back. The spring takes over at the pointer's velocity.",
    },
    {
      title: "Dismiss threshold",
      body: "Past `dismissAt` the destructive action fills the row before release. Without `onDismiss` there is no threshold or destructive layer.",
    },
    {
      title: "Refusing a change",
      body: "`onSelect` and `onDismiss` both get change details. `details.reason` is `\"trigger-press\"`, `\"swipe\"` or `\"imperative-action\"` for an agent. `details.cancel()` in `onDismiss` slides the row back.",
    },
    {
      title: "When to use it",
      body: "- Long touch lists with per-row actions: mail, tasks, notifications.\n- For a short list, show the buttons instead.\n- Keep actions reversible; a destructive one still needs an undo.",
    },
    {
      title: "Behaviour",
      body: `- Opening a row in a SwipeableRowGroup closes the open one. Outside a group, each row is independent.
- The open resting point is \`actionWidth\` times the number of actions.
- The row can travel its full width.
- Row content is yours; the component owns only the gesture.`,
    },
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
  ],

  agent: {
    kind: "region",
    reads: [
      { field: "label", means: "The row's aria-label, or its text with each piece kept apart." },
      { field: "actions", means: "`dismiss` when the row has onDismiss, otherwise none." },
      { field: "disabled", means: "On an action's button, true when that action is disabled." },
    ],
    actions: [
      { call: "press()", does: "On an action, listed as a `button` named by its label even while hidden. Runs onSelect." },
      { call: "dismiss()", does: "On the row, when onDismiss is set. Runs it, then slides the row off." },
    ],
    refusal:
      "An agent's press runs through the action's onSelect and its dismiss through onDismiss. isAgentChange(details) is true for both; details.cancel() refuses either, tells the agent, and a refused dismiss leaves the row in place. A disabled action refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Archive Weekly digest", action: "press" }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves to the row's actions. Focusing one opens the row; leaving closes it" },
    { keys: ["Space", "Enter"], does: "Presses the focused action" },
  ],

  accessibility: [
    "Every action is a real button, reachable without swiping.",
    "Buttons are icon-only, so `label` is the name. Make it specific, as in `Archive Weekly digest`.",
    "Focusing an action opens the row.",
    "Reduced motion disables the drag and shows the actions beside the content.",
  ],
} satisfies ComponentDoc;
