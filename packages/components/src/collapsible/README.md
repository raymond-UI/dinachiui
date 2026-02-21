# Collapsible

A collapsible panel controlled by a button.

## Installation

```bash
npx @dinachi/cli@latest add collapsible
```

## Usage

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "@/components/ui/collapsible"
```

```tsx
<Collapsible>
  <CollapsibleTrigger>Toggle content</CollapsibleTrigger>
  <CollapsiblePanel>
    <p className="p-4">This content can be collapsed and expanded.</p>
  </CollapsiblePanel>
</Collapsible>
```

## API Reference

- **Collapsible** -- Root container that manages open state. Extends `Collapsible.Root` from Base UI. Accepts `open`, `defaultOpen`, and `onOpenChange` props.
- **CollapsibleTrigger** -- Button that toggles the panel. Extends `Collapsible.Trigger` from Base UI. Styled with hover and focus states. Supports `[data-panel-open]` for styling child icons when open.
- **CollapsiblePanel** -- The collapsible content area. Extends `Collapsible.Panel` from Base UI. Animates height on open and close.
