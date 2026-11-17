import { getAllComponentsMeta } from "@/lib/component-metadata";

export type NavSectionId =
  | "start"
  | "build-with-ai"
  | "agents"
  | "inputs"
  | "dates"
  | "forms"
  | "actions"
  | "overlays"
  | "menus"
  | "status"
  | "display"
  | "lists"
  | "effects";

export interface NavItem {
  title: string;
  href: string;
  isNew?: boolean;
  /** Pages that live under this one and are reached from it, not from the sidebar. */
  children?: { title: string; href: string }[];
}

export interface NavSection {
  id: NavSectionId;
  title: string;
  items: NavItem[];
}

const guideSections: NavSection[] = [
  {
    id: "start",
    title: "Start",
    items: [
      {
        title: "Installation",
        href: "/docs/installation",
        children: [
          { title: "Next.js", href: "/docs/installation/nextjs" },
          { title: "Vite", href: "/docs/installation/vite" },
        ],
      },
      { title: "CLI", href: "/docs/cli" },
      { title: "Theming", href: "/docs/theming" },
      { title: "Conventions", href: "/docs/conventions" },
    ],
  },
  {
    id: "build-with-ai",
    title: "Build with AI",
    items: [
      { title: "Skills", href: "/docs/skills" },
      { title: "llms.txt", href: "/llms.txt" },
    ],
  },
];

/**
 * Components are grouped by the job they do, from an open card sort. The inventory's
 * `category` still drives the tier (Motion) and is not used here.
 */
const componentSections: { id: NavSectionId; title: string; slugs: string[] }[] = [
  {
    id: "inputs",
    title: "Inputs",
    slugs: [
      "autocomplete", "checkbox", "checkbox-group", "combobox", "input", "number-field",
      "otp-field", "radio", "select", "slider", "switch", "textarea",
    ],
  },
  { id: "dates", title: "Dates & time", slugs: ["calendar", "date-picker", "date-range-picker"] },
  { id: "forms", title: "Forms", slugs: ["field", "fieldset", "form", "label"] },
  {
    id: "actions",
    title: "Actions",
    slugs: ["button", "hold-to-confirm", "link", "toggle", "toggle-group", "toolbar"],
  },
  {
    id: "overlays",
    title: "Overlays",
    slugs: ["alert-dialog", "dialog", "drawer", "popover", "preview-card", "toast", "tooltip"],
  },
  {
    id: "menus",
    title: "Menus & tabs",
    slugs: ["animated-tabs", "context-menu", "menu", "menubar", "navigation-menu", "tabs"],
  },
  {
    id: "status",
    title: "Status",
    slugs: [
      "load-transition", "meter", "progress", "progress-ring", "skeleton",
      "streaming-text", "text-shimmer",
    ],
  },
  {
    id: "display",
    title: "Display",
    slugs: [
      "accordion", "avatar", "badge", "card", "carousel", "collapsible", "compare-slider",
      "expandable-card", "scroll-area", "separator", "text",
    ],
  },
  {
    id: "lists",
    title: "Lists",
    slugs: ["animated-list", "sortable", "stagger-list", "swipeable-row"],
  },
  {
    id: "effects",
    title: "Effects",
    slugs: [
      "animated-icon", "marquee", "number-ticker", "scroll-progress", "scroll-reveal",
      "text-morph",
    ],
  },
];

function buildNav(): NavSection[] {
  const components = getAllComponentsMeta();
  const bySlug = new Map(components.map((c) => [c.slug, c]));
  const placed = new Set<string>(["agent"]);

  const toItem = (slug: string): NavItem | undefined => {
    const c = bySlug.get(slug);
    if (!c) return undefined;
    placed.add(slug);
    return { title: c.name, href: `/docs/components/${c.slug}`, isNew: c.isNew };
  };

  const bridge = toItem("agent");
  const agents: NavSection = {
    id: "agents",
    title: "Agents",
    items: [
      { title: "Overview", href: "/docs/agent" },
      ...(bridge ? [{ ...bridge, title: "Agent Bridge" }] : []),
      { title: "Safety", href: "/docs/agent/safety" },
      { title: "Recipes", href: "/docs/agent/recipes" },
      {
        title: "JSON Render",
        href: "/docs/integrations/json-render",
        children: [
          {
            title: "Component Reference",
            href: "/docs/integrations/json-render/component-reference",
          },
        ],
      },
    ],
  };

  const sections: NavSection[] = componentSections.map(({ id, title, slugs }) => ({
    id,
    title,
    items: slugs
      .map(toItem)
      .filter((item): item is NavItem => item !== undefined)
      .sort((a, b) => a.title.localeCompare(b.title)),
  }));

  // A component added to the inventory but not to a section above still gets a link,
  // in Display, rather than silently vanishing from the nav.
  const unplaced = components.filter((c) => !placed.has(c.slug));
  if (unplaced.length > 0) {
    const display = sections.find((s) => s.id === "display")!;
    display.items.push(...unplaced.map((c) => toItem(c.slug)!));
    display.items.sort((a, b) => a.title.localeCompare(b.title));
  }

  return [...guideSections, agents, ...sections].filter((s) => s.items.length > 0);
}

export const docsNav: NavSection[] = buildNav();

function matches(pathname: string, item: NavItem): boolean {
  return (
    pathname === item.href ||
    (item.children?.some((child) => child.href === pathname) ?? false)
  );
}

/** The section holding the page at `pathname`, so the sidebar can open it. */
export function sectionForPath(pathname: string): NavSectionId | null {
  for (const section of docsNav) {
    if (section.items.some((item) => matches(pathname, item))) return section.id;
  }
  return null;
}

/** The sidebar link that should read as current for `pathname`. */
export function activeHrefForPath(pathname: string): string | null {
  for (const section of docsNav) {
    for (const item of section.items) if (matches(pathname, item)) return item.href;
  }
  return null;
}

export interface PageLink {
  name: string;
  href: string;
}

/**
 * Every docs page in sidebar order, nested pages directly after their parent. Prev and
 * next links read from this, so they cannot drift from the sidebar.
 */
export const docsPageOrder: PageLink[] = docsNav.flatMap((section) =>
  section.items
    .filter((item) => item.href.startsWith("/docs/"))
    .flatMap((item) => [
      { name: item.title, href: item.href },
      ...(item.children ?? []).map((child) => ({ name: child.title, href: child.href })),
    ]),
);
