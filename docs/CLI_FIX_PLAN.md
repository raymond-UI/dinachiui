# CLI Installation Fix Plan

## Issues Identified

### 🔴 Critical (Must Fix)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | User-provided paths ignored in `components.json` | `init.ts:99-106` | Components install to wrong location |
| 2 | `resolveAliasPath` picks first existing dir, ignores config | `add.ts:22-39` | Files go to `app/` instead of user path |
| 3 | Bun package manager not detected | `init.ts:144-148`, `add.ts:378-382` | Falls back to npm |
| 4 | No detection of `src/` vs `app/` vs root structure | `init.ts:159-234` | Wrong default paths suggested |

### 🟠 Configuration (Should Fix)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 5 | CSS path hardcoded as `src/app/globals.css` | `init.ts:184` | Invalid path in config |
| 6 | tailwind.config.ts vs .js mismatch | `init.ts:183`, `add.ts:60` | Config references wrong file |
| 7 | Empty directories left at user-specified paths | `init.ts:57-59` | Orphaned folders |

### 🟡 UX (Nice to Have)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 8 | Unnecessary "Install dependencies?" prompt | `init.ts:42-46` | Extra step |
| 9 | "core" terminology unexplained | `add.ts:340` | Confusing output |
| 10 | @/alias paths shown but actual paths differ | `add.ts:345-347` | Misleading feedback |

---

## Implementation Plan

### Phase 1: Core Path Resolution (Issues 1, 2, 4, 7)

**Goal**: User-specified paths are respected throughout the workflow.

1. **Detect project structure accurately**
   - Check for `src/` directory existence
   - Check for `app/` directory (Next.js App Router)
   - Determine appropriate defaults based on actual structure

2. **Save user paths to components.json**
   - Store actual user input in aliases
   - Convert relative paths to alias format correctly

3. **Fix resolveAliasPath**
   - Read paths from `components.json` config
   - Don't guess based on directory existence
   - Handle both `@/` prefixed and relative paths

4. **Remove duplicate directory creation**
   - Only create directories when actually installing files

### Phase 2: Package Manager & Config Detection (Issues 3, 5, 6)

**Goal**: Accurate detection of project tooling.

1. **Add Bun detection**
   - Check for `bun.lock` and `bun.lockb`
   - Use `bun add` command

2. **Detect actual tailwind config**
   - Check for `tailwind.config.ts` first
   - Fall back to `tailwind.config.js`
   - Use detected extension in components.json

3. **Detect actual CSS file**
   - Scan common locations for globals.css
   - Use actual path in config

### Phase 3: UX Improvements (Issues 8, 9, 10)

**Goal**: Cleaner, more accurate messaging.

1. **Auto-install dependencies** (remove prompt)
2. **Fix success messages** (remove "core" terminology)
3. **Show actual file paths** (not alias paths)

---

## File Changes

```
packages/cli/src/
├── commands/
│   ├── init.ts    # Major changes
│   └── add.ts     # Fix resolveAliasPath
└── utils/
    └── registry.ts # No changes needed
```

---

## Changes Made

### `packages/cli/src/commands/init.ts`
- ✅ Added accurate project structure detection (`src/` vs `app/` vs root)
- ✅ User-provided paths now saved to `components.json` aliases
- ✅ Added Bun package manager detection (`bun.lockb`, `bun.lock`)
- ✅ Detect actual `tailwind.config.{ts,js,mjs}` file
- ✅ Detect actual CSS file path from common locations
- ✅ Removed unnecessary "Install dependencies?" prompt
- ✅ Show actual paths in success message (not alias paths)

### `packages/cli/src/commands/add.ts`
- ✅ Simplified `resolveAliasPath` to use config directly
- ✅ Added Bun package manager detection
- ✅ Show actual file paths in output (not alias paths)
- ✅ Removed "core" from success message
- ✅ Pass tailwind config from components.json to `ensureTailwindConfig`

---

## Testing Checklist

After fixes, verify:

- [ ] `dinachi init` in Next.js project without `src/` suggests `./components/ui`
- [ ] `dinachi init` in Next.js project with `src/` suggests `./src/components/ui`
- [ ] User-specified paths are saved to `components.json`
- [ ] `dinachi add button` installs to configured path
- [ ] Bun projects use `bun add`
- [ ] No orphaned empty directories created
- [ ] Correct tailwind.config extension detected
- [ ] Correct CSS path detected

---

## How to Test

```bash
# 1. Build the CLI
cd packages/cli
pnpm build

# 2. Test in a fresh Next.js project (no src/)
cd /path/to/test-project
npx @dinachi/cli init
# Should suggest ./components/ui and ./lib

# 3. Add a component
npx @dinachi/cli add button
# Should install to the paths you specified

# 4. Verify components.json has correct aliases
cat components.json
```
