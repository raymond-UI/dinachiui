"use client";

import { useEffect, useRef, useState } from "react";
import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({
        themes: ["github-dark"],
        langs: ["tsx"],
      }),
    );
  }
  return highlighterPromise;
}

type DynamicCodeBlockProps = {
  code: string;
  language?: string;
  maxHeight?: number;
};

export function DynamicCodeBlock({
  code,
  language = "tsx",
  maxHeight,
}: DynamicCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHighlighter().then((highlighter) => {
      const highlighted = highlighter.codeToHtml(code, {
        lang: language,
        theme: "github-dark",
      });
      setHtml(highlighted);
    });
  }, [code, language]);

  // After shiki renders, override the pre background to match our theme
  useEffect(() => {
    if (html && containerRef.current) {
      const pre = containerRef.current.querySelector("pre");
      if (pre) {
        pre.style.backgroundColor = "black";
        pre.style.margin = "0";
      }
    }
  }, [html]);

  if (html) {
    return (
      <div
        className="rounded-xl border border-primary/20 overflow-hidden bg-black"
        style={maxHeight ? { maxHeight, overflowY: "auto" as const } : undefined}
      >
        <div
          ref={containerRef}
          className="[&_pre]:p-4 [&_pre]:text-sm [&_pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  // Fallback: plain text before shiki loads
  return (
    <div
      className="rounded-xl border border-primary/20 overflow-hidden bg-black"
      style={maxHeight ? { maxHeight, overflowY: "auto" as const } : undefined}
    >
      <pre className="p-4 text-sm overflow-x-auto bg-black m-0">
        <code className="text-muted-foreground">{code}</code>
      </pre>
    </div>
  );
}
