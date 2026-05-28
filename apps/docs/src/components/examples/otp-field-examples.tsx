"use client"

import * as React from "react"
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
} from "@/components/ui/otp-field"

export function DefaultOTPFieldExample() {
  return (
    <OTPField length={6}>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}

export function OTPFieldWithSeparatorExample() {
  return (
    <OTPField length={6}>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
      <OTPFieldSeparator>-</OTPFieldSeparator>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}

export function OTPFieldMaskedExample() {
  return (
    <OTPField length={4} mask>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}

export function OTPFieldControlledExample() {
  const [value, setValue] = React.useState("")
  const [completed, setCompleted] = React.useState<string | null>(null)

  return (
    <div className="space-y-3">
      <OTPField
        length={6}
        value={value}
        onValueChange={(next) => setValue(next)}
        onValueComplete={(next) => setCompleted(next)}
      >
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
      </OTPField>
      <p className="text-sm text-muted-foreground">
        Value: <code className="font-mono">{value || "(empty)"}</code>
      </p>
      {completed ? (
        <p className="text-sm text-success">Code complete: {completed}</p>
      ) : null}
    </div>
  )
}

export function OTPFieldDisabledExample() {
  return (
    <OTPField length={4} defaultValue="1234" disabled>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}
