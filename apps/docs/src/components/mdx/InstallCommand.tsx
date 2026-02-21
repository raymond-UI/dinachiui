"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type InstallCommandProps = {
  cli: string;
};

export function InstallCommand({ cli }: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cli);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 flex items-center justify-between gap-4 rounded-xl border border-border bg-black px-4 py-3">
      <code className="text-sm text-foreground font-mono">{cli}</code>
      <button
        onClick={handleCopy}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
