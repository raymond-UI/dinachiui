import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionConfig } from 'motion/react'
import { SwipeableRow, SwipeableRowGroup } from './swipeable-row'

function actions(onArchive = vi.fn(), onDelete = vi.fn()) {
  return [
    { label: 'Archive', icon: <span>A</span>, onSelect: onArchive },
    { label: 'Delete', icon: <span>D</span>, onSelect: onDelete, destructive: true },
  ]
}

function renderRow(props: Partial<React.ComponentProps<typeof SwipeableRow>> = {}) {
  return render(
    <SwipeableRow actions={actions()} {...props}>
      Weekly digest
    </SwipeableRow>
  )
}

describe('SwipeableRow', () => {
  it('renders its content', () => {
    renderRow()

    expect(screen.getByText('Weekly digest')).toBeInTheDocument()
  })

  describe('the keyboard path', () => {
    it('puts every action behind a real button, because a swipe is not an affordance', () => {
      renderRow()

      // Icon-only, so the label is the only accessible name they have.
      expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    })

    it('runs the action on click, with no gesture involved', async () => {
      const onArchive = vi.fn()
      const onDelete = vi.fn()
      render(
        <SwipeableRow actions={actions(onArchive, onDelete)}>Weekly digest</SwipeableRow>
      )

      await userEvent.click(screen.getByRole('button', { name: 'Archive' }))

      expect(onArchive).toHaveBeenCalledTimes(1)
      expect(onDelete).not.toHaveBeenCalled()
    })

    it('opens the row when an action takes focus, so the reader can see what they are on', async () => {
      renderRow()

      await userEvent.tab()

      const row = screen.getByText('Weekly digest').closest('div')?.parentElement
      await waitFor(() => expect(row?.style.transform ?? '').toContain('translateX'))
    })
  })

  describe('full swipe', () => {
    it('has no destructive layer when there is nothing to commit to', () => {
      const { container } = renderRow()

      // Without `onDismiss` the row only ever opens. Arming a threshold that leads
      // nowhere is a promise the row cannot keep.
      expect(container.querySelector('.bg-destructive.origin-right')).toBeNull()
    })

    it('carries a destructive layer once a dismiss exists', () => {
      const { container } = renderRow({ onDismiss: vi.fn() })

      expect(container.querySelector('.origin-right')).not.toBeNull()
    })
  })

  describe('grouping', () => {
    it('renders rows independently outside a group', () => {
      render(
        <>
          <SwipeableRow actions={actions()}>First</SwipeableRow>
          <SwipeableRow actions={actions()}>Second</SwipeableRow>
        </>
      )

      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('shares one open slot inside a group', async () => {
      render(
        <SwipeableRowGroup>
          <SwipeableRow actions={actions()}>First</SwipeableRow>
          <SwipeableRow actions={actions()}>Second</SwipeableRow>
        </SwipeableRowGroup>
      )

      const first = screen.getByText('First').parentElement as HTMLElement

      // Focus opens the first row, then moves on to the second. Two open rows is a state
      // the reader never asked for: they swiped a second row, so they are done with
      // the first.
      const [firstArchive, secondArchive] = screen.getAllByRole('button', {
        name: 'Archive',
      })
      firstArchive.focus()
      await waitFor(() => expect(first.style.transform).toContain('translateX(-'))

      secondArchive.focus()
      await waitFor(() =>
        expect(first.style.transform).not.toContain('translateX(-')
      )
    })
  })

  describe('reduced motion', () => {
    it('drops the drag and gives the actions room instead of revealing them', () => {
      render(
        <MotionConfig reducedMotion="always">
          <SwipeableRow actions={actions()}>Weekly digest</SwipeableRow>
        </MotionConfig>
      )

      // Two 68px actions, plus a gutter. Nothing sits underneath the row waiting to be
      // uncovered by a gesture that is switched off.
      const content = screen.getByText('Weekly digest')
      expect(content.style.paddingRight).toBe('152px')
    })
  })

  it('merges className and spreads the remaining props', () => {
    renderRow({ className: 'mb-2', 'data-testid': 'row' } as never)

    expect(screen.getByTestId('row')).toHaveClass('mb-2')
  })
})
