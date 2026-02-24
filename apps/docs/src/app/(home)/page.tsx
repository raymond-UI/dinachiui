"use client";

import BentoSection from "@/components/reusables/BentoSection";
import CTASection from "@/components/reusables/CTASection";
import HeroSection from "@/components/reusables/HeroSection";
import { PublicFooter } from "@/components/reusables/PublicFooter";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Home() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="flex flex-col w-full">
          <HeroSection />
          <BentoSection />
          <CTASection />
          <PublicFooter />
        </div>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
