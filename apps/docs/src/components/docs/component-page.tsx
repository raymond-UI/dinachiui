"use client";

import { ComponentDoc } from "@/lib/components-registry";
import { ComponentHeader } from "./component-header";
import { ComponentInstallation } from "./component-installation";
import { ComponentAPI } from "./component-api";
import { ComponentExamples } from "./component-examples";
import { ComponentNavigation } from "./component-navigation";

interface ComponentPageProps {
  component: ComponentDoc;
  prevComponent?: ComponentDoc;
  nextComponent?: ComponentDoc;
}

export function ComponentPage({
  component,
  prevComponent,
  nextComponent,
}: ComponentPageProps) {
  return (
    <div className="min-h-screen bg-background border border-accent rounded-lg">
      <div className="relative max-w-4xl mx-auto p-8 border-x">
        <div className="absolute inset-0 -z-0 w-full h-full bg-dot opacity-50" />
        <ComponentHeader component={component} />

        <div className="mt-8 space-y-12 z-10 relative">
          <ComponentInstallation component={component} />

          {component.examples.length > 0 && (
            <ComponentExamples examples={component.examples} />
          )}

          <ComponentAPI component={component} />

          <ComponentNavigation
            prevComponent={prevComponent}
            nextComponent={nextComponent}
          />
        </div>
      </div>
    </div>
  );
}
