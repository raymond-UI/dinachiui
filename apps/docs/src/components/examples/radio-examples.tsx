"use client"

import React from 'react';
import { Radio, RadioGroup } from '@/components/ui/radio';

export function DefaultRadioExample() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <Radio value="default" id="r1" />
        <label htmlFor="r1" className="text-sm font-medium">Default</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="comfortable" id="r2" />
        <label htmlFor="r2" className="text-sm font-medium">Comfortable</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="compact" id="r3" />
        <label htmlFor="r3" className="text-sm font-medium">Compact</label>
      </div>
    </RadioGroup>
  );
}

export function ControlledRadioExample() {
  const [value, setValue] = React.useState('email');

  return (
    <div className="space-y-3">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center space-x-2">
          <Radio value="email" id="notify-email" />
          <label htmlFor="notify-email" className="text-sm font-medium">Email</label>
        </div>
        <div className="flex items-center space-x-2">
          <Radio value="sms" id="notify-sms" />
          <label htmlFor="notify-sms" className="text-sm font-medium">SMS</label>
        </div>
        <div className="flex items-center space-x-2">
          <Radio value="push" id="notify-push" />
          <label htmlFor="notify-push" className="text-sm font-medium">Push Notification</label>
        </div>
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  );
}

export function DisabledRadioExample() {
  return (
    <RadioGroup defaultValue="active" disabled>
      <div className="flex items-center space-x-2">
        <Radio value="active" id="d1" />
        <label htmlFor="d1" className="text-sm font-medium text-muted-foreground">Active</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="inactive" id="d2" />
        <label htmlFor="d2" className="text-sm font-medium text-muted-foreground">Inactive</label>
      </div>
    </RadioGroup>
  );
}
