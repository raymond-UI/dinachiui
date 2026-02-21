# Tabs

A component for toggling between related panels on the same page.

## Installation

```bash
npx @dinachi/cli@latest add tabs
```

## Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator } from "@/components/ui/tabs"
```

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content goes here.</TabsContent>
  <TabsContent value="settings">Settings content goes here.</TabsContent>
  <TabsContent value="billing">Billing content goes here.</TabsContent>
</Tabs>
```

## API Reference

- **Tabs** -- The root container that manages tab state. Extends Base UI `Tabs.Root`. Accepts `defaultValue`, `value`, `onValueChange`, and `orientation` props.

- **TabsList** -- Container for the tab triggers. Extends Base UI `Tabs.List`. Accepts `activateOnFocus` and `loop` props.

- **TabsTrigger** -- A button that activates its associated content panel. Extends Base UI `Tabs.Tab`. Accepts `value` and `disabled` props.

- **TabsContent** -- The content panel displayed when its associated trigger is active. Extends Base UI `Tabs.Panel`. Accepts `value` and `keepMounted` props.

- **TabsIndicator** -- An optional animated indicator that tracks the active tab. Extends Base UI `Tabs.Indicator`. Place inside `TabsList` with `className="relative"` on the list for correct positioning.
