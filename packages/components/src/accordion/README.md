# Accordion

The Accordion component is a set of interactive headings that each reveal a section of content when clicked. It is built on top of the Base UI Accordion component.

## Installation

```bash
npm install @dinachi/accordion
```

## Usage

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "@dinachi/accordion";

function MyAccordion() {
  return (
    <Accordion openMultiple={false}>
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
          Yes. It comes with default styles that match the design system.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
```

## API Reference

### Accordion

The root accordion component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `openMultiple` | `boolean` | `true` | Whether multiple items can be open at once |
| `value` | `any[]` | `undefined` | Controlled open items |
| `defaultValue` | `any[]` | `undefined` | Default open items |
| `onValueChange` | `(value: any[]) => void` | `undefined` | Callback when open items change |
| `disabled` | `boolean` | `false` | Whether the accordion is disabled |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | The orientation of the accordion |

### AccordionItem

An accordion item containing a trigger and panel.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | Required | Unique identifier for this item |
| `disabled` | `boolean` | `false` | Whether this item is disabled |

### AccordionHeader

The header wrapper for the accordion trigger.

### AccordionTrigger

The button that toggles the accordion panel.

### AccordionPanel

The collapsible panel containing the content.
