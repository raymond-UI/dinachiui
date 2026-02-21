import fs from "node:fs";
import path from "node:path";

const templatesDir = path.resolve(
  process.cwd(),
  "../../packages/cli/templates",
);

export function getComponentSource(slug: string): string | null {
  const filePath = path.join(templatesDir, slug, `${slug}.tsx`);
  try {
    const source = fs.readFileSync(filePath, "utf-8");
    // Strip @ts-nocheck directive if present (shouldn't be after cleanup, but safety net)
    return source.replace(/^\/\/\s*@ts-nocheck\n?/, "");
  } catch {
    return null;
  }
}
