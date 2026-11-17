/*
 * Wraps code-like names in backticks where the prose left them bare: camelCase props
 * (`onOpenChange`), part names (`DialogTitle`) and calls (`details.cancel()`). The page and
 * the markdown both run it, so they mark the same words. Text already in backticks or in
 * a link is left alone.
 */

const PROSE = new Set(["JavaScript", "TypeScript", "WebMCP", "GitHub", "VoiceOver", "TalkBack", "DinachiUI", "macOS", "iOS", "iPhone", "iPad", "YouTube", "OpenAI", "ChatGPT"]);

const CODE =
  /(?<![\w`.\-/])((?:[a-z]+[A-Z][A-Za-z0-9]*|[A-Z][a-z0-9]+[A-Z][A-Za-z0-9]*)(?:\.[A-Za-z]+)*(?:\([^()\s]*(?:, ?[^()\s]*)*\))?|[a-z]+\.[a-z][A-Za-z]*\([^()]*\))(?![\w`\-/])/g;

export function codeify(text: string): string {
  return text
    .split(/(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g)
    .map((part, i) => (i % 2 ? part : part.replace(CODE, (m) => (PROSE.has(m) ? m : `\`${m}\``))))
    .join("");
}

/** The same for a block of markdown, skipping fenced code. */
export function codeifyBlock(body: string): string {
  let fenced = false;
  return body
    .split("\n")
    .map((line) => {
      if (line.startsWith("```")) fenced = !fenced;
      return fenced || line.startsWith("```") ? line : codeify(line);
    })
    .join("\n");
}
