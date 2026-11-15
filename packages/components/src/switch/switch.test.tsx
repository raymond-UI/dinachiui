import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { agentConformance } from '../test/agent-conformance'
import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch, SwitchThumb } from './switch'

describe('Switch', () => {
  it('renders switch and thumb', () => {
    render(
      <Switch data-testid="switch-root">
        <SwitchThumb data-testid="switch-thumb" />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toBeInTheDocument()
    expect(screen.getByTestId('switch-thumb')).toBeInTheDocument()
  })

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(
      <Switch data-testid="switch-root" onCheckedChange={onCheckedChange}>
        <SwitchThumb />
      </Switch>
    )

    await user.click(screen.getByTestId('switch-root'))
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it('supports defaultChecked', () => {
    render(
      <Switch data-testid="switch-root" defaultChecked>
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveAttribute('data-checked', '')
  })

  it('supports controlled checked state', () => {
    render(
      <Switch data-testid="switch-root" checked={true} onCheckedChange={() => {}}>
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveAttribute('data-checked', '')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()

    render(
      <Switch data-testid="switch-root">
        <SwitchThumb />
      </Switch>
    )

    const root = screen.getByTestId('switch-root')
    expect(root).toHaveAttribute('data-unchecked', '')

    await user.click(root)
    expect(root).toHaveAttribute('data-checked', '')

    await user.click(root)
    expect(root).toHaveAttribute('data-unchecked', '')
  })

  it('can be disabled', () => {
    render(
      <Switch data-testid="switch-root" disabled>
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveAttribute('data-disabled', '')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(
      <Switch data-testid="switch-root" disabled onCheckedChange={onCheckedChange}>
        <SwitchThumb />
      </Switch>
    )

    await user.click(screen.getByTestId('switch-root'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('applies custom className to root', () => {
    render(
      <Switch data-testid="switch-root" className="custom-switch">
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveClass('custom-switch')
  })

  it('applies custom className to thumb', () => {
    render(
      <Switch>
        <SwitchThumb data-testid="switch-thumb" className="custom-thumb" />
      </Switch>
    )

    expect(screen.getByTestId('switch-thumb')).toHaveClass('custom-thumb')
  })

  it('forwards ref on root', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <Switch ref={ref}>
        <SwitchThumb />
      </Switch>
    )

    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('forwards ref on thumb', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <Switch>
        <SwitchThumb ref={ref} />
      </Switch>
    )

    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})

agentConformance({
  name: 'Switch',
  label: 'Wi-Fi',
  render: ({ onChange, disabled }) => (
    <Switch aria-label="Wi-Fi" disabled={disabled} onCheckedChange={onChange}>
      <SwitchThumb />
    </Switch>
  ),
  entry: { component: 'switch', checked: false, actions: ['toggle', 'setChecked'] },
  act: { action: 'toggle', result: { checked: true } },
  person: async (user) => {
    await user.click(screen.getByRole('switch', { name: 'Wi-Fi' }))
  },
})

describe('Switch: agent', () => {
  function mount(props: React.ComponentProps<typeof Switch> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Switch aria-label="Wi-Fi" {...props} />
      </AgentProvider>
    )
    const setChecked = (value: unknown) =>
      agent.act({ steps: [{ ref: 'Wi-Fi', action: 'setChecked', args: [value] }] })
    return { switchEl: screen.getByRole('switch'), setChecked }
  }

  it('turns off with "0" and calls back as the agent', async () => {
    const onCheckedChange = vi.fn()
    const { switchEl, setChecked } = mount({ defaultChecked: true, onCheckedChange })
    expect((await setChecked('0')).ok).toBe(true)
    expect(switchEl).toHaveAttribute('aria-checked', 'false')
    expect(isAgentChange(onCheckedChange.mock.calls[0][1])).toBe(true)
  })

  it('keeps a refused change off the switch', async () => {
    const { switchEl, setChecked } = mount({ onCheckedChange: (_, details) => details.cancel() })
    expect((await setChecked(true)).error?.message).toMatch(/refused/)
    expect(switchEl).toHaveAttribute('aria-checked', 'false')
  })

  it('refuses when read-only', async () => {
    const onCheckedChange = vi.fn()
    const { setChecked } = mount({ readOnly: true, onCheckedChange })
    expect((await setChecked(true)).error?.message).toMatch(/read-only/)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
