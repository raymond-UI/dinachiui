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

/** How long the confirmed label stays up in the one test that has to watch it arrive. */
const CONFIRMED_WINDOW = 400

function buttonOf() {
  return screen.getByRole('button')
}

/**
 * jsdom lays nothing out and computes no border shorthand, so every measurement the
 * outline variants make is zero and the geometry they draw is vacuously correct. These
 * are the four values `useBox` reads, and the ones a real button would report.
 */
function stubBox({
  width,
  height,
  border,
  radius,
}: {
  width: number
  height: number
  border: number
  radius: number
}) {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(width)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(height)

  const computed = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((...args) => {
    const style = computed(...(args as Parameters<typeof computed>))
    // Proxied rather than replaced: jsdom and Testing Library read plenty of other
    // properties off this object, and a bare stub would strip all of them.
    return new Proxy(style, {
      get(target, key) {
        if (key === 'borderTopWidth') return `${border}px`
        if (key === 'borderTopLeftRadius') return `${radius}px`
        const value = Reflect.get(target, key) as unknown
        return typeof value === 'function' ? value.bind(target) : value
      },
    })
  })
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
      // The confirmed state is a window, not an instant, and this test has to sample it
      // from the outside. At `HOLD` the window is 60ms — shorter than the interval
      // `waitFor` polls on once the machine is busy, so a correct component reads as a
      // broken one. Long enough to observe, short enough to still be a test.
      render(
        <HoldToConfirm duration={HOLD} resetAfter={CONFIRMED_WINDOW} confirmedLabel="Deleted">
          Delete
        </HoldToConfirm>
      )

      press(buttonOf())
      await waitFor(() => expect(buttonOf()).toHaveTextContent('Deleted'))
      expect(buttonOf()).toHaveAttribute('data-confirmed')

      await waitFor(() =>
        expect(buttonOf()).not.toHaveAttribute('data-confirmed')
      )
      await waitFor(() => expect(buttonOf()).toHaveTextContent('Delete'))
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
      // The padding is the room the circle is drawn in. With none the button is only
      // as big as its icon and the stroke lands on the glyph instead of around it.
      expect(buttonOf()).toHaveClass('aspect-square', 'rounded-full', 'p-2.5')
    })

    it('reserves the border it draws itself', () => {
      render(<HoldToConfirm variant="border">Delete</HoldToConfirm>)

      // Transparent rather than absent: the border still has to take up its width, so
      // this sits the same size as `fill` and the SVG gets a box to draw in.
      expect(buttonOf()).toHaveClass('border-transparent')
    })

    it('covers the border box with the fill, not the padding box', () => {
      const { container } = render(<HoldToConfirm>Delete</HoldToConfirm>)

      // The bar and the inverted copy of the label clipped to its edge.
      const layers = container.querySelectorAll('[aria-hidden="true"].absolute')
      expect(layers).toHaveLength(2)

      // `inset-0` would stop at the padding box and leave the button's own border
      // showing as a hairline the bar never reaches.
      for (const layer of layers) {
        expect(layer).toHaveClass('-inset-px')
      }
    })
  })

  /**
   * SVG cannot inherit a border radius, so the outline variants redraw the button's own
   * geometry from a measurement. Everything here is arithmetic on that measurement, and
   * without a stubbed layout it is arithmetic on zero.
   */
  describe('outline geometry', () => {
    it('fits the ring inside the padding box, half a stroke in', () => {
      stubBox({ width: 40, height: 40, border: 1, radius: 9999 })
      const { container } = render(
        <HoldToConfirm variant="ring" aria-label="Delete" />
      )

      // 40px less a 1px border on each side is a 38px padding box, and half the 2px
      // stroke again, so the whole width stays inside the button's `overflow: hidden`.
      for (const circle of container.querySelectorAll('circle')) {
        expect(circle).toHaveAttribute('cx', '19')
        expect(circle).toHaveAttribute('cy', '19')
        expect(circle).toHaveAttribute('r', '18')
      }
    })

    it('traces the outline as two halves meeting at the bottom centre', () => {
      stubBox({ width: 200, height: 40, border: 1, radius: 8 })
      const { container } = render(
        <HoldToConfirm variant="border">Delete</HoldToConfirm>
      )

      // A 198×38 padding box, a corner tightened by the border it sits inside and by
      // the half stroke the trace is inset by: 8 − 1 − 1.
      const paths = [...container.querySelectorAll('path')].map((path) =>
        path.getAttribute('d')
      )
      expect(paths).toEqual([
        'M 99 1 H 191 A 6 6 0 0 1 197 7 V 31 A 6 6 0 0 1 191 37 H 99',
        'M 99 1 H 7 A 6 6 0 0 0 1 7 V 31 A 6 6 0 0 0 7 37 H 99',
        // The rail is drawn from the same two strings, so it cannot drift from the trace.
        'M 99 1 H 191 A 6 6 0 0 1 197 7 V 31 A 6 6 0 0 1 191 37 H 99',
        'M 99 1 H 7 A 6 6 0 0 0 1 7 V 31 A 6 6 0 0 0 7 37 H 99',
      ])
    })

    it('clamps a radius the element is too small to honour', () => {
      // `rounded-full` computes to 9999px on a 38px-tall button. Taken literally the
      // corner arcs would swallow the straight edges and the path would not close.
      stubBox({ width: 200, height: 40, border: 1, radius: 9999 })
      const { container } = render(
        <HoldToConfirm variant="border">Delete</HoldToConfirm>
      )

      // Half the padding box's short side, less the half stroke.
      expect(container.querySelector('path')).toHaveAttribute(
        'd',
        'M 99 1 H 179 A 18 18 0 0 1 197 19 V 19 A 18 18 0 0 1 179 37 H 99'
      )
    })

    it('draws no outline at all before it has been measured', () => {
      // Every coordinate would be zero, which paints a dot in the corner of the button.
      const { container } = render(
        <HoldToConfirm variant="border">Delete</HoldToConfirm>
      )

      expect(container.querySelector('svg')).toBeNull()
    })
  })

  describe('assistive tech', () => {
    it('says that the button has to be held, since nothing else conveys it', () => {
      render(<HoldToConfirm>Delete</HoldToConfirm>)

      expect(buttonOf()).toHaveAccessibleDescription('Press and hold to confirm')
      // The description must not become part of the name, or the button announces its
      // own instructions every time it is reached.
      expect(buttonOf()).toHaveAccessibleName('Delete')
    })

    it('takes a hold hint of its own', () => {
      render(<HoldToConfirm holdHint="Hold to delete this project">Delete</HoldToConfirm>)

      expect(buttonOf()).toHaveAccessibleDescription('Hold to delete this project')
    })

    it('announces the confirmation, which is otherwise only a name change', async () => {
      render(
        <HoldToConfirm duration={HOLD} resetAfter={CONFIRMED_WINDOW} confirmedLabel="Deleted">
          Delete
        </HoldToConfirm>
      )

      expect(buttonOf()).toHaveAttribute('aria-live', 'polite')

      press(buttonOf())
      await waitFor(() => expect(buttonOf()).toHaveTextContent('Deleted'))
    })
  })

  describe('element API', () => {
    it('renders as another element', () => {
      render(<HoldToConfirm render={<a href="/delete" />}>Delete</HoldToConfirm>)

      expect(screen.getByRole('link')).toHaveAttribute('href', '/delete')
    })

    it('keeps button-only attributes off an element that has no use for them', () => {
      render(
        <HoldToConfirm render={<a href="/delete" />} disabled>
          Delete
        </HoldToConfirm>
      )

      const link = screen.getByRole('link')
      // `disabled` on an anchor is invalid and, worse, inert: it reads as unavailable to
      // nobody and still follows the href.
      expect(link).not.toHaveAttribute('type')
      expect(link).not.toHaveAttribute('disabled')
      expect(link).toHaveAttribute('aria-disabled', 'true')
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
