"use client";

import { useCallback, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";

interface PlaygroundInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PlaygroundInput({ value, onChange, onSubmit, isLoading }: PlaygroundInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    onChange("");
  }, [value, isLoading, onSubmit, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <motion.div
      className="border-t border-border/60 bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-end gap-2 relative">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute left-3.5 top-3 text-muted-foreground/40">
            <Sparkles className="h-4 w-4" />
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the UI you want to generate..."
            rows={1}
            disabled={isLoading}
            className="w-full resize-none border border-border/60 bg-background py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50 transition-all duration-200"
          />
          {value.length > 0 && (
            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/40">
              {value.length}
            </span>
          )}
        </div>
        <motion.button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="flex absolute bottom-2 right-2 h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
