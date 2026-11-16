"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribeReduced, () => matchMedia(REDUCED).matches, () => false);
}

/** True while the element is on screen. With `once`, stays true after the first time. */
export function useInView<T extends Element>(
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {},
): [React.RefCallback<T>, boolean] {
  const { threshold = 0.2, rootMargin, once = false } = options;
  const [node, setNode] = React.useState<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin, once]);

  return [setNode, inView];
}

/** Fades and lifts out of a blur the first time it is seen. */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType; delay?: number }) {
  const [ref, seen] = useInView<HTMLElement>({ threshold: 0.12, rootMargin: "0px 0px -6% 0px", once: true });
  return (
    <Tag
      ref={ref}
      className={cn("rv", seen && "vis", className)}
      style={{ transitionDelay: `${delay}ms`, ...props.style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * A heading whose words rise out of a blur one after another. Pass the lines as
 * `[text, className?]` pairs so a pixel-set second line keeps its own style.
 */
export function Words({
  as: Tag = "h2",
  parts,
  className,
}: {
  as?: React.ElementType;
  parts: [string, string?][];
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLElement>({ threshold: 0.12, once: true });
  let i = 0;
  return (
    <Tag ref={ref} className={cn("wr", seen && "vis", className)}>
      {parts.map(([text, partClass], p) => (
        <span key={p} className={partClass}>
          {text.split(" ").map((word, w, all) => (
            <React.Fragment key={w}>
              <span className="wd" style={{ transitionDelay: `${i++ * 60}ms` }}>
                {word}
              </span>
              {w < all.length - 1 ? " " : null}
            </React.Fragment>
          ))}
          {p < parts.length - 1 && !partClass?.includes("l2") ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

const DIGITS = "0123456789";

/** Digits that roll into place. Columns are fixed so the width only changes on purpose. */
export function Digits({ value, cols, className }: { value: number | null; cols: number; className?: string }) {
  const text = value === null ? " ".repeat(cols) : String(value).padStart(cols, " ");
  return (
    <span className={cn("digits", className)} aria-label={value === null ? undefined : String(value)} role="img">
      {Array.from(text).map((ch, i) => {
        const index = ch === " " ? 10 : Number(ch);
        return (
          <span key={i} className={cn("dg", ch === " " && "blank")} aria-hidden>
            <span style={{ transform: `translateY(${-index * 1.15}em)` }}>
              {Array.from(DIGITS).map((d) => (
                <span key={d}>{d}</span>
              ))}
              <span>&nbsp;</span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Starts at `null` and rolls to `value` once the element is seen. */
export function useCountOnView(value: number) {
  const [ref, seen] = useInView<HTMLElement>({ threshold: 0.4, once: true });
  const [shown, setShown] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setShown(value), 150);
    return () => clearTimeout(t);
  }, [seen, value]);
  return [ref, shown] as const;
}

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1400);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <span className={cn("cmd", className)}>
      <span className="p" aria-hidden>
        $
      </span>
      {command}
      <button
        type="button"
        className={cn("copy", done && "done")}
        aria-label={done ? "Copied" : "Copy command"}
        onClick={() => {
          navigator.clipboard?.writeText(command);
          setDone(true);
        }}
      >
        <svg className="cp" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg className="ck" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </button>
      <span className="sr-only" aria-live="polite">
        {done ? "Copied to clipboard" : ""}
      </span>
    </span>
  );
}
