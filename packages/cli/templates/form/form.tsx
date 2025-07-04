// @ts-nocheck
"use client"

import * as React from "react"
import { Form as BaseForm } from "@base-ui-components/react/form"
import { useRender } from "@base-ui-components/react/use-render"
import { mergeProps } from "@base-ui-components/react/merge-props"
import { cn } from "@/lib/utils"

// Type definitions for form errors
export type Errors = Record<string, string | string[]>

// Form state interface
export interface FormState extends Record<string, unknown> {
  errors: Errors
}

// Form component props interface using useRender types
export interface FormProps extends useRender.ComponentProps<'form', FormState> {
  /**
   * Object containing field errors where keys are field names and values are error messages
   */
  errors?: Errors
  /**
   * Callback function called when errors should be cleared
   */
  onClearErrors?: (errors: Errors) => void
  /**
   * Form submission handler
   */
  onSubmit?: React.FormEventHandler<HTMLFormElement>
}

const Form = React.forwardRef<
  HTMLFormElement,
  FormProps
>(({ className, errors = {}, onClearErrors, render = <form />, children, onSubmit, ...props }, ref) => {
  // Create form state object
  const formState: FormState = React.useMemo(() => ({
    errors
  }), [errors])

  // Default form props
  const defaultProps: useRender.ElementProps<'form'> = {
    className: cn("space-y-4", className),
    onSubmit,
    children: (
      <BaseForm
        errors={errors}
        onClearErrors={onClearErrors}
        className="contents" // Use contents to avoid wrapper styling
      >
        {children}
      </BaseForm>
    )
  }

  // Use the useRender hook to handle render prop pattern
  const element = useRender({
    render,
    props: mergeProps<'form'>(defaultProps, props),
    state: formState,
    ref
  })

  return element
})

Form.displayName = "Form"

export { Form } 