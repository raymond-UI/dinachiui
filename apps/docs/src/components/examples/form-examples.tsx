"use client"

import React from 'react';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldControl, FieldError } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export function DefaultFormExample() {
  return (
    <Form className="w-full max-w-sm space-y-4">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldControl name="name" placeholder="Enter your name" required />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl name="email" type="email" placeholder="you@example.com" required />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

export function FormWithValidationExample() {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    if (!formData.get('username')) {
      newErrors.username = 'Username is required';
    }
    if (!formData.get('password')) {
      newErrors.password = 'Password is required';
    } else if ((formData.get('password') as string).length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
  };

  return (
    <Form errors={errors} onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <Field invalid={!!errors.username}>
        <FieldLabel>Username</FieldLabel>
        <FieldControl name="username" placeholder="Choose a username" />
        {errors.username && <FieldError>{errors.username}</FieldError>}
      </Field>
      <Field invalid={!!errors.password}>
        <FieldLabel>Password</FieldLabel>
        <FieldControl name="password" type="password" placeholder="Enter password" />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </Field>
      <Button type="submit">Sign Up</Button>
    </Form>
  );
}

export function FormWithFieldsExample() {
  return (
    <Form className="w-full max-w-sm space-y-4">
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <FieldControl name="firstName" placeholder="John" />
      </Field>
      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <FieldControl name="lastName" placeholder="Doe" />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl name="email" type="email" placeholder="john@example.com" />
      </Field>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <FieldControl
          name="message"
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
