# PreviewCard

A popup that appears when a link is hovered, showing a preview for sighted users.

## Installation

```bash
npx @dinachi/cli@latest add preview-card
```

## Usage

```tsx
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
  PreviewCardPortal,
  PreviewCardBackdrop,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
  PreviewCardViewport,
  PreviewCardArrowSvg,
  createPreviewCardHandle,
} from "@/components/ui/preview-card"
```

```tsx
<PreviewCard>
  <PreviewCardTrigger href="https://example.com">
    example.com
  </PreviewCardTrigger>
  <PreviewCardContent>
    <img
      src="https://example.com/og.png"
      alt="Example"
      className="w-full rounded"
    />
    <p className="text-sm">A short description of the linked page.</p>
  </PreviewCardContent>
</PreviewCard>
```

## API Reference

- **PreviewCard** -- Root provider that manages hover/focus state. Direct re-export of `PreviewCard.Root` from Base UI.
- **PreviewCardTrigger** -- The anchor element that activates the preview on hover. Wraps `PreviewCard.Trigger` with link-style defaults.
- **PreviewCardContent** -- A convenience wrapper that composes portal, positioner, popup, and arrow together.
- **PreviewCardPortal** -- Renders the card into a portal. Direct re-export of `PreviewCard.Portal`.
- **PreviewCardBackdrop** -- An optional overlay rendered behind the card. Wraps `PreviewCard.Backdrop`.
- **PreviewCardPositioner** -- Positions the popup relative to the trigger. Wraps `PreviewCard.Positioner`. Defaults `sideOffset` to `8`.
- **PreviewCardPopup** -- The floating card container with enter/exit animations. Wraps `PreviewCard.Popup`.
- **PreviewCardArrow** -- A decorative arrow pointing toward the trigger. Wraps `PreviewCard.Arrow`.
- **PreviewCardViewport** -- Enables animated content transitions between triggers. Wraps `PreviewCard.Viewport`.
- **PreviewCardArrowSvg** -- The standalone SVG arrow graphic, useful for custom arrow rendering.
- **createPreviewCardHandle** -- Creates a handle for detached trigger/root associations. Re-export of `PreviewCard.createHandle`.
