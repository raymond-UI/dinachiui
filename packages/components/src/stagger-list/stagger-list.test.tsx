import { describe, it, expect, afterAll, beforeAll, beforeEach, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { installIntersectionObserver } from '../test/intersection'
import { StaggerList, StaggerListItem } from './stagger-list'

const ITEMS = ['Deploys', 'Incidents', 'Costs']

function renderList(props: React.ComponentProps<typeof StaggerList> = {}) {
  return render(
    <StaggerList startOnView={false} {...props}>
      {ITEMS.map((item) => (
        <StaggerListItem key={item}>{item}</StaggerListItem>
      ))}
    </StaggerList>
  )
}

function itemsOf() {
  return screen.getAllByRole('listitem')
}

describe('StaggerList', () => {
  it('renders a list', () => {
    renderList()

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(itemsOf().map((item) => item.textContent)).toEqual(ITEMS)
  })

  it('keeps the list semantics and drops only the markers', () => {
    renderList()

    // The sequence is decoration; the fact that this is a list is not.
    expect(screen.getByRole('list')).toHaveClass('list-none')
  })

  describe('entering', () => {
    it('starts its items hidden and lands them visible', async () => {
      renderList()

      await waitFor(() => {
        itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '1' }))
      })
    })

    it('rises by default, so the motion runs along the reading direction', () => {
      renderList({ distance: 16 })

      expect(itemsOf()[0].style.transform).toBe('translateY(16px)')
    })

    it('settles from slightly small under `scale`, for grids with no reading direction', () => {
      renderList({ variant: 'scale' })

      // Never from zero. Nothing appears from nothing.
      expect(itemsOf()[0].style.transform).toBe('scale(0.96)')
    })

    it('pulls into focus under `blur`', () => {
      renderList({ variant: 'blur' })

      expect(itemsOf()[0].style.filter).toBe('blur(2px)')
      expect(itemsOf()[0].style.transform).toBe('translateY(8px)')
    })
  })

  /**
   * The default, and the path the rest of this file opts out of. The shared observer
   * stub answers "on screen" to everything, so the state before the list arrives needs
   * the driveable one.
   */
  describe('startOnView', () => {
    let viewport: ReturnType<typeof installIntersectionObserver>

    // Installed once for the block rather than per test: Motion caches one observer per
    // set of viewport options, so the second test would be handed the first test's
    // instance and a fresh controller would have nothing to drive.
    beforeAll(() => {
      viewport = installIntersectionObserver({ intersecting: false })
    })

    beforeEach(() => {
      viewport.setIntersecting(false)
    })

    afterAll(() => {
      viewport.restore()
    })

    function renderOnView() {
      return render(
        <StaggerList>
          {ITEMS.map((item) => (
            <StaggerListItem key={item}>{item}</StaggerListItem>
          ))}
        </StaggerList>
      )
    }

    it('holds the items hidden until the list is scrolled to', async () => {
      renderOnView()

      // Waited out rather than asserted immediately: the sequence lands within a few
      // hundred ms, so a list that had wrongly started would still read hidden here.
      await act(() => new Promise((resolve) => setTimeout(resolve, 600)))

      // A sequence that ran above the fold is one the reader arrives too late for, and
      // they are left looking at a list that simply appeared.
      itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '0' }))
    })

    it('runs the sequence once the list arrives', async () => {
      renderOnView()

      viewport.setIntersecting(true)

      await waitFor(() => {
        itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '1' }))
      })
    })

    it('does not replay when the list scrolls back out', async () => {
      renderOnView()

      viewport.setIntersecting(true)
      await waitFor(() => {
        itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '1' }))
      })
      viewport.setIntersecting(false)

      // Re-running an entrance on a list already read is decoration, not information.
      itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '1' }))
    })
  })

  describe('reduced motion', () => {
    it('keeps the sequence and drops the movement', async () => {
      render(
        <MotionConfig reducedMotion="always">
          <StaggerList startOnView={false} variant="blur">
            {ITEMS.map((item) => (
              <StaggerListItem key={item}>{item}</StaggerListItem>
            ))}
          </StaggerList>
        </MotionConfig>
      )

      // Sequencing is not movement. Collapsing it would delete the component's point
      // rather than soften it, so only the second channel goes.
      expect(itemsOf()[0].style.transform).toBe('')
      expect(itemsOf()[0].style.filter).toBe('')
      expect(itemsOf()[0]).toHaveStyle({ opacity: '0' })

      await waitFor(() => {
        itemsOf().forEach((item) => expect(item).toHaveStyle({ opacity: '1' }))
      })
    })
  })

  describe('StaggerListItem', () => {
    it('refuses to render outside a StaggerList, where it would have no sequence', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => render(<StaggerListItem>Orphan</StaggerListItem>)).toThrow(
        'StaggerListItem must be used within a StaggerList'
      )

      error.mockRestore()
    })

    it('merges className and spreads the remaining props', () => {
      render(
        <StaggerList startOnView={false}>
          <StaggerListItem className="py-2" data-testid="item">
            Deploys
          </StaggerListItem>
        </StaggerList>
      )

      expect(screen.getByTestId('item')).toHaveClass('py-2')
    })
  })

  describe('element API', () => {
    it('forwards a ref to the list', () => {
      const ref = { current: null as HTMLUListElement | null }
      render(
        <StaggerList ref={ref} startOnView={false}>
          <StaggerListItem>Deploys</StaggerListItem>
        </StaggerList>
      )

      expect(ref.current).toBeInstanceOf(HTMLUListElement)
    })

    it('merges className and spreads the remaining props', () => {
      renderList({ className: 'space-y-2', id: 'metrics' })

      expect(screen.getByRole('list')).toHaveClass('space-y-2', 'list-none')
      expect(screen.getByRole('list')).toHaveAttribute('id', 'metrics')
    })
  })
})
