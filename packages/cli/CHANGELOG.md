# Changelog

All notable changes to `@dinachi/cli` will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.3] - 2026-05-27

### Added

- New `--info` / `--info-foreground` semantic color tokens, plus the missing
  `--chart-*` and `--sidebar-*` tokens, are now seeded into `globals.css`
  on `dinachi init` so theming covers every variant the components reference.

### Fixed

- **Badge**: `success`, `warning`, and `info` variants now use semantic tokens
  (`bg-success`, `bg-warning`, `bg-info`) instead of hardcoded
  `bg-green-500` / `bg-yellow-500` / `bg-blue-500`, so they theme correctly in
  light and dark mode and respect user palette overrides.
- **Select**: dropdown no longer renders behind `Drawer` or `Dialog` overlays,
  and sibling form controls (checkboxes, switches, other inputs) no longer
  paint on top of the open dropdown. Default `portal` is now `false`, and
  `z-50` lives on the `Positioner` (the `position: fixed` element) instead of
  the inner `Popup`. ([#29](https://github.com/raymond-UI/dinachiUI/issues/29))
- **Slider**: removed the static `z-10` from `SliderThumb`. Base UI manages
  thumb stacking dynamically (active = `z:2`, last-used = `z:1` in range
  sliders); the hardcoded class was floating idle thumbs above the dragging
  one and could conflict with surrounding page elements.

### Upgrading from 0.8.2

The `info` Badge variant now reads from a `--info` CSS variable. If you ran
`dinachi init` on an earlier version and add a Badge with `variant="info"`,
add the following to your `globals.css`:

```css
:root {
  --info: oklch(0.623 0.214 259.815);
  --info-foreground: oklch(1 0 0);
}

.dark {
  --info: oklch(0.707 0.165 254.624);
  --info-foreground: oklch(0.1324 0.0033 145.3864);
}

/* Tailwind 4: @theme inline */
@theme inline {
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
}
```

The Select and Slider changes are template-only — re-run `dinachi add select`
and `dinachi add slider` (or hand-apply the diffs) to pick them up.

## Earlier versions

See [git history](https://github.com/raymond-UI/dinachiUI/commits/main/packages/cli)
for changes prior to 0.8.3.

[0.8.3]: https://github.com/raymond-UI/dinachiUI/releases/tag/cli-v0.8.3
