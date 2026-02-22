# Troubleshooting Playbook

## `No components.json found`

Cause:

- `init` has not been run in the target project.

Fix:

1. Run `<exec> @dinachi/cli@latest init`.
2. Re-run add command.

## Component not found

Cause:

- Invalid or non-existent slug.

Fix:

1. Match against `references/components.md`.
2. If request is intent-based, map via `references/intent-map.md`.
3. Use `scripts/suggest-components.mjs "<request>"` to propose slugs.

## Import path errors (`@/components/ui/...`)

Cause:

- Alias or target path mismatch in project config.

Fix:

1. Inspect `components.json` aliases.
2. Check generated component path under configured `aliases.ui`.
3. Re-run init if path aliases were moved/renamed.

## Styling/theme missing after init

Cause:

- CSS target file or Tailwind integration not aligned with project setup.

Fix:

1. Confirm `components.json.tailwind.css` points to active CSS entry file.
2. Confirm Tailwind setup is valid for current version.
3. Re-run init, then inspect CSS file for Dinachi token block.

## Add command skipped existing files

Cause:

- Existing component file and no overwrite option.

Fix:

1. Re-run with `--overwrite` if replacement is intended.
2. Otherwise merge manually and keep local customizations.

## Dependency install failed

Cause:

- Package manager/network/environment constraints.

Fix:

1. Re-run with `--skip-install`.
2. Install printed dependency list manually.
3. Re-run type-check.

## Tailwind plugin warnings

Cause:

- CLI could not safely patch Tailwind config/plugins.

Fix:

1. Add plugin manually (`tailwindcss-animate` for v3, `tw-animate-css` for v4).
2. Re-run add command.
