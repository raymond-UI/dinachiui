import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
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
