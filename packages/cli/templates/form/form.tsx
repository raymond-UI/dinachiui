"use client"

import * as React from "react"
import { Form as BaseForm } from "@base-ui/react/form"
import { cn } from "@/lib/utils"

export type FormProps = React.ComponentProps<typeof BaseForm>

const Form = React.forwardRef<
  HTMLFormElement,
  FormProps
>(({ className, ...props }, ref) => (
  <BaseForm
    ref={ref}
    className={cn("space-y-4", className)}
    {...props}
  />
))

Form.displayName = "Form"

export { Form }
