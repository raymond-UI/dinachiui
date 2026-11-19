import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "ask-bar",
  description: "A bar docked at the bottom of the page that takes a request or a command name, and answers with the exact change it would make.",
  usage: `import { AskBar, AskBarContent, AskBarTrigger, type AskPlan } from "@/components/ui/ask-bar"
import type { CommandItem } from "@/components/ui/command-items"

// Your own API: applies the change and returns a function that reverts it.
declare function adjustWeekendRates(pct: number): Promise<() => Promise<void>>

const commands: CommandItem[] = [{ id: "rates", label: "Rates", description: "Page" }]

function resolve(query: string): AskPlan | null {
  if (!/^raise/i.test(query)) return null
  return {
    title: "Raise weekend rates",
    sentence: ["Raise weekend rates by ", { field: "pct" }, "%."],
    fields: [{ id: "pct", label: "Change %", value: "10", inputMode: "decimal" }],
    touches: "8 weekend nights across 3 room types.",
    call: (v) => \`rates.adjust('2026-12', 'fri,sat', \${Number(v.pct) / 100})\`,
    verb: (v) => \`Raise 24 rates by \${v.pct}%\`,
    run: async (v) => ({ message: \`Raised 24 rates by \${v.pct}%.\`, undo: await adjustWeekendRates(Number(v.pct) / 100) }),
  }
}

export function RatesBar() {
  return (
    <AskBar resolve={resolve} commands={commands} suggestions={["raise weekend rates 10%"]}>
      <AskBarTrigger />
      <AskBarContent />
    </AskBar>
  )
}`,
  anatomy: `<AskBar>
  <AskBarTrigger />
  <AskBarContent>
    <AskBarDone />
    <AskBarPlan />
    <AskBarCommands />
    <AskBarSuggestions />
    <AskBarInput />
  </AskBarContent>
</AskBar>`,

  examples: ["ask-bar-default", "ask-bar-typing"],

  parts: [
    {
      name: "AskBar",
      summary: "Holds the text, the plan it resolved to, the values being edited and the done line.",
      props: [
        { name: "resolve", type: "(query, { signal }) => AskPlan | null | Promise<…>", description: "Turns the text into a plan, or null. Called after each change to the text, never to run; only the answer for the latest text is kept, and signal aborts once the text moves on, so a fetch can be cancelled. A sync answer lands before paint; a promise marks the plan busy until it settles.", agent: true },
        { name: "commands", type: "CommandItem[]", description: "Listed when the text resolves to no plan. The Command Palette's item shape.", agent: true },
        { name: "onCommand", type: "(command, action, details) => void", description: "Runs a picked command with its first action, or the one asked for. details.cancel() refuses it.", agent: true },
        { name: "filter", type: "(command, query) => boolean", description: "Decides which commands match. The default needs every word, then falls back to any word." },
        { name: "limit", type: "number", default: "5", description: "How many commands to list." },
        { name: "suggestions", type: "string[]", description: "Requests to offer as chips." },
        { name: "suggest", type: '"focus" | "typing"', default: '"focus"', description: "focus: every chip while the empty field has focus. typing: only chips that contain the text." },
        { name: "value", type: "string", description: "Controlled text." },
        { name: "defaultValue", type: "string", default: '""', description: "Starting text." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs as the text changes, from either side. details.cancel() refuses it.", agent: true },
        { name: "shortcut", type: "string | false", default: '"k"', description: "The letter that focuses it with Cmd (Mac) or Ctrl. false turns it off." },
        { name: "label", type: "string", default: '"Ask"', description: "Names the bar and its field. The agent finds the bar by it.", agent: true },
        { name: "confirm", type: "string | false", default: '"Changes many records at once."', description: "Why an agent's run needs a person's approval. false lets an agent run plans unasked. A plan's own confirm overrides it.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the field, the shortcut and the agent.", agent: true },
      ],
    },
    {
      name: "AskBarTrigger",
      summary: "The floating Ask button that opens the sheet on a phone. Renders nothing on a desktop.",
      props: [{ name: "children", type: "ReactNode", description: "Replaces the icon and label." }],
    },
    {
      name: "AskBarContent",
      summary: "The dock: 640px wide, 18px above the bottom of the window on a desktop; a bottom sheet on a phone. With no children it holds every part below.",
      props: [{ name: "className", type: "string", description: "Positions the dock, such as sm:absolute to keep it in a box." }],
    },
    {
      name: "AskBarPlan",
      summary: "The plan as one sentence, with editable values as inputs that grow with their text, the touch line, Show call and the button. On a phone, the fields are rows.",
      props: [
        { name: "showCallLabel", type: "string", default: '"Show call"', description: "The toggle that reveals the call." },
        { name: "hideCallLabel", type: "string", default: '"Hide call"', description: "The same toggle while the call shows." },
        { name: "editLabel", type: "string", default: '"Edit"', description: "The phone's way back to the request." },
      ],
    },
    {
      name: "AskBarDone",
      summary: "What ran, with Undo when the plan returned one. Fades in.",
      props: [{ name: "undoLabel", type: "string", default: '"Undo"', description: "The undo button." }],
    },
    {
      name: "AskBarCommands",
      summary: "The commands the text matched, when it resolved to no plan.",
      props: [],
    },
    {
      name: "AskBarSuggestions",
      summary: "Requests as chips. Picking one keeps focus in the field; on a phone it sends.",
      props: [],
    },
    {
      name: "AskBarInput",
      summary: "The field and its send button.",
      props: [
        { name: "placeholder", type: "string", default: '"Ask or type a command"', description: "Shown while empty." },
        { name: "sendLabel", type: "string", default: '"Send"', description: "Names the send button." },
      ],
    },
  ],

  notes: [
    {
      title: "The plan shape",
      body: "An `AskPlan` has a `title`, a `sentence` of strings and `{ field: id }` references, its `fields` (`id`, `label`, `value`, `fixed`, `inputMode`), a `touches` line and the `call` it makes (each a value, or a function of the values so it follows edits), `verb(values)` for the button and `run(values)`, which returns `{ message, undo? }`. `undo` may return a line to announce; otherwise `Undone.` is read. Fixed values read as plain text. Throwing from `run` shows the message in place of the touch line and keeps the plan.",
    },
    {
      title: "Nothing runs on its own",
      body: "`resolve` only describes the change. It runs when the person presses the button or Enter, and the button names exactly what it will do with the current values. An agent's press needs a person's approval unless `confirm` is false.",
    },
    {
      title: "Motion",
      body: "Focusing, the chips, the plan and its button label all change at once: they follow typing, and a plan never replays an entrance as values change. The done line fades in on opacity over 200ms with the ease-out token, and keeps the fade under reduced motion since nothing moves. The phone sheet slides in with the Drawer's own curve and duration, and leaves on the fast duration so dismissing never waits.",
    },
    {
      title: "On a phone",
      body: "Below 640px the Ask button opens a sheet with the field above the keyboard. A suggestion sends on tap. Sending drops the keyboard and the plan takes the sheet: the request with Edit, the fields as rows and the button at the bottom, by the thumb.",
    },
    {
      title: "With a Command Palette",
      body: "Both take Cmd+K by default, and the one mounted first wins. On a page with both, set `shortcut` to false on one, or give it another letter. A command an agent picks with `select` goes through `onCommand`, not `confirm`.",
    },
    {
      title: "In these docs",
      body: "The site's search holds Cmd+K, so the demos here take no shortcut. The docs agent has no `allow`, so the playground starts with `confirm` off for Run it and Undo to work; switch it on to see the run refused.",
    },
  ],

  agent: {
    kind: "combobox",
    reads: [
      { field: "label", means: "The bar's label." },
      { field: "value", means: "The text in the field." },
      { field: "items", means: "The commands listed, when the text resolved to no plan." },
      { field: "disabled", means: "True when the bar is blocked." },
    ],
    actions: [
      { call: 'search("raise weekend rates 10%")', does: "Types the request and returns the plan: title, sentence, fields, touches, call and the button's label, all for the current values. With no plan, returns the matching commands." },
      { call: 'select("Rates")', does: "Runs a listed command, with its first action or the one named." },
      { call: 'setValue on a field, by its label', does: "Edits a plan value. Fixed values are read-only." },
      { call: "press on the plan's button, by its label", does: "Runs the plan and returns the done message. The button is in the snapshot while a plan shows, labelled for the current values. Needs a person's approval unless confirm is false." },
      { call: 'press on "Undo"', does: "Puts the last run back." },
    ],
    refusal:
      "The text runs through onValueChange and commands through onCommand; isAgentChange(details) is true for each and details.cancel() refuses it. The plan's button carries confirm, so without an allow on the agent the step is refused and only the person can run it; with one, the person is asked. A label that changes while approval is pending refuses the step. disabled refuses everything.",
    example: `await agent.act({
  steps: [
    { ref: "Ask", action: "search", args: ["raise weekend rates 10% in December"] },
    { ref: "Change %", action: "setValue", args: ["12"] },
    { ref: "Raise 24 rates by 12%", action: "press" },
  ],
})`,
  },

  keyboard: [
    { keys: ["⌘", "K"], does: "Focuses the field, or opens the sheet on a phone" },
    { keys: ["Enter"], does: "Runs the plan, the highlighted command, or puts the highlighted chip in the field" },
    { keys: ["↓", "↑"], does: "Moves the highlight through the commands, then the chips" },
    { keys: ["Tab"], does: "Completes the highlighted entry into the field. Pressed again, moves on" },
    { keys: ["Esc"], does: "Clears the field and leaves it" },
  ],

  accessibility: [
    "The dock is a region named by label, ringed while focus is inside it; on a phone the field's pill takes the ring. The field has role combobox; commands and chips are listboxes under one highlight, and aria-activedescendant keeps focus in the field.",
    "The plan is a group named by its title. Each value is an input named by its field's label, so the sentence reads in order with its values.",
    "One polite live region per bar reads the plan with its button label once the text has been still for 700ms, so plans that only exist mid-word are never read. It then reads the done message, and the undo line. A failed run or undo is an alert.",
    "After a run, focus moves to Undo, or back to the field when there is none. After undo it returns to the field. While a run is in flight the field and values are read-only.",
    "Show call and Undo have hit areas of at least 24px. Each value is at least 24px wide and one line tall, an inline target within the sentence.",
    "On a phone the sheet is a modal dialog (aria-modal) and the rest of the page is hidden from assistive tech while it is open; sending moves focus to the plan so the keyboard drops.",
  ],
} satisfies ComponentDoc;
