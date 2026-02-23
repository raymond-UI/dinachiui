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
      <div className="flex-1">
        {prevComponent && (
          <Link href={getHref(prevComponent)}>
            <Button variant="ghost" className="flex items-center gap-2 p-0">
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left space-y-1 space-x-2">
                <span className="text-sm text-muted-foreground/70">
                  Previous:
                </span>
                <span className="font-medium">{prevComponent.name}</span>
              </div>
            </Button>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextComponent && (
          <Link href={getHref(nextComponent)}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-0 ml-auto"
            >
              <div className="text-right space-y-1 space-x-2">
                <span className="text-sm text-muted-foreground/70">Next:</span>
                <span className="font-medium">{nextComponent.name}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
