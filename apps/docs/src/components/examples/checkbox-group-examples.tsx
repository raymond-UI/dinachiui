"use client";

import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function DefaultCheckboxGroupExample() {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Select your interests
      </label>
      <CheckboxGroup defaultValue={["design"]}>
        <div className="flex items-center space-x-2">
          <Checkbox id="design" name="interests" value="design" />
          <label htmlFor="design" className="text-sm text-foreground">
            Design
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="development" name="interests" value="development" />
          <label htmlFor="development" className="text-sm text-foreground">
            Development
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" name="interests" value="marketing" />
          <label htmlFor="marketing" className="text-sm text-foreground">
            Marketing
          </label>
        </div>
      </CheckboxGroup>
    </div>
  );
}

export function ControlledCheckboxGroupExample() {
  const [selected, setSelected] = useState<string[]>(["react"]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Select frameworks you know
      </label>
      <CheckboxGroup value={selected} onValueChange={setSelected}>
        <div className="flex items-center space-x-2">
          <Checkbox id="react" name="frameworks" value="react" />
          <label htmlFor="react" className="text-sm text-foreground">
            React
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="vue" name="frameworks" value="vue" />
          <label htmlFor="vue" className="text-sm text-foreground">
            Vue
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="angular" name="frameworks" value="angular" />
          <label htmlFor="angular" className="text-sm text-foreground">
            Angular
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="svelte" name="frameworks" value="svelte" />
          <label htmlFor="svelte" className="text-sm text-foreground">
            Svelte
          </label>
        </div>
      </CheckboxGroup>
      <p className="text-sm text-muted-foreground">
        Selected: {selected.length > 0 ? selected.join(", ") : "None"}
      </p>
    </div>
  );
}

export function HorizontalCheckboxGroupExample() {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Notification preferences
      </label>
      <CheckboxGroup defaultValue={["email"]} className="flex flex-row gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="email-notif" name="notifications" value="email" />
          <label htmlFor="email-notif" className="text-sm text-foreground">
            Email
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sms-notif" name="notifications" value="sms" />
          <label htmlFor="sms-notif" className="text-sm text-foreground">
            SMS
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="push-notif" name="notifications" value="push" />
          <label htmlFor="push-notif" className="text-sm text-foreground">
            Push
          </label>
        </div>
      </CheckboxGroup>
    </div>
  );
}

export function DisabledCheckboxGroupExample() {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        Plan features (upgrade to enable)
      </label>
      <CheckboxGroup disabled defaultValue={["basic"]}>
        <div className="flex items-center space-x-2">
          <Checkbox id="basic" name="features" value="basic" />
          <label htmlFor="basic" className="text-sm text-muted-foreground">
            Basic features
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="advanced" name="features" value="advanced" />
          <label htmlFor="advanced" className="text-sm text-muted-foreground">
            Advanced features
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="premium" name="features" value="premium" />
          <label htmlFor="premium" className="text-sm text-muted-foreground">
            Premium features
          </label>
        </div>
      </CheckboxGroup>
    </div>
  );
}
