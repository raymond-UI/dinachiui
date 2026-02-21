# Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

## Installation

```bash
npx @dinachi/cli@latest add accordion
```

## Usage

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"
```

```tsx
<Accordion>
  <AccordionItem value="item-1">
    <AccordionHeader>
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionHeader>
      <AccordionTrigger>Is it styled?</AccordionTrigger>
    </AccordionHeader>
    <AccordionPanel>
      Yes. It comes with default styles built on Tailwind CSS.
    </AccordionPanel>
  </AccordionItem>
</Accordion>
```

## API Reference

- **Accordion** -- Root container. Extends `Accordion.Root` from Base UI. Accepts `defaultValue`, `value`, and `onValueChange` props to control which items are open.
- **AccordionItem** -- A single collapsible section. Extends `Accordion.Item` from Base UI. Requires a unique `value` prop.
- **AccordionHeader** -- Wraps the trigger in a heading element. Extends `Accordion.Header` from Base UI.
- **AccordionTrigger** -- The button that toggles the panel. Extends `Accordion.Trigger` from Base UI. Includes a chevron icon that rotates when open.
- **AccordionPanel** -- The collapsible content area. Extends `Accordion.Panel` from Base UI. Animates open and closed.
