import { getComponentSummaries } from "@/lib/component-pages";
import { docsPageOrder, sectionForPath, type NavSectionId } from "@/lib/docs-nav";

export interface TurnLink {
  name: string;
  href: string;
  section: NavSectionId | null;
}

/** The pages either side of `href`, in sidebar order: guides first, then the components. */
export function pageTurn(href: string): { prev?: TurnLink; next?: TurnLink } {
  const pages = [
    ...docsPageOrder,
    ...getComponentSummaries().map((c) => ({ name: c.title, href: `/docs/components/${c.slug}` })),
  ].filter((p, i, all) => all.findIndex((q) => q.href === p.href) === i);
  const i = pages.findIndex((p) => p.href === href);
  const link = (p?: { name: string; href: string }) => p && { ...p, section: sectionForPath(p.href) };
  return i < 0 ? {} : { prev: link(pages[i - 1]), next: link(pages[i + 1]) };
}
