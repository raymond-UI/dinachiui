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
3. Add the inventory entry in `packages/components/src/component-inventory.ts`:
   - `name`, `slug`, `category`, `documented`, and `added` for the "New" badge
   - this is what the docs sidebar, the components index, and `llms.txt` all read
4. Add CLI registry entry in `packages/cli/src/utils/registry.ts`:
   - files
   - dependencies
   - componentDependencies (if needed)
   - utilityDependencies
   - `tier: 'motion'` if it depends on `motion`; nothing derives the tier, and
     `inventory:check` fails when the tier and the dependencies disagree
5. Run `pnpm sync`.
6. Add docs page:
   - `apps/docs/content/components/<slug>.mdx`
   - a motion component also carries the tier callout, since `add --all` skips it
7. Add examples:
   - `apps/docs/src/components/examples/<slug>-examples.tsx`
   - wire examples into `apps/docs/src/lib/examples-registry.tsx`
8. Add the slug to the skill's own reference, which is not generated:
   - `skills/dinachi-assistant/references/components.registry.json`
   - `skills/dinachi-assistant/references/components.md`
   - `skills/dinachi-assistant/references/intent-map.md`, if a phrase should reach it
9. Validate:
   - `pnpm sync:check`
   - `pnpm inventory:check`
   - `pnpm deps:check`
   - `pnpm registry:check`
   - `node skills/dinachi-assistant/scripts/audit-skill.mjs`
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
3. Public component surface truth: `packages/components/src/component-inventory.ts`.
   `apps/docs/src/lib/component-metadata.ts` is derived from it — do not edit it by hand.
4. Docs page truth: `apps/docs/content/components`.
5. Sync script exclusions are defined in `scripts/sync-templates.ts`.
