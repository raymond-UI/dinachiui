import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/mdx-components";
import { getAllDocs, getDocBySlug } from "@/lib/docs";
import DocPageHeader from "@/components/layout/doc-page-header";
import { ComponentActions } from "@/components/reusables/ComponentActions";
import { ComponentNavigation } from "@/components/docs/component-navigation";
import { getAllComponentsMeta } from "@/lib/component-metadata";

/** Ordered list of docs pages matching the sidebar structure. */
const docsPages = [
  { name: "Conventions", slug: "conventions", href: "/docs/conventions" },
  { name: "Installation", slug: "installation", href: "/docs/installation" },
  { name: "CLI", slug: "cli", href: "/docs/cli" },
  { name: "Skills", slug: "skills", href: "/docs/skills" },
  { name: "Theming", slug: "theming", href: "/docs/theming" },
  { name: "JSON Render", slug: "integrations/json-render", href: "/docs/integrations/json-render" },
];

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const doc = await getDocBySlug(slugStr);

  if (!doc) {
    return { title: "Page Not Found" };
  }

  const title = `${doc.frontmatter.title} - DinachiUI`;
  const description = doc.frontmatter.description;
  const url = `https://dinachi.dev/docs/${slugStr}`;

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

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const doc = await getDocBySlug(slugStr);

  if (!doc) {
    notFound();
  }

  let content: React.ReactNode;
  try {
    const compiled = await compileMDX({
      source: doc.content,
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
    console.error(`MDX compilation failed for "${slugStr}":`, error);
    notFound();
  }

  // Get prev/next navigation for docs pages
  const currentIndex = docsPages.findIndex((d) => d.slug === slugStr);
  const prevDoc = currentIndex > 0 ? docsPages[currentIndex - 1] : undefined;

  let nextDoc: (typeof docsPages)[number] | undefined;
  if (currentIndex >= 0 && currentIndex < docsPages.length - 1) {
    nextDoc = docsPages[currentIndex + 1];
  } else if (currentIndex === docsPages.length - 1) {
    // Bridge to first component page
    const firstComponent = getAllComponentsMeta()[0];
    if (firstComponent) {
      nextDoc = {
        name: firstComponent.name,
        slug: firstComponent.slug,
        href: `/docs/components/${firstComponent.slug}`,
      };
    }
  }

  return (
    <DocPageHeader
      title={doc.frontmatter.title}
      description={doc.frontmatter.description}
      action={
        <ComponentActions
          title={doc.frontmatter.title}
          description={doc.frontmatter.description}
          slug={slugStr}
          rawContent={doc.content}
        />
      }
    >
      <div className="mdx-content">{content}</div>
      <ComponentNavigation prevComponent={prevDoc} nextComponent={nextDoc} />
    </DocPageHeader>
  );
}
