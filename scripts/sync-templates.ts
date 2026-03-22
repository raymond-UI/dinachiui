import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CORE_SRC = path.join(ROOT, "packages/components/src");
const TEMPLATES_DIR = path.join(ROOT, "packages/cli/templates");
const DOCS_UI_DIR = path.join(ROOT, "apps/docs/src/components/ui");
const DOCS_JSON_RENDER_DIR = path.join(ROOT, "apps/docs/src/lib/json-render");

// Template directories managed outside of component sync (e.g. integrations)
const INTEGRATION_TEMPLATE_DIRS = new Set(["json-render"]);

// Directories in core that are not components
const SKIP_CORE_DIRS = new Set(["test", "hooks"]);

// Components that should not be synced to templates (not part of the library)
const SKIP_TEMPLATES = new Set(["sheet", "sidebar"]);

// Components in docs that are maintained separately (have internal app imports)
const SKIP_DOCS = new Set(["sidebar"]);

// Files to skip when copying
const SKIP_FILES = [/\.test\.tsx?$/, /README\.md$/];

// Import rewrite: @dinachi/core → @/lib/utils
function rewriteImports(content: string): string {
  return content.replace(
    /from\s+(['"])@dinachi\/core\1/g,
    'from $1@/lib/utils$1'
  );
}

function getComponentDirs(): string[] {
  return fs
    .readdirSync(CORE_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_CORE_DIRS.has(d.name))
    .map((d) => d.name)
    .sort();
}

function shouldSkipFile(filename: string): boolean {
  return SKIP_FILES.some((pattern) => pattern.test(filename));
}

function getSyncableFiles(componentDir: string): string[] {
  const dirPath = path.join(CORE_SRC, componentDir);
  return fs
    .readdirSync(dirPath)
    .filter((f) => !shouldSkipFile(f) && fs.statSync(path.join(dirPath, f)).isFile());
}

interface SyncResult {
  synced: string[];
  skippedTemplates: string[];
  skippedDocs: string[];
  warnings: string[];
  diffs: string[]; // For --check mode
}

function sync(checkOnly: boolean): SyncResult {
  const result: SyncResult = {
    synced: [],
    skippedTemplates: [],
    skippedDocs: [],
    warnings: [],
    diffs: [],
  };

  const components = getComponentDirs();

  for (const name of components) {
    const files = getSyncableFiles(name);
    const componentFile = files.find((f) => f === `${name}.tsx`);
    const indexFile = files.find((f) => f === "index.ts");

    if (!componentFile) {
      result.warnings.push(`${name}: no ${name}.tsx found, skipping`);
      continue;
    }

    // --- Sync to CLI templates ---
    if (SKIP_TEMPLATES.has(name)) {
      result.skippedTemplates.push(name);
    } else {
      const templateDir = path.join(TEMPLATES_DIR, name);

      for (const file of [componentFile, indexFile].filter(Boolean) as string[]) {
        const sourcePath = path.join(CORE_SRC, name, file);
        const targetPath = path.join(templateDir, file);
        const sourceContent = rewriteImports(fs.readFileSync(sourcePath, "utf-8"));

        if (checkOnly) {
          const targetExists = fs.existsSync(targetPath);
          if (!targetExists || fs.readFileSync(targetPath, "utf-8") !== sourceContent) {
            result.diffs.push(`templates/${name}/${file}`);
          }
        } else {
          fs.mkdirSync(templateDir, { recursive: true });
          fs.writeFileSync(targetPath, sourceContent);
        }
      }

      // --- Sync to docs UI (flat files, component .tsx only) ---
      if (SKIP_DOCS.has(name)) {
        result.skippedDocs.push(name);
      } else {
        const sourcePath = path.join(CORE_SRC, name, componentFile);
        const targetPath = path.join(DOCS_UI_DIR, componentFile);
        const sourceContent = rewriteImports(fs.readFileSync(sourcePath, "utf-8"));

        if (checkOnly) {
          const targetExists = fs.existsSync(targetPath);
          if (!targetExists || fs.readFileSync(targetPath, "utf-8") !== sourceContent) {
            result.diffs.push(`docs/ui/${componentFile}`);
          }
        } else {
          fs.writeFileSync(targetPath, sourceContent);
        }
      }

      result.synced.push(name);
    }
  }

  // --- Sync json-render templates → docs ---
  const jsonRenderTemplateDir = path.join(TEMPLATES_DIR, "json-render");

  if (fs.existsSync(jsonRenderTemplateDir)) {
    const jsonRenderFiles = fs.readdirSync(jsonRenderTemplateDir)
      .filter((f) => fs.statSync(path.join(jsonRenderTemplateDir, f)).isFile());

    for (const file of jsonRenderFiles) {
      const sourcePath = path.join(jsonRenderTemplateDir, file);
      const targetPath = path.join(DOCS_JSON_RENDER_DIR, file);
      const content = fs.readFileSync(sourcePath, "utf-8");

      if (checkOnly) {
        const targetExists = fs.existsSync(targetPath);
        if (!targetExists || fs.readFileSync(targetPath, "utf-8") !== content) {
          result.diffs.push(`docs/lib/json-render/${file}`);
        }
      } else {
        fs.mkdirSync(DOCS_JSON_RENDER_DIR, { recursive: true });
        fs.writeFileSync(targetPath, content);
      }
    }

    if (!checkOnly) {
      console.log(`Synced json-render adapter (${jsonRenderFiles.length} files)`);
    }
  }

  // Warn about template dirs that don't exist in core
  if (fs.existsSync(TEMPLATES_DIR)) {
    const templateDirs = fs
      .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== "utils")
      .map((d) => d.name);

    for (const dir of templateDirs) {
      if (!components.includes(dir) && !SKIP_TEMPLATES.has(dir) && !INTEGRATION_TEMPLATE_DIRS.has(dir)) {
        result.warnings.push(`templates/${dir}/ exists but no core component found`);
      }
    }
  }

  return result;
}

// --- CLI ---
const checkOnly = process.argv.includes("--check");
const result = sync(checkOnly);

if (checkOnly) {
  if (result.diffs.length > 0) {
    console.error("Out of sync:");
    for (const diff of result.diffs) {
      console.error(`  ✗ ${diff}`);
    }
    console.error(`\nRun 'pnpm sync' to fix.`);
    process.exit(1);
  } else {
    console.log(`✓ All ${result.synced.length} components in sync`);
  }
} else {
  console.log(`Synced ${result.synced.length} components`);
  if (result.skippedTemplates.length > 0) {
    console.log(`Skipped templates: ${result.skippedTemplates.join(", ")}`);
  }
  if (result.skippedDocs.length > 0) {
    console.log(`Skipped docs: ${result.skippedDocs.join(", ")}`);
  }
  if (result.warnings.length > 0) {
    for (const w of result.warnings) {
      console.log(`  ⚠ ${w}`);
    }
  }
}
