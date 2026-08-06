import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import { ToastStack, ToastStackItem } from './toast-stack'

/** Only the clock is faked. Motion drives itself off `requestAnimationFrame`, and stubbing
 *  that would freeze every animation under test rather than the countdown. */
function useClock() {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
}

afterEach(() => {
  vi.useRealTimers()
})

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('ToastStack', () => {
  it('renders its toasts', () => {
    render(
      <ToastStack>
        <ToastStackItem key="1">Saved</ToastStackItem>
        <ToastStackItem key="2">Copied</ToastStackItem>
      </ToastStack>
    )

    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })

  it('keeps the toast in front on top of the ones behind it', () => {
    render(
      <ToastStack>
        <ToastStackItem key="1" data-testid="front">
          Saved
        </ToastStackItem>
        <ToastStackItem key="2" data-testid="behind">
          Copied
        </ToastStackItem>
      </ToastStack>
    )

    // A toast that arrived later must not paint over the one in front of it.
    expect(Number(screen.getByTestId('front').style.zIndex)).toBeGreaterThan(
      Number(screen.getByTestId('behind').style.zIndex)
    )
  })

  it('holds one toast past the visible depth, invisible, so the next one fades in', () => {
    render(
      <ToastStack visibleDepth={1}>
        {['1', '2', '3'].map((id) => (
          <ToastStackItem key={id} data-testid={`toast-${id}`}>
            Toast {id}
          </ToastStackItem>
        ))}
      </ToastStack>
    )

    expect(screen.getByTestId('toast-1').style.opacity).toBe('1')
    // Rendered and measured, but not yet part of the stack the reader can see.
    expect(screen.getByTestId('toast-2').style.opacity).toBe('0')
    expect(screen.queryByTestId('toast-3')).not.toBeInTheDocument()
  })

  describe('the countdown', () => {
    it('dismisses the toast when its time runs out', () => {
      useClock()
      const onDismiss = vi.fn()

      render(
        <ToastStack>
          <ToastStackItem key="1" duration={1000} onDismiss={onDismiss}>
            Saved
          </ToastStackItem>
        </ToastStack>
      )

      advance(900)
      expect(onDismiss).not.toHaveBeenCalled()

      advance(200)
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('holds where it is while the reader is looking at the stack', () => {
      useClock()
      const onDismiss = vi.fn()

      render(
        <ToastStack data-testid="stack">
          <ToastStackItem key="1" duration={1000} onDismiss={onDismiss}>
            Saved
          </ToastStackItem>
        </ToastStack>
      )

      advance(400)
      fireEvent.pointerEnter(screen.getByTestId('stack'))

      // Not a reset and not a reprieve: the clock stops.
      advance(5000)
      expect(onDismiss).not.toHaveBeenCalled()

      fireEvent.pointerLeave(screen.getByTestId('stack'))

      // 600ms of the original second is left, not a fresh one.
      advance(500)
      expect(onDismiss).not.toHaveBeenCalled()

      advance(200)
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('never expires a toast given an infinite duration', () => {
      useClock()
      const onDismiss = vi.fn()

      render(
        <ToastStack>
          <ToastStackItem key="1" duration={Infinity} onDismiss={onDismiss}>
            Storage full
          </ToastStackItem>
        </ToastStack>
      )

      advance(60_000)
      expect(onDismiss).not.toHaveBeenCalled()
    })
  })

  describe('expanding', () => {
    it('opens on focus, not only on hover', async () => {
      render(
        <ToastStack>
          <ToastStackItem key="1" data-testid="front">
            Saved
          </ToastStackItem>
          <ToastStackItem key="2" data-testid="behind">
            <button type="button">Undo</button>
          </ToastStackItem>
        </ToastStack>
      )

      const collapsed = screen.getByTestId('behind').style.transform

      // A keyboard reader reaching the second toast's button cannot be asked to hover.
      screen.getByRole('button', { name: 'Undo' }).focus()

      await waitFor(() =>
        expect(screen.getByTestId('behind').style.transform).not.toBe(collapsed)
      )
    })
  })

  describe('leaving', () => {
    it('holds a removed toast long enough to animate it out', async () => {
      const { rerender } = render(
        <ToastStack>
          <ToastStackItem key="1">Saved</ToastStackItem>
          <ToastStackItem key="2">Copied</ToastStackItem>
        </ToastStack>
      )

      rerender(
        <ToastStack>
          <ToastStackItem key="2">Copied</ToastStackItem>
        </ToastStack>
      )

      expect(screen.getByText('Saved')).toBeInTheDocument()
      await waitFor(() =>
        expect(screen.queryByText('Saved')).not.toBeInTheDocument()
      )
    })
  })

  describe('reduced motion', () => {
    it('drops the drag, so dismissing is only ever the button', () => {
      render(
        <MotionConfig reducedMotion="always">
          <ToastStack>
            <ToastStackItem key="1" onDismiss={() => {}} data-testid="toast">
              Saved
            </ToastStackItem>
          </ToastStack>
        </MotionConfig>
      )

      expect(screen.getByTestId('toast')).not.toHaveClass('cursor-grab')
    })
  })

  it('refuses to render an item outside a stack, which owns its position', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<ToastStackItem>Orphan</ToastStackItem>)).toThrow(
      'ToastStackItem must be used within a ToastStack'
    )

    error.mockRestore()
  })
})
