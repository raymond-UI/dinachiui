# Setup: installing through the CLI

1. **`init` picks npm inside a pnpm monorepo.** Lockfile detection only looks in the
   current directory, so an app under `apps/` with the lockfile at the repo root falls
   back to npm, which then fails on `workspace:*`. It should walk up to the nearest
   lockfile, `pnpm-workspace.yaml`, or `packageManager` field, or read
   `npm_config_user_agent`.
2. **`add -y` still prompts.** Adding a component whose shared file (`agent.tsx`) is
   already installed asks "Overwrite?" even with `-y`, so scripted or agent-driven runs
   hang. `-y` should keep the existing file and say so; `--overwrite` replaces it.
3. **No dark variant on Tailwind 4.** `init` writes `.dark { ... }` tokens but no
   `@custom-variant dark (&:where(.dark, .dark *));`, so `dark:` classes in
   `input`, `date-picker` and `date-range-picker` follow the OS while every token
   follows the `.dark` class.
4. Templates type-check cleanly in a fresh Next 16 + Tailwind 4 app.
