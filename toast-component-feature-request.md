# Feature Request: Complete Base UI Toast API Coverage

## Summary

The current Dinachi toast component covers the basic toast flow but is missing several Base UI Toast primitives and manager methods. This limits users to simple title/description toasts and blocks common patterns like promise-based toasts, toast updates, anchored toasts, and usage outside React.

## What's Missing

### 1. Missing subcomponents

**`ToastPositioner`** — `BaseToast.Positioner` wrapper. Positions a toast against an anchor element. Props: `toast`, `anchor`, `side`, `align`, `sideOffset`, `disableAnchorTracking`. Required for contextual/anchored toasts (e.g. a toast appearing next to a save button instead of the corner viewport).

**`ToastArrow`** — `BaseToast.Arrow` wrapper. Decorative arrow for anchored toasts. Supports `data-side` for directional styling. Companion to `ToastPositioner`.

### 2. Missing toast manager methods

The `useToastManager` hook and `createToastManager` return objects with methods that aren't surfaced or documented:

| Method | Status | Use case |
|---|---|---|
| `add(options)` | Exported | Create a toast |
| `close(id)` | Available but not highlighted | Dismiss a specific toast |
| `update(id, updates)` | Not surfaced | Modify an existing toast (e.g. progress updates) |
| `promise(promise, options)` | Not surfaced | Automatic loading → success/error flow |
| `subscribe(listener)` | Not surfaced | Observe toast changes from external systems |

`update` is the most impactful — it's what makes progress toasts, multi-step flows, and the `promise()` pattern work. Without it, every state change requires closing and re-creating a toast.

### 3. Global toast manager pattern

Base UI provides `createToastManager()` specifically for firing toasts from outside React (API clients, module-level error handlers, utility functions). The current component exports it but doesn't guide toward the pattern:

```ts
// lib/toast.ts — shared instance
import { createToastManager } from "@/components/ui/toast";
export const toastManager = createToastManager();

// providers.tsx — connect to React
<Toast toastManager={toastManager}>

// trpc.ts (module-level, no hooks) — works
import { toastManager } from "@/lib/toast";
toastManager.add({ title: error.message, type: "error" });

// components — also works via hook
const toast = useToastManager();
toast.add({ title: "Saved", type: "success" });
```

This is a common need (tRPC error handlers, fetch wrappers, auth callbacks) and should be part of the component's documented setup.

### 4. `ToastList` doesn't support custom rendering

The built-in `ToastList` hardcodes the layout: title + description + action + close. There's no way to render based on `toast.data`, which blocks patterns like:

- Toasts with progress bars
- Toasts with custom icons per type
- Undo action toasts with countdown
- Toasts with user avatars or rich content

A `renderToast` prop on `ToastList` (and the `Toast` convenience wrapper) would solve this while keeping the default layout as a fallback:

```tsx
<Toast renderToast={(toast) => <MyCustomToast toast={toast} />}>

// or use the default
<Toast>
```

### 5. Inline X icon

The close button renders a hand-rolled SVG `X` component. `lucide-react` is already a dependency and used across all other Dinachi components. Should use `XIcon` from lucide for consistency. The close button should also render the icon by default so consumers don't have to pass children:

```tsx
// current — requires children
<ToastClose aria-label="Close">
  <X className="h-4 w-4" />
</ToastClose>

// proposed — icon by default, overridable
<ToastClose />
<ToastClose>{customIcon}</ToastClose>
```

## Proposed Export List

```ts
// Subcomponents
Toast           // convenience wrapper (Provider + Portal + Viewport + ToastList)
ToastProvider
ToastPortal
ToastViewport
ToastRoot
ToastContent
ToastTitle
ToastDescription
ToastAction
ToastClose
ToastPositioner // new
ToastArrow      // new
ToastList       // with renderToast prop

// Manager
useToastManager   // hook — returns { toasts, add, update, close, promise, subscribe }
createToastManager // factory — same API, works outside React

// Utilities
toastVariants
getVariantFromType
```

## Impact

These changes don't add new abstractions — they surface what Base UI already provides. The convenience `Toast` wrapper stays as the quick path. The individual exports handle advanced patterns. Users who only need `toast.add()` are unaffected.
