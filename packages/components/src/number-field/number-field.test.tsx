import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from './number-field'

describe('NumberField', () => {
  it('renders input and controls', () => {
    render(
      <NumberField defaultValue={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement>-</NumberFieldDecrement>
          <NumberFieldInput aria-label="quantity" />
          <NumberFieldIncrement>+</NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>
    )

    expect(screen.getByRole('textbox', { name: 'quantity' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument()
  })

  it('fires onValueChange when incremented', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <NumberField defaultValue={1} onValueChange={onValueChange}>
        <NumberFieldGroup>
          <NumberFieldDecrement>-</NumberFieldDecrement>
          <NumberFieldInput aria-label="quantity" />
          <NumberFieldIncrement>+</NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>
    )

    await user.click(screen.getByRole('button', { name: 'Increase' }))
    expect(onValueChange).toHaveBeenCalled()
  })
})

function Quantity(props: Partial<React.ComponentProps<typeof NumberField>>) {
  return (
    <NumberField {...props}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  )
}

agentConformance({
  name: 'NumberField',
  render: ({ onChange, disabled }) => (
    <Quantity defaultValue={2} min={0} max={10} disabled={disabled} onValueChange={onChange} />
  ),
  label: 'Quantity',
  entry: { component: 'number', value: 2, min: 0, max: 10, step: 1, actions: ['setValue', 'increment', 'decrement'] },
  act: { action: 'increment', result: { value: 3 } },
  person: async (user) => user.click(screen.getByRole('button', { name: 'Increase' })),
})

describe('NumberField agent', () => {
  function mount(props: Partial<React.ComponentProps<typeof NumberField>> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Quantity {...props} />
      </AgentProvider>
    )
    const act = (action: string, ...args: unknown[]) =>
      agent.act({ steps: [{ ref: 'Quantity', action, args }] })
    return { agent, act }
  }
  const input = () => screen.getByRole('textbox', { name: 'Quantity' })

  it('moves by step times the steps given', async () => {
    const { act } = mount({ defaultValue: 10, step: 5 })
    expect((await act('increment', 3)).steps[0]?.value).toBe(25)
    expect((await act('decrement', '2')).steps[0]?.value).toBe(15)
    expect(input()).toHaveValue('15')
  })

  it('clamps to min and max', async () => {
    const { act } = mount({ defaultValue: 5, min: 0, max: 10 })
    expect((await act('increment', 100)).steps[0]?.value).toBe(10)
    expect((await act('setValue', -4)).steps[0]?.value).toBe(0)
    expect((await act('setValue', '7')).steps[0]?.value).toBe(7)
    expect(input()).toHaveValue('7')
  })

  it('starts an empty field from min', async () => {
    const { act } = mount({ min: 3 })
    expect((await act('increment')).steps[0]?.value).toBe(4)
  })

  it('rejects a value that is not a number', async () => {
    const { act } = mount({ defaultValue: 1 })
    expect((await act('setValue', 'lots')).error?.message).toBe('"lots" is not a number.')
    expect(input()).toHaveValue('1')
  })

  it('refuses when read-only', async () => {
    const { act } = mount({ defaultValue: 1, readOnly: true })
    expect((await act('increment')).error?.message).toMatch(/read-only/)
    expect(input()).toHaveValue('1')
  })
})
