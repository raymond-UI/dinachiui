"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaggerList, StaggerListItem } from "@/components/ui/stagger-list";
import { STAGGER } from "@/lib/motion";
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
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-medium mb-3 tracking-tight">
            Everything you need
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto text-balance">
            Production-ready components with the flexibility you need.
          </p>
        </ScrollReveal>

        {/*
          A list, so the tiles arrive in sequence from one orchestrator rather than each
          racing its own viewport observer. `rise` keeps the entrance to travel and
          opacity — a grid of cards that also scale reads as six separate events.
        */}
        <StaggerList
          variant="rise"
          stagger={STAGGER}
          startOnView
          className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 h-full"
        >
          <StaggerListItem className="h-full">
            <AccessibleTile />
          </StaggerListItem>
          <StaggerListItem className="h-full">
            <OwnYourCodeTile />
          </StaggerListItem>
          <StaggerListItem className="h-full">
            <ThemeableTile />
          </StaggerListItem>

          <StaggerListItem className="h-full lg:col-span-3">
            <ComponentsTile />
          </StaggerListItem>
          <StaggerListItem className="h-full">
            <AISkillsTile />
          </StaggerListItem>

          <StaggerListItem className="h-full lg:col-span-2">
            <CodeExampleTile />
          </StaggerListItem>
        </StaggerList>
      </div>
    </section>
  );
};

export default BentoSection;
