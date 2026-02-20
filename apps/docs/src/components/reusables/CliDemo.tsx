"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
    >
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
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {/* Command Display */}
          <div className="bg-card p-4 border mb-6 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                className="text-foreground font-mono text-nowrap flex items-center gap-2"
                initial={{ opacity: 0, x: 16, filter: "blur(3px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -16, filter: "blur(3px)" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <span className="text-muted-foreground/50 pointer-events-none select-none">
                  $
                </span>
                <span>{STEPS[currentStep]}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                  }}
                  className="pointer-events-none select-none"
                >
                  |
                </motion.span>
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
          <div className="mt-2 translate-y-0.5 max-w-lg mx-auto h-1 bg-muted-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground/60 rounded-full"
              animate={{
                width: `${((currentStep + 1) / STEPS.length) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default CLIDemo;
