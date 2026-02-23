"use client"

import React from 'react';
import { Radio, RadioGroup } from '@/components/ui/radio';

export function DefaultRadioExample() {
  return (
    <RadioGroup defaultValue="comfortable">
      <label className="flex items-center gap-2">
        <Radio value="default" />
        <span className="text-sm font-medium">Default</span>
      </label>
      <label className="flex items-center gap-2">
        <Radio value="comfortable" />
        <span className="text-sm font-medium">Comfortable</span>
      </label>
      <label className="flex items-center gap-2">
        <Radio value="compact" />
        <span className="text-sm font-medium">Compact</span>
      </label>
    </RadioGroup>
  );
}

export function ControlledRadioExample() {
  const [value, setValue] = React.useState('email');

  return (
    <div className="space-y-3">
      <RadioGroup value={value} onValueChange={setValue}>
        <label className="flex items-center gap-2">
          <Radio value="email" />
          <span className="text-sm font-medium">Email</span>
        </label>
        <label className="flex items-center gap-2">
          <Radio value="sms" />
          <span className="text-sm font-medium">SMS</span>
        </label>
        <label className="flex items-center gap-2">
          <Radio value="push" />
          <span className="text-sm font-medium">Push Notification</span>
        </label>
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  );
}

export function DisabledRadioExample() {
  return (
    <RadioGroup defaultValue="active" disabled>
      <label className="flex items-center gap-2 text-muted-foreground">
        <Radio value="active" />
        <span className="text-sm font-medium">Active</span>
      </label>
      <label className="flex items-center gap-2 text-muted-foreground">
        <Radio value="inactive" />
        <span className="text-sm font-medium">Inactive</span>
      </label>
    </RadioGroup>
  );
}
