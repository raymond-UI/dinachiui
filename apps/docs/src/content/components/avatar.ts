import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "avatar",
  description: "A round profile picture with an initials fallback.",
  usage: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserAvatar() {
  return (
    <Avatar>
      <AvatarImage src="/avatars/jane.png" alt="Jane Doe" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  )
}`,
  anatomy: `<Avatar>
  <AvatarImage />
  <AvatarFallback />
</Avatar>`,

  examples: ["avatar-default", "avatar-sizes", "avatar-keep-mounted"],

  parts: [
    {
      name: "Avatar",
      summary: "The round frame.",
      props: [
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "32, 40 or 48px square." },
        { name: "className", type: "string", description: "Merged over the size; your own width and height win." },
      ],
    },
    {
      name: "AvatarImage",
      summary: "The picture. Hidden while loading or failed.",
      props: [
        { name: "src", type: "string", description: "The image to load." },
        { name: "alt", type: "string", description: "Names the person for screen readers." },
        { name: "keepMounted", type: "boolean", default: "false", description: "Renders the image before it loads. Needed for next/image and lazy loading." },
        { name: "onLoadingStatusChange", type: '(status: "idle" | "loading" | "loaded" | "error") => void', description: "Runs as the image loads or fails." },
        { name: "render", type: "ReactElement", description: "Swap the element, for example for next/image." },
      ],
    },
    {
      name: "AvatarFallback",
      summary: "Initials or an icon until the image loads.",
      props: [
        { name: "delay", type: "number", default: "0", description: "Milliseconds before showing, so a fast image skips the fallback." },
      ],
    },
  ],

  notes: [
    {
      title: "Image optimizers",
      body: "`AvatarImage` preloads `src` and renders once loaded, which breaks `next/image` and `loading=\"lazy\"`. Add `keepMounted` to render it at once; the fallback shows beneath until it loads, and stays if it fails.\n\n```tsx\nimport Image from \"next/image\"\n\n<Avatar>\n  <AvatarFallback>JD</AvatarFallback>\n  <AvatarImage\n    keepMounted\n    render={<Image src=\"/avatars/jane.png\" width={40} height={40} alt=\"Jane Doe\" />}\n  />\n</Avatar>\n```",
    },
  ],

  accessibility: [
    "Give AvatarImage an alt naming the person, or an empty alt when the name is beside it.",
    "Fallback initials are read as letters. Prefer a visible name beside the avatar.",
  ],
} satisfies ComponentDoc;
