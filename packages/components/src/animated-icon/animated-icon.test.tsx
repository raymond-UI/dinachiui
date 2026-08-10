import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { AnimatedIcon } from './animated-icon'

function Sun() {
  return <svg data-testid="sun" />
}

function Moon() {
  return <svg data-testid="moon" />
}

describe('AnimatedIcon', () => {
  it('shows the resting icon while inactive', () => {
    render(<AnimatedIcon active={false} from={<Sun />} to={<Moon />} />)

    expect(screen.getByTestId('sun')).toBeInTheDocument()
    expect(screen.queryByTestId('moon')).not.toBeInTheDocument()
  })

  it('trades one icon for the other', async () => {
    const { rerender } = render(<AnimatedIcon active={false} from={<Sun />} to={<Moon />} />)

    rerender(<AnimatedIcon active from={<Sun />} to={<Moon />} />)

    // Both are mounted mid-crossfade. What matters is that the new one arrived and the old
    // one is on its way out, not which frame we caught.
    expect(screen.getByTestId('moon')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByTestId('sun')).not.toBeInTheDocument())
  })

  it('takes any pair, including two with nothing in common', () => {
    render(
      <AnimatedIcon active from={<span>1</span>} to={<strong data-testid="anything">2</strong>} />
    )

    // The shell transforms whatever it is handed. Nothing here is an svg, let alone two
    // paths of matching structure.
    expect(screen.getByTestId('anything')).toBeInTheDocument()
  })

  it('stacks both icons in one grid cell, so the box never reflows', () => {
    const { container } = render(<AnimatedIcon active={false} from={<Sun />} to={<Moon />} />)

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveClass('inline-grid')
    expect(wrapper.firstElementChild).toHaveClass('col-start-1', 'row-start-1')
  })

  it('sizes the icons from the box rather than letting them keep their own', () => {
    const { container } = render(<AnimatedIcon active={false} from={<Sun />} to={<Moon />} />)

    // An icon library ships an intrinsic 24x24. A cell smaller than that squashes it on one
    // axis, so the box states the size and both icons are made to fill it.
    expect(container.firstElementChild).toHaveClass('size-5', '[&_svg]:size-full')
  })

  it('is decoration, so it carries no accessible name', () => {
    const { container } = render(<AnimatedIcon active={false} from={<Sun />} to={<Moon />} />)

    // The control around it is what gets named.
    expect(container.firstElementChild).toHaveAttribute('aria-hidden')
  })

  it('merges className', () => {
    const { container } = render(
      <AnimatedIcon active={false} from={<Sun />} to={<Moon />} className="size-6" />
    )

    expect(container.firstElementChild).toHaveClass('size-6', 'inline-grid')
  })

  describe('mode', () => {
    it('gives flip a vanishing point, since the rotation is out of the screen', () => {
      const { container } = render(
        <AnimatedIcon active={false} mode="flip" from={<Sun />} to={<Moon />} />
      )

      expect(container.firstElementChild).toHaveStyle({ perspective: '400px' })
    })

    it('leaves the other modes flat', () => {
      const { container } = render(
        <AnimatedIcon active={false} mode="rotate" from={<Sun />} to={<Moon />} />
      )

      expect((container.firstElementChild as HTMLElement).style.perspective).toBe('')
    })
  })

  describe('reduced motion', () => {
    it('keeps the state change and drops the movement', async () => {
      const { rerender } = render(
        <MotionConfig reducedMotion="always">
          <AnimatedIcon active={false} from={<Sun />} to={<Moon />} />
        </MotionConfig>
      )

      rerender(
        <MotionConfig reducedMotion="always">
          <AnimatedIcon active from={<Sun />} to={<Moon />} />
        </MotionConfig>
      )

      // Which icon is showing is the information. Watching it arrive is not.
      await waitFor(() => {
        expect(screen.getByTestId('moon')).toBeInTheDocument()
        expect(screen.queryByTestId('sun')).not.toBeInTheDocument()
      })
    })
  })
})
