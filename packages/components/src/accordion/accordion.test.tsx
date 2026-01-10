import { render, screen } from "@testing-library/react";
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
});
