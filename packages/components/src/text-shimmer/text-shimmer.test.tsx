import { describe, it, expect, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import {
  installWebAnimations,
  type RecordedAnimation,
} from '../test/web-animations'
import { TextShimmer } from './text-shimmer'

const uninstallWebAnimations = installWebAnimations()
afterAll(uninstallWebAnimations)

/** The loop handed to the compositor, or undefined when nothing was started. */
function loopOf(node: HTMLElement) {
  return node.getAnimations()[0] as RecordedAnimation | undefined
}

function renderShimmer(ui: React.ReactElement) {
  const result = render(ui)
  return { ...result, shimmer: screen.getByRole('status') }
}

describe('TextShimmer', () => {
  it('renders its label as a status, since it reports work in flight', () => {
    renderShimmer(<TextShimmer>Thinking…</TextShimmer>)

    expect(screen.getByRole('status')).toHaveTextContent('Thinking…')
  })

  describe('sweep', () => {
    it('travels a two-tile gradient by exactly one tile, so the loop closes on itself', () => {
      const { shimmer } = renderShimmer(<TextShimmer>Thinking…</TextShimmer>)

      expect(loopOf(shimmer)!.keyframes).toEqual([
        { backgroundPosition: '0% center' },
        { backgroundPosition: '-200% center' },
      ])
      expect(shimmer.style.backgroundSize).toBe('200% 100%')
    })

    it('paints the highlight through the glyphs rather than behind them', () => {
      const { shimmer } = renderShimmer(<TextShimmer>Thinking…</TextShimmer>)

      expect(shimmer.style.backgroundClip).toBe('text')
      // `color: transparent` would erase the gradient too, which is made of
      // `currentColor`. Only the fill is cleared.
      expect(shimmer.style.webkitTextFillColor).toBe('transparent')
      expect(shimmer.style.color).toBe('')
    })

    it('builds the gradient from currentColor and `dim`, so it themes itself', () => {
      const { shimmer } = renderShimmer(<TextShimmer dim={0.3}>Thinking…</TextShimmer>)

      // Serialisation lowercases the keyword.
      expect(shimmer.style.backgroundImage).toContain('currentcolor')
      // Both ends of the band are the dim colour; only the middle is full strength.
      expect(shimmer.style.backgroundImage).toContain(
        'color-mix(in oklab, currentcolor 30%, transparent)'
      )
    })
  })

  describe('pulse', () => {
    it('breathes between lit and dim, and touches nothing but opacity', () => {
      const { shimmer } = renderShimmer(
        <TextShimmer variant="pulse" dim={0.4}>
          Generating…
        </TextShimmer>
      )

      expect(loopOf(shimmer)!.keyframes).toEqual([
        { opacity: 1 },
        { opacity: 0.4 },
        { opacity: 1 },
      ])
      expect(shimmer.style.backgroundImage).toBe('')
      expect(shimmer.style.webkitTextFillColor).toBe('')
    })
  })

  describe('timing', () => {
    it('loops forever on a linear curve', () => {
      const { shimmer } = renderShimmer(<TextShimmer>Thinking…</TextShimmer>)

      expect(loopOf(shimmer)!.options).toMatchObject({
        iterations: Infinity,
        easing: 'linear',
      })
    })

    it('gives each variant its own default cycle length', () => {
      const { shimmer, unmount } = renderShimmer(
        <TextShimmer>Thinking…</TextShimmer>
      )
      expect(loopOf(shimmer)!.options).toMatchObject({ duration: 1600 })
      unmount()

      const pulse = renderShimmer(<TextShimmer variant="pulse">Thinking…</TextShimmer>)
      // The quieter effect can afford to come round less often.
      expect(loopOf(pulse.shimmer)!.options).toMatchObject({ duration: 1800 })
    })

    it('takes `duration` in seconds', () => {
      const { shimmer } = renderShimmer(
        <TextShimmer duration={3}>Thinking…</TextShimmer>
      )

      expect(loopOf(shimmer)!.options).toMatchObject({ duration: 3000 })
    })
  })

  describe('reduced motion', () => {
    it('stops looping but stays visibly unsettled', () => {
      const { shimmer } = renderShimmer(
        <MotionConfig reducedMotion="always">
          <TextShimmer dim={0.6}>Thinking…</TextShimmer>
        </MotionConfig>
      )

      expect(loopOf(shimmer)).toBeUndefined()
      // The dim colour is what is left of the signal, so it has to survive.
      expect(shimmer.style.opacity).toBe('0.6')
      expect(shimmer.style.backgroundImage).toBe('')
    })
  })

  describe('element API', () => {
    it('stops the loop when it unmounts', () => {
      const { shimmer, unmount } = renderShimmer(
        <TextShimmer>Thinking…</TextShimmer>
      )
      const loop = loopOf(shimmer)!

      unmount()

      expect(loop.playState).toBe('idle')
    })

    it('forwards a ref to the span', () => {
      const ref = { current: null as HTMLSpanElement | null }
      render(<TextShimmer ref={ref}>Thinking…</TextShimmer>)

      expect(ref.current).toBe(screen.getByRole('status'))
    })

    it('merges className and spreads the remaining props', () => {
      const { shimmer } = renderShimmer(
        <TextShimmer className="text-sm" aria-label="Generating a reply">
          Thinking…
        </TextShimmer>
      )

      expect(shimmer).toHaveClass('text-sm', 'inline-block')
      expect(shimmer).toHaveAttribute('aria-label', 'Generating a reply')
    })

    it('lets an inline style win over the shimmer’s own', () => {
      const { shimmer } = renderShimmer(
        <TextShimmer style={{ backgroundSize: '400% 100%' }}>Thinking…</TextShimmer>
      )

      expect(shimmer.style.backgroundSize).toBe('400% 100%')
    })
  })
})
