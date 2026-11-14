import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "@/components/ui/agent";

type Details = BaseAccordion.Root.ChangeEventDetails;

interface AccordionAgent {
  value: unknown[];
  multiple: boolean;
  change: (next: unknown[], details: Details) => void;
}

const AccordionAgentContext = React.createContext<AccordionAgent | null>(null);
type Ref<T> = React.MutableRefObject<T | null>;
const AccordionPartsContext = React.createContext<{ trigger: Ref<HTMLButtonElement>; panel: Ref<HTMLDivElement> } | null>(null);

/**
 * Base UI's root, holding its own value so an agent can open and close items the way a
 * parent would. Controlled use is unchanged, and `onValueChange` sees the agent's changes
 * first and can cancel them.
 */
const Accordion = React.forwardRef<
  React.ComponentRef<typeof BaseAccordion.Root>,
  React.ComponentProps<typeof BaseAccordion.Root>
>(({ className, value: valueProp, defaultValue, onValueChange, ...props }, ref) => {
  const [value, change] = useAgentState<unknown[], Details>(valueProp, defaultValue ?? [], onValueChange);
  const agent = { value, multiple: Boolean(props.multiple), change };
  return (
    <AccordionAgentContext.Provider value={useHasAgent() ? agent : null}>
      <BaseAccordion.Root ref={ref} data-agent-in={props["aria-label"]} className={cn(className)} {...props} value={value} onValueChange={change} />
    </AccordionAgentContext.Provider>
  );
});
Accordion.displayName = "Accordion";

/** Each item is its own disclosure to the agent, standing at its trigger. Open, it reads as its panel's text. */
const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAccordion.Item>
>(({ className, value: valueProp, ...props }, ref) => {
  const fallback = React.useId();
  const value = valueProp ?? fallback;
  const root = React.useContext(AccordionAgentContext);
  const trigger = React.useRef<HTMLButtonElement | null>(null);
  const panel = React.useRef<HTMLDivElement | null>(null);
  const [parts] = React.useState(() => ({ trigger, panel }));

  useAgentControl(() => {
    if (!root) return null;
    const open = root.value.includes(value);
    const next = open
      ? root.value.filter((v) => v !== value)
      : root.multiple
        ? [...root.value, value]
        : [value];
    return {
      kind: "disclosure",
      element: trigger.current,
      open,
      value: open ? panel.current?.textContent?.replace(/\s+/g, " ").trim() || undefined : undefined,
      actions: { [open ? "close" : "open"]: () => changeAsAgent(root.change, next) },
    };
  });

  return (
    <AccordionPartsContext.Provider value={root ? parts : null}>
      <BaseAccordion.Item
        ref={ref}
        className={cn("border-b", className)}
        value={value}
        {...props}
      />
    </AccordionPartsContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionHeader = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseAccordion.Header>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Header 
    ref={ref}
    className={cn("flex", className)} 
    {...props} 
  />
));
AccordionHeader.displayName = "AccordionHeader";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseAccordion.Trigger> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Trigger
    ref={useMergedRef(ref, React.useContext(AccordionPartsContext)?.trigger)}
    className={cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-colors hover:underline",
      "[&[data-panel-open]>svg]:rotate-180",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-[var(--motion-duration-fast,150ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))] motion-reduce:transition-none" />
  </BaseAccordion.Trigger>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAccordion.Panel>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={useMergedRef(ref, React.useContext(AccordionPartsContext)?.panel)}
    className={cn(
      "overflow-hidden text-sm h-[var(--accordion-panel-height)]",
      "transition-[height] duration-[var(--motion-duration-base,200ms)] ease-[var(--motion-ease-out,cubic-bezier(0.23,1,0.32,1))]",
      "data-[starting-style]:h-0 data-[ending-style]:h-0",
      "motion-reduce:transition-none",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </BaseAccordion.Panel>
));
AccordionPanel.displayName = "AccordionPanel";

export { 
  Accordion, 
  AccordionItem, 
  AccordionHeader,
  AccordionTrigger, 
  AccordionPanel 
};
