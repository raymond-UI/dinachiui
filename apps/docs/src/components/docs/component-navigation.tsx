import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavItem {
  name: string;
  slug: string;
  href?: string;
}

interface ComponentNavigationProps {
  prevComponent?: NavItem;
  nextComponent?: NavItem;
  basePath?: string;
}

export function ComponentNavigation({
  prevComponent,
  nextComponent,
  basePath = "/docs/components",
}: ComponentNavigationProps) {
  if (!prevComponent && !nextComponent) return null;

  const getHref = (item: NavItem) => item.href ?? `${basePath}/${item.slug}`;

  return (
    <nav className="flex items-center justify-between p-3 bg-dot border rounded-lg border-border">
      <div>
        {prevComponent && (
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            render={<Link href={getHref(prevComponent)} />}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm text-muted-foreground/70">
              Previous:
            </span>
            <span className="font-medium">{prevComponent.name}</span>
          </Button>
        )}
      </div>

      <div>
        {nextComponent && (
          <Button
            variant="ghost"
            className="flex items-center gap-2 ml-auto"
            render={<Link href={getHref(nextComponent)} />}
          >
            <span className="text-sm text-muted-foreground/70">Next:</span>
            <span className="font-medium">{nextComponent.name}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}
