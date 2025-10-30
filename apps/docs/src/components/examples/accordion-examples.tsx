import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from '@/components/ui/accordion';

export function DefaultAccordionExample() {
  return (
    <Accordion defaultValue={["item-1"]} className="w-full">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It adheres to the WAI-ARIA design pattern and uses semantic HTML elements.
        </AccordionPanel>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Is it styled?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionPanel>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Is it animated?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function MultipleAccordionExample() {
  return (
    <Accordion className="w-full">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Getting Started</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <div className="space-y-2">
            <p>Start by installing the required dependencies:</p>
            <code className="block p-2 bg-muted rounded text-sm">
              npm install @dinachi/components
            </code>
          </div>
        </AccordionPanel>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Configuration</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <div className="space-y-2">
            <p>Configure your project with the following steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Set up your CSS variables</li>
              <li>Configure your Tailwind config</li>
              <li>Add the provider to your app</li>
            </ol>
          </div>
        </AccordionPanel>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Advanced Usage</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Learn about advanced patterns including controlled state, custom styling, and integration with forms.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function ControlledAccordionExample() {
  const [value, setValue] = React.useState<string>('');

  return (
    <div className="w-full space-y-4">
      <div className="text-sm text-muted-foreground">
        Current open item: {value || 'none'}
      </div>
      
      <Accordion value={value ? [value] : []} onValueChange={(val) => setValue(val[0] || '')}>
        <AccordionItem value="features">
          <AccordionHeader>
            <AccordionTrigger>Features</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Our component library includes over 20 production-ready components with full TypeScript support.
          </AccordionPanel>
        </AccordionItem>
        
        <AccordionItem value="pricing">
          <AccordionHeader>
            <AccordionTrigger>Pricing</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            DinachiUI is completely free and open source. Use it in your personal and commercial projects.
          </AccordionPanel>
        </AccordionItem>
        
        <AccordionItem value="support">
          <AccordionHeader>
            <AccordionTrigger>Support</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Get support through our GitHub issues, Discord community, or comprehensive documentation.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}