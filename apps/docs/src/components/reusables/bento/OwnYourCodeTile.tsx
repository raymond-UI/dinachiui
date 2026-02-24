"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Tile } from "./Tile";

const lines = [
  { type: "cmd", text: "npx @dinachi/cli@latest init" },
  { type: "out", text: "✓ Detected Next.js project" },
  { type: "out", text: "✓ Created components.json" },
  { type: "out", text: "✓ Installed clsx, tailwind-merge, cva" },
  { type: "out", text: "✓ Created lib/utils.ts" },
  { type: "gap" },
  { type: "cmd", text: "npx @dinachi/cli@latest add button" },
  { type: "out", text: "✓ Copied button.tsx → components/ui/" },
  { type: "out", text: "✓ Ready to use" },
] as const;

export function OwnYourCodeTile() {
  const termRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(termRef, { once: true, margin: "-150px" });

  return (
    <Tile delay={0.05} className="h-full">
      <div className="pl-8 pb-4 pt-6 flex flex-col justify-between">
        <h3 className="text-lg font-medium font-pixel mb-1">Own Your Code</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          Components copy into your project via the CLI. No runtime dependency.
        </p>
      </div>
      <div className="flex w-full pl-8 pt-5 h-full">
        <div
          ref={termRef}
          className="w-full rounded-tl-md bg-muted border border-r-0 border-border overflow-hidden font-mono text-[13px]"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <div className="w-2.5 h-2.5 rounded-full bg-warning" />
            </div>
            <span className="text-muted-foreground font-pixel text-xs ml-2">
              Terminal
            </span>
          </div>
          <div className="p-4 space-y-1">
            {lines.map((line, i) => {
              if (line.type === "gap") {
                return <div key={i} className="h-2" />;
              }

              const isCmd = line.type === "cmd";
              // Stagger: commands appear slower, outputs follow quickly
              const delay = lines
                .slice(0, i)
                .reduce(
                  (acc, l) =>
                    acc + (l.type === "cmd" ? 0.6 : l.type === "gap" ? 0.4 : 0.15),
                  0.3,
                );

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.25,
                    delay,
                    ease: "easeOut",
                  }}
                >
                  {isCmd ? (
                    <div className="flex items-center gap-2">
                      <span className="text-success font-pixel">$</span>
                      <span className="text-foreground">{line.text}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground/70 pl-5 text-xs">
                      {line.text}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Tile>
  );
}
