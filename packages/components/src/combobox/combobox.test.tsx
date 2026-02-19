import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxStatus,
} from './combobox'

describe('Combobox', () => {
  it('renders input and items', () => {
    render(
      <Combobox defaultOpen>
        <ComboboxInput placeholder="Pick one" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="one">One</ComboboxItem>
            <ComboboxItem value="two">Two</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )

    expect(screen.getByPlaceholderText('Pick one')).toBeInTheDocument()
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('renders empty/status helpers', () => {
    render(
      <Combobox defaultOpen>
        <ComboboxInput />
        <ComboboxContent>
          <ComboboxList />
          <ComboboxSeparator data-testid="combobox-separator" />
          <ComboboxEmpty>No items</ComboboxEmpty>
          <ComboboxStatus data-testid="combobox-status" />
        </ComboboxContent>
      </Combobox>
    )

    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByTestId('combobox-separator')).toHaveClass('h-px', 'bg-border')
    expect(screen.getByTestId('combobox-status')).toHaveClass('sr-only')
  })
})
