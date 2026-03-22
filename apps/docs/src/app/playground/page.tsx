"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUIStream } from "@json-render/react";
import type { Spec } from "@json-render/core";
import { AnimatePresence, motion } from "motion/react";
import { Layers, RotateCcw, X, Copy, Check } from "lucide-react";
import { PlaygroundInput } from "@/components/playground/playground-input";
import { PromptChips } from "@/components/playground/prompt-chips";
import { PlaygroundRenderer } from "@/components/playground/playground-renderer";
import { specToCode } from "@/components/playground/spec-to-code";
import { DynamicCodeBlock } from "@/components/mdx/DynamicCodeBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Tab = "stream" | "spec" | "catalog";
type PreviewTab = "live" | "code";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }}
      className="rounded p-1.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function StreamView({ rawLines }: { rawLines: string[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rawLines.length]);

  if (rawLines.length === 0) {
    return (
      <p className="text-xs text-muted-foreground/50 italic">
        Patches will appear here as they stream in...
      </p>
    );
  }

  return (
    <div className="space-y-1 font-mono text-[11px] leading-relaxed">
      {rawLines.map((line, i) => (
        <div key={i} className="text-muted-foreground break-all">
          <span className="text-muted-foreground/40 mr-2 select-none">
            {String(i + 1).padStart(2, " ")}
          </span>
          {line}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function SpecView({ spec }: { spec: Spec | null }) {
  const [copied, setCopied] = useState(false);
  const jsonString = spec ? JSON.stringify(spec, null, 2) : "";

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!spec) {
    return (
      <p className="text-xs text-muted-foreground/50 italic">
        Compiled spec will appear here after generation...
      </p>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(jsonString);
          setCopied(true);
        }}
        className="absolute top-0 right-0 rounded p-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
      >
        {copied ? (
          <Check className="h-3 w-3 text-emerald-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
      <pre className="font-mono text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap break-all">
        {jsonString}
      </pre>
    </div>
  );
}

function CatalogView() {
  // Static catalog info from our component definitions
  const components = [
    { name: "Box", desc: "Flex layout container", props: "direction, gap, align, justify, wrap, padding", container: true },
    { name: "Card", desc: "Content section with header", props: "title?, description?", container: true },
    { name: "Tabs", desc: "Tabbed navigation", props: "tabs, defaultValue, statePath?", container: true },
    { name: "Dialog", desc: "Modal overlay", props: "title, description?, statePath", container: true },
    { name: "AlertDialog", desc: "Confirmation dialog", props: "title, description?, statePath, actionLabel?, cancelLabel?", container: true },
    { name: "Drawer", desc: "Slide-in panel", props: "title, description?, side?, statePath", container: true },
    { name: "Popover", desc: "Floating panel", props: "triggerText, side?, align?", container: true },
    { name: "Collapsible", desc: "Expandable section", props: "triggerText, defaultOpen?", container: true },
    { name: "ScrollArea", desc: "Scrollable container", props: "maxHeight?, orientation?", container: true },
    { name: "Fieldset", desc: "Form field group", props: "legend?, disabled?", container: true },
    { name: "Text", desc: "Display text", props: "content, variant?" },
    { name: "Button", desc: "Clickable button", props: "label, variant?, size?, disabled?" },
    { name: "Input", desc: "Text input", props: "label?, type?, placeholder?, statePath?" },
    { name: "Textarea", desc: "Multi-line input", props: "label?, placeholder?, rows?, statePath?" },
    { name: "Checkbox", desc: "Checkbox toggle", props: "label, statePath?" },
    { name: "Switch", desc: "Toggle switch", props: "label, statePath?" },
    { name: "Radio", desc: "Radio group", props: "label?, options, statePath?" },
    { name: "Select", desc: "Dropdown select", props: "label?, placeholder?, options, statePath?" },
    { name: "Slider", desc: "Range slider", props: "label?, min?, max?, step?, statePath?" },
    { name: "Toggle", desc: "Toggle button", props: "label, variant?, size?, statePath?" },
    { name: "NumberField", desc: "Numeric input", props: "label?, min?, max?, step?, statePath?" },
    { name: "ToggleGroup", desc: "Toggle button group", props: "options, variant?, size?, statePath?" },
    { name: "Label", desc: "Form label", props: "text, htmlFor?" },
    { name: "Badge", desc: "Status indicator", props: "text, variant?, size?" },
    { name: "Separator", desc: "Visual divider", props: "orientation?" },
    { name: "Skeleton", desc: "Loading placeholder", props: "width, height" },
    { name: "Progress", desc: "Progress bar", props: "value, label?" },
    { name: "Accordion", desc: "Collapsible sections", props: "items, multiple?, collapsible?" },
    { name: "Tooltip", desc: "Hover tooltip", props: "content, text, side?" },
    { name: "Avatar", desc: "User avatar", props: "src?, fallback?, alt?, size?" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium text-foreground">
          components
        </span>
        <span className="text-[10px] text-muted-foreground/50">
          ({components.length})
        </span>
      </div>
      <div className="space-y-2">
        {components.map((c) => (
          <div key={c.name} className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-foreground">
                {c.name}
              </span>
              {c.container && (
                <span className="text-[9px] text-muted-foreground/40">
                  container
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground/60">{c.desc}</p>
            <div className="flex flex-wrap gap-1">
              {c.props.split(", ").map((prop) => (
                <span
                  key={prop}
                  className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
                >
                  {prop}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  const { spec, send, clear, isStreaming, error, rawLines } = useUIStream({
    api: "/api/generate-ui",
  });

  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("stream");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("live");

  const codeString = useMemo(
    () => (spec ? specToCode(spec) : ""),
    [spec],
  );

  const handleSubmit = useCallback(
    (prompt: string) => {
      setLastPrompt(prompt);
      setShowResults(true);
      setActiveTab("stream");
      send(prompt);
    },
    [send],
  );

  const handleClear = useCallback(() => {
    setShowResults(false);
    setLastPrompt(null);
    clear();
  }, [clear]);

  const handleRegenerate = useCallback(() => {
    if (lastPrompt) {
      setActiveTab("stream");
      send(lastPrompt);
      setShowResults(true);
    }
  }, [lastPrompt, send]);

  const hasResults = showResults && (spec || isStreaming);

  const tabs: { key: Tab; label: string }[] = [
    { key: "stream", label: "stream" },
    { key: "spec", label: "spec" },
    { key: "catalog", label: "catalog" },
  ];

  return (
    <div className="flex h-[calc(100dvh-3.5rem)]">
      {/* Left panel — preview */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Preview tabs */}
        {hasResults && (
          <div className="shrink-0 flex items-center justify-between border-b px-4">
            <div className="flex items-center gap-0">
              {(["live", "code"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPreviewTab(tab)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    previewTab === tab
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground/60 hover:text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {previewTab === "code" && codeString && (
              <CopyButton text={codeString} />
            )}
          </div>
        )}

        {/* Preview content */}
        <div className="flex-1 overflow-auto p-6">
          {!hasResults ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground/30">
                <Layers className="h-10 w-10" />
                <p className="text-sm">Your generated UI will appear here</p>
              </div>
            </div>
          ) : previewTab === "live" ? (
            <PlaygroundRenderer spec={spec} isLoading={isStreaming} />
          ) : (
            <div className="[&>div]:rounded-none [&>div]:border-0">
              <DynamicCodeBlock
                code={codeString}
                language="tsx"
                showHeader={false}
              />
            </div>
          )}
        </div>
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
            <div className="flex items-center gap-1">
              {hasResults && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isStreaming}
                    className="h-7 px-2 text-xs"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Redo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={isStreaming}
                    className="h-7 px-2 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                </>
              )}
              {hasResults && (
                <Badge variant={isStreaming ? "warning" : "success"} size="sm">
                  {isStreaming ? "streaming" : "ready"}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Describe a UI and watch it come to life
          </p>
        </motion.div>

        {/* Tabs */}
        {hasResults && (
          <div className="shrink-0 flex items-center gap-0 border-b px-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground/60 hover:text-muted-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

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
                key={`tab-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "stream" && <StreamView rawLines={rawLines} />}
                {activeTab === "spec" && <SpecView spec={spec} />}
                {activeTab === "catalog" && <CatalogView />}
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
              <p className="mt-1 text-xs text-destructive/70">
                {error.message}
              </p>
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
            isLoading={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
