# Dinachi CLI Component Slugs

Use exact slugs with:

`<exec> @dinachi/cli@latest add <slug>`

`<exec>` depends on package manager. See `references/workflows.md`.

- `accordion` - category: Display - docs: yes
- `alert-dialog` - category: Overlay - docs: yes
- `autocomplete` - category: Form - docs: yes
- `avatar` - category: Display - docs: yes
- `badge` - category: Display - docs: yes
- `button` - category: Form - docs: yes
- `card` - category: Layout - docs: yes
- `checkbox` - category: Form - docs: yes
- `checkbox-group` - category: Form - docs: yes
- `collapsible` - category: Display - docs: yes
- `combobox` - category: Form - docs: yes
- `context-menu` - category: Overlay - docs: yes
- `dialog` - category: Overlay - docs: yes
- `drawer` - category: Overlay - docs: yes
- `field` - category: Form - docs: yes
- `fieldset` - category: Form - docs: yes
- `form` - category: Form - docs: yes
- `input` - category: Form - docs: yes
- `menu` - category: Overlay - docs: yes
- `menubar` - category: Navigation - docs: yes
- `meter` - category: Feedback - docs: yes
- `navigation-menu` - category: Navigation - docs: yes
- `number-field` - category: Form - docs: yes
- `popover` - category: Overlay - docs: yes
- `preview-card` - category: Overlay - docs: yes
- `progress` - category: Feedback - docs: yes
- `radio` - category: Form - docs: yes
- `scroll-area` - category: Layout - docs: yes
- `select` - category: Form - docs: yes
- `separator` - category: Layout - docs: yes
- `slider` - category: Form - docs: yes
- `switch` - category: Form - docs: yes
- `tabs` - category: Navigation - docs: yes
- `textarea` - category: Form - docs: no
- `toast` - category: Feedback - docs: yes
- `toggle` - category: Form - docs: yes
- `toggle-group` - category: Form - docs: yes
- `toolbar` - category: Layout - docs: yes
- `tooltip` - category: Overlay - docs: yes

Rules:

- Always prefer exact slug matches.
- Do not suggest `sidebar` for CLI installation.
- If user asks for non-slug names (for example "modal"), map through `references/intent-map.md` and confirm.
