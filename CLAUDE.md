# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DinachiUI is a React UI component library built as a **pnpm monorepo** with Turbo. It follows a copy-paste design pattern (like shadcn/ui) where components are installed directly into user projects via a CLI tool rather than consumed as an npm package. Components are built on top of **Base UI** for accessibility, styled with **Tailwind CSS**, and written in **TypeScript** with strict mode.

## Monorepo Structure

| Workspace | Path | Purpose |
|---|---|---|
| `@dinachi/core` | `packages/core/` | Shared utilities (`cn`, `variants`) and design tokens (colors, typography, spacing) |
| `@dinachi/components` | `packages/components/` | 29+ React UI components with tests |
| `@dinachi/cli` | `packages/cli/` | CLI tool (`dinachi init`, `dinachi add <component>`) for installing components into user projects |
| `docs` | `apps/docs/` | Next.js 16 documentation site with MDX content |
| (root) | `src/` | Vite-powered demo/showcase app for development |

## Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages (turbo)
pnpm dev              # Start all dev servers (turbo, persistent)
pnpm test             # Run all tests (turbo)
pnpm lint             # Lint all packages (turbo)
pnpm type-check       # TypeScript check all packages (turbo)
pnpm clean            # Clean all dist directories
```

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

Components use `@dinachi/core`'s `cn()` (clsx + tailwind-merge) for className merging and `variants()` (CVA) for variant definitions. All components are built on `@base-ui/react` primitives for accessibility.

### CLI Architecture (`packages/cli/`)
- **`src/commands/init.ts`** — Detects project structure (src/ vs app/), creates `components.json` config, installs base dependencies (clsx, tailwind-merge, CVA), creates the `cn()` utility file
- **`src/commands/add.ts`** — Reads from the component registry, resolves alias paths via `components.json`, copies component files, installs dependencies
- **`src/utils/registry.ts`** — Defines all available components, their files, npm dependencies, and inter-component dependencies
- **`templates/`** — Source component template files that get copied into user projects

### Design Token System
Theming uses CSS custom properties in HSL format. Tokens are defined in `packages/core/src/tokens/` and consumed via Tailwind's semantic color classes (e.g., `bg-primary`, `text-muted-foreground`). The Tailwind config at the root maps these semantic names to CSS variables.

### Docs Site (`apps/docs/`)
Uses a **registry-based auto-generation system**:
- `src/lib/components-registry.ts` — Component metadata (props, descriptions)
- `src/lib/examples-registry.tsx` — Live component examples
- See `apps/docs/COMPONENT_DOCUMENTATION_GUIDE.md` for the full documentation process

### Build Tooling
- **tsup** builds `@dinachi/core` and `@dinachi/components` (CJS + ESM dual output; components include `"use client"` banner)
- **Turbo** orchestrates cross-package builds with dependency-aware task ordering (`build` depends on `^build`)
- **Vite** powers the root demo app
- **Next.js + Turbopack** powers the docs site

## Testing

Tests use **Vitest** with **jsdom** environment and **Testing Library** (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`). Test globals (`describe`, `it`, `expect`) are enabled — no imports needed. Setup file at `packages/components/src/test/setup.ts`.

## Key Technical Choices

- **React 19** — Components use latest React features
- **TypeScript strict mode** — `noUnusedLocals` and `noUnusedParameters` are enforced
- **pnpm 10** with workspace protocol (`workspace:*` for internal deps)
- **ESM-first** — All packages use `"type": "module"`
- **Tailwind CSS 3** for component library / **Tailwind CSS 4** for docs site
