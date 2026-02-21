"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useComponentSource } from "./ComponentSourceProvider";
import { DynamicCodeBlock } from "./DynamicCodeBlock";

type InstallTabsProps = {
  cli: string;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

export function InstallTabs({ cli }: InstallTabsProps) {
  const [activeTab, setActiveTab] = useState<"cli" | "manual">("cli");
  const { source, dependencies } = useComponentSource();

  return (
    <div className="my-4">
      <div className="flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("cli")}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "cli"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          CLI
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "manual"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Manual
        </button>
      </div>

      {activeTab === "cli" && (
        <div className="pt-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted px-4 py-3">
            <code className="text-sm text-foreground font-mono">{cli}</code>
            <CopyButton text={cli} />
          </div>
        </div>
      )}

      {activeTab === "manual" && (
        <div className="pt-4 space-y-4">
          {dependencies.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Install dependencies:
              </p>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted px-4 py-3">
                <code className="text-sm text-foreground font-mono">
                  npm install {dependencies.join(" ")}
                </code>
                <CopyButton
                  text={`npm install ${dependencies.join(" ")}`}
                />
              </div>
            </div>
          )}

          {source && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Copy and paste the component into your project:
              </p>
              <div className="relative">
                <div className="absolute right-3 top-3 z-10">
                  <CopyButton text={source} />
                </div>
                <DynamicCodeBlock code={source} maxHeight={320} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
