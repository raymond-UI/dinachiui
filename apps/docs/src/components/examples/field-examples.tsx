"use client";

import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { useState } from "react";

export function DefaultFieldExample() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" placeholder="Enter your email" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  );
}

export function FieldWithValidationExample() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = value.length >= 3;
  const showError = touched && !isValid;

  return (
    <Field invalid={showError} className="w-full max-w-sm">
      <FieldLabel>Username</FieldLabel>
      <FieldControl
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        onBlur={() => setTouched(true)}
        placeholder="Enter username"
      />
      <FieldDescription>Must be at least 3 characters.</FieldDescription>
      {showError && <FieldError>Username must be at least 3 characters</FieldError>}
    </Field>
  );
}

export function FieldWithErrorExample() {
  return (
    <Field invalid className="w-full max-w-sm">
      <FieldLabel>Password</FieldLabel>
      <FieldControl type="password" placeholder="Enter password" />
      <FieldError>Password is required</FieldError>
    </Field>
  );
}

export function RequiredFieldExample() {
  return (
    <div className="space-y-4 w-full max-w-sm">
      <Field className="w-full">
        <FieldLabel>
          Full Name <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldControl placeholder="Enter your full name" required />
        <FieldDescription>Your legal name as it appears on documents.</FieldDescription>
      </Field>

      <Field className="w-full">
        <FieldLabel>
          Phone Number <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldControl type="tel" placeholder="+1 (555) 000-0000" required />
        <FieldDescription>We'll use this for account recovery.</FieldDescription>
      </Field>
    </div>
  );
}

export function DisabledFieldExample() {
  return (
    <Field disabled className="w-full max-w-sm">
      <FieldLabel>Account ID</FieldLabel>
      <FieldControl value="ACC-12345-ABCDE" readOnly />
      <FieldDescription>This field cannot be modified.</FieldDescription>
    </Field>
  );
}
