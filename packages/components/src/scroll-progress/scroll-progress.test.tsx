import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as React from 'react'
import { ScrollProgress } from './scroll-progress'

/**
 * jsdom neither lays out nor scrolls, so the bar's position is always zero and there is
 * no honest way to assert that it tracks anything. What is testable is everything around
 * the tracking: that the bar stays out of the reader's way, that it is placed where it
 * claims to be, and that pointing it at a container it cannot find degrades quietly.
 */
function barOf() {
  return screen.getByTestId('progress')
}

describe('ScrollProgress', () => {
  it('stays out of the accessibility tree and out of the way of clicks', () => {
    render(<ScrollProgress data-testid="progress" />)

    // The bar restates the scrollbar. Announcing it would be noise, and a fixed strip
    // along the top edge that swallowed clicks would be worse.
    expect(barOf()).toHaveAttribute('aria-hidden', 'true')
    expect(barOf()).toHaveClass('pointer-events-none')
  })

  it('grows from the leading edge rather than the middle', () => {
    render(<ScrollProgress data-testid="progress" />)

    expect(barOf()).toHaveClass('origin-left')
  })

  it('pins itself to the top of the viewport by default', () => {
    render(<ScrollProgress data-testid="progress" />)

    expect(barOf()).toHaveClass('fixed', 'inset-x-0', 'top-0')
  })

  it('lets go of the viewport when asked, so it can be placed in a header', () => {
    render(<ScrollProgress data-testid="progress" fixed={false} />)

    expect(barOf()).not.toHaveClass('fixed')
  })

  describe('container', () => {
    it('falls back to the page when a selector matches nothing', () => {
      // A scrollport that has not mounted yet is a normal state, not a mistake. Throwing
      // here would take the page down over a bar.
      expect(() =>
        render(<ScrollProgress data-testid="progress" containerRef="#nope" />)
      ).not.toThrow()

      expect(barOf()).toBeInTheDocument()
    })

    it('accepts a selector for a scrollport it cannot be handed a ref to', () => {
      render(
        <>
          <div id="reader" />
          <ScrollProgress data-testid="progress" containerRef="#reader" />
        </>
      )

      expect(barOf()).toBeInTheDocument()
    })

    it('accepts a ref', () => {
      function Page() {
        const scrollport = React.useRef<HTMLDivElement>(null)
        return (
          <>
            <div ref={scrollport} />
            <ScrollProgress data-testid="progress" containerRef={scrollport} />
          </>
        )
      }
      render(<Page />)

      expect(barOf()).toBeInTheDocument()
    })
  })

  describe('element API', () => {
    it('forwards a ref to the bar', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<ScrollProgress ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('merges className and spreads the remaining props', () => {
      render(
        <ScrollProgress data-testid="progress" className="h-1 bg-accent" id="reading" />
      )

      expect(barOf()).toHaveClass('h-1', 'bg-accent', 'origin-left')
      expect(barOf()).toHaveAttribute('id', 'reading')
    })

    it('lets an inline style win over its own', () => {
      render(
        <ScrollProgress data-testid="progress" style={{ transformOrigin: 'right' }} />
      )

      expect(barOf()).toHaveStyle({ transformOrigin: 'right' })
    })
  })
})
