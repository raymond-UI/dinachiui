import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio, RadioGroup } from './radio'
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'

describe('Radio', () => {
  it('renders radio group and items', () => {
    render(
      <RadioGroup defaultValue="a" aria-label="options">
        <Radio aria-label="Option A" value="a" />
        <Radio aria-label="Option B" value="b" />
      </RadioGroup>
    )

    expect(screen.getByRole('radiogroup', { name: 'options' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeInTheDocument()
  })

  it('calls onValueChange when a radio is selected', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <RadioGroup defaultValue="a" onValueChange={onValueChange} aria-label="options">
        <Radio aria-label="Option A" value="a" />
        <Radio aria-label="Option B" value="b" />
      </RadioGroup>
    )

    await user.click(screen.getByRole('radio', { name: 'Option B' }))
    expect(onValueChange).toHaveBeenCalledWith('b', expect.any(Object))
  })
})

agentConformance({
  name: 'RadioGroup',
  label: 'Plan',
  render: ({ onChange, disabled }) => (
    <RadioGroup aria-label="Plan" defaultValue="free" disabled={disabled} onValueChange={onChange}>
      <Radio aria-label="Free" value="free" />
      <Radio aria-label="Pro" value="pro" />
    </RadioGroup>
  ),
  entry: { component: 'radio-group', value: 'Free', items: ['Free', 'Pro'], actions: ['select'] },
  act: { action: 'select', args: ['Pro'], result: { value: 'Pro' } },
  invalid: { action: 'select', args: ['Team'], lists: ['Free', 'Pro'] },
  commits: 2,
  person: async (user) => {
    await user.click(screen.getByRole('radio', { name: 'Pro' }))
  },
})

describe('RadioGroup: agent', () => {
  function mount(group: Partial<React.ComponentProps<typeof RadioGroup>> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <RadioGroup aria-label="Plan" defaultValue="free" {...group}>
          <label><Radio value="free" /> Free</label>
          <label><Radio value="pro" /> Pro</label>
          <label><Radio value="team" disabled /> Team</label>
        </RadioGroup>
      </AgentProvider>
    )
    return agent
  }
  const select = (agent: ReturnType<typeof createAgent>, choice: unknown) =>
    agent.act({ steps: [{ ref: 'Plan', action: 'select', args: [choice] }] })

  it('lists one group, labelled by each radio\'s label, and no separate radios', () => {
    const agent = mount()
    const entries = agent.snapshot()
    expect(entries.filter((c) => c.component === 'radio-group')).toHaveLength(1)
    expect(entries.find((c) => c.label === 'Plan')).toMatchObject({ items: ['Free', 'Pro', 'Team'] })
    expect(entries.some((c) => c.label === 'Free' || c.label === 'Pro')).toBe(false)
  })

  it('matches a choice by value as well as label', async () => {
    const agent = mount()
    expect(await select(agent, 'pro')).toMatchObject({ ok: true, steps: [{ value: 'Pro' }] })
  })

  it('refuses a disabled radio', async () => {
    const onValueChange = vi.fn()
    const agent = mount({ onValueChange })
    const result = await select(agent, 'Team')
    expect(result.ok).toBe(false)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('refuses when read-only', async () => {
    const onValueChange = vi.fn()
    const agent = mount({ readOnly: true, onValueChange })
    const result = await select(agent, 'Pro')
    expect(result.error?.message).toMatch(/read-only/)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
