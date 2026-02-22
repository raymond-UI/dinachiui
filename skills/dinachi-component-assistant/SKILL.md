---
name: dinachi-component-assistant
description: Install, configure, select, and maintain Dinachi UI components using @dinachi/cli and the Dinachi monorepo conventions. Use when users ask to initialize Dinachi, add components, map UX requirements to component choices, troubleshoot setup/import/theme issues, or implement/update component source, templates, tests, and docs inside dinachiUI.
---

# Dinachi Component Assistant

Load references progressively:

1. Use `references/workflows.md` for command generation, CLI options, and verification flow.
2. Use `references/components.md` for valid component slugs and coverage notes.
3. Use `references/intent-map.md` when user intent is not a direct component name.
4. Use `references/troubleshooting.md` for deterministic diagnosis and recovery steps.
5. Use `references/maintainer-checklist.md` for monorepo implementation/docs/test work.

Use one of two modes.

## Mode A: Consumer Integration (default)

Use this mode when users want to install or use Dinachi components in an app.

Workflow:

1. Detect package manager and generate commands with the matrix in `references/workflows.md`.
2. Resolve requested components:
   - Prefer exact CLI slugs from `references/components.md`.
   - If ambiguous, run `scripts/suggest-components.mjs` and confirm top matches.
3. Check initialization:
   - If `components.json` is missing, run init first.
4. Add components:
   - Use `add <component...>` for specific requests.
   - Use `add --all` only if explicitly requested.
   - Use `--overwrite` only when replacing existing files is explicitly requested.
   - Use `--skip-install` only when user asks or CI/offline constraints require it.
5. Return a minimal, copy-ready usage snippet with correct import path.
6. Include quick verification commands.

Output order:

1. Setup command(s)
2. Add command
3. Usage snippet
4. Verification
5. Troubleshooting note (only if needed)

## Mode B: Monorepo Maintainer

Use this mode when the request changes Dinachi itself in `/Users/dc/Codebase/dinachiUI`.

Workflow:

1. Follow `references/maintainer-checklist.md` to decide scope:
   - Update existing component
   - Add new component
   - Update docs/examples/tests only
2. Treat `packages/components/src/<slug>` as source of truth.
3. Sync generated targets with `pnpm sync` and validate with `pnpm sync:check`.
4. Keep these surfaces consistent when applicable:
   - core component source/tests/exports
   - CLI templates and registry
   - docs MDX, example components, example registry, component metadata
5. Run targeted verification commands before finalizing.

## Component Resolution Rules

1. Never invent component names.
2. Use kebab-case CLI slugs.
3. Do not suggest `sidebar` as a CLI-installable component.
4. Note that `textarea` is CLI-installable but docs coverage may lag.
5. If user asks for a pattern (for example, "modal confirm"), map via `references/intent-map.md`.

## Safety and Quality Rules

1. Prefer minimal file modifications over broad rewrites.
2. Do not overwrite user component files unless requested.
3. For bugfixes, include a reproduction-oriented verification step.
4. For new components, include tests and docs updates in the same change set unless user says otherwise.
5. If repository signals mismatch, run `scripts/audit-skill.mjs` and report deltas.
