import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionConfig } from 'motion/react'
import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { agentConformance } from '../test/agent-conformance'
import { Sortable, SortableItem, SortableHandle, type SortableChangeDetails } from './sortable'

const LABELS: Record<string, string> = {
  a: 'Overview',
  b: 'Installation',
  c: 'Components',
}

function Harness({
  onChange,
  initial = ['a', 'b', 'c'],
  disabled,
}: {
  onChange?: (next: string[], details: SortableChangeDetails) => void
  initial?: string[]
  disabled?: boolean
}) {
  const [order, setOrder] = React.useState(initial)

  return (
    <Sortable
      value={order}
      aria-label="Chapters"
      disabled={disabled}
      onValueChange={(next, details) => {
        onChange?.(next, details)
        if (!details.isCanceled) setOrder(next)
      }}
    >
      {order.map((id) => (
        <SortableItem key={id} id={id} label={LABELS[id]}>
          <SortableHandle />
          <span>{LABELS[id]}</span>
        </SortableItem>
      ))}
    </Sortable>
  )
}

function order() {
  return screen.getAllByRole('listitem').map((row) => row.textContent)
}

function announcement() {
  return document.querySelector('[aria-live="assertive"]')?.textContent ?? ''
}

describe('Sortable', () => {
  it('renders the rows in the order it was given', () => {
    render(<Harness />)

    expect(order()).toEqual(['Overview', 'Installation', 'Components'])
  })

  it('names each handle after the row it moves', () => {
    render(<Harness />)

    // The handle has no text. Without this the keyboard path is three identical buttons.
    expect(screen.getByRole('button', { name: 'Reorder Overview' })).toBeInTheDocument()
  })

  describe('the keyboard path', () => {
    it('picks a row up on Space and says where it is', async () => {
      const user = userEvent.setup()
      render(<Harness />)

      await user.tab()
      await user.keyboard(' ')

      expect(screen.getByRole('button', { name: 'Reorder Overview' })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(announcement()).toContain('Overview grabbed, position 1 of 3')
    })

    it('moves the grabbed row with the arrows', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await user.tab()
      await user.keyboard(' ')
      await user.keyboard('{ArrowDown}')

      expect(onChange).toHaveBeenCalledWith(['b', 'a', 'c'], expect.objectContaining({ reason: 'keyboard' }))
      expect(order()).toEqual(['Installation', 'Overview', 'Components'])
      expect(announcement()).toContain('position 2 of 3')
    })

    it('takes Enter as well as Space', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await user.tab()
      // Two keys because two habits: Space is the listbox convention, Enter is what a
      // button teaches. The handle is both.
      await user.keyboard('{Enter}{ArrowDown}{Enter}')

      expect(onChange).toHaveBeenCalledWith(['b', 'a', 'c'], expect.objectContaining({ reason: 'keyboard' }))
      expect(screen.getByRole('button', { name: 'Reorder Overview' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })

    it('ignores Escape when it is not holding anything', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await user.tab()
      await user.keyboard('{Escape}')

      // Nothing to cancel, so nothing to announce, and the Escape belongs to whatever
      // this list is inside.
      expect(onChange).not.toHaveBeenCalled()
      expect(announcement()).toBe('')
    })

    it('ignores an arrow before the row has been picked up', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await user.tab()
      await user.keyboard('{ArrowDown}')

      // Focus alone is not a grab. Arrowing through a list is how people read it.
      expect(onChange).not.toHaveBeenCalled()
    })

    it('will not move a row off either end', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Harness onChange={onChange} />)

      await user.tab()
      await user.keyboard(' ')
      await user.keyboard('{ArrowUp}')

      expect(onChange).not.toHaveBeenCalled()
      expect(order()).toEqual(['Overview', 'Installation', 'Components'])
    })

    it('drops the row where it is on a second Space', async () => {
      const user = userEvent.setup()
      render(<Harness />)

      await user.tab()
      await user.keyboard(' {ArrowDown} ')

      expect(screen.getByRole('button', { name: 'Reorder Overview' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
      expect(order()).toEqual(['Installation', 'Overview', 'Components'])
      expect(announcement()).toContain('Overview dropped at position 2 of 3')
    })

    it('puts the row back where it started on Escape', async () => {
      const user = userEvent.setup()
      render(<Harness />)

      await user.tab()
      await user.keyboard(' {ArrowDown}{ArrowDown}')
      expect(order()).toEqual(['Installation', 'Components', 'Overview'])

      // Escape means undo what this interaction did, here as everywhere else.
      await user.keyboard('{Escape}')

      expect(order()).toEqual(['Overview', 'Installation', 'Components'])
      expect(announcement()).toContain('Cancelled')
    })

    it('drops rather than cancels when focus leaves mid-move', async () => {
      const user = userEvent.setup()
      render(<Harness />)

      await user.tab()
      await user.keyboard(' {ArrowDown}')
      await user.tab()

      // The moves already made were deliberate; only focus left.
      expect(order()).toEqual(['Installation', 'Overview', 'Components'])
      expect(announcement()).toContain('dropped at position 2 of 3')
    })
  })

  describe('reduced motion', () => {
    it('keeps the reorder and drops the lift', async () => {
      const user = userEvent.setup()
      render(
        <MotionConfig reducedMotion="always">
          <Harness />
        </MotionConfig>
      )

      await user.tab()
      await user.keyboard(' {ArrowDown}')

      // Reordering is the function. The 2% scale is not.
      expect(order()).toEqual(['Installation', 'Overview', 'Components'])
      expect(screen.getAllByRole('listitem')[1].style.transform ?? '').not.toContain(
        'scale(1.02)'
      )
    })
  })

  it('refuses to render an item outside a Sortable, where no order exists', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<SortableItem id="a" label="Overview" />)).toThrow(
      'SortableItem must be used within a Sortable'
    )

    error.mockRestore()
  })
})

agentConformance({
  name: 'Sortable',
  label: 'Chapters',
  render: ({ onChange, disabled }) => <Harness onChange={onChange} disabled={disabled} />,
  entry: { component: 'list', items: ['Overview', 'Installation', 'Components'], actions: ['move'] },
  act: { action: 'move', args: ['Components', 1], result: { value: 'Components, Overview, Installation' } },
  invalid: { action: 'move', args: ['Theming', 1], lists: ['Overview', 'Installation', 'Components'] },
  person: async (user) => {
    await user.tab()
    await user.keyboard(' {ArrowDown}')
  },
})

describe('Sortable: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent()
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
    const move = (...args: unknown[]) => agent.act({ steps: [{ ref: 'Chapters', action: 'move', args }] })
    return { agent, move }
  }

  it('moves a row to a position, counted from 1', async () => {
    const { move } = mount(<Harness />)
    expect((await move('Overview', 3)).steps[0]?.value).toBe('Installation, Components, Overview')
    expect(order()).toEqual(['Installation', 'Components', 'Overview'])
  })

  it('refuses a position outside the list, and says which are valid', async () => {
    const onChange = vi.fn()
    const { move } = mount(<Harness onChange={onChange} />)
    for (const position of [0, 4, 1.5, 'top']) {
      expect((await move('Overview', position)).error?.message).toMatch('Position must be a whole number from 1 to 3.')
    }
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does nothing when the row is already there', async () => {
    const onChange = vi.fn()
    const { move } = mount(<Harness onChange={onChange} />)
    expect((await move('Installation', 2)).ok).toBe(true)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('keeps the order when the app refuses, and says so', async () => {
    const onChange = vi.fn((_: string[], details: SortableChangeDetails) => details.cancel())
    const { move } = mount(<Harness onChange={onChange} />)
    expect((await move('Components', 1)).error?.message).toMatch(/refused/)
    expect(isAgentChange(onChange.mock.calls[0][1])).toBe(true)
    expect(order()).toEqual(['Overview', 'Installation', 'Components'])
  })

  it('lists the list once, without its handles', () => {
    const { agent } = mount(<Harness />)
    expect(agent.snapshot().map((c) => c.component)).toEqual(['list'])
  })

  it('refuses while disabled, and turns the handles off', async () => {
    const { move } = mount(<Harness disabled />)
    expect((await move('Components', 1)).error?.message).toMatch(/disabled/)
    for (const handle of screen.getAllByRole('button')) expect(handle).toBeDisabled()
  })

  it("does not announce a keyboard move the app refused", async () => {
    const user = userEvent.setup()
    render(<Harness onChange={(_, details) => details.cancel()} />)
    await user.tab()
    await user.keyboard(' {ArrowDown}')
    expect(order()).toEqual(['Overview', 'Installation', 'Components'])
    expect(announcement()).toContain('Overview grabbed')
  })
})
