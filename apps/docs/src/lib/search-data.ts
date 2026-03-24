import { components, integrations, type ComponentMeta, type IntegrationMeta } from "./component-metadata";

export interface SearchItem {
  id: string;
  title: string;
  href: string;
  category: string;
  type: "page" | "component" | "integration";
}

const staticPages: SearchItem[] = [
  { id: "page-conventions", title: "Conventions", href: "/docs/conventions", category: "Getting Started", type: "page" },
  { id: "page-installation", title: "Installation", href: "/docs/installation", category: "Getting Started", type: "page" },
  { id: "page-cli", title: "CLI", href: "/docs/cli", category: "Getting Started", type: "page" },
  { id: "page-skills", title: "AI Skills", href: "/docs/skills", category: "Getting Started", type: "page" },
  { id: "page-theming", title: "Theming & Colors", href: "/docs/theming", category: "Foundations", type: "page" },
  { id: "page-playground", title: "Playground", href: "/playground", category: "Integrations", type: "page" },
];

function componentToSearchItem(c: ComponentMeta): SearchItem {
  return {
    id: `component-${c.slug}`,
    title: c.name,
    href: `/docs/components/${c.slug}`,
    category: "Components",
    type: "component",
  };
}

function integrationToSearchItem(i: IntegrationMeta): SearchItem {
  return {
    id: `integration-${i.slug}`,
    title: i.name,
    href: `/docs/integrations/${i.slug}`,
    category: "Integrations",
    type: "integration",
  };
}

export const SEARCH_CATEGORY_ORDER = [
  "Getting Started",
  "Foundations",
  "Integrations",
  "Components",
];

export function getAllSearchItems(): SearchItem[] {
  return [
    ...staticPages,
    ...integrations.map(integrationToSearchItem),
    ...components.map(componentToSearchItem),
  ];
}
