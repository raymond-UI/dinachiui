import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { CompareSlider } from './compare-slider'

/**
 * jsdom lays nothing out and has no pointer capture, so both have to be supplied before
 * a drag can be expressed at all: the component converts a clientX into a percentage of
 * the panel, and a panel 0px wide has no percentages in it.
 */
const PANEL = { left: 0, width: 400 }

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn()
  Element.prototype.releasePointerCapture = vi.fn()
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: PANEL.left,
    width: PANEL.width,
  } as DOMRect)
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderSlider(props: Partial<React.ComponentProps<typeof CompareSlider>> = {}) {
  return render(
    <CompareSlider before={<div>Before</div>} after={<div>After</div>} {...props} />
  )
}

function handleOf() {
  return screen.getByRole('slider')
}

/** The clipped layer, which is what the divider position is actually visible as. */
function clipOf(container: HTMLElement) {
  return (container.querySelector('.absolute.inset-0.isolate') as HTMLElement).style
    .clipPath
}

/**
 * Motion batches style writes onto the next frame, so nothing the divider does lands
 * during the event that caused it — including a `set`, which has no animation to wait on
 * but still queues its write.
 */
function expectClip(container: HTMLElement, value: string) {
  return waitFor(() => expect(clipOf(container)).toBe(value))
}

/** One paint: long enough for a `set` to have landed, far too early for a 100ms tween. */
function frame() {
  return act(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  )
}

/** Long enough for a keyboard step's 100ms travel to have landed. */
function settle() {
  return act(() => new Promise((resolve) => setTimeout(resolve, 250)))
}

describe('CompareSlider', () => {
  it('renders both layers', () => {
    renderSlider()

    expect(screen.getByText('Before')).toBeInTheDocument()
    expect(screen.getByText('After')).toBeInTheDocument()
  })

  it('clips the before layer to the divider', () => {
    const { container } = renderSlider({ defaultPosition: 30 })

    expect(clipOf(container)).toBe('inset(0% 70% 0% 0%)')
  })

  it('starts where it was told to, clamped to the panel', () => {
    renderSlider({ defaultPosition: 140 })

    expect(handleOf()).toHaveAttribute('aria-valuenow', '100')
  })

  describe('the handle', () => {
    it('is a slider a screen reader can read a value off', () => {
      renderSlider({ defaultPosition: 40 })

      expect(handleOf()).toHaveAttribute('aria-valuemin', '0')
      expect(handleOf()).toHaveAttribute('aria-valuemax', '100')
      expect(handleOf()).toHaveAttribute('aria-valuenow', '40')
      expect(handleOf()).toHaveAttribute('aria-orientation', 'horizontal')
      expect(handleOf()).toHaveAccessibleName('Compare position')
    })

    it('takes a name of its own, since one panel of two needs saying which', () => {
      renderSlider({ label: 'Compare before and after retouching' })

      expect(handleOf()).toHaveAccessibleName(
        'Compare before and after retouching'
      )
    })

    it('is reachable by tab', () => {
      renderSlider()

      expect(handleOf()).toHaveAttribute('tabindex', '0')
    })
  })

  describe('keyboard', () => {
    it('steps in both directions', () => {
      renderSlider({ defaultPosition: 50, step: 2 })

      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })
      expect(handleOf()).toHaveAttribute('aria-valuenow', '52')

      fireEvent.keyDown(handleOf(), { key: 'ArrowLeft' })
      expect(handleOf()).toHaveAttribute('aria-valuenow', '50')
    })

    it('treats up and down as the same axis, since the divider only moves one way', () => {
      renderSlider({ defaultPosition: 50, step: 2 })

      fireEvent.keyDown(handleOf(), { key: 'ArrowUp' })
      expect(handleOf()).toHaveAttribute('aria-valuenow', '52')

      fireEvent.keyDown(handleOf(), { key: 'ArrowDown' })
      expect(handleOf()).toHaveAttribute('aria-valuenow', '50')
    })

    it('takes a bigger bite with shift held', () => {
      renderSlider({ defaultPosition: 50, step: 2 })

      fireEvent.keyDown(handleOf(), { key: 'ArrowRight', shiftKey: true })

      expect(handleOf()).toHaveAttribute('aria-valuenow', '60')
    })

    it('jumps to either end with Home and End', () => {
      renderSlider({ defaultPosition: 50 })

      fireEvent.keyDown(handleOf(), { key: 'End' })
      expect(handleOf()).toHaveAttribute('aria-valuenow', '100')

      fireEvent.keyDown(handleOf(), { key: 'Home' })
      expect(handleOf()).toHaveAttribute('aria-valuenow', '0')
    })

    it('announces the destination immediately, ahead of the pixels arriving', () => {
      renderSlider({ defaultPosition: 50, step: 2 })

      // The step is carried over 100ms so it does not strobe, but the announced value
      // should never be waiting on an animation.
      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })

      expect(handleOf()).toHaveAttribute('aria-valuenow', '52')
    })

    it('composes a held key into one travel rather than a queue of restarts', async () => {
      renderSlider({ defaultPosition: 50, step: 2 })

      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })
      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })
      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })

      // Each press steps from where the divider is *headed*, not from a step still in
      // flight, so three presses are three full steps.
      expect(handleOf()).toHaveAttribute('aria-valuenow', '56')
      await settle()
    })

    it('reports every step', () => {
      const onPositionChange = vi.fn()
      renderSlider({ defaultPosition: 50, step: 2, onPositionChange })

      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })

      expect(onPositionChange).toHaveBeenCalledWith(52)
    })

    it('carries the divider to the step rather than jumping it there', async () => {
      const { container } = renderSlider({ defaultPosition: 50, step: 10 })

      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })

      // A tenth of the panel in one frame strobes rather than moves, so the step is
      // still travelling a paint later.
      await frame()
      expect(clipOf(container)).not.toBe('inset(0% 40% 0% 0%)')

      await expectClip(container, 'inset(0% 40% 0% 0%)')
    })
  })

  describe('dragging', () => {
    it('moves the divider to the pointer', async () => {
      const { container } = renderSlider({ defaultPosition: 50, drag: 'panel' })
      const panel = container.firstElementChild as HTMLElement

      fireEvent.pointerDown(panel, { pointerId: 1, clientX: 100 })

      await expectClip(container, 'inset(0% 75% 0% 0%)')
    })

    it('reports the position on release rather than on every frame', () => {
      const onPositionChange = vi.fn()
      const { container } = renderSlider({ drag: 'panel', onPositionChange })
      const panel = container.firstElementChild as HTMLElement

      fireEvent.pointerDown(panel, { pointerId: 1, clientX: 100 })
      fireEvent.pointerMove(panel, { pointerId: 1, clientX: 300 })
      expect(onPositionChange).not.toHaveBeenCalled()

      fireEvent.pointerUp(panel, { pointerId: 1 })
      expect(onPositionChange).toHaveBeenCalledWith(75)
    })

    /** A press that lands where the divider already is has not changed anything. */
    it('does not report a gesture that ended where it started', () => {
      const onPositionChange = vi.fn()
      const { container } = renderSlider({
        defaultPosition: 50,
        drag: 'panel',
        onPositionChange,
      })
      const panel = container.firstElementChild as HTMLElement

      fireEvent.pointerDown(panel, { pointerId: 1, clientX: 100 })
      fireEvent.pointerMove(panel, { pointerId: 1, clientX: 200 })
      fireEvent.pointerUp(panel, { pointerId: 1 })

      expect(onPositionChange).not.toHaveBeenCalled()
    })

    it('ignores a second finger, which would jump the divider under the first', async () => {
      const { container } = renderSlider({ drag: 'panel' })
      const panel = container.firstElementChild as HTMLElement

      fireEvent.pointerDown(panel, { pointerId: 1, clientX: 100 })
      fireEvent.pointerDown(panel, { pointerId: 2, clientX: 300 })
      fireEvent.pointerMove(panel, { pointerId: 2, clientX: 320 })

      await expectClip(container, 'inset(0% 75% 0% 0%)')
    })

    it('ends the drag when pointer capture is lost, not only on pointer up', () => {
      const onPositionChange = vi.fn()
      const { container } = renderSlider({ drag: 'panel', onPositionChange })
      const panel = container.firstElementChild as HTMLElement

      fireEvent.pointerDown(panel, { pointerId: 1, clientX: 100 })
      fireEvent.lostPointerCapture(panel, { pointerId: 1 })

      // Capture can go away without a `pointerup`. The divider would otherwise stay
      // bound to a pointer that is no longer down.
      expect(onPositionChange).toHaveBeenCalledWith(25)
    })

    it('leaves the layers live in handle mode, so their content stays usable', () => {
      const onClick = vi.fn()
      const { container } = renderSlider({
        after: <button onClick={onClick}>Open</button>,
      })
      const panel = container.firstElementChild as HTMLElement

      fireEvent.click(screen.getByRole('button', { name: 'Open' }))

      expect(onClick).toHaveBeenCalled()
      expect(panel).toHaveClass('select-auto')
    })

    it('claims the whole surface in panel mode, which makes the layers inert', () => {
      const { container } = renderSlider({ drag: 'panel' })
      const panel = container.firstElementChild as HTMLElement

      expect(panel).toHaveClass('select-none', 'touch-none')
    })

    it('keeps the vertical axis free when the knob is sticky', () => {
      const { container } = renderSlider({ drag: 'panel', stickyHandle: true })
      const panel = container.firstElementChild as HTMLElement

      // A panel taller than the screen still has to scroll.
      expect(panel).toHaveClass('touch-pan-y', 'overflow-clip')
    })

    it('runs a consumer handler alongside its own rather than instead of it', async () => {
      const onPointerDown = vi.fn()
      const { container } = renderSlider({ drag: 'panel', onPointerDown })
      const panel = container.firstElementChild as HTMLElement

      fireEvent.pointerDown(panel, { pointerId: 1, clientX: 100 })

      // A slider whose pointer handlers were quietly overwritten still looks
      // interactive and is not.
      expect(onPointerDown).toHaveBeenCalledTimes(1)
      await expectClip(container, 'inset(0% 75% 0% 0%)')
    })
  })

  describe('reduced motion', () => {
    it('places a keyboard step immediately instead of carrying it', async () => {
      const { container } = render(
        <MotionConfig reducedMotion="always">
          <CompareSlider
            before={<div>Before</div>}
            after={<div>After</div>}
            defaultPosition={50}
            step={10}
          />
        </MotionConfig>
      )

      fireEvent.keyDown(handleOf(), { key: 'ArrowRight' })

      // Already arrived one paint in, where the tween would still be travelling.
      await frame()
      expect(clipOf(container)).toBe('inset(0% 40% 0% 0%)')
    })
  })

  describe('element API', () => {
    it('forwards a ref to the panel', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(
        <CompareSlider ref={ref} before={<div>Before</div>} after={<div>After</div>} />
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('merges className and spreads the remaining props', () => {
      const { container } = renderSlider({ className: 'h-64', id: 'compare' })
      const panel = container.firstElementChild as HTMLElement

      expect(panel).toHaveClass('h-64', 'relative')
      expect(panel).toHaveAttribute('id', 'compare')
    })
  })
})
