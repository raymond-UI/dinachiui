import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "text",
  description: "Type styles for headings, body and inline text.",
  usage: `import { Text } from "@/components/ui/text"

export function Intro() {
  return (
    <div>
      <Text variant="h2">Release notes</Text>
      <Text variant="muted">Updated every Tuesday.</Text>
    </div>
  )
}`,

  examples: ["text-variants", "text-default", "text-as-override"],

  parts: [
    {
      name: "Text",
      summary: "Text in a type style, on a matching element.",
      props: [
        {
          name: "variant",
          type: '"h1" | "h2" | "h3" | "h4" | "p" | "large" | "small" | "lead" | "muted" | "blockquote" | "code" | "span"',
          default: '"p"',
          description: "The type style. Also picks the element unless `as` is set.",
        },
        { name: "as", type: "ElementType", description: "Renders another element with the same style, such as an `h2` look on an `h3`." },
        { name: "children", type: "ReactNode", description: "The text." },
      ],
    },
  ],

  notes: [
    {
      title: "Rendered elements",
      body: "- `h1` to `h4`: their heading.\n- `blockquote`, `code`: that element.\n- `span`: an unstyled `<span>`.\n- `p`, `large`, `small`, `lead`, `muted`: a `<p>`. Use `as=\"span\"` inside another paragraph.",
    },
    {
      title: "Heading level",
      body: "Set the level from the outline and the variant from the design: `<Text variant=\"h2\" as=\"h3\">`.",
    },
    {
      title: "textVariants",
      body: "Also exported. Call it to style your own element, such as a link or label.",
    },
  ],

  accessibility: [
    "Each variant renders a semantic element; headings join the outline.",
    "Keep heading levels in order; use `as` when design and outline disagree.",
  ],
} satisfies ComponentDoc;
