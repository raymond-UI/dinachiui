"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { HoldToConfirm } from "@/components/ui/hold-to-confirm";

export function DefaultHoldToConfirmExample() {
  return (
    <HoldToConfirm confirmedLabel="Deleted">Hold to delete</HoldToConfirm>
  );
}

export function HoldToConfirmVariantsExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <HoldToConfirm confirmedLabel="Deleted">Fill</HoldToConfirm>

      <HoldToConfirm variant="border" confirmedLabel="Deleted">
        Border
      </HoldToConfirm>

      {/* Icon-only, so the name has to come from somewhere other than the label. */}
      <HoldToConfirm variant="ring" aria-label="Hold to delete project">
        <Trash2 className="h-4 w-4" />
      </HoldToConfirm>
    </div>
  );
}

/**
 * A shorter hold for an action that is merely annoying to undo, and a confirmed state
 * that stays put because the row it belongs to is about to disappear anyway.
 */
export function HoldToConfirmTuningExample() {
  const [log, setLog] = React.useState<string[]>([]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <HoldToConfirm
          duration={800}
          confirmedLabel="Revoked"
          onConfirm={() => setLog((entries) => ["Revoked a key", ...entries])}
        >
          Hold briefly
        </HoldToConfirm>

        <HoldToConfirm
          resetAfter={0}
          confirmedLabel="Deleted"
          onConfirm={() => setLog((entries) => ["Deleted a project", ...entries])}
        >
          Stays confirmed
        </HoldToConfirm>
      </div>

      <p className="h-5 text-sm text-muted-foreground">{log[0] ?? " "}</p>
    </div>
  );
}
