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
    <div className="w-full p-6 pt-12 bg-radial from-accent/5 to-muted/5 backdrop-blur-xs border-[0.5px] border-r-0 border-accent">
        <ComponentHeader component={component} />

        <div className="mt-8 space-y-12 z-10 relative w-full">
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
      {/* </div> */}
    </div>
  );
}
