/**
 * Static component metadata for client-side use (sidebar navigation, etc.).
 * Update this file when adding or removing components from content/components/.
 */

export type ComponentMeta = {
  name: string;
  slug: string;
  category: string;
};

export const components: ComponentMeta[] = [
  { name: "Accordion", slug: "accordion", category: "Display" },
  { name: "Alert Dialog", slug: "alert-dialog", category: "Overlay" },
  { name: "Autocomplete", slug: "autocomplete", category: "Form" },
  { name: "Avatar", slug: "avatar", category: "Display" },
  { name: "Badge", slug: "badge", category: "Display" },
  { name: "Button", slug: "button", category: "Form" },
  { name: "Card", slug: "card", category: "Layout" },
  { name: "Checkbox", slug: "checkbox", category: "Form" },
  { name: "Checkbox Group", slug: "checkbox-group", category: "Form" },
  { name: "Collapsible", slug: "collapsible", category: "Display" },
  { name: "Combobox", slug: "combobox", category: "Form" },
  { name: "Context Menu", slug: "context-menu", category: "Overlay" },
  { name: "Dialog", slug: "dialog", category: "Overlay" },
  { name: "Drawer", slug: "drawer", category: "Overlay" },
  { name: "Field", slug: "field", category: "Form" },
  { name: "Fieldset", slug: "fieldset", category: "Form" },
  { name: "Form", slug: "form", category: "Form" },
  { name: "Input", slug: "input", category: "Form" },
  { name: "Label", slug: "label", category: "Form" },
  { name: "Menu", slug: "menu", category: "Overlay" },
  { name: "Menubar", slug: "menubar", category: "Navigation" },
  { name: "Meter", slug: "meter", category: "Feedback" },
  { name: "Navigation Menu", slug: "navigation-menu", category: "Navigation" },
  { name: "Number Field", slug: "number-field", category: "Form" },
  { name: "Popover", slug: "popover", category: "Overlay" },
  { name: "Preview Card", slug: "preview-card", category: "Overlay" },
  { name: "Progress", slug: "progress", category: "Feedback" },
  { name: "Radio", slug: "radio", category: "Form" },
  { name: "Scroll Area", slug: "scroll-area", category: "Layout" },
  { name: "Select", slug: "select", category: "Form" },
  { name: "Separator", slug: "separator", category: "Layout" },
  { name: "Skeleton", slug: "skeleton", category: "Feedback" },
  { name: "Slider", slug: "slider", category: "Form" },
  { name: "Switch", slug: "switch", category: "Form" },
  { name: "Tabs", slug: "tabs", category: "Navigation" },
  { name: "Text", slug: "text", category: "Display" },
  { name: "Toast", slug: "toast", category: "Feedback" },
  { name: "Toggle", slug: "toggle", category: "Form" },
  { name: "Toggle Group", slug: "toggle-group", category: "Form" },
  { name: "Toolbar", slug: "toolbar", category: "Layout" },
  { name: "Tooltip", slug: "tooltip", category: "Overlay" },
];

export type IntegrationMeta = {
  name: string;
  slug: string;
};

export const integrations: IntegrationMeta[] = [
  { name: "JSON Render", slug: "json-render" },
];

/** Explicit ordering for sidebar and search results */
export const CATEGORY_ORDER = [
  "Form",
  "Display",
  "Layout",
  "Navigation",
  "Overlay",
  "Feedback",
] as const;

export const categories: string[] = CATEGORY_ORDER.filter((cat) =>
  components.some((c) => c.category === cat),
);

export function getComponentsByCategory(category: string): ComponentMeta[] {
  return components.filter((c) => c.category === category);
}

export function getAllComponentsMeta(): ComponentMeta[] {
  return components;
}
