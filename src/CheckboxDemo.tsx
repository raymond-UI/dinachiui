import * as React from "react";
import { Checkbox } from "@dinachi/components/checkbox";

export function CheckboxDemo() {
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Checkbox States</h2>

      {/* Basic Usage */}
      <div className="flex items-center space-x-2">
        <Checkbox id="terms1" />
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>

      {/* Checked State (Controlled) */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="checked-checkbox"
          checked={checked3}
          onCheckedChange={setChecked3}
        />
        <label
          htmlFor="checked-checkbox"
          className="text-sm font-medium leading-none"
        >
          Checked (Controlled)
        </label>
      </div>

      {/* Unchecked State (Controlled) */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="unchecked-checkbox"
          checked={checked2}
          onCheckedChange={setChecked2}
        />
        <label
          htmlFor="unchecked-checkbox"
          className="text-sm font-medium leading-none"
        >
          Unchecked (Controlled)
        </label>
      </div>

      {/* Disabled State */}
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checkbox" disabled />
        <label
          htmlFor="disabled-checkbox"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Disabled
        </label>
      </div>

      {/* Read-Only State */}
      <div className="flex items-center space-x-2">
        <Checkbox id="readonly-checkbox" readOnly defaultChecked />
        <label
          htmlFor="readonly-checkbox"
          className="text-sm font-medium leading-none"
        >
          Read-Only
        </label>
      </div>

      {/* Form Usage */}
      <form
        className="space-y-4 rounded-lg border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const subscribe = formData.get("subscribe");
          alert(`Subscribed: ${subscribe === "on"}`);
        }}
      >
        <h3 className="font-semibold">Form Example</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="subscribe" name="subscribe" />
          <label htmlFor="subscribe" className="text-sm font-medium">
            Subscribe to our newsletter
          </label>
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Submit
        </button>
      </form>
    </div>
  );
}