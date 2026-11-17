import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "streaming-text",
  description: "Reveals a streamed answer a word at a time.",
  usage: `import { StreamingText } from "@/components/ui/streaming-text"

export function Answer({ text, pending }: { text: string; pending: boolean }) {
  return <StreamingText text={text} complete={!pending} />
}`,

  examples: ["streaming-text-default", "streaming-text-pause", "streaming-text-complete"],

  parts: [
    {
      name: "StreamingText",
      summary: "The paragraph, its caret and the announcement.",
      props: [
        { name: "text", type: "string", description: "The text so far. Required. Appended text resumes the reveal." },
        { name: "complete", type: "boolean", default: "true", description: "Whether the stream has ended. Drives the caret, `onDone` and the announcement." },
        { name: "runKey", type: "number", default: "0", description: "Change it to rewind to the first word." },
        { name: "paused", type: "boolean", default: "false", description: "Holds the reveal. The clock stops too, so resuming does not burst." },
        { name: "wordsPerSecond", type: "number", default: "14", description: "Reveal pace. Can change mid-stream without restarting." },
        { name: "onDone", type: "() => void", description: "Fires once the reveal catches up and `complete` is true." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). \`add --all\` skips it; install with \`add --motion\` or by name.",
    },
    {
      title: "Signalling the end",
      body: `The component cannot tell a pause between chunks from the end of the stream. Pass \`complete\` while streaming:

\`\`\`tsx
<StreamingText text={text} complete={!pending} />
\`\`\`

Leave it at the default \`true\` for a string that is already whole.`,
    },
    {
      title: "Behaviour",
      body: `- Paced by elapsed time, so a dropped frame does not put it out of sync.
- Reveals whole words, fading opacity and blur in place; later text does not move.
- Progress only moves forward. Appended text extends the reveal; only \`runKey\` rewinds it.`,
    },
    {
      title: "When to use it",
      body: "- A single answer arriving over a network, a token at a time.\n- Skip it for a string already complete, or for page body copy.",
    },
  ],

  accessibility: [
    "The visible paragraph is `aria-hidden`.",
    "The full text is announced once, politely, when the reveal catches up and `complete` is true.",
    "Reduced motion keeps the word-by-word reveal and drops the blur.",
    "The caret is solid while streaming and blinks once done; never under reduced motion.",
  ],
} satisfies ComponentDoc;
