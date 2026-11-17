import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "link",
  description: "A styled anchor that can render a router link.",
  usage: `import { Link } from "@/components/ui/link"

export function DocsLink() {
  return <Link href="/docs">Read the docs</Link>
}`,

  examples: ["link-default", "link-variants", "link-external", "link-render", "link-render-function"],

  parts: [
    {
      name: "Link",
      summary: "An `a` element styled by `linkVariants`.",
      props: [
        { name: "href", type: "string", description: "The destination. The agent reads it as value.", agent: true },
        { name: "variant", type: '"default" | "muted" | "plain" | "unstyled"', default: '"default"', description: "The visual style. `unstyled` adds only the focus ring." },
        { name: "external", type: "boolean", default: "false", description: "Opens in a new tab; adds an icon and screen reader note." },
        { name: "target", type: "string", default: '"_blank" when external', description: "Overrides the external default." },
        { name: "rel", type: "string", default: '"noopener noreferrer" when external', description: "Overrides the external default." },
        { name: "render", type: "ReactElement | (props, state) => ReactElement", description: "Swap the element, such as a router link, keep the styles." },
      ],
    },
    {
      name: "linkVariants",
      summary: "Link's class function, for other elements.",
      props: [
        { name: "variant", type: '"default" | "muted" | "plain" | "unstyled"', default: '"default"', description: "The same styles Link takes." },
      ],
    },
  ],

  notes: [
    {
      title: "Router links",
      body: "`render` takes an element or a function, as in [Base UI](https://base-ui.com/react/utils/use-render). Either renders one element and one tab stop.\n\n```tsx\nimport NextLink from \"next/link\"\n\n<Link render={<NextLink href=\"/about\" />}>About</Link>\n<Link render={(props) => <NextLink {...props} href=\"/about\" />}>About</Link>\n```\n\nReact Router: `render={<RouterLink to=\"/about\" />}`.",
    },
    {
      title: "Styling other elements",
      body: "```tsx\nimport { linkVariants } from \"@/components/ui/link\"\n\n<a className={linkVariants({ variant: \"muted\" })}>Styled anchor</a>\n```",
    },
    {
      title: "Agents",
      body: "Link does not register with the [agent bridge](/docs/components/agent). The bridge lists any `a[href]` as `link`, with the href as `value`, taking `press`. An `a` without `href` is not listed.\n\n```ts\nawait agent.act({ steps: [{ ref: \"Pricing\", action: \"press\" }] })\n```",
    },
  ],

  keyboard: [
    { keys: ["Enter"], does: "Follows the link" },
  ],

  accessibility: [
    "A native anchor, announced as a link and reached by Tab.",
    "External links add hidden \"(opens in a new tab)\" text; the icon is aria-hidden.",
    "The focus ring shows on keyboard focus only.",
  ],
} satisfies ComponentDoc;
