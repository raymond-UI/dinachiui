"use client";

import { Renderer, JSONUIProvider } from "@json-render/react";
import type { Spec } from "@json-render/core";
import { registry, toastManager } from "@dinachi/json-render";
import { Toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaygroundRendererProps {
  spec: Spec | null;
  isLoading: boolean;
}

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

export function PlaygroundRenderer({
  spec,
  isLoading,
}: PlaygroundRendererProps) {
  if (!spec) {
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
        registry={registry}
        initialState={spec.state ?? {}}
        actionHandlers={actionHandlers}
      >
        <Renderer
          spec={spec}
          registry={registry}
          loading={isLoading}
        />
      </JSONUIProvider>
      <Toast toastManager={toastManager} />
    </>
  );
}
