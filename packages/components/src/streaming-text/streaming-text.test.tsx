import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { StreamingText } from './streaming-text'

const FIRST = 'The tier ships ten components today.'
const SECOND = ' Every one of them fires on a scroll.'

/** Fast enough that a handful of frames finishes the paragraph, so the suite is not
 *  waiting on the reading pace to prove a behaviour that has nothing to do with it. */
const INSTANT = 5000

function visibleText(container: HTMLElement) {
  return container.querySelector('[aria-hidden="true"]')?.textContent ?? ''
}

function announcement(container: HTMLElement) {
  return container.querySelector('[aria-live="polite"]')?.textContent ?? ''
}

/** A few frames of real time. The reveal is driven by `requestAnimationFrame`, so there
 *  is no timer to advance. */
function tick(ms = 60) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('StreamingText', () => {
  it('reveals the text it was given', async () => {
    const { container } = render(
      <StreamingText text={FIRST} wordsPerSecond={INSTANT} />
    )

    await waitFor(() => expect(visibleText(container)).toContain('components'))
  })

  it('starts from nothing, so the reveal is the arrival rather than a redraw', () => {
    const { container } = render(
      <StreamingText text={FIRST} wordsPerSecond={INSTANT} />
    )

    expect(visibleText(container)).toBe('')
  })

  describe('appending', () => {
    it('resumes at the end rather than rewinding to the first word', async () => {
      const { container, rerender } = render(
        <StreamingText text={FIRST} complete={false} wordsPerSecond={INSTANT} />
      )
      await waitFor(() => expect(visibleText(container)).toContain('today.'))

      rerender(
        <StreamingText
          text={FIRST + SECOND}
          complete={false}
          wordsPerSecond={INSTANT}
        />
      )

      // The words already read stay read. A stream that restarts on every chunk is
      // unreadable, and this is the failure mode of every naive typewriter.
      expect(visibleText(container)).toContain('today.')
      await waitFor(() => expect(visibleText(container)).toContain('scroll.'))
    })
  })

  describe('pausing', () => {
    it('holds the reveal where it is', async () => {
      const { container } = render(
        <StreamingText text={FIRST} paused wordsPerSecond={INSTANT} />
      )

      await tick()

      expect(visibleText(container)).toBe('')
    })

    it('does not bank the time it was paused for', async () => {
      const { container, rerender } = render(
        <StreamingText text={FIRST} paused wordsPerSecond={2} />
      )
      await tick(120)

      rerender(<StreamingText text={FIRST} wordsPerSecond={2} />)

      // Two words a second, resumed a moment ago. A clock that kept running while paused
      // would dump the whole paragraph out in one frame.
      expect(visibleText(container).split(/\s+/).filter(Boolean).length).toBeLessThan(3)
    })
  })

  describe('completion', () => {
    it('does not call onDone merely for catching up to the current chunk', async () => {
      const onDone = vi.fn()
      const { container } = render(
        <StreamingText
          text={FIRST}
          complete={false}
          onDone={onDone}
          wordsPerSecond={INSTANT}
        />
      )

      await waitFor(() => expect(visibleText(container)).toContain('today.'))

      // Caught up is not finished. Only the caller knows which one happened.
      expect(onDone).not.toHaveBeenCalled()
    })

    it('calls onDone once the caller says the stream ended', async () => {
      const onDone = vi.fn()
      const { rerender } = render(
        <StreamingText
          text={FIRST}
          complete={false}
          onDone={onDone}
          wordsPerSecond={INSTANT}
        />
      )

      rerender(
        <StreamingText text={FIRST} complete onDone={onDone} wordsPerSecond={INSTANT} />
      )

      await waitFor(() => expect(onDone).toHaveBeenCalled())
    })

    it('rewinds when runKey changes', async () => {
      const { container, rerender } = render(
        <StreamingText text={FIRST} runKey={0} wordsPerSecond={INSTANT} />
      )
      await waitFor(() => expect(visibleText(container)).toContain('today.'))

      rerender(<StreamingText text={FIRST} runKey={1} wordsPerSecond={INSTANT} />)

      expect(visibleText(container)).toBe('')
    })
  })

  describe('accessibility', () => {
    it('hides the growing paragraph and announces the finished answer once', async () => {
      const { container, rerender } = render(
        <StreamingText text={FIRST} complete={false} wordsPerSecond={INSTANT} />
      )

      // Nothing to announce while it is still arriving. A live region over a growing
      // paragraph re-reads the whole thing on every word.
      await waitFor(() => expect(visibleText(container)).toContain('today.'))
      expect(announcement(container)).toBe('')

      rerender(<StreamingText text={FIRST} complete wordsPerSecond={INSTANT} />)

      await waitFor(() => expect(announcement(container)).toBe(FIRST))
    })

    it('still delivers the text under a reduced-motion preference', async () => {
      const { container } = render(
        <MotionConfig reducedMotion="always">
          <StreamingText text={FIRST} wordsPerSecond={INSTANT} />
        </MotionConfig>
      )

      // The streaming is the data. Only the blur-in is decoration.
      await waitFor(() => expect(visibleText(container)).toContain('components'))
    })
  })

  it('spreads props onto its root', () => {
    render(<StreamingText text={FIRST} data-testid="stream" className="text-base" />)

    expect(screen.getByTestId('stream')).toHaveClass('text-base')
  })
})
