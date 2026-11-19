import type * as React from "react";

/*
 * What a component's playground declares. The workbench draws the controls, the stage,
 * the anatomy overlay, the agent panel and the code from it, so every component page
 * works the same way and a playground only says what is particular to its component.
 */

export type Control =
  | { name: string; type: "boolean"; default: boolean }
  | { name: string; type: "text"; default: string }
  | { name: string; type: "select"; options: readonly string[]; default: string }
  | { name: string; type: "number"; default: number; min?: number; max?: number; step?: number };

export type Values = Record<string, string | number | boolean>;

export interface DemoProps<V extends Values = Values> {
  values: V;
  /**
   * The Anatomy view is showing. Open whatever the component keeps closed (a popup, a
   * panel) so its parts can be outlined, unless opening it would cover the page or trap
   * focus.
   */
  anatomy: boolean;
  /** "Refuse agent changes" is on: cancel any change where `isAgentChange(details)`. */
  refuse: boolean;
}

/** One button in the Agent view: a real `agent.act()` step against the demo. */
export interface AgentTry {
  label: string;
  action: string;
  args?: unknown[];
  /** Which snapshot entry to act on, when the demo holds more than one. Matches `label`. */
  target?: string;
}

export interface PlaygroundDef<V extends Values = Values> {
  /** One per prop worth trying. Names are the prop names as written in code. */
  controls: Control[];
  Demo: React.ComponentType<DemoProps<V>>;
  /** The code for exactly what is on stage. */
  code: (values: V, opts: { refuse: boolean }) => string;
  /** The file name shown above the code, e.g. `region-picker.tsx`. */
  file: string;
  tries?: AgentTry[];
  /** The demo honours `refuse`. */
  refusable?: boolean;
  /** Room for a popup that opens below the demo. */
  tall?: boolean;
  /** The stage's height in pixels, for demos that need more room than `tall`. */
  height?: number;
}

/** What the server hands the workbench: plain data, nothing that cannot be serialised. */
export interface WorkbenchShell {
  slug: string;
  parts: { name: string; summary: string }[];
  files: string[];
  dependencies: { name: string; version: string }[];
  usesAgent: boolean;
  source: string;
  anatomy?: string;
  agent?: { kind: string; example: string };
}
