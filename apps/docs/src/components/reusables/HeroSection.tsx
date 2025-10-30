import CLIDemo from "@/components/reusables/CliDemo";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Github from "@/components/icons/Github";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentGlow, setCurrentGlow] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animated text phrases
  const phrases = ["Build faster", "Ship faster", "Create magic"];

  // Auto-cycle glow effects
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentGlow((prev) => (prev + 1) % 3);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setCursorPosition({ x, y });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      section.addEventListener("mouseenter", () => setIsHovering(true));
      section.addEventListener("mouseleave", () => setIsHovering(false));

      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseenter", () => setIsHovering(true));
        section.removeEventListener("mouseleave", () => setIsHovering(false));
      };
    }
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className="relative space-y-6 pt-10 lg:pt-32 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Animated Background Elements */}
      <div className="bg-dot absolute inset-0 pointer-events-none -z-0" />
      <div className="bg-gradient-to-t from-background to-transparent absolute inset-0 pointer-events-none z-10" />

      {/* Interactive Cursor Glow */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="absolute pointer-events-none z-5"
            style={{
              left: `${cursorPosition.x}%`,
              top: `${cursorPosition.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-32 h-32 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Gradients */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${
            currentGlow === 0
              ? "20% 80%"
              : currentGlow === 1
              ? "80% 20%"
              : "50% 50%"
          }, rgba(var(--primary-rgb, 0, 100, 200), 0.03) 0%, transparent 50%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Content */}
      <div className="container flex flex-col items-center gap-4 text-center max-w-4xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <Badge variant="outline" className="rounded-2xl px-4 py-1.5">
            <motion.span className="mr-2 text-xs">✨</motion.span>
            20+ components
          </Badge>
        </motion.div>

        <motion.h1
          className="font-mono text-2xl sm:text-4xl font-light tracking-tight leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <motion.span>Dinachi</motion.span>
        </motion.h1>

        <motion.div
          className="text-muted-foreground text-xl sm:text-4xl text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <p>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentGlow}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.5 }}
                className="inline-block text-primary font-medium"
              >
                {phrases[currentGlow % phrases.length]}
              </motion.span>
            </AnimatePresence>{" "}
            with
            <br />
            <span className="text-muted-foreground/70">production-ready</span>
            <br /> components.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 min-[400px]:flex-row mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/docs/components"
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-gradient-to-t from-white/0 via-white/20 to-white/0 h-11 px-8 relative overflow-hidden border border-primary-foreground/15",
              })}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r rounded-full from-white/0 via-white/20 to-white/0"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
              <span className="relative z-10">Browse components</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(var(--primary-rgb, 0, 100, 200), 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="outline" size="lg" className="h-11 px-8">
              <Github className="mr-2 h-6 w-6" />
              GitHub
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* CLI Demo Section */}
      <motion.div
        className="container translate-y-3 mx-auto mt-12 relative z-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
      >
        <CLIDemo />
      </motion.div>

      {/* Bottom Gradient Fade */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-15 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />
    </motion.section>
  );
};

export default HeroSection;
