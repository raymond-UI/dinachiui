# Dinachi CLI Component Slugs

Use exact slugs with:

`<exec> @dinachi/cli@latest add <slug>`

`<exec>` depends on package manager. See `references/workflows.md`.

Components come in two tiers. `add --all` takes the core tier; the motion tier depends on
`motion` and is taken with `add --motion`. Naming a motion slug installs it on its own
either way.

- `accordion` - category: Display - tier: core - docs: yes
- `alert-dialog` - category: Overlay - tier: core - docs: yes
- `animated-icon` - category: Motion - tier: motion - docs: yes
- `animated-list` - category: Motion - tier: motion - docs: yes
- `animated-tabs` - category: Motion - tier: motion - docs: yes
- `autocomplete` - category: Form - tier: core - docs: yes
- `avatar` - category: Display - tier: core - docs: yes
- `badge` - category: Display - tier: core - docs: yes
- `button` - category: Form - tier: core - docs: yes
- `card` - category: Layout - tier: core - docs: yes
- `carousel` - category: Motion - tier: motion - docs: yes
- `checkbox` - category: Form - tier: core - docs: yes
- `checkbox-group` - category: Form - tier: core - docs: yes
- `collapsible` - category: Display - tier: core - docs: yes
- `combobox` - category: Form - tier: core - docs: yes
- `compare-slider` - category: Motion - tier: motion - docs: yes
- `context-menu` - category: Overlay - tier: core - docs: yes
- `dialog` - category: Overlay - tier: core - docs: yes
- `drawer` - category: Overlay - tier: core - docs: yes
- `expandable-card` - category: Motion - tier: motion - docs: yes
- `field` - category: Form - tier: core - docs: yes
- `fieldset` - category: Form - tier: core - docs: yes
- `form` - category: Form - tier: core - docs: yes
- `hold-to-confirm` - category: Motion - tier: motion - docs: yes
- `input` - category: Form - tier: core - docs: yes
- `json-render` - category: Layout - tier: core - docs: no
- `label` - category: Form - tier: core - docs: yes
- `link` - category: Navigation - tier: core - docs: yes
- `load-transition` - category: Motion - tier: motion - docs: yes
- `marquee` - category: Motion - tier: motion - docs: yes
- `menu` - category: Overlay - tier: core - docs: yes
- `menubar` - category: Navigation - tier: core - docs: yes
- `meter` - category: Feedback - tier: core - docs: yes
- `navigation-menu` - category: Navigation - tier: core - docs: yes
- `number-field` - category: Form - tier: core - docs: yes
- `number-ticker` - category: Motion - tier: motion - docs: yes
- `otp-field` - category: Form - tier: core - docs: yes
- `popover` - category: Overlay - tier: core - docs: yes
- `preview-card` - category: Overlay - tier: core - docs: yes
- `progress` - category: Feedback - tier: core - docs: yes
- `progress-ring` - category: Motion - tier: motion - docs: yes
- `radio` - category: Form - tier: core - docs: yes
- `scroll-area` - category: Layout - tier: core - docs: yes
- `scroll-progress` - category: Motion - tier: motion - docs: yes
- `scroll-reveal` - category: Motion - tier: motion - docs: yes
- `select` - category: Form - tier: core - docs: yes
- `separator` - category: Layout - tier: core - docs: yes
- `skeleton` - category: Feedback - tier: core - docs: yes
- `slider` - category: Form - tier: core - docs: yes
- `sortable` - category: Motion - tier: motion - docs: yes
- `stagger-list` - category: Motion - tier: motion - docs: yes
- `streaming-text` - category: Motion - tier: motion - docs: yes
- `swipeable-row` - category: Motion - tier: motion - docs: yes
- `switch` - category: Form - tier: core - docs: yes
- `tabs` - category: Navigation - tier: core - docs: yes
- `text` - category: Display - tier: core - docs: yes
- `text-morph` - category: Motion - tier: motion - docs: yes
- `text-shimmer` - category: Motion - tier: motion - docs: yes
- `textarea` - category: Form - tier: core - docs: yes
- `toast` - category: Feedback - tier: core - docs: yes
- `toggle` - category: Form - tier: core - docs: yes
- `toggle-group` - category: Form - tier: core - docs: yes
- `toolbar` - category: Layout - tier: core - docs: yes
- `tooltip` - category: Overlay - tier: core - docs: yes

Rules:

- Always prefer exact slug matches.
- Do not suggest `sidebar` for CLI installation.
- A plan mixing tiers still installs from one command per tier, or names each slug.
- If user asks for non-slug names (for example "modal"), map through `references/intent-map.md` and confirm.
