import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
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
import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { agentConformance } from '../test/agent-conformance'

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

    expect(screen.getByText(/No results/)).toBeInTheDocument()
    expect(screen.getByTestId('autocomplete-separator')).toHaveClass('h-px', 'bg-border')
  })
})

const fruits = ['Apple', 'Banana', 'Cherry']

function Fruit(props: Omit<React.ComponentProps<typeof Autocomplete>, 'children'>) {
  return (
    <Autocomplete items={fruits} {...props}>
      <AutocompleteInput aria-label="Fruit" />
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
}

agentConformance({
  name: 'Autocomplete',
  label: 'Fruit',
  render: ({ onChange, disabled }) => <Fruit disabled={disabled} onValueChange={onChange} />,
  entry: { component: 'combobox', value: '', items: fruits, actions: ['setValue', 'search'] },
  act: { action: 'setValue', args: ['Cherry'], result: { value: 'Cherry' } },
  commits: 4,
  person: async (user) => {
    await user.type(screen.getByRole('combobox'), 'a')
  },
})

describe('Autocomplete: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent()
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
    const run = (action: string, ...args: unknown[]) => agent.act({ steps: [{ ref: 'Fruit', action, args }] })
    return { run, entry: () => agent.snapshot().find((c) => c.label === 'Fruit')! }
  }

  it('searches, and returns the suggestions the list then shows', async () => {
    const onValueChange = vi.fn()
    const { run, entry } = mount(<Fruit onValueChange={onValueChange} />)
    expect(await run('search', 'an')).toMatchObject({ ok: true, steps: [{ result: ['Banana'] }] })
    expect(screen.getByRole('combobox')).toHaveValue('an')
    expect(entry()).toMatchObject({ value: 'an', items: ['Banana'] })
    expect(onValueChange.mock.calls.every(([, d]) => isAgentChange(d))).toBe(true)
  })

  it('returns no suggestions as an empty list', async () => {
    const { run } = mount(<Fruit />)
    expect(await run('search', 'zz')).toMatchObject({ ok: true, steps: [{ result: [] }] })
  })

  it('takes free text that matches no suggestion', async () => {
    const { run, entry } = mount(<Fruit />)
    await run('setValue', 'Mango')
    expect(entry().value).toBe('Mango')
  })

  it('reads object items by their label', () => {
    const { entry } = mount(<Fruit items={[{ value: 'b', label: 'Banana' }]} />)
    expect(entry().items).toEqual(['Banana'])
  })

  it('leaves the text and the list as they were when the app refuses a search', async () => {
    const onOpenChange = vi.fn()
    const { run, entry } = mount(
      <Fruit defaultValue="Ap" onOpenChange={onOpenChange} onValueChange={(_, details) => details.cancel()} />
    )
    expect((await run('search', 'an')).ok).toBe(false)
    expect(entry().value).toBe('Ap')
    expect(onOpenChange.mock.calls.map((call) => call[0])).toEqual([true, false])
  })

  it('refuses to change a read-only autocomplete', async () => {
    const onValueChange = vi.fn()
    const { run } = mount(<Fruit readOnly onValueChange={onValueChange} />)
    expect((await run('search', 'Ch')).error?.message).toMatch(/read-only/)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
