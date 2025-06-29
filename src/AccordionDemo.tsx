import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from '@dinachi/components';

function AccordionDemo() {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Accordion Examples</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Single Open</h3>
        <Accordion openMultiple={false} className="w-full">
          <AccordionItem value="item-1">
            <AccordionHeader>
              <AccordionTrigger>Section 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Content for section 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionHeader>
              <AccordionTrigger>Section 2</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Content for section 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionHeader>
              <AccordionTrigger>Section 3</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Content for section 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Multiple Open</h3>
        <Accordion openMultiple={true} className="w-full">
          <AccordionItem value="item-1">
            <AccordionHeader>
              <AccordionTrigger>Section A</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Content for section A. You can open multiple sections at once in this accordion.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionHeader>
              <AccordionTrigger>Section B</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              Content for section B. You can open multiple sections at once in this accordion.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="item-3" disabled>
            <AccordionHeader>
              <AccordionTrigger>Section C (Disabled)</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              You should not see this content.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default AccordionDemo;