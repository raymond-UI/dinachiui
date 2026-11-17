import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "tooltip",
  description: "A short hover or focus label for an already-named control.",
  usage: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AddButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Add item" />}>
          <Plus className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>Add item</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`,
  anatomy: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger />
    <TooltipContent />
  </Tooltip>
</TooltipProvider>`,

  examples: ["tooltip-default", "tooltip-positions", "tooltip-variants", "tooltip-close-on-click"],

  parts: [
    {
      name: "Tooltip",
      summary: "Open state for one tooltip. No element.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Starts open when uncontrolled." },
        { name: "onOpenChange", type: "(open, details) => void", description: "Runs when the tooltip opens or closes." },
        { name: "disabled", type: "boolean", default: "false", description: "Stops the tooltip from opening." },
        { name: "disableHoverablePopup", type: "boolean", default: "false", description: "Closes when the pointer leaves the trigger, even onto the popup." },
        { name: "trackCursorAxis", type: '"none" | "x" | "y" | "both"', default: '"none"', description: "Follows the cursor along an axis." },
      ],
    },
    {
      name: "TooltipTrigger",
      summary: "The described element. Unstyled; style via `render`.",
      props: [
        { name: "render", type: "ReactElement", description: "Your own element, such as a Button, with trigger behaviour." },
        { name: "delay", type: "number", default: "600", description: "Milliseconds of hover before it opens." },
        { name: "closeDelay", type: "number", default: "0", description: "Milliseconds before it closes once the pointer leaves." },
        { name: "closeOnClick", type: "boolean", default: "true", description: "Closes the tooltip when the trigger is clicked." },
        { name: "disabled", type: "boolean", default: "false", description: "Stops this trigger opening the tooltip. The element stays enabled." },
      ],
    },
    {
      name: "TooltipContent",
      summary: "Portal, positioner, popup and arrow in one.",
      props: [
        { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side of the trigger." },
        { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment along that side." },
        { name: "sideOffset", type: "number", default: "4", description: "Gap to the trigger, in pixels." },
        { name: "showArrow", type: "boolean", default: "true", description: "Draws the arrow pointing at the trigger." },
        { name: "variant", type: '"default" | "inverse"', default: '"default"', description: "Inverse uses the primary colour for more contrast." },
      ],
    },
    {
      name: "TooltipProvider",
      summary: "Shares delays across tooltips. Optional.",
      props: [
        { name: "delay", type: "number", description: "Open delay for every trigger inside." },
        { name: "closeDelay", type: "number", description: "Close delay for every tooltip inside." },
        { name: "timeout", type: "number", default: "400", description: "After one tooltip closes, another opens instantly within this many milliseconds." },
      ],
    },
    {
      name: "TooltipPortal",
      summary: "Portals into the body, for custom content.",
      props: [],
    },
    {
      name: "TooltipPositioner",
      summary: "Positions the popup, for custom content.",
      props: [
        { name: "sideOffset", type: "number", default: "4", description: "Gap to the trigger, in pixels." },
        { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side of the trigger." },
      ],
    },
    {
      name: "TooltipPopup",
      summary: "The visible box.",
      props: [{ name: "variant", type: '"default" | "inverse"', default: '"default"', description: "Colour scheme." }],
    },
    {
      name: "TooltipArrow",
      summary: "The pointer from the popup to the trigger.",
      props: [
        { name: "variant", type: '"default" | "inverse"', default: '"default"', description: "Match the popup's variant." },
        { name: "children", type: "ReactNode", default: "<TooltipArrowSvg />", description: "Replaces the arrow shape." },
      ],
    },
    {
      name: "TooltipArrowSvg",
      summary: "Default arrow shape, for custom arrows.",
      props: [{ name: "variant", type: '"default" | "inverse"', default: '"default"', description: "Fill colours." }],
    },
  ],

  notes: [
    {
      title: "Custom content",
      body: "`TooltipContent` passes `side`, `align` and `sideOffset` to the positioner and the rest to the popup. For other positioner options, such as collision handling, compose `TooltipPortal`, `TooltipPositioner`, `TooltipPopup` and `TooltipArrow`.",
    },
    {
      title: "Supplementary content only",
      body: "It shows only on hover or focus. Put nothing in it needed to finish the task, and nothing interactive.",
    },
  ],

  keyboard: [
    { keys: ["Tab"], does: "Focusing the trigger opens the tooltip" },
    { keys: ["Esc"], does: "Closes the tooltip" },
  ],

  accessibility: [
    "No aria-describedby link, so screen readers skip the popup. Name the trigger.",
    "An icon-only trigger needs an aria-label; it can repeat the tooltip text.",
    "Opening on keyboard focus skips the animation.",
    "Reduced motion drops the scale; only the fade remains.",
  ],
} satisfies ComponentDoc;
