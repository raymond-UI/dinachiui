import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { AnimatedList, AnimatedListItem } from './animated-list'

const ITEMS = [
  { id: 'a', label: 'Deploy finished' },
  { id: 'b', label: 'Rate limit at 80%' },
  { id: 'c', label: '3 new sign-ups' },
]

function renderList(
  items: typeof ITEMS,
  props: Omit<React.ComponentProps<typeof AnimatedList>, 'children'> = {}
) {
  return render(
    <AnimatedList {...props}>
      {items.map((item) => (
        <AnimatedListItem key={item.id} itemKey={item.id}>
          {item.label}
        </AnimatedListItem>
      ))}
    </AnimatedList>
  )
}

function itemsOf() {
  return screen.getAllByRole('listitem')
}

describe('AnimatedList', () => {
  it('renders a list', () => {
    renderList(ITEMS)

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(itemsOf().map((item) => item.textContent)).toEqual(
      ITEMS.map((item) => item.label)
    )
  })

  it('keeps the list semantics and drops only the markers', () => {
    renderList(ITEMS)

    // What changes here is the membership, not the fact that this is a list.
    expect(screen.getByRole('list')).toHaveClass('list-none')
  })

  it('merges className and spreads the remaining props onto the item', () => {
    render(
      <AnimatedList>
        <AnimatedListItem className="py-2" data-testid="row">
          Deploy finished
        </AnimatedListItem>
      </AnimatedList>
    )

    expect(screen.getByTestId('row')).toHaveClass('py-2')
  })

  describe('entering', () => {
    it('lands its rows visible', async () => {
      renderList(ITEMS)

      await waitFor(() => {
        itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '1' }))
      })
    })

    it('does not animate the rows that were there on first paint', () => {
      // `initial={false}` on the presence: a list that plays an entrance for content
      // already on screen is claiming something arrived that did not.
      renderList(ITEMS)

      itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '1' }))
    })
  })

  describe('leaving', () => {
    it('holds a removed row long enough to animate it out', async () => {
      const { rerender } = renderList(ITEMS)

      rerender(
        <AnimatedList>
          {ITEMS.slice(1).map((item) => (
            <AnimatedListItem key={item.id} itemKey={item.id}>
              {item.label}
            </AnimatedListItem>
          ))}
        </AnimatedList>
      )

      // Still present: the row is leaving, not gone.
      expect(screen.getByText('Deploy finished')).toBeInTheDocument()

      await waitFor(() =>
        expect(screen.queryByText('Deploy finished')).not.toBeInTheDocument()
      )
    })

    it('sends a row the reader closed sideways', async () => {
      const { rerender } = renderList(ITEMS)

      // Removed *and* named as the reader's doing, in the same render. Nothing captured
      // at the previous render could still say which of the two happened.
      rerender(
        <AnimatedList dismissed="a">
          {ITEMS.slice(1).map((item) => (
            <AnimatedListItem key={item.id} itemKey={item.id}>
              {item.label}
            </AnimatedListItem>
          ))}
        </AnimatedList>
      )

      const leaving = screen.getByText('Deploy finished')
      await waitFor(() => expect(leaving.style.transform).toContain('translateX'))
    })

    it('collapses a row the reader did not touch in place', async () => {
      const { rerender } = renderList(ITEMS)

      // Same removal, no `dismissed`. The list is not entitled to imply the reader did it.
      rerender(
        <AnimatedList>
          {ITEMS.slice(1).map((item) => (
            <AnimatedListItem key={item.id} itemKey={item.id}>
              {item.label}
            </AnimatedListItem>
          ))}
        </AnimatedList>
      )

      const leaving = screen.getByText('Deploy finished')
      await waitFor(() => expect(leaving.style.opacity).not.toBe('1'))
      expect(leaving.style.transform).not.toMatch(/translateX\((?!0px)/)
    })
  })

  describe('reduced motion', () => {
    it('drops the travel and keeps the row', () => {
      render(
        <MotionConfig reducedMotion="always">
          <AnimatedList>
            <AnimatedListItem itemKey="a" data-testid="row">
              Deploy finished
            </AnimatedListItem>
          </AnimatedList>
        </MotionConfig>
      )

      // The row is the information. The 12px it would have travelled is not.
      expect(screen.getByTestId('row')).toBeInTheDocument()
      expect(screen.getByTestId('row').style.transform ?? '').not.toContain('-12')
    })
  })

  describe('AnimatedListItem', () => {
    it('refuses to render outside an AnimatedList, where nothing would resolve its exit', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => render(<AnimatedListItem>Orphan</AnimatedListItem>)).toThrow(
        'AnimatedListItem must be used within an AnimatedList'
      )

      error.mockRestore()
    })
  })
})
