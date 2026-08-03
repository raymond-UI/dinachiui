"use client";

import * as React from "react";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

const LOGOS = [
  "Vercel",
  "Linear",
  "Supabase",
  "Resend",
  "Clerk",
  "Neon",
  "Cal.com",
  "Raycast",
];

function Logo({ name }: { name: string }) {
  return (
    <span className="whitespace-nowrap px-5 text-lg font-semibold text-muted-foreground">
      {name}
    </span>
  );
}

export function DefaultMarqueeExample() {
  return (
    <Marquee className="py-2">
      {LOGOS.map((name) => (
        <Logo key={name} name={name} />
      ))}
    </Marquee>
  );
}

export function MarqueeDirectionExample() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Marquee direction="left" duration={18} className="py-2">
        {LOGOS.map((name) => (
          <Logo key={name} name={name} />
        ))}
      </Marquee>
      <Marquee direction="right" duration={18} className="py-2">
        {LOGOS.map((name) => (
          <Logo key={name} name={name} />
        ))}
      </Marquee>
    </div>
  );
}

export function MarqueeLinksExample() {
  return (
    <Marquee duration={30} className="py-2">
      {[
        "Changelog",
        "Documentation",
        "Pricing",
        "Engineering blog",
        "Careers",
        "Support",
        "Status page",
        "Community",
      ].map((label) => (
        <a
          key={label}
          href="#"
          onClick={(event) => event.preventDefault()}
          className="whitespace-nowrap rounded-md px-4 py-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {label}
        </a>
      ))}
    </Marquee>
  );
}

/**
 * The loop only runs when the content overflows. Removing items until it fits is the
 * clearest way to show that, since the strip stops on its own.
 */
export function MarqueeFitsExample() {
  const [count, setCount] = React.useState(2);
  const overflowing = count > 3;

  return (
    <>
      <PreviewAction>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCount((n) => (n > 3 ? 2 : LOGOS.length))}
        >
          {overflowing ? "Remove items" : "Add items"}
        </Button>
      </PreviewAction>
      <div className="flex w-full flex-col items-center gap-3">
        <Marquee className="py-2">
          {LOGOS.slice(0, count).map((name) => (
            <Logo key={name} name={name} />
          ))}
        </Marquee>
        <Badge variant="secondary" size="sm">
          {overflowing ? "Overflowing, so it loops" : "Fits, so it sits still"}
        </Badge>
      </div>
    </>
  );
}
