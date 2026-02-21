"use client"

import React from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
} from '@/components/ui/combobox';

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
];

export function DefaultComboboxExample() {
  return (
    <Combobox>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <ComboboxInput placeholder="Search frameworks..." className="border-0 focus:ring-0" />
        <ComboboxTrigger className="border-0" />
      </div>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          {frameworks.map((fw) => (
            <ComboboxItem key={fw.value} value={fw.value}>
              {fw.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function ComboboxWithGroupsExample() {
  return (
    <Combobox>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <ComboboxInput placeholder="Search languages..." className="border-0 focus:ring-0" />
        <ComboboxTrigger className="border-0" />
      </div>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxGroup>
            <ComboboxGroupLabel>Frontend</ComboboxGroupLabel>
            <ComboboxItem value="javascript">JavaScript</ComboboxItem>
            <ComboboxItem value="typescript">TypeScript</ComboboxItem>
            <ComboboxItem value="html">HTML</ComboboxItem>
            <ComboboxItem value="css">CSS</ComboboxItem>
          </ComboboxGroup>
          <ComboboxGroup>
            <ComboboxGroupLabel>Backend</ComboboxGroupLabel>
            <ComboboxItem value="python">Python</ComboboxItem>
            <ComboboxItem value="go">Go</ComboboxItem>
            <ComboboxItem value="rust">Rust</ComboboxItem>
            <ComboboxItem value="java">Java</ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function ComboboxWithClearExample() {
  return (
    <Combobox>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <ComboboxInput placeholder="Select a country..." className="border-0 focus:ring-0" />
        <ComboboxClear />
        <ComboboxTrigger className="border-0" />
      </div>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxItem value="us">United States</ComboboxItem>
          <ComboboxItem value="uk">United Kingdom</ComboboxItem>
          <ComboboxItem value="ca">Canada</ComboboxItem>
          <ComboboxItem value="au">Australia</ComboboxItem>
          <ComboboxItem value="de">Germany</ComboboxItem>
          <ComboboxItem value="fr">France</ComboboxItem>
          <ComboboxItem value="jp">Japan</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
