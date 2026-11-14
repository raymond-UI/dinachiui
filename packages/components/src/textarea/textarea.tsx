import * as React from "react"
import { cn } from "@dinachi/core"
import { createAgentChangeDetails, useAgentControl, useMergedRef } from "../agent"

export interface TextareaChangeDetails {
  reason: string
  event: Event | undefined
  isCanceled: boolean
  cancel(): void
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Called with the new text on each edit, a person's or an agent's. An agent's can be canceled. */
  onValueChange?: (value: string, details: TextareaChangeDetails) => void
}

function writeValue(textarea: HTMLTextAreaElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set?.call(textarea, value)
}

function personDetails(event: Event): TextareaChangeDetails {
  const details = { reason: "none", event, isCanceled: false, cancel: () => void (details.isCanceled = true) }
  return details
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onValueChange, onChange, ...props }, ref) => {
    const element = React.useRef<HTMLTextAreaElement>(null)
    const mergedRef = useMergedRef(ref, element)

    // Set while the agent's input event runs, as onValueChange has already heard of it.
    const agentWrite = React.useRef(false)

    const setValue = (value: string) => {
      const textarea = element.current
      if (!textarea) return "The textarea is not mounted."
      if (textarea.readOnly) return "The textarea is read-only."
      // The app may refuse first. Then a real input event, so onChange hears of it too.
      if (onValueChange) {
        const details = createAgentChangeDetails<TextareaChangeDetails>("none")
        onValueChange(value, details)
        if (details.isCanceled) return "The app refused the change."
      }
      agentWrite.current = true
      try {
        writeValue(textarea, value)
        textarea.dispatchEvent(new Event("input", { bubbles: true }))
      } finally {
        agentWrite.current = false
      }
    }

    useAgentControl(() => ({
      kind: "textarea",
      element: element.current,
      value: element.current?.value,
      actions: {
        setValue: (value: string) => setValue(String(value ?? "")),
        clear: () => setValue(""),
      },
    }))

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={mergedRef}
        onChange={
          onValueChange
            ? (event) => {
                onChange?.(event)
                if (!agentWrite.current) onValueChange(event.target.value, personDetails(event.nativeEvent))
              }
            : onChange
        }
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
