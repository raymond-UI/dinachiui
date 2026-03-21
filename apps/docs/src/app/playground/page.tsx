"use client";

import { useCallback, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AnimatePresence, motion } from "motion/react";
import { Layers, RotateCcw, X } from "lucide-react";
import { specSchema } from "@/lib/spec-schema";
import { PlaygroundInput } from "@/components/playground/playground-input";
import { PromptChips } from "@/components/playground/prompt-chips";
import { SpecViewer } from "@/components/playground/spec-viewer";
import { PlaygroundRenderer } from "@/components/playground/playground-renderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PlaygroundPage() {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/generate-ui",
    schema: specSchema,
  });

  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = useCallback(
    (prompt: string) => {
      setLastPrompt(prompt);
      setShowResults(true);
      submit({ prompt });
    },
    [submit],
  );

  const handleClear = useCallback(() => {
    setShowResults(false);
    setLastPrompt(null);
  }, []);

  const handleRegenerate = useCallback(() => {
    if (lastPrompt) {
      submit({ prompt: lastPrompt });
      setShowResults(true);
    }
  }, [lastPrompt, submit]);

  const hasResults = showResults && (object || isLoading);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)]">
      {/* Left panel — rendered UI only */}
      <div className="flex-1 overflow-auto p-6">
        {hasResults ? (
          <PlaygroundRenderer
            spec={object as Record<string, unknown> | undefined}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground/30">
              <Layers className="h-10 w-10" />
              <p className="text-sm">Your generated UI will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Right panel — chat / controls */}
      <div className="flex w-[30%] min-w-[320px] max-w-[420px] flex-col border-l">
        {/* Header */}
        <motion.div
          className="shrink-0 border-b px-4 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-pixel text-lg tracking-tight">Playground</h1>
            {hasResults && (
              <Badge variant={isLoading ? "warning" : "success"} size="sm">
                {isLoading ? "streaming" : "rendered"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground/70">
            Describe a UI and watch it come to life
          </p>
        </motion.div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto p-4">
          <AnimatePresence mode="wait">
            {!hasResults && !error && (
              <motion.div
                key="chips"
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-1">
                  <h2 className="text-sm font-medium text-foreground">
                    What would you like to build?
                  </h2>
                  <p className="text-xs text-muted-foreground/70">
                    Pick an example or describe your own
                  </p>
                </div>
                <PromptChips onSelect={setInputValue} />
              </motion.div>
            )}

            {hasResults && (
              <motion.div
                key="results-panel"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Last prompt + toolbar */}
                {lastPrompt && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {lastPrompt}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRegenerate}
                        disabled={isLoading}
                      >
                        <RotateCcw className="mr-1.5 h-3 w-3" />
                        Regenerate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        disabled={isLoading}
                      >
                        <X className="mr-1.5 h-3 w-3" />
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                {/* Spec viewer */}
                <SpecViewer spec={object} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              <p className="font-medium">Generation failed</p>
              <p className="mt-1 text-xs text-destructive/70">{error.message}</p>
              {lastPrompt && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleRegenerate}
                  className="mt-2 h-auto p-0 text-xs text-destructive hover:text-destructive/90"
                >
                  Try again
                </Button>
              )}
            </motion.div>
          )}
        </div>

        {/* Pinned input */}
        <div className="shrink-0">
          <PlaygroundInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
