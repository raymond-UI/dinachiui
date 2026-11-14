import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'

describe('ToggleGroup', () => {
  it('renders group and items', () => {
    render(
      <ToggleGroup aria-label="formatting" defaultValue={['bold']} multiple>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    )

    expect(screen.getByRole('group', { name: 'formatting' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
  })

  it('calls onValueChange when toggled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <ToggleGroup aria-label="formatting" defaultValue={['bold']} multiple onValueChange={onValueChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    )

    await user.click(screen.getByRole('button', { name: 'Italic' }))
    expect(onValueChange).toHaveBeenCalled()

    const latestCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]
    expect(latestCall?.[0]).toEqual(expect.arrayContaining(['bold', 'italic']))
  })

  it('supports single selection (default)', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <ToggleGroup aria-label="alignment" defaultValue={['left']} onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>
    )

    await user.click(screen.getByRole('button', { name: 'Center' }))
    expect(onValueChange).toHaveBeenCalled()

    const latestCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]
    expect(latestCall?.[0]).toEqual(['center'])
  })

  it('applies custom className to group', () => {
    render(
      <ToggleGroup aria-label="test" className="custom-group">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )

    expect(screen.getByRole('group')).toHaveClass('custom-group')
  })

  it('forwards ref on group', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ToggleGroup ref={ref} aria-label="test">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  describe('ToggleGroupItem', () => {
    it('applies custom className', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" className="custom-item">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('custom-item')
    })

    it('forwards ref', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem ref={ref} value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('renders with outline variant by default', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('border')
    })

    it('renders with default variant', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" variant="default">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('bg-transparent')
      expect(screen.getByRole('button')).not.toHaveClass('border')
    })

    it('renders with sm size by default', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('h-9')
    })

    it('renders with lg size', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" size="lg">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('h-11')
    })

    it('can be disabled', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" disabled>A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
    })
  })

  it('disables all items when group is disabled', () => {
    render(
      <ToggleGroup aria-label="test" disabled>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })
  })
})

agentConformance({
  name: 'ToggleGroup',
  label: 'Alignment',
  render: ({ onChange, disabled }) => (
    <ToggleGroup aria-label="Alignment" defaultValue={['left']} disabled={disabled} onValueChange={onChange}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
    </ToggleGroup>
  ),
  entry: { component: 'toggle-group', value: 'Left', items: ['Left', 'Center'], actions: ['select'] },
  act: { action: 'select', args: ['Center'], result: { value: 'Center' } },
  invalid: { action: 'select', args: ['Right'], lists: ['Left', 'Center'] },
  commits: 2,
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Center' }))
  },
})

agentConformance({
  name: 'ToggleGroup (multiple)',
  label: 'Formatting',
  render: ({ onChange, disabled }) => (
    <ToggleGroup aria-label="Formatting" multiple defaultValue={['bold']} disabled={disabled} onValueChange={onChange}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
    </ToggleGroup>
  ),
  entry: { component: 'toggle-group', value: ['Bold'], multiple: true, actions: ['select', 'setValue'] },
  act: { action: 'setValue', args: [['Italic']], result: { value: ['Italic'] } },
  invalid: { action: 'setValue', args: [['Bold', 'Underline']], lists: ['Bold', 'Italic'] },
  commits: 2,
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Italic' }))
  },
})

describe('ToggleGroup: agent', () => {
  function mount(group: Partial<React.ComponentProps<typeof ToggleGroup>> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <ToggleGroup aria-label="Formatting" multiple defaultValue={['bold']} {...group}>
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
          <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
          <ToggleGroupItem value="strike" disabled>Strike</ToggleGroupItem>
        </ToggleGroup>
      </AgentProvider>
    )
    return agent
  }
  const act = (agent: ReturnType<typeof createAgent>, action: string, args: unknown[]) =>
    agent.act({ steps: [{ ref: 'Formatting', action, args }] })

  it('lists the group once, without its items as separate buttons', () => {
    const agent = mount()
    const entries = agent.snapshot()
    expect(entries.filter((c) => c.component === 'toggle-group')).toHaveLength(1)
    expect(entries.some((c) => c.label === 'Bold' || c.label === 'Italic')).toBe(false)
  })

  it('select adds to a multiple group, and leaves a pressed item pressed', async () => {
    const agent = mount()
    expect(await act(agent, 'select', ['Italic'])).toMatchObject({ ok: true, steps: [{ value: ['Bold', 'Italic'] }] })
    expect(await act(agent, 'select', ['bold'])).toMatchObject({ ok: true, steps: [{ value: ['Bold', 'Italic'] }] })
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('setValue replaces the whole value, and can clear it', async () => {
    const agent = mount()
    expect(await act(agent, 'setValue', [['Italic']])).toMatchObject({ ok: true, steps: [{ value: ['Italic'] }] })
    expect(await act(agent, 'setValue', [[]])).toMatchObject({ ok: true, steps: [{ value: [] }] })
  })

  it('refuses a disabled item', async () => {
    const onValueChange = vi.fn()
    const agent = mount({ onValueChange })
    expect((await act(agent, 'select', ['Strike'])).ok).toBe(false)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('single select replaces, and offers no setValue', async () => {
    const agent = mount({ multiple: false })
    expect(agent.snapshot().find((c) => c.label === 'Formatting')?.actions).toEqual(['select'])
    expect(await act(agent, 'select', ['Italic'])).toMatchObject({ ok: true, steps: [{ value: 'Italic' }] })
  })

  it('marks no items as parts outside AgentProvider', () => {
    const { container } = render(
      <ToggleGroup aria-label="Plain">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(container.querySelector('[data-agent-part]')).toBeNull()
  })
})
