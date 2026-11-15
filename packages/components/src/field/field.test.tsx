import { render } from "@testing-library/react"
import { AgentProvider, createAgent } from "../agent"
import { Fieldset, FieldsetLegend } from "../fieldset"
import { Form } from "../form"
import { Input } from "../input"
import { Field, FieldDescription, FieldError, FieldLabel } from "./field"

function Billing({ legend = true }: { legend?: boolean }) {
  const field = (
    <Field name="email" invalid>
      <FieldLabel>Email</FieldLabel>
      <Input required />
      <FieldDescription>We never share it</FieldDescription>
      <FieldError match>Enter a valid email</FieldError>
    </Field>
  )
  return (
    <Form aria-label="Billing">
      {legend ? (
        <Fieldset>
          <FieldsetLegend>Contact</FieldsetLegend>
          {field}
        </Fieldset>
      ) : (
        field
      )}
    </Form>
  )
}

function snapshotOf(ui: React.ReactElement) {
  const agent = createAgent()
  render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
  return agent.snapshot()
}

describe("Field with the agent bridge", () => {
  it("gives its control a label, required, invalid, the error and its fieldset", () => {
    expect(snapshotOf(<Billing />)).toEqual([
      expect.objectContaining({
        component: "input",
        label: "Email",
        required: true,
        invalid: true,
        errors: ["Enter a valid email"],
        in: "Contact",
      }),
    ])
  })

  it("names the form as the container when there is no fieldset", () => {
    expect(snapshotOf(<Billing legend={false} />)[0]).toMatchObject({ label: "Email", in: "Billing" })
  })
})
