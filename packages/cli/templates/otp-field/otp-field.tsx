"use client"

import * as React from "react"
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { cn } from "@/lib/utils"
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "@/components/ui/agent"

const CODE_PATTERNS: Record<string, RegExp> = {
  numeric: /^\d*$/,
  alpha: /^[a-z]*$/i,
  alphanumeric: /^[a-z\d]*$/i,
}

function checkCode(code: string, length: number, validationType = "numeric") {
  if (code.length > length) return `The code is ${length} characters.`
  if (!(CODE_PATTERNS[validationType]?.test(code) ?? true)) return `The code takes ${validationType} characters only.`
}

/**
 * Base UI's root, holding its own value so an agent can fill the code the way a parent
 * would. `onValueChange` sees the agent's changes first and can cancel them.
 */
const OTPField = React.forwardRef<
  React.ComponentRef<typeof OTPFieldPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Root>
>(({ className, value: valueProp, defaultValue = "", onValueChange, ...props }, ref) => {
  type Details = OTPFieldPrimitive.Root.ChangeEventDetails
  const [value, changeValue] = useAgentState<string, Details>(valueProp, defaultValue, onValueChange)
  const element = React.useRef<HTMLDivElement>(null)
  const mergedRef = useMergedRef(ref, element)

  useAgentControl(() => {
    const setValue = (next: unknown) => {
      if (props.readOnly) return "The code is read-only."
      const code = String(next ?? "").replace(/\s+/g, "")
      return checkCode(code, props.length, props.validationType) ?? changeAsAgent(changeValue, code)
    }
    return {
      kind: "input" as const,
      element: element.current,
      value,
      disabled: props.disabled,
      length: props.length,
      // A one-time code is a credential, like the autocomplete token Base UI gives it,
      // and a masked one is hidden from the person too.
      secret: Boolean(props.mask) || (props.autoComplete ?? "one-time-code") === "one-time-code",
      actions: { setValue, clear: () => setValue("") },
    }
  })

  return (
    <OTPFieldPrimitive.Root
      ref={mergedRef}
      data-slot="otp-field"
      className={cn(
        "flex items-center gap-2",
        "data-[disabled]:opacity-50",
        className
      )}
      {...props}
      value={value}
      onValueChange={changeValue}
    />
  )
})
OTPField.displayName = "OTPField"

const OTPFieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="otp-field-group"
    className={cn("flex items-center", className)}
    {...props}
  />
))
OTPFieldGroup.displayName = "OTPFieldGroup"

const OTPFieldInput = React.forwardRef<
  React.ComponentRef<typeof OTPFieldPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Input>
>(({ className, ...props }, ref) => (
  <OTPFieldPrimitive.Input
    ref={ref}
    data-slot="otp-field-input"
    // The root reports the whole code, so a slot is part of it rather than a control.
    data-agent-part={useHasAgent() ? "" : undefined}
    className={cn(
      "relative h-10 w-10 border-y border-r border-input bg-background text-center text-sm shadow-sm outline-none",
      "transition-[color,background-color,border-color,box-shadow] duration-[var(--motion-duration-fast,150ms)]",
      "first:rounded-l-md first:border-l last:rounded-r-md",
      "focus-visible:z-10 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
      className
    )}
    {...props}
  />
))
OTPFieldInput.displayName = "OTPFieldInput"

const OTPFieldSeparator = React.forwardRef<
  React.ComponentRef<typeof OTPFieldPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <OTPFieldPrimitive.Separator
    ref={ref}
    data-slot="otp-field-separator"
    role="separator"
    className={cn("text-muted-foreground", className)}
    {...props}
  />
))
OTPFieldSeparator.displayName = "OTPFieldSeparator"

export type OTPFieldProps = React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Root>
export type OTPFieldGroupProps = React.HTMLAttributes<HTMLDivElement>
export type OTPFieldInputProps = React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Input>
export type OTPFieldSeparatorProps = React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Separator>

export { OTPField, OTPFieldGroup, OTPFieldInput, OTPFieldSeparator }
