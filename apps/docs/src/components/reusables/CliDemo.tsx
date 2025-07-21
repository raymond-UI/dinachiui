import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// CLI Demo Component with Auto-sliding and Pause on Hover
const CLIDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    "npx @dinachi/cli@latest init",
    "npx @dinachi/cli@latest add button",
    "import { Button } from '@/components/ui/button'",
    "<Button>Get Started</Button>",
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, steps.length]);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(steps[currentStep]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    setCopied(false);
    // Temporarily pause auto-sliding when manually selecting a step
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-2xl mx-auto px-6">
        <Card 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="transition-all duration-300 hover:shadow-lg"
        >
          {/* Terminal Header */}
          <motion.div
            className="flex items-center bg-dot justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 px-4">
              <motion.div
                animate={{
                  opacity: isPaused ? [1] : [0.4, 1, 0.4],
                  scale: isPaused ? [1] : [1, 1.1, 1],
                }}
                transition={{
                  duration: isPaused ? 0.3 : 2,
                  repeat: isPaused ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              >
                <Terminal className="w-4 h-4 text-muted-foreground" />
              </motion.div>
              <p className="font-mono text-xs tracking-widest uppercase opacity-60 text-muted-foreground">
                Terminal
              </p>
              {isPaused && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs text-muted-foreground/60 ml-2"
                >
                  PAUSED
                </motion.span>
              )}
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>

          {/* Command Display */}
          <motion.div
            className="bg-card p-4 border mb-6 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                className="text-foreground font-mono text-nowrap flex items-center gap-2"
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <motion.span
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-muted-foreground/50 pointer-events-none "
                >
                  ${" "}
                </motion.span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: "easeOut",
                  }}
                  className="inline-block overflow-hidden"
                >
                  {steps[currentStep]}
                </motion.span>
                <motion.span
                  animate={{ 
                    opacity: isPaused ? [1] : [1, 0, 1]
                  }}
                  transition={{
                    duration: isPaused ? 0.3 : 1,
                    repeat: isPaused ? 0 : Infinity,
                    ease: "easeInOut",
                  }}
                  className="ml-1 pointer-events-none"
                >
                  |
                </motion.span>
              </motion.p>
            </AnimatePresence>

            {/* Subtle background glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: isPaused ? "-100%" : "100%" }}
              transition={{
                duration: isPaused ? 0.3 : 2,
                repeat: isPaused ? 0 : Infinity,
                repeatDelay: isPaused ? 0 : 3,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Step Indicators */}
          <motion.div
            className="flex justify-center gap-2 px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            {steps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleStepChange(index)}
                className={`w-2 h-2 rounded-full transition-colors ro relative overflow-hidden ${
                  index === currentStep
                    ? "bg-primary-foreground"
                    : "bg-muted-foreground/20"
                }`}
                whileHover={{
                  scale: 1.3,
                  backgroundColor:
                    index === currentStep
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.4)",
                }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  scale: { delay: 0.9 + index * 0.1, duration: 0.2 },
                  backgroundColor: { duration: 0.2 },
                }}
              >
                {index === currentStep && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    layoutId="activeIndicator"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="mt-2 translate-y-0.5 max-w-lg mx-auto h-1 bg-muted-foreground/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/50"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
              }}
            />
          </motion.div>
        </Card>
      </div>
    </motion.div>
  );
};

export default CLIDemo;