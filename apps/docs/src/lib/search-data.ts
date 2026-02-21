import { components, CATEGORY_ORDER, type ComponentMeta } from "./component-metadata";

export interface SearchItem {
  id: string;
  title: string;
  href: string;
  category: string;
  type: "page" | "component";
}

const staticPages: SearchItem[] = [
  { id: "page-conventions", title: "Conventions", href: "/docs/conventions", category: "Getting Started", type: "page" },
  { id: "page-installation", title: "Installation", href: "/docs/installation", category: "Getting Started", type: "page" },
  { id: "page-cli", title: "CLI", href: "/docs/cli", category: "Getting Started", type: "page" },
  { id: "page-colors", title: "Colors", href: "/docs/colors", category: "Foundations", type: "page" },
  { id: "page-theming", title: "Theming", href: "/docs/theming", category: "Foundations", type: "page" },
];

function componentToSearchItem(c: ComponentMeta): SearchItem {
  return {
    id: `component-${c.slug}`,
    title: c.name,
    href: `/docs/components/${c.slug}`,
    category: c.category,
    type: "component",
  };
}

export const SEARCH_CATEGORY_ORDER = [
  "Getting Started",
  "Foundations",
  ...CATEGORY_ORDER,
];

export function getAllSearchItems(): SearchItem[] {
  return [...staticPages, ...components.map(componentToSearchItem)];
}
