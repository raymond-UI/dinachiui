import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "@/lib/utils";
import { createAgentChangeDetails, useAgentControl, useMergedRef } from "@/components/ui/agent";

function writeValue(input: HTMLInputElement, value: string) {
  // The prototype setter skips React's value tracker, so React does not treat the write
  // as an edit of its own and the parent's handler is the only one that hears of it.
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
}

function setValueAsUser(input: HTMLInputElement, value: string) {
  writeValue(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof BaseInput>
>(({ className, ...props }, ref) => {
  const element = React.useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, element);

  // Set while the agent's input event runs, as onValueChange has already heard of it.
  const agentWrite = React.useRef(false);
  const { onValueChange } = props;
  const handleValueChange = onValueChange
    ? (value: string, details: BaseInput.ChangeEventDetails) => {
        if (!agentWrite.current) onValueChange(value, details);
      }
    : undefined;

  const setValue = (value: string) => {
    const input = element.current;
    if (!input) return "The input is not mounted.";
    if (input.readOnly) return "The input is read-only.";
    // The app may refuse first, so a refused change reaches nothing else. Then a real
    // input event, as typing sends, so onChange, form libraries and the Field hear of it.
    if (onValueChange) {
      const details = createAgentChangeDetails<BaseInput.ChangeEventDetails>("none");
      onValueChange(value, details);
      if (details.isCanceled) return "The app refused the change.";
    }
    agentWrite.current = true;
    try {
      setValueAsUser(input, value);
    } finally {
      agentWrite.current = false;
    }
  };

  useAgentControl(() => ({
    kind: "input",
    element: element.current,
    value: element.current?.value,
    // A file input takes a file from a person's picker. Nothing an agent sends can be one.
    actions:
      props.type === "file"
        ? ({} as Record<string, never>)
        : {
            setValue: (value: string) => setValue(String(value ?? "")),
            clear: () => setValue(""),
          },
  }));

  return (
    <BaseInput
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      ref={mergedRef}
      {...props}
      onValueChange={handleValueChange}
    />
  );
});
Input.displayName = "Input";

export { Input };
