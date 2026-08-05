# Intent Map

Use this when user requests behavior rather than explicit component names.

Format:

- `<intent phrase>`: `<primary component>, <secondary component>, ...`

A phrase only reaches a component when the request contains it word for word, so an intent
that people say several ways is listed under each of them.

- `modal`: `dialog, alert-dialog`
- `confirmation modal`: `alert-dialog, dialog`
- `side panel`: `drawer, dialog`
- `dropdown`: `select, menu`
- `searchable dropdown`: `combobox, autocomplete, select`
- `command palette`: `dialog, combobox`
- `context actions`: `context-menu, menu`
- `hover help`: `tooltip, popover`
- `hover preview`: `preview-card, popover`
- `navigation bar`: `navigation-menu, menubar, tabs`
- `stepper input`: `number-field, input`
- `single choice`: `radio, select`
- `multiple choice`: `checkbox-group, checkbox`
- `toggle setting`: `switch, toggle`
- `progress status`: `progress, meter`
- `toast notification`: `toast, alert-dialog`
- `form validation`: `form, field, fieldset, input`
- `scroll container`: `scroll-area`
- `divider`: `separator`
- `toolbar actions`: `toolbar, toggle-group, button`
- `collapsible section`: `accordion, collapsible`
- `loading placeholder`: `skeleton, progress`
- `verification code`: `otp-field, input`
- `heading or body text`: `text`

Motion tier. Every component below depends on `motion` and sits outside `add --all`:

- `animated tabs`: `animated-tabs, tabs`
- `sliding indicator`: `animated-tabs, tabs`
- `before and after`: `compare-slider`
- `image comparison`: `compare-slider`
- `hold to confirm`: `hold-to-confirm, alert-dialog`
- `press and hold`: `hold-to-confirm, alert-dialog`
- `scrolling logos`: `marquee`
- `logo strip`: `marquee`
- `ticker`: `marquee, number-ticker`
- `count up`: `number-ticker`
- `animated number`: `number-ticker`
- `reading progress`: `scroll-progress, progress`
- `scroll indicator`: `scroll-progress, progress`
- `reveal on scroll`: `scroll-reveal`
- `fade in on scroll`: `scroll-reveal`
- `stagger`: `stagger-list`
- `one after another`: `stagger-list`
- `swap text`: `text-morph`
- `morphing text`: `text-morph`
- `shimmer`: `text-shimmer, skeleton`

Resolution rules:

1. Prefer the first component for minimal setups.
2. Suggest secondary components when the request includes advanced interaction.
3. If uncertainty remains, confirm before generating add commands.
4. A motion suggestion carries its cost: say that it adds the `motion` dependency, and
   offer the non-motion secondary where one is listed.
