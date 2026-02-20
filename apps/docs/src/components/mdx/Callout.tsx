import type { ReactNode } from "react";

const toneStyles: Record<string, string> = {
  info: "border-primary/40 bg-primary/5 text-foreground",
  warning: "border-destructive/30 bg-destructive/5 text-foreground",
  success: "border-emerald-500/30 bg-emerald-500/10 text-foreground",
};

export function Callout({
  children,
  title,
  tone = "info",
}: {
  children: ReactNode;
  title?: string;
  tone?: "info" | "warning" | "success";
}) {
  const toneClass = toneStyles[tone] ?? toneStyles.info;

  return (
    <aside
      className={`my-4 rounded-2xl border px-5 py-4 shadow-sm ${toneClass}`}
    >
      {title ? (
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      ) : null}
      <div className="text-sm leading-relaxed">{children}</div>
    </aside>
  );
}
