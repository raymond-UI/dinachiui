"use client";

import { useState, useEffect } from "react";
import type { ComponentExample } from "@/lib/examples-registry";
import { DynamicCodeBlock } from "./DynamicCodeBlock";
import { ActionSlotContext } from "./preview-action";

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
  // A state setter as the ref callback, so the portal re-runs once the node exists.
  const [actionSlot, setActionSlot] = useState<HTMLElement | null>(null);

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
      <div className="my-6 rounded-xl border border-border overflow-clip">
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
    <div className="my-6 rounded-xl border border-border overflow-clip">
      {/* The slot has to stay mounted for `PreviewAction` to portal into, so the header
          cannot be guarded away. It collapses instead: an empty slot with no title
          beside it means there is nothing to show. */}
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 has-[>div:only-child:empty]:hidden">
        {(title || description) && (
          <div className="min-w-0">
            {title && (
              <h4 className="text-sm font-medium text-foreground">{title}</h4>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div
          ref={setActionSlot}
          className="flex shrink-0 items-center gap-2 empty:hidden"
        />
      </div>

      <div className="flex items-center justify-center p-6 min-h-[120px] bg-background">
        <ActionSlotContext.Provider value={actionSlot}>
          <Component />
        </ActionSlotContext.Provider>
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
