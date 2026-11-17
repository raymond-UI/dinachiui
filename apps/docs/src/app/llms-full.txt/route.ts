import { getComponentPage, getComponentSummaries } from "@/lib/component-pages";
import { pageMarkdown } from "@/lib/component-pages/markdown";

/* Every component page as markdown, one after another, without the source. */

export const dynamic = "force-static";

export function GET() {
  const pages = getComponentSummaries().map(({ slug }) => pageMarkdown(getComponentPage(slug)!, { source: false }));
  return new Response(["# DinachiUI components", ...pages].join("\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
