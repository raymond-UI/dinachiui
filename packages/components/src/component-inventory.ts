export type ComponentCategory =
  | "Form"
  | "Display"
  | "Layout"
  | "Navigation"
  | "Overlay"
  | "Feedback"

export interface PublicComponentDefinition {
  name: string
  slug: string
  category: ComponentCategory
  documented: boolean
}

// Canonical inventory for Dinachi's public component surface area.
// Sidebar is intentionally excluded until it reaches docs/export parity.
export const publicComponents: PublicComponentDefinition[] = [
  { name: "Accordion", slug: "accordion", category: "Display", documented: true },
  { name: "Alert Dialog", slug: "alert-dialog", category: "Overlay", documented: true },
  { name: "Autocomplete", slug: "autocomplete", category: "Form", documented: true },
  { name: "Avatar", slug: "avatar", category: "Display", documented: true },
  { name: "Badge", slug: "badge", category: "Display", documented: true },
  { name: "Button", slug: "button", category: "Form", documented: true },
  { name: "Card", slug: "card", category: "Layout", documented: true },
  { name: "Checkbox", slug: "checkbox", category: "Form", documented: true },
  { name: "Checkbox Group", slug: "checkbox-group", category: "Form", documented: true },
  { name: "Collapsible", slug: "collapsible", category: "Display", documented: true },
  { name: "Combobox", slug: "combobox", category: "Form", documented: true },
  { name: "Context Menu", slug: "context-menu", category: "Overlay", documented: true },
  { name: "Dialog", slug: "dialog", category: "Overlay", documented: true },
  { name: "Drawer", slug: "drawer", category: "Overlay", documented: true },
  { name: "Field", slug: "field", category: "Form", documented: true },
  { name: "Fieldset", slug: "fieldset", category: "Form", documented: true },
  { name: "Form", slug: "form", category: "Form", documented: true },
  { name: "Input", slug: "input", category: "Form", documented: true },
  { name: "Label", slug: "label", category: "Form", documented: true },
  { name: "Link", slug: "link", category: "Navigation", documented: true },
  { name: "Menu", slug: "menu", category: "Overlay", documented: true },
  { name: "Menubar", slug: "menubar", category: "Navigation", documented: true },
  { name: "Meter", slug: "meter", category: "Feedback", documented: true },
  { name: "Navigation Menu", slug: "navigation-menu", category: "Navigation", documented: true },
  { name: "Number Field", slug: "number-field", category: "Form", documented: true },
  { name: "Popover", slug: "popover", category: "Overlay", documented: true },
  { name: "Preview Card", slug: "preview-card", category: "Overlay", documented: true },
  { name: "Progress", slug: "progress", category: "Feedback", documented: true },
  { name: "Radio", slug: "radio", category: "Form", documented: true },
  { name: "Scroll Area", slug: "scroll-area", category: "Layout", documented: true },
  { name: "Select", slug: "select", category: "Form", documented: true },
  { name: "Separator", slug: "separator", category: "Layout", documented: true },
  { name: "Skeleton", slug: "skeleton", category: "Feedback", documented: true },
  { name: "Slider", slug: "slider", category: "Form", documented: true },
  { name: "Switch", slug: "switch", category: "Form", documented: true },
  { name: "Tabs", slug: "tabs", category: "Navigation", documented: true },
  { name: "Text", slug: "text", category: "Display", documented: true },
  { name: "Textarea", slug: "textarea", category: "Form", documented: false },
  { name: "Toast", slug: "toast", category: "Feedback", documented: true },
  { name: "Toggle", slug: "toggle", category: "Form", documented: true },
  { name: "Toggle Group", slug: "toggle-group", category: "Form", documented: true },
  { name: "Toolbar", slug: "toolbar", category: "Layout", documented: true },
  { name: "Tooltip", slug: "tooltip", category: "Overlay", documented: true },
]

export const CATEGORY_ORDER: ComponentCategory[] = [
  "Form",
  "Display",
  "Layout",
  "Navigation",
  "Overlay",
  "Feedback",
]

export function getDocumentedPublicComponents(): PublicComponentDefinition[] {
  return publicComponents.filter((component) => component.documented)
}
