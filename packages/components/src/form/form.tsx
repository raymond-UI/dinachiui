"use client"

import * as React from "react"
import { Form as BaseForm } from "@base-ui/react/form"
import { useRender } from "@base-ui/react/use-render"
import { mergeProps } from "@base-ui/react/merge-props"
import { cn } from "@dinachi/core"

// Type definitions for form errors
export type Errors = Record<string, string | string[]>

// Form state interface
export interface FormState extends Record<string, unknown> {
  errors: Errors
}

// Form component props interface using useRender types
export interface FormProps extends useRender.ComponentProps<'form', FormState> {
  /**
   * Object containing field errors where keys are field names and values are error messages.
   * Errors are automatically cleared when the value changes (Base UI 1.0.0+).
   */
  errors?: Errors
  /**
   * Form submission handler
   */
  onSubmit?: React.FormEventHandler<HTMLFormElement>
}

const Form = React.forwardRef<
  HTMLFormElement,
  FormProps
>(({ className, errors = {}, render, children, onSubmit, ...props }, ref) => {
  // Create form state object
  const formState: FormState = React.useMemo(() => ({
    errors
  }), [errors])

  // If using render prop, handle it with useRender
  if (render && typeof render === 'function') {
    // Function render prop
    const defaultProps = {
      className: cn("space-y-4", className),
      onSubmit
    }
    const formProps = mergeProps<'form'>(defaultProps, props)
    
    const element = useRender({
      render,
      props: formProps,
      state: formState,
      ref
    })
    return element
  }

  if (render && React.isValidElement(render) && render.type !== 'form') {
    // Element render prop - return the element directly (but not if it's the default <form />)
    return render
  }

  // Default rendering using BaseForm
  return (
    <BaseForm
      ref={ref}
      className={cn("space-y-4", className)}
      errors={errors}
      onSubmit={onSubmit}
      role="form"
      {...props}
    >
      {children}
    </BaseForm>
  )
})

Form.displayName = "Form"

export { Form } 