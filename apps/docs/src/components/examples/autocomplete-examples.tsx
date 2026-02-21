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
} from '@/components/ui/autocomplete';

export function DefaultAutocompleteExample() {
  return (
    <Autocomplete>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search cities..." className="border-0 focus:ring-0" />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteEmpty>No cities found.</AutocompleteEmpty>
          <AutocompleteItem value="new-york">New York</AutocompleteItem>
          <AutocompleteItem value="san-francisco">San Francisco</AutocompleteItem>
          <AutocompleteItem value="london">London</AutocompleteItem>
          <AutocompleteItem value="tokyo">Tokyo</AutocompleteItem>
          <AutocompleteItem value="paris">Paris</AutocompleteItem>
          <AutocompleteItem value="berlin">Berlin</AutocompleteItem>
          <AutocompleteItem value="sydney">Sydney</AutocompleteItem>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

export function AutocompleteWithGroupsExample() {
  return (
    <Autocomplete>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search foods..." className="border-0 focus:ring-0" />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteEmpty>No results found.</AutocompleteEmpty>
          <AutocompleteGroup>
            <AutocompleteGroupLabel>Fruits</AutocompleteGroupLabel>
            <AutocompleteItem value="apple">Apple</AutocompleteItem>
            <AutocompleteItem value="banana">Banana</AutocompleteItem>
            <AutocompleteItem value="mango">Mango</AutocompleteItem>
          </AutocompleteGroup>
          <AutocompleteGroup>
            <AutocompleteGroupLabel>Vegetables</AutocompleteGroupLabel>
            <AutocompleteItem value="carrot">Carrot</AutocompleteItem>
            <AutocompleteItem value="broccoli">Broccoli</AutocompleteItem>
            <AutocompleteItem value="spinach">Spinach</AutocompleteItem>
          </AutocompleteGroup>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

export function AutocompleteWithClearExample() {
  return (
    <Autocomplete>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search colors..." className="border-0 focus:ring-0" />
        <AutocompleteClear />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteEmpty>No colors found.</AutocompleteEmpty>
          <AutocompleteItem value="red">Red</AutocompleteItem>
          <AutocompleteItem value="blue">Blue</AutocompleteItem>
          <AutocompleteItem value="green">Green</AutocompleteItem>
          <AutocompleteItem value="purple">Purple</AutocompleteItem>
          <AutocompleteItem value="orange">Orange</AutocompleteItem>
          <AutocompleteItem value="yellow">Yellow</AutocompleteItem>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}
