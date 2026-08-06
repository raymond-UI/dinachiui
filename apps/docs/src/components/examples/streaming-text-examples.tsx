"use client";

import * as React from "react";
import { StreamingText } from "@/components/ui/streaming-text";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

/** Delivered the way a server would deliver it: in chunks, with gaps between them. */
const CHUNKS = [
  "The reveal is a claim about where the text is coming from.",
  " Playing it over a string you already had in full is a lie",
  " that costs the reader the seconds it takes to run.",
];

const GAP = 1400;

function useStream() {
  const [run, setRun] = React.useState(0);
  const [text, setText] = React.useState(CHUNKS[0]);
  const [complete, setComplete] = React.useState(false);

  React.useEffect(() => {
    setText(CHUNKS[0]);
    setComplete(false);

    const timers = CHUNKS.slice(1).map((chunk, i) =>
      setTimeout(() => setText((current) => current + chunk), (i + 1) * GAP)
    );
    timers.push(setTimeout(() => setComplete(true), CHUNKS.length * GAP));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  return { text, complete, replay: () => setRun((n) => n + 1), run };
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-background p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-primary/40" />
        <span className="text-xs font-medium text-muted-foreground">Assistant</span>
      </div>
      {children}
    </div>
  );
}

export function DefaultStreamingTextExample() {
  const stream = useStream();

  return (
    <>
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={stream.replay}>
          Replay
        </Button>
      </PreviewAction>

      <Bubble>
        <StreamingText
          text={stream.text}
          complete={stream.complete}
          runKey={stream.run}
        />
      </Bubble>
    </>
  );
}

export function StreamingTextPauseExample() {
  const stream = useStream();
  const [paused, setPaused] = React.useState(false);

  return (
    <>
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={() => setPaused((v) => !v)}>
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button variant="outline" size="sm" onClick={stream.replay}>
          Replay
        </Button>
      </PreviewAction>

      <Bubble>
        <StreamingText
          text={stream.text}
          complete={stream.complete}
          runKey={stream.run}
          paused={paused}
        />
      </Bubble>
    </>
  );
}

export function StreamingTextCompleteExample() {
  const stream = useStream();
  const [done, setDone] = React.useState(false);

  React.useEffect(() => setDone(false), [stream.run]);

  return (
    <>
      <PreviewAction>
        {/* The reveal catches up to each chunk and idles, so the reader needs to see
            that `onDone` has not fired yet. */}
        <span className="text-xs text-muted-foreground">
          {done ? "onDone fired" : "waiting"}
        </span>
        <Button variant="outline" size="sm" onClick={stream.replay}>
          Replay
        </Button>
      </PreviewAction>

      <Bubble>
        <StreamingText
          text={stream.text}
          complete={stream.complete}
          runKey={stream.run}
          onDone={() => setDone(true)}
        />
      </Bubble>
    </>
  );
}
