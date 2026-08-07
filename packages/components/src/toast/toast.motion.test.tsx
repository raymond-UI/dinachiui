import { describe, it, expect, vi, afterEach } from 'vitest'
import * as React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MotionConfig } from 'motion/react'
import {
  ToastProvider,
  ToastViewport,
  ToastList,
  ToastRoot,
  ToastTitle,
  useToastManager,
} from './toast.motion'

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

/** Base UI's root. It is the labelled dialog, so its own title finds it. */
function root(title: string) {
  return screen.getByRole('dialog', { name: title })
}

/** The animated card, inside the root that positions it. */
function card(title: string) {
  return root(title).firstElementChild as HTMLElement
}

/** The row inside the card. The card animates its height, so the contents are a child. */
function row(title: string) {
  return card(title).firstElementChild as HTMLElement
}

function Seed({ titles }: { titles: string[] }) {
  const { add } = useToastManager()
  const done = React.useRef(false)

  React.useEffect(() => {
    if (done.current) return
    done.current = true
    // Oldest first, so the last one named is the toast in front.
    for (const title of titles) add({ title })
  }, [add, titles])

  return null
}

function Fixture({
  titles,
  visibleDepth,
  stack,
  timeout,
  children,
}: {
  titles: string[]
  visibleDepth?: number
  stack?: boolean
  timeout?: number
  children?: React.ReactNode
}) {
  return (
    <ToastProvider timeout={timeout}>
      <Seed titles={titles} />
      <ToastViewport data-testid="viewport" visibleDepth={visibleDepth} stack={stack}>
        {children ?? (
          <ToastList
            renderToast={(toast) => (
              <>
                <ToastTitle>{toast.title}</ToastTitle>
                <DismissButton title={String(toast.title)} />
              </>
            )}
          />
        )}
      </ToastViewport>
    </ToastProvider>
  )
}

function DismissButton({ title }: { title: string }) {
  const { toasts, close } = useToastManager()
  const id = toasts.find((toast) => toast.title === title)?.id

  return (
    <button type="button" onClick={() => id && close(id)}>
      Undo {title}
    </button>
  )
}

describe('Toast (motion)', () => {
  it('renders the toasts in the queue', async () => {
    render(<Fixture titles={['Saved', 'Copied']} />)

    await screen.findByText('Saved')
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })

  it('renders title and description without a render function', async () => {
    function Descriptive() {
      const { add } = useToastManager()
      const done = React.useRef(false)
      React.useEffect(() => {
        if (done.current) return
        done.current = true
        add({ title: 'Saved', description: 'Draft synced to the server' })
      }, [add])
      return null
    }

    render(
      <ToastProvider>
        <Descriptive />
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastProvider>
    )

    await screen.findByText('Saved')
    expect(screen.getByText('Draft synced to the server')).toBeInTheDocument()
  })

  describe('what it shares with the default build', () => {
    it('announces its toasts, because the viewport is Base UI’s live region', async () => {
      render(<Fixture titles={['Saved']} />)
      await screen.findByText('Saved')

      // The reason this is a viewport rather than a plain box. A notification a screen
      // reader never reaches is not a notification.
      const viewport = screen.getByTestId('viewport')
      expect(viewport).toHaveAttribute('role', 'region')
      expect(viewport).toHaveAttribute('aria-live', 'polite')
    })

    it('names each toast after its own title', async () => {
      render(<Fixture titles={['Saved']} />)
      await screen.findByText('Saved')

      // `ToastTitle` registers the id the root points `aria-labelledby` at, which is why
      // the title belongs inside the toast rather than around it.
      expect(screen.getByRole('dialog', { name: 'Saved' })).toBeInTheDocument()
    })

    // Real timers: the toast leaves through Base UI's removal, which settles on a frame
    // rather than on a timeout, and a faked clock never gets there.
    it('closes a toast on the provider’s timeout', async () => {
      render(<Fixture titles={['Saved']} timeout={150} />)
      await screen.findByText('Saved')

      // Nothing in this build counts. Deleting its own countdown is the point: two clocks
      // for one toast is how a stack ends up dismissing something mid-sentence.
      await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument())
    })

    it('holds the countdown while the reader is looking at the stack', async () => {
      useClock()
      render(<Fixture titles={['Saved']} timeout={1000} />)
      await act(async () => {})

      advance(400)
      fireEvent.pointerEnter(screen.getByTestId('viewport'))

      // Base UI pauses the timers on hover. Expanding the stack is the same gesture, so
      // there is no second countdown here to keep in step with it.
      advance(5000)
      expect(screen.getByText('Saved')).toBeInTheDocument()
    })
  })

  it('keeps the toast in front on top of the ones behind it', async () => {
    render(<Fixture titles={['Copied', 'Saved']} />)
    await screen.findByText('Saved')

    // A toast that arrived later must not paint over the one in front of it.
    expect(Number(root('Saved').style.zIndex)).toBeGreaterThan(
      Number(root('Copied').style.zIndex)
    )
  })

  it('holds one toast past the visible depth, invisible, so the next one fades in', async () => {
    render(<Fixture titles={['Third', 'Second', 'First']} visibleDepth={1} />)
    await screen.findByText('First')

    await waitFor(() => expect(card('First').style.opacity).toBe('1'))
    // Rendered and measured, but not yet part of the stack the reader can see.
    expect(card('Second').style.opacity).toBe('0')
    expect(screen.queryByText('Third')).not.toBeInTheDocument()
  })

  it('shows nothing but the card edge of the toasts behind the front one', async () => {
    render(<Fixture titles={['Copied', 'Saved']} />)
    await screen.findByText('Saved')

    // Collapsed, only a few pixels of the toast behind show above the one in front, and a
    // few pixels of a sentence read as a rendering fault rather than as depth.
    expect(row('Copied').style.opacity).toBe('0')
    expect(row('Saved').style.opacity).toBe('1')
  })

  describe('expanding', () => {
    it('gives the toasts behind their contents back', async () => {
      render(<Fixture titles={['Copied', 'Saved']} />)
      await screen.findByText('Saved')

      fireEvent.pointerEnter(screen.getByTestId('viewport'))

      await waitFor(() => expect(row('Copied').style.opacity).toBe('1'))
    })

    it('opens on focus, not only on hover', async () => {
      render(<Fixture titles={['Copied', 'Saved']} />)
      await screen.findByText('Saved')

      const collapsed = card('Copied').style.transform

      // A keyboard reader reaching the second toast's button cannot be asked to hover.
      act(() => screen.getByRole('button', { name: 'Undo Copied' }).focus())

      await waitFor(() => expect(card('Copied').style.transform).not.toBe(collapsed))
    })

    it('stays open with stacking off', async () => {
      render(<Fixture titles={['Copied', 'Saved']} stack={false} />)
      await screen.findByText('Saved')

      // The same motion, without the depth collapse. There is nothing to expand, so the
      // toast behind is readable without being hovered first.
      await waitFor(() => expect(row('Copied').style.opacity).toBe('1'))
    })
  })

  describe('leaving', () => {
    it('holds a closed toast long enough to animate it out', async () => {
      render(<Fixture titles={['Copied', 'Saved']} />)
      await screen.findByText('Saved')

      // Base UI drops the toast from the queue as soon as it starts leaving, because the
      // root carries no CSS animation to wait for. `AnimatePresence` is what keeps the
      // card on screen for the exit.
      act(() => screen.getByRole('button', { name: 'Undo Saved' }).click())

      expect(screen.getByText('Saved')).toBeInTheDocument()
      await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument())
    })
  })

  describe('reduced motion', () => {
    it('drops the drag, so dismissing is only ever the button', async () => {
      render(
        <MotionConfig reducedMotion="always">
          <Fixture titles={['Saved']} />
        </MotionConfig>
      )
      await screen.findByText('Saved')

      expect(card('Saved')).not.toHaveClass('cursor-grab')
    })
  })

  describe('the viewport is what arranges the queue', () => {
    it('refuses to render a list outside a viewport', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() =>
        render(
          <ToastProvider>
            <ToastList />
          </ToastProvider>
        )
      ).toThrow('ToastList must be used within a ToastViewport')

      error.mockRestore()
    })

    it('refuses to render a toast outside a list, which owns its position', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() =>
        render(
          <ToastProvider>
            <ToastRoot toast={{ id: 'orphan' } as never}>Orphan</ToastRoot>
          </ToastProvider>
        )
      ).toThrow('ToastRoot must be rendered by ToastList')

      error.mockRestore()
    })
  })
})
