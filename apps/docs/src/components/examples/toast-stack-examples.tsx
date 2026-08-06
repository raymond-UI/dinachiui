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

function useNotes() {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const next = React.useRef(0);

  const push = () => {
    const template = POOL[next.current % POOL.length];
    next.current += 1;
    setNotes((current) => [{ ...template, id: next.current }, ...current]);
  };

  const remove = (id: number) =>
    setNotes((current) => current.filter((note) => note.id !== id));

  return { notes, push, remove, clear: () => setNotes([]) };
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

export function DefaultToastStackExample() {
  const { notes, push, remove, clear } = useNotes();

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={push}>
          Push a toast
        </Button>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <ToastStack className="h-[260px]">
        {notes.map((note) => (
          <ToastStackItem key={note.id} onDismiss={() => remove(note.id)}>
            <Body note={note} />
            <button
              type="button"
              onClick={() => remove(note.id)}
              className="shrink-0 rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Dismiss
            </button>
          </ToastStackItem>
        ))}
      </ToastStack>

      <p className="text-center text-xs text-muted-foreground">
        Push three and hover the stack. The countdown holds where it is — the second toast
        is deliberately two lines, so the open column has to measure rather than assume.
      </p>
    </div>
  );
}

export function ToastStackDepthExample() {
  const { notes, push, remove, clear } = useNotes();

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={push}>
          Push a toast
        </Button>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      {/* Two deep. Past that, more depth stops reading as more items. */}
      <ToastStack visibleDepth={2} className="h-[220px]">
        {notes.map((note) => (
          <ToastStackItem key={note.id} onDismiss={() => remove(note.id)}>
            <Body note={note} />
          </ToastStackItem>
        ))}
      </ToastStack>

      <p className="text-center text-xs text-muted-foreground">
        Toasts past the visible depth are still rendered, invisibly, so the one moving up
        into the stack fades in rather than appearing whole.
      </p>
    </div>
  );
}

export function ToastStackPersistentExample() {
  const { notes, push, remove, clear } = useNotes();

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={push}>
          Push a toast
        </Button>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear
        </Button>
      </div>

      <ToastStack className="h-[260px]">
        {notes.map((note) => (
          <ToastStackItem
            key={note.id}
            // Nothing here expires on its own. A warning the reader has not seen is not a
            // warning that has been delivered.
            duration={Infinity}
            onDismiss={() => remove(note.id)}
          >
            <Body note={note} />
            <button
              type="button"
              onClick={() => remove(note.id)}
              className="shrink-0 rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Dismiss
            </button>
          </ToastStackItem>
        ))}
      </ToastStack>

      <p className="text-center text-xs text-muted-foreground">
        With <code className="font-mono text-[11px]">duration=&#123;Infinity&#125;</code>{" "}
        the toasts stay until they are flicked away or dismissed.
      </p>
    </div>
  );
}
