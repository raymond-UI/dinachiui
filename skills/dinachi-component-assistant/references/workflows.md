# Command Workflows

## Package Manager Command Matrix

Use the correct exec prefix for `@dinachi/cli@latest`:

- npm: `npx @dinachi/cli@latest <command>`
- pnpm: `pnpm dlx @dinachi/cli@latest <command>`
- yarn: `npx @dinachi/cli@latest <command>`
- bun: `bunx @dinachi/cli@latest <command>`

Examples:

- init: `<exec> init`
- add one: `<exec> add button`
- add many: `<exec> add button input card`
- add all: `<exec> add --all`

## CLI Options

- `init --skip-install`: create config/files without package install
- `add --skip-install`: copy files without package install
- `add --overwrite`: replace existing component files
- `add --yes`: skip overwrite confirmation prompts
- `add --all`: install all registry components

## Integration Sequence

1. Verify project root contains `package.json`.
2. If `components.json` missing, run init.
3. Run add with one or more exact component slugs.
4. Return import snippet using `@/components/ui/<slug>`.
5. Validate expected files and dependencies.

## Verification Commands

- Check config exists: `test -f components.json && echo ok`
- Check component file exists: `test -f src/components/ui/<slug>.tsx && echo ok`
- Check addable commands:
  - npm: `npx @dinachi/cli@latest add <slug> --skip-install`
  - pnpm: `pnpm dlx @dinachi/cli@latest add <slug> --skip-install`
  - yarn: `npx @dinachi/cli@latest add <slug> --skip-install`
  - bun: `bunx @dinachi/cli@latest add <slug> --skip-install`

## Monorepo Verification

When changing Dinachi internals:

1. `pnpm sync:check`
2. `pnpm --filter @dinachi/components type-check`
3. `pnpm --filter @dinachi/components test -- --run`
4. `pnpm --filter @dinachi/components build`
