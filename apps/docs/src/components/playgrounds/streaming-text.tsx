"use client";

import * as React from "react";
import { StreamingText } from "@/components/ui/streaming-text";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

/** Delivered the way a server would deliver it: in chunks, with gaps between them. */
const CHUNKS = [
  "The reveal is a claim about where the text is coming from.",
  " Playing it over a string you already had in full is a lie",
  " that costs the reader the seconds it takes to run.",
];
const GAP = 1400;

type V = { wordsPerSecond: number; paused: boolean; runKey: number };

function useStream(run: number) {
  const [text, setText] = React.useState(CHUNKS[0]);
  const [complete, setComplete] = React.useState(false);
  const [started, setStarted] = React.useState(run);
  if (run !== started) {
    setStarted(run);
    setText(CHUNKS[0]);
    setComplete(false);
  }
  React.useEffect(() => {
    const timers = CHUNKS.slice(1).map((chunk, i) => setTimeout(() => setText((t) => t + chunk), (i + 1) * GAP));
    timers.push(setTimeout(() => setComplete(true), CHUNKS.length * GAP));
    return () => timers.forEach(clearTimeout);
  }, [run]);
  return { text, complete };
}

function Demo({ values: v }: DemoProps<V>) {
  const stream = useStream(v.runKey);
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-background p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-primary/40" />
        <span className="text-xs font-medium text-muted-foreground">Assistant</span>
      </div>
      <StreamingText
        text={stream.text}
        complete={stream.complete}
        runKey={v.runKey}
        paused={v.paused}
        wordsPerSecond={v.wordsPerSecond}
        className="min-h-[4.5rem]"
      />
    </div>
  );
}

function code(v: V): string {
  const props = ["text={text}", "complete={!pending}"];
  if (v.runKey !== 0) props.push("runKey={runKey}");
  if (v.paused) props.push("paused");
  if (v.wordsPerSecond !== 14) props.push(`wordsPerSecond={${v.wordsPerSecond}}`);
  const args = v.runKey !== 0 ? "{ text, pending, runKey }: { text: string; pending: boolean; runKey: number }" : "{ text, pending }: { text: string; pending: boolean }";
  return [
    `import { StreamingText } from "@/components/ui/streaming-text"`,
    "",
    `export function Answer(${args}) {`,
    `  return <StreamingText ${props.join(" ")} />`,
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "answer.tsx",
  controls: [
    { name: "wordsPerSecond", type: "number", default: 14, min: 1, max: 60, step: 2 },
    { name: "paused", type: "boolean", default: false },
    { name: "runKey", type: "number", default: 0, min: 0, step: 1 },
  ],
  Demo,
  code,
});
