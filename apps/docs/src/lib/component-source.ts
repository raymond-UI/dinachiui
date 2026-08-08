import fs from "node:fs";
import path from "node:path";

const templatesDir = path.resolve(
  process.cwd(),
  "../../packages/cli/templates",
);

const componentsDir = path.resolve(
  process.cwd(),
  "../../packages/components/src",
);

function read(filePath: string): string | null {
  try {
    // Strip @ts-nocheck directive if present (shouldn't be after cleanup, but safety net)
    return fs.readFileSync(filePath, "utf-8").replace(/^\/\/\s*@ts-nocheck\n?/, "");
  } catch {
    return null;
  }
}

export function getComponentSource(slug: string): string | null {
  return read(path.join(templatesDir, slug, `${slug}.tsx`));
}

export type ComponentBuild = {
  /** The CLI flag that selects it, without the dashes. */
  flag: string;
  source: string;
  /** Packages this build needs that the default one does not. */
  extraDependencies: string[];
};

/** `motion/react` → `motion`. A relative path or an app alias is not a package at all. */
function packageOf(specifier: string): string | null {
  if (specifier.startsWith(".") || specifier.startsWith("@/")) return null;
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/** The packages a file imports, counting `export ... from` and type-only imports. */
function packagesIn(source: string): Set<string> {
  const regex = /(?:^|\n)\s*(?:import|export)\b[^"'`]*?from\s*["']([^"']+)["']/g;
  const found = new Set<string>();

  for (const [, specifier] of source.matchAll(regex)) {
    const name = packageOf(specifier);
    if (name) found.add(name);
  }

  return found;
}

/**
 * The alternative builds a component ships: the same exports and the same usage,
 * implemented differently, so the install command differs by a flag and the file the
 * reader copies by hand differs entirely.
 *
 * Source is what declares a build: `<name>/<name>.motion.tsx` is what makes `--motion`
 * exist, and `pnpm sync` writes it to `templates/<name>-motion/<name>.tsx`. Reading the
 * flags back off the source keeps this page and the CLI describing the same thing.
 */
export function getComponentBuilds(slug: string): ComponentBuild[] {
  let entries: string[];
  try {
    entries = fs.readdirSync(path.join(componentsDir, slug));
  } catch {
    return [];
  }

  const base = getComponentSource(slug);
  const own = base ? packagesIn(base) : new Set<string>();

  return entries
    .flatMap((entry) => {
      const flag = entry.match(new RegExp(`^${slug}\\.([a-z0-9-]+)\\.tsx$`))?.[1];
      if (!flag) return [];

      const source = read(path.join(templatesDir, `${slug}-${flag}`, `${slug}.tsx`));
      if (!source) return [];

      return [
        {
          flag,
          source,
          extraDependencies: [...packagesIn(source)].filter((name) => !own.has(name)).sort(),
        },
      ];
    })
    .sort((a, b) => a.flag.localeCompare(b.flag));
}
