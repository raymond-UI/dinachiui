# ScrollArea

A custom scroll container with styled scrollbars and optional corner rendering.

## Installation

```bash
npx @dinachi/cli@latest add scroll-area
```

## Usage

```tsx
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from "@/components/ui/scroll-area"
```

```tsx
<ScrollArea className="h-72 w-48 rounded-md border">
  <ScrollAreaViewport>
    <ScrollAreaContent className="p-4">
      <h4 className="mb-4 text-sm font-medium">Tags</h4>
      {tags.map((tag) => (
        <div key={tag} className="text-sm">
          {tag}
        </div>
      ))}
    </ScrollAreaContent>
  </ScrollAreaViewport>
  <ScrollAreaScrollbar>
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
  <ScrollAreaCorner />
</ScrollArea>
```

## API Reference

- **ScrollArea** -- Root container that establishes the scroll region. Wraps `ScrollArea.Root` from Base UI.
- **ScrollAreaViewport** -- The visible scrollable window. Wraps `ScrollArea.Viewport`.
- **ScrollAreaContent** -- The inner content wrapper that determines scrollable size. Wraps `ScrollArea.Content`.
- **ScrollAreaScrollbar** -- A styled scrollbar track. Wraps `ScrollArea.Scrollbar`. Accepts `orientation` (`"vertical"` or `"horizontal"`, defaults to `"vertical"`).
- **ScrollAreaThumb** -- The draggable scrollbar handle. Wraps `ScrollArea.Thumb`.
- **ScrollAreaCorner** -- The corner element shown when both scrollbars are visible. Wraps `ScrollArea.Corner`.
