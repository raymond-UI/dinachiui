# Changelog

All notable changes to `@dinachi/cli` will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.0] - 2026-08-10

### Added

- **Motion tier**: nineteen opt-in animated components, installable
  individually like any other. `animated-icon`, `animated-list`,
  `animated-tabs`, `carousel`, `compare-slider`, `expandable-card`,
  `hold-to-confirm`, `load-transition`, `marquee`, `number-ticker`,
  `progress-ring`, `scroll-progress`, `scroll-reveal`, `sortable`,
  `stagger-list`, `streaming-text`, `swipeable-row`, `text-morph`,
  `text-shimmer`. They pull in `motion` as a dependency; no core component
  depends on them, so nothing installs `motion` unless you ask for it. Every
  one respects `prefers-reduced-motion`, and none of them animate a layout
  property: movement is transform and opacity, with `clip-path` where an edge
  has to be shared exactly and `background-position` for the shimmer sweep.
- `dinachi add --motion` on its own installs the whole motion tier, and
  combined with `--all` it installs everything. Given component names it asks
  for their motion build, which today only the motion tier has, so
  `dinachi add button --motion` reports that no motion build exists rather
  than quietly installing the core one.
- `motion` is now pinned at `^12.23.6` in the version map, so
  `dinachi add marquee` installs the version the components are tested
  against rather than whatever `latest` is that day.
- **A shadow scale in `dinachi init`.** `--shadow-2xs` through `--shadow-2xl`
  are written into the theme, mapped under `@theme inline` for Tailwind 4 and
  under `boxShadow` for Tailwind 3. They are softer and tighter than
  Tailwind's defaults, which every component's `shadow-sm`, `shadow-md` and
  `shadow-lg` then picks up. Without them the popovers and dialogs you install
  are shadowed harder than the same components on the docs site.

### Changed

- `dinachi add --all` now installs the core tier only, not the motion tier.
  Bulk-installing everything should not quietly add an animation library to
  a project that never asked for one. Run `add --all --motion` for the
  previous behaviour.
- `--radius` is now `1.05rem`, up from `0.625rem`, which is what the docs site
  has been rendering at all along. `init` writes the theme once, so an
  existing project keeps its current value until you change it yourself.
- Version-map pins: `@base-ui/react` from `^1.3.0` to `^1.7.0` for upstream
  a11y and form-integration fixes, and `tailwind-merge` from `^3.3.1` to
  `^3.5.0`.
- **Toast** takes the card treatment built for the stacked variant: a wider
  corner radius, and a content row that keeps clear of the close button
  instead of running underneath it. `ToastViewportProps` is now exported, for
  typing a wrapper around the viewport. The stacked build itself is not
  shipped; the two implementations proved close enough that the refined
  surface was folded back into the single component.

### Fixed

- **Hold to Confirm**: `onConfirm` now reads from the end of the hold rather
  than the start, so a handler swapped mid-hold fires the current one. The
  progress ring also no longer clips against a filled track.
- **Animated Tabs**: the selected tab styles off `data-active`, the attribute
  Base UI actually sets. The previous `data-selected` selector matched
  nothing.
- **Dark theme**: `--destructive` was `oklch(0.2258 0.0524 12.6119)`, a surface
  tint sitting at 1.18:1 against `--background`. Anything using it as a
  foreground, including field error text, invalid input borders, destructive
  ghost buttons and Hold to Confirm, was effectively invisible in dark mode.
  It is now `oklch(0.585 0.15 20.8317)`: 4.51:1 as text on the background and
  4.52:1 under white, so both roles clear WCAG AA. Projects that already ran
  `dinachi init` need to update the `.dark` block in their own `globals.css`.
- **Toast**: dropped the action button's `group-[.destructive]` styles. They
  keyed off a literal `.destructive` class the variant does not emit, so they
  had never applied.

## [0.9.0] - 2026-05-27

First release with a CHANGELOG. Covers everything shipped since the last
npm-published version, `0.8.2`.

### Added

- **OTP Field** component — a one-time password / verification code input
  built on Base UI 1.4.0+'s preview `OTPField` primitive. Supports
  auto-advance, paste handling, validation modes (numeric / alphanumeric /
  alphabetic), masking, separators, and form integration. Install with
  `dinachi add otp-field`.
- New `--info` / `--info-foreground` semantic color tokens, plus the missing
  `--chart-*` and `--sidebar-*` tokens, are now seeded into `globals.css`
  on `dinachi init` so theming covers every variant the components reference.

### Changed

- Bumped `@base-ui/react` peer / template dependency from `1.3.0` to `1.5.0`
  to pick up the new OTPField primitive plus upstream a11y, autocomplete,
  combobox, dialog, and form-integration fixes from the 1.4.x and 1.5.x
  release lines.

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

**Combobox**: Base UI 1.5.0 narrowed `Combobox.Label` to only label
`Combobox.Trigger`. If you currently pair `<ComboboxLabel>` with
`<ComboboxInput>` (input as the form control), switch to a native
`<label htmlFor>` or `<Field.Label>` to avoid the dev-mode warning.
`<ComboboxLabel>` is still correct for Trigger-driven (Select-style)
Comboboxes.

Re-run `dinachi add select`, `dinachi add slider`, and `dinachi add otp-field`
(or hand-apply the diffs) to pick everything up, and bump `@base-ui/react` to
`1.5.0` in your project to match the templates.

## Earlier versions

See [git history](https://github.com/raymond-UI/dinachiUI/commits/main/packages/cli)
for changes prior to 0.9.0.

[0.10.0]: https://github.com/raymond-UI/dinachiUI/releases/tag/cli-v0.10.0
[0.9.0]: https://github.com/raymond-UI/dinachiUI/releases/tag/cli-v0.9.0
