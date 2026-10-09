import { describe, it, expect, expectTypeOf, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxStatus,
  createComboboxItems,
} from './combobox'

const users = [
  { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 'u2', name: 'Grace Hopper', email: 'grace@example.com' },
]

const userItems = createComboboxItems(users, {
  getValue: (user) => user.id,
  getLabel: (user) => user.name,
})

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

    expect(screen.getByText(/No items/)).toBeInTheDocument()
    expect(screen.getByTestId('combobox-separator')).toHaveClass('h-px', 'bg-border')
    expect(screen.getByTestId('combobox-status')).toHaveClass('sr-only')
  })

  describe('createComboboxItems', () => {
    it('reports the derived ID from onValueChange', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()

      render(
        <Combobox
          items={userItems}
          onValueChange={(value) => {
            expectTypeOf(value).toEqualTypeOf<string | null>()
            onValueChange(value)
          }}
        >
          <ComboboxInput placeholder="Pick a user" />
          <ComboboxContent>
            <ComboboxList>
              {(item: (typeof users)[number]) => (
                <ComboboxItem key={item.id} value={item.id}>
                  {item.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )

      await user.click(screen.getByPlaceholderText('Pick a user'))
      await user.click(await screen.findByText('Grace Hopper'))

      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange.mock.calls[0][0]).toBe('u2')
    })

    it('filters by the derived label', async () => {
      const user = userEvent.setup()

      render(
        <Combobox items={userItems}>
          <ComboboxInput placeholder="Pick a user" />
          <ComboboxContent>
            <ComboboxList>
              {(item: (typeof users)[number]) => (
                <ComboboxItem key={item.id} value={item.id}>
                  {item.name}
                </ComboboxItem>
              )}
            </ComboboxList>
            <ComboboxEmpty>No users</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      )

      await user.type(screen.getByPlaceholderText('Pick a user'), 'grace')

      expect(await screen.findByText('Grace Hopper')).toBeInTheDocument()
      expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument()
    })

    it('passes the original object to the list render function', async () => {
      render(
        <Combobox items={userItems} defaultOpen>
          <ComboboxInput placeholder="Pick a user" />
          <ComboboxContent>
            <ComboboxList>
              {(user: (typeof users)[number]) => (
                <ComboboxItem key={user.id} value={user.id}>
                  {user.name} {user.email}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )

      expect(await screen.findByText(/ada@example\.com/)).toBeInTheDocument()
      expect(screen.getByText(/grace@example\.com/)).toBeInTheDocument()
    })
  })
})
