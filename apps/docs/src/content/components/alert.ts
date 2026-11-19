import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "alert",
  description: "An inline message about this page that stays put, with one optional action.",
  usage: `import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"

export function FloorWarning() {
  return (
    <Alert variant="warning">
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Sea View Double is under your floor</AlertTitle>
        <AlertDescription>£162 on Wed 14 is below the £170 floor.</AlertDescription>
      </AlertContent>
    </Alert>
  )
}`,
  anatomy: `<Alert>
  <AlertIcon />
  <AlertContent>
    <AlertTitle />
    <AlertDescription />
  </AlertContent>
  <AlertAction />
  <AlertDismiss />
</Alert>`,

  examples: ["alert-variants", "alert-action", "alert-phone"],

  parts: [
    {
      name: "Alert",
      summary: "The message box. Sets the tone, the role and whether it is shown.",
      props: [
        {
          name: "variant",
          type: '"default" | "info" | "success" | "warning" | "destructive"',
          default: '"default"',
          description: "The tone. `warning` and `destructive` get `role=\"alert\"`, the rest `role=\"status\"`. The agent reads it as type.",
          agent: true,
        },
        { name: "open", type: "boolean", description: "Shown or dismissed, when the parent holds it." },
        { name: "defaultOpen", type: "boolean", default: "true", description: "Whether it starts shown." },
        {
          name: "onOpenChange",
          type: "(open: boolean, details) => void",
          description: "Runs when AlertDismiss or the agent dismisses it. `details.cancel()` keeps it shown.",
          agent: true,
        },
        { name: "role", type: "string", description: "Overrides the role the variant sets." },
      ],
    },
    {
      name: "AlertIcon",
      summary: "The tinted icon. Hidden from assistive tech.",
      props: [{ name: "children", type: "ReactNode", description: "Replaces the variant's icon." }],
    },
    {
      name: "AlertContent",
      summary: "Holds the text, and the action when it goes under the text.",
      props: [],
    },
    {
      name: "AlertTitle",
      summary: "The one line that says what needs attention. Optional.",
      props: [{ name: "children", type: "ReactNode", description: "The agent reads it as label.", agent: true }],
    },
    {
      name: "AlertDescription",
      summary: "The detail. Without a title, it is the message.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          description: "The agent reads it as value, or as label when there is no title.",
          agent: true,
        },
      ],
    },
    {
      name: "AlertAction",
      summary: "The one button that fixes it. Optional.",
      props: [
        {
          name: "size",
          type: '"sm" | "default"',
          default: '"sm"',
          description: "`sm` sits beside the text. `default` is 40px tall, for a phone.",
        },
        { name: "onClick", type: "(event) => void", description: "Runs the fix. The alert stays until you hide it." },
      ],
    },
    {
      name: "AlertDismiss",
      summary: "The close button, named Dismiss. Opt-in.",
      props: [
        { name: "children", type: "ReactNode", default: "<X />", description: "Replaces the icon." },
        {
          name: "disabled",
          type: "boolean",
          description: "Turns the button off, and the agent's dismiss with it.",
          agent: true,
        },
      ],
    },
  ],

  notes: [
    {
      title: "Alert or toast",
      body: "An alert is about the page in front of the person and stays until the problem is gone or they dismiss it. A toast reports something that just happened and leaves on its own. If the message still matters after five seconds, it is an alert.",
    },
    {
      title: "Hiding it when the problem is fixed",
      body: "The action does not hide the alert, because the fix may fail. Derive `open` from the state the alert is about, so it leaves once the fix lands:\n\n```tsx\n<Alert variant=\"warning\" open={rate < floor}>\n  ...\n  <AlertAction onClick={() => setRate(floor)}>Raise to £{floor}</AlertAction>\n</Alert>\n```",
    },
    {
      title: "On a phone",
      body: "Let the alert run edge to edge above the rows it is about, and move the action under the text at full height. Nothing in the component fixes the layout, so the page decides:\n\n```tsx\n<Alert variant=\"warning\" className=\"rounded-none border-x-0\">\n  <AlertIcon />\n  <AlertContent>\n    <AlertTitle>...</AlertTitle>\n    <AlertDescription>...</AlertDescription>\n    <AlertAction size=\"default\">Raise to £170</AlertAction>\n  </AlertContent>\n  <AlertDismiss className=\"h-9 w-9\" />\n</Alert>\n```\n\nInside AlertContent the action gets its own top margin. Only the button is pressable, so a tap while scrolling does nothing.",
    },
    {
      title: "Motion",
      body: "It fades in and rises 4px over 200ms when it appears, and fades out over 150ms when dismissed, then unmounts. Re-renders never replay it. An alert in the server-rendered page skips the entrance, since it is part of the page as it loads rather than a change to it. With reduced motion it only fades. Both durations follow `--motion-duration-base` and `--motion-duration-fast`.",
    },
  ],

  agent: {
    kind: "alert",
    reads: [
      { field: "label", means: "The title, or the description when there is no title." },
      { field: "value", means: "The description, when there is a title." },
      { field: "type", means: "The variant, such as `warning`." },
    ],
    actions: [{ call: "dismiss()", does: "Dismisses it through `onOpenChange`. Only offered when the alert has an AlertDismiss." }],
    refusal:
      "`onOpenChange` gets details that `isAgentChange` recognises; `details.cancel()` keeps it shown and fails the step. A disabled AlertDismiss refuses on its own. The action is listed separately as a `button` in the alert and takes `press`.",
    example: `await agent.act({
  steps: [{ ref: "Sea View Double is under your floor", action: "dismiss" }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves to the action, then Dismiss" },
    { keys: ["Enter", "Space"], does: "Presses the focused button" },
  ],

  accessibility: [
    "`warning` and `destructive` are `role=\"alert\"` and interrupt; the rest are `role=\"status\"` and wait their turn.",
    "Screen readers announce an alert when it appears, not one already in the page as it loads.",
    "The icon is decorative. Say what is wrong in the text; the colour alone does not.",
    "Dismiss is a real button named Dismiss. The alert never takes focus.",
  ],
} satisfies ComponentDoc;
