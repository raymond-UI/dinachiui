import { componentIconPaths } from "@/lib/component-icons";
import { cn } from "@/lib/utils";

/** The component's own icon. Renders nothing for a slug that has none yet. */
export function ComponentIcon({ slug, className }: { slug: string; className?: string }) {
  const paths = componentIconPaths[slug];
  if (!paths) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "size-4 shrink-0",
        "[&_.f]:fill-current [&_.f]:[fill-opacity:var(--icon-fill,.13)] [&_.f]:transition-[fill-opacity] [&_.f]:duration-200 [&_.q]:opacity-45",
        className,
      )}
      // Static markup from component-icons.ts, never user input.
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}
