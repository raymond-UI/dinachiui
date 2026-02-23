"use client"

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function DefaultLabelExample() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}

export function LabelDisabledExample() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Disabled
      </Label>
      <Input type="text" id="disabled" placeholder="Disabled" disabled className="peer" />
    </div>
  );
}
