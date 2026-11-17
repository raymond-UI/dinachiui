import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "badge",
  description: "A short label for a status, a category or a count.",
  usage: `import { Badge } from "@/components/ui/badge"

export function DeployStatus() {
  return <Badge variant="success">Live</Badge>
}`,

  examples: ["badge-variants", "badge-default", "badge-sizes"],

  parts: [
    {
      name: "Badge",
      summary: "A styled div with optional icon and remove button.",
      props: [
        {
          name: "variant",
          type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"',
          default: '"default"',
          description: "The colour scheme.",
        },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Padding and text size." },
        {
          name: "rounded",
          type: '"default" | "sm" | "md" | "lg" | "none"',
          default: '"default"',
          description: "Corner radius. `default` is fully rounded.",
        },
        { name: "icon", type: "ReactNode", description: "Shown before the text." },
        { name: "dismissible", type: "boolean", default: "false", description: "Adds a remove button after the text." },
        {
          name: "onDismiss",
          type: "() => void",
          description: "Runs on remove click. The badge does not hide itself.",
        },
      ],
    },
  ],

  notes: [
    {
      title: "Removing a badge",
      body: "`dismissible` only draws the button. Remove the badge from state in `onDismiss`:\n\n```tsx\n{tags.map((tag) => (\n  <Badge key={tag} dismissible onDismiss={() => remove(tag)}>\n    {tag}\n  </Badge>\n))}\n```",
    },
    {
      title: "Styling other elements",
      body: "`badgeVariants()` takes the same `variant`, `size` and `rounded` options, to style a link or button as a badge.",
    },
  ],

  keyboard: [{ keys: ["Enter", "Space"], does: "On the remove button, runs onDismiss" }],

  accessibility: [
    "A plain div with no role; its text reads with the surrounding content.",
    "Put the status in the text; colour alone does not convey it.",
    'The remove button is a native button named "Remove" on every badge; let context identify which.',
  ],
} satisfies ComponentDoc;
