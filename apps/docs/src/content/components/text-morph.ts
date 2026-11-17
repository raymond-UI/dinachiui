import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "text-morph",
  description: "A short label that rearranges its letters into the next one.",
  usage: `import { TextMorph } from "@/components/ui/text-morph"

export function DeployStatus({ done }: { done: boolean }) {
  return <TextMorph>{done ? "Deployed" : "Deploying"}</TextMorph>
}`,

  examples: ["text-morph-default", "text-morph-related", "text-morph-tuning"],

  parts: [
    {
      name: "TextMorph",
      summary: "A span that morphs when its text changes.",
      props: [
        { name: "children", type: "string", description: "The text to show. Changing it runs the morph. Required." },
        { name: "blur", type: "number", default: "2", description: "Blur radius in px on arriving and departing characters." },
        { name: "distance", type: "number", default: "8", description: "Vertical travel in px for arriving and departing characters." },
        { name: "duration", type: "number", default: "0.25", description: "Seconds. Keep it under 0.3." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "When to use it",
      body: `Characters shared by both strings slide to their new places; the rest fade. The more the strings share, the better it works.

- Short labels that change in place: \`Deploying\` to \`Deployed\`, a unit, a toggle's label.
- Skip it for unrelated strings and sentences; every character animates, at a cost per character.
- For numbers, use [Number Ticker](/docs/components/number-ticker).`,
    },
    {
      title: "Behaviour",
      body: `- Exits run at 60% of the entrance duration.
- Departing characters leave the flow at once, so the gap closes immediately.
- Splits by grapheme: combining accents and multi-codepoint emoji stay whole. Repeated characters keep distinct identities.
- No per-character stagger.`,
    },
  ],

  accessibility: [
    "At rest the text is one text node: selectable, findable and wrappable. It splits only during the morph.",
    "During the morph, split characters are `aria-hidden` and a visually hidden copy is read instead.",
    "Reduced motion never splits the text; the change becomes a short crossfade.",
  ],
} satisfies ComponentDoc;
