"use client";

import * as React from "react";
import { TextMorph } from "@/components/ui/text-morph";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

/** Related strings, so most characters survive the change and slide rather than fade. */
const STATUSES = ["Deploying", "Deployed", "Deploy failed"];

/** Sits in the preview header so the label below it is the only thing in the frame. */
function Advance({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <PreviewAction>
      <Button variant="outline" size="sm" onClick={onClick}>
        {children}
      </Button>
    </PreviewAction>
  );
}

export function DefaultTextMorphExample() {
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <Advance onClick={() => setIndex((i) => (i + 1) % STATUSES.length)}>
        Next status
      </Advance>
      <TextMorph className="text-xl font-medium">{STATUSES[index]}</TextMorph>
    </>
  );
}

/**
 * The effect lives or dies on how much the two strings share. Putting a related pair next
 * to an unrelated one is the quickest way to see why.
 */
export function TextMorphRelatedExample() {
  const [swapped, setSwapped] = React.useState(false);

  return (
    <>
      <Advance onClick={() => setSwapped((value) => !value)}>Swap</Advance>
      <div className="flex flex-col items-center gap-6 text-lg">
        <div className="flex flex-col items-center gap-1">
          <TextMorph className="font-medium">
            {swapped ? "Unsubscribed" : "Subscribed"}
          </TextMorph>
          <span className="text-xs text-muted-foreground">
            Related: most characters slide
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <TextMorph className="font-medium">
            {swapped ? "Archive" : "Subscribed"}
          </TextMorph>
          <span className="text-xs text-muted-foreground">
            Unrelated: an expensive crossfade
          </span>
        </div>
      </div>
    </>
  );
}

export function TextMorphTuningExample() {
  const [swapped, setSwapped] = React.useState(false);
  const label = swapped ? "Connected" : "Connecting";

  return (
    <>
      <Advance onClick={() => setSwapped((value) => !value)}>Toggle</Advance>
      <div className="flex flex-col items-center gap-4 text-lg">
        <TextMorph blur={0} distance={0}>
          {label}
        </TextMorph>
        <TextMorph>{label}</TextMorph>
        <TextMorph blur={6} distance={16}>
          {label}
        </TextMorph>
      </div>
    </>
  );
}
