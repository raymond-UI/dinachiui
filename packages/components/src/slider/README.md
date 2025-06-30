# Slider

An input where the user selects a value from within a given range.

## Features

- ✅ Full keyboard navigation support
- ✅ Supports controlled and uncontrolled modes
- ✅ Horizontal and vertical orientations
- ✅ Range slider support with multiple thumbs
- ✅ Custom step sizes and value formatting
- ✅ Disabled state support
- ✅ Built on Base UI for accessibility

## Installation

```bash
npx @dinachi/cli add slider
```

## Usage

### Basic Slider

```tsx
import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/slider"

export function SliderDemo() {
  return (
    <Slider defaultValue={50} max={100} step={1}>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}
```

### With Value Display

```tsx
import {
  Slider,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/slider"

export function SliderWithValue() {
  return (
    <div className="space-y-4">
      <Slider defaultValue={25}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Volume</label>
          <SliderValue />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  )
}
```

### Range Slider

```tsx
import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/slider"

export function RangeSlider() {
  return (
    <Slider defaultValue={[25, 75]} max={100}>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}
```

### Vertical Slider

```tsx
import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/slider"

export function VerticalSlider() {
  return (
    <div className="h-48 flex items-center justify-center">
      <Slider orientation="vertical" defaultValue={50}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  )
}
```

### Controlled Slider

```tsx
import { useState } from "react"
import {
  Slider,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/slider"

export function ControlledSlider() {
  const [value, setValue] = useState(33)

  return (
    <div className="space-y-4">
      <Slider value={value} onValueChange={setValue}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Value: {value}</label>
          <SliderValue />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  )
}
```

### Disabled Slider

```tsx
import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/slider"

export function DisabledSlider() {
  return (
    <Slider disabled defaultValue={50}>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  )
}
```

### RTL (Right-to-Left) Support

```tsx
import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderDirectionProvider,
} from "@/components/slider"

export function RTLSlider() {
  return (
    <div dir="rtl">
      <SliderDirectionProvider direction="rtl">
        <Slider defaultValue={50}>
          <SliderControl>
            <SliderTrack>
              <SliderRange />
              <SliderThumb />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </SliderDirectionProvider>
    </div>
  )
}
```

## Component API

### Slider

The root container for all slider components.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultValue` | `number \| number[]` | - | Default value for uncontrolled slider |
| `value` | `number \| number[]` | - | Value for controlled slider |
| `onValueChange` | `(value: number \| number[]) => void` | - | Callback when value changes |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Slider orientation |
| `disabled` | `boolean` | `false` | Whether slider is disabled |
| `name` | `string` | - | Name for form submission |

### SliderValue

Displays the current slider value(s).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `(formattedValues: string[], values: number[]) => ReactNode` | - | Custom value display function |

### SliderControl

The interactive area containing the track and thumbs.

### SliderTrack

The track background representing the full range.

### SliderRange

The filled portion representing the current value range.

### SliderThumb

The draggable handle for changing values.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `getAriaLabel` | `(index: number) => string` | - | Custom aria-label for thumb |
| `getAriaValueText` | `(value: number, index: number) => string` | - | Custom aria-valuetext for thumb |

### SliderDirectionProvider

Enables RTL (right-to-left) support for international applications.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `"ltr" \| "rtl"` | `"ltr"` | Text direction for the slider |
| `children` | `ReactNode` | - | Slider components to wrap |

## Keyboard Navigation

- **Arrow Keys**: Increment/decrement value by step
- **Shift + Arrow Keys**: Increment/decrement by larger step (10x step)
- **Home**: Set to minimum value
- **End**: Set to maximum value
- **Page Up/Down**: Increment/decrement by larger step

## International Support

### RTL (Right-to-Left) Languages

The slider fully supports RTL languages like Arabic and Hebrew:

- Wrap with `SliderDirectionProvider` and set `direction="rtl"`
- Add `dir="rtl"` to the parent container
- Slider automatically reverses fill direction and thumb movement
- All keyboard navigation adapts to reading direction

### Usage with Multiple Languages

```tsx
// Dynamic direction based on user's language
const direction = userLanguage === 'ar' ? 'rtl' : 'ltr'

<div dir={direction}>
  <SliderDirectionProvider direction={direction}>
    <Slider defaultValue={50}>
      {/* slider content */}
    </Slider>
  </SliderDirectionProvider>
</div>
```

## Accessibility

This component is built on Base UI's Slider component and includes:

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- High contrast mode support
- RTL language support with DirectionProvider
- Proper focus indicators for all interaction states 