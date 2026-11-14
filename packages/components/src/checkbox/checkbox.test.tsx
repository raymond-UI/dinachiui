import * as React from "react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AgentProvider, createAgent, isAgentChange } from "../agent";
import { agentConformance } from "../test/agent-conformance";
import { render, screen } from "@testing-library/react";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("should render correctly", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });
});

agentConformance({
  name: "Checkbox",
  label: "Accept terms",
  render: ({ onChange, disabled }) => (
    <Checkbox aria-label="Accept terms" disabled={disabled} onCheckedChange={onChange} />
  ),
  entry: { component: "checkbox", checked: false, actions: ["toggle", "setChecked"] },
  act: { action: "toggle", result: { checked: true } },
  person: async (user) => {
    await user.click(screen.getByRole("checkbox", { name: "Accept terms" }));
  },
});

describe("Checkbox: agent", () => {
  function mount(props: React.ComponentProps<typeof Checkbox> = {}) {
    const agent = createAgent();
    render(
      <AgentProvider agent={agent}>
        <Checkbox aria-label="Accept terms" {...props} />
      </AgentProvider>
    );
    const box = screen.getByRole("checkbox");
    const setChecked = (value: unknown) =>
      agent.act({ steps: [{ ref: "Accept terms", action: "setChecked", args: [value] }] });
    return { agent, box, setChecked };
  }

  it("reads \"false\" as unchecked and does nothing when already there", async () => {
    const onCheckedChange = vi.fn();
    const { box, setChecked } = mount({ defaultChecked: true, onCheckedChange });
    expect((await setChecked("false")).ok).toBe(true);
    expect(box).toHaveAttribute("aria-checked", "false");
    expect(isAgentChange(onCheckedChange.mock.calls[0][1])).toBe(true);
    await setChecked(false);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });

  it("reports indeterminate as mixed", () => {
    const { agent } = mount({ indeterminate: true });
    expect(agent.snapshot()[0]).toMatchObject({ checked: "mixed" });
  });

  it("keeps a refused change off the checkbox", async () => {
    const { box, setChecked } = mount({ onCheckedChange: (_, details) => details.cancel() });
    expect((await setChecked(true)).error?.message).toMatch(/refused/);
    expect(box).toHaveAttribute("aria-checked", "false");
  });

  it("refuses when read-only", async () => {
    const onCheckedChange = vi.fn();
    const { setChecked } = mount({ readOnly: true, onCheckedChange });
    expect((await setChecked(true)).error?.message).toMatch(/read-only/);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("follows the checked prop", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = React.useState(true);
      return <Checkbox aria-label="Accept terms" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-checked", "true");
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "false");
  });
});
