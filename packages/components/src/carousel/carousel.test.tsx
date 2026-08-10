import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionConfig } from 'motion/react'
import {
  Carousel,
  CarouselViewport,
  CarouselSlide,
  CarouselDots,
  CarouselPrevious,
  CarouselNext,
} from './carousel'

const SLIDES = ['Projection', 'Velocity handoff', 'Elastic edges']
const WIDTH = 200

// jsdom does no layout, so every slide would measure at offsetLeft 0 and the carousel would
// think it had one position. Lay them out on a fixed pitch instead.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get(this: HTMLElement) {
      const slide = this.getAttribute('aria-roledescription') === 'slide'
      if (!slide) return 0
      const siblings = Array.from(this.parentElement?.children ?? [])
      return siblings.indexOf(this) * WIDTH
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  })
})

function Deck({ slides = SLIDES, ...props }: { slides?: string[] } & Record<string, unknown>) {
  return (
    <Carousel label="Gesture techniques" {...props}>
      <CarouselViewport>
        {slides.map((title) => (
          <CarouselSlide key={title} label={title}>
            {title}
          </CarouselSlide>
        ))}
      </CarouselViewport>
      <CarouselDots labels={slides} />
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

describe('Carousel', () => {
  it('says what it is, and where each slide sits in the set', async () => {
    render(<Deck />)

    expect(screen.getByRole('group', { name: 'Gesture techniques' })).toHaveAttribute(
      'aria-roledescription',
      'carousel'
    )
    await waitFor(() =>
      expect(screen.getByRole('group', { name: '2 of 3: Velocity handoff' })).toBeInTheDocument()
    )
  })

  it('counts its dots off the slides it measured', async () => {
    render(<Deck />)

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /^Go to slide/ })).toHaveLength(3)
    )
    expect(screen.getByRole('button', { name: 'Go to slide 1: Projection' })).toHaveAttribute(
      'aria-current',
      'true'
    )
  })

  it('moves on the arrows and marks the dot that is current', async () => {
    const user = userEvent.setup()
    render(<Deck />)

    await waitFor(() => expect(screen.getAllByRole('button', { name: /^Go to slide/ })).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Next slide' }))

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Go to slide 2: Velocity handoff' })
      ).toHaveAttribute('aria-current', 'true')
    )
    expect(screen.getByRole('button', { name: 'Go to slide 1: Projection' })).not.toHaveAttribute(
      'aria-current'
    )
  })

  it('jumps to a slide from its dot', async () => {
    const user = userEvent.setup()
    render(<Deck />)

    await waitFor(() => expect(screen.getAllByRole('button', { name: /^Go to slide/ })).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Go to slide 3: Elastic edges' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
    )
  })

  it('disables the arrow that would run off the end', async () => {
    const user = userEvent.setup()
    render(<Deck />)

    // Both ends are real edges, not wrap points. A carousel that silently wraps loses the
    // reader's place in a set they were counting through.
    await waitFor(() => expect(screen.getAllByRole('button', { name: /^Go to slide/ })).toHaveLength(3))
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled()
    )
  })

  describe('controlled', () => {
    it('defers the index to the caller', async () => {
      const user = userEvent.setup()
      const onIndexChange = vi.fn()

      render(<Deck index={0} onIndexChange={onIndexChange} />)

      await waitFor(() => expect(screen.getAllByRole('button', { name: /^Go to slide/ })).toHaveLength(3))
      await user.click(screen.getByRole('button', { name: 'Next slide' }))

      expect(onIndexChange).toHaveBeenCalledWith(1)
      // Asked, not assumed: the caller pinned it to the first slide, so it stayed there.
      expect(screen.getByRole('button', { name: 'Go to slide 1: Projection' })).toHaveAttribute(
        'aria-current',
        'true'
      )
    })
  })

  describe('reduced motion', () => {
    it('becomes a scroll-snap strip and keeps the controls', async () => {
      const user = userEvent.setup()
      render(
        <MotionConfig reducedMotion="always">
          <Deck />
        </MotionConfig>
      )

      // A native scroller is a better carousel than a JS one for anyone who did not want
      // the momentum, so the drag goes rather than the function.
      const viewport = screen.getByRole('group', { name: '1 of 3: Projection' }).parentElement
      expect(viewport).toHaveClass('snap-x', 'overflow-x-auto')
      expect(viewport).not.toHaveClass('cursor-grab')

      await waitFor(() => expect(screen.getAllByRole('button', { name: /^Go to slide/ })).toHaveLength(3))
      await user.click(screen.getByRole('button', { name: 'Go to slide 2: Velocity handoff' }))

      expect(viewport?.scrollTo).toHaveBeenCalledWith({ left: WIDTH, behavior: 'auto' })
    })
  })

  it('refuses to render a slide outside a viewport, which is what positions it', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      render(
        <Carousel>
          <CarouselSlide>Orphan</CarouselSlide>
        </Carousel>
      )
    ).toThrow('CarouselSlide must be used within a CarouselViewport')

    error.mockRestore()
  })

  it('refuses to render a viewport outside a carousel, which holds the index', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<CarouselViewport />)).toThrow(
      'CarouselViewport must be used within a Carousel'
    )

    error.mockRestore()
  })
})
