"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EASE_OUT } from "@/lib/motion";

const STEPS = [
  "npx @dinachi/cli@latest init",
  "npx @dinachi/cli@latest add button",
  "import { Button } from '@/components/ui/button'",
  "<Button>Get Started</Button>",
];

const INTERVAL_MS = 3000;
const PAUSE_AFTER_CLICK_MS = 5000;

const CLIDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }, []);

  // Advancing on its own is motion the reader did not ask for, so a reduced-motion
  // preference leaves the demo on whichever step they choose. The dots stay, so the
  // whole sequence is still reachable.
  useEffect(() => {
    if (isPaused || reducedMotion) return;
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, reducedMotion]);

  useEffect(() => clearTimers, [clearTimers]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(STEPS[currentStep]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    setCopied(false);
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(
      () => setIsPaused(false),
      PAUSE_AFTER_CLICK_MS
    );
  };

  return (
    // The hero already animates this block in on mount; a second entrance on the same
    // element would fight it.
    <div>
      <div className="max-w-2xl mx-auto px-6">
        <Card
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="transition-shadow duration-300 hover:shadow-lg"
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground/60">
                Terminal
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={copied ? "check" : "copy"}
                  initial={{ opacity: 0, transform: "scale(0.9)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  exit={{ opacity: 0, transform: "scale(0.9)" }}
                  transition={{ duration: 0.15, ease: EASE_OUT }}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>

          {/* Command Display */}
          <div className="bg-card p-4 border mb-6 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {/*
                The blur is what makes this read as one line changing rather than two
                lines passing each other. Kept at 3px — the cost of a blurred repaint
                scales with the area, and this box is the width of the card.
              */}
              <motion.p
                key={currentStep}
                className="text-foreground font-mono text-nowrap flex items-center gap-2"
                initial={{ opacity: 0, transform: "translateX(16px)", filter: "blur(3px)" }}
                animate={{ opacity: 1, transform: "translateX(0px)", filter: "blur(0px)" }}
                exit={{ opacity: 0, transform: "translateX(-16px)", filter: "blur(3px)" }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
              >
                <span className="text-muted-foreground/50 pointer-events-none select-none">
                  $
                </span>
                <span>{STEPS[currentStep]}</span>
                {/* CSS rather than a rAF loop: this runs for as long as the page is
                    open, and a cursor is the last thing that should stutter because
                    the main thread is busy. */}
                <span className="pointer-events-none select-none animate-caret">
                  |
                </span>
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 px-4">
            {STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepChange(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentStep
                    ? "bg-foreground"
                    : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          {/* `scaleX` rather than `width`: width forces layout on every frame of the
              spring, scaleX is handed to the compositor. */}
          <div className="mt-2 translate-y-0.5 max-w-lg mx-auto h-1 bg-muted-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full w-full origin-left bg-foreground/60 rounded-full"
              animate={{ scaleX: (currentStep + 1) / STEPS.length }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CLIDemo;
