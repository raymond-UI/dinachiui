"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/** The frame every guide stage sits in: a bar with its controls, then the floor. */
export function Stage({ bar, children, className }: { bar: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("not-prose my-8 overflow-hidden rounded-2xl border bg-card first:mt-0 max-sm:-mx-4 max-sm:w-[calc(100%+2rem)] max-sm:max-w-none max-sm:rounded-none max-sm:border-x-0", className)}>
      <div className="flex items-center justify-end gap-3 border-b px-3 py-2">{bar}</div>
      {children}
    </div>
  );
}

/** A compact segmented switch, the same one the components index uses for its views. */
export function StageSwitch<T extends string>({
  label,
  options,
  value,
  onChange,
  capitalize,
}: {
  label: string;
  capitalize?: boolean;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(v) => v[0] && onChange(v[0] as T)}
      className="gap-0.5 rounded-lg border p-0.5"
    >
      {options.map((o) => (
        <ToggleGroupItem key={o} value={o} variant="default" className={cn("h-7 rounded-md px-2.5 text-xs", capitalize && "capitalize")}>
          {o}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function useCopied() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const copy = (key: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1600);
  };
  return [copied, copy] as const;
}
