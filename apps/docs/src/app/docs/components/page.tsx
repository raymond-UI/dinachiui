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
      <div className="max-w-3xl font-sans">
        {sections.map((section) => (
          <section key={section.title} className="mb-10 last:mb-4">
            {/*
              The empty span is the rule, as in the sidebar. Baseline alignment
              drops its bottom edge onto the heading's baseline, so the dots run
              out of the word rather than floating above or below it.
            */}
            <h2
              id={section.title.toLowerCase()}
              className="mb-2 flex items-baseline gap-2.5 text-xl text-foreground"
            >
              <span className="font-serif italic">{section.title}</span>
              <span className="min-w-4 flex-1 border-b border-dotted border-border" />
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
                {section.items.length}
              </span>
            </h2>

            <div className="flex flex-col">
              {section.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/components/${item.slug}`}
                  className="group/item relative grid gap-x-6 py-1.5 pl-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-baseline"
                >
                  {/*
                    A dash in the gutter instead of a filled row. It ghosts in on
                    hover at low opacity so the pointer has something to track
                    without the text shifting.
                  */}
                  <span
                    aria-hidden
                    className="absolute left-0 select-none opacity-0 transition-opacity duration-200 group-hover/item:opacity-40"
                  >
                    &mdash;
                  </span>
                  <span className="flex items-center gap-2 text-[15px] tracking-tight text-foreground">
                    {item.name}
                    {item.isNew && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-success">
                        New
                      </span>
                    )}
                  </span>
                  <span className="text-[13.5px] leading-6 text-muted-foreground transition-colors duration-200 group-hover/item:text-foreground">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocPageHeader>
  );
}
