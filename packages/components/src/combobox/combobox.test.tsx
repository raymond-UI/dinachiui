import * as React from 'react'
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
import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { agentConformance } from '../test/agent-conformance'

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

const fruits = ['Apple', 'Banana', 'Cherry']

function Fruit(props: Omit<React.ComponentProps<typeof Combobox<string, boolean | undefined>>, 'children'>) {
  return (
    <Combobox items={fruits} {...props}>
      <ComboboxInput aria-label="Fruit" />
      <ComboboxContent>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

agentConformance({
  name: 'Combobox',
  label: 'Fruit',
  render: ({ onChange, disabled }) => <Fruit defaultValue="Banana" disabled={disabled} onValueChange={onChange} />,
  entry: { component: 'combobox', value: 'Banana', items: fruits, actions: ['select', 'search', 'open'] },
  act: { action: 'select', args: ['Apple'], result: { value: 'Apple' } },
  invalid: { action: 'select', args: ['Mango'], lists: fruits },
  commits: 4,
  person: async (user) => {
    await user.clear(screen.getByRole('combobox'))
    await user.type(screen.getByRole('combobox'), 'App')
    await user.click(await screen.findByRole('option', { name: 'Apple' }))
  },
})

describe('Combobox: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent()
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
    const run = (action: string, ...args: unknown[]) => agent.act({ steps: [{ ref: 'Fruit', action, args }] })
    return { agent, run, entry: () => agent.snapshot().find((c) => c.label === 'Fruit')! }
  }

  it('searches through the input, and returns the matches', async () => {
    const onInputValueChange = vi.fn()
    const { run, entry } = mount(<Fruit onInputValueChange={onInputValueChange} />)
    const result = await run('search', 'an')
    expect(result).toMatchObject({ ok: true, steps: [{ result: ['Banana'] }] })
    expect(screen.getByRole('combobox')).toHaveValue('an')
    expect(entry().open).toBe(true)
    expect(isAgentChange(onInputValueChange.mock.calls[0][1])).toBe(true)
  })

  it('returns no matches as an empty list', async () => {
    const { run } = mount(<Fruit />)
    expect(await run('search', 'zz')).toMatchObject({ ok: true, steps: [{ result: [] }] })
  })

  it('chooses while closed, and fills the input with the label', async () => {
    const { run, entry } = mount(<Fruit />)
    expect(entry().open).toBe(false)
    expect(await run('select', 'cherry')).toMatchObject({ ok: true })
    expect(entry()).toMatchObject({ value: 'Cherry', open: false })
    expect(screen.getByRole('combobox')).toHaveValue('Cherry')
  })

  it('chooses by value when items are objects', async () => {
    const onValueChange = vi.fn()
    const { run, entry } = mount(<Fruit items={[{ value: 'b', label: 'Banana' }]} onValueChange={onValueChange} />)
    expect(entry().items).toEqual(['Banana'])
    await run('select', 'b')
    expect(onValueChange.mock.calls[0][0]).toEqual({ value: 'b', label: 'Banana' })
  })

  it('labels a createItems collection by its getLabel', async () => {
    const onValueChange = vi.fn()
    const { run, entry } = mount(<Fruit items={userItems as never} defaultValue="u2" onValueChange={onValueChange} />)
    expect(entry()).toMatchObject({ value: 'Grace Hopper', items: ['Ada Lovelace', 'Grace Hopper'] })
    await run('select', 'Ada Lovelace')
    expect(onValueChange.mock.calls[0][0]).toBe('u1')
  })

  it('opens to find the choices when no items prop lists them', async () => {
    const onValueChange = vi.fn()
    const { run, entry } = mount(
      <Combobox onValueChange={onValueChange}>
        <ComboboxInput aria-label="Fruit" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value="apple">Apple</ComboboxItem>
            <ComboboxItem value="pear">Pear</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
    expect(entry().items).toBeUndefined()
    expect(await run('select', 'Pear')).toMatchObject({ ok: true })
    expect(onValueChange.mock.calls[0][0]).toBe('pear')
  })

  it('adds to a multiple selection, and replaces it with setValue', async () => {
    const onValueChange = vi.fn()
    const { run, entry } = mount(<Fruit multiple defaultValue={['Apple']} onValueChange={onValueChange} />)
    expect(entry()).toMatchObject({ multiple: true, value: ['Apple'], actions: ['select', 'setValue', 'search', 'open'] })
    await run('select', 'Cherry')
    expect(entry().value).toEqual(['Apple', 'Cherry'])
    await run('setValue', ['Banana'])
    expect(entry().value).toEqual(['Banana'])
    expect(onValueChange.mock.calls.every(([, d]) => isAgentChange(d))).toBe(true)
    expect(await run('setValue', ['Mango'])).toMatchObject({ ok: false })
  })

  it('refuses to change a read-only combobox', async () => {
    const onValueChange = vi.fn()
    const { run, entry } = mount(<Fruit readOnly defaultValue="Apple" onValueChange={onValueChange} />)
    expect((await run('select', 'Banana')).error?.message).toMatch(/read-only/)
    expect((await run('search', 'Ch')).error?.message).toMatch(/read-only/)
    expect(entry().value).toBe('Apple')
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
