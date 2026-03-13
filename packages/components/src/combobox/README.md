# Combobox

A combobox that combines text input with a selectable popup list of options.

## Installation

```bash
npx @dinachi/cli@latest add combobox
```

## Usage

```tsx
import {
  Combobox,
  ComboboxValue,
  ComboboxCollection,
  ComboboxPortal,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxLabel,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxSeparator,
} from "@/components/ui/combobox"
```

```tsx
const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

<Combobox>
  <ComboboxInput placeholder="Select framework..." />
  <ComboboxTrigger />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxEmpty>No framework found.</ComboboxEmpty>
      {frameworks.map((fw) => (
        <ComboboxItem key={fw.value} value={fw.value}>
          {fw.label}
        </ComboboxItem>
      ))}
    </ComboboxList>
  </ComboboxContent>
  <ComboboxStatus />
</Combobox>
```

## API Reference

- **Combobox** -- Root component that manages state. Wraps `Combobox.Root` from Base UI.
- **ComboboxValue** -- Displays the selected value. Wraps `Combobox.Value` from Base UI.
- **ComboboxCollection** -- Manages the collection of items. Wraps `Combobox.Collection` from Base UI.
- **ComboboxPortal** -- Renders the popup into a portal. Wraps `Combobox.Portal` from Base UI.
- **ComboboxInputGroup** -- Groups the input, trigger, and clear button together. Wraps `Combobox.InputGroup` from Base UI.
- **ComboboxInput** -- The text input for filtering options. Extends `Combobox.Input` from Base UI.
- **ComboboxLabel** -- An accessible label for the combobox field. Extends `Combobox.Label` from Base UI.
- **ComboboxTrigger** -- Button to toggle the popup. Extends `Combobox.Trigger` from Base UI. Shows a chevron icon by default.
- **ComboboxClear** -- Button to clear the current selection. Extends `Combobox.Clear` from Base UI. Shows an X icon by default.
- **ComboboxContent** -- Positioned popup container for the list. Wraps `Combobox.Popup` and `Combobox.Positioner` from Base UI. Animates on open/close.
- **ComboboxList** -- Scrollable list container. Extends `Combobox.List` from Base UI.
- **ComboboxItem** -- A selectable option with a check icon indicator. Extends `Combobox.Item` from Base UI. Accepts an optional `inset` prop for additional left padding.
- **ComboboxGroup** -- Groups related items together. Extends `Combobox.Group` from Base UI.
- **ComboboxGroupLabel** -- Label for a group of items. Extends `Combobox.GroupLabel` from Base UI.
- **ComboboxEmpty** -- Shown when there are no matching items. Extends `Combobox.Empty` from Base UI.
- **ComboboxStatus** -- Screen-reader-only status announcements. Extends `Combobox.Status` from Base UI.
- **ComboboxSeparator** -- Visual divider between items or groups. Extends `Combobox.Separator` from Base UI.
