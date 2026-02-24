"use client";

import { buttonVariants } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const CTASection = () => {
  const [copied, setCopied] = useState(false);
  const initCommand = "npx @dinachi/cli@latest init";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(initCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative bg-dot py-10 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsla(var(--primary), 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto max-w-3xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="text-center flex flex-col"
        >
          <h2 className="text-2xl sm:text-3xl font-medium font-pixel tracking-tight mb-2">
          What will you ship next?
          </h2>
          <p className="text-muted-foreground text-base">
            Initialize Dinachi in your project with a single command.
          </p>

          <motion.button
            type="button"
            className="inline-flex items-center gap-3 rounded-xl border border-border/60 bg-card px-6 py-4 font-mono text-sm mb-10 mt-4 cursor-pointer hover:border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 max-w-md mx-auto"
            onClick={handleCopy}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-muted-foreground/40 select-none">$</span>
            <code className="text-foreground">{initCommand}</code>
            <span className="text-muted-foreground/50 ml-1">
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </span>
          </motion.button>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/docs/installation"
                className={buttonVariants({
                  size: "lg",
                  className:"min-w-47"
                })}
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/docs/components"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "min-w-47",
                })}
              >
                View Components
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
