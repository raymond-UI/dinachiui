"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Copy } from "lucide-react";
import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({
        themes: ["github-dark", "github-light"],
        langs: [
          "tsx",
          "typescript",
          "javascript",
          "bash",
          "css",
          "json",
          "html",
        ],
      }),
    );
  }
  return highlighterPromise;
}

type DynamicCodeBlockProps = {
  code: string;
  language?: string;
  maxHeight?: number;
  showHeader?: boolean;
};

export function DynamicCodeBlock({
  code,
  language = "tsx",
  maxHeight,
  showHeader = true,
}: DynamicCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme =
    mounted && resolvedTheme === "light" ? "github-light" : "github-dark";
  const bgColor =
    mounted && resolvedTheme === "light"
      ? "hsl(var(--muted))"
      : "black";

  useEffect(() => {
    getHighlighter().then((highlighter) => {
      const highlighted = highlighter.codeToHtml(code, {
        lang: language,
        theme,
      });
      setHtml(highlighted);
    });
  }, [code, language, theme]);

  useEffect(() => {
    if (html && containerRef.current) {
      const pre = containerRef.current.querySelector("pre");
      if (pre) {
        pre.style.backgroundColor = "transparent";
        pre.style.margin = "0";
      }
    }
  }, [html]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wrapper = (children: React.ReactNode) => (
    <div
      className="rounded-xl border border-border overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-1.5 text-sm border-b border-border/50">
          <span className="text-muted-foreground font-mono text-xs">
            {language !== "plaintext" ? language : "code"}
          </span>
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      )}
      <div
        style={
          maxHeight ? { maxHeight, overflowY: "auto" as const } : undefined
        }
      >
        {children}
      </div>
    </div>
  );

  if (html) {
    return wrapper(
      <div
        ref={containerRef}
        className="[&_pre]:p-4 [&_pre]:text-sm [&_pre]:overflow-x-auto [&_pre]:font-pixel"
        dangerouslySetInnerHTML={{ __html: html }}
      />,
    );
  }

  return wrapper(
    <pre className="p-4 text-sm overflow-x-auto m-0 font-pixel">
      <code className="text-muted-foreground">{code}</code>
    </pre>,
  );
}
