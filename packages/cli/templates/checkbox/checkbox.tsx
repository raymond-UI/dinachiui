import * as React from "react";
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  AgentGroupContext,
  agentChecked,
  changeAsAgent,
  useAgentControl,
  useAgentItem,
  useAgentState,
  useMergedRef,
} from "@/components/ui/agent";

type CheckboxProps = React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>;

function ariaChecked(el: Element | null): boolean | "mixed" {
  const state = el?.getAttribute("aria-checked");
  return state === "mixed" ? "mixed" : state === "true";
}

/**
 * Base UI's checkbox, holding its own checked state so an agent can check it the way a
 * parent would. Controlled use is unchanged, and `onCheckedChange` sees the agent's
 * changes first and can cancel them. In a group the group's value decides, so the agent
 * goes through the group's `onValueChange` instead.
 */
const Checkbox = React.forwardRef<
  React.ComponentRef<typeof BaseCheckbox.Root>,
  CheckboxProps
>(({ className, checked: checkedProp, defaultChecked = false, onCheckedChange, ...props }, ref) => {
  const [checked, change] = useAgentState<boolean, BaseCheckbox.Root.ChangeEventDetails>(
    checkedProp,
    defaultChecked,
    onCheckedChange
  );
  const group = React.useContext(AgentGroupContext);
  const element = React.useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRef(ref, element);
  const grouped = group && (props.parent || props.value !== undefined) ? group : null;
  useAgentItem(grouped?.items ?? null, element, props.parent ? undefined : props.value);

  useAgentControl(() => {
    const now = ariaChecked(element.current);
    const set = (next: boolean) => {
      if (props.readOnly) return "The checkbox is read-only.";
      if (next === now) return undefined;
      return grouped ? grouped.set(props.parent ? undefined : props.value, next) : changeAsAgent(change, next);
    };
    return {
      kind: "checkbox",
      element: element.current,
      checked: now,
      disabled: props.disabled,
      actions: {
        toggle: () => set(now !== true),
        setChecked: (value: unknown) => set(agentChecked(value)),
      },
    };
  });

  return (
  <span className="relative inline-flex [&>input]:!absolute">
    <BaseCheckbox.Root
      ref={mergedRef}
      data-slot="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[checked]:bg-primary data-[checked]:text-primary-foreground",
        className
      )}
      {...props}
      checked={checked}
      onCheckedChange={change}
    >
      <BaseCheckbox.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  </span>
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
