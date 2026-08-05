"use client";

import CLIDemo from "@/components/reusables/CliDemo";
import { buttonVariants } from "@/components/ui/button";
import { TextMorph } from "@/components/ui/text-morph";
import { DURATION, EASE_OUT, PRESSABLE, STAGGER } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PHRASES = ["Build faster", "Ship faster", "Create magic"];
const PHRASE_MS = 4000;

/** Transform strings rather than motion's `x`/`y`/`scale`: only the full string is
 *  handed to the compositor, and this runs during the busiest moment of the page. */
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
    <section className="relative space-y-6 overflow-hidden pt-10 lg:pt-32">
      <div className="bg-dot pointer-events-none absolute inset-0 z-0" />
      <div className="bg-linear-to-t from-background to-transparent pointer-events-none absolute inset-0 z-10" />

      <div className="container relative z-20 mx-auto flex max-w-4xl flex-col items-center gap-4 pt-8 text-center md:pt-0">
        <motion.div
          className="text-muted-foreground text-balance"
          {...ENTER}
          transition={{ duration: DURATION.hero, ease: EASE_OUT }}
        >
          <h1 className="text-4xl lg:text-5xl">
            {/*
              The phrases share " faster", and a morph keeps those characters rather
              than crossfading two words that are mostly the same word.
            */}
            <TextMorph className="inline-block text-primary font-pixel">
              {PHRASES[phrase]}
            </TextMorph>
            <br />
            <span className="text-muted-foreground/70">Production-ready</span>
            <br /> components.
          </h1>
        </motion.div>

        <motion.div
          className="mt-4 flex flex-col gap-4 md:flex-row"
          {...ENTER}
          transition={{
            duration: DURATION.hero,
            delay: STAGGER,
            ease: EASE_OUT,
          }}
        >
          <Link
            href="/docs/components"
            className={buttonVariants({
              size: "lg",
              className: `min-w-50 font-medium ${PRESSABLE}`,
            })}
          >
            Browse components
          </Link>
          <Link
            href="/docs/skills"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: `min-w-50 font-medium ${PRESSABLE}`,
            })}
          >
            Agent Skill
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="container relative z-20 mx-auto my-12"
        {...ENTER}
        transition={{
          duration: DURATION.hero,
          delay: STAGGER * 2,
          ease: EASE_OUT,
        }}
      >
        <CLIDemo />
      </motion.div>

      <div className="bg-linear-to-t from-background via-background/80 to-transparent z-15 pointer-events-none absolute bottom-0 left-0 right-0 h-32" />
    </section>
  );
};

export default HeroSection;
