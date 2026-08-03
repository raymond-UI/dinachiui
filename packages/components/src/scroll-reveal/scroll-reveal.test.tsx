import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { installIntersectionObserver } from '../test/intersection'
import { ScrollReveal } from './scroll-reveal'

/**
 * The shared observer stub answers "on screen" to everything, which would leave every
 * assertion here looking at revealed content. These tests need to start off screen.
 */
let viewport: ReturnType<typeof installIntersectionObserver>

beforeEach(() => {
  viewport = installIntersectionObserver({ intersecting: false })
})

afterEach(() => {
  viewport.restore()
})

/** The node the styles are applied to, one level inside the observed wrapper. */
function revealedOf() {
  return screen.getByText('New content').closest('div') as HTMLElement
}

function renderReveal(ui: React.ReactElement) {
  const result = render(ui)
  return { ...result, revealed: revealedOf() }
}

describe('ScrollReveal', () => {
  it('renders its children', () => {
    renderReveal(<ScrollReveal>New content</ScrollReveal>)

    expect(screen.getByText('New content')).toBeInTheDocument()
  })

  it('observes a wrapper rather than the node it clips', () => {
    const { container } = renderReveal(<ScrollReveal>New content</ScrollReveal>)

    // `clip-path` shrinks an element's intersection rect in Chromium, and the hidden
    // state clips to zero area. Observing the clipped node would pin it off screen and
    // the content could never reveal itself.
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).not.toBe(revealedOf())
    expect(wrapper).toContainElement(revealedOf())
  })

  describe('revealing', () => {
    it('holds the content behind a closed aperture until it is scrolled to', () => {
      const { revealed } = renderReveal(<ScrollReveal>New content</ScrollReveal>)

      expect(revealed).toHaveStyle({ opacity: '0' })
      expect(revealed.style.clipPath).toBe('inset(0% 0% 100% 0%)')
    })

    it('opens the aperture and settles the travel once it is in view', async () => {
      const { revealed } = renderReveal(<ScrollReveal>New content</ScrollReveal>)

      viewport.setIntersecting(true)

      await waitFor(() => {
        expect(revealed).toHaveStyle({ opacity: '1' })
      })
      expect(revealed.style.clipPath).toBe('inset(0% 0% 0% 0%)')
      expect(revealed.style.transform).toBe('translate(0px, 0px)')
    })

    it('opens the aperture against the travel, so the block slides through a shutter', () => {
      const { revealed } = renderReveal(
        <ScrollReveal direction="left" distance={12}>
          New content
        </ScrollReveal>
      )

      // Travelling left means starting to the right of home, with the aperture closed
      // from that same edge.
      expect(revealed.style.clipPath).toBe('inset(0% 0% 0% 100%)')
      expect(revealed.style.transform).toBe('translate(12px, 0px)')
    })

    it('stays revealed after it scrolls back out, since the reader has already read it', async () => {
      const { revealed } = renderReveal(<ScrollReveal>New content</ScrollReveal>)

      viewport.setIntersecting(true)
      await waitFor(() => expect(revealed).toHaveStyle({ opacity: '1' }))
      viewport.setIntersecting(false)

      // Replaying an entrance on content already read is decoration, not information.
      expect(revealed).toHaveStyle({ opacity: '1' })
    })

    it('re-arms when asked, and does so instantly rather than performing an exit', async () => {
      const { revealed } = renderReveal(
        <ScrollReveal repeat>New content</ScrollReveal>
      )

      viewport.setIntersecting(true)
      await waitFor(() => expect(revealed).toHaveStyle({ opacity: '1' }))
      viewport.setIntersecting(false)

      // Animating back out would fade the block away at the edge of the viewport while
      // it is still being read.
      await waitFor(() => expect(revealed).toHaveStyle({ opacity: '0' }))
    })
  })

  describe('reduced motion', () => {
    it('drops the wipe and the travel, and keeps the fade', async () => {
      render(
        <MotionConfig reducedMotion="always">
          <ScrollReveal>New content</ScrollReveal>
        </MotionConfig>
      )
      const revealed = revealedOf()

      // The fade still says "new content arrived", which is the part worth keeping.
      expect(revealed).toHaveStyle({ opacity: '0' })
      expect(revealed.style.clipPath).toBe('')
      expect(revealed.style.transform).toBe('')

      viewport.setIntersecting(true)
      await waitFor(() => expect(revealed).toHaveStyle({ opacity: '1' }))
    })
  })

  describe('element API', () => {
    it('forwards a ref to the observed wrapper', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<ScrollReveal ref={ref}>New content</ScrollReveal>)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toContainElement(revealedOf())
    })

    it('puts className and the remaining props on the revealed node', () => {
      renderReveal(
        <ScrollReveal className="rounded-lg" id="hero">
          New content
        </ScrollReveal>
      )

      expect(revealedOf()).toHaveClass('rounded-lg')
      expect(revealedOf()).toHaveAttribute('id', 'hero')
    })
  })
})
