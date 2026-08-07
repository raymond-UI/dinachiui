"use client";

import * as React from "react";
import { PreviewAction } from "@/components/mdx/preview-action";
import {
  ExpandableCard,
  ExpandableCardTrigger,
  ExpandableCardPanel,
  ExpandableCardShared,
  ExpandableCardBody,
} from "@/components/ui/expandable-card";

const ITEMS = [
  {
    id: "travel",
    kicker: "Shared layout",
    title: "The card travels",
    gradient: "from-sky-500/70 to-sky-500/20",
    body: "Two elements with the same layoutId are one object to the layout engine. The card does not fade out while a dialog fades in, so the reader never has to work out whether the panel is the thing they tapped.",
  },
  {
    id: "modal",
    kicker: "Accessibility",
    title: "It is a real modal",
    gradient: "from-violet-500/70 to-violet-500/20",
    body: "aria-modal is a promise that the rest of the page is unreachable. Escape closes, focus moves in and comes back, Tab cycles inside, and the card underneath is inert rather than merely covered.",
  },
  {
    id: "restraint",
    kicker: "Restraint",
    title: "Not for forty cards",
    gradient: "from-amber-500/70 to-amber-500/20",
    body: "This is the effect most likely to end up on a dashboard grid, where it turns a glance into a wait. Reach for it where opening something is a decision rather than a habit.",
  },
];

export function DefaultExpandableCardExample() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {ITEMS.map((item) => (
        <ExpandableCard key={item.id}>
          <ExpandableCardTrigger className="group">
            <ExpandableCardShared
              part="art"
              className={`h-24 bg-gradient-to-br ${item.gradient}`}
            />
            <div className="space-y-1 p-4">
              <ExpandableCardShared
                part="kicker"
                className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {item.kicker}
              </ExpandableCardShared>
              <ExpandableCardShared part="title" className="text-sm font-medium">
                {item.title}
              </ExpandableCardShared>
            </div>
          </ExpandableCardTrigger>

          <ExpandableCardPanel title={item.title}>
            <ExpandableCardShared
              part="art"
              className={`h-40 bg-gradient-to-br ${item.gradient}`}
            />
            <div className="space-y-1 p-5">
              <ExpandableCardShared
                part="kicker"
                className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {item.kicker}
              </ExpandableCardShared>
              <ExpandableCardShared part="title" className="text-lg font-medium">
                {item.title}
              </ExpandableCardShared>
              <ExpandableCardBody className="pt-2">{item.body}</ExpandableCardBody>
            </div>
          </ExpandableCardPanel>
        </ExpandableCard>
      ))}
    </div>
  );
}

export function ControlledExpandableCardExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-xs space-y-3">
      <PreviewAction>
        <span className="text-xs text-muted-foreground">
          Panel is {open ? "open" : "closed"}
        </span>
      </PreviewAction>

      <ExpandableCard open={open} onOpenChange={setOpen}>
        <ExpandableCardTrigger>
          <ExpandableCardShared
            part="art"
            className="h-24 bg-gradient-to-br from-emerald-500/70 to-emerald-500/20"
          />
          <ExpandableCardShared part="title" className="p-4 text-sm font-medium">
            Own the open state
          </ExpandableCardShared>
        </ExpandableCardTrigger>

        <ExpandableCardPanel title="Own the open state" showClose={false}>
          <ExpandableCardShared
            part="art"
            className="h-40 bg-gradient-to-br from-emerald-500/70 to-emerald-500/20"
          />
          <div className="space-y-3 p-5">
            <ExpandableCardShared part="title" className="text-lg font-medium">
              Own the open state
            </ExpandableCardShared>
            <ExpandableCardBody>
              With <code>open</code> and <code>onOpenChange</code> the state lives with you,
              so anything else on the page can close it. <code>showClose=false</code> hands
              the close control over too.
            </ExpandableCardBody>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Done reading
            </button>
          </div>
        </ExpandableCardPanel>
      </ExpandableCard>
    </div>
  );
}

const ARTICLE = [
  "The harbour road runs out at the water and starts again a mile north, and nobody has ever agreed on whether that makes it one road or two. The ferrymen say one. The council, which maintains them under separate numbers, says two.",
  "Depth of field is the only thing the eye reads faster than motion. A photograph that puts the near rope in focus and lets the far mast go soft is telling you where to stand before you have decided to look.",
  "What the crossing costs has not changed since the tickets were printed, which is why they are still printed. The machine that would replace them would need a price it could round.",
  "In winter the last run leaves before the light does. The queue forms on the slipway in the dark, headlights pointed at the water, and the boat arrives as a sound long before it arrives as a shape.",
  "There is a bell on the north side that nobody rings. It was hung for fog, and fog here comes in from the sea faster than a bell can be reached, so the practice was to leave and hope rather than to ring and wait.",
  "The photographs in the harbour office are hung by depth rather than by date. Wrecks at the bottom, moorings in the middle, and at eye level the boats that are still working, which is a shorter row every year.",
  "A road that ends is not the same as a road that stops. This one ends the way a sentence ends when the speaker has been interrupted: the grammar is complete, the thought is not, and a mile north somebody picks it up mid-clause.",
];

export function ExpandableCardFullscreenExample() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <ExpandableCard>
        <ExpandableCardTrigger>
          <ExpandableCardShared
            part="art"
            className="h-28 bg-gradient-to-br from-slate-500/70 to-slate-500/20"
          />
          <div className="space-y-1 p-4">
            <ExpandableCardShared
              part="kicker"
              className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              Field notes
            </ExpandableCardShared>
            <ExpandableCardShared part="title" className="text-sm font-medium">
              The road that ends at the water
            </ExpandableCardShared>
          </div>
        </ExpandableCardTrigger>

        <ExpandableCardPanel fullscreen title="The road that ends at the water">
          <ExpandableCardShared
            part="art"
            className="h-56 bg-gradient-to-br from-slate-500/70 to-slate-500/20 sm:h-72"
          />
          <div className="mx-auto max-w-2xl space-y-3 px-6 py-8">
            <ExpandableCardShared
              part="kicker"
              className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              Field notes
            </ExpandableCardShared>
            <ExpandableCardShared part="title" className="text-2xl font-medium">
              The road that ends at the water
            </ExpandableCardShared>
            <ExpandableCardBody className="space-y-4 pt-2 text-base">
              {ARTICLE.map((paragraph) => (
                <p key={paragraph.slice(0, 16)}>{paragraph}</p>
              ))}
            </ExpandableCardBody>
          </div>
        </ExpandableCardPanel>
      </ExpandableCard>
    </div>
  );
}

export function ExpandableCardRowExample() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-2">
      {[
        { id: "invoice", title: "Invoice 4021", meta: "Paid · 12 Aug" },
        { id: "refund", title: "Refund 4019", meta: "Pending · 9 Aug" },
      ].map((row) => (
        <ExpandableCard key={row.id}>
          <ExpandableCardTrigger className="rounded-lg px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <ExpandableCardShared part="title" className="text-sm font-medium">
                {row.title}
              </ExpandableCardShared>
              <ExpandableCardShared part="meta" className="text-xs text-muted-foreground">
                {row.meta}
              </ExpandableCardShared>
            </div>
          </ExpandableCardTrigger>

          <ExpandableCardPanel title={row.title} className="max-w-sm">
            <div className="space-y-2 p-5">
              <ExpandableCardShared part="title" className="text-lg font-medium">
                {row.title}
              </ExpandableCardShared>
              <ExpandableCardShared part="meta" className="text-xs text-muted-foreground">
                {row.meta}
              </ExpandableCardShared>
              <ExpandableCardBody className="pt-2">
                Nothing here is card-shaped. A row works the same way: name the parts that
                exist on both sides and they travel; everything else waits for the landing.
              </ExpandableCardBody>
            </div>
          </ExpandableCardPanel>
        </ExpandableCard>
      ))}
    </div>
  );
}
