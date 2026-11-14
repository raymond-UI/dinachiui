import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { Input } from './input'
import { vi } from 'vitest'
import { agentConformance } from '../test/agent-conformance'
import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { Field, FieldLabel } from '../field'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })

  it('accepts custom className', () => {
    render(<Input data-testid="input" className="custom-class" />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-class')
  })

  it('supports input types', () => {
    render(<Input data-testid="input" type="email" />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('passes through input props', () => {
    render(<Input data-testid="input" disabled required />)
    
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
    expect(input).toBeRequired()
  })
})

agentConformance({
  name: 'Input',
  label: 'Project name',
  render: ({ onChange, disabled }) => (
    <Input aria-label="Project name" defaultValue="Apollo" disabled={disabled} onValueChange={onChange} />
  ),
  entry: { component: 'input', value: 'Apollo', actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: ['Atlas'], result: { value: 'Atlas' } },
  person: async (user) => {
    await user.type(document.querySelector('input')!, 'x')
  },
})

describe('Input written by the agent', () => {
  it('sends a real input event, so onChange and the Field hear of it', async () => {
    const onChange = vi.fn()
    const onValueChange = vi.fn()
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Field data-testid="field">
          <FieldLabel>Name</FieldLabel>
          <Input onChange={onChange} onValueChange={onValueChange} />
        </Field>
      </AgentProvider>
    )
    const result = await agent.act({ steps: [{ ref: 'Name', action: 'setValue', args: ['Atlas'] }] })
    expect(result.ok).toBe(true)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('Atlas', expect.anything())
    expect(isAgentChange(onValueChange.mock.calls[0][1])).toBe(true)
    expect(screen.getByTestId('field')).toHaveAttribute('data-dirty')
    expect(screen.getByTestId('field')).toHaveAttribute('data-filled')
  })

  it('keeps a refused change from onChange and the Field', async () => {
    const agent = createAgent()
    const onChange = vi.fn()
    render(
      <AgentProvider agent={agent}>
        <Field data-testid="field">
          <FieldLabel>Name</FieldLabel>
          <Input defaultValue="Apollo" onChange={onChange} onValueChange={(_, details) => details.cancel()} />
        </Field>
      </AgentProvider>
    )
    const result = await agent.act({ steps: [{ ref: 'Name', action: 'setValue', args: ['Atlas'] }] })
    expect(result.ok).toBe(false)
    expect(screen.getByRole('textbox')).toHaveValue('Apollo')
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('field')).not.toHaveAttribute('data-dirty')
  })

  it('writes a controlled value through its parent', async () => {
    const agent = createAgent()
    function Controlled() {
      const [value, setValue] = React.useState('Apollo')
      return <Input aria-label="Name" value={value} onValueChange={setValue} />
    }
    render(
      <AgentProvider agent={agent}>
        <Controlled />
      </AgentProvider>
    )
    const result = await agent.act({ steps: [{ ref: 'Name', action: 'setValue', args: ['Atlas'] }] })
    expect(result.steps[0]).toMatchObject({ ok: true, value: 'Atlas' })
    expect(screen.getByRole('textbox')).toHaveValue('Atlas')
  })
})
