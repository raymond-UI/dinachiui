# Separator

A visual divider used to separate and organize content.

## Installation

```bash
npx @dinachi/cli@latest add separator
```

## Usage

```tsx
import { Separator } from "@/components/ui/separator"
```

```tsx
<div>
  <h4 className="text-sm font-medium">DinachiUI</h4>
  <p className="text-sm text-muted-foreground">
    An open-source component library.
  </p>
  <Separator className="my-4" />
  <div className="flex h-5 items-center space-x-4 text-sm">
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>Source</span>
    <Separator orientation="vertical" />
    <span>Changelog</span>
  </div>
</div>
```

## API Reference

- **Separator** -- A styled horizontal or vertical rule. Wraps `Separator` from Base UI. Accepts `orientation` (`"horizontal"` or `"vertical"`, defaults to `"horizontal"`).
