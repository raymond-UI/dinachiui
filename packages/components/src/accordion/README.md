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
<Accordion defaultValue={["item-1"]}>
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

## Notes

- `value` and `defaultValue` use arrays, even when `multiple` is `false`.
- Use `multiple` to allow more than one item to stay open.
- Use `AccordionItem.disabled` to disable a single section without disabling the entire accordion.
- Use `AccordionPanel.keepMounted` when closed content should stay mounted in the DOM.
- Use `hiddenUntilFound` when browser find-in-page should reveal content inside a closed panel.
- Dinachi's default styles are built for vertical accordions. Base UI also supports `orientation="horizontal"`, but horizontal layouts need custom styling.

## API Reference

- **Accordion** -- Root container. Extends `Accordion.Root` from Base UI. Common props include `value`, `defaultValue`, `onValueChange`, `multiple`, `disabled`, `loopFocus`, `keepMounted`, `hiddenUntilFound`, and `orientation`.
- **AccordionItem** -- A single collapsible section. Extends `Accordion.Item` from Base UI. Supports `value`, `disabled`, and `onOpenChange`.
- **AccordionHeader** -- Wraps the trigger in a heading element. Extends `Accordion.Header` from Base UI.
- **AccordionTrigger** -- The button that toggles the panel. Extends `Accordion.Trigger` from Base UI. Includes a chevron icon that rotates when open.
- **AccordionPanel** -- The collapsible content area. Extends `Accordion.Panel` from Base UI. Supports `keepMounted` and `hiddenUntilFound` and animates open and closed.

## Controlled Example

```tsx
import * as React from "react"
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

export function Example() {
  const [value, setValue] = React.useState<string[]>(["features"])

  return (
    <Accordion value={value} onValueChange={(nextValue) => setValue(nextValue as string[])}>
      <AccordionItem value="features">
        <AccordionHeader>
          <AccordionTrigger>Features</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Our component library includes over 20 production-ready components.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="pricing">
        <AccordionHeader>
          <AccordionTrigger>Pricing</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          DinachiUI is free and open source.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
```
