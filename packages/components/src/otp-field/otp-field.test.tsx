import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
} from './otp-field'

function renderOTP(props: Partial<React.ComponentProps<typeof OTPField>> = {}) {
  return render(
    <OTPField length={4} aria-label="verification code" {...props}>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}

describe('OTPField', () => {
  it('renders the requested number of slots', () => {
    renderOTP()
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('renders the initial value across slots', () => {
    renderOTP({ defaultValue: '1234' })
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs.map((i) => i.value)).toEqual(['1', '2', '3', '4'])
  })

  it('fires onValueChange as the user types', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderOTP({ onValueChange })

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    await user.click(inputs[0])
    await user.keyboard('1')

    expect(onValueChange).toHaveBeenCalled()
    expect(onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0]).toBe('1')
  })

  it('fires onValueComplete when all slots are filled', async () => {
    const user = userEvent.setup()
    const onValueComplete = vi.fn()
    renderOTP({ onValueComplete })

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    await user.click(inputs[0])
    await user.keyboard('1234')

    expect(onValueComplete).toHaveBeenCalledWith('1234', expect.anything())
  })

  it('disables all slots when disabled', () => {
    renderOTP({ disabled: true })
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    inputs.forEach((input) => expect(input).toBeDisabled())
  })

  it('masks entered characters when mask is set', () => {
    render(
      <OTPField length={2} defaultValue="12" mask aria-label="masked code">
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
      </OTPField>
    )
    const inputs = screen.queryAllByRole('textbox')
    expect(inputs).toHaveLength(0)
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    expect(passwordInputs.length).toBe(2)
  })

  it('renders separator between groups', () => {
    render(
      <OTPField length={4} aria-label="code">
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
        <OTPFieldSeparator>-</OTPFieldSeparator>
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
      </OTPField>
    )
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
})

function Code(props: Partial<React.ComponentProps<typeof OTPField>>) {
  return (
    <OTPField length={4} aria-label="Verification code" {...props}>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}

agentConformance({
  name: 'OTPField',
  render: ({ onChange, disabled }) => (
    <Code autoComplete="off" defaultValue="12" disabled={disabled} onValueChange={onChange} />
  ),
  label: 'Verification code',
  entry: { component: 'input', value: '12', length: 4, actions: ['setValue', 'clear'] },
  act: { action: 'setValue', args: ['4321'], result: { value: '4321' } },
  person: async (user) => {
    await user.click(screen.getAllByRole('textbox')[2])
    await user.keyboard('5')
  },
  // Base UI's root commits again once its slots register.
  commits: 2,
})

describe('OTPField agent', () => {
  function mount(props: Partial<React.ComponentProps<typeof OTPField>> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Code {...props} />
      </AgentProvider>
    )
    const act = (action: string, ...args: unknown[]) =>
      agent.act({ steps: [{ ref: 'Verification code', action, args }] })
    return { agent, act }
  }
  const slots = () => (screen.getAllByRole('textbox') as HTMLInputElement[]).map((i) => i.value).join('')

  it('fills the slots and refuses a code longer than its length', async () => {
    const { act } = mount({ autoComplete: 'off' })
    expect((await act('setValue', '12 34')).ok).toBe(true)
    expect(slots()).toBe('1234')
    const long = await act('setValue', '12345')
    expect(long.error?.message).toBe('The code is 4 characters.')
    expect(slots()).toBe('1234')
  })

  it('refuses characters its validation type rejects', async () => {
    const { act } = mount()
    const result = await act('setValue', '12ab')
    expect(result.error?.message).toMatch(/numeric characters only/)
    expect(slots()).toBe('')
  })

  it('reports a one-time code as secret, as one entry with no slots beside it', async () => {
    const { agent, act } = mount({ defaultValue: '12' })
    expect(agent.snapshot()).toEqual([expect.objectContaining({ label: 'Verification code', value: '[redacted]' })])
    expect((await act('setValue', '9876')).ok).toBe(true)
    expect(slots()).toBe('9876')
  })

  it('reports a masked code as secret whatever its autocomplete', () => {
    const { agent } = mount({ defaultValue: '12', mask: true, autoComplete: 'off' })
    expect(agent.snapshot()).toEqual([expect.objectContaining({ value: '[redacted]' })])
  })

  it('refuses when read-only', async () => {
    const { act } = mount({ defaultValue: '12', readOnly: true })
    expect((await act('clear')).error?.message).toMatch(/read-only/)
    expect(slots()).toBe('12')
  })
})
