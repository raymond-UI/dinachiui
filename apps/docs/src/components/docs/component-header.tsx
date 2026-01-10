"use client";

import { Badge } from "@/components/ui/badge";
import { ComponentDoc } from "@/lib/components-registry";
import { ComponentActions } from "@/components/reusables/ComponentActions";

interface ComponentHeaderProps {
  component: ComponentDoc;
}

export function ComponentHeader({ component }: ComponentHeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-border border-dashed p-6 z-10 relative">
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
      <ComponentActions component={component} />
    </div>
  );
}
