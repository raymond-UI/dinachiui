"use client";

import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function DefaultTextareaExample() {
  return (
    <Textarea placeholder="Tell us what happened" className="max-w-md" />
  );
}

export function TextareaWithLabelExample() {
  return (
    <div className="space-y-2 w-full max-w-md">
      <label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</label>
      <Textarea
        id="bio"
        placeholder="A sentence or two about yourself"
        rows={4}
      />
      <p className="text-sm text-muted-foreground">
        This appears on your public profile.
      </p>
    </div>
  );
}

export function TextareaDisabledExample() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="disabled-note" className="text-sm font-medium text-foreground">Disabled</label>
        <Textarea id="disabled-note" placeholder="Not accepting notes right now" disabled />
      </div>
      <div className="space-y-2">
        <label htmlFor="readonly-note" className="text-sm font-medium text-foreground">Read-only</label>
        <Textarea
          id="readonly-note"
          value="Submitted on 12 March. Edits are closed."
          readOnly
        />
      </div>
    </div>
  );
}

export function TextareaWithCountExample() {
  const [value, setValue] = useState('');
  const limit = 180;

  return (
    <div className="space-y-2 w-full max-w-md">
      <label htmlFor="summary" className="text-sm font-medium text-foreground">Summary</label>
      <Textarea
        id="summary"
        placeholder="What is this release about?"
        rows={4}
        maxLength={limit}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-describedby="summary-count"
      />
      {/* Announced on change rather than silently, so a screen reader user is not the
          last to know they are running out of room. */}
      <p id="summary-count" aria-live="polite" className="text-sm text-muted-foreground">
        {value.length} / {limit} characters
      </p>
    </div>
  );
}
