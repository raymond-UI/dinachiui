# Toast

Generates toast notifications with support for different types, promises, actions, and global management.

## Installation

```bash
npx @dinachi/cli add toast
```

## Usage

### Simple Setup

```typescript
import { Toast, useToastManager } from "@/components/toast"

export function App() {
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
          title: "Success",
          description: "Your action was completed successfully.",
        })
      }
    >
      Show Toast
    </button>
  )
}
```

### Advanced Setup

```typescript
import {
  ToastProvider,
  ToastPortal,
  ToastViewport,
  ToastList,
  useToastManager,
} from "@/components/toast"

export function App() {
  return (
    <ToastProvider limit={5} timeout={3000}>
      <MyComponent />
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}
```

## API Reference

### Toast (Complete Component)

A complete toast setup with provider, portal, and viewport.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| limit | `number` | `3` | Maximum number of toasts to show |
| timeout | `number` | `5000` | Auto-dismiss timeout in milliseconds |
| toastManager | `ToastManager` | `undefined` | External toast manager instance |
| className | `string` | `undefined` | Additional CSS classes for viewport |

### ToastProvider

Provides context for creating and managing toasts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| limit | `number` | `3` | Maximum number of toasts to show |
| timeout | `number` | `5000` | Auto-dismiss timeout in milliseconds |
| toastManager | `ToastManager` | `undefined` | External toast manager instance |

### ToastViewport

Container viewport for toasts positioning.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### ToastRoot

Individual toast container with variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default" \| "destructive" \| "success" \| "warning" \| "loading"` | `"default"` | Toast visual variant |
| toast | `ToastObject` | required | Toast data object |
| swipeDirection | `Array<"up" \| "down" \| "left" \| "right">` | `["down", "right"]` | Allowed swipe directions |

### ToastTitle

Toast title heading.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### ToastDescription

Toast description text.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### ToastAction

Toast action button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### ToastClose

Toast close button.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | `undefined` | Additional CSS classes |

### useToastManager Hook

Hook for managing toasts within a ToastProvider.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| toasts | `ToastObject[]` | Current list of toasts |
| add | `(options: AddOptions) => string` | Add a new toast |
| close | `(toastId: string) => void` | Close a specific toast |
| update | `(toastId: string, options: UpdateOptions) => void` | Update an existing toast |
| promise | `(promise: Promise, options: PromiseOptions) => Promise` | Create promise-based toast |

#### Add Options

| Option | Type | Description |
|--------|------|-------------|
| title | `string` | Toast title |
| description | `string` | Toast description |
| type | `string` | Toast type (affects styling) |
| timeout | `number` | Custom timeout for this toast |
| actionProps | `ButtonProps` | Props for action button |
| data | `Record<string, unknown>` | Custom data |
| onClose | `() => void` | Callback when toast closes |
| onRemove | `() => void` | Callback when toast is removed |

## Examples

### Basic Toast Types

```typescript
function ToastExamples() {
  const { add } = useToastManager()

  return (
    <div className="space-x-2">
      <button onClick={() => add({ title: "Default toast" })}>
        Default
      </button>
      
      <button
        onClick={() =>
          add({
            title: "Success!",
            description: "Operation completed successfully.",
            type: "success",
          })
        }
      >
        Success
      </button>

      <button
        onClick={() =>
          add({
            title: "Error!",
            description: "Something went wrong.",
            type: "error",
          })
        }
      >
        Error
      </button>

      <button
        onClick={() =>
          add({
            title: "Warning",
            description: "Please check your input.",
            type: "warning",
          })
        }
      >
        Warning
      </button>
    </div>
  )
}
```

### Toast with Action

```typescript
function ToastWithAction() {
  const { add, close } = useToastManager()

  const showUndoToast = () => {
    const toastId = add({
      title: "File deleted",
      description: "The file has been moved to trash.",
      type: "success",
      actionProps: {
        children: "Undo",
        onClick: () => {
          close(toastId)
          add({ title: "File restored" })
        },
      },
    })
  }

  return <button onClick={showUndoToast}>Delete File</button>
}
```

### Promise Toast

```typescript
function PromiseToast() {
  const { promise } = useToastManager()

  const handleAsyncOperation = () => {
    const operation = fetch("/api/data").then((res) => res.json())

    promise(operation, {
      loading: "Saving changes...",
      success: (data) => `Changes saved successfully!`,
      error: (err) => `Failed to save: ${err.message}`,
    })
  }

  return <button onClick={handleAsyncOperation}>Save Changes</button>
}
```

### Advanced Promise Toast

```typescript
function AdvancedPromiseToast() {
  const { promise } = useToastManager()

  const handleComplexOperation = () => {
    const operation = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve("Success!") : reject(new Error("Failed!"))
      }, 2000)
    })

    promise(operation, {
      loading: {
        title: "Processing...",
        description: "Please wait while we process your request.",
      },
      success: {
        title: "Success!",
        description: "Your request has been processed successfully.",
        type: "success",
      },
      error: {
        title: "Error",
        description: "Something went wrong. Please try again.",
        type: "error",
        actionProps: {
          children: "Retry",
          onClick: () => handleComplexOperation(),
        },
      },
    })
  }

  return <button onClick={handleComplexOperation}>Start Process</button>
}
```

### Custom Toast Data

```typescript
interface CustomToastData {
  userId: string
  action: string
}

function CustomDataToast() {
  const { add } = useToastManager()

  const showCustomToast = () => {
    add({
      title: "Custom action",
      data: {
        userId: "123",
        action: "profile_update",
      } as CustomToastData,
    })
  }

  return <button onClick={showCustomToast}>Custom Toast</button>
}

// In your ToastList component, you can access custom data:
function CustomToastList() {
  const { toasts } = useToastManager()
  
  return toasts.map((toast) => (
    <ToastRoot key={toast.id} toast={toast}>
      <ToastTitle>{toast.title}</ToastTitle>
      {toast.data && (
        <ToastDescription>
          User {(toast.data as CustomToastData).userId} performed{" "}
          {(toast.data as CustomToastData).action}
        </ToastDescription>
      )}
      <ToastClose />
    </ToastRoot>
  ))
}
```

### Global Toast Manager

```typescript
// Create a global toast manager
import { createToastManager } from "@/components/toast"

export const globalToastManager = createToastManager()

// Use in your app
import { ToastProvider, ToastPortal, ToastViewport, ToastList } from "@/components/toast"
import { globalToastManager } from "./toast-manager"

export function App() {
  return (
    <ToastProvider toastManager={globalToastManager}>
      <YourApp />
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

// Use anywhere in your app (even outside React components)
import { globalToastManager } from "./toast-manager"

export function apiCall() {
  try {
    // ... api logic
    globalToastManager.add({
      title: "Success",
      description: "Data saved successfully",
      type: "success",
    })
  } catch (error) {
    globalToastManager.add({
      title: "Error",
      description: "Failed to save data",
      type: "error",
    })
  }
}
```

### Custom Positioning

```typescript
// Top center position
<ToastViewport className="fixed top-[1rem] right-0 bottom-auto left-0 mx-auto flex w-full max-w-[300px]" />

// Top right position
<ToastViewport className="fixed top-[1rem] right-[1rem] bottom-auto left-auto" />

// Bottom left position
<ToastViewport className="fixed top-auto right-auto bottom-[1rem] left-[1rem]" />
```

### Custom Toast Variants

```typescript
// You can extend the variants by creating custom toast components
function CustomToast({ children, ...props }) {
  return (
    <ToastRoot
      className="bg-purple-100 border-purple-300 text-purple-900"
      {...props}
    >
      {children}
    </ToastRoot>
  )
}
```

## Accessibility

- Toasts are announced to screen readers automatically
- F6 key allows users to jump to the toast viewport
- Supports keyboard navigation within toasts
- Proper ARIA attributes for screen readers
- Focus management when toasts appear/disappear
- Swipe gestures for mobile users

## Animations & Interactions

- **Stacking**: Multiple toasts stack with visual depth
- **Swipe to Dismiss**: Swipe in any configured direction to dismiss
- **Hover to Expand**: Hover or focus expands stacked toasts
- **Auto Dismiss**: Configurable timeout for automatic dismissal
- **Smooth Transitions**: CSS transitions for all state changes

## Keyboard Interactions

| Key | Description |
|-----|-------------|
| `F6` | Jump to toast viewport |
| `Tab` | Navigate between interactive elements |
| `Enter` / `Space` | Activate buttons |
| `Escape` | Close focused toast |

## Base UI Foundation

This component is built on top of `@base-ui-components/react/toast`. For more advanced usage and customization options, refer to the [Base UI documentation](https://base-ui.mui.com/react/toast).

## Advanced Features

- **Promise Integration**: Automatically handle loading, success, and error states
- **Global Management**: Use toast manager outside React components
- **Custom Data**: Pass any data structure to toasts
- **Action Buttons**: Add interactive buttons to toasts
- **Limit Control**: Automatically manage toast overflow
- **Swipe Gestures**: Native swipe-to-dismiss on mobile
- **Stacking Animations**: Beautiful stacking with CSS transforms
- **Type Safety**: Full TypeScript support for all features 