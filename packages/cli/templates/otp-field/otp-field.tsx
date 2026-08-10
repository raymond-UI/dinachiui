"use client"

import * as React from "react"
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { cn } from "@/lib/utils"

const OTPField = React.forwardRef<
  React.ComponentRef<typeof OTPFieldPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Root>
>(({ className, ...props }, ref) => (
  <OTPFieldPrimitive.Root
    ref={ref}
    className={cn(
      "flex items-center gap-2",
      "data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
OTPField.displayName = "OTPField"

const OTPFieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
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
