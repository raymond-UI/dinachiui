"use client";

import { createContext, useContext, type ReactNode } from "react";

type ComponentSourceContextValue = {
  source: string | null;
  dependencies: string[];
};

const ComponentSourceContext = createContext<ComponentSourceContextValue>({
  source: null,
  dependencies: [],
});

export function useComponentSource() {
  return useContext(ComponentSourceContext);
}

export function ComponentSourceProvider({
  source,
  dependencies,
  children,
}: ComponentSourceContextValue & { children: ReactNode }) {
  return (
    <ComponentSourceContext.Provider value={{ source, dependencies }}>
      {children}
    </ComponentSourceContext.Provider>
  );
}
