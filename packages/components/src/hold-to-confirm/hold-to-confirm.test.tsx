import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { HoldToConfirm } from './hold-to-confirm'

/**
 * jsdom has no pointer capture. The component relies on it to keep receiving events
 * once the finger leaves the button, which is the difference between a hold that
 * survives a small drag and one that quietly disarms.
 */
beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn()
  Element.prototype.releasePointerCapture = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

/**
 * Real timers throughout. The progress rides on animation frames, and a faked clock
 * does not drive those, so the hold would never complete no matter how far it advanced.
 * Short enough to keep the suite quick, long enough to still be a hold.
 */
const HOLD = 60

function buttonOf() {
  return screen.getByRole('button')
}

/** A primary press. Which button was pressed is part of what the component checks. */
function press(node: HTMLElement) {
  fireEvent.pointerDown(node, { button: 0, pointerId: 1 })
}

function release(node: HTMLElement) {
  fireEvent.pointerUp(node, { button: 0, pointerId: 1 })
}

/** Long enough for anything the component was going to do to have happened. */
function settle(ms = HOLD * 4) {
  return act(() => new Promise((resolve) => setTimeout(resolve, ms)))
}

describe('HoldToConfirm', () => {
  it('renders a button that does not submit anything by accident', () => {
    render(<HoldToConfirm>Delete</HoldToConfirm>)

    expect(buttonOf()).toHaveAttribute('type', 'button')
    expect(buttonOf()).toHaveTextContent('Delete')
  })

  describe('holding', () => {
    it('confirms once the hold completes', async () => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm} resetAfter={0}>
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      expect(onConfirm).not.toHaveBeenCalled()

      await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1))
      expect(buttonOf()).toHaveAttribute('data-confirmed')
    })

    /**
     * The hold is long, so a parent re-rendering part-way through it is ordinary. What
     * fires has to be the handler that exists when the hold finishes, not the one that
     * existed when the finger landed — a handler closing over a selected row is the
     * whole reason this component gets reached for.
     */
    it('calls the onConfirm it was given at the end of the hold, not the start', async () => {
      const before = vi.fn()
      const after = vi.fn()

      const { rerender } = render(
        <HoldToConfirm duration={HOLD} onConfirm={before} resetAfter={0}>
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      rerender(
        <HoldToConfirm duration={HOLD} onConfirm={after} resetAfter={0}>
          Delete
        </HoldToConfirm>
      )

      await waitFor(() => expect(after).toHaveBeenCalledTimes(1))
      expect(before).not.toHaveBeenCalled()
    })

    it('does not confirm a hold that was let go of', async () => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm}>
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      release(buttonOf())
      await settle()

      // Backing out has to be free, or the control is a trap rather than a guard.
      expect(onConfirm).not.toHaveBeenCalled()
    })

    it('marks itself as held, so the press feedback is not tied to :active', () => {
      render(<HoldToConfirm duration={HOLD}>Delete</HoldToConfirm>)

      press(buttonOf())
      expect(buttonOf()).toHaveAttribute('data-holding')

      release(buttonOf())
      expect(buttonOf()).not.toHaveAttribute('data-holding')
    })

    it('ignores a right-press, which is not an intent to confirm', async () => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm}>
          Delete
        </HoldToConfirm>
      )

      fireEvent.pointerDown(buttonOf(), { button: 2, pointerId: 1 })
      await settle()

      expect(onConfirm).not.toHaveBeenCalled()
    })

    it('does nothing at all while disabled', async () => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm} disabled>
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      await settle()

      expect(onConfirm).not.toHaveBeenCalled()
    })

    it('lets go when the button loses focus, since the hold can no longer be watched', async () => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm}>
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      fireEvent.blur(buttonOf())
      await settle()

      expect(onConfirm).not.toHaveBeenCalled()
    })
  })

  describe('keyboard', () => {
    it.each([
      ['Space', ' '],
      ['Enter', 'Enter'],
    ])('holds on %s', async (_name, key) => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm} resetAfter={0}>
          Delete
        </HoldToConfirm>
      )

      // Otherwise this control is mouse-only, which for a destructive action means
      // some users simply cannot perform it.
      fireEvent.keyDown(buttonOf(), { key })

      await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1))
    })

    it('lets go on key up', async () => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm}>
          Delete
        </HoldToConfirm>
      )

      fireEvent.keyDown(buttonOf(), { key: ' ' })
      fireEvent.keyUp(buttonOf(), { key: ' ' })
      await settle()

      expect(onConfirm).not.toHaveBeenCalled()
    })

    it('ignores the auto-repeat, so a held key stays one hold', async () => {
      const onConfirm = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onConfirm={onConfirm} resetAfter={0}>
          Delete
        </HoldToConfirm>
      )

      fireEvent.keyDown(buttonOf(), { key: ' ' })
      fireEvent.keyDown(buttonOf(), { key: ' ', repeat: true })
      fireEvent.keyDown(buttonOf(), { key: ' ', repeat: true })

      // Restarting on every repeat would make the hold unfinishable.
      await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1))
    })
  })

  describe('confirmed state', () => {
    it('swaps the label and then returns', async () => {
      render(
        <HoldToConfirm duration={HOLD} resetAfter={HOLD} confirmedLabel="Deleted">
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      await waitFor(() => expect(buttonOf()).toHaveAttribute('data-confirmed'))
      expect(buttonOf()).toHaveTextContent('Deleted')

      await waitFor(() =>
        expect(buttonOf()).not.toHaveAttribute('data-confirmed')
      )
      expect(buttonOf()).toHaveTextContent('Delete')
    })

    it('stays confirmed when asked to', async () => {
      render(
        <HoldToConfirm duration={HOLD} resetAfter={0} confirmedLabel="Deleted">
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      await waitFor(() => expect(buttonOf()).toHaveAttribute('data-confirmed'))
      await settle()

      expect(buttonOf()).toHaveAttribute('data-confirmed')
      expect(buttonOf()).toHaveTextContent('Deleted')
    })
  })

  describe('variants', () => {
    it('sweeps a bar behind the label by default', () => {
      const { container } = render(<HoldToConfirm>Delete</HoldToConfirm>)

      expect(container.querySelector('svg')).toBeNull()
      expect(container.querySelector('.bg-destructive')).toBeInTheDocument()
    })

    it('closes a ring for an icon-only button', () => {
      const { container } = render(
        <HoldToConfirm variant="ring" aria-label="Delete" />
      )

      // A rail behind the trace, so the track the stroke runs on is always visible.
      expect(container.querySelectorAll('circle')).toHaveLength(2)
      expect(buttonOf()).toHaveClass('aspect-square', 'rounded-full')
    })

    it('reserves the border it draws itself', () => {
      render(<HoldToConfirm variant="border">Delete</HoldToConfirm>)

      // Transparent rather than absent: the border still has to take up its width, so
      // this sits the same size as `fill` and the SVG gets a box to draw in.
      expect(buttonOf()).toHaveClass('border-transparent')
    })
  })

  describe('element API', () => {
    it('renders as another element', () => {
      render(<HoldToConfirm render={<a href="/delete" />}>Delete</HoldToConfirm>)

      expect(screen.getByRole('link')).toHaveAttribute('href', '/delete')
    })

    it('forwards a ref to the button', () => {
      const ref = { current: null as HTMLButtonElement | null }
      render(<HoldToConfirm ref={ref}>Delete</HoldToConfirm>)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('runs a consumer handler alongside its own rather than instead of it', () => {
      const onPointerDown = vi.fn()
      render(
        <HoldToConfirm duration={HOLD} onPointerDown={onPointerDown}>
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())

      // A hold whose release path was overwritten stays armed and confirms on its own.
      expect(onPointerDown).toHaveBeenCalledTimes(1)
      expect(buttonOf()).toHaveAttribute('data-holding')
    })

    it('merges className and spreads the remaining props', () => {
      render(
        <HoldToConfirm className="w-full" id="danger">
          Delete
        </HoldToConfirm>
      )

      expect(buttonOf()).toHaveClass('w-full', 'relative')
      expect(buttonOf()).toHaveAttribute('id', 'danger')
    })
  })
})
