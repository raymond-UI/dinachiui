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
const SKIP_TEMPLATES = new Set(["sidebar"]);

// Components in docs that are maintained separately (have internal app imports). Sidebar
// has no source under `packages/components/src` for now, so this guards the docs copy
// against being flattened by one that reappears there half-finished.
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

// A component can ship more than one build of itself. `toast/toast.motion.tsx` is the
// motion build of `toast`: same exports, same usage, different implementation. It syncs to
// `templates/toast-motion/toast.tsx`, so `add toast --motion` writes it to the same path
// the default build would have taken and nothing in the user's app has to change.
function variantOf(componentDir: string, file: string): string | null {
  const match = file.match(new RegExp(`^${componentDir}\\.([a-z0-9-]+)\\.tsx$`));
  return match ? match[1] : null;
}

// The json-render adapter is authored as a template and copied the other way, so it goes to
// the docs as it is rather than through the import rewrite.
function verbatim(content: string): string {
  return content;
}

function coreFile(name: string, file: string): string {
  return path.join(CORE_SRC, name, file);
}

type Emit = (sourcePath: string, targetPath: string, label: string) => void;

/** Copies one file, or records that it would have changed. */
function createEmitter(
  checkOnly: boolean,
  diffs: string[],
  transform: (content: string) => string
): Emit {
  return (sourcePath, targetPath, label) => {
    const content = transform(fs.readFileSync(sourcePath, "utf-8"));

    if (checkOnly) {
      if (!fs.existsSync(targetPath) || fs.readFileSync(targetPath, "utf-8") !== content) {
        diffs.push(label);
      }
      return;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content);
  };
}

interface ComponentFiles {
  componentFile: string;
  indexFile?: string;
  variants: { file: string; variant: string }[];
}

function readComponentFiles(name: string): ComponentFiles | null {
  const files = getSyncableFiles(name);
  const componentFile = files.find((f) => f === `${name}.tsx`);

  if (!componentFile) {
    return null;
  }

  return {
    componentFile,
    indexFile: files.find((f) => f === "index.ts"),
    variants: files
      .map((file) => ({ file, variant: variantOf(name, file) }))
      .filter((entry): entry is { file: string; variant: string } => entry.variant !== null)
      .sort((a, b) => a.variant.localeCompare(b.variant)),
  };
}

function syncTemplates(
  name: string,
  { componentFile, indexFile, variants }: ComponentFiles,
  emit: Emit,
  templateDirs: Set<string>
) {
  const write = (dir: string, file: string, as = file) => {
    templateDirs.add(dir);
    emit(coreFile(name, file), path.join(TEMPLATES_DIR, dir, as), `templates/${dir}/${as}`);
  };

  write(name, componentFile);
  if (indexFile) {
    write(name, indexFile);
  }

  // Each extra build gets a template directory of its own, with the component file still
  // named after the component: it replaces the default build rather than sitting beside it,
  // so it has to land at the path the user's imports already point at.
  for (const { file, variant } of variants) {
    write(`${name}-${variant}`, file, componentFile);
    if (indexFile) {
      write(`${name}-${variant}`, indexFile);
    }
  }
}

// Flat files, and every build: the docs show both side by side rather than choosing one, so
// variants keep their source name here.
function syncDocs(name: string, { componentFile, variants }: ComponentFiles, emit: Emit) {
  for (const file of [componentFile, ...variants.map((v) => v.file)]) {
    emit(coreFile(name, file), path.join(DOCS_UI_DIR, file), `docs/ui/${file}`);
  }
}

function syncJsonRender(emit: Emit, checkOnly: boolean) {
  const templateDir = path.join(TEMPLATES_DIR, "json-render");

  if (!fs.existsSync(templateDir)) {
    return;
  }

  const files = fs
    .readdirSync(templateDir)
    .filter((f) => fs.statSync(path.join(templateDir, f)).isFile());

  for (const file of files) {
    emit(
      path.join(templateDir, file),
      path.join(DOCS_JSON_RENDER_DIR, file),
      `docs/lib/json-render/${file}`
    );
  }

  if (!checkOnly) {
    console.log(`Synced json-render adapter (${files.length} files)`);
  }
}

/** Template directories with no component behind them: usually a rename that half landed. */
function staleTemplateWarnings(templateDirs: Set<string>): string[] {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "utils")
    .map((d) => d.name)
    .filter(
      (dir) =>
        !templateDirs.has(dir) && !SKIP_TEMPLATES.has(dir) && !INTEGRATION_TEMPLATE_DIRS.has(dir)
    )
    .map((dir) => `templates/${dir}/ exists but no core component found`);
}

interface SyncResult {
  synced: string[];
  skippedTemplates: string[];
  skippedDocs: string[];
  warnings: string[];
  diffs: string[]; // For --check mode
}

function syncComponent(
  name: string,
  emit: Emit,
  templateDirs: Set<string>,
  result: SyncResult
) {
  const files = readComponentFiles(name);

  if (!files) {
    result.warnings.push(`${name}: no ${name}.tsx found, skipping`);
    return;
  }

  if (SKIP_TEMPLATES.has(name)) {
    result.skippedTemplates.push(name);
    return;
  }

  syncTemplates(name, files, emit, templateDirs);

  if (SKIP_DOCS.has(name)) {
    result.skippedDocs.push(name);
  } else {
    syncDocs(name, files, emit);
  }

  result.synced.push(name);
}

function sync(checkOnly: boolean): SyncResult {
  const result: SyncResult = {
    synced: [],
    skippedTemplates: [],
    skippedDocs: [],
    warnings: [],
    diffs: [],
  };

  const emit = createEmitter(checkOnly, result.diffs, rewriteImports);
  const templateDirs = new Set<string>();

  for (const name of getComponentDirs()) {
    syncComponent(name, emit, templateDirs, result);
  }

  syncJsonRender(createEmitter(checkOnly, result.diffs, verbatim), checkOnly);
  result.warnings.push(...staleTemplateWarnings(templateDirs));

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
