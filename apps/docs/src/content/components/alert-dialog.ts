import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "alert-dialog",
  description: "A modal decision; an agent's confirm waits for a person.",
  usage: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteProject() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
  anatomy: `<AlertDialog>
  <AlertDialogTrigger />
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle />
      <AlertDialogDescription />
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel />
      <AlertDialogAction />
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,

  examples: ["alert-dialog-default", "alert-dialog-controlled"],

  parts: [
    {
      name: "AlertDialog",
      summary: "Holds the open state. Always modal.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starting open state when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs for people and agents. details.cancel() refuses the change.", agent: true },
        { name: "onOpenChangeComplete", type: "(open) => void", description: "Runs once the open or close animation ends." },
        { name: "actionsRef", type: "RefObject<{ close, unmount }>", description: "Closes the dialog imperatively." },
      ],
    },
    {
      name: "AlertDialogTrigger",
      summary: "The button that opens the dialog.",
      props: [
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour. For example `<Button />`." },
        { name: "children", type: "ReactNode", description: "Also the agent's name for it while closed.", agent: true },
      ],
    },
    {
      name: "AlertDialogContent",
      summary: "The portal, backdrop, viewport and popup in one.",
      props: [
        { name: "initialFocus", type: "boolean | RefObject | (openType) => ...", description: "Element focused on open." },
        { name: "finalFocus", type: "boolean | RefObject | (closeType) => ...", description: "Element focused on close. Defaults to the trigger." },
      ],
    },
    {
      name: "AlertDialogHeader",
      summary: "Stacks the title and description.",
      props: [],
    },
    {
      name: "AlertDialogTitle",
      summary: "The heading; names the dialog.",
      props: [{ name: "children", type: "ReactNode", description: "Also the agent's name for it while open.", agent: true }],
    },
    {
      name: "AlertDialogDescription",
      summary: "Explains the decision.",
      props: [],
    },
    {
      name: "AlertDialogFooter",
      summary: "Lays out buttons; stacks on small screens.",
      props: [],
    },
    {
      name: "AlertDialogAction",
      summary: "The confirm button. Closes the dialog.",
      props: [
        { name: "onClick", type: "(event) => void", description: "Do the work here. An agent's press needs a person's approval.", agent: true },
        { name: "render", type: "ReactElement", description: "Swap the element. Drops the default styles." },
      ],
    },
    {
      name: "AlertDialogCancel",
      summary: "The back-out button. Closes the dialog.",
      props: [
        { name: "render", type: "ReactElement", description: "Swap the element. Drops the default styles." },
        { name: "data-agent-confirm", type: "string", default: '"none"', description: "Lets an agent press it without approval.", agent: true },
      ],
    },
    {
      name: "AlertDialogPopup",
      summary: "The dialog box, for custom layouts.",
      props: [],
    },
    {
      name: "AlertDialogBackdrop",
      summary: "The dimmed layer behind the popup.",
      props: [],
    },
    {
      name: "AlertDialogViewport",
      summary: "Fixed layer that centres the popup.",
      props: [],
    },
    {
      name: "AlertDialogPortal",
      summary: "Renders its children into the body.",
      props: [{ name: "keepMounted", type: "boolean", default: "false", description: "Keeps the dialog in the DOM while closed." }],
    },
  ],

  notes: [
    {
      title: "Your own layout",
      body: "`AlertDialogContent` combines `AlertDialogPortal`, `AlertDialogBackdrop`, `AlertDialogViewport` and `AlertDialogPopup`. Compose them directly to change one.",
    },
    {
      title: "Dismissal",
      body: "Backdrop clicks do not close it. Only its buttons or Esc do.",
    },
  ],

  agent: {
    kind: "dialog",
    reads: [
      { field: "label", means: "The trigger's text while closed, the title while open." },
      { field: "open", means: "Whether the dialog is showing." },
    ],
    actions: [
      { call: "open()", does: "Opens the dialog. Only while closed." },
      { call: "close()", does: "Closes it. Only while open; needs no approval." },
    ],
    refusal:
      "Open and close run through onOpenChange. isAgentChange(details) is true for an agent's change; details.cancel() refuses it and the agent is told. While open, every control inside except AlertDialogCancel needs a person's approval. Without an allow function on the agent, those presses are refused.",
    example: `await agent.act({
  steps: [{ ref: "Delete Account", action: "open" }],
})`,
  },

  keyboard: [
    { keys: ["Space", "Enter"], does: "Opens the dialog from the trigger, or presses the focused button" },
    { keys: ["Tab"], does: "Moves focus between controls; focus stays in the dialog" },
    { keys: ["Esc"], does: "Closes the dialog and returns focus to the trigger" },
  ],

  accessibility: [
    "Role alertdialog, labelled by AlertDialogTitle, described by AlertDialogDescription.",
    "Focus moves in on open and is trapped until close.",
    "While open, the page behind is hidden from assistive tech and the agent.",
    "Focus returns to the trigger on close.",
  ],
} satisfies ComponentDoc;
