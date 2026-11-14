import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'
import { Textarea } from './textarea'

agentConformance({
  name: 'Textarea',
  render: ({ onChange, disabled }) => (
    <Textarea aria-label="Notes" defaultValue="Draft" disabled={disabled} onValueChange={onChange} />
  ),
  label: 'Notes',
  entry: { component: 'textarea', value: 'Draft', actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: ['Final'], result: { value: 'Final' } },
  person: async (user) => user.type(screen.getByRole('textbox', { name: 'Notes' }), 'x'),
})

describe('Textarea', () => {
  it('still calls onChange for a person', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onValueChange = vi.fn()
    render(<Textarea aria-label="Notes" onChange={onChange} onValueChange={onValueChange} />)
    await user.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('a', expect.objectContaining({ reason: 'none' }))
  })

  it('sends the agent an input event when only onChange is wired', async () => {
    const agent = createAgent()
    const onChange = vi.fn()
    render(
      <AgentProvider agent={agent}>
        <Textarea aria-label="Notes" onChange={onChange} />
      </AgentProvider>
    )
    const result = await agent.act({ steps: [{ ref: 'Notes', action: 'setValue', args: ['Hello'] }] })
    expect(result.ok).toBe(true)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('textbox')).toHaveValue('Hello')
  })

  it('refuses when read-only', async () => {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Textarea aria-label="Notes" defaultValue="Kept" readOnly />
      </AgentProvider>
    )
    const result = await agent.act({ steps: [{ ref: 'Notes', action: 'clear' }] })
    expect(result.error?.message).toMatch(/read-only/)
    expect(screen.getByRole('textbox')).toHaveValue('Kept')
  })
})
