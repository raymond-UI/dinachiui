import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import {
  AnimatedMenuIcon,
  AnimatedPlayIcon,
  AnimatedChevronIcon,
  AnimatedCheckIcon,
} from './animated-icon'

function svg(container: HTMLElement) {
  return container.querySelector('svg') as SVGSVGElement
}

describe('AnimatedMenuIcon', () => {
  it('keeps all three bars in both states', () => {
    const { container, rerender } = render(<AnimatedMenuIcon open={false} />)
    expect(container.querySelectorAll('line')).toHaveLength(3)

    // The X is built out of the menu rather than replacing it. Three bars, always.
    rerender(<AnimatedMenuIcon open />)
    expect(container.querySelectorAll('line')).toHaveLength(3)
  })

  it('pivots each bar about its own midpoint in viewBox units', () => {
    const { container } = render(<AnimatedMenuIcon open />)

    // `fill-box` would give a horizontal line a zero-height box and a degenerate origin,
    // and the rotation would swing wide instead of closing the X.
    const first = container.querySelectorAll('line')[0]
    expect(first.style.transformBox).toBe('view-box')
    expect(first.style.transformOrigin).toBe('12px 7px')
  })

  it('is decoration, so it carries no accessible name', () => {
    const { container } = render(<AnimatedMenuIcon open={false} />)

    // The control around it is what gets named.
    expect(svg(container)).toHaveAttribute('aria-hidden')
  })

  it('merges className', () => {
    const { container } = render(<AnimatedMenuIcon open={false} className="h-6 w-6" />)

    expect(svg(container)).toHaveClass('h-6', 'w-6')
  })
})

describe('AnimatedPlayIcon', () => {
  it('morphs between two paths of the same structure', () => {
    const { container } = render(<AnimatedPlayIcon playing={false} />)
    const paths = container.querySelectorAll('path')

    expect(paths).toHaveLength(2)
    // Same command sequence on both sides. A morph between paths with different
    // structures does not degrade, it fails.
    paths.forEach((path) => {
      expect((path.getAttribute('d') ?? '').match(/[MLZ]/g)).toHaveLength(5)
    })
  })

  it('draws on the first paint, before anything animates', () => {
    const { container } = render(<AnimatedPlayIcon playing />)

    // Motion cannot read a path back off the DOM, so a `d` left to `animate` alone renders
    // an empty <path> until the first frame.
    expect(container.querySelector('path')).toHaveAttribute('d', 'M 8 5 L 12 5 L 12 19 L 8 19 Z')
  })
})

describe('AnimatedChevronIcon', () => {
  it('turns the same glyph over rather than swapping it', () => {
    const { container, rerender } = render(<AnimatedChevronIcon open={false} />)
    const closed = container.querySelector('path')?.getAttribute('d')

    rerender(<AnimatedChevronIcon open />)

    expect(container.querySelector('path')?.getAttribute('d')).toBe(closed)
  })
})

describe('AnimatedCheckIcon', () => {
  it('states its starting values rather than reading them back', async () => {
    const { container } = render(<AnimatedCheckIcon done={false} />)

    // `pathLength` and `opacity` on an SVG path are presentation attributes motion cannot
    // read off the DOM, so leaving them unstated starts the animation from `undefined`.
    const path = container.querySelector('path') as SVGPathElement
    expect(path).toHaveAttribute('opacity', '0')
    expect(path).toHaveAttribute('stroke-dasharray', '0 1')
  })
})

describe('reduced motion', () => {
  it('still ends up drawn, it just does not draw itself', async () => {
    const { container } = render(
      <MotionConfig reducedMotion="always">
        <AnimatedCheckIcon done />
      </MotionConfig>
    )

    // The state change is the information. Watching the check draw itself is not.
    await waitFor(() => {
      expect(container.querySelector('path')).toHaveAttribute('opacity', '1')
      expect(container.querySelector('path')).toHaveAttribute('stroke-dasharray', '1 1')
    })
  })
})
