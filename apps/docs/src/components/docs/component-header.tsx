"use client";

import { Badge } from "@/components/ui/badge";
import { ComponentDoc } from "@/lib/components-registry";

interface ComponentHeaderProps {
  component: ComponentDoc;
}

export function ComponentHeader({ component }: ComponentHeaderProps) {
  return (
    <div className="border-b border-border pb-8 z-10 relative">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">
              {component.name}
            </h1>
            <Badge variant="secondary">{component.category}</Badge>
          </div>
          <p className="text-muted-foreground text-pretty">
            {component.description}
          </p>
        </div>
      </div>

      {component.dependencies.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Dependencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {component.dependencies.map((dep) => (
              <Badge key={dep} variant="outline" className="text-xs">
                {dep}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
