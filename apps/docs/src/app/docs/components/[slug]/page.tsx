import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTurn } from "@/components/docs/page-turn";
import { pageTurn } from "@/lib/page-turn";
import { ComponentPage } from "@/components/component-page/component-page";
import { getComponentPage, getComponentSummaries } from "@/lib/component-pages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getComponentSummaries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getComponentPage(slug);
  if (!page) return { title: "Component Not Found" };

  const title = `${page.title} - DinachiUI`;
  const description = page.doc.description;
  return {
    title: page.title,
    description,
    alternates: {
      canonical: page.url,
      types: { "text/markdown": `${page.url}.md` },
    },
    openGraph: { title, description, url: page.url, type: "article", siteName: "DinachiUI" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComponentDocPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getComponentPage(slug);
  if (!page) notFound();

  const turn = pageTurn(`/docs/components/${slug}`);

  return (
    <ComponentPage
      page={page}
      footer={<PageTurn {...turn} />}
    />
  );
}
