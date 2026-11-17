import fs from "node:fs";
import path from "node:path";
import {
  getDocumentedPublicComponents,
  type ComponentCategory,
} from "@dinachi/components/component-inventory";
import { DEPENDENCY_VERSION_MAP } from "../../../../../packages/cli/src/utils/dependencies";
import { componentDocs } from "@/content/components";
import { examplesRegistry, type ComponentExample } from "@/lib/examples-registry";
import { getComponentSource } from "@/lib/component-source";
import type { ComponentDoc } from "./types";

export const SITE = "https://dinachi.dev";
const REPO = "https://github.com/raymond-UI/dinachiUI/tree/main/packages/components/src";
const templatesDir = path.resolve(process.cwd(), "../../packages/cli/templates");

export interface ResolvedExample {
  id: string;
  title: string;
  description: string;
  code: string;
}

/** Everything one component page shows, gathered from the sources that own each fact. */
export interface ComponentPageData {
  doc: ComponentDoc;
  title: string;
  category: ComponentCategory;
  url: string;
  install: string;
  /** Paths as `add` writes them under the ui alias. */
  files: string[];
  /** Packages the template imports, with the version `add` pins. */
  dependencies: { name: string; version: string }[];
  /** The template imports the shared agent bridge, which `add` installs alongside. */
  usesAgent: boolean;
  source: string;
  sourceUrl: string;
  examples: ResolvedExample[];
}

const examplesById = new Map<string, ComponentExample>(
  Object.values(examplesRegistry as Record<string, ComponentExample[]>)
    .flat()
    .map((ex) => [ex.componentId, ex]),
);

function packagesIn(code: string): Set<string> {
  const found = new Set<string>();
  for (const [, spec] of code.matchAll(/(?:^|\n)\s*(?:import|export)\b[^"'`]*?from\s*["']([^"']+)["']/g)) {
    if (spec.startsWith(".") || spec.startsWith("@/")) continue;
    const parts = spec.split("/");
    found.add(spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
  }
  return found;
}

export function getComponentPage(slug: string): ComponentPageData | null {
  const doc = componentDocs[slug];
  const entry = getDocumentedPublicComponents().find((c) => c.slug === slug);
  if (!doc || !entry) return null;

  let templateFiles: string[] = [];
  try {
    templateFiles = fs.readdirSync(path.join(templatesDir, slug)).sort((a, b) => (a === "index.ts" ? 1 : b === "index.ts" ? -1 : a.localeCompare(b)));
  } catch {}
  const contents = templateFiles.map((f) => fs.readFileSync(path.join(templatesDir, slug, f), "utf8"));
  const packages = new Set(contents.flatMap((c) => [...packagesIn(c)]));
  packages.delete("react");
  packages.delete("react-dom");

  const examples = doc.examples.map((id) => {
    const ex = examplesById.get(id);
    if (!ex) throw new Error(`${slug}: example "${id}" is not in the examples registry`);
    return { id, title: ex.name, description: ex.description, code: ex.code };
  });

  return {
    doc,
    title: entry.name,
    category: entry.category,
    url: `${SITE}/docs/components/${slug}`,
    install: `npx @dinachi/cli@latest add ${slug}`,
    files: templateFiles.map((f) => `components/ui/${slug}/${f}`),
    dependencies: [...packages].sort().map((name) => ({ name, version: DEPENDENCY_VERSION_MAP[name] ?? "latest" })),
    usesAgent: contents.some((c) => /from ["']@\/components\/ui\/agent["']/.test(c)),
    source: getComponentSource(slug) ?? "",
    sourceUrl: `${REPO}/${slug}`,
    examples,
  };
}

/** The documented components that have a page, in inventory order. */
export function getComponentSummaries() {
  return getDocumentedPublicComponents().flatMap((entry) => {
    const doc = componentDocs[entry.slug];
    if (!doc) return [];
    return [{ slug: entry.slug, title: entry.name, category: entry.category, description: doc.description }];
  });
}
