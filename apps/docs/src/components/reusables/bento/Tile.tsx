"use client";

import { motion } from "motion/react";

export function Tile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-150px" }}
      className={`relative rounded-md border border-border/60 bg-card overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
