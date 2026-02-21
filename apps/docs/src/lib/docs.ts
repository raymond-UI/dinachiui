import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const docsDirectory = path.join(process.cwd(), "content", "docs");

export type DocFrontmatter = {
  title: string;
  description: string;
  slug: string;
};

export type DocContent = {
  frontmatter: DocFrontmatter;
  content: string;
};

function normalizeFrontmatter(
  data: Record<string, unknown>,
  relativePath: string,
): DocFrontmatter {
  const fallbackSlug = relativePath.replace(/\.mdx?$/, "");

  return {
    title: String(data.title ?? fallbackSlug),
    description: String(data.description ?? ""),
    slug: String(data.slug ?? fallbackSlug),
  };
}

async function collectMdxFiles(
  dir: string,
  prefix = "",
): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(
        ...(await collectMdxFiles(path.join(dir, entry.name), relativePath)),
      );
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      files.push(relativePath);
    }
  }

  return files;
}

export async function getAllDocs(): Promise<DocFrontmatter[]> {
  const files = await collectMdxFiles(docsDirectory);

  const docs = await Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(
        path.join(docsDirectory, file),
        "utf8",
      );
      const { data } = matter(source);
      return normalizeFrontmatter(data, file);
    }),
  );

  return docs;
}

export async function getDocBySlug(
  slug: string,
): Promise<DocContent | null> {
  const candidates = [
    `${slug}.mdx`,
    `${slug}/index.mdx`,
    `${slug}.md`,
  ];

  for (const candidate of candidates) {
    try {
      const source = await fs.readFile(
        path.join(docsDirectory, candidate),
        "utf8",
      );
      const { data, content } = matter(source);
      return {
        frontmatter: normalizeFrontmatter(data, candidate),
        content,
      };
    } catch {
      continue;
    }
  }

  return null;
}
