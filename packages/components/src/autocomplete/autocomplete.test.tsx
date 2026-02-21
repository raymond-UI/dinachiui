import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
  AutocompleteSeparator,
} from './autocomplete'

describe('Autocomplete', () => {
  it('renders input and list items', () => {
    render(
      <Autocomplete defaultOpen items={['Apple', 'Banana']}>
        <AutocompleteInput placeholder="Search fruits" />
        <AutocompleteContent>
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    )

    expect(screen.getByPlaceholderText('Search fruits')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('renders empty state and separator styles', () => {
    render(
      <Autocomplete defaultOpen items={[]}>
        <AutocompleteInput placeholder="Search fruits" />
        <AutocompleteContent>
          <AutocompleteList />
          <AutocompleteSeparator data-testid="autocomplete-separator" />
          <AutocompleteEmpty>No results</AutocompleteEmpty>
        </AutocompleteContent>
      </Autocomplete>
    )

    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(screen.getByTestId('autocomplete-separator')).toHaveClass('h-px', 'bg-border')
  })
})
