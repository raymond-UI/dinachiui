import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Promise<Highlighter> | null = null;

/**
 * Code highlighted at build time, in both themes at once: every token carries
 * `--shiki-light` and `--shiki-dark`, and component-page.css picks one. The page ships
 * as HTML with no highlighter in the browser.
 */
export async function highlight(code: string, lang: "tsx" | "ts" | "bash" = "tsx"): Promise<string> {
  highlighter ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["tsx", "ts", "bash"],
  });
  return (await highlighter).codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
