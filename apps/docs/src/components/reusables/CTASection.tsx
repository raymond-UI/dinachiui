"use client";

import { buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PRESSABLE } from "@/lib/motion";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CTASection = () => {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initCommand = "npx @dinachi/cli@latest init";

  useEffect(
    () => () => {
      if (resetRef.current) clearTimeout(resetRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(initCommand);
    setCopied(true);
    if (resetRef.current) clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative bg-dot py-10 md:py-20 overflow-hidden">
      <div className="container mx-auto max-w-3xl px-6 relative z-10">
        <ScrollReveal className="text-center flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-medium font-pixel tracking-tight mb-2">
            What will you ship next?
          </h2>
          <p className="text-muted-foreground text-base">
            Initialize Dinachi in your project with a single command.
          </p>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy ${initCommand}`}
            // Named properties rather than `transition-all`, which would also animate
            // the icon swap and anything else that happens to change.
            className="inline-flex items-center gap-3 rounded-xl border border-border/60 bg-card px-6 py-4 font-mono text-sm mb-10 mt-4 cursor-pointer max-w-md mx-auto transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-border hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 active:scale-[0.97] active:duration-[120ms] motion-reduce:transition-[border-color,box-shadow] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
          >
            <span className="text-muted-foreground/40 select-none">$</span>
            <code className="text-foreground">{initCommand}</code>
            <span className="ml-1 text-muted-foreground/50">
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </span>
          </button>

          {/* The icon swap is the only confirmation a sighted reader gets, so the
              result is announced too. */}
          <p aria-live="polite" className="sr-only">
            {copied ? "Command copied to clipboard" : ""}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/docs/installation"
              className={buttonVariants({
                size: "lg",
                className: `min-w-47 ${PRESSABLE}`,
              })}
            >
              Get Started
            </Link>
            <Link
              href="/docs/components"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: `min-w-47 ${PRESSABLE}`,
              })}
            >
              View Components
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
