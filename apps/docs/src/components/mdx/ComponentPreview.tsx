"use client";

import { useState } from "react";
import { exampleComponents, examplesRegistry } from "@/lib/examples-registry";
import { DynamicCodeBlock } from "./DynamicCodeBlock";

type ComponentPreviewProps = {
  name: string;
  title?: string;
  description?: string;
};

function findExampleCode(componentId: string): string | null {
  for (const examples of Object.values(examplesRegistry)) {
    const match = examples.find((ex) => ex.componentId === componentId);
    if (match) return match.code;
  }
  return null;
}

export function ComponentPreview({
  name,
  title,
  description,
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false);

  const Component =
    exampleComponents[name as keyof typeof exampleComponents] ?? null;
  const code = findExampleCode(name);

  if (!Component) {
    return (
      <div className="my-6 rounded-xl border border-border p-6 text-center text-muted-foreground">
        <p>Example &quot;{name}&quot; not found</p>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl border border-border overflow-hidden">
      {(title || description) && (
        <div className="border-b border-border px-4 py-3">
          {title && (
            <h4 className="text-sm font-medium text-foreground">{title}</h4>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-center p-6 min-h-[120px] bg-background">
        <Component />
      </div>

      {code && (
        <>
          <div className="border-t border-border px-4 py-2 flex justify-end bg-muted/30">
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showCode ? "Hide Code" : "Show Code"}
            </button>
          </div>

          {showCode && (
            <div className="border-t border-border [&>div]:rounded-none [&>div]:border-0">
              <DynamicCodeBlock code={code} maxHeight={400} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
