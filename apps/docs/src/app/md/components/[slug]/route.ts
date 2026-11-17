import { getComponentPage, getComponentSummaries } from "@/lib/component-pages";
import { pageMarkdown } from "@/lib/component-pages/markdown";

/* Served at /docs/components/<slug>.md through a rewrite in next.config.ts. */

export const dynamic = "force-static";
export const dynamicParams = false;

// fallow-ignore-next-line unused-export
export function generateStaticParams() {
  return getComponentSummaries().map(({ slug }) => ({ slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const page = getComponentPage((await params).slug);
  if (!page) return new Response("Not found", { status: 404 });
  return new Response(pageMarkdown(page), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
