# CLI Improvements Plan

Friction points from real-world usage, ordered by priority.

---

## P0 — Blockers (Prevent basic setup from working)

### 1. Multiple binaries break `pnpm dlx`

**Problem:** `package.json` exports both `dinachi` and `dinachi-ui` binaries. `pnpm dlx @dinachi/cli@latest` fails:

```
ERR_PNPM_DLX_MULTIPLE_BINS  Could not determine executable to run.
```

Users must know to write `pnpm --package=@dinachi/cli dlx dinachi`.

**Fix:** Remove the `dinachi-ui` binary. Keep only `dinachi`.

**File:** `packages/cli/package.json`

```diff
  "bin": {
-   "dinachi": "dist/index.js",
-   "dinachi-ui": "dist/index.js"
+   "dinachi": "dist/index.js"
  },
```

**Scope:** 1 line change.

---

### 2. Non-interactive mode for `init`

**Problem:** `dinachi init` always prompts for component path and utils path. No way to accept defaults. Blocks CI/CD, scripting, and AI tooling.

**Fix:** Add `--yes` / `-y` flag that accepts all auto-detected defaults without prompting.

**File:** `packages/cli/src/commands/init.ts`

Changes:

1. Add `--yes` option to commander definition (~line 519)
2. When `--yes` is set, skip the `prompts()` call and use `projectConfig.componentsPath` / `projectConfig.utilsPath` directly (~line 536-549)
3. Still print what was detected so the user knows what happened

```ts
// commander
.option('-y, --yes', 'Accept all defaults without prompting')

// in action handler
if (options.yes) {
  componentsPath = projectConfig.componentsPath
  utilsPath = projectConfig.utilsPath
} else {
  const response = await prompts([...])
  componentsPath = response.componentsPath
  utilsPath = response.utilsPath
}
```

**Scope:** ~15 lines changed in init.ts.

---

### 3. Import rewriting produces relative paths instead of aliases

**Problem:** Templates use `@/lib/utils`. The `add` command always rewrites these to relative paths (`../../lib/utils`) even when the project has `@/`* configured in tsconfig.json. This is ugly and fragile.

**Root cause:** `rewriteTemplateImports()` (add.ts:143) unconditionally converts to relative via `toImportPath()`. It never checks whether the project's tsconfig `paths` already maps `@/`*.

**Fix:** Before rewriting, check if the project has a `@/`* → `["./*"]` (or `["./src/*"]`) alias in tsconfig. If so, compute the correct `@/...` alias import path instead of a relative path.

**File:** `packages/cli/src/commands/add.ts`

Changes to `rewriteTemplateImports()`:

1. Accept an additional `compilerConfig` parameter
2. Check if `@/`* pattern exists in `compilerConfig.paths`
3. If it does, resolve the utils/variants paths as alias imports (e.g. `@/lib/utils`)
4. Fall back to relative paths if no alias is configured

```ts
function rewriteTemplateImports(
  content: string,
  targetFilePath: string,
  utilsFilePath: string,
  libDirPath: string,
  compilerConfig: CompilerPathConfig | null,
  projectRoot: string
): string {
  // Try alias-based import first
  const aliasImport = tryResolveAsAlias(utilsFilePath, compilerConfig, projectRoot)
  const utilsImportPath = aliasImport ?? toImportPath(targetFilePath, utilsFilePath)

  const variantsFile = path.join(libDirPath, 'variants.ts')
  const variantsAlias = tryResolveAsAlias(variantsFile, compilerConfig, projectRoot)
  const variantsImportPath = variantsAlias ?? toImportPath(targetFilePath, variantsFile)

  return content
    .replace(/(['"])@\/lib\/utils\1/g, `$1${utilsImportPath}$1`)
    .replace(/(['"])@\/lib\/variants\1/g, `$1${variantsImportPath}$1`)
}
```

New helper:

```ts
function tryResolveAsAlias(
  absoluteFilePath: string,
  compilerConfig: CompilerPathConfig | null,
  projectRoot: string
): string | null {
  if (!compilerConfig) return null

  for (const [pattern, targets] of Object.entries(compilerConfig.paths)) {
    if (!pattern.includes('*') || !targets[0]?.includes('*')) continue

    const [prefix] = pattern.split('*')        // "@/"
    const [targetPrefix] = targets[0].split('*') // "./" or "./src/"
    const targetBase = path.resolve(compilerConfig.baseUrl, targetPrefix)

    // Check if the file is under this alias target
    const rel = path.relative(targetBase, absoluteFilePath).replace(/\\/g, '/')
    if (!rel.startsWith('..')) {
      return prefix + stripExtension(rel)       // "@/lib/utils"
    }
  }

  return null
}
```

**Scope:** ~40 lines added/changed in add.ts.

---

## P1 — Missing Components (Force manual workarounds)

### 4. Add `skeleton` component

**Problem:** Skeleton is used in virtually every project for loading states. Not in the registry.

**Implementation:**

1. Create `packages/components/src/skeleton/skeleton.tsx` — a simple `div` with `animate-pulse` and rounded corners. No Base UI dependency needed.
2. Create barrel `index.ts`
3. Add to registry in `packages/cli/src/utils/registry.ts`
4. Run `pnpm sync` to propagate

```tsx
// skeleton.tsx
import { cn } from "@dinachi/core"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

Registry entry:

```ts
skeleton: {
  name: 'skeleton',
  description: 'A placeholder loading animation component.',
  files: [{ name: 'skeleton.tsx' }, { name: 'index.ts' }],
  dependencies: [],
  utilityDependencies: ['cn'],
}
```

**Scope:** 3 new files + 1 registry entry.

---

### 5. Add `label` component

**Problem:** Label is a fundamental form component. Not in the registry. The `field` component may partially cover this but a standalone label is expected.

**Implementation:**

1. Create `packages/components/src/label/label.tsx` — wraps Base UI's `Field.Label` or a simple styled `<label>` with appropriate typography/spacing classes.
2. Create barrel `index.ts`
3. Add to registry

```tsx
// label.tsx
import * as React from "react"
import { cn } from "@dinachi/core"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
```

Registry entry:

```ts
label: {
  name: 'label',
  description: 'A styled label component for form fields.',
  files: [{ name: 'label.tsx' }, { name: 'index.ts' }],
  dependencies: [],
  utilityDependencies: ['cn'],
}
```

**Scope:** 3 new files + 1 registry entry.

---

## P2 — Quality of Life

### 7. RSC detection should respect existing config

**Problem:** `init` hardcodes `rsc: true` for all Next.js projects (init.ts:599). It ignores an existing `components.json` with `rsc: false`, and doesn't inspect the project for `"use client"` patterns.

**Fix:** When an existing `components.json` exists, preserve its `rsc` value. For fresh init, check if the project uses the App Router (has `app/` dir) vs Pages Router (has `pages/` dir) and default accordingly.

**File:** `packages/cli/src/commands/init.ts`

Changes:

1. At the start of init, check for existing `components.json`
2. If it exists, read its `rsc` value and use it as the default
3. For fresh Next.js projects, check for `app/` directory presence (App Router → `rsc: true`, Pages Router → `rsc: false`)
4. For non-Next.js frameworks, default `rsc: false`

**Scope:** ~15 lines in init.ts.

---

### 8. `MenuGroup` export gap (Non-issue)

**Status:** After investigation, `MenuGroup` IS exported from the source component (`packages/components/src/menu/menu.tsx:164`). The template should already include it via sync. If the user's installed file is missing it, it's likely because they installed from an older CLI version.

**Action:** Verify that `pnpm sync` propagates `MenuGroup` to `packages/cli/templates/menu/menu.tsx`. If not, debug the sync script. Otherwise, no code change needed — document in component docs.

---

### 9. shadcn migration command (Future)

**Problem:** Dinachi uses a compatible config format but different component names. No migration tooling exists.

**Recommendation:** Defer to a future milestone. This is a significant feature (component name mapping, import rewriting, config migration) that deserves its own design doc. The prerequisite is that the core CLI (`init` + `add`) works smoothly first.

**Sketch for when ready:**

```
dinachi migrate --from shadcn
```

- Read existing `components.json`
- Map component slugs: `dropdown-menu` → `menu`, `sonner` → `sonner`, etc.
- Update imports in user's component files
- Optionally remove old shadcn component files

---

## Implementation Order


| Phase       | Items                                     | Effort           |
| ----------- | ----------------------------------------- | ---------------- |
| **Phase 1** | #1 (single binary), #2 (`--yes` flag)     | ~30 min          |
| **Phase 2** | #3 (alias imports)                        | ~1 hr            |
| **Phase 3** | #4 (skeleton), #5 (label)                 | ~30 min          |
| **Phase 4** | #7 (RSC detection), #8 (MenuGroup verify) | ~30 min          |
| **Phase 5** | #9 (migration command)                    | Future milestone |


Phases 1-4 can ship together in one release. Phase 5 is deferred.