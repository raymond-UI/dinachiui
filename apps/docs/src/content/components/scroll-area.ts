import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "scroll-area",
  description: "A fixed-size scrolling box with thin styled scrollbars.",
  usage: `import { ScrollArea } from "@/components/ui/scroll-area"

export function ReleaseNotes() {
  return (
    <ScrollArea className="h-64 w-72 rounded-md border">
      <div className="p-4">{/* long content */}</div>
    </ScrollArea>
  )
}`,
  anatomy: `<ScrollAreaRoot>
  <ScrollAreaViewport>
    <ScrollAreaContent />
  </ScrollAreaViewport>
  <ScrollAreaScrollbar>
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
  <ScrollAreaCorner />
</ScrollAreaRoot>`,

  examples: ["scroll-area-default", "scroll-area-horizontal"],

  parts: [
    {
      name: "ScrollArea",
      summary: "Root, viewport, content, scrollbars and corner in one.",
      props: [
        { name: "orientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"', description: "Which scrollbars to render. `both` adds the corner." },
        { name: "viewportClassName", type: "string", description: "Classes for the inner viewport." },
        { name: "scrollbarClassName", type: "string", description: "Classes for every scrollbar." },
        { name: "overflowEdgeThreshold", type: "number | { xStart, xEnd, yStart, yEnd }", default: "0", description: "Pixels to scroll before the overflow edge attributes apply." },
        { name: "className", type: "string", description: "Size the area here, such as `h-64`. It does not grow to fit." },
      ],
    },
    {
      name: "ScrollAreaRoot",
      summary: "The bare root, for custom composition.",
      props: [
        { name: "overflowEdgeThreshold", type: "number | { xStart, xEnd, yStart, yEnd }", default: "0", description: "Pixels to scroll before the overflow edge attributes apply." },
      ],
    },
    {
      name: "ScrollAreaViewport",
      summary: "The element that scrolls.",
      props: [],
    },
    {
      name: "ScrollAreaContent",
      summary: "Wraps the content for measuring.",
      props: [],
    },
    {
      name: "ScrollAreaScrollbar",
      summary: "One scrollbar track.",
      props: [
        { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "The axis it scrolls." },
        { name: "keepMounted", type: "boolean", default: "false", description: "Keeps the scrollbar mounted when there is nothing to scroll." },
      ],
    },
    {
      name: "ScrollAreaThumb",
      summary: "The draggable handle inside a scrollbar.",
      props: [],
    },
    {
      name: "ScrollAreaCorner",
      summary: "Fills the gap where two scrollbars meet.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Compound or parts",
      body: "`ScrollArea` builds every part; wrap content in it. Use `ScrollAreaRoot` and the parts only for a custom layout, such as relocated scrollbars.",
    },
    {
      title: "Scrollbars on hover",
      body: "Scrollbars show whenever there is overflow. To show them only on hover or while scrolling, style on `data-hovering` and `data-scrolling`.",
    },
    {
      title: "Edge fades",
      body: "The root sets `data-overflow-y-start`, `data-overflow-y-end` and the `x` versions while content continues past that edge. Use them to fade only cut-off edges.",
    },
  ],

  keyboard: [
    { keys: ["Tab"], does: "Focuses the viewport when it can scroll" },
    { keys: ["↑", "↓", "←", "→"], does: "Scrolls the focused viewport" },
    { keys: ["Page Up", "Page Down"], does: "Scrolls by a page" },
    { keys: ["Home", "End"], does: "Scrolls to the start or end" },
  ],

  accessibility: [
    "The viewport scrolls natively: wheel, touch and keyboard all work.",
    "The viewport is focusable while it has overflow.",
    "The native scrollbar is replaced by the styled one; its thumb is draggable.",
  ],
} satisfies ComponentDoc;
