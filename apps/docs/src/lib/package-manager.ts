"use client";

import { useSyncExternalStore } from "react";

export const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
export type Manager = (typeof MANAGERS)[number];

const KEY = "dinachi:pm";
const listeners = new Set<() => void>();

function read(): Manager {
  const v = localStorage.getItem(KEY);
  return (MANAGERS as readonly string[]).includes(v ?? "") ? (v as Manager) : "npm";
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => e.key === KEY && fn();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/** One package manager for the whole site: pick it on any command and every other follows. */
export function usePackageManager() {
  const pm = useSyncExternalStore(subscribe, read, () => "npm" as Manager);
  const setPm = (next: Manager) => {
    localStorage.setItem(KEY, next);
    listeners.forEach((fn) => fn());
  };
  return [pm, setPm] as const;
}

export function nextManager(pm: Manager): Manager {
  return MANAGERS[(MANAGERS.indexOf(pm) + 1) % MANAGERS.length];
}
