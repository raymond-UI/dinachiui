"use client";

import "@/components/landing/landing.css";
import "@/components/landing/showcase.css";
import { AgentWall } from "@/components/landing/AgentWall";
import { CloseSection } from "@/components/landing/CloseSection";
import { Hero } from "@/components/landing/Hero";
import { InstallStory } from "@/components/landing/InstallStory";
import { MotionBento } from "@/components/landing/MotionBento";
import { ThemingSection } from "@/components/landing/ThemingSection";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Home() {
  return (
    <TooltipProvider>
      <div className="ld">
        <main className="page">
          <Hero />
          <InstallStory />
          <AgentWall />
          <MotionBento />
          <ThemingSection />
          <CloseSection />
        </main>
      </div>
    </TooltipProvider>
  );
}
