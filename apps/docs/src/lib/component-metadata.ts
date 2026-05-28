/**
 * Static component metadata for client-side use (sidebar navigation, etc.).
 * This is derived from the shared Dinachi package inventory so docs, exports,
 * and design-system work all plan from the same public component surface.
 */

import {
  CATEGORY_ORDER,
  getDocumentedPublicComponents,
  type ComponentCategory,
  type PublicComponentDefinition,
} from "@dinachi/components/component-inventory";

export type ComponentMeta = Pick<
  PublicComponentDefinition,
  "name" | "slug" | "category"
>;

export const components: ComponentMeta[] = getDocumentedPublicComponents().map(
  ({ name, slug, category }) => ({
    name,
    slug,
    category,
  }),
);

export type IntegrationMeta = {
  name: string;
  slug: string;
};

export const integrations: IntegrationMeta[] = [
  { name: "JSON Render", slug: "json-render" },
];

/** Explicit ordering for sidebar and search results */
export const categories: ComponentCategory[] = CATEGORY_ORDER.filter((cat) =>
  components.some((c) => c.category === cat),
);

export function getComponentsByCategory(category: string): ComponentMeta[] {
  return components.filter((c) => c.category === category);
}

export function getAllComponentsMeta(): ComponentMeta[] {
  return components;
}
