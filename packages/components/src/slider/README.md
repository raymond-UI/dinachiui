# Slider

An input where the user selects a value from within a given range.

## Installation

```bash
npx @dinachi/cli@latest add slider
```

## Usage

```tsx
import {
  Slider,
  SliderLabel,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderDirectionProvider,
} from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={50} max={100} step={1}>
  <SliderControl>
    <SliderTrack>
      <SliderRange />
      <SliderThumb />
    </SliderTrack>
  </SliderControl>
</Slider>
```

## API Reference

- **Slider** -- Root container that manages slider state. Wraps `Slider.Root` from Base UI.

  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `defaultValue` | `number \| number[]` | -- | Initial value for uncontrolled mode |
  | `value` | `number \| number[]` | -- | Current value for controlled mode |
  | `onValueChange` | `(value: number \| number[]) => void` | -- | Called when the value changes |
  | `min` | `number` | `0` | Minimum value |
  | `max` | `number` | `100` | Maximum value |
  | `step` | `number` | `1` | Step increment |
  | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Slider orientation |
  | `disabled` | `boolean` | `false` | Disables interaction |

- **SliderLabel** -- An accessible label for the slider. Wraps `Slider.Label`. Automatically linked to the slider for assistive technology.
- **SliderValue** -- Displays the current slider value as text. Wraps `Slider.Value`.
- **SliderControl** -- The interactive area containing the track and thumbs. Wraps `Slider.Control`.
- **SliderTrack** -- The background track representing the full range. Wraps `Slider.Track`.
- **SliderRange** -- The filled portion reflecting the current value. Wraps `Slider.Indicator`.
- **SliderThumb** -- The draggable handle. Render multiple thumbs for a range slider. Wraps `Slider.Thumb`.
- **SliderDirectionProvider** -- Enables RTL support. Wraps Base UI `DirectionProvider`. Set `direction="rtl"` for right-to-left languages.
