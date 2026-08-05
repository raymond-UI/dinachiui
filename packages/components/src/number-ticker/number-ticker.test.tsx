import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { installIntersectionObserver } from '../test/intersection'
import { NumberTicker } from './number-ticker'

/**
 * What a screen reader is left with once the decorative columns are stripped out.
 *
 * The component's promise is that the moving parts are `aria-hidden` and exactly one
 * reading of the number survives. Asserting on `textContent` alone would pass while a
 * ticker announced "0123456789" one digit at a time, so the hidden subtrees are removed
 * first, which is what assistive technology does with them.
 */
function accessibleText(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement
  clone.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())
  return clone.textContent?.trim()
}

/** The digit columns, in place order, with the screen-reader text left out. */
function columnsOf(ticker: HTMLElement) {
  return Array.from(ticker.children).filter(
    (child) => !child.classList.contains('sr-only')
  )
}

/** The digit each wheel currently shows in its window, left to right. */
function paintedDigits(ticker: HTMLElement) {
  return columnsOf(ticker).map(
    (column) => column.lastElementChild!.firstElementChild!.textContent
  )
}

describe('NumberTicker', () => {
  it('announces the formatted value once, and hides the moving parts', () => {
    render(
      <NumberTicker data-testid="ticker" value={1234} startOnView={false} />
    )

    expect(accessibleText(screen.getByTestId('ticker'))).toBe('1,234')
  })

  it('draws each odometer column as a pair of consecutive digits', () => {
    // The strip carries the digit in the window and the one after it, never the whole
    // 0-9 run. That pairing is what makes a carry roll forward a single place instead
    // of spinning backwards through the other nine.
    render(<NumberTicker data-testid="ticker" value={907} startOnView={false} />)

    // The sizing glyph comes first in each column; the strip that actually moves is
    // last.
    const pairs = columnsOf(screen.getByTestId('ticker')).map((column) =>
      Array.from(column.lastElementChild!.children, (cell) =>
        Number(cell.textContent)
      )
    )

    expect(pairs).toHaveLength(3)
    for (const [near, far] of pairs) {
      expect((near + 1) % 10).toBe(far)
    }
  })

  it('gives the flip variant a single face per digit', () => {
    render(
      <NumberTicker
        data-testid="ticker"
        variant="flip"
        value={42}
        startOnView={false}
      />
    )

    const ticker = screen.getByTestId('ticker')
    const columns = columnsOf(ticker)

    expect(columns).toHaveLength(2)
    // A flap shows one digit at a time. The swap happens edge-on, half way through
    // the turn, so there is never a second glyph to see.
    for (const column of columns) {
      expect(column.lastElementChild!.textContent).toMatch(/^\d$/)
    }
    expect(accessibleText(ticker)).toBe('42')
  })

  it('renders the counter variant as a single node rather than columns', () => {
    render(
      <NumberTicker
        data-testid="ticker"
        variant="counter"
        value={5000}
        from={0}
        startOnView={false}
      />
    )

    const ticker = screen.getByTestId('ticker')
    // One interpolated node, not one per digit.
    expect(ticker.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1)
    expect(accessibleText(ticker)).toBe('5,000')
  })

  it('keeps grouping separators out of the accessibility tree', () => {
    // A separator is not a column, so it is painted directly, but a screen reader
    // reading "1 comma 2 3 4" alongside the sr-only value would say the number twice.
    render(
      <NumberTicker data-testid="ticker" value={1000000} startOnView={false} />
    )

    const ticker = screen.getByTestId('ticker')
    expect(accessibleText(ticker)).toBe('1,000,000')
  })

  /**
   * The default, and the path every other test in this file opts out of. The shared
   * observer stub answers "on screen" to everything, so reaching the un-counted state
   * needs the driveable one.
   */
  describe('startOnView', () => {
    let viewport: ReturnType<typeof installIntersectionObserver>

    beforeEach(() => {
      viewport = installIntersectionObserver({ intersecting: false })
    })

    afterEach(() => {
      viewport.restore()
    })

    it('holds the wheels at `from` until the figure is scrolled to', async () => {
      render(<NumberTicker data-testid="ticker" value={42} from={0} />)

      // Waited out rather than asserted immediately: the count takes 0.4s either way,
      // so a ticker that had wrongly started would still read `from` on the next line.
      await act(() => new Promise((resolve) => setTimeout(resolve, 600)))

      // Counting a number the reader never saw arrive spends the animation on nobody.
      expect(paintedDigits(screen.getByTestId('ticker'))).toEqual(['0', '0'])
    })

    it('counts once the figure comes into view', async () => {
      render(<NumberTicker data-testid="ticker" value={42} from={0} />)

      viewport.setIntersecting(true)

      await waitFor(() =>
        expect(paintedDigits(screen.getByTestId('ticker'))).toEqual(['4', '2'])
      )
    })

    it('counts on mount when `startOnView` is off, off screen or not', async () => {
      render(
        <NumberTicker
          data-testid="ticker"
          value={42}
          from={0}
          startOnView={false}
        />
      )

      // The observer is still reporting this off screen. Opting out has to mean the
      // count no longer waits on it at all.
      await waitFor(() =>
        expect(paintedDigits(screen.getByTestId('ticker'))).toEqual(['4', '2'])
      )
    })
  })

  describe('escape hatches', () => {
    it('renders a plain value when `live`', () => {
      // A figure that changes every few seconds is read, not watched. Nothing animates,
      // so there is nothing decorative to hide.
      render(
        <NumberTicker data-testid="ticker" value={873} live startOnView={false} />
      )

      const ticker = screen.getByTestId('ticker')
      expect(ticker.textContent).toBe('873')
      expect(ticker.querySelector('[aria-hidden="true"]')).toBeNull()
    })

    it('renders a plain value under a reduced-motion preference', () => {
      render(
        <MotionConfig reducedMotion="always">
          <NumberTicker data-testid="ticker" value={873} startOnView={false} />
        </MotionConfig>
      )

      const ticker = screen.getByTestId('ticker')
      expect(ticker.textContent).toBe('873')
      expect(ticker.querySelector('[aria-hidden="true"]')).toBeNull()
    })

    it('renders the real value, not `from`, in a static pass', () => {
      // `isStatic` renders a tree without animating it. A number is content, so that
      // pass has to hold the value itself; freezing at `from` would ship a zero.
      render(
        <MotionConfig isStatic>
          <NumberTicker data-testid="ticker" value={873} from={0} />
        </MotionConfig>
      )

      expect(screen.getByTestId('ticker').textContent).toBe('873')
    })
  })

  describe('formatting', () => {
    it('honours `decimals`', () => {
      render(
        <NumberTicker
          data-testid="ticker"
          value={12.5}
          decimals={2}
          startOnView={false}
        />
      )

      expect(accessibleText(screen.getByTestId('ticker'))).toBe('12.50')
    })

    it('honours `locale`', () => {
      render(
        <NumberTicker
          data-testid="ticker"
          value={1234.5}
          decimals={1}
          locale="de-DE"
          startOnView={false}
        />
      )

      // German groups with a dot and marks decimals with a comma.
      expect(accessibleText(screen.getByTestId('ticker'))).toBe('1.234,5')
    })

    it('passes `format` through to Intl.NumberFormat', () => {
      render(
        <NumberTicker
          data-testid="ticker"
          value={42}
          locale="en-US"
          format={{ style: 'currency', currency: 'USD' }}
          decimals={2}
          startOnView={false}
        />
      )

      expect(accessibleText(screen.getByTestId('ticker'))).toBe('$42.00')
    })
  })

  describe('element API', () => {
    it('forwards a ref to the root element', () => {
      const ref = { current: null as HTMLSpanElement | null }
      render(<NumberTicker ref={ref} value={1} startOnView={false} />)

      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('merges className and spreads the remaining props', () => {
      render(
        <NumberTicker
          data-testid="ticker"
          value={1}
          className="text-4xl"
          title="Revenue"
          startOnView={false}
        />
      )

      const ticker = screen.getByTestId('ticker')
      expect(ticker).toHaveClass('text-4xl')
      // The component's own classes survive the merge.
      expect(ticker).toHaveClass('tabular-nums')
      expect(ticker).toHaveAttribute('title', 'Revenue')
    })
  })
})
