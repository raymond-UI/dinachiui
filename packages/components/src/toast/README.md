# Toast

Generates toast notifications with support for different types, promises, actions, and global management.

## Installation

```bash
npx @dinachi/cli@latest add toast
```

## Usage

```tsx
import { Toast, useToastManager } from "@/components/ui/toast"
```

```tsx
function App() {
  return (
    <Toast>
      <MyComponent />
    </Toast>
  )
}

function MyComponent() {
  const { add } = useToastManager()

  return (
    <button
      onClick={() =>
        add({
          title: "Saved",
          description: "Your changes have been saved.",
          type: "success",
        })
      }
    >
      Show Toast
    </button>
  )
}
```

## API Reference

- **Toast** -- A complete, ready-to-use toast setup that bundles the provider, portal, and viewport. This is the simplest way to add toasts to your app.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | `number` | `3` | Maximum number of visible toasts |
| `timeout` | `number` | `5000` | Auto-dismiss timeout in milliseconds |
| `toastManager` | `ToastManager` | -- | External toast manager for global usage |

- **ToastProvider** -- Provides context for creating and managing toasts. Extends Base UI `Toast.Provider`. Use this for custom layouts instead of the `Toast` shorthand.

- **ToastViewport** -- Positioned container where toasts are rendered. Extends Base UI `Toast.Viewport`.

- **ToastPortal** -- Renders toasts into a portal outside the DOM hierarchy. Wraps Base UI `Toast.Portal`.

- **ToastRoot** -- An individual toast element with variant styling. Extends Base UI `Toast.Root`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "destructive" \| "success" \| "warning" \| "loading"` | `"default"` | Visual style variant |
| `toast` | `ToastObject` | required | The toast data object from the manager |

- **ToastTitle** -- The heading text of a toast. Extends Base UI `Toast.Title`.

- **ToastDescription** -- The body text of a toast. Extends Base UI `Toast.Description`.

- **ToastAction** -- An action button rendered inside a toast. Extends Base UI `Toast.Action`.

- **ToastClose** -- A close/dismiss button for a toast. Extends Base UI `Toast.Close`.

- **ToastList** -- A pre-built list component that renders all active toasts with default layout and close buttons.

- **useToastManager** -- Hook that returns the toast manager with `add`, `close`, `update`, and `promise` methods. Must be used within a `ToastProvider`.

- **createToastManager** -- Factory function to create a toast manager instance for use outside React components (global toast management).

- **toastVariants** -- The CVA variants definition, exported for custom toast styling.

- **getVariantFromType** -- Helper that maps toast type strings (`"success"`, `"error"`, `"warning"`, `"loading"`) to variant names.
