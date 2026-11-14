import * as React from "react";
import { vi } from "vitest";
import { AgentProvider, createAgent, isAgentChange } from "../agent";
import { agentConformance } from "../test/agent-conformance";
import { render, screen } from "@testing-library/react";
import { CheckboxGroup } from "./checkbox-group";
import { Checkbox } from "../checkbox/checkbox";

describe("CheckboxGroup", () => {
  it("should render correctly", () => {
    render(
      <CheckboxGroup>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("should handle default values", () => {
    render(
      <CheckboxGroup defaultValue={["item1"]}>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should handle controlled state", () => {
    const mockOnValueChange = vi.fn();
    render(
      <CheckboxGroup value={["item1"]} onValueChange={mockOnValueChange}>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should handle disabled state", () => {
    render(
      <CheckboxGroup disabled defaultValue={["item1"]}>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-disabled");
  });

  it("should support parent checkbox with allValues", () => {
    const fruits = ['apple', 'banana', 'orange'];
    render(
      <CheckboxGroup allValues={fruits}>
        <label>
          <Checkbox parent />
          All Fruits
        </label>
        <label>
          <Checkbox value="apple" />
          Apple
        </label>
        <label>
          <Checkbox value="banana" />
          Banana
        </label>
      </CheckboxGroup>
    );
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("should apply custom className", () => {
    render(
      <CheckboxGroup className="custom-class">
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("group")).toHaveClass("custom-class");
  });

  it("should forward all props to base component", () => {
    render(
      <CheckboxGroup data-testid="checkbox-group" aria-label="Test group">
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByTestId("checkbox-group")).toHaveAttribute("aria-label", "Test group");
  });
});

agentConformance({
  name: "CheckboxGroup",
  label: "Toppings",
  render: ({ onChange, disabled }) => (
    <CheckboxGroup aria-label="Toppings" defaultValue={["cheese"]} disabled={disabled} onValueChange={onChange}>
      <label><Checkbox value="cheese" /> Cheese</label>
      <label><Checkbox value="olives" /> Olives</label>
    </CheckboxGroup>
  ),
  entry: { component: "checkbox-group", value: ["Cheese"], items: ["Cheese", "Olives"], multiple: true, actions: ["setValue"] },
  act: { action: "setValue", args: [["Cheese", "Olives"]], result: { value: ["Cheese", "Olives"] } },
  invalid: { action: "setValue", args: [["Ham"]], lists: ["Cheese", "Olives"] },
  person: async (user) => {
    await user.click(screen.getByRole("checkbox", { name: "Olives" }));
  },
  // Base UI's group and checkboxes alone commit twice on mount.
  commits: 2,
});

describe("CheckboxGroup: agent", () => {
  function mount(group: Partial<React.ComponentProps<typeof CheckboxGroup>> = {}, parent = false) {
    const agent = createAgent();
    render(
      <AgentProvider agent={agent}>
        <CheckboxGroup aria-label="Toppings" defaultValue={["cheese"]} allValues={["cheese", "olives"]} {...group}>
          {parent && <label><Checkbox parent /> All</label>}
          <label><Checkbox value="cheese" /> Cheese</label>
          <label><Checkbox value="olives" /> Olives</label>
          <label><Checkbox value="ham" disabled /> Ham</label>
        </CheckboxGroup>
      </AgentProvider>
    );
    const act = (ref: string, action: string, args: unknown[] = []) =>
      agent.act({ steps: [{ ref, action, args }] });
    const checked = (name: string) => screen.getByRole("checkbox", { name }).getAttribute("aria-checked");
    return { agent, act, checked };
  }

  it("lists each checkbox too, so one can be checked on its own", () => {
    const { agent } = mount();
    const boxes = agent.snapshot().filter((c) => c.component === "checkbox");
    expect(boxes.map((c) => [c.label, c.checked])).toEqual([
      ["Cheese", true],
      ["Olives", false],
      ["Ham", false],
    ]);
  });

  it("checks one checkbox through the group, marked as the agent's", async () => {
    const onValueChange = vi.fn();
    const { act, checked } = mount({ onValueChange });
    expect((await act("Olives", "setChecked", [true])).ok).toBe(true);
    expect(checked("Olives")).toBe("true");
    expect(onValueChange).toHaveBeenCalledWith(["cheese", "olives"], expect.anything());
    expect(isAgentChange(onValueChange.mock.calls[0][1])).toBe(true);
  });

  it("lets the group refuse a checkbox's change", async () => {
    const { act, checked } = mount({ onValueChange: (_, details) => details.cancel() });
    expect((await act("Cheese", "toggle")).error?.message).toMatch(/refused/);
    expect(checked("Cheese")).toBe("true");
  });

  it("sets the checked labels, matching case and leaving a disabled one as it is", async () => {
    const { act, agent, checked } = mount({ defaultValue: ["cheese", "ham"] });
    expect((await act("Toppings", "setValue", [["olives"]])).ok).toBe(true);
    expect(checked("Cheese")).toBe("false");
    expect(checked("Olives")).toBe("true");
    expect(checked("Ham")).toBe("true");
    expect(agent.snapshot().find((c) => c.label === "Toppings")?.value).toEqual(["Olives", "Ham"]);
  });

  it("refuses a disabled checkbox by name", async () => {
    const { act } = mount();
    expect((await act("Toppings", "setValue", [["Ham"]])).error?.message).toMatch(/disabled/);
  });

  it("checks every value through the parent checkbox", async () => {
    const { act, checked } = mount({}, true);
    expect((await act("All", "setChecked", [true])).ok).toBe(true);
    expect(checked("Olives")).toBe("true");
    expect(checked("All")).toBe("true");
  });
});
