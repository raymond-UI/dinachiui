"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code, ChevronDown, Check, Copy } from "lucide-react";
import { DynamicCodeBlock } from "@/components/mdx/DynamicCodeBlock";

interface SpecViewerProps {
  spec: unknown;
}

export function SpecViewer({ spec }: SpecViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = spec ? JSON.stringify(spec, null, 2) : "";

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!jsonString) return;
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
    },
    [jsonString],
  );

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!spec) return null;

  return (
    <motion.div
      className="overflow-hidden rounded-xl border border-border/60"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsOpen(!isOpen); } }}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent/30"
      >
        <span className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span className="font-mono text-xs">JSON Spec</span>
        </span>
        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              onClick={handleCopy}
              className="rounded p-1 transition-colors hover:bg-accent/50"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 [&>div]:rounded-none [&>div]:border-0">
              <DynamicCodeBlock
                code={jsonString}
                language="json"
                maxHeight={400}
                showHeader={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
