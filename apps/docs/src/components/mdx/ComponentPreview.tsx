"use client";

import { useState, useEffect } from "react";
import type { ComponentExample } from "@/lib/examples-registry";
import { DynamicCodeBlock } from "./DynamicCodeBlock";

type ComponentPreviewProps = {
  name: string;
  title?: string;
  description?: string;
};

type RegistryData = {
  component: React.ComponentType | null;
  code: string | null;
};

export function ComponentPreview({
  name,
  title,
  description,
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false);
  const [registry, setRegistry] = useState<RegistryData | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/lib/examples-registry").then((mod) => {
      if (cancelled) return;
      const Component =
        mod.exampleComponents[name as keyof typeof mod.exampleComponents] ??
        null;
      let code: string | null = null;
      for (const examples of Object.values(
        mod.examplesRegistry as Record<string, ComponentExample[]>
      )) {
        const match = examples.find((ex) => ex.componentId === name);
        if (match) {
          code = match.code;
          break;
        }
      }
      setRegistry({ component: Component, code });
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!registry) {
    return (
      <div className="my-6 rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-center p-6 min-h-[120px] bg-background">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  const { component: Component, code } = registry;

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
