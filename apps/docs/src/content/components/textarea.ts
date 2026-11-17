import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "textarea",
  description: "A multi-line text field.",
  usage: `import { Textarea } from "@/components/ui/textarea"

export function BioField() {
  return (
    <div>
      <label htmlFor="bio">Bio</label>
      <Textarea id="bio" placeholder="A sentence or two about yourself" />
    </div>
  )
}`,

  examples: ["textarea-label", "textarea-count", "textarea-disabled", "textarea-default"],

  parts: [
    {
      name: "Textarea",
      summary: "A native `<textarea>` styled like Input.",
      props: [
        { name: "value", type: "string", description: "Controlled text." },
        { name: "defaultValue", type: "string", description: "Starting text when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs on every edit, for people and agents. details.cancel() refuses an agent's change.", agent: true },
        { name: "onChange", type: "(event) => void", description: "The native change event. Fires for typing and agent edits." },
        { name: "rows", type: "number", description: "Visible height in lines. A min-height of 80px still applies." },
        { name: "placeholder", type: "string", description: "Shown while the field is empty." },
        { name: "maxLength", type: "number", description: "The most characters it accepts." },
        { name: "readOnly", type: "boolean", default: "false", description: "Selectable but not editable. Refuses agents too.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
      ],
    },
  ],

  notes: [
    {
      title: "When to use it",
      body: "- Answers of a sentence or more.\n- For a short value, use [Input](/docs/components/input).",
    },
  ],

  agent: {
    kind: "textarea",
    reads: [
      { field: "label", means: "The `<label>` tied to it, or its aria-label." },
      { field: "value", means: "The current text." },
      { field: "disabled", means: "True when the field is disabled." },
    ],
    actions: [
      { call: 'setValue("Final")', does: "Replaces the text." },
      { call: "clear()", does: "Empties the field." },
    ],
    refusal:
      "An agent's edit runs through onValueChange first. isAgentChange(details) is true for it; details.cancel() refuses it and tells the agent. A disabled or readOnly textarea refuses on its own.",
    example: `await agent.act({
  steps: [{ ref: "Bio", action: "setValue", args: ["Designer in Lagos."] }],
})`,
  },

  accessibility: [
    "A native `<textarea>`, with the browser's semantics and editing keys.",
    "Name it with `<label htmlFor>` or aria-label; the agent reads the same name.",
    "Point aria-describedby at helper text and character counts.",
  ],
} satisfies ComponentDoc;
