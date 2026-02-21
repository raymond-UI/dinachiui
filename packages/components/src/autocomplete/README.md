# Autocomplete

A text input with dynamic suggestions that helps users find and select values quickly.

## Installation

```bash
npx @dinachi/cli@latest add autocomplete
```

## Usage

```tsx
import {
  Autocomplete,
  AutocompleteValue,
  AutocompleteCollection,
  AutocompletePortal,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteStatus,
  AutocompleteSeparator,
} from "@/components/ui/autocomplete"
```

```tsx
const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"]

<Autocomplete>
  <AutocompleteInput placeholder="Search fruits..." />
  <AutocompleteTrigger />
  <AutocompleteContent>
    <AutocompleteList>
      <AutocompleteEmpty>No results found.</AutocompleteEmpty>
      {fruits.map((fruit) => (
        <AutocompleteItem key={fruit} value={fruit}>
          {fruit}
        </AutocompleteItem>
      ))}
    </AutocompleteList>
  </AutocompleteContent>
  <AutocompleteStatus />
</Autocomplete>
```

## API Reference

- **Autocomplete** -- Root component that manages state. Wraps `Autocomplete.Root` from Base UI.
- **AutocompleteValue** -- Displays the selected value. Wraps `Autocomplete.Value` from Base UI.
- **AutocompleteCollection** -- Manages the collection of items. Wraps `Autocomplete.Collection` from Base UI.
- **AutocompletePortal** -- Renders the popup into a portal. Wraps `Autocomplete.Portal` from Base UI.
- **AutocompleteInput** -- The text input for typing search queries. Extends `Autocomplete.Input` from Base UI.
- **AutocompleteTrigger** -- Button to toggle the popup. Extends `Autocomplete.Trigger` from Base UI. Shows a chevron icon by default.
- **AutocompleteClear** -- Button to clear the current value. Extends `Autocomplete.Clear` from Base UI. Shows an X icon by default.
- **AutocompleteContent** -- Positioned popup container for the list. Wraps `Autocomplete.Popup` and `Autocomplete.Positioner` from Base UI. Animates on open/close.
- **AutocompleteList** -- Scrollable list container. Extends `Autocomplete.List` from Base UI.
- **AutocompleteItem** -- A selectable option. Extends `Autocomplete.Item` from Base UI. Accepts an optional `inset` prop for additional left padding.
- **AutocompleteGroup** -- Groups related items together. Extends `Autocomplete.Group` from Base UI.
- **AutocompleteGroupLabel** -- Label for a group of items. Extends `Autocomplete.GroupLabel` from Base UI.
- **AutocompleteEmpty** -- Shown when there are no matching items. Extends `Autocomplete.Empty` from Base UI.
- **AutocompleteStatus** -- Screen-reader-only status announcements. Extends `Autocomplete.Status` from Base UI.
- **AutocompleteSeparator** -- Visual divider between items or groups. Extends `Autocomplete.Separator` from Base UI.
