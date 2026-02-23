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

const frameworks = ["React", "Vue", "Angular", "Svelte", "Solid", "Next.js", "Nuxt", "Remix"];

export function DefaultComboboxExample() {
  return (
    <Combobox items={frameworks} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <ComboboxInput placeholder="Search frameworks..." />
        <ComboboxTrigger />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList>
          {(fw: string) => (
            <ComboboxItem key={fw} value={fw}>
              {fw}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const languages = [
  { value: "Frontend", items: ["JavaScript", "TypeScript", "HTML", "CSS"] },
  { value: "Backend", items: ["Python", "Go", "Rust", "Java"] },
];

export function ComboboxWithGroupsExample() {
  return (
    <Combobox items={languages} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <ComboboxInput placeholder="Search languages..." />
        <ComboboxTrigger />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxList>
          {(group: { value: string; items: string[] }) => (
            <ComboboxGroup key={group.value}>
              <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
              {group.items.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const countries = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan"];

export function ComboboxWithClearExample() {
  return (
    <Combobox items={countries} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <ComboboxInput placeholder="Select a country..." />
        <ComboboxClear />
        <ComboboxTrigger />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {(country: string) => (
            <ComboboxItem key={country} value={country}>
              {country}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
