import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/mdx-components";
import { getAllComponents, getComponentBySlug } from "@/lib/components";
import { getAllComponentsMeta } from "@/lib/component-metadata";
import DocPageHeader from "@/components/layout/doc-page-header";
import { ComponentNavigation } from "@/components/docs/component-navigation";
import { ComponentActions } from "@/components/reusables/ComponentActions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const components = await getAllComponents();
  return components.map((component) => ({
    slug: component.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = await getComponentBySlug(slug);

  if (!component) {
    return { title: "Component Not Found" };
  }

  return {
    title: `${component.frontmatter.title} - DinachiUI`,
    description: component.frontmatter.description,
  };
}

export default async function ComponentDocPage({ params }: PageProps) {
  const { slug } = await params;
  const component = await getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  let content: React.ReactNode;
  try {
    const compiled = await compileMDX({
      source: component.content,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: "github-dark",
                keepBackground: true,
              },
            ],
          ],
        },
      },
    });
    content = compiled.content;
  } catch (error) {
    console.error(`MDX compilation failed for "${slug}":`, error);
    notFound();
  }

  // Get prev/next navigation
  const allComponents = getAllComponentsMeta();
  const currentIndex = allComponents.findIndex((c) => c.slug === slug);
  const prevComponent =
    currentIndex > 0 ? allComponents[currentIndex - 1] : undefined;
  const nextComponent =
    currentIndex < allComponents.length - 1
      ? allComponents[currentIndex + 1]
      : undefined;

  return (
    <DocPageHeader
      title={component.frontmatter.title}
      description={component.frontmatter.description}
      sourceUrl={component.frontmatter.source}
      action={
        <ComponentActions
          title={component.frontmatter.title}
          description={component.frontmatter.description}
          slug={slug}
          rawContent={component.content}
        />
      }
    >
      <div className="mdx-content">{content}</div>
      <ComponentNavigation
        prevComponent={prevComponent}
        nextComponent={nextComponent}
      />
    </DocPageHeader>
  );
}
