import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "toolbar",
  description: "A row of controls with one tab stop and arrow-key focus.",
  usage: `import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from "@/components/ui/toolbar"

export function FormatBar() {
  return (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup>
        <ToolbarButton>Bold</ToolbarButton>
        <ToolbarButton>Italic</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton>Clear</ToolbarButton>
    </Toolbar>
  )
}`,
  anatomy: `<Toolbar>
  <ToolbarGroup>
    <ToolbarButton />
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarLink />
  <ToolbarInput />
</Toolbar>`,

  examples: ["toolbar-default", "toolbar-toggles", "toolbar-input", "toolbar-vertical"],

  parts: [
    {
      name: "Toolbar",
      summary: "The container. Also `ToolbarRoot`, `Toolbar.Button`, etc.",
      props: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Which arrow keys move focus." },
        { name: "loopFocus", type: "boolean", default: "true", description: "Wraps focus from the last item to the first." },
        { name: "disabled", type: "boolean", default: "false", description: "Disables every item." },
      ],
    },
    {
      name: "ToolbarButton",
      summary: "A button item; `render` swaps the control.",
      props: [
        { name: "render", type: "ReactElement", description: "Swap the element, keep toolbar focus, for example a Toggle or menu trigger." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the button." },
        { name: "focusableWhenDisabled", type: "boolean", default: "true", description: "Keeps a disabled button reachable with the arrow keys." },
      ],
    },
    {
      name: "ToolbarLink",
      summary: "A link item.",
      props: [{ name: "href", type: "string", description: "Where the link goes." }],
    },
    {
      name: "ToolbarInput",
      summary: "A text input in toolbar focus.",
      props: [
        { name: "defaultValue", type: "string", description: "Starting text." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks the input." },
        { name: "focusableWhenDisabled", type: "boolean", default: "true", description: "Keeps a disabled input reachable with the arrow keys." },
      ],
    },
    {
      name: "ToolbarGroup",
      summary: "Groups related items.",
      props: [{ name: "disabled", type: "boolean", default: "false", description: "Disables every item in the group." }],
    },
    {
      name: "ToolbarSeparator",
      summary: "A line between groups.",
      props: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "Line direction. Set horizontal in a vertical toolbar." },
      ],
    },
  ],

  notes: [
    {
      title: "Toggles",
      body: "Pass a [Toggle](/docs/components/toggle) to `ToolbarButton` through `render`; wrap several in a [ToggleGroup](/docs/components/toggle-group) for a shared value.\n\n```tsx\n<ToggleGroup defaultValue={[\"bold\"]} multiple>\n  <ToolbarButton render={<Toggle value=\"bold\" />} aria-label=\"Bold\">\n    <Bold className=\"h-4 w-4\" />\n  </ToolbarButton>\n</ToggleGroup>\n```",
    },
    {
      title: "Vertical toolbars",
      body: "Separators do not follow the toolbar's orientation. With `orientation=\"vertical\"`, pass `orientation=\"horizontal\"` to each `ToolbarSeparator` and add `className=\"inline-flex flex-col\"`.",
    },
  ],

  keyboard: [
    { keys: ["←", "→"], does: "Moves focus between items, or ↑ ↓ when vertical" },
    { keys: ["Tab"], does: "Moves focus into and out of the toolbar as one stop" },
  ],

  accessibility: [
    "Role toolbar. Name it with aria-label when a page has several.",
    "One item is in the tab order; arrow keys reach the rest.",
    "Icon-only buttons need an aria-label each.",
    "Disabled buttons and inputs stay focusable by default.",
  ],
} satisfies ComponentDoc;
