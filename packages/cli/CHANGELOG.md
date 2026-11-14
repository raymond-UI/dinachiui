# Changelog

All notable changes to `@dinachi/cli` will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Agent**: `dinachi add agent` installs a bridge that lets an AI agent read and
  operate the page (`snapshot`, `query`, `act`), with an `allow` gate and
  WebMCP registration. Inside `AgentProvider`, Input, Select and Dialog register
  their state and actions directly; everything else is reached through the
  accessibility tree.
- **Agent**: Textarea, OTPField, NumberField, Slider, CompareSlider, Combobox,
  Autocomplete, Checkbox, CheckboxGroup, RadioGroup, Switch, Toggle and ToggleGroup
  register with the bridge. Each change goes through the component's own callback
  with details the app can cancel. Choices match by label, then by value.
- **Agent**: a control inside a Field reports the Field's error, and `in` names the
  Fieldset or Form around it. An agent's change to an Input is a real input event,
  so `onChange` and the Field's dirty and filled state see it.
- **Agent**: `data-agent-part` marks an element that belongs to a registered
  control, so it is not listed twice. `useAgentItem`, `agentChoicesOf` and
  `AgentGroupContext` let a group component register its items.
- **Agent**: a Slider or NumberField change by an agent also calls
  `onValueCommitted`, and lands on the step without float drift (`agentRound`).
  A refused change leaves Input and Textarea untouched, and a Combobox or
  Autocomplete the agent opened closes again.
- **Agent**: OTPField reports one redacted value, and a masked field is secret
  whatever its `autoComplete`.
- **Agent**: AlertDialog, Drawer, Popover, PreviewCard, Collapsible, Accordion,
  ExpandableCard, Menu, ContextMenu, Menubar and NavigationMenu register with the
  bridge, each as one control with `open` and `close`. Menu items take `press`, and
  `setChecked` when they can be checked. A popup with no title of its own goes by
  its trigger's name.
- **Agent**: Tabs, AnimatedTabs, Carousel (`goTo`), Sortable (`move`), SwipeableRow
  and HoldToConfirm register with the bridge. A HoldToConfirm press completes the
  hold at once and needs a person's approval by default. Plain links (`a[href]`)
  are listed as `link`, with their href as the value.
- **Agent**: progress bars and meters, including Progress, ProgressRing and Meter,
  are read with `value`, `min` and `max`. A Toast is listed as `toast` with its
  description and `type`, and `dismiss` presses its close button, which
  `data-agent-dismiss` marks. A high-priority toast is listed too, though Base UI
  hides it from assistive tech until focused.
- **Carousel**: `onIndexChange` also receives cancelable `details` with a `reason`,
  and a `disabled` prop turns off the drag, arrows and dots.
- **Sortable**: `onValueChange` also receives `details` with a `reason`, and a
  `disabled` prop turns off the handles. It stays controlled: refuse a move by not
  applying `next`.
- **SwipeableRow**: `onSelect` and `onDismiss` receive cancelable `details`, and an
  action can be `disabled`.
- **HoldToConfirm**: `onConfirm` receives `details`; `details.cancel()` unwinds
  the hold.
- **ExpandableCard**: `onOpenChange` also receives `details` with a `reason`, and
  `details.cancel()` keeps the card as it was.
- **Textarea**: `onValueChange(value, details)`, which an agent's change goes through.
- **CompareSlider**: a `disabled` prop. `onPositionChange` also receives `details`
  with a `reason`, and `details.cancel()` puts the divider back.
- **Agent**: `useAgentAction` exposes an app action (`inviteMember`, `archiveProject`)
  whose `input` is any Standard Schema that can describe itself as JSON Schema
  (zod 4.2+, arktype 2.1.28+, or valibot wrapped in `toStandardJsonSchema`).
  Pass `element` to tie it to a card or row, so the same action on many items has
  one target each. Each action is its own tool by default, in `agentToolsFor` and
  in WebMCP; `{ actions: "act" }` keeps them behind `act`. The bridge installs no
  packages.
- **Agent**: snapshots report where a control sits (`in`), whether it is required
  or invalid with its error text, number and slider bounds, and every choice of a
  closed Select. Dialogs come first, and an open modal hides the page behind it.
  Long values and lists are cut short and say so.
- **Agent**: `confirm` and `data-agent-confirm` mark a step that needs a person.
  Each entry's `approval` says whether the app will ask (`allow` is set) or only
  the person can do it. Presses inside an alert dialog need approval by default;
  `data-agent-confirm="none"` lifts it.
- **Agent**: `agent.subscribe` reports when app actions mount or unmount.
- `add --v1` installs a component as it was before agent registration, by
  running `@dinachi/cli@0.12.0`. It stays frozen there, is deprecated in 1.1 and
  removed in 1.2.
- **Docs**: an Agents guide, a Safety page and Recipes for Claude, OpenAI, the
  Vercel AI SDK and WebMCP. Each component that registers, or is read from the
  tree, says what the agent sees and can do on its own page.

### Changed

- **Input, Select, Dialog**: now depend on `agent` and install it alongside.
  Outside `AgentProvider` they behave as before and render nothing extra. Inside
  it, an agent can pick a Select choice by its label without opening it. `isAgentChange(details)` tells
  an agent's change from a person's in `onValueChange` and `onOpenChange`.
- **AlertDialog, Drawer, Popover, PreviewCard, Collapsible, Accordion,
  ExpandableCard, Menu, ContextMenu, Menubar, NavigationMenu, Tabs, AnimatedTabs,
  Carousel, Sortable, SwipeableRow, HoldToConfirm**: now depend on
  `agent` and install it alongside. Outside `AgentProvider` nothing changes.
- **Accordion, NavigationMenu**: an item with no `value` gets one from `useId`, so
  the id `onValueChange` reports for it differs from Base UI's generated one.
- **ContextMenu**: inside `AgentProvider`, a disabled menu marks its trigger area
  `data-disabled`.
- **AnimatedTabs**: `details.cancel()` in `onValueChange` now keeps the current tab
  when uncontrolled.
- **Agent**: a `data-agent-confirm` on an ancestor now overrides a control's own
  default approval, not only one on the element itself.
- **Agent**: text marked `aria-hidden` is left out of labels, so a decorative
  glyph does not join a control's name.
- **JSON Render**: installs zod `^4.3.6`, the version the workspace tests against.
- Templates can import other components; `add` rewrites
  `@/components/ui/<name>` to your configured `ui` alias.

### Fixed

- **Toast**: an action's `onClick` ran twice per click. Base UI's `Toast.Action`
  already applies `actionProps`, and the default list passed them again.

## [0.12.0] - 2026-10-09

### Added

- **Menu**: filtering. Wrap a menu in `MenuFilter`, add `MenuInput` (with
  `MenuClear` inside it) to the popup, and put the items in `MenuList`.
  `MenuEmpty` shows when nothing matches. A submenu takes its own
  `MenuFilter`. Also works in a Menubar menu. Filtering is a Base UI preview
  API and may change.
- **Avatar**: `keepMounted` on `AvatarImage` renders the image right away, for
  `next/image` and `loading="lazy"`. The fallback shows beneath it until the
  image loads, and stays if it fails.
- **Combobox**: `createComboboxItems` builds `items` from objects with
  `getValue` and `getLabel`, so selection uses IDs while the list renders the
  full objects.

### Changed

- `@base-ui/react` is now installed at `^1.9.0`, up from `^1.7.0`. It brings
  fixes across Drawer swipes, Dialog and Popover outside clicks, Field
  validation, and Select and Combobox `readOnly`.
- **Avatar**: the image and fallback are stacked in the same box, and the
  image uses `object-cover`, so a non-square source crops instead of
  stretching.
- **Collapsible**: with a native button, the trigger now gets the `disabled`
  attribute instead of `aria-disabled` (a Base UI 1.9 change).

## [0.11.0] - 2026-08-10

### Added

- **Motion tokens**: `dinachi init` now writes `--motion-ease-out`,
  `--motion-ease-in-out`, `--motion-ease-drawer`, `--motion-duration-fast` and
  `--motion-duration-base` into `:root`. Change a duration there and every
  installed component retimes together. Components inline the same values as
  `var()` fallbacks, so this is a tuning surface, not a requirement: a project
  that never runs `init` still animates correctly. Projects already on 0.10.0
  can copy the block out of `dinachi init` to get the same control.
- **Select**: a `positionMethod` prop, defaulting to the existing `"fixed"`.
  See the fix below for when to set `"absolute"`.

### Changed

- **Button**: presses now give way slightly, `scale(0.97)` going down in 100ms
  and back up in 150ms. The `link` variant is excluded.
- **Drawer**: a swipe dismissal now finishes at the speed it was thrown, and
  the backdrop dims with the finger instead of holding full strength until the
  drawer lets go.
- Popups, menus, tooltips and selects scale from their trigger rather than
  from their own centre. Dialogs stay centred.
- Every animated component now has a `prefers-reduced-motion` path. Movement
  is dropped, the fade that signals arrival is kept.

### Fixed

- **Select on Safari**: the dropdown could open far from its trigger when any
  ancestor had a `filter`, `backdrop-filter` or `transform`. Those make the
  ancestor the containing block for a fixed-positioned element, which the
  positioning library accounts for everywhere except WebKit. Pass
  `positionMethod="absolute"` if you hit this; it resolves against the nearest
  positioned ancestor, which no filter can move.
- Motion classes across nine components used Tailwind 4 only syntax, which
  emits no CSS at all on Tailwind 3 rather than erroring. Those animations
  never ran on a v3 project.
- **Autocomplete** and **Combobox**: the popup had no anchor width on
  Tailwind 3, so it did not match its input.
- Arbitrary transition lists now name `scale` alongside `transform`. Tailwind
  4 compiles `scale-*` into its own property, so the scale was silently
  excluded from the transition and snapped instead of animating.
- No component uses `ease-in` for an entrance any more.

## [0.10.0] - 2026-08-10

### Added

- **Motion tier**: nineteen opt-in animated components, installable
  individually like any other. `animated-icon`, `animated-list`,
  `animated-tabs`, `carousel`, `compare-slider`, `expandable-card`,
  `hold-to-confirm`, `load-transition`, `marquee`, `number-ticker`,
  `progress-ring`, `scroll-progress`, `scroll-reveal`, `sortable`,
  `stagger-list`, `streaming-text`, `swipeable-row`, `text-morph`,
  `text-shimmer`. They pull in `motion` as a dependency, and no core component
  depends on them, so nothing installs `motion` unless you ask for it. All of
  them respect `prefers-reduced-motion`.
- `dinachi add --motion` installs the whole motion tier, and with `--all`
  installs everything. Given component names it asks for their motion build,
  which today only the motion tier has, so `dinachi add button --motion`
  reports that no motion build exists rather than quietly installing the core
  one.
- `motion` is pinned at `^12.23.6` in the version map, so `dinachi add marquee`
  installs the version the components are tested against rather than whatever
  `latest` is that day.
- **A shadow scale in `dinachi init`**: `--shadow-2xs` through `--shadow-2xl`,
  mapped under `@theme inline` for Tailwind 4 and `boxShadow` for Tailwind 3.
  They are softer than Tailwind's defaults, which is what every component's
  `shadow-sm`, `shadow-md` and `shadow-lg` picks up.

### Changed

- `dinachi add --all` now installs the core tier only, not the motion tier.
  Bulk-installing everything should not quietly add an animation library to
  a project that never asked for one. Run `add --all --motion` for the
  previous behaviour.
- `--radius` is now `1.05rem`, up from `0.625rem`. `init` writes the theme
  once, so an existing project keeps its current value until you change it.
- Version-map pins: `@base-ui/react` from `^1.3.0` to `^1.7.0` for upstream
  a11y and form-integration fixes, and `tailwind-merge` from `^3.3.1` to
  `^3.5.0`.
- **Toast**: a wider corner radius, and a content row that keeps clear of the
  close button instead of running underneath it. `ToastViewportProps` is now
  exported, for typing a wrapper around the viewport.

### Fixed

- **Hold to Confirm**: `onConfirm` now reads from the end of the hold rather
  than the start, so a handler swapped mid-hold fires the current one. The
  progress ring also no longer clips against a filled track.
- **Animated Tabs**: the selected tab styles off `data-active`, the attribute
  Base UI actually sets. The previous `data-selected` selector matched
  nothing.
- **Dark theme**: `--destructive` sat at 1.18:1 against `--background`, so
  anything using it as a foreground was effectively invisible in dark mode:
  field error text, invalid input borders, destructive ghost buttons, Hold to
  Confirm. It is now `oklch(0.585 0.15 20.8317)`, which clears WCAG AA both as
  text on the background and under white. Projects that already ran
  `dinachi init` need to update the `.dark` block in their own `globals.css`.

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

[0.12.0]: https://github.com/raymond-UI/dinachiUI/releases/tag/cli-v0.12.0
[0.11.0]: https://github.com/raymond-UI/dinachiUI/releases/tag/cli-v0.11.0
[0.10.0]: https://github.com/raymond-UI/dinachiUI/releases/tag/cli-v0.10.0
[0.9.0]: https://github.com/raymond-UI/dinachiUI/releases/tag/cli-v0.9.0
