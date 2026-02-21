# ToggleGroup

A grouped set of toggles supporting single or multiple pressed states.

## Installation

```bash
npx @dinachi/cli@latest add toggle-group
```

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
```

```tsx
<ToggleGroup>
  <ToggleGroupItem value="bold" aria-label="Toggle bold">
    B
  </ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Toggle italic">
    I
  </ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Toggle underline">
    U
  </ToggleGroupItem>
</ToggleGroup>
```

## API Reference

- **ToggleGroup** -- The container that manages toggle state across items. Extends Base UI `ToggleGroup`. Accepts `value`, `defaultValue`, and `toggleMultiple` props.

- **ToggleGroupItem** -- An individual toggle button within the group. Extends Base UI `Toggle`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "outline"` | `"outline"` | Visual style of the toggle item |
| `size` | `"default" \| "sm" \| "lg"` | `"sm"` | Size of the toggle item |
| `value` | `string` | -- | The value associated with this toggle item |
