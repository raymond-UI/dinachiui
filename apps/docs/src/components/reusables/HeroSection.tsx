"use client";

import { InstallSwitch } from "@/components/reusables/InstallSwitch";
import { SpecimenWall } from "@/components/reusables/SpecimenWall";
import { TextMorph } from "@/components/ui/text-morph";
import { components } from "@/lib/component-metadata";
import { DURATION, EASE_OUT, STAGGER } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PHRASES = ["Build faster", "Ship faster", "Create magic"];
const PHRASE_MS = 4000;

const MOTION_COUNT = components.filter((c) => c.category === "Motion").length;

/** Transform strings rather than motion's `x`/`y`/`scale` shorthands: only the full
 *  string is handed to the compositor, and this runs during the busiest moment of the
 *  page. */
const ENTER = {
  initial: { opacity: 0, transform: "translateY(12px)" },
  animate: { opacity: 1, transform: "translateY(0px)" },
};

const HeroSection = () => {
  const [phrase, setPhrase] = useState(0);
  const reducedMotion = useReducedMotion();

  // A headline that rewrites itself is ambient motion, so a reduced-motion preference
  // settles on the first phrase rather than cycling more gently.
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setPhrase((prev) => (prev + 1) % PHRASES.length),
      PHRASE_MS,
    );
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <section className="relative">
      {/* The dot grid stops with the copy rather than running the height of the section:
          the specimen wall draws its own rules, and a grid behind a grid reads as moiré.
          The gradient is opaque at the bottom, so the dots dissolve into the page before
          the wall's top rule instead of meeting it. */}
      <div className="relative">
        <div className="bg-dot pointer-events-none absolute inset-0" />
        <div className="bg-linear-to-t from-background to-transparent pointer-events-none absolute inset-0" />

        <div className="container relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 pb-14 pt-16 text-center lg:pt-28">
          <motion.h1
            className="text-muted-foreground text-4xl lg:text-5xl"
            {...ENTER}
            transition={{ duration: DURATION.hero, ease: EASE_OUT }}
          >
            {/*
              Two of the three phrases end in " faster", and a morph keeps the shared
              characters in place rather than crossfading two mostly identical words.
            */}
            <TextMorph className="text-primary font-pixel inline-block">
              {PHRASES[phrase]}
            </TextMorph>
            <br />
            <span className="text-muted-foreground/70">Production-ready</span>
            <br /> components.
          </motion.h1>

          <motion.div
            className="w-full max-w-3xl"
            {...ENTER}
            transition={{
              duration: DURATION.hero,
              delay: STAGGER,
              ease: EASE_OUT,
            }}
          >
            <InstallSwitch />
          </motion.div>

          <motion.p
            className="text-muted-foreground/70 text-sm"
            {...ENTER}
            transition={{
              duration: DURATION.hero,
              delay: STAGGER * 2,
              ease: EASE_OUT,
            }}
          >
            {components.length} components, {MOTION_COUNT} of them motion.{" "}
            <Link
              href="/docs/components"
              className="text-foreground border-input border-b pb-px transition-colors duration-150 hover:border-current"
            >
              Browse them all
            </Link>
          </motion.p>
        </div>
      </div>

      {/* The claim above is only worth making if the proof is the next thing on screen. */}
      <SpecimenWall />
    </section>
  );
};

export default HeroSection;
