import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/mdx-components";
import { getAllDocs, getDocBySlug } from "@/lib/docs";
import DocPageHeader from "@/components/layout/doc-page-header";
import { ComponentActions } from "@/components/reusables/ComponentActions";

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

  return {
    title: `${doc.frontmatter.title} - DinachiUI`,
    description: doc.frontmatter.description,
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
    console.error(`MDX compilation failed for "${slugStr}":`, error);
    notFound();
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
    </DocPageHeader>
  );
}
