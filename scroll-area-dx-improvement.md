# ScrollArea: Simplify consumer API by encapsulating Base-UI composition

## Problem

The current `ScrollArea` exports 6 individual primitives that consumers must manually compose in the correct order. This creates two issues:

### 1. Verbose, repetitive boilerplate

Every usage requires 5 imports and 6 JSX tags:

```tsx
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from "@/components/ui/scroll-area"

<ScrollArea className="h-64">
  <ScrollAreaViewport>
    <ScrollAreaContent>
      {children}
    </ScrollAreaContent>
  </ScrollAreaViewport>
  <ScrollAreaScrollbar orientation="vertical">
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
</ScrollArea>
```

### 2. Easy to misuse — `ScrollAreaContent` is always forgotten

Base-UI requires `Viewport > Content > {children}` for correct overflow detection and thumb sizing. In practice, **every consumer in the codebase** (7/7 instances) skips `ScrollAreaContent` and places children directly in `ScrollAreaViewport`. This can break `data-has-overflow-*` attributes and `--scroll-area-thumb-height` CSS variable calculations.

The API makes it too easy to get wrong.

## Proposed solution

Expose a single compound `ScrollArea` component that handles the full Base-UI composition internally:

```tsx
<ScrollArea className="h-64">
  {children}
</ScrollArea>
```

### Implementation

```tsx
const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    orientation?: "vertical" | "horizontal"
    viewportClassName?: string
    scrollbarClassName?: string
  }
>(({ className, orientation = "vertical", viewportClassName, scrollbarClassName, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className={cn("size-full rounded-[inherit]", viewportClassName)}>
      <ScrollAreaPrimitive.Content className="min-w-full">
        {children}
      </ScrollAreaPrimitive.Content>
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none p-0.5 transition-colors",
        orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent"
          : "h-2.5 w-full flex-col border-t border-t-transparent",
        scrollbarClassName
      )}
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.Scrollbar>
  </ScrollAreaPrimitive.Root>
))
```

### Why this is still Base-UI standard

- All Base-UI primitives are used in their correct nesting order
- `Content` is always present (fixing the current bug)
- The `orientation` prop passes through to `Scrollbar`
- Escape hatches (`viewportClassName`, `scrollbarClassName`) cover styling customization
- Raw primitives can still be re-exported for advanced cases (dual-axis scrolling, custom scrollbar placement) if needed

## Migration

All 7 existing usages collapse from this:

```tsx
<ScrollArea className="flex-1">
  <ScrollAreaViewport>
    <div className="p-4">{content}</div>
  </ScrollAreaViewport>
  <ScrollAreaScrollbar orientation="vertical">
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
</ScrollArea>
```

To this:

```tsx
<ScrollArea className="flex-1">
  <div className="p-4">{content}</div>
</ScrollArea>
```