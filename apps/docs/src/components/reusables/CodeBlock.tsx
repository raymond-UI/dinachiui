"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  copyKey?: string;
  maxHeight?: string;
  "aria-label"?: string;
}

export default function CodeBlock({
  children,
  language = "plaintext",
  showLineNumbers = true,
  className,
  copyKey,
  maxHeight = "500px",
  "aria-label": ariaLabel,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Use copyKey if provided, otherwise fall back to a hash of the content
  const effectiveKey = copyKey || btoa(children).slice(0, 8);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={cn(
        "codeblock relative group rounded-lg overflow-hidden w-full border border-border my-4",
        className
      )}
      aria-label={ariaLabel}
    >
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between bg-muted/50 px-4 text-sm">
        <span className="text-muted-foreground font-mono">
          {language !== "plaintext" ? language : "code"}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 sm:opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => copyToClipboard(children, effectiveKey)}
          aria-label="Copy code"
        >
          {copiedStates[effectiveKey] ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Code content */}
      <SyntaxHighlighter
        language={language}
        style={resolvedTheme === "dark" ? oneDark : oneLight}
        showLineNumbers={showLineNumbers}
        wrapLongLines
        wrapLines
        customStyle={{
          margin: 0,
          maxHeight: maxHeight,
          overflowY: "auto",
          fontSize: "0.875rem",
          padding: "1rem",
          background: "transparent",
        }}
        lineNumberStyle={{
          minWidth: "3em",
          paddingRight: "1em",
          textAlign: "left",
          color: "var(--muted-foreground)",
          userSelect: "none",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

// Inline code component for smaller code snippets
interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium",
        className
      )}
    >
      {children}
    </code>
  );
}
