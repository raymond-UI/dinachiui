import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "separator",
  description: "A one-pixel line dividing content, horizontal or vertical.",
  usage: `import { Separator } from "@/components/ui/separator"

export function Section() {
  return (
    <div>
      <p>Account</p>
      <Separator className="my-4" />
      <p>Billing</p>
    </div>
  )
}`,

  examples: ["separator-default", "separator-orientations"],

  parts: [
    {
      name: "Separator",
      summary: "The line.",
      props: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Horizontal fills the width; vertical fills the height." },
        { name: "render", type: "ReactElement", description: "Swap the element, keep the behaviour." },
      ],
    },
  ],

  notes: [
    {
      title: "Vertical height",
      body: "A vertical separator is `h-full`. Give the row a height, as in `<div className=\"flex h-5 items-center\">`, or the line collapses.",
    },
    {
      title: "Decorative lines",
      body: "Separator always has the separator role. For a purely visual line, use a styled `div` so screen readers skip it.",
    },
  ],

  accessibility: [
    "Renders with the separator role and aria-orientation set from `orientation`.",
  ],
} satisfies ComponentDoc;
