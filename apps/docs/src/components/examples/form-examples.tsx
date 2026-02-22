"use client"

import React from 'react';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldControl, FieldError } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export function DefaultFormExample() {
  return (
    <Form className="w-full max-w-sm space-y-4">
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <FieldControl placeholder="Enter your name" required />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" placeholder="you@example.com" required />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export function FormWithValidationExample() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleFormSubmit = (values: Record<string, unknown>) => {
    const newErrors: Record<string, string> = {};

    if (!values.username) {
      newErrors.username = 'Username is required';
    }
    if (!values.password) {
      newErrors.password = 'Password is required';
    } else if ((values.password as string).length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
  };

  return (
    <Form errors={errors} onFormSubmit={handleFormSubmit} className="w-full max-w-sm space-y-4">
      <Field name="username" invalid={!!errors.username}>
        <FieldLabel>Username</FieldLabel>
        <FieldControl placeholder="Choose a username" />
        {errors.username && <FieldError>{errors.username}</FieldError>}
      </Field>
      <Field name="password" invalid={!!errors.password}>
        <FieldLabel>Password</FieldLabel>
        <FieldControl type="password" placeholder="Enter password" />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </Field>
      <Button type="submit">Sign Up</Button>
    </Form>
  );
}

export function FormWithFieldsExample() {
  return (
    <Form className="w-full max-w-sm space-y-4">
      <Field name="firstName">
        <FieldLabel>First Name</FieldLabel>
        <FieldControl placeholder="John" />
      </Field>
      <Field name="lastName">
        <FieldLabel>Last Name</FieldLabel>
        <FieldControl placeholder="Doe" />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" placeholder="john@example.com" />
      </Field>
      <Field name="message">
        <FieldLabel>Message</FieldLabel>
        <FieldControl
          render={<textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your message..." />}
        />
      </Field>
      <div className="flex gap-2">
        <Button type="submit">Send</Button>
        <Button type="reset" variant="outline">Reset</Button>
      </div>
    </Form>
  );
}
