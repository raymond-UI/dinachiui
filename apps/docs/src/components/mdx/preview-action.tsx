"use client";

import { createContext, useContext } from "react";
import { createPortal } from "react-dom";

/**
 * The header's right-hand slot.
 *
 * `undefined` means no surrounding preview, `null` means the slot has not mounted yet.
 */
export const ActionSlotContext = createContext<HTMLElement | null | undefined>(
  undefined
);

/**
 * Lifts a demo's own control (a replay button, a toggle) out of the preview body and
 * into the header, where it reads as chrome rather than as part of the component.
 *
 * The control stays a child of the example, so it keeps its state and handlers; only
 * the DOM position moves.
 *
 * Its own module rather than `ComponentPreview.tsx`, because the examples that use it
 * are themselves reached through the examples registry that `ComponentPreview` imports.
 * Taking it from there would close a cycle: example → preview → registry → example.
 */
export function PreviewAction({ children }: { children: React.ReactNode }) {
  const slot = useContext(ActionSlotContext);
  if (slot === undefined) return <>{children}</>;
  return slot ? createPortal(children, slot) : null;
}
