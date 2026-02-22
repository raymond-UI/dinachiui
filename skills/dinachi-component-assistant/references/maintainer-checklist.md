# Monorepo Maintainer Checklist

Use this for requests that change Dinachi in `/Users/dc/Codebase/dinachiUI`.

## A) Update Existing Component

1. Edit source in `packages/components/src/<slug>/`.
2. Ensure exports stay correct in:
   - `packages/components/src/<slug>/index.ts`
   - `packages/components/src/index.ts`
3. Add or update tests in `packages/components/src/<slug>/<slug>.test.tsx`.
4. Run `pnpm sync` to propagate component source to:
   - `packages/cli/templates/<slug>/`
   - `apps/docs/src/components/ui/<slug>.tsx`
5. Verify with:
   - `pnpm sync:check`
   - `pnpm --filter @dinachi/components test -- --run`

## B) Add New Component

1. Create `packages/components/src/<slug>/` with:
   - `<slug>.tsx`
   - `index.ts`
   - `<slug>.test.tsx`
   - optional `README.md`
2. Export from `packages/components/src/index.ts`.
3. Add CLI registry entry in `packages/cli/src/utils/registry.ts`:
   - files
   - dependencies
   - componentDependencies (if needed)
   - utilityDependencies
4. Run `pnpm sync`.
5. Add docs page:
   - `apps/docs/content/components/<slug>.mdx`
6. Add sidebar metadata:
   - `apps/docs/src/lib/component-metadata.ts`
7. Add examples:
   - `apps/docs/src/components/examples/<slug>-examples.tsx`
   - wire examples into `apps/docs/src/lib/examples-registry.tsx`
8. Validate:
   - `pnpm sync:check`
   - `pnpm --filter @dinachi/components type-check`
   - `pnpm --filter @dinachi/components test -- --run`
   - `pnpm --filter @dinachi/components build`

## C) Docs-only Changes

1. Update MDX in `apps/docs/content/components/*.mdx`.
2. Keep install command strings aligned with CLI:
   - `npx @dinachi/cli@latest add <slug>`
3. Ensure `ComponentPreview` names exist in examples registry.
4. Verify docs build path if requested.

## Source of Truth Notes

1. Component implementation truth: `packages/components/src`.
2. CLI install surface truth: `packages/cli/src/utils/registry.ts`.
3. Docs discoverability truth: `apps/docs/content/components` + `apps/docs/src/lib/component-metadata.ts`.
4. Sync script exclusions are defined in `scripts/sync-templates.ts`.
