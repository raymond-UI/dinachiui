"use client";

import { motion } from "motion/react";
import { AccessibleTile } from "./bento/AccessibleTile";
import { AISkillsTile } from "./bento/AISkillsTile";
import { CodeExampleTile } from "./bento/CodeExampleTile";
import { ComponentsTile } from "./bento/ComponentsTile";
import { OwnYourCodeTile } from "./bento/OwnYourCodeTile";
import { ThemeableTile } from "./bento/ThemeableTile";

const BentoSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="bg-dot absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-card via-transparent to-background pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-200px" }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-medium mb-3 tracking-tight">
            Everything you need
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto text-balance">
            Production-ready components with the flexibility you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 h-full">
          <AccessibleTile />
          <OwnYourCodeTile />
          <ThemeableTile />

          <ComponentsTile />
          <AISkillsTile />

          <CodeExampleTile />
        </div>
      </div>
    </section>
  );
};

export default BentoSection;
