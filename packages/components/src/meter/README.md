# Meter

A visual representation of a scalar measurement within a known range.

## Installation

```bash
npx @dinachi/cli@latest add meter
```

## Usage

```tsx
import {
  Meter,
  MeterTrack,
  MeterIndicator,
  MeterLabel,
  MeterValue,
} from "@/components/ui/meter"
```

```tsx
<Meter value={65} min={0} max={100}>
  <div className="flex items-center justify-between">
    <MeterLabel>Storage</MeterLabel>
    <MeterValue />
  </div>
  <MeterTrack>
    <MeterIndicator />
  </MeterTrack>
</Meter>
```

## API Reference

- **Meter** -- Styled wrapper around `Meter.Root` from Base UI. Container that tracks the current value, min, and max. Renders as a grid with gap spacing.
- **MeterTrack** -- Styled wrapper around `Meter.Track`. The background bar that represents the full range.
- **MeterIndicator** -- Styled wrapper around `Meter.Indicator`. The filled portion of the track, width set automatically based on the current value.
- **MeterLabel** -- Styled wrapper around `Meter.Label`. An accessible label for the meter.
- **MeterValue** -- Styled wrapper around `Meter.Value`. Displays the current value as text (e.g., "65%").

| Component | Prop | Type | Default | Description |
|---|---|---|---|---|
| `Meter` | `value` | `number` | -- | The current value of the meter. |
| `Meter` | `min` | `number` | `0` | The minimum value of the range. |
| `Meter` | `max` | `number` | `100` | The maximum value of the range. |
