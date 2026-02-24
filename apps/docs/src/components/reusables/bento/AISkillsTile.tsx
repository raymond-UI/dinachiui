"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tile } from "./Tile";
import { buttonVariants } from "@/components/ui/button";

export function AISkillsTile() {
  const [copied, setCopied] = useState(false);
  const command =
    "npx skills add https://github.com/raymond-UI/dinachiui --skill dinachi-assistant -y";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tile delay={0.2} className="h-full">
      <div className="pl-8 pb-4 pt-6">
        <h3 className="text-lg font-medium font-pixel mb-1">AI Skills</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Let your AI agent add, configure, and compose components for you.
        </p>
      </div>
      <div className="pl-8 pr-8 pb-8 space-y-5">
        <div className="group relative">
          <div className="rounded-full bg-muted border border-border overflow-hidden font-mono text-[13px]">
            <div className="flex items-center gap-2 px-5 py-3 overflow-x-auto">
              <span className="text-muted-foreground/50 shrink-0">$</span>
              <code className="text-foreground whitespace-nowrap">
                npx skills add dinachi-assistant
              </code>
              <button
                onClick={handleCopy}
                className="ml-auto shrink-0 text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                {copied
                  ? <Check className="w-3.5 h-3.5" />
                  : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground/60">Works with</span>
          {["Claude Code", "Cursor", "Codex"].map((tool) => (
            <Badge key={tool} variant="outline" size="sm">
              {tool}
            </Badge>
          ))}
        </div>
        <Link
          href="/docs/skills"
          className={buttonVariants({
            variant: "ghost",
            className: "gap-2",
          })}
        >
          Learn more
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Tile>
  );
}
