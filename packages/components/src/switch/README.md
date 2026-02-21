# Switch

A control that allows users to toggle a setting on or off.

## Installation

```bash
npx @dinachi/cli@latest add switch
```

## Usage

```tsx
import { Switch, SwitchThumb } from "@/components/ui/switch"
```

```tsx
<Switch defaultChecked>
  <SwitchThumb />
</Switch>
```

## API Reference

- **Switch** -- The root toggle control. Extends Base UI `Switch.Root`. Accepts `checked`, `defaultChecked`, `onCheckedChange`, and `disabled` props.
- **SwitchThumb** -- The sliding thumb indicator inside the switch track. Extends Base UI `Switch.Thumb`.
