import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { vi } from "vitest";
import { AgentProvider, createAgent, isAgentChange } from "../agent";
import { agentConformance } from "../test/agent-conformance";
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from "./accordion";

describe("Accordion", () => {
  it("should render", () => {
    render(
      <Accordion multiple={false}>
        <AccordionItem value="item-1">
          <AccordionHeader>
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Is it accessible?")).toBeInTheDocument();
  });

  it("should toggle an item open and closed", async () => {
    const user = userEvent.setup();

    render(
      <Accordion multiple>
        <AccordionItem value="item-1">
          <AccordionHeader>
            <AccordionTrigger>Getting Started</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Panel 1</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: /getting started/i });

    expect(screen.queryByText("Panel 1")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText("Panel 1")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByText("Panel 1")).not.toBeInTheDocument();
  });

  it("should support controlled single-item open and close", async () => {
    const user = userEvent.setup();

    function ControlledAccordion() {
      const [value, setValue] = React.useState<string[]>(["features"]);

      return (
        <Accordion value={value} onValueChange={(nextValue) => setValue(nextValue as string[])}>
          <AccordionItem value="features">
            <AccordionHeader>
              <AccordionTrigger>Features</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>Features panel</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionHeader>
              <AccordionTrigger>Pricing</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>Pricing panel</AccordionPanel>
          </AccordionItem>
        </Accordion>
      );
    }

    render(<ControlledAccordion />);

    expect(screen.getByText("Features panel")).toBeInTheDocument();
    expect(screen.queryByText("Pricing panel")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /pricing/i }));
    expect(screen.queryByText("Features panel")).not.toBeInTheDocument();
    expect(screen.getByText("Pricing panel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /pricing/i }));
    expect(screen.queryByText("Pricing panel")).not.toBeInTheDocument();
  });
});

function Faq(props: React.ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      {["Shipping", "Returns", "Billing"].map((name) => (
        <AccordionItem key={name} value={name.toLowerCase()} disabled={name === "Billing" ? true : undefined}>
          <AccordionHeader>
            <AccordionTrigger>{name}</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>{name} answer</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

agentConformance({
  name: "Accordion",
  label: "Shipping",
  render: ({ onChange, disabled }) => <Faq onValueChange={onChange} disabled={disabled} />,
  entry: { component: "disclosure", open: false, actions: ["open"] },
  act: { action: "open", result: { open: true } },
  commits: 2,
  person: async (user) => {
    await user.click(screen.getByRole("button", { name: "Shipping" }));
  },
});

describe("Accordion: agent", () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent();
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>);
    const run = (ref: string, action: string) => agent.act({ steps: [{ ref, action }] });
    const entry = (label: string) => agent.snapshot().find((c) => c.label === label);
    return { agent, run, entry };
  }

  it("lists one disclosure per item, and not the triggers as buttons", () => {
    const { agent } = mount(<Faq />);
    const entries = agent.snapshot();
    expect(entries.map((c) => [c.component, c.label])).toEqual([
      ["disclosure", "Shipping"],
      ["disclosure", "Returns"],
      ["disclosure", "Billing"],
    ]);
    expect(entries[2].disabled).toBe(true);
  });

  it("names a labelled accordion as the place its items are in", () => {
    const { entry } = mount(<Faq aria-label="Help" />);
    expect(entry("Shipping")?.in).toBe("Help");
  });

  it("reads an open item as its panel's text, so the agent can answer from it", async () => {
    const { run, entry } = mount(<Faq />);
    expect(entry("Shipping")?.value).toBeUndefined();
    await run("Shipping", "open");
    expect(entry("Shipping")).toMatchObject({ open: true, value: "Shipping answer" });
  });

  it("replaces the open item in a single accordion", async () => {
    const { run, entry } = mount(<Faq defaultValue={["shipping"]} />);
    expect(entry("Shipping")).toMatchObject({ open: true, actions: ["close"] });
    await run("Returns", "open");
    expect(entry("Returns")?.open).toBe(true);
    expect(entry("Shipping")?.open).toBe(false);
  });

  it("keeps other items open in a multiple accordion, and closes one", async () => {
    const { run, entry } = mount(<Faq multiple defaultValue={["shipping"]} />);
    await run("Returns", "open");
    expect([entry("Shipping")?.open, entry("Returns")?.open]).toEqual([true, true]);
    await run("Shipping", "close");
    expect([entry("Shipping")?.open, entry("Returns")?.open]).toEqual([false, true]);
  });

  it("leaves the item closed when the app refuses", async () => {
    const onValueChange = vi.fn((_value: unknown[], details: { cancel(): void }) => details.cancel());
    const { run, entry } = mount(<Faq onValueChange={onValueChange} />);
    expect((await run("Shipping", "open")).error?.message).toMatch(/refused/);
    expect(isAgentChange(onValueChange.mock.calls[0][1])).toBe(true);
    expect(entry("Shipping")?.open).toBe(false);
  });

  it("opens a controlled accordion through its parent", async () => {
    function Controlled() {
      const [value, setValue] = React.useState<unknown[]>([]);
      return <Faq value={value} onValueChange={setValue} />;
    }
    const { run, entry } = mount(<Controlled />);
    await run("Returns", "open");
    expect(entry("Returns")?.open).toBe(true);
    expect(screen.getByText("Returns answer")).toBeVisible();
  });

  it("opens an item that has no value of its own", async () => {
    const { run, entry } = mount(
      <Accordion>
        <AccordionItem>
          <AccordionHeader>
            <AccordionTrigger>Plain</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Body</AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
    await run("Plain", "open");
    expect(entry("Plain")?.open).toBe(true);
  });
});
