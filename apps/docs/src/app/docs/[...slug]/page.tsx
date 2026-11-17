import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/mdx-components";
import { getAllDocs, getDocBySlug } from "@/lib/docs";
import { ComponentActions } from "@/components/reusables/ComponentActions";
import { PageTurn } from "@/components/docs/page-turn";
import { pageTurn } from "@/lib/page-turn";
import { sectionForPath } from "@/lib/docs-nav";
import { SectionIcon } from "@/components/layout/section-icons";
import { slugify } from "@/components/mdx/Heading";


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

  const turn = pageTurn(`/docs/${slugStr}`);

  const section = sectionForPath(`/docs/${slugStr}`);
  // The rail only earns its place on a page long enough to need it.
  const headings = outline(doc.content);

  return (
    <article>
      <header className="mb-10">
        <div className="flex items-center gap-2.5">
          {section && <SectionIcon id={section} className="size-6 text-muted-foreground [--icon-fill:.2] [stroke-width:1.1]" />}
          <h1 className="text-[28px] font-semibold leading-none tracking-tight">{doc.frontmatter.title}</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{doc.frontmatter.description}</p>
        <div className="mt-3 flex items-center gap-x-5 text-[13px] text-muted-foreground">
          <ComponentActions
            quiet
            title={doc.frontmatter.title}
            description={doc.frontmatter.description}
            slug={slugStr}
            rawContent={doc.content}
          />
        </div>
      </header>

      <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_180px]">
        <div className="min-w-0">
          <div className="mdx-content mx-0 max-w-[680px] [&>*:first-child]:mt-0">{content}</div>
          <div className="mt-16 max-w-[680px]">
            <PageTurn {...turn} />
          </div>
        </div>
        {headings.length >= 4 && (
          <nav aria-label="On this page" className="sticky top-24 hidden text-[13px] xl:block">
            {headings.map((h) => (
              <a
                key={h}
                href={`#${slugify(h)}`}
                className="block border-l py-1 pl-3 text-muted-foreground transition-colors duration-150 hover:border-foreground hover:text-foreground"
              >
                {h}
              </a>
            ))}
          </nav>
        )}
      </div>
    </article>
  );
}

/** The page's h2 titles, skipping anything inside a code fence. */
function outline(source: string) {
  const out: string[] = [];
  let fenced = false;
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) fenced = !fenced;
    else if (!fenced && line.startsWith("## ")) out.push(line.slice(3).replace(/`/g, "").trim());
  }
  return out;
}
