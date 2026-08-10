# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DinachiUI is a React UI component library built as a **pnpm monorepo** with Turbo. It follows a copy-paste design pattern (like shadcn/ui) where components are installed directly into user projects via a CLI tool rather than consumed as an npm package. Components are built on top of **Base UI** for accessibility, styled with **Tailwind CSS**, and written in **TypeScript** with strict mode.

## Monorepo Structure

| Workspace | Path | Purpose |
|---|---|---|
| `@dinachi/core` | `packages/core/` | Shared utilities (`cn`, `variants`) and design tokens (colors, typography, spacing) |
| `@dinachi/components` | `packages/components/` | 40+ React UI components with tests — **single source of truth** |
| `@dinachi/cli` | `packages/cli/` | CLI tool (`dinachi init`, `dinachi add <component>`) for installing components into user projects |
| `docs` | `apps/docs/` | Next.js 16 documentation site with MDX content |

## Component Sync Pipeline

`packages/components/src/` is the single source of truth. A sync script auto-generates:
- `packages/cli/templates/` — CLI templates (rewrites `@dinachi/core` → `@/lib/utils`)
- `apps/docs/src/components/ui/` — docs UI components (same as templates, flat files)

```bash
pnpm sync             # Generate templates + docs UI from core
pnpm sync:check       # Dry-run check (for CI) — exits 1 if out of sync
```

**Workflow:** Edit components in `packages/components/src/`, run `pnpm sync` to propagate. The `build` script runs sync automatically before turbo build.

**Exceptions:** `sidebar` is docs-only (has internal app imports, not synced). `sheet` was removed (overlaps with Drawer).

## Commands

```bash
pnpm install          # Install all dependencies
pnpm sync             # Sync components: core → templates → docs
pnpm build            # Sync + build all packages (turbo)
pnpm dev              # Start all dev servers (turbo, persistent)
pnpm test             # Run all tests (turbo)
pnpm lint             # Lint all packages (turbo)
pnpm type-check       # TypeScript check all packages (turbo)
pnpm deps:check       # Check the CLI's dependency pins against the workspace
pnpm registry:check   # Check each registry entry against the template it describes
pnpm parity:check     # Check a component's alternative builds export the same names
pnpm inventory:check  # Check source, exports, docs and the CLI registry agree
pnpm clean            # Clean all dist directories
```

### Adding a component

Create the folder under `packages/components/src/`, export it from `index.ts`, add it to
`component-inventory.ts`, write the MDX page, and add a registry entry in
`packages/cli/src/utils/registry.ts`. Then `pnpm sync`. `inventory:check` fails if any of
those four are out of step.

A motion component needs `tier: 'motion'` on its registry entry. Nothing derives the tier,
so `inventory:check` cross-checks it against the entry's dependencies: anything depending
on `motion` must be in the motion tier, and vice versa. `add --all` installs the core tier
and `add --motion` the motion one, both read live off the registry — so a correctly
declared component is picked up with no further change to the CLI.


`deps:check` guards `packages/cli/src/utils/dependencies.ts`, the version map
`dinachi add` uses when installing packages into a user's project. A pin below what the
workspace builds against ships users a version nothing here tests, so the check fails when
one drifts, and when the registry installs a package the map does not pin at all. It runs
as part of `release:verify`. `packages/core` floors its own dependencies loosely on
purpose, so the comparison is against the highest floor declared, not the lowest.

`registry:check` reads the other half of the same entry. Every path in `files[]` has to
exist under `packages/cli/templates/`, or `add` copies fewer files than the user thinks
they got; and every declared dependency has to be imported by one of those files, or it
is a package installed into their project for nothing. Packages reached through Tailwind
rather than an import — `tailwindcss-animate`, `tw-animate-css` — are named in the script,
since no file can be expected to import them.

### Alternative builds

A component can ship more than one implementation of itself under a `variants` key on its
registry entry, keyed by the flag that selects it: `add <name> --motion` writes
`templates/<name>-motion/` to the paths `templates/<name>/` would have taken. Source lives
beside the default as `<name>.motion.tsx`, and `pnpm sync` emits the second template
directory from it.

The builds are one component installed two ways, so an importer cannot tell them apart and
switching is a reinstall rather than an edit. `parity:check` is what holds that: it parses
both templates and fails on any exported value or type present in one and not the other.
Each build type-checks perfectly well on its own, so nothing else in the repo would notice.
A prop only one build reads still has to be declared and accepted by both, even if the
other build only destructures it away.

No component ships a second build today. Toast did, and it was dropped once the two proved
too close to be worth the second file; its refined surface is what the single build now
carries.

### Package-specific commands

```bash
# Components — tests live here
cd packages/components
pnpm test             # Run vitest in watch mode
pnpm test:ui          # Run vitest with UI
npx vitest run        # Run tests once (CI mode)
npx vitest run src/button/button.test.tsx  # Run a single test file

# CLI
cd packages/cli
pnpm build            # Build CLI (tsup, ESM only)

# Docs
cd apps/docs
pnpm dev              # Next.js dev server with Turbopack
pnpm build            # Production build
```

## Architecture Details

### Component Pattern
Each component in `packages/components/src/` follows this structure:
```
component-name/
├── component-name.tsx       # Implementation (uses Base UI + Tailwind)
├── component-name.test.tsx  # Vitest + Testing Library tests
├── index.ts                 # Barrel exports
└── README.md                # Component docs (optional)
```

Components use `@dinachi/core`'s `cn()` (clsx + tailwind-merge) for className merging. All components are built on `@base-ui/react` primitives for accessibility. Components support Base UI's `render` prop pattern for element composition (not Radix's `asChild`).

### CLI Architecture (`packages/cli/`)
- **`src/commands/init.ts`** — Detects project structure (src/ vs app/), creates `components.json` config, installs base dependencies (clsx, tailwind-merge, CVA), creates the `cn()` utility file
- **`src/commands/add.ts`** — Reads from the component registry, resolves alias paths via `components.json`, copies component files, installs dependencies
- **`src/utils/registry.ts`** — Defines all available components, their files, npm dependencies, and inter-component dependencies
- **`templates/`** — Auto-generated from `packages/components/src/` via `pnpm sync`

### Design Token System
Theming uses CSS custom properties in HSL format. Tokens are defined in `packages/core/src/tokens/` and consumed via Tailwind's semantic color classes (e.g., `bg-primary`, `text-muted-foreground`).

### Docs Site (`apps/docs/`)
- Self-contained Next.js app that uses the same component files users get from `dinachi add`
- MDX-based content in `apps/docs/content/components/`
- Component metadata: `src/lib/component-metadata.ts`
- Examples registry: `src/lib/examples-registry.tsx`
- Template source display: `src/lib/component-source.ts` reads from `packages/cli/templates/`
- `next.config.ts` has `typescript.ignoreBuildErrors: true` due to pre-existing ref type issues

### Build Tooling
- **tsup** builds `@dinachi/core` and `@dinachi/components` (CJS + ESM dual output; components include `"use client"` banner)
- **Turbo** orchestrates cross-package builds with dependency-aware task ordering (`build` depends on `^build`)
- **Next.js + Turbopack** powers the docs site

## Testing

Tests use **Vitest** with **jsdom** environment and **Testing Library** (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`). Test globals (`describe`, `it`, `expect`) are enabled — no imports needed. Setup file at `packages/components/src/test/setup.ts`.

## Key Technical Choices

- **React 19** — Components use latest React features
- **Base UI `render` prop** — Not Radix's `asChild`. Use `<Button render={<a href="..." />}>` for composition.
- **TypeScript strict mode** — `noUnusedLocals` and `noUnusedParameters` are enforced
- **pnpm 10** with workspace protocol (`workspace:*` for internal deps)
- **ESM-first** — All packages use `"type": "module"`
- **Tailwind CSS 3** for component library / **Tailwind CSS 4** for docs site
