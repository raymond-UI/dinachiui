/**
 * The tile shell only. Entrance is orchestrated by the `StaggerList` in `BentoSection`,
 * so that a tile which happens to scroll in alone is not still waiting out a delay it
 * was given for the sake of the row it usually sits in.
 */
export function Tile({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-md border border-border/60 bg-card overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
