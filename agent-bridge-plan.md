# Agent bridge: plan for the full component set

The bridge lets an AI agent read and operate a page built with Dinachi. A component inside
`AgentProvider` registers its state and actions with the bridge directly; anything else is
reached through the accessibility tree. It stays copy-paste: no SDK, no runtime package.

Nothing ships until every component in scope below is done, tested and documented. The
release is **1.0**.

Status today (branch `feat/agent-bridge`, uncommitted): the bridge, app actions, tool modes,
approval reporting, and Input, Select and Dialog registered. 31 agent tests, 626 in all.

---

## 1. Settled decisions

| # | Decision |
|---|---|
| 1 | Components are grouped into value controls, open/close, navigation and arrangement, read-only, and out of scope (section 2). |
| 2 | The action vocabulary is public API. It is fixed before building (section 3). |
| 3 | Snapshots report validation errors, required, invalid, min/max/step and multiple values. |
| 4 | A closed Select lists its choices, read from `items` and from element labels, and from the mounted list inside `AgentProvider` when there is no `items`. |
| 5 | The snapshot stays a flat list. Each control names its container in `in`. |
| 6 | 100 controls per snapshot, open dialogs and popovers first. Choices capped at 50, text values at 500 characters, with what was cut stated. |
| 7 | App action input is any Standard Schema that also implements Standard JSON Schema. valibot is dropped as a dependency. |
| 8 | AlertDialog presses and HoldToConfirm need a person's approval by default. |
| 9 | An app action attached to the button that does the same thing gates that button's press too. |
| 10 | Page text is marked untrusted, and the safety docs cover prompt injection. |
| 11 | Outside `AgentProvider` nothing changes. A shared test enforces it, and the bridge has a size budget. |
| 12 | Testing: a shared conformance suite, a repo check, and a live model run before each release. |
| 13 | `--v1` is frozen at CLI 0.12.0 for one minor release after 1.0, then removed. |
| 14 | WebMCP gets one tool per app action, kept in step as actions mount and unmount. |
| 15 | One tool per app action is the default for `agentToolsFor`. `{ actions: "act" }` keeps them in the snapshot. |
| 16 | A confirm step reports `approval: "ask"` when the app has `allow`, `"person"` when it does not. |

---

## 2. Coverage

**Kind** is what the snapshot calls the control. Kinds describe how a control is operated,
not which component it is, so a model learns a dozen of them rather than forty components.

### Value controls

| Component | Kind | State reported | Actions |
|---|---|---|---|
| Input | `input` | value, required, invalid, errors, secret | `setValue`, `clear` |
| Textarea | `textarea` | same as Input | `setValue`, `clear` |
| OTPField | `input` | value, length | `setValue`, `clear` |
| NumberField | `number` | value, min, max, step | `setValue`, `increment`, `decrement` |
| Slider | `slider` | value (number or `[low, high]`), min, max, step | `setValue` |
| CompareSlider | `slider` | position 0 to 100 | `setValue` |
| Select | `select` | value, items, multiple, open | `select`, `setValue` (multiple), `open`, `close` |
| Combobox | `combobox` | value, input text, items, multiple, open | `select`, `setValue` (multiple), `search`, `open`, `close` |
| Autocomplete | `combobox` | input text, items | `setValue`, `search` |
| Checkbox | `checkbox` | checked, indeterminate | `toggle`, `setChecked` |
| CheckboxGroup | `checkbox-group` | value (checked labels), items | `setValue` |
| Radio (RadioGroup) | `radio-group` | value, items | `select` |
| Switch | `switch` | checked | `toggle`, `setChecked` |
| Toggle | `toggle` | pressed | `toggle`, `setChecked` |
| ToggleGroup | `toggle-group` | value, items, multiple | `select`, `setValue` (multiple) |

### Open and close

| Component | Kind | State reported | Actions |
|---|---|---|---|
| Dialog | `dialog` | open, title | `open` (on trigger), `close` |
| AlertDialog | `dialog` | open, title; presses inside need approval | `open`, `close` |
| Drawer | `dialog` | open, title | `open`, `close` |
| Popover | `popover` | open, title | `open`, `close` |
| PreviewCard | `popover` | open | `open`, `close` |
| Collapsible | `disclosure` | open | `open`, `close` |
| Accordion | `disclosure`, one per item | open | `open`, `close` |
| ExpandableCard | `disclosure` | open | `open`, `close` |
| Menu, ContextMenu, Menubar | `menu` | open; items appear as `menuitem` | `open`, `close`; items: `press`, `setChecked` |
| NavigationMenu | `menu` | open; links appear as `link` | `open`, `close` |

### Navigation and arrangement

| Component | Kind | State reported | Actions |
|---|---|---|---|
| Tabs, AnimatedTabs | `tabs` | value, items | `select` |
| Carousel | `carousel` | value ("2 of 5: label"), items | `goTo` |
| Sortable | `list` | items in order | `move` |
| SwipeableRow | `region` | its hidden actions appear as buttons | `press` on those |
| HoldToConfirm | `button` | needs approval by default | `press` (completes the hold) |
| Link | `link` | href | `press` |

### Read-only

| Component | Kind | State reported | Actions |
|---|---|---|---|
| Progress, ProgressRing | `progress` | value, max, label | none |
| Meter | `meter` | value, min, max | none |
| Toast | `toast` | title, description, type | `dismiss`; its buttons as `press` |

### Out of scope

Text, Label, Badge, Avatar, Card, Separator, Skeleton, ScrollArea, Tooltip (its text joins
the trigger's description), Marquee, TextShimmer, NumberTicker, TextMorph, StreamingText,
AnimatedIcon, AnimatedList, StaggerList, ScrollReveal, ScrollProgress, LoadTransition.
Button needs no registration: the accessibility-tree fallback already reports it.

### Containers

Field, Fieldset and Form do not appear as controls. Field supplies its control's label,
required, invalid and errors. Form and Fieldset supply `in`. Toolbar is transparent.

---

## 3. Action vocabulary

Fixed and public. A component may support a subset, never a different meaning.

| Action | Args | Meaning |
|---|---|---|
| `setValue` | `value` | Replace the whole value. Text for inputs, a number for NumberField and Slider, `[low, high]` for a range, an array of labels for anything multiple. |
| `clear` | none | Empty a text value. |
| `select` | `choice` | Choose one item, matched by label, then by value. On a multiple control it adds the item. |
| `toggle` | none | Flip checked or pressed. |
| `setChecked` | `boolean` | Set checked or pressed. Prefer this over `toggle`: it is safe to retry. |
| `increment`, `decrement` | `steps?` | Step a NumberField. |
| `search` | `text` | Type into a Combobox or Autocomplete and return the matching items. |
| `open`, `close` | none | Open or close a popup, dialog, menu or disclosure. |
| `press` | none | Press a button, link or menu item. |
| `goTo` | `slide` | Go to a slide by label or 1-based number. |
| `move` | `item`, `position` | Move a list item to a 1-based position. |
| `dismiss` | none | Dismiss a toast. |

Rules:

- Choices are matched by visible label first, then by value. A miss returns the valid
  choices in the error, which today's live run showed the model uses.
- Positions are 1-based, the way a person counts.
- Every action that sets a final state (`setValue`, `setChecked`, `select` on a single
  control, `goTo`, `move`) is safe to retry. `toggle` is kept because people say "toggle".
- An unsupported action fails with the actions the control does support.

---

## 4. Snapshot

```ts
interface AgentComponent {
  ref: string
  component: AgentComponentKind
  label: string
  actions: string[]
  in?: string            // "Delete this project?", "Billing form", "Hermes"
  value?: string | number | (string | number)[]
  checked?: boolean | "mixed"
  open?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  errors?: string[]
  min?: number
  max?: number
  step?: number
  multiple?: boolean
  items?: string[]
  more?: number          // items not listed
  truncated?: true       // value cut at 500 characters
  confirm?: string
  approval?: "ask" | "person"
}
```

- **Order:** open dialogs, then open popovers and menus, then the page in document order.
- **Modal rule:** while a modal dialog is open, controls behind it are left out.
- **Limits:** 100 controls, then a final entry saying how many more and to use `query`. 50
  choices per control, with `more`. Text values cut at 500 characters, with `truncated`.
- **Secrets:** password and `secret` fields report no value, only whether one is set.
- **Refs:** stable for the life of an element, so a ref from one snapshot works in the next.

---

## 5. Telling agent changes from a person's

Every change an agent makes goes through the component's own `onValueChange` or
`onOpenChange`, so the app can refuse it, and `isAgentChange(details)` reports who made it.

Components whose callbacks have no details argument gain one. This is additive, so
existing handlers keep working:

| Component | Callback today | After |
|---|---|---|
| Sortable | `onValueChange(next)` | `onValueChange(next, details)` |
| Carousel | `onIndexChange(index)` | `onIndexChange(index, details)` |
| CompareSlider | `onPositionChange(position)` | `onPositionChange(position, details)` |
| ExpandableCard | `onOpenChange(open)` | `onOpenChange(open, details)` |
| SwipeableRow | `onSelect()`, `onDismiss()` | each gains `details` |
| HoldToConfirm | completion callback | gains `details` |

`details.cancel()` works on all of them, matching Base UI.

---

## 6. App actions

- `input` takes `StandardSchemaV1 & StandardJSONSchemaV1`. The spec's types are copied into
  `agent.tsx`, so the file has no dependency. Measured: the bridge's schema code drops from
  3.7 KB to 0.3 KB gzip; a valibot app's total is unchanged.
  - zod 4.2+ and arktype 2.1.28+: pass the schema as is.
  - valibot: `toStandardJsonSchema(schema)` from `@valibot/to-json-schema` 1.5+.
  - zod/mini: `z.toJSONSchema(schema)`, with a locale configured for readable errors.
- A bare schema without JSON Schema support fails at registration, with a message naming
  the wrapper for each library.
- JSON Schema comes from `jsonSchema.input({ target: "draft-07" })`, with `$schema` removed.
  If conversion throws, the tool takes any object and validation still runs.
- Validation is always awaited. Errors are `path: message`, without assuming the library's
  wording.
- An action attached to a button merges into the button's entry, and a `confirm` on the
  action gates the button's `press` as well. Docs show this as the way to offer an action
  that already has a button.
- `useAgentAction` is unchanged otherwise: `name`, `description`, `input`, `confirm`,
  `disabled`, `element`, `run`.

---

## 7. Safety

- `allow` approves or refuses every step. Without it, any `confirm` step is refused, and
  the snapshot says so with `approval: "person"`.
- Needs approval by default: any press inside an AlertDialog (closing it does not), and
  HoldToConfirm. An app lifts it with `data-agent-confirm="none"` on the element.
- Page text is untrusted. Tool descriptions say so, WebMCP marks it with
  `untrustedContentHint`, and the safety docs explain prompt injection and why `allow` is
  the real guard.
- `data-agent-hidden` keeps a subtree out of the snapshot entirely.

---

## 8. WebMCP

- One tool per app action, registered when the action mounts and removed when it
  unmounts. This needs a change signal from the bridge: `agent.subscribe(listener)`, fired
  when the set of actions changes.
- The WebMCP `allow` still runs after the app's own for every step.
- Tool names stay stable while an action is on the page, so a browser agent mid-task does
  not lose them.

---

## 9. Outside `AgentProvider`

- Same rendered markup, same callbacks with the same arguments, no extra renders.
- Enforced by one shared test that every participating component runs.
- Size budget: 9 KB gzip for `agent.tsx` (7.7 KB after phase 0) and 1.5 KB of agent code
  per component, both checked by `agent:check`. A component's agent code is its minified,
  gzipped bundle less its size before the refit, recorded in the script's `BEFORE` table.

---

## 10. Testing

**Conformance suite.** `src/test/agent-conformance.tsx` exports one function each
participating component calls with a fixture. It checks:

1. The snapshot entry: kind, label, value, state fields and actions.
2. Each action, by label and by ref, and that an invalid choice lists the valid ones.
3. The change reaches `onValueChange` or `onOpenChange` with `isAgentChange` true, and a
   person's change reports false.
4. `details.cancel()` refuses the change, and the agent is told.
5. Disabled controls refuse every action.
6. `confirm` and `allow` hold the step, and `approval` is right.
7. Outside `AgentProvider`: no agent markup, no callbacks and the same commit count as the
   bare Base UI parts. A fixture states that count as `commits` when it is not 1 (Select
   commits 4 times on mount without any of our code).

**Repo check.** `pnpm agent:check`: every component marked as participating in
`component-inventory.ts` calls `useAgentControl`, depends on `agent` in the registry, and
runs the conformance suite. Joins `release:verify`.

**Live run.** `packages/components/agent-eval/` holds a page per group and a list of
requests with the expected final state. `pnpm agent:eval` runs them against
`claude-sonnet-5-5` (`AGENT_EVAL_MODEL` overrides) in jsdom, records model calls, tokens,
tool calls and pass state in `last-run.json`, and prints each case against the previous
run. It lives in the components package because the root has no React or vitest. It skips
without `ANTHROPIC_API_KEY`. Run before each release.

---

## 11. CLI, docs and release

- **Registry:** every participating component gets `componentDependencies: ['agent']`.
  `agent` itself has no npm dependencies after section 6.
- **`--v1`:** installs from CLI 0.12.0. Deprecated in the 1.1 changelog, removed in 1.2.
- **Docs:**
  - An agent guide: what the bridge is, `AgentProvider`, `useAgent`, snapshot, actions,
    approval, app actions.
  - A safety page: `allow`, `confirm`, approval, prompt injection, the button gate.
  - Recipes: Claude, OpenAI, Vercel AI SDK, WebMCP.
  - An "Agent" section on each component page: kind, state, actions, an example.
- **Release:** 1.0 with a changelog entry per group and a migration note for valibot users
  of the prototype (none outside this branch).

---

## 12. Build order

Each phase ends with the conformance suite passing for what it touched, `inventory:check`,
`registry:check`, `deps:check`, `sync:check`, `parity:check`, and type-checks.

**Phase 0: the core.** Everything later builds on these.
1. Kinds and action vocabulary in `agent.tsx` types.
2. Snapshot format: `in`, modal rule, ordering, limits, new state fields.
3. Standard Schema for app actions; drop valibot.
4. Button gating for attached actions.
5. `agent.subscribe` and WebMCP per-action tools.
6. Conformance suite, `agent:check`, size check, live-run harness.
7. Refit Input, Select and Dialog to the final format, including the closed-Select fix.

**Phase 1: value controls.** Textarea, OTPField, NumberField, Slider, CompareSlider,
Combobox, Autocomplete, Checkbox, CheckboxGroup, Radio, Switch, Toggle, ToggleGroup.
Field, Fieldset and Form as containers.

**Phase 2: open and close.** AlertDialog, Drawer, Popover, PreviewCard, Collapsible,
Accordion, ExpandableCard, Menu, ContextMenu, Menubar, NavigationMenu.

**Phase 3: navigation and arrangement.** Tabs, AnimatedTabs, Carousel, Sortable,
SwipeableRow, HoldToConfirm, Link.

**Phase 4: read-only.** Progress, ProgressRing, Meter, Toast.

**Phase 5: ship.** Docs, recipes, live run across every group, changelog, 1.0.

### Settled in phase 1

- **Group items:** RadioGroup, ToggleGroup and CheckboxGroup collect their items through
  `useAgentItem` and name them with `agentChoicesOf`. CheckboxGroup shares
  `AgentGroupContext` with its checkboxes, so a checkbox the agent checks changes the
  group's value. Item elements that are real buttons or inputs carry `data-agent-part`.
- **Combobox:** no hidden catalog. Choices come from the `items` prop, or from the open
  list. The input text is not reported; `search` returns what matches.
- **OTPField:** secret by default, as its `one-time-code` autocomplete is. Reports `length`.
- **CompareSlider:** gained `disabled`, and its `onPositionChange` gained cancelable details.

### Settled at the start of phase 0

- **Lifting a default approval:** `data-agent-confirm="none"` on an element, or an ancestor
  closer than the default, means no approval. Any other value is the reason shown.
- **Autocomplete:** no `select`. It holds text, not a choice, so `setValue` covers picking
  a suggestion, and `search` lists them.
- **Menubar:** each menu's trigger is a `menu` entry with `in` set to the menubar's label.
  Its items get `in` set to the trigger's label.
- **`search`:** returns the matching items as its step `result`, so the model needs no
  extra snapshot.
- **Per-component budget:** 1.5 KB gzip of agent code per component, measured as the
  component's bundle inside and outside the agent registration.
- **Field errors:** Base UI's `FieldError` is a plain div referenced by
  `aria-describedby`, beside the description. The snapshot reads errors from
  `aria-errormessage` and from described-by elements marked `data-agent-error`, which
  Field's error part adds in phase 1.
