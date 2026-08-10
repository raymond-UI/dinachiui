"use client";

import { CompareSlider } from "@/components/ui/compare-slider";
import { Tile } from "./Tile";

const TOKENS = [
  { name: "--primary", color: "bg-primary" },
  { name: "--secondary", color: "bg-secondary" },
  { name: "--accent", color: "bg-accent" },
  { name: "--destructive", color: "bg-destructive" },
  { name: "--muted", color: "bg-muted-foreground/20" },
];

/**
 * The same swatches rendered twice under forced themes. Nothing here is theme-aware —
 * every class reads a token, and only the wrapper differs.
 */
function Swatches() {
  return (
    <div className="h-full w-full space-y-4 bg-muted p-5">
      <div className="font-mono text-xs text-muted-foreground/60">@theme</div>
      <div className="space-y-3">
        {TOKENS.map((token) => (
          <div key={token.name} className="flex items-center gap-3">
            <div
              className={`h-8 w-8 shrink-0 rounded-full border border-border/30 ${token.color}`}
            />
            <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
              {token.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeableTile() {
  return (
    <Tile className="h-full">
      <div className="pl-8 pb-4 pt-6">
        <h3 className="text-lg font-medium font-pixel mb-1">Themeable</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          OKLCH design tokens with CSS custom properties. Drag to see both modes.
        </p>
      </div>
      <div className="flex w-full pl-8 pt-5 h-full">
        {/*
          Claiming both modes are built in and then showing one of them is a claim the
          reader has to take on trust. The divider is the demonstration: it is the same
          markup on both sides, and only the theme class differs.
        */}
        <CompareSlider
          label="Reveal the light theme"
          className="w-full rounded-tl-md border border-r-0 border-border overflow-hidden"
          before={
            <div className="theme-light h-full">
              <Swatches />
            </div>
          }
          after={
            <div className="dark h-full">
              <Swatches />
            </div>
          }
        />
      </div>
    </Tile>
  );
}
