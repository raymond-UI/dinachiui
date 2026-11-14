import * as React from 'react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionConfig } from 'motion/react'
import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { agentConformance } from '../test/agent-conformance'
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

      expect(onIndexChange).toHaveBeenCalledWith(1, expect.objectContaining({ reason: 'arrow-press' }))
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

agentConformance({
  name: 'Carousel',
  label: 'Gesture techniques',
  render: ({ onChange, disabled }) => <Deck onIndexChange={onChange} disabled={disabled} />,
  entry: { component: 'carousel', value: '1 of 3: Projection', items: SLIDES, actions: ['goTo'] },
  act: { action: 'goTo', args: ['Elastic edges'], result: { value: '3 of 3: Elastic edges' } },
  invalid: { action: 'goTo', args: ['Momentum'], lists: SLIDES },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
  },
  commits: 2,
})

describe('Carousel: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent()
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
    const goTo = (to: unknown) => agent.act({ steps: [{ ref: 'Gesture techniques', action: 'goTo', args: [to] }] })
    return { agent, goTo }
  }
  const current = () => screen.getByRole('button', { current: true })

  it('goes to a slide by its number, from 1', async () => {
    const { goTo } = mount(<Deck />)
    expect((await goTo(2)).steps[0]?.value).toBe('2 of 3: Velocity handoff')
    expect((await goTo('3')).steps[0]?.value).toBe('3 of 3: Elastic edges')
    expect(current()).toHaveAccessibleName('Go to slide 3: Elastic edges')
  })

  it('lists the carousel once, without its arrows and dots', () => {
    const { agent } = mount(<Deck />)
    expect(agent.snapshot().map((c) => c.component)).toEqual(['carousel'])
  })

  it('names unnamed slides by their number', () => {
    const { agent } = mount(
      <Carousel label="Photos">
        <CarouselViewport>
          <CarouselSlide>One</CarouselSlide>
          <CarouselSlide>Two</CarouselSlide>
        </CarouselViewport>
      </Carousel>
    )
    expect(agent.snapshot()[0]).toMatchObject({ value: '1 of 2', items: ['1', '2'] })
  })

  it('stays put when the app refuses, and says so', async () => {
    const onIndexChange = vi.fn((_: number, details: { cancel(): void }) => details.cancel())
    const { goTo } = mount(<Deck onIndexChange={onIndexChange} />)
    expect((await goTo(3)).error?.message).toMatch(/refused/)
    expect(isAgentChange(onIndexChange.mock.calls[0][1])).toBe(true)
    expect(current()).toHaveAccessibleName('Go to slide 1: Projection')
  })

  it('leaves a controlled carousel to its owner', async () => {
    function Owned() {
      const [index, setIndex] = React.useState(0)
      return <Deck index={index} onIndexChange={setIndex} />
    }
    const { goTo } = mount(<Owned />)
    expect((await goTo('Velocity handoff')).steps[0]?.value).toBe('2 of 3: Velocity handoff')
  })

  it('reports a person\'s press with its reason, not as the agent\'s', async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    mount(<Deck onIndexChange={onIndexChange} />)
    await user.click(screen.getByRole('button', { name: 'Go to slide 2: Velocity handoff' }))
    const [index, details] = onIndexChange.mock.calls[0]
    expect(index).toBe(1)
    expect(details).toMatchObject({ reason: 'dot-press', isCanceled: false })
    expect(isAgentChange(details)).toBe(false)
  })

  it('turns off the arrows and dots when disabled', () => {
    render(<Deck disabled />)
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
    for (const dot of screen.getAllByRole('button', { name: /^Go to slide/ })) expect(dot).toBeDisabled()
  })
})
