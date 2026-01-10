# PreviewCard

A popup that appears when a link is hovered, showing a preview for sighted users. Built on top of Base UI's PreviewCard component.

## Installation

```bash
npx @dinachi/cli add preview-card
```

## Usage

```typescript
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
} from "@/components/preview-card"

export function Example() {
  return (
    <PreviewCard>
      <p className="max-w-64 text-base text-balance text-gray-900">
        The principles of good{' '}
        <PreviewCardTrigger href="https://en.wikipedia.org/wiki/Typography">
          typography
        </PreviewCardTrigger>{' '}
        remain into the digital age.
      </p>

      <PreviewCardContent>
        <img
          width="240"
          height="160"
          className="block w-full rounded-sm"
          src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=240&h=160"
          alt="Typography example"
        />
        <p className="text-sm text-pretty text-gray-900">
          <strong>Typography</strong> is the art and science of arranging type to
          make written language clear, visually appealing, and effective in
          communication.
        </p>
      </PreviewCardContent>
    </PreviewCard>
  )
}
```

## API Reference

### PreviewCard

The root component that manages the preview card state.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the preview card is open by default |
| `open` | `boolean` | `undefined` | Controlled open state |
| `onOpenChange` | `(open: boolean, event?: Event, reason?: OpenChangeReason) => void` | `undefined` | Callback when open state changes |
| `delay` | `number` | `600` | Delay in milliseconds before showing |
| `closeDelay` | `number` | `300` | Delay in milliseconds before hiding |

### PreviewCardTrigger

A link that opens the preview card when hovered. Renders an `<a>` element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |
| `href` | `string` | `undefined` | The URL the link points to |

### PreviewCardContent

A convenient wrapper that includes Portal, Positioner, Popup, and Arrow components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes for the popup |

### Individual Components

For more granular control, you can use individual components:

- `PreviewCardPortal` - Moves the popup to a different DOM location
- `PreviewCardBackdrop` - Optional overlay behind the popup
- `PreviewCardPositioner` - Positions the popup relative to the trigger
- `PreviewCardPopup` - The main popup container
- `PreviewCardArrow` - Arrow pointing to the trigger

## Examples

### Basic Usage

```typescript
<PreviewCard>
  <PreviewCardTrigger href="https://example.com">
    Hover me
  </PreviewCardTrigger>
  <PreviewCardContent>
    <p>This is a preview!</p>
  </PreviewCardContent>
</PreviewCard>
```

### Custom Positioning

```typescript
<PreviewCard>
  <PreviewCardTrigger href="https://example.com">
    Hover me
  </PreviewCardTrigger>
  <PreviewCardPortal>
    <PreviewCardPositioner side="top" align="start" sideOffset={12}>
      <PreviewCardPopup>
        <PreviewCardArrow />
        <p>Custom positioned preview</p>
      </PreviewCardPopup>
    </PreviewCardPositioner>
  </PreviewCardPortal>
</PreviewCard>
```

### Controlled State

```typescript
function ControlledExample() {
  const [open, setOpen] = useState(false)
  
  return (
    <PreviewCard open={open} onOpenChange={setOpen}>
      <PreviewCardTrigger href="https://example.com">
        Controlled preview
      </PreviewCardTrigger>
      <PreviewCardContent>
        <p>This preview is controlled!</p>
        <button onClick={() => setOpen(false)}>Close</button>
      </PreviewCardContent>
    </PreviewCard>
  )
}
```

### Rich Content

```typescript
<PreviewCard>
  <PreviewCardTrigger href="https://github.com">
    GitHub
  </PreviewCardTrigger>
  <PreviewCardContent className="w-80">
    <div className="flex items-center gap-3 mb-3">
      <img
        src="https://github.com/github.png"
        alt="GitHub"
        className="w-8 h-8 rounded"
      />
      <div>
        <h3 className="font-semibold">GitHub</h3>
        <p className="text-sm text-gray-600">Where the world builds software</p>
      </div>
    </div>
    <p className="text-sm">
      GitHub is a web-based platform for version control and collaboration
      that lets you and others work together on projects from anywhere.
    </p>
  </PreviewCardContent>
</PreviewCard>
```

### Custom Arrow

```typescript
<PreviewCard>
  <PreviewCardTrigger href="https://example.com">
    Custom arrow
  </PreviewCardTrigger>
  <PreviewCardPortal>
    <PreviewCardPositioner>
      <PreviewCardPopup>
        <PreviewCardArrow>
          <div className="w-3 h-3 bg-blue-500 rotate-45" />
        </PreviewCardArrow>
        <p>Preview with custom arrow</p>
      </PreviewCardPopup>
    </PreviewCardPositioner>
  </PreviewCardPortal>
</PreviewCard>
```

## Accessibility

- The preview card is announced to screen readers when it opens
- The trigger maintains proper link semantics and keyboard navigation
- Focus is managed appropriately when the preview opens and closes
- The preview can be closed with the Escape key
- ARIA attributes are automatically applied for screen reader support

## Base UI Foundation

This component is built on top of `@base-ui/react/preview-card`. For more advanced usage and customization options, refer to the [Base UI PreviewCard documentation](https://base-ui.mui.com/react/preview-card). 