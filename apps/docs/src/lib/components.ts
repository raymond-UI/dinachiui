import { getComponentSummaries } from "@/lib/component-pages";

/*
 * The component list the index page, llms.txt and the sitemap read. It comes from the
 * same content files the pages render, so a component cannot be listed with one
 * description and documented with another.
 */

export type ComponentSummary = ReturnType<typeof getComponentSummaries>[number];

export async function getAllComponents(): Promise<ComponentSummary[]> {
  return getComponentSummaries().sort((a, b) => a.title.localeCompare(b.title));
}
