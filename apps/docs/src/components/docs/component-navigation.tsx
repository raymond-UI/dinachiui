import Link from "next/link";
import { ComponentDoc } from "@/lib/components-registry";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ComponentNavigationProps {
  prevComponent?: ComponentDoc;
  nextComponent?: ComponentDoc;
}

export function ComponentNavigation({
  prevComponent,
  nextComponent,
}: ComponentNavigationProps) {
  if (!prevComponent && !nextComponent) return null;

  return (
    <nav className="flex items-center justify-between p-3 bg-dot border rounded-lg border-border">
      <div className="flex-1">
        {prevComponent && (
          <Link href={`/docs/components/${prevComponent.name.toLowerCase()}`}>
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
          <Link href={`/docs/components/${nextComponent.name.toLowerCase()}`}>
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
