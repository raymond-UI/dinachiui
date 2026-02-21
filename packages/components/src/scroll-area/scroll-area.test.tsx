import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from './scroll-area'

describe('ScrollArea', () => {
  it('renders viewport and content', () => {
    render(
      <ScrollArea className="h-20 w-20" data-testid="scroll-area-root">
        <ScrollAreaViewport>
          <ScrollAreaContent>
            <div>Scrollable content</div>
          </ScrollAreaContent>
        </ScrollAreaViewport>
      </ScrollArea>
    )

    expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
    expect(screen.getByText('Scrollable content')).toBeInTheDocument()
  })

  it('renders scrollbars/thumb/corner', () => {
    render(
      <ScrollArea>
        <ScrollAreaViewport>
          <ScrollAreaContent>
            <div style={{ width: 500, height: 500 }}>Big area</div>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="vertical" keepMounted data-testid="scrollbar-v">
          <ScrollAreaThumb data-testid="thumb-v" />
        </ScrollAreaScrollbar>
        <ScrollAreaScrollbar orientation="horizontal" keepMounted data-testid="scrollbar-h">
          <ScrollAreaThumb data-testid="thumb-h" />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner data-testid="corner" />
      </ScrollArea>
    )

    expect(screen.getByTestId('scrollbar-v')).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.getByTestId('scrollbar-h')).toHaveAttribute('data-orientation', 'horizontal')
    expect(screen.getByTestId('thumb-v')).toBeInTheDocument()
    expect(screen.getByTestId('thumb-h')).toBeInTheDocument()
    expect(screen.getByTestId('corner')).toBeInTheDocument()
  })
})
