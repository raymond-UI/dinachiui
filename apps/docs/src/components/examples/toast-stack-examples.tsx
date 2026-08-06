"use client";

import * as React from "react";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { ToastStack, ToastStackItem } from "@/components/ui/toast-stack";
import { Button } from "@/components/ui/button";

type Tone = "ok" | "info" | "warn";

interface Note {
  id: number;
  title: string;
  detail: string;
  tone: Tone;
}

const ICON: Record<Tone, React.ComponentType<{ className?: string }>> = {
  ok: CheckCircle2,
  info: Info,
  warn: TriangleAlert,
};

const TONE: Record<Tone, string> = {
  ok: "text-emerald-500",
  info: "text-primary",
  warn: "text-amber-500",
};

const POOL: Omit<Note, "id">[] = [
  { title: "Saved", detail: "Draft synced to the server", tone: "ok" },
  {
    title: "Heads up",
    detail:
      "Two collaborators are editing this page right now, and their changes will merge on save.",
    tone: "info",
  },
  { title: "Quota at 90%", detail: "Storage · workspace plan", tone: "warn" },
  { title: "Copied", detail: "Install command on the clipboard", tone: "ok" },
];

/**
 * `seed` toasts already in the stack.
 *
 * A stack you have to press a button to see is an empty box on arrival, and the reserved
 * space reads as something failing to render rather than as somewhere toasts will land.
 */
function useNotes(seed = 0) {
  const next = React.useRef(seed);
  const [notes, setNotes] = React.useState<Note[]>(() =>
    Array.from({ length: seed }, (_, i) => ({
      ...POOL[(seed - 1 - i) % POOL.length],
      id: seed - i,
    }))
  );

  const push = () => {
    const template = POOL[next.current % POOL.length];
    next.current += 1;
    setNotes((current) => [{ ...template, id: next.current }, ...current]);
  };

  const remove = (id: number) =>
    setNotes((current) => current.filter((note) => note.id !== id));

  return { notes, push, remove, clear: () => setNotes([]) };
}

/** The reserved area, so it reads as a place rather than as a gap. */
function Viewport({
  empty,
  children,
}: {
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl border border-dashed border-border p-3">
      {children}
      {empty ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            Pushed toasts land here
          </span>
        </div>
      ) : null}
    </div>
  );
}

function Body({ note }: { note: Note }) {
  const Icon = ICON[note.tone];

  return (
    <>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${TONE[note.tone]}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{note.title}</p>
        <p className="text-xs text-muted-foreground">{note.detail}</p>
      </div>
    </>
  );
}

function Controls({ push, clear }: { push: () => void; clear: () => void }) {
  return (
    <div className="flex justify-center gap-2">
      <Button variant="outline" size="sm" onClick={push}>
        Push a toast
      </Button>
      <Button variant="outline" size="sm" onClick={clear}>
        Clear
      </Button>
    </div>
  );
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Dismiss
    </button>
  );
}

export function DefaultToastStackExample() {
  // Three already there, so the collapsed stack is what loads. The second is deliberately
  // two lines, so the open column has to measure rather than assume.
  const { notes, push, remove, clear } = useNotes(3);

  return (
    <div className="w-full max-w-sm space-y-3">
      <Controls push={push} clear={clear} />

      <Viewport empty={notes.length === 0}>
        <ToastStack className="h-[230px]">
          {notes.map((note) => (
            <ToastStackItem key={note.id} onDismiss={() => remove(note.id)}>
              <Body note={note} />
              <DismissButton onClick={() => remove(note.id)} />
            </ToastStackItem>
          ))}
        </ToastStack>
      </Viewport>

      <p className="text-center text-xs text-muted-foreground">
        Hover the stack to open it. The countdown holds where it is.
      </p>
    </div>
  );
}

export function ToastStackDepthExample() {
  const { notes, push, remove, clear } = useNotes(4);

  return (
    <div className="w-full max-w-sm space-y-3">
      <Controls push={push} clear={clear} />

      <Viewport empty={notes.length === 0}>
        {/* Two deep. Past that, more depth stops reading as more items. Four are pushed,
            so the fourth is present and invisible from the start. */}
        <ToastStack visibleDepth={2} className="h-[190px]">
          {notes.map((note) => (
            <ToastStackItem key={note.id} onDismiss={() => remove(note.id)}>
              <Body note={note} />
            </ToastStackItem>
          ))}
        </ToastStack>
      </Viewport>

      <p className="text-center text-xs text-muted-foreground">
        Toasts past the visible depth are still rendered, invisibly, so the one moving up
        into the stack fades in rather than appearing whole.
      </p>
    </div>
  );
}

export function ToastStackPersistentExample() {
  const { notes, push, remove, clear } = useNotes(3);

  return (
    <div className="w-full max-w-sm space-y-3">
      <Controls push={push} clear={clear} />

      <Viewport empty={notes.length === 0}>
        <ToastStack className="h-[230px]">
          {notes.map((note) => (
            <ToastStackItem
              key={note.id}
              // Nothing here expires on its own. A warning the reader has not seen is not a
              // warning that has been delivered.
              duration={Infinity}
              onDismiss={() => remove(note.id)}
            >
              <Body note={note} />
              <DismissButton onClick={() => remove(note.id)} />
            </ToastStackItem>
          ))}
        </ToastStack>
      </Viewport>

      <p className="text-center text-xs text-muted-foreground">
        With <code className="font-mono text-[11px]">duration=&#123;Infinity&#125;</code>{" "}
        the toasts stay until they are flicked away or dismissed.
      </p>
    </div>
  );
}
