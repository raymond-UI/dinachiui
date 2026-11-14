import * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { cn } from "@/lib/utils";
import {
  AgentGroupContext,
  agentChoicesOf,
  changeAsAgent,
  matchAgentChoice,
  useAgentControl,
  useAgentLatest,
  useAgentState,
  useHasAgent,
  useMergedRef,
  type AgentChoice,
  type AgentGroup,
} from "@/components/ui/agent";

type Details = BaseCheckboxGroup.ChangeEventDetails;

function valuesFor(choices: AgentChoice<string>[], value: string[], wanted: unknown): string[] | string {
  const next = value.filter((v) => !choices.some((c) => c.value === v && !c.disabled));
  for (const one of Array.isArray(wanted) ? wanted : [wanted]) {
    const match = matchAgentChoice(choices, one);
    if (typeof match === "string") return match;
    if (!next.includes(match.value)) next.push(match.value);
  }
  return next;
}

/**
 * Base UI's group, holding its own value so an agent can check boxes the way a parent
 * would. Controlled use is unchanged, and `onValueChange` sees the agent's changes first
 * and can cancel them.
 */
const CheckboxGroup = React.forwardRef<
  React.ComponentRef<typeof BaseCheckboxGroup>,
  React.ComponentPropsWithoutRef<typeof BaseCheckboxGroup>
>(({ className, value: valueProp, defaultValue, onValueChange, ...props }, ref) => {
  const [value, change] = useAgentState<string[], Details>(valueProp, defaultValue ?? [], onValueChange);
  const element = React.useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRef(ref, element);
  const latest = useAgentLatest({ value, change, allValues: props.allValues });

  const [agent] = React.useState<AgentGroup>(() => {
    const items: AgentGroup["items"] = new Map();
    return {
      items,
      set(item, checked) {
        const { value: now, change: commit, allValues = [] } = latest.current;
        // The parent checkbox leaves disabled children as they are, as Base UI's does.
        const disabled = [...items].filter(([el]) => el.hasAttribute("data-disabled")).map(([, v]) => v);
        const changed = item === undefined ? allValues.filter((v) => !disabled.includes(v)) : [item];
        if (!changed.length) return undefined;
        const next = checked ? [...new Set([...now, ...changed])] : now.filter((v) => !changed.includes(v));
        return changeAsAgent(commit, next);
      },
    };
  });

  useAgentControl(() => {
    const choices = agentChoicesOf(agent.items);
    const setValue = (wanted: unknown) => {
      const next = valuesFor(choices, value, wanted);
      return typeof next === "string" ? next : changeAsAgent(change, next);
    };
    return {
      kind: "checkbox-group",
      element: element.current,
      value: choices.filter((c) => value.includes(c.value)).map((c) => c.label),
      items: choices.map((c) => c.label),
      multiple: true,
      disabled: props.disabled,
      actions: { setValue },
    };
  });

  return (
    <AgentGroupContext.Provider value={useHasAgent() ? agent : null}>
      <BaseCheckboxGroup
        ref={mergedRef}
        className={cn("flex flex-col items-start gap-1", className)}
        {...props}
        value={value}
        onValueChange={change}
      />
    </AgentGroupContext.Provider>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };
