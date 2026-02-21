"use client"

import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteCollection,
} from '@/components/ui/autocomplete';

const cities = ["New York", "San Francisco", "London", "Tokyo", "Paris", "Berlin", "Sydney"];

export function DefaultAutocompleteExample() {
  return (
    <Autocomplete items={cities} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search cities..." className="border-0 focus:ring-0" />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteEmpty>No cities found.</AutocompleteEmpty>
        <AutocompleteList>
          {(city: string) => (
            <AutocompleteItem key={city} value={city}>
              {city}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

const foods = [
  { value: "Fruits", items: ["Apple", "Banana", "Mango"] },
  { value: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"] },
];

export function AutocompleteWithGroupsExample() {
  return (
    <Autocomplete items={foods} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search foods..." className="border-0 focus:ring-0" />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
        <AutocompleteList>
          {(group: { value: string; items: string[] }) => (
            <AutocompleteGroup key={group.value} items={group.items}>
              <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
              <AutocompleteCollection>
                {(item: string) => (
                  <AutocompleteItem key={item} value={item}>
                    {item}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

const colors = ["Red", "Blue", "Green", "Purple", "Orange", "Yellow"];

export function AutocompleteWithClearExample() {
  return (
    <Autocomplete items={colors} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search colors..." className="border-0 focus:ring-0" />
        <AutocompleteClear />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteEmpty>No colors found.</AutocompleteEmpty>
        <AutocompleteList>
          {(color: string) => (
            <AutocompleteItem key={color} value={color}>
              {color}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}
