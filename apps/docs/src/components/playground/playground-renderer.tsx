"use client";

import { useMemo, useRef } from "react";
import {
  Renderer,
  JSONUIProvider,
  createDinachiCatalog,
  createDinachiRegistry,
  toastManager,
} from "@dinachi/json-render";
import type { Spec } from "@dinachi/json-render";
import { Toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaygroundRendererProps {
  spec: Record<string, unknown> | undefined;
  isLoading: boolean;
}

/**
 * Converts a partial streaming spec (array-based elements) to a renderable Spec.
 *
 * IMPORTANT: This function must NOT mutate the input — the `object` from
 * useObject is a live reference that React tracks. Mutating it causes
 * infinite re-render loops.
 */
function toRenderableSpec(
  partial: Record<string, unknown>,
): Spec | null {
  const root = partial.root as string | undefined;
  const elementsArray = partial.elements as
    | Array<Record<string, unknown>>
    | undefined;

  if (!root || !Array.isArray(elementsArray) || elementsArray.length === 0) return null;

  const elementsMap: Record<string, Record<string, unknown>> = {};
  for (const el of elementsArray) {
    if (!el || typeof el !== "object" || !el.key || !el.type) continue;
    const key = el.key as string;
    const { key: _, ...rest } = el;
    elementsMap[key] = {
      ...rest,
      props: (rest.props as Record<string, unknown>) ?? {},
    };
  }

  if (!elementsMap[root]) return null;

  // Filter children — create NEW arrays, never mutate input
  for (const [k, el] of Object.entries(elementsMap)) {
    if (Array.isArray(el.children)) {
      elementsMap[k] = {
        ...el,
        children: (el.children as string[]).filter(
          (childKey) => typeof childKey === "string" && childKey in elementsMap,
        ),
      };
    }
  }

  return {
    root,
    elements: elementsMap as unknown as Spec["elements"],
    state: (partial.state as Record<string, unknown>) ?? undefined,
  };
}

const registryResult = (() => {
  const catalog = createDinachiCatalog();
  return createDinachiRegistry(catalog);
})();

const actionHandlers: Record<string, (params: Record<string, unknown>) => Promise<void>> = {
  navigate: async (params) => {
    const url = params.url as string | undefined;
    if (!url) return;
    if (params.target === "_blank") {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  },
  submit: async (params) => {
    const formId = params.formId as string | undefined;
    if (formId) {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      form?.requestSubmit();
    }
  },
  showToast: async (params) => {
    const title = params.title as string | undefined;
    if (!title) return;
    toastManager.add({
      title,
      description: (params.description as string) ?? undefined,
      type: (params.variant as string) ?? "default",
      timeout: (params.timeout as number) ?? 5000,
    });
  },
};

const EMPTY_STATE = {};

export function PlaygroundRenderer({
  spec,
  isLoading,
}: PlaygroundRendererProps) {
  // Memoize spec conversion — only recompute when the raw spec reference changes
  const renderableSpec = useMemo(
    () => (spec ? toRenderableSpec(spec) : null),
    [spec],
  );

  // Stabilize initialState — capture on first valid spec, don't change during streaming
  const initialStateRef = useRef<Record<string, unknown>>(EMPTY_STATE);
  if (renderableSpec?.state && initialStateRef.current === EMPTY_STATE) {
    initialStateRef.current = renderableSpec.state;
  }

  // Reset when we get a completely new generation (spec goes null → non-null)
  const hadSpecRef = useRef(false);
  if (!renderableSpec) {
    hadSpecRef.current = false;
    initialStateRef.current = EMPTY_STATE;
  } else if (!hadSpecRef.current) {
    hadSpecRef.current = true;
    initialStateRef.current = renderableSpec.state ?? EMPTY_STATE;
  }

  if (!renderableSpec) {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-3 rounded-full" />
            <span className="animate-pulse text-sm text-muted-foreground">
              Generating your UI...
            </span>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <JSONUIProvider
        registry={registryResult.registry}
        initialState={initialStateRef.current}
        actionHandlers={actionHandlers}
      >
        <Renderer
          spec={renderableSpec}
          registry={registryResult.registry}
          loading={isLoading}
        />
      </JSONUIProvider>
      <Toast toastManager={toastManager} />
    </>
  );
}
