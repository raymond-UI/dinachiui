export type ComponentCategory =
  | "Form"
  | "Display"
  | "Layout"
  | "Navigation"
  | "Overlay"
  | "Feedback"
  | "Motion"

export interface PublicComponentDefinition {
  name: string
  slug: string
  category: ComponentCategory
  documented: boolean
  /**
   * ISO date the component was first released. Drives the "New" badge, which expires
   * on its own after `NEW_FOR_DAYS` so the marker never has to be cleared by hand.
   */
  added?: string
}

/** How long after `added` a component is still badged as new. */
export const NEW_FOR_DAYS = 60

export function isNewComponent(
  component: PublicComponentDefinition,
  now: Date = new Date()
): boolean {
  if (!component.added) return false
  const added = new Date(component.added).getTime()
  if (Number.isNaN(added)) return false
  return now.getTime() - added < NEW_FOR_DAYS * 24 * 60 * 60 * 1000
}

// Canonical inventory for Dinachi's public component surface area.
// Sidebar is excluded until it reaches docs/export parity. The copy that is being kept
// current lives at `apps/docs/src/components/ui/sidebar.tsx`, where the docs nav uses it;
// that is the one to promote from.
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
  { name: "OTP Field", slug: "otp-field", category: "Form", documented: true },
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
  { name: "Textarea", slug: "textarea", category: "Form", documented: true },
  { name: "Toast", slug: "toast", category: "Feedback", documented: true },
  { name: "Toggle", slug: "toggle", category: "Form", documented: true },
  { name: "Toggle Group", slug: "toggle-group", category: "Form", documented: true },
  { name: "Toolbar", slug: "toolbar", category: "Layout", documented: true },
  { name: "Tooltip", slug: "tooltip", category: "Overlay", documented: true },

  // Motion tier. Opt-in: these are the only components that pull `motion` in, and
  // nothing in the tiers above depends on them. Undocumented entries are built and
  // installable but have no docs page yet.
  { name: "Animated Icon", slug: "animated-icon", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Animated List", slug: "animated-list", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Animated Tabs", slug: "animated-tabs", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Carousel", slug: "carousel", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Compare Slider", slug: "compare-slider", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Expandable Card", slug: "expandable-card", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Hold to Confirm", slug: "hold-to-confirm", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Load Transition", slug: "load-transition", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Marquee", slug: "marquee", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Number Ticker", slug: "number-ticker", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Progress Ring", slug: "progress-ring", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Scroll Progress", slug: "scroll-progress", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Scroll Reveal", slug: "scroll-reveal", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Sortable", slug: "sortable", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Stagger List", slug: "stagger-list", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Streaming Text", slug: "streaming-text", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Swipeable Row", slug: "swipeable-row", category: "Motion", documented: true, added: "2026-08-06" },
  { name: "Text Morph", slug: "text-morph", category: "Motion", documented: true, added: "2026-08-01" },
  { name: "Text Shimmer", slug: "text-shimmer", category: "Motion", documented: true, added: "2026-08-01" },
]

export const CATEGORY_ORDER: ComponentCategory[] = [
  "Form",
  "Display",
  "Layout",
  "Navigation",
  "Overlay",
  "Feedback",
  // Last, because it is the one group a reader can skip entirely.
  "Motion",
]

export function getDocumentedPublicComponents(): PublicComponentDefinition[] {
  return publicComponents.filter((component) => component.documented)
}
