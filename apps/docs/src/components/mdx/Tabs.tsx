"use client";

import { useState, createContext, useContext, type ReactNode } from "react";

type TabsContextValue = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within Tabs");
  }
  return context;
}

type TabsProps = {
  defaultTab: string;
  children: ReactNode;
};

export function MdxTabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="my-6">{children}</div>
    </TabsContext.Provider>
  );
}

type TabListProps = {
  children: ReactNode;
};

export function MdxTabList({ children }: TabListProps) {
  return (
    <div className="flex gap-1 border-b border-border" role="tablist">
      {children}
    </div>
  );
}

type TabTriggerProps = {
  value: string;
  children: ReactNode;
};

export function MdxTabTrigger({ value, children }: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "border-b-2 border-primary text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

type TabContentProps = {
  value: string;
  children: ReactNode;
};

export function MdxTabContent({ value, children }: TabContentProps) {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className="pt-4">
      {children}
    </div>
  );
}
