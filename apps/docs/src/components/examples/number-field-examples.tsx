"use client"

import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from '@/components/ui/number-field';

export function DefaultNumberFieldExample() {
  return (
    <NumberField defaultValue={5} className="w-[180px]">
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}

export function NumberFieldWithMinMaxExample() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quantity (1-10)</label>
      <NumberField defaultValue={1} min={1} max={10} className="w-[180px]">
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}

export function NumberFieldWithStepExample() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Price ($)</label>
      <NumberField defaultValue={9.99} step={0.01} min={0} className="w-[180px]">
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
