# Progress

A progress bar that communicates task completion to users and assistive technology.

## Installation

```bash
npx @dinachi/cli@latest add progress
```

## Usage

```tsx
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
```

```tsx
<Progress value={60} max={100}>
  <div className="flex items-center justify-between">
    <ProgressLabel>Uploading...</ProgressLabel>
    <ProgressValue />
  </div>
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
</Progress>
```

## API Reference

- **Progress** -- Root container that manages progress state. Wraps `Progress.Root` from Base UI. Accepts `value`, `max`, and standard progress attributes.
- **ProgressTrack** -- The background track representing the full range. Wraps `Progress.Track`.
- **ProgressIndicator** -- The filled bar that grows to reflect the current value. Wraps `Progress.Indicator`.
- **ProgressLabel** -- A text label for the progress bar. Wraps `Progress.Label`.
- **ProgressValue** -- Displays the current progress value as text. Wraps `Progress.Value`.
