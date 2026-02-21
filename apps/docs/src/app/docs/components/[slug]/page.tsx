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
import { ComponentSourceProvider } from "@/components/mdx/ComponentSourceProvider";
import { getComponentSource } from "@/lib/component-source";

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

  const title = `${component.frontmatter.title} - DinachiUI`;
  const description = component.frontmatter.description;
  const url = `https://dinachi.dev/docs/components/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "DinachiUI",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
                theme: {
                  dark: "github-dark",
                  light: "github-light",
                },
                keepBackground: false,
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

  // Read component template source for manual installation tab
  const source = getComponentSource(slug);

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
          source={source}
          dependencies={component.frontmatter.dependencies}
        />
      }
    >
      <ComponentSourceProvider
        source={source}
        dependencies={component.frontmatter.dependencies}
      >
        <div className="mdx-content">{content}</div>
      </ComponentSourceProvider>
      <ComponentNavigation
        prevComponent={prevComponent}
        nextComponent={nextComponent}
      />
    </DocPageHeader>
  );
}
