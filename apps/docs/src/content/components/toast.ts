import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "toast",
  description: "Brief feedback after an action, fired from React or plain code.",
  usage: `import { Toast, useToastManager } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

function SaveButton() {
  const toast = useToastManager()
  return (
    <Button onClick={() => toast.add({ title: "Saved", description: "Your changes are live.", type: "success" })}>
      Save
    </Button>
  )
}

export function App() {
  return (
    <Toast>
      <SaveButton />
    </Toast>
  )
}`,
  anatomy: `<ToastProvider>
  <ToastPortal>
    <ToastViewport>
      <ToastRoot>
        <ToastContent>
          <ToastTitle />
          <ToastDescription />
          <ToastAction />
          <ToastClose />
        </ToastContent>
      </ToastRoot>
    </ToastViewport>
  </ToastPortal>
</ToastProvider>`,

  examples: ["toast-default", "toast-variants", "toast-loading", "toast-custom-render", "toast-close-all"],

  parts: [
    {
      name: "Toast",
      summary: "Provider, portal, viewport and list in one.",
      props: [
        { name: "limit", type: "number", default: "3", description: "Most toasts held at once." },
        { name: "timeout", type: "number", default: "5000", description: "Milliseconds before a toast closes. `0` keeps it until dismissed." },
        { name: "toastManager", type: "ToastManager", description: "A manager from `createToastManager()`, for firing toasts outside React." },
        { name: "renderToast", type: "(toast) => ReactNode", description: "Custom layout for each toast." },
        { name: "className", type: "string", description: "Viewport classes, for example to move the stack." },
      ],
    },
    {
      name: "ToastProvider",
      summary: "Holds the toasts in a custom setup.",
      props: [
        { name: "limit", type: "number", default: "3", description: "Most toasts held at once." },
        { name: "timeout", type: "number", default: "5000", description: "Milliseconds before a toast closes. `0` keeps it until dismissed." },
        { name: "toastManager", type: "ToastManager", description: "A manager from `createToastManager()`." },
      ],
    },
    {
      name: "ToastPortal",
      summary: "Renders the viewport into the body.",
      props: [],
    },
    {
      name: "ToastViewport",
      summary: "The fixed stack corner, bottom right by default.",
      props: [{ name: "className", type: "string", description: "Moves or resizes the stack." }],
    },
    {
      name: "ToastList",
      summary: "A ToastRoot per toast, variant from type.",
      props: [{ name: "renderToast", type: "(toast) => ReactNode", description: "Custom layout inside each ToastRoot." }],
    },
    {
      name: "ToastRoot",
      summary: "One toast card.",
      props: [
        { name: "toast", type: "ToastObject", description: "The toast from the manager. Required." },
        { name: "variant", type: '"default" | "destructive" | "success" | "warning" | "loading"', default: '"default"', description: "The accent border. ToastList sets it from the type." },
        { name: "swipeDirection", type: '("up" | "down" | "left" | "right")[]', default: '["down", "right"]', description: "Swipe directions that dismiss it." },
      ],
    },
    {
      name: "ToastContent",
      summary: "The inner row, hidden when stacked behind.",
      props: [{ name: "children", type: "ReactNode", description: "Title, description and buttons." }],
    },
    {
      name: "ToastTitle",
      summary: "Heading and accessible name.",
      props: [{ name: "children", type: "ReactNode", description: "Defaults to the toast's title. The agent reads it as label.", agent: true }],
    },
    {
      name: "ToastDescription",
      summary: "Body text and accessible description.",
      props: [{ name: "children", type: "ReactNode", description: "Defaults to the toast's description. The agent reads it as value.", agent: true }],
    },
    {
      name: "ToastAction",
      summary: "A button built from the toast's `actionProps`.",
      props: [{ name: "children", type: "ReactNode", description: "Used when `actionProps` has no children." }],
    },
    {
      name: "ToastClose",
      summary: "The dismiss button, top right.",
      props: [{ name: "children", type: "ReactNode", default: "<XIcon />", description: "Replaces the icon. The agent's dismiss presses this button.", agent: true }],
    },
    {
      name: "ToastPositioner",
      summary: "Anchors a toast to an element.",
      props: [
        { name: "toast", type: "ToastObject", description: "The toast to place. Required." },
        { name: "anchor", type: "Element | null", description: "The element to place it against." },
        { name: "side", type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"', default: '"top"', description: "Side of the anchor." },
        { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment along that side." },
        { name: "sideOffset", type: "number", default: "0", description: "Gap to the anchor, in pixels." },
      ],
    },
    {
      name: "ToastArrow",
      summary: "Pointer from anchored toast to anchor.",
      props: [],
    },
  ],

  notes: [
    {
      title: "The toast manager",
      body: "`useToastManager()` inside React and `createToastManager()` outside it both return `add`, `update`, `close` and `promise`. The hook also returns the current `toasts`.\n\n```tsx\nconst id = manager.add({ title: \"Uploading\", type: \"loading\", timeout: 0 })\n\n// Change it in place: title, description, type, timeout or action.\nmanager.update(id, { title: \"Upload complete\", type: \"success\", timeout: 5000 })\n\nmanager.close(id) // one toast\nmanager.close()   // every toast\n```\n\n`promise` runs a toast through loading, success and error. Each state takes a string, toast options, or a function of the result or error.\n\n```tsx\nmanager.promise(fetch(\"/api/save\", { method: \"POST\" }), {\n  loading: \"Saving...\",\n  success: { title: \"Saved\", description: \"Changes applied.\" },\n  error: (err) => ({ title: \"Error\", description: err.message }),\n})\n```",
    },
    {
      title: "Toast options",
      body: "`add` and `update` take the same options.\n\n```tsx\n{\n  title: ReactNode,\n  description: ReactNode,\n  type: \"success\" | \"error\" | \"warning\" | \"loading\" | string,\n  timeout: number,          // 0 keeps it until dismissed\n  priority: \"low\" | \"high\",\n  actionProps: ButtonHTMLAttributes,\n  data: object,             // anything renderToast needs\n  onClose: () => void,\n  onRemove: () => void,\n}\n```\n\nThe type sets the variant: `error` maps to `destructive`; `success`, `warning` and `loading` keep their names; anything else is `default`. `getVariantFromType` does this mapping for a custom list.",
    },
    {
      title: "Toasts from outside React",
      body: "`dinachi add toast` also writes `lib/toast.ts` with a shared manager. Pass it to `Toast` once, then call it from API clients and error handlers.\n\n```tsx\n// lib/toast.ts, written by the CLI\nimport { createToastManager } from \"@/components/ui/toast\"\nexport const toastManager = createToastManager()\n```\n\n```tsx\n// providers.tsx\nimport { Toast } from \"@/components/ui/toast\"\nimport { toastManager } from \"@/lib/toast\"\n\nexport function Providers({ children }: { children: React.ReactNode }) {\n  return <Toast toastManager={toastManager}>{children}</Toast>\n}\n```\n\n```ts\n// api-client.ts\nimport { toastManager } from \"@/lib/toast\"\n\nexport async function apiCall() {\n  try {\n    const res = await fetch(\"/api/data\")\n    if (!res.ok) throw new Error(\"Request failed\")\n    return res.json()\n  } catch (err) {\n    toastManager.add({ title: (err as Error).message, type: \"error\" })\n    throw err\n  }\n}\n```",
    },
    {
      title: "Custom rendering",
      body: "Pass `renderToast` to `Toast` or `ToastList`. Anything passed as `data` to `add` is on `toast.data`.\n\n```tsx\nmanager.add({ title: \"New message\", data: { avatarUrl: \"/img/user.png\", sender: \"Alice\" } })\n\n<Toast\n  renderToast={(toast) => (\n    <ToastContent>\n      <img src={toast.data?.avatarUrl} alt={toast.data?.sender} />\n      <div>\n        <ToastTitle>{toast.title}</ToastTitle>\n        <ToastDescription>{toast.description}</ToastDescription>\n      </div>\n      <ToastClose />\n    </ToastContent>\n  )}\n/>\n```\n\nKeep `ToastClose` in a custom layout: it is the only non-swipe dismiss and the button the agent presses.",
    },
    {
      title: "The stack",
      body: "- Collapsed, toasts behind the front one are scaled back and offset, and cut to its height.\n- Hovering or focusing the stack expands it into a column.\n- `limit` sets how many it holds; more than about three stops reading as depth.",
    },
    {
      title: "Timing",
      body: "`timeout` on the provider or on a single `add()` sets how long a toast lasts; `timeout: 0` keeps it until dismissed. Hovering or focusing the viewport pauses every timer.\n\n```tsx\n<Toast timeout={5000}>\n\n// Stays until dismissed.\nadd({ title: \"Quota at 90%\", timeout: 0 })\n```",
    },
  ],

  agent: {
    kind: "toast",
    reads: [
      { field: "label", means: "The toast's title, or `toast` when it has none." },
      { field: "value", means: "The description." },
      { field: "type", means: "The toast's type, such as `success` or `error`." },
    ],
    actions: [
      { call: "dismiss()", does: "Presses the toast's ToastClose button." },
    ],
    refusal:
      "Nothing to refuse: dismiss presses the close button as a person would. Without `ToastClose` in a custom layout, dismiss fails with a message. Action buttons are listed separately as `button` and take `press` without approval, even at high priority.",
    example: `await agent.act({
  steps: [{ ref: "Success", action: "dismiss" }],
})`,
  },

  keyboard: [
    { keys: ["F6"], does: "Moves focus to the toast viewport from anywhere on the page" },
    { keys: ["Tab"], does: "Moves between toasts and their buttons" },
    { keys: ["Esc"], does: "Closes the focused toast" },
  ],

  accessibility: [
    "The viewport is a region labelled Notifications, aria-live polite.",
    "`priority: \"high\"` toasts are also announced assertively. Do not announce them again yourself.",
    "Each toast is a dialog named by `ToastTitle` and described by `ToastDescription`; omit both and it is an empty dialog.",
    "Put any action in a real button inside the toast, so F6 then Tab reaches it.",
    "Hover or focus on the viewport pauses every countdown.",
    "Use `timeout: 0` for anything that must be acted on.",
    "The stack expands on focus too. Swiping is pointer only, so keep a close button.",
  ],
} satisfies ComponentDoc;
