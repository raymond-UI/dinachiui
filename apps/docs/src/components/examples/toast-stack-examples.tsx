"use client";

import * as React from "react";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { ToastStack, ToastStackItem } from "@/components/ui/toast-stack";
import {
  ToastProvider,
  ToastTitle,
  ToastDescription,
  useToastManager,
  createToastManager,
} from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

type Tone = "ok" | "info" | "warn";

const ICON: Record<Tone, React.ComponentType<{ className?: string }>> = {
  ok: CheckCircle2,
  info: Info,
  warn: TriangleAlert,
};

const COLOUR: Record<Tone, string> = {
  ok: "text-emerald-500",
  info: "text-primary",
  warn: "text-amber-500",
};

const POOL = [
  { title: "Saved", description: "Draft synced to the server", tone: "ok" },
  {
    title: "Heads up",
    description:
      "Two collaborators are editing this page right now, and their changes will merge on save.",
    tone: "info",
  },
  { title: "Quota at 90%", description: "Storage · workspace plan", tone: "warn" },
  { title: "Copied", description: "Install command on the clipboard", tone: "ok" },
] satisfies { title: string; description: string; tone: Tone }[];

/** The reserved area, so it reads as a place rather than as a gap. */
function Frame({ children }: { children: React.ReactNode }) {
  const { toasts } = useToastManager();

  return (
    <div className="relative rounded-xl border border-dashed border-border p-3">
      {children}
      {toasts.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            Pushed toasts land here
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The stack renders whatever is in the queue.
 *
 * Nothing here holds a list of its own. `toasts` is Toast's queue, and this component only
 * decides how it looks.
 */
function Stack({ visibleDepth }: { visibleDepth?: number }) {
  const { toasts, close } = useToastManager();

  return (
    <ToastStack visibleDepth={visibleDepth} className="h-[230px]">
      {toasts.map((toast) => {
        const tone = (toast.data?.tone ?? "ok") as Tone;
        const Icon = ICON[tone];

        return (
          <ToastStackItem key={toast.id} toast={toast}>
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${COLOUR[tone]}`} />
            <div className="min-w-0 flex-1">
              <ToastTitle className="text-sm font-medium text-foreground">
                {toast.title}
              </ToastTitle>
              <ToastDescription className="text-xs text-muted-foreground opacity-100">
                {toast.description}
              </ToastDescription>
            </div>
            <button
              type="button"
              onClick={() => close(toast.id)}
              className="shrink-0 rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Dismiss
            </button>
          </ToastStackItem>
        );
      })}
    </ToastStack>
  );
}

/**
 * Push and clear, plus `seed` toasts already in the stack on arrival.
 *
 * A stack you have to press a button to see is an empty box on arrival, and the reserved
 * space reads as something failing to render rather than as somewhere toasts will land.
 */
function Controls({ seed = 0 }: { seed?: number }) {
  const { add, close } = useToastManager();
  const next = React.useRef(0);

  const push = React.useCallback(() => {
    const { tone, ...message } = POOL[next.current % POOL.length];
    next.current += 1;
    // No timing here. How long a toast lasts is the provider's, the same as it is for
    // Toast, and a second countdown in the stack is how one gets dismissed mid-sentence.
    add({ ...message, data: { tone } });
  }, [add]);

  const seeded = React.useRef(false);
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    for (let i = 0; i < seed; i += 1) push();
  }, [push, seed]);

  return (
    <PreviewAction>
      <Button variant="outline" size="sm" onClick={push}>
        Push a toast
      </Button>
      <Button variant="outline" size="sm" onClick={() => close()}>
        Clear
      </Button>
    </PreviewAction>
  );
}

/**
 * One preview: its own queue, so pushing in one does not fill the next one down the page.
 *
 * `limit` is set past anything these buttons will produce. It is the provider's cap on how
 * many toasts exist at once, and here the stack's own `visibleDepth` is what decides how
 * many are drawn.
 */
function Preview({
  seed,
  timeout,
  visibleDepth,
}: {
  seed?: number;
  timeout?: number;
  visibleDepth?: number;
}) {
  const manager = React.useMemo(() => createToastManager(), []);

  return (
    <ToastProvider toastManager={manager} timeout={timeout} limit={20}>
      <div className="w-full max-w-sm">
        <Controls seed={seed} />
        <Frame>
          <Stack visibleDepth={visibleDepth} />
        </Frame>
      </div>
    </ToastProvider>
  );
}

export function DefaultToastStackExample() {
  // Three already there, so the collapsed stack is what loads. The second is deliberately
  // two lines, so the open column has to measure rather than assume. `timeout={0}` keeps
  // them until they are dismissed, so they are still here when you scroll to them.
  return <Preview seed={3} timeout={0} />;
}

export function ToastStackDepthExample() {
  // Two deep. Past that, more depth stops reading as more items. Four are pushed, so the
  // fourth is present and invisible from the start.
  return <Preview seed={4} timeout={0} visibleDepth={2} />;
}

export function ToastStackTimeoutExample() {
  // The countdown belongs to Toast's provider, not to the stack. Hovering pauses it,
  // because Base UI pauses the timers for the same reason the stack expands: the reader is
  // looking at it.
  return <Preview timeout={5000} />;
}
