import * as React from "react";
import { Field as BaseField } from "@base-ui-components/react/field";
import { cn } from "@dinachi/core";

const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseField.Root>
>(({ className, ...props }, ref) => (
  <BaseField.Root ref={ref} className={cn("space-y-2", className)} {...props} />
));
Field.displayName = "Field";

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof BaseField.Label>
>(({ className, ...props }, ref) => (
  <BaseField.Label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "data-[invalid]:text-destructive",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

const FieldControl = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof BaseField.Control>
>(({ className, ...props }, ref) => (
  <BaseField.Control
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[invalid]:border-destructive data-[invalid]:ring-destructive",
      className
    )}
    {...props}
  />
));
FieldControl.displayName = "FieldControl";

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseField.Description>
>(({ className, ...props }, ref) => (
  <BaseField.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      "data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

const FieldError = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseField.Error>
>(({ className, ...props }, ref) => (
  <BaseField.Error
    ref={ref}
    className={cn(
      "text-sm font-medium text-destructive",
      "data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
FieldError.displayName = "FieldError";

const FieldValidity = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseField.Validity> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm", "data-[disabled]:opacity-50", className)}
  >
    <BaseField.Validity {...props}>{children}</BaseField.Validity>
  </div>
));
FieldValidity.displayName = "FieldValidity";

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
};
