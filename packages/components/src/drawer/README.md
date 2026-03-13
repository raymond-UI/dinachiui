# Drawer

A panel that slides in from the edge of the screen for focused workflows.

## Installation

```bash
npx @dinachi/cli@latest add drawer
```

## Usage

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
```

```tsx
<Drawer>
  <DrawerTrigger>Open Drawer</DrawerTrigger>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>Settings</DrawerTitle>
      <DrawerDescription>Update your preferences below.</DrawerDescription>
    </DrawerHeader>
    <p>Drawer body content goes here.</p>
    <DrawerFooter>
      <DrawerClose>Close</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## API Reference

- **Drawer** -- Wraps `Drawer.Root` from Base UI. Controls open state.
- **DrawerTrigger** -- Wraps `Drawer.Trigger`. Button that opens the drawer.
- **DrawerPortal** -- Wraps `Drawer.Portal`. Renders children into a portal.
- **DrawerBackdrop** -- Styled wrapper around `Drawer.Backdrop`. Semi-transparent overlay.
- **DrawerContent** -- Convenience component that composes the portal, backdrop, and popup. Accepts a `side` prop.
- **DrawerTitle** -- Styled wrapper around `Drawer.Title`. Renders the drawer heading.
- **DrawerDescription** -- Styled wrapper around `Drawer.Description`. Supporting text below the title.
- **DrawerClose** -- Wraps `Drawer.Close`. Button that closes the drawer.
- **DrawerSwipeArea** -- Explicit swipe area for touch-based interactions. Wraps `Drawer.SwipeArea`. Use to define a specific region where swipe-to-close gestures are recognized.
- **DrawerHeader** -- Layout wrapper (`div`) for the title and description area.
- **DrawerFooter** -- Layout wrapper (`div`) for action buttons, pushed to the bottom.

| Component | Prop | Type | Default | Description |
|---|---|---|---|---|
| `DrawerContent` | `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | The edge of the screen the drawer slides in from. |
