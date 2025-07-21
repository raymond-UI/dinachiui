"use client";

import ComponentGrid from "@/components/reusables/ComponentGrid";
import HeroSection from "@/components/reusables/HeroSection";
import { Button } from "@/components/ui/button";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <main className="flex flex-col w-full overflow-y-auto">
          {/* Hero Section */}
          <HeroSection />

          {/* Component Showcase */}
          <section className="w-full border-t bg-muted/40 py-12 md:py-24">
            <h2 className="sr-only">Components showcase</h2>
            <ComponentGrid />
          </section>

          {/* Call to Action */}
          <section className="border-t py-12 md:py-24">
            <div className="container mx-auto">
              <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                  Ready to build something amazing?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Get started with DinachiUI today and ship faster than ever.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
                  <Button size="lg" className="h-11 px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-11 px-8">
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t bg-muted/40">
            <div className="container mx-auto py-6 md:py-12">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-primary rounded-sm" />
                  <span className="font-bold">DinachiUI</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Built with ❤️ by the DinachiUI team. Open source and free to
                  use.
                </p>
              </div>
            </div>
          </footer>
        </main>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
