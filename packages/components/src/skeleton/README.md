# Skeleton

A placeholder loading animation to indicate content is being loaded.

## Installation

```bash
npx @dinachi/cli@latest add skeleton
```

## Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

```tsx
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

## API Reference

**Skeleton**

A simple `div` with a pulse animation. Accepts all standard `div` props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | -- | Additional classes to control size, shape, and border radius. |
