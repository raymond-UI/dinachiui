import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "@/lib/utils"

const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseField.Root>
>(({ className, ...props }, ref) => {
  return (
    <BaseField.Root
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  );
});

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof BaseField.Label>
>(({ className, ...props }, ref) => {
  return (
    <BaseField.Label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        "data-[invalid]:text-destructive",
        className
      )}
      {...props}
    />
  );
});

const FieldControl = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof BaseField.Control>
>(({ className, ...props }, ref) => {
  return (
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
  );
});

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseField.Description>
>(({ className, ...props }, ref) => {
  return (
    <BaseField.Description
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        "data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
});

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseField.Error>
>(({ className, ...props }, ref) => {
  return (
    <BaseField.Error
      ref={ref}
      className={cn(
        "text-sm font-medium text-destructive",
        "data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
});

const FieldValidity = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseField.Validity> & { className?: string }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm", "data-[disabled]:opacity-50", className)}
    >
      <BaseField.Validity {...props}>{children}</BaseField.Validity>
    </div>
  );
});

Field.displayName = "Field";
FieldLabel.displayName = "FieldLabel";
FieldControl.displayName = "FieldControl";
FieldDescription.displayName = "FieldDescription";
FieldError.displayName = "FieldError";
FieldValidity.displayName = "FieldValidity";

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldValidity,
};
