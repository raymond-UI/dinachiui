import { describe, it, expect, afterAll, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import {
  installWebAnimations,
  type RecordedAnimation,
} from '../test/web-animations'
import { Marquee } from './marquee'

const uninstallWebAnimations = installWebAnimations()
afterAll(uninstallWebAnimations)

/**
 * jsdom lays nothing out, so every width the marquee reads is zero and it concludes its
 * content already fits. These are the only two measurements it makes: one track's width,
 * and the container it has to overflow to be worth looping.
 */
function stubLayout({ track, container }: { track: number; container: number }) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: track,
  } as DOMRect)
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(container)
}

/** Wide enough to be worth looping. */
const overflowing = { track: 900, container: 300 }

/** The element the loop is applied to, one level inside the container. */
function laneOf(marquee: HTMLElement) {
  return marquee.firstElementChild as HTMLElement
}

/** What was handed to the compositor, read back off the lane. */
function loopOf(marquee: HTMLElement) {
  return laneOf(marquee).getAnimations()[0] as RecordedAnimation | undefined
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('Marquee', () => {
  it('renders its children', () => {
    render(<Marquee>shipping worldwide</Marquee>)

    expect(screen.getByText('shipping worldwide')).toBeInTheDocument()
  })

  it('sits still when the content already fits', () => {
    stubLayout({ track: 200, container: 600 })
    render(<Marquee data-testid="marquee">one pass</Marquee>)

    const marquee = screen.getByTestId('marquee')
    expect(loopOf(marquee)).toBeUndefined()
    // Nothing scrolls past, so there is nothing for a second copy to cover.
    expect(screen.getAllByText('one pass')).toHaveLength(1)
  })

  it('loops a duplicated track once the content overflows', () => {
    stubLayout(overflowing)
    render(<Marquee data-testid="marquee">one pass</Marquee>)

    const marquee = screen.getByTestId('marquee')
    expect(loopOf(marquee)).toBeDefined()
    expect(screen.getAllByText('one pass')).toHaveLength(2)
  })

  it('keeps the duplicate out of the accessibility tree and the tab order', () => {
    stubLayout(overflowing)
    render(
      <Marquee data-testid="marquee">
        <a href="/pricing">Pricing</a>
      </Marquee>
    )

    // Two copies of the link exist, but only the real one is reachable.
    expect(screen.getAllByRole('link')).toHaveLength(1)

    const duplicate = laneOf(screen.getByTestId('marquee')).lastElementChild!
    expect(duplicate).toHaveAttribute('aria-hidden', 'true')
    expect(duplicate).toHaveAttribute('inert')
  })

  it('travels one full track width, in the direction asked for', () => {
    stubLayout(overflowing)
    const { rerender } = render(<Marquee data-testid="marquee">left</Marquee>)

    const left = loopOf(screen.getByTestId('marquee'))!
    expect(left.keyframes).toEqual([
      { transform: 'translateX(0px)' },
      { transform: 'translateX(-900px)' },
    ])

    rerender(
      <Marquee data-testid="marquee" direction="right">
        left
      </Marquee>
    )

    // The same two frames, swapped. A separate pair of offsets would drift from the
    // duplicate's position and open a seam.
    expect(loopOf(screen.getByTestId('marquee'))!.keyframes).toEqual([
      { transform: 'translateX(-900px)' },
      { transform: 'translateX(0px)' },
    ])
  })

  it('runs the loop for `duration` seconds, linearly and forever', () => {
    stubLayout(overflowing)
    render(
      <Marquee data-testid="marquee" duration={12}>
        one pass
      </Marquee>
    )

    expect(loopOf(screen.getByTestId('marquee'))!.options).toMatchObject({
      duration: 12_000,
      iterations: Infinity,
      easing: 'linear',
    })
  })

  it('fades the edges while it is moving', () => {
    stubLayout(overflowing)
    render(<Marquee data-testid="marquee">one pass</Marquee>)

    expect(screen.getByTestId('marquee').style.maskImage).toContain('linear-gradient')
  })

  it('leaves a still strip unmasked, since nothing is disappearing off the edge', () => {
    stubLayout({ track: 200, container: 600 })
    render(<Marquee data-testid="marquee">one pass</Marquee>)

    expect(screen.getByTestId('marquee').style.maskImage).toBe('')
  })

  it('drops the fade when asked, even while moving', () => {
    stubLayout(overflowing)
    render(
      <Marquee data-testid="marquee" fade={false}>
        one pass
      </Marquee>
    )

    expect(screen.getByTestId('marquee').style.maskImage).toBe('')
  })

  describe('pausing', () => {
    /** Walks the ramp to its end, whichever direction it is going. */
    function settleRamp() {
      act(() => {
        vi.advanceTimersByTime(400)
      })
    }

    it('brakes on hover and lets go again on leave', () => {
      vi.useFakeTimers()
      stubLayout(overflowing)
      render(<Marquee data-testid="marquee">one pass</Marquee>)

      const marquee = screen.getByTestId('marquee')
      fireEvent.pointerEnter(marquee, { pointerType: 'mouse' })
      settleRamp()
      expect(loopOf(marquee)!.playbackRate).toBe(0)

      fireEvent.pointerLeave(marquee, { pointerType: 'mouse' })
      settleRamp()
      expect(loopOf(marquee)!.playbackRate).toBe(1)
    })

    it('runs a consumer handler alongside its own rather than instead of it', () => {
      vi.useFakeTimers()
      stubLayout(overflowing)
      const onPointerEnter = vi.fn()
      render(
        <Marquee data-testid="marquee" onPointerEnter={onPointerEnter}>
          one pass
        </Marquee>
      )

      const marquee = screen.getByTestId('marquee')
      fireEvent.pointerEnter(marquee, { pointerType: 'mouse' })
      settleRamp()

      expect(onPointerEnter).toHaveBeenCalledTimes(1)
      // The pause is a promise the component makes to keyboard users, so passing a
      // handler has to be additive — it cannot quietly take the brake off.
      expect(loopOf(marquee)!.playbackRate).toBe(0)
    })

    it('ignores a touch, which has no matching leave to restart it', () => {
      vi.useFakeTimers()
      stubLayout(overflowing)
      render(<Marquee data-testid="marquee">one pass</Marquee>)

      const marquee = screen.getByTestId('marquee')
      fireEvent.pointerEnter(marquee, { pointerType: 'touch' })
      settleRamp()

      expect(loopOf(marquee)!.playbackRate).toBe(1)
    })

    it('leaves the strip running on hover when `pauseOnHover` is off', () => {
      vi.useFakeTimers()
      stubLayout(overflowing)
      render(
        <Marquee data-testid="marquee" pauseOnHover={false}>
          one pass
        </Marquee>
      )

      const marquee = screen.getByTestId('marquee')
      fireEvent.pointerEnter(marquee, { pointerType: 'mouse' })
      settleRamp()

      expect(loopOf(marquee)!.playbackRate).toBe(1)
    })

    it('stops for focus regardless, so a keyboard user keeps the element they are on', () => {
      vi.useFakeTimers()
      stubLayout(overflowing)
      render(
        <Marquee data-testid="marquee" pauseOnHover={false}>
          <a href="/pricing">Pricing</a>
        </Marquee>
      )

      const marquee = screen.getByTestId('marquee')
      fireEvent.focus(screen.getByRole('link'))
      settleRamp()
      expect(loopOf(marquee)!.playbackRate).toBe(0)

      fireEvent.blur(screen.getByRole('link'))
      settleRamp()
      expect(loopOf(marquee)!.playbackRate).toBe(1)
    })
  })

  describe('reduced motion', () => {
    it('becomes a scroller the reader can pan themselves', () => {
      stubLayout(overflowing)
      render(
        <MotionConfig reducedMotion="always">
          <Marquee data-testid="marquee">one pass</Marquee>
        </MotionConfig>
      )

      const marquee = screen.getByTestId('marquee')
      expect(loopOf(marquee)).toBeUndefined()
      expect(marquee).toHaveClass('overflow-x-auto')
      // The overflow has to stay reachable without a pointer.
      expect(marquee).toHaveAttribute('tabindex', '0')
    })

    it('is not focusable when there was nothing to scroll in the first place', () => {
      stubLayout({ track: 200, container: 600 })
      render(
        <MotionConfig reducedMotion="always">
          <Marquee data-testid="marquee">one pass</Marquee>
        </MotionConfig>
      )

      expect(screen.getByTestId('marquee')).not.toHaveAttribute('tabindex')
    })
  })

  describe('element API', () => {
    it('forwards a ref to the container', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<Marquee ref={ref} data-testid="marquee" />)

      expect(ref.current).toBe(screen.getByTestId('marquee'))
    })

    it('merges className and spreads the remaining props', () => {
      render(<Marquee data-testid="marquee" className="border-t" aria-label="Sponsors" />)

      const marquee = screen.getByTestId('marquee')
      expect(marquee).toHaveClass('border-t', 'flex')
      expect(marquee).toHaveAttribute('aria-label', 'Sponsors')
    })
  })
})
