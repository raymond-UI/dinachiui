import Link from "next/link";
import { getAllComponents } from "@/lib/components";
import { categories, getComponentsByCategory } from "@/lib/component-metadata";
import DocPageHeader from "@/components/layout/doc-page-header";

export default async function ComponentsPage() {
  const allComponents = await getAllComponents();
  const descriptions = new Map(
    allComponents.map((component) => [component.slug, component.description]),
  );

  const sections = categories.map((category) => ({
    title: category,
    items: [...getComponentsByCategory(category)]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((component) => ({
        ...component,
        description: descriptions.get(component.slug) ?? "",
      })),
  }));

  return (
    <DocPageHeader
      title="Components"
      description={`${allComponents.length} components, grouped by what they do. Copy and paste into your app.`}
    >
      <div className="font-sans">
        {sections.map((section) => (
          <section key={section.title} className="mb-8 last:mb-4">
            {/*
              The empty span is the rule, as in the sidebar. Baseline alignment
              drops its bottom edge onto the heading's baseline, so the dots run
              out of the word rather than floating above or below it.
            */}
            <h2
              id={section.title.toLowerCase()}
              className="mb-1.5 flex items-baseline gap-2.5 text-xl text-foreground"
            >
              <span className="font-serif italic">{section.title}</span>
              <span className="min-w-4 flex-1 border-b border-dotted border-border" />
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
                {section.items.length}
              </span>
            </h2>

            {/*
              Multi-column rather than a grid, so a short category takes only the
              rows it needs instead of stretching to fill a fixed track count.
            */}
            <div className="columns-2 gap-8 sm:columns-3 lg:columns-4">
              {section.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/components/${item.slug}`}
                  // The description is off the page in this layout, so it rides
                  // along here for anyone who hovers rather than clicks through.
                  title={item.description || undefined}
                  className="flex break-inside-avoid items-center gap-2 text-[13.5px] leading-7 tracking-tight text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {item.name}
                  {item.isNew && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-success">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocPageHeader>
  );
}
