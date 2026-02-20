import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const componentsDirectory = path.join(
  process.cwd(),
  "content",
  "components",
);

export type ComponentFrontmatter = {
  title: string;
  description: string;
  slug: string;
  category: string;
  dependencies: string[];
  source?: string;
};

export type ComponentSummary = ComponentFrontmatter;

export type ComponentContent = {
  frontmatter: ComponentSummary;
  content: string;
};

function normalizeFrontmatter(
  data: Record<string, unknown>,
  filename: string,
): ComponentSummary {
  const fallbackSlug = filename.replace(/\.mdx?$/, "");

  return {
    title: String(data.title ?? fallbackSlug),
    description: String(data.description ?? ""),
    slug: String(data.slug ?? fallbackSlug),
    category: String(data.category ?? "Uncategorized"),
    dependencies: Array.isArray(data.dependencies)
      ? data.dependencies.map((d) => String(d))
      : [],
    source: data.source ? String(data.source) : undefined,
  };
}

export async function getAllComponents(): Promise<ComponentSummary[]> {
  const entries = await fs.readdir(componentsDirectory, {
    withFileTypes: true,
  });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"));

  const components = await Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(
        path.join(componentsDirectory, file),
        "utf8",
      );
      const { data } = matter(source);
      return normalizeFrontmatter(data, file);
    }),
  );

  return components.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getComponentBySlug(
  slug: string,
): Promise<ComponentContent | null> {
  const mdxPath = path.join(componentsDirectory, `${slug}.mdx`);
  const mdPath = path.join(componentsDirectory, `${slug}.md`);

  let source: string | null = null;
  let filename = `${slug}.mdx`;

  try {
    source = await fs.readFile(mdxPath, "utf8");
  } catch {
    try {
      source = await fs.readFile(mdPath, "utf8");
      filename = `${slug}.md`;
    } catch {
      return null;
    }
  }

  const { data, content } = matter(source);

  return {
    frontmatter: normalizeFrontmatter(data, filename),
    content,
  };
}

export async function getCategories(): Promise<string[]> {
  const components = await getAllComponents();
  const categories = [...new Set(components.map((c) => c.category))];
  return categories.sort();
}

export async function getComponentsByCategory(
  category: string,
): Promise<ComponentSummary[]> {
  const components = await getAllComponents();
  return components.filter((c) => c.category === category);
}
