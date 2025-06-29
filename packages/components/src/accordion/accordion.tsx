import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui-components/react/accordion";
import { cn } from "@dinachi/core";
import { ChevronDown } from "lucide-react";

const Accordion = React.forwardRef<
  React.ElementRef<typeof BaseAccordion.Root>,
  React.ComponentProps<typeof BaseAccordion.Root>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Root ref={ref} className={cn(className)} {...props} />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAccordion.Item>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
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
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
      "[&[data-panel-open]>svg]:rotate-180",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
  </BaseAccordion.Trigger>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseAccordion.Panel>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      "data-[starting-style]:animate-in data-[starting-style]:slide-down-from-top",
      "data-[ending-style]:animate-out data-[ending-style]:slide-up-to-top",
      "transition-all duration-200 ease-in-out",
      className
    )}
    style={{
      "--accordion-panel-height": "var(--accordion-panel-height)",
      "--accordion-panel-width": "var(--accordion-panel-width)",
    } as React.CSSProperties}
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
