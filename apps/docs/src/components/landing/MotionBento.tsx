"use client";

import * as React from "react";
import { Archive, Trash2 } from "lucide-react";
import { components } from "@/lib/component-metadata";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CompareSlider } from "@/components/ui/compare-slider";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StreamingText } from "@/components/ui/streaming-text";
import { SwipeableRow } from "@/components/ui/swipeable-row";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CopyCommand, Digits, Reveal, useCountOnView, useInView, useReducedMotion } from "./primitives";

const MOTION_COUNT = components.filter((c) => c.category === "Motion").length;

const SAID = "Ada is in. Her invite went out at 9:41 and the digest starts Monday.";
const RING = [72, 38, 91, 64];
const NOTES: [string, string][] = [
  ["Ada joined Acme", "now"],
  ["Plan moved to yearly", "2m"],
  ["Invoice #2041 paid", "5m"],
  ["Alan left a comment", "8m"],
  ["12 seats saved", "11m"],
];

function ProfileCard() {
  return (
    <div className="mcard">
      <div className="hd">
        <Avatar size="sm">
          <AvatarFallback style={{ background: "oklch(0.8 0.1 70)", color: "oklch(0.2 0.02 140)" }}>GH</AvatarFallback>
        </Avatar>
        <div>
          Grace Hopper
          <small>Owner</small>
        </div>
      </div>
      <label className="rw">
        Weekly digest
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
      </label>
      <label className="rw">
        Two-factor
        <Switch>
          <SwitchThumb />
        </Switch>
      </label>
      <div className="acts2">
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </div>
    </div>
  );
}

function Stream({ active }: { active: boolean }) {
  const [phase, setPhase] = React.useState<"think" | "stream" | "hold">("think");
  const [run, setRun] = React.useState(0);

  React.useEffect(() => {
    if (!active || phase === "stream") return;
    const t = setTimeout(
      () => {
        if (phase === "think") {
          setRun((k) => k + 1);
          setPhase("stream");
        } else {
          setPhase("think");
        }
      },
      phase === "think" ? 1500 : 2800,
    );
    return () => clearTimeout(t);
  }, [active, phase]);

  return phase === "think" ? (
    <TextShimmer>Thinking</TextShimmer>
  ) : (
    <StreamingText text={SAID} runKey={run} paused={!active} wordsPerSecond={10} onDone={() => setPhase("hold")} />
  );
}

export function MotionBento() {
  const reduced = useReducedMotion();
  const [countRef, shown] = useCountOnView(MOTION_COUNT);
  const [bentoRef, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const active = inView && !reduced;

  const [ringRef, ringSeen] = useInView<HTMLDivElement>({ threshold: 0.4, once: true });
  const [ring, setRing] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setRing((i) => (i + 1) % RING.length), 2200);
    return () => clearInterval(t);
  }, [active]);

  const next = React.useRef(3);
  const [notes, setNotes] = React.useState(() => [0, 1, 2].map((n) => ({ key: n, note: NOTES[n] })));
  React.useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      const n = next.current++;
      setNotes((list) => [{ key: n, note: NOTES[n % NOTES.length] }, ...list].slice(0, 3));
    }, 2000);
    return () => clearInterval(t);
  }, [active]);

  return (
    <section className="sec blk">
      <div className="wallhead">
        <h2 ref={countRef}>
          <Digits value={shown} cols={2} /> of them <span className="pixel">move.</span>
        </h2>
        <CopyCommand command="npx @dinachi/cli add --motion" />
      </div>

      <div ref={bentoRef}>
        <Reveal className="bento">
          <div className="bx big">
            <CompareSlider
              className="ld-cmp"
              label="Light and dark"
              defaultPosition={38}
              before={
                <div className="side theme-light">
                  <span className="tg" style={{ left: 16 }}>
                    light
                  </span>
                  <ProfileCard />
                </div>
              }
              after={
                <div className="side dark">
                  <span className="tg" style={{ right: 16 }}>
                    dark
                  </span>
                  <ProfileCard />
                </div>
              }
            />
            <div className="cn">Compare slider</div>
          </div>

          <div className="bx">
            <div className="stagebx">
              <SwipeableRow
                className="ld-swp"
                actions={[
                  { label: "Archive", icon: <Archive className="h-4 w-4" />, onSelect: () => {} },
                  { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onSelect: () => {}, destructive: true },
                ]}
              >
                <div className="ld-swp-front">
                  <Avatar size="sm">
                    <AvatarFallback style={{ background: "oklch(0.78 0.09 250)", color: "oklch(0.2 0.02 140)" }}>
                      AT
                    </AvatarFallback>
                  </Avatar>
                  Invoice #2041
                  <small>$480</small>
                </div>
              </SwipeableRow>
            </div>
            <div className="cn">Swipeable row</div>
          </div>

          <div className="bx">
            <div className="stagebx">
              <div className="strm">
                <span className="who">agent</span>
                <div>{reduced ? SAID : <Stream active={active} />}</div>
              </div>
            </div>
            <div className="cn">Streaming text</div>
          </div>

          <div className="bx">
            <div className="stagebx" ref={ringRef}>
              <ProgressRing value={ringSeen ? RING[ring] : 0} size={112} thickness={8} showValue label="Upload" />
            </div>
            <div className="cn">Progress ring</div>
          </div>

          <div className="bx">
            <div className="stagebx stagebx-top">
              <AnimatedList className="alist">
                {notes.map(({ key, note: [text, when] }) => (
                  <AnimatedListItem key={key} className="it">
                    <i />
                    {text}
                    <small>{when}</small>
                  </AnimatedListItem>
                ))}
              </AnimatedList>
            </div>
            <div className="cn">Animated list</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
