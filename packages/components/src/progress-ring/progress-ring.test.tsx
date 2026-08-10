import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { ProgressRing } from './progress-ring'

describe('ProgressRing', () => {
  it('reports its value to assistive technology', () => {
    render(<ProgressRing value={42} />)

    const ring = screen.getByRole('progressbar')
    expect(ring).toHaveAttribute('aria-valuenow', '42')
    expect(ring).toHaveAttribute('aria-valuemin', '0')
    expect(ring).toHaveAttribute('aria-valuemax', '100')
    expect(ring).toHaveAttribute('aria-valuetext', '42 percent')
  })

  it('takes its accessible name from label', () => {
    render(<ProgressRing value={42} label="Upload" />)

    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument()
  })

  it('shows the percentage in the middle', () => {
    render(<ProgressRing value={42} />)

    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('can be asked for the arc alone', () => {
    render(<ProgressRing value={42} showValue={false} />)

    expect(screen.queryByText('42%')).not.toBeInTheDocument()
    // The value is still reported; only the glyph is gone.
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
  })

  it('clamps a value outside the range rather than overdrawing the arc', () => {
    const { container } = render(<ProgressRing value={140} />)

    const arc = container.querySelectorAll('circle')[1]
    // A full ring is offset 0. Anything negative would wrap the arc back over itself.
    expect(Number(arc.getAttribute('stroke-dashoffset'))).toBe(0)
  })

  describe('indeterminate', () => {
    it('becomes a status with no value when none is given', () => {
      render(<ProgressRing />)

      const ring = screen.getByRole('status')
      expect(ring).toHaveAttribute('aria-label', 'Loading')
      expect(ring).not.toHaveAttribute('aria-valuenow')
    })

    it('shows no number, because there is none to show', () => {
      const { container } = render(<ProgressRing showValue />)

      expect(container.querySelector('span')).toBeNull()
    })
  })

  describe('sizing', () => {
    it('scales the stroke with the ring', () => {
      const { container } = render(<ProgressRing value={50} size={200} />)

      // A ring twice the size with the same stroke reads as thinner, not bigger.
      expect(container.querySelector('circle')).toHaveAttribute('stroke-width', '17')
    })

    it('lets an explicit thickness win', () => {
      const { container } = render(
        <ProgressRing value={50} size={200} thickness={4} />
      )

      expect(container.querySelector('circle')).toHaveAttribute('stroke-width', '4')
    })
  })

  describe('reduced motion', () => {
    it('reports the value rather than travelling to it', () => {
      render(
        <MotionConfig reducedMotion="always">
          <ProgressRing value={42} />
        </MotionConfig>
      )

      // The arc and the number land together, in one frame.
      expect(screen.getByText('42%')).toBeInTheDocument()
    })

    it('replaces the endless sweep with a static gap', () => {
      const { container } = render(
        <MotionConfig reducedMotion="always">
          <ProgressRing />
        </MotionConfig>
      )

      const arc = container.querySelectorAll('circle')[1]
      // Still reads as in progress; nothing repeats forever.
      expect(arc.getAttribute('stroke-dasharray')).toBeTruthy()
      expect(screen.getByRole('status').style.transform ?? '').not.toContain('270')
    })
  })
})
