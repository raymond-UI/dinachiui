import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionConfig } from 'motion/react'
import { Sortable, SortableItem, SortableHandle } from './sortable'

const LABELS: Record<string, string> = {
  a: 'Overview',
  b: 'Installation',
  c: 'Components',
}

function Harness({
  onChange,
  initial = ['a', 'b', 'c'],
}: {
  onChange?: (next: string[]) => void
  initial?: string[]
}) {
  const [order, setOrder] = React.useState(initial)

  return (
    <Sortable
      value={order}
      onValueChange={(next) => {
        setOrder(next)
        onChange?.(next)
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

      expect(onChange).toHaveBeenCalledWith(['b', 'a', 'c'])
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

      expect(onChange).toHaveBeenCalledWith(['b', 'a', 'c'])
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
