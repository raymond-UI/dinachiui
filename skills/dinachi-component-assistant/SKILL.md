---
name: dinachi-component-assistant
description: Install, add, and implement Dinachi UI components with @dinachi/cli in React/Next.js apps. Use when users ask to initialize Dinachi, add one or more Dinachi components, generate usage snippets, map requested UI patterns to Dinachi components, or troubleshoot Dinachi component integration.
---

# Dinachi Component Assistant

Execute this workflow in order:

1. Identify the framework, package manager, and requested component names.
2. If Dinachi is not initialized, run:
   - `npx @dinachi/cli@latest init`
3. Add requested components:
   - `npx @dinachi/cli@latest add <component...>`
   - Use `npx @dinachi/cli@latest add --all` only when explicitly requested.
4. Provide a minimal usage snippet with correct imports and practical defaults.
5. For work inside the Dinachi monorepo, use canonical patterns from:
   - `/Users/dc/Codebase/dinachiUI/apps/docs/src/components/examples`
   - `/Users/dc/Codebase/dinachiUI/apps/docs/content/components`
   - `/Users/dc/Codebase/dinachiUI/packages/components/src`
6. If a requested component name is ambiguous, propose closest valid names from `references/components.md` and ask for confirmation.

Response format:

1. Setup command(s)
2. Add command
3. Usage snippet
4. Optional troubleshooting notes

Troubleshooting guidance:

- Missing styles or tokens: verify initialization was completed in the target app.
- Import errors: verify component file exists under `src/components/ui/`.
- Wrong component name: check `references/components.md` and use exact CLI names.
- Version mismatches: run with `@latest` and re-add component files if templates changed.
