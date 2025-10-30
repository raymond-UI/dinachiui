"use client";

import ComponentGrid from "@/components/reusables/ComponentGrid";
import HeroSection from "@/components/reusables/HeroSection";
import { PublicFooter } from "@/components/reusables/PublicFooter";
import { Button } from "@/components/ui/button";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";


export default function Home() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="flex flex-col w-full">
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
                <h2 className="font-bold text-xl mb-1">
                  Ready to build something amazing?
                </h2>
                <p className="text-muted-foreground text-base mb-8">
                  Start building with Dinachi today.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
                  <Button variant="outline" className="h-10 px-6" >
                    <Link href="/docs">
                      View Docs
                    </Link>
                    View Docs
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <PublicFooter />
        </div>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
