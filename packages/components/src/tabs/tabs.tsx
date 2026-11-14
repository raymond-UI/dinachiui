import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "@dinachi/core";
import {
  agentChoicesOf,
  changeAsAgent,
  matchAgentChoice,
  useAgentControl,
  useAgentItem,
  useHasAgent,
  useMergedRef,
  type AgentItems,
} from "../agent";

type Details = BaseTabs.Root.ChangeEventDetails;

const TabsAgentContext = React.createContext<AgentItems | null>(null);

/**
 * Base UI keeps the value, so its fallbacks for a missing or disabled tab still apply.
 * The agent selects a tab by clicking it, and the app sees that change with the agent's
 * details, which it can cancel.
 */
const Tabs = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.Root>,
  React.ComponentProps<typeof BaseTabs.Root>
>(({ className, onValueChange, ...props }, ref) => {
  const element = React.useRef<HTMLDivElement | null>(null);
  const [items] = React.useState<AgentItems>(() => new Map());
  const pending = React.useRef<Details | null>(null);

  const change = (value: unknown, details: Details) => {
    const agent = pending.current;
    pending.current = null;
    onValueChange?.(value, agent ?? details);
    if (agent?.isCanceled) details.cancel();
  };

  useAgentControl(() => {
    const choices = agentChoicesOf(items);
    const active = [...items].find(([el]) => el.getAttribute("aria-selected") === "true")?.[1];
    const select = (wanted: unknown) => {
      const match = matchAgentChoice(choices, wanted);
      if (typeof match === "string") return match;
      const tab = [...items].find(([, v]) => v === match.value)?.[0];
      return changeAsAgent<unknown, Details>((_, details) => {
        pending.current = details;
        tab?.click();
        pending.current = null;
      }, match.value);
    };
    return {
      kind: "tabs",
      element: element.current,
      value: choices.find((c) => c.value === active)?.label ?? "",
      items: choices.map((c) => c.label),
      disabled: choices.length > 0 && choices.every((c) => c.disabled),
      actions: { select },
    };
  });

  return (
    <TabsAgentContext.Provider value={useHasAgent() ? items : null}>
      <BaseTabs.Root
        ref={useMergedRef(ref, element)}
        className={cn("w-full", className)}
        onValueChange={change}
        {...props}
      />
    </TabsAgentContext.Provider>
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.List>,
  React.ComponentProps<typeof BaseTabs.List>
>(({ className, ...props }, ref) => (
  <BaseTabs.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground z-0",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.Tab>,
  React.ComponentProps<typeof BaseTabs.Tab>
>(({ className, ...props }, ref) => {
  const items = React.useContext(TabsAgentContext);
  const element = React.useRef<HTMLButtonElement | null>(null);
  useAgentItem(items, element, props.value);
  return (
  <BaseTabs.Tab
    ref={useMergedRef(ref, element)}
    data-agent-part={items ? "" : undefined}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background",
      "transition-[color,background-color,box-shadow] duration-[var(--motion-duration-fast,150ms)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[active]:bg-muted data-[active]:text-foreground data-[active]:shadow-sm",
      "hover:text-foreground",
      className
    )}
    {...props}
  />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.Panel>,
  React.ComponentProps<typeof BaseTabs.Panel>
>(({ className, ...props }, ref) => (
  <BaseTabs.Panel
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

const TabsIndicator = React.forwardRef<
  React.ComponentRef<typeof BaseTabs.Indicator>,
  React.ComponentProps<typeof BaseTabs.Indicator>
>(({ className, ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    className={cn(
      "absolute bottom-0 left-0 z-10 h-1 w-[var(--active-tab-width)] -translate-y-1/2 translate-x-[var(--active-tab-left)] rounded-sm bg-muted-foreground",
      // The indicator moves between two on-screen positions rather than entering, so it
      // takes the in-out curve. Width is a layout property, but the indicator is
      // absolutely positioned and therefore out of flow, so animating it reflows only
      // itself. Naming the three properties keeps `all` from animating its colour and
      // shadow on every tab change as well.
      "transition-[transform,translate,width] duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-in-out,cubic-bezier(0.77,0,0.175,1))]",
      "motion-reduce:transition-none",
      className
    )}
    {...props}
  />
));
TabsIndicator.displayName = "TabsIndicator";

export type TabsProps = React.ComponentProps<typeof BaseTabs.Root>;
export type TabsListProps = React.ComponentProps<typeof BaseTabs.List>;
export type TabsTriggerProps = React.ComponentProps<typeof BaseTabs.Tab>;
export type TabsContentProps = React.ComponentProps<typeof BaseTabs.Panel>;
export type TabsIndicatorProps = React.ComponentProps<typeof BaseTabs.Indicator>;

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
}; 