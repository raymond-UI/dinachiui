"use client"

import { Fieldset, FieldsetLegend } from '@/components/ui/fieldset';
import { Field, FieldLabel, FieldControl } from '@/components/ui/field';

export function DefaultFieldsetExample() {
  return (
    <Fieldset className="w-full max-w-sm">
      <FieldsetLegend>Personal Information</FieldsetLegend>
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <FieldControl placeholder="John" />
      </Field>
      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <FieldControl placeholder="Doe" />
      </Field>
    </Fieldset>
  );
}

export function FieldsetWithMultipleGroupsExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Fieldset>
        <FieldsetLegend>Account Details</FieldsetLegend>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldControl type="email" placeholder="you@example.com" />
        </Field>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <FieldControl placeholder="johndoe" />
        </Field>
      </Fieldset>
      <Fieldset>
        <FieldsetLegend>Address</FieldsetLegend>
        <Field>
          <FieldLabel>Street</FieldLabel>
          <FieldControl placeholder="123 Main St" />
        </Field>
        <Field>
          <FieldLabel>City</FieldLabel>
          <FieldControl placeholder="New York" />
        </Field>
      </Fieldset>
    </div>
  );
}
