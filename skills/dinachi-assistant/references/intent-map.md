# Intent Map

Use this when user requests behavior rather than explicit component names.

Format:

- `<intent phrase>`: `<primary component>, <secondary component>, ...`

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

Resolution rules:

1. Prefer the first component for minimal setups.
2. Suggest secondary components when the request includes advanced interaction.
3. If uncertainty remains, confirm before generating add commands.
