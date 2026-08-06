import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { LoadTransition } from './load-transition'

// Real rAF is left alone deliberately: stubbing it freezes motion, and then nothing that
// depends on an animation completing ever resolves.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
})

afterEach(() => {
  vi.useRealTimers()
})

async function advance(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

function Panel({ loading }: { loading: boolean }) {
  return (
    <LoadTransition loading={loading} skeleton={<div data-testid="skeleton" />}>
      <p>Deployment summary</p>
    </LoadTransition>
  )
}

describe('LoadTransition', () => {
  it('shows the content when there is nothing to wait for', () => {
    render(<Panel loading={false} />)

    expect(screen.getByText('Deployment summary')).toBeInTheDocument()
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
  })

  it('holds the skeleton back until the wait is worth reporting', async () => {
    render(<Panel loading />)

    // A placeholder shown for two frames reads as a glitch, not as feedback.
    await advance(170)
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()

    await advance(20)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('never shows a skeleton for a load that beats it', async () => {
    const { rerender } = render(<Panel loading />)

    await advance(120)
    rerender(<Panel loading={false} />)
    await advance(1000)

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
    expect(screen.getByText('Deployment summary')).toBeInTheDocument()
  })

  it('holds a skeleton it did show, so it cannot flash', async () => {
    const { rerender } = render(<Panel loading />)

    await advance(200)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    // Data lands 20ms after the skeleton did. Swapping now is the same flash from the
    // other direction.
    rerender(<Panel loading={false} />)
    await advance(300)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    await advance(200)
    expect(screen.getByText('Deployment summary')).toBeInTheDocument()
  })

  it('honours thresholds of your own', async () => {
    render(
      <LoadTransition loading delay={40} minimum={0} skeleton={<div data-testid="skeleton" />}>
        <p>Deployment summary</p>
      </LoadTransition>
    )

    await advance(50)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('animates its own height rather than letting the page below jump', () => {
    const { container } = render(<Panel loading={false} />)

    // The container is what absorbs the difference between the skeleton's height and the
    // content's. Without `layout` on it, the swap is a jump wearing an animation.
    expect(container.firstElementChild).toHaveClass('overflow-hidden')
    // Radius inline, not as a class: motion can only correct the distortion its own scale
    // introduces on a value it is animating, and a class is invisible to it.
    expect(container.firstElementChild).toHaveStyle({ borderRadius: '12px' })
  })

  describe('reduced motion', () => {
    it('still waits out the thresholds — they are not motion', async () => {
      render(
        <MotionConfig reducedMotion="always">
          <Panel loading />
        </MotionConfig>
      )

      // The flash the delay prevents is a flash whether or not anything animated.
      await advance(170)
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()

      await advance(20)
      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    })
  })
})
