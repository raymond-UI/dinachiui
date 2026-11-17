import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "skeleton",
  description: "A pulsing placeholder in the shape of content that is still loading.",
  usage: `import { Skeleton } from "@/components/ui/skeleton"

export function ProfileLoading() {
  return <Skeleton className="h-12 w-12 rounded-full" />
}`,

  examples: ["skeleton-default", "skeleton-card"],

  parts: [
    {
      name: "Skeleton",
      summary: "A pulsing `div`, shaped with classes.",
      props: [
        { name: "className", type: "string", description: "Sets the size and shape, for example `h-4 w-48` or `rounded-full`." },
      ],
    },
  ],

  notes: [
    {
      title: "Match the content",
      body: "Size each skeleton to the element it replaces so the layout does not jump. Compose several for a card or row.",
    },
    {
      title: "Avoiding a flash",
      body: "A fast load flashes the skeleton for one frame. [Load Transition](/docs/components/load-transition) delays it and holds it for a minimum time once shown.",
    },
  ],

  accessibility: [
    "A plain div with no role; nothing is announced.",
    "Mark loading with aria-busy on the region the skeletons fill.",
    "`animate-pulse` keeps running under reduced motion. Add `motion-reduce:animate-none` to stop it.",
  ],
} satisfies ComponentDoc;
