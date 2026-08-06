import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ExpandableCard,
  ExpandableCardTrigger,
  ExpandableCardPanel,
  ExpandableCardShared,
  ExpandableCardBody,
} from './expandable-card'

// jsdom has no layout, so every element reports `offsetParent: null` and the panel's
// visibility filter would decide nothing in it is focusable. Stand in for the layout the
// environment does not do.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get(this: HTMLElement) {
      return this.parentElement
    },
  })
})

function Card({ title = 'Shared layout' }: { title?: string } = {}) {
  return (
    <ExpandableCard>
      <ExpandableCardTrigger>
        <ExpandableCardShared part="art" className="h-20" />
        <ExpandableCardShared part="title">{title}</ExpandableCardShared>
      </ExpandableCardTrigger>
      <ExpandableCardPanel title={title}>
        <ExpandableCardShared part="art" className="h-28" />
        <ExpandableCardShared part="title">{title}</ExpandableCardShared>
        <ExpandableCardBody>Two elements with one layoutId are one object.</ExpandableCardBody>
      </ExpandableCardPanel>
    </ExpandableCard>
  )
}

describe('ExpandableCard', () => {
  it('starts closed, with the card saying what it opens', () => {
    render(<Card />)

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens into a dialog named after the card', async () => {
    const user = userEvent.setup()
    render(<Card />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByRole('dialog', { name: 'Shared layout' })).toHaveAttribute(
      'aria-modal',
      'true'
    )
  })

  it('keeps the card mounted so the shared parts have both ends to travel between', async () => {
    const user = userEvent.setup()
    render(<Card />)

    await user.click(screen.getByRole('button'))

    // A layoutId pairs two mounted elements. If the card unmounted on open there would be
    // nothing to travel from and the panel would simply appear.
    expect(screen.getAllByText('Shared layout')).toHaveLength(2)
  })

  describe('the modal contract', () => {
    it('makes the card inert while the panel is open', async () => {
      const user = userEvent.setup()
      render(<Card />)

      const trigger = screen.getByRole('button')
      await user.click(trigger)

      // A dialog the reader can still tab into is not modal, whatever the attribute says.
      expect(trigger).toHaveAttribute('inert')
    })

    it('moves focus into the panel on open', async () => {
      const user = userEvent.setup()
      render(<Card />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus())
    })

    it('holds the page still underneath', async () => {
      const user = userEvent.setup()
      render(<Card />)

      await user.click(screen.getByRole('button'))

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('sends Tab past the last control back to the first', async () => {
      const user = userEvent.setup()
      render(
        <ExpandableCard>
          <ExpandableCardTrigger>
            <ExpandableCardShared part="title">Trapped</ExpandableCardShared>
          </ExpandableCardTrigger>
          <ExpandableCardPanel title="Trapped">
            <button type="button">Act</button>
          </ExpandableCardPanel>
        </ExpandableCard>
      )

      await user.click(screen.getByRole('button', { name: 'Trapped' }))
      const close = screen.getByRole('button', { name: 'Close' })
      const act = screen.getByRole('button', { name: 'Act' })
      // The panel's own control comes first; Close is chrome and sits last.
      await waitFor(() => expect(act).toHaveFocus())

      await user.tab()
      expect(close).toHaveFocus()

      // Off the end of the panel. Anywhere but back to the top is out of the dialog.
      await user.tab()
      expect(act).toHaveFocus()
    })

    it('sends Shift+Tab off the first control round to the last', async () => {
      const user = userEvent.setup()
      render(
        <ExpandableCard>
          <ExpandableCardTrigger>
            <ExpandableCardShared part="title">Trapped</ExpandableCardShared>
          </ExpandableCardTrigger>
          <ExpandableCardPanel title="Trapped">
            <button type="button">Act</button>
          </ExpandableCardPanel>
        </ExpandableCard>
      )

      await user.click(screen.getByRole('button', { name: 'Trapped' }))
      const act = screen.getByRole('button', { name: 'Act' })
      await waitFor(() => expect(act).toHaveFocus())

      await user.tab({ shift: true })
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    })

    it('holds a panel with nothing to focus', async () => {
      const user = userEvent.setup()
      render(
        <ExpandableCard>
          <ExpandableCardTrigger>
            <ExpandableCardShared part="title">Empty</ExpandableCardShared>
          </ExpandableCardTrigger>
          <ExpandableCardPanel title="Empty" showClose={false}>
            <ExpandableCardBody>Nothing to tab to.</ExpandableCardBody>
          </ExpandableCardPanel>
        </ExpandableCard>
      )

      await user.click(screen.getByRole('button', { name: 'Empty' }))
      const before = document.activeElement
      await user.tab()

      // Nowhere to send focus, so the only correct answer is to send it nowhere. Letting
      // Tab fall through would put it on the page behind an open modal.
      expect(document.activeElement).toBe(before)
    })

    it('closes on Escape and gives focus back to the card', async () => {
      const user = userEvent.setup()
      render(<Card />)

      const trigger = screen.getByRole('button')
      await user.click(trigger)
      await user.keyboard('{Escape}')

      // The panel's DOM node outlives the close: it is mid-flight back into the card. What
      // says the dialog is closed is the card taking itself back.
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
      expect(trigger).not.toHaveAttribute('inert')
      expect(trigger).toHaveFocus()
      expect(document.body.style.overflow).toBe('')
    })

    it('closes on the close button', async () => {
      const user = userEvent.setup()
      render(<Card />)

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByRole('button', { name: 'Close' }))

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /Shared layout/ })).toHaveAttribute(
          'aria-expanded',
          'false'
        )
      )
    })
  })

  describe('controlled', () => {
    it('defers the open state to the caller', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      render(
        <ExpandableCard open={false} onOpenChange={onOpenChange}>
          <ExpandableCardTrigger>Card</ExpandableCardTrigger>
          <ExpandableCardPanel title="Card">Panel</ExpandableCardPanel>
        </ExpandableCard>
      )

      await user.click(screen.getByRole('button'))

      expect(onOpenChange).toHaveBeenCalledWith(true)
      // Asked, not assumed: the caller said closed, so it stayed closed.
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('refuses to render a trigger outside a card, which owns the shared ids', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<ExpandableCardTrigger>Orphan</ExpandableCardTrigger>)).toThrow(
      'ExpandableCardTrigger must be used within an ExpandableCard'
    )

    error.mockRestore()
  })
})
