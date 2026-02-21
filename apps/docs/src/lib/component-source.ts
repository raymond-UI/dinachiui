import fs from "node:fs";
import path from "node:path";

const templatesDir = path.resolve(
  process.cwd(),
  "../../packages/cli/templates",
);

export function getComponentSource(slug: string): string | null {
  const filePath = path.join(templatesDir, slug, `${slug}.tsx`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}
