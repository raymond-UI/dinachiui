"use client";

import { components } from "@/lib/component-metadata";
import { ArrowRight } from "lucide-react";
import { motion, useAnimationControls } from "motion/react";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { Tile } from "./Tile";
import { buttonVariants } from "@/components/ui/button";

const midpoint = Math.ceil(components.length / 2);
const row1 = components.slice(0, midpoint);
const row2 = components.slice(midpoint);

function MarqueeRow({
  items,
  direction = "left",
  duration = 40,
}: {
  items: typeof components;
  direction?: "left" | "right";
  duration?: number;
}) {
  const doubled = [...items, ...items];
  const controls = useAnimationControls();
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);
  const isLeft = direction === "left";

  const startAnimation = useCallback(
    (fromProgress: number) => {
      const remaining = (1 - fromProgress) * duration;
      controls.start({
        x: isLeft ? "-50%" : "0%",
        transition: {
          x: {
            duration: remaining,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0,
          },
        },
      });
      startTimeRef.current = Date.now();
      progressRef.current = fromProgress;
    },
    [controls, duration, isLeft],
  );

  const handleMouseEnter = () => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const cycleProgress = progressRef.current + elapsed / duration;
    progressRef.current = cycleProgress % 1;
    controls.stop();
  };

  const handleMouseLeave = () => {
    startAnimation(progressRef.current);
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-linear-to-r from-card to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-linear-to-l from-card to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-2 w-max"
        animate={controls}
        initial={{ x: isLeft ? "0%" : "-50%" }}
        onAnimationStart={() => {
          startTimeRef.current = Date.now();
        }}
        onViewportEnter={() => startAnimation(0)}
      >
        {doubled.map((comp, i) => (
          <Link
            key={`${comp.slug}-${i}`}
            href={`/docs/components/${comp.slug}`}
            className="shrink-0 text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-full border border-border/40 bg-muted/30 hover:bg-muted hover:border-border transition-all duration-150 whitespace-nowrap"
          >
            {comp.name}
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

export function ComponentsTile() {
  return (
    <Tile className="lg:col-span-3" delay={0.15}>
      <div className="p-8 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-baseline gap-3 font-pixel mb-2">
              <span className="text-lg font-medium tracking-tight tabular-nums">
                {components.length}
              </span>
              <h3 className="text-lg font-medium">Components</h3>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              From form inputs to overlays, everything you need to build
              complete interfaces.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/docs/components"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "gap-2",
              })}
            >
              Browse all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-2 pb-8">
        <MarqueeRow items={row1} direction="left" duration={50} />
        <MarqueeRow items={row2} direction="right" duration={60} />
      </div>
    </Tile>
  );
}
