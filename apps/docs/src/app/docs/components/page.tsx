import { getAllComponents } from "@/lib/components";
import { docsNav } from "@/lib/docs-nav";
import { ComponentsIndex, type IndexSection } from "@/components/components-index/components-index";
import { summaries } from "@/components/components-index/summaries";

export default async function ComponentsPage() {
  const allComponents = await getAllComponents();
  const bySlug = new Map(allComponents.map((component) => [component.slug, component]));

  // Same sections as the sidebar. Agent Bridge has its own guide section there.
  const sections: IndexSection[] = docsNav
    .map((section) => ({
      id: section.id,
      title: section.title,
      items: section.items
        .filter((item) => item.href.startsWith("/docs/components/"))
        .map((item) => {
          const slug = item.href.slice("/docs/components/".length);
          const component = bySlug.get(slug);
          return {
            slug,
            title: item.title,
            summary: summaries[slug] ?? component?.description ?? "",
            isNew: !!item.isNew,
            motion: component?.category === "Motion",
          };
        }),
    }))
    .filter((section) => section.items.length > 0);

  return <ComponentsIndex sections={sections} total={allComponents.length} />;
}
