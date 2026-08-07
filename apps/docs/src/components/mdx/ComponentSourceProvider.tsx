"use client";

import { createContext, useContext, type ReactNode } from "react";

export type ComponentBuildSource = {
  flag: string;
  source: string;
  extraDependencies: string[];
};

type ComponentSourceContextValue = {
  source: string | null;
  dependencies: string[];
  /** Alternative builds, if the component ships any. Keyed by the flag that installs them. */
  builds?: ComponentBuildSource[];
};

const ComponentSourceContext = createContext<ComponentSourceContextValue>({
  source: null,
  dependencies: [],
  builds: [],
});

export function useComponentSource() {
  return useContext(ComponentSourceContext);
}

/**
 * The manual install tab hands the reader a file to paste. A component with more than one
 * build has more than one such file, so which one a given `InstallTabs` shows has to follow
 * the command above it rather than default to the first.
 */
export function useComponentBuild(flag?: string) {
  const { source, dependencies, builds = [] } = useComponentSource();
  const build = flag ? builds.find((candidate) => candidate.flag === flag) : undefined;

  if (!build) return { source, dependencies };
  return {
    source: build.source,
    dependencies: [...dependencies, ...build.extraDependencies],
  };
}

export function ComponentSourceProvider({
  source,
  dependencies,
  builds = [],
  children,
}: ComponentSourceContextValue & { children: ReactNode }) {
  return (
    <ComponentSourceContext.Provider value={{ source, dependencies, builds }}>
      {children}
    </ComponentSourceContext.Provider>
  );
}
