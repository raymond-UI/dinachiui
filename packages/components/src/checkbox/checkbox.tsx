import * as React from "react";
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cn } from "@dinachi/core";
import { Check } from "lucide-react";

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof BaseCheckbox.Root>,
  React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>
>(({ className, ...props }, ref) => (
  <span className="relative inline-flex [&>input]:!absolute">
    <BaseCheckbox.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[checked]:bg-primary data-[checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <BaseCheckbox.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  </span>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
