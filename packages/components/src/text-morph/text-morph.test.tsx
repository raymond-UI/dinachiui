import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { TextMorph } from './text-morph'

/** The wrapper the component owns. */
function morphOf() {
  return screen.getByTestId('morph')
}

/** The per-character layer, which exists only while the morph is running. */
function charactersOf(morph: HTMLElement) {
  return [...morph.querySelectorAll('[aria-hidden="true"]')].map(
    (span) => span.textContent
  )
}

/** Long enough to outlast the default 0.25s morph and its 60ms settle margin. */
function settle() {
  act(() => {
    vi.advanceTimersByTime(600)
  })
}

afterEach(() => {
  vi.useRealTimers()
})

describe('TextMorph', () => {
  it('renders its text', () => {
    render(<TextMorph data-testid="morph">Deploying</TextMorph>)

    expect(morphOf()).toHaveTextContent('Deploying')
  })

  it('rests as a single text node, so the text stays selectable and findable', () => {
    render(<TextMorph data-testid="morph">Deploying</TextMorph>)

    // One element per character would cost selection, find-in-page, word wrapping, and
    // pronunciation. The split is worth those things only for as long as it is moving.
    expect(morphOf().querySelectorAll('span')).toHaveLength(0)
  })

  describe('morphing', () => {
    it('splits into one element per character when the text changes', () => {
      const { rerender } = render(
        <TextMorph data-testid="morph">Deploying</TextMorph>
      )
      rerender(<TextMorph data-testid="morph">Deployed</TextMorph>)

      const characters = charactersOf(morphOf())
      expect(characters.length).toBeGreaterThan(0)
      expect(characters.every((char) => char?.length === 1)).toBe(true)
    })

    it('keeps the departing characters mounted, so they have something to leave from', () => {
      const { rerender } = render(
        <TextMorph data-testid="morph">Deploying</TextMorph>
      )
      rerender(<TextMorph data-testid="morph">Deployed</TextMorph>)

      // "Deploy" survives as the same six elements and slides; only "ing" leaves and
      // only "ed" arrives. Both sets are on screen at once, which is the whole point.
      expect(charactersOf(morphOf()).join('')).toBe('Deployinged')
    })

    it('hides the characters from the accessibility tree and reads the new string once', () => {
      const { rerender } = render(
        <TextMorph data-testid="morph">Deploying</TextMorph>
      )
      rerender(<TextMorph data-testid="morph">Deployed</TextMorph>)

      // A screen reader spells out a run of one-character elements, so the moving layer
      // is decorative and a single off-screen node carries the reading.
      const reading = morphOf().querySelector('.sr-only')
      expect(reading).toHaveTextContent('Deployed')
      expect(charactersOf(morphOf()).length).toBeGreaterThan(0)
    })

    it('stitches the characters back into a text node once it settles', () => {
      vi.useFakeTimers()
      const { rerender } = render(
        <TextMorph data-testid="morph">Deploying</TextMorph>
      )
      rerender(<TextMorph data-testid="morph">Deployed</TextMorph>)
      expect(morphOf().querySelectorAll('span').length).toBeGreaterThan(0)

      settle()

      expect(morphOf().querySelectorAll('span')).toHaveLength(0)
      expect(morphOf()).toHaveTextContent('Deployed')
    })

    it('restarts the settle when the text changes again mid-flight', () => {
      vi.useFakeTimers()
      const { rerender } = render(<TextMorph data-testid="morph">One</TextMorph>)
      rerender(<TextMorph data-testid="morph">Two</TextMorph>)

      act(() => {
        vi.advanceTimersByTime(200)
      })
      rerender(<TextMorph data-testid="morph">Three</TextMorph>)
      act(() => {
        vi.advanceTimersByTime(200)
      })

      // Collapsing on the first morph's schedule would pull the characters apart under
      // the second one's feet.
      expect(morphOf().querySelectorAll('span').length).toBeGreaterThan(0)

      settle()
      expect(morphOf().querySelectorAll('span')).toHaveLength(0)
    })

    it('keeps a grapheme whole, so an emoji is one character rather than five', () => {
      const { rerender } = render(
        <TextMorph data-testid="morph">{'Hi 👨‍👩‍👧'}</TextMorph>
      )
      rerender(<TextMorph data-testid="morph">{'Hi 👨‍👩‍👧!'}</TextMorph>)

      // H, i, space, family, bang. Splitting on code points would shatter the last two
      // into their component people and the joiners between them.
      expect(charactersOf(morphOf())).toEqual(['H', 'i', ' ', '👨‍👩‍👧', '!'])
    })

    it('turns kerning and ligatures off, so the word does not twitch width as it settles', () => {
      render(<TextMorph data-testid="morph">Definitely</TextMorph>)

      // A run of one-character boxes cannot kern. Matching the resting text node to that
      // is what keeps the two states the same width.
      expect(morphOf()).toHaveClass(
        '[font-kerning:none]',
        '[font-variant-ligatures:none]'
      )
    })
  })

  describe('reduced motion', () => {
    function renderReduced(text: string) {
      return render(
        <MotionConfig reducedMotion="always">
          <TextMorph data-testid="morph">{text}</TextMorph>
        </MotionConfig>
      )
    }

    it('never splits, and crossfades the whole string instead', () => {
      const { rerender } = renderReduced('Deploying')
      rerender(
        <MotionConfig reducedMotion="always">
          <TextMorph data-testid="morph">Deployed</TextMorph>
        </MotionConfig>
      )

      expect(charactersOf(morphOf())).toEqual([])
      expect(morphOf()).toHaveTextContent('Deployed')
    })
  })

  describe('element API', () => {
    it('forwards a ref to the span', () => {
      const ref = { current: null as HTMLSpanElement | null }
      render(<TextMorph ref={ref}>Deploying</TextMorph>)

      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('merges className and spreads the remaining props', () => {
      render(
        <TextMorph data-testid="morph" className="text-lg" title="status">
          Deploying
        </TextMorph>
      )

      expect(morphOf()).toHaveClass('text-lg', 'inline-block')
      expect(morphOf()).toHaveAttribute('title', 'status')
    })
  })
})
