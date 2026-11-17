import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionIcon } from "@/components/layout/section-icons";
import { cn } from "@/lib/utils";
import type { TurnLink } from "@/lib/page-turn";

const LINK =
  "group flex h-12 min-w-0 items-center gap-2.5 rounded-xl border px-4 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const NUDGE = "size-4 shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none";

/** The end of a page: two equal links, the way forward a step louder than the way back. */
export function PageTurn({ prev, next }: { prev?: TurnLink; next?: TurnLink }) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Pages" className="grid grid-cols-2 gap-2">
      {prev ? (
        <Link
          href={prev.href}
          rel="prev"
          className={cn(LINK, "border-transparent text-muted-foreground hover:border-border hover:text-foreground")}
        >
          <ArrowLeft className={cn(NUDGE, "group-hover:-translate-x-0.5")} />
          <span className="sr-only">Previous: </span>
          <span className="truncate">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          rel="next"
          className={cn(LINK, "justify-end bg-card font-medium hover:border-foreground/20")}
        >
          <span className="sr-only">Next: </span>
          {next.section && (
            <SectionIcon id={next.section} className="size-4 shrink-0 text-muted-foreground [--icon-fill:.2] [stroke-width:1.1]" />
          )}
          <span className="truncate">{next.name}</span>
          <ArrowRight className={cn(NUDGE, "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground")} />
        </Link>
      )}
    </nav>
  );
}
