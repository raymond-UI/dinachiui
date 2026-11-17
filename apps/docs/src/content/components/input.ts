import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "input",
  description: "A single line of text, typed by a person or agent.",
  usage: `import { Input } from "@/components/ui/input"

export function ProjectName() {
  return (
    <div className="space-y-2">
      <label htmlFor="project">Project name</label>
      <Input id="project" placeholder="Atlas" />
    </div>
  )
}`,

  examples: ["input-label", "input-default", "input-types", "input-disabled", "input-validation"],

  parts: [
    {
      name: "Input",
      summary: "A styled native input.",
      props: [
        { name: "value", type: "string", description: "Controlled value." },
        { name: "defaultValue", type: "string", description: "Starting value when uncontrolled." },
        { name: "onValueChange", type: "(value, details) => void", description: "Runs for people and agents. `details.cancel()` refuses an agent's change.", agent: true },
        { name: "onChange", type: "(event) => void", description: "The native change handler. Runs for typing and for an agent's write." },
        { name: "type", type: "string", default: '"text"', description: "The native input type. A `file` input takes no agent actions.", agent: true },
        { name: "placeholder", type: "string", description: "Shown while empty. The agent's name for the field when nothing else labels it.", agent: true },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "readOnly", type: "boolean", default: "false", description: "Readable and selectable; refuses an agent's write.", agent: true },
        { name: "aria-invalid", type: "boolean", description: "Draws the error border and ring. The agent reads it as invalid.", agent: true },
      ],
    },
  ],

  notes: [
    {
      title: "Labels and fields",
      body: "Pair the input with a `<label htmlFor>` or wrap it in a `Field` with a `FieldLabel`. Inside a Field, an agent's write marks it dirty and filled like typing.",
    },
  ],

  agent: {
    kind: "input",
    reads: [
      { field: "label", means: "The aria-label, the associated label, then the placeholder or name." },
      { field: "value", means: "The current text. Redacted for passwords and secret autocomplete fields." },
      { field: "disabled", means: "True when the input is disabled." },
      { field: "required", means: "True when the input is required." },
      { field: "invalid", means: "True when aria-invalid is set or the Field is invalid." },
      { field: "errors", means: "The messages aria-errormessage points to, while invalid." },
    ],
    actions: [
      { call: 'setValue("Atlas")', does: "Replaces the text with a real input event, so onChange and a Field see it." },
      { call: "clear()", does: "Empties the field the same way." },
    ],
    refusal:
      "An agent's write runs through onValueChange first. isAgentChange(details) is true for it; details.cancel() refuses it before onChange or the Field see it, and the agent is told the app refused. A disabled or readOnly input refuses on its own, and a `type=\"file\"` input offers no actions.",
    example: `await agent.act({
  steps: [{ ref: "Username", action: "setValue", args: ["ada"] }],
})`,
  },

  accessibility: [
    "Renders a native input with native semantics and keyboard handling.",
    "Name every input with a label, FieldLabel or aria-label. A placeholder vanishes on typing.",
    "Set aria-invalid when the value is wrong; it is styled and announced.",
  ],
} satisfies ComponentDoc;
