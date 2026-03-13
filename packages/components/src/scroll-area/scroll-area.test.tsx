import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  ScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from './scroll-area'

describe('ScrollArea (compound)', () => {
  it('renders children', () => {
    render(
      <ScrollArea className="h-20 w-20" data-testid="scroll-area">
        <div>Scrollable content</div>
      </ScrollArea>
    )

    expect(screen.getByTestId('scroll-area')).toBeInTheDocument()
    expect(screen.getByText('Scrollable content')).toBeInTheDocument()
  })

  it('applies custom className to root', () => {
    render(
      <ScrollArea className="my-custom-class" data-testid="root">
        <div>Content</div>
      </ScrollArea>
    )

    expect(screen.getByTestId('root')).toHaveClass('my-custom-class')
  })

  it('applies viewportClassName to viewport', () => {
    const { container } = render(
      <ScrollArea viewportClassName="custom-viewport">
        <div>Content</div>
      </ScrollArea>
    )

    const viewport = container.querySelector('.custom-viewport')
    expect(viewport).toBeInTheDocument()
  })

  it('renders with vertical orientation by default', () => {
    render(
      <ScrollArea data-testid="scroll">
        <div>Content</div>
      </ScrollArea>
    )

    expect(screen.getByTestId('scroll')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders with horizontal orientation', () => {
    render(
      <ScrollArea orientation="horizontal" data-testid="scroll">
        <div>Content</div>
      </ScrollArea>
    )

    expect(screen.getByTestId('scroll')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders with both orientations', () => {
    render(
      <ScrollArea orientation="both" data-testid="scroll">
        <div>Content</div>
      </ScrollArea>
    )

    expect(screen.getByTestId('scroll')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

describe('ScrollArea (primitives)', () => {
  it('renders with manual composition', () => {
    render(
      <ScrollAreaRoot data-testid="root">
        <ScrollAreaViewport>
          <ScrollAreaContent>
            <div>Manual content</div>
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="vertical" keepMounted data-testid="scrollbar-v">
          <ScrollAreaThumb data-testid="thumb-v" />
        </ScrollAreaScrollbar>
        <ScrollAreaScrollbar orientation="horizontal" keepMounted data-testid="scrollbar-h">
          <ScrollAreaThumb data-testid="thumb-h" />
        </ScrollAreaScrollbar>
      </ScrollAreaRoot>
    )

    expect(screen.getByTestId('root')).toBeInTheDocument()
    expect(screen.getByText('Manual content')).toBeInTheDocument()
    expect(screen.getByTestId('scrollbar-v')).toHaveAttribute('data-orientation', 'vertical')
    expect(screen.getByTestId('scrollbar-h')).toHaveAttribute('data-orientation', 'horizontal')
    expect(screen.getByTestId('thumb-v')).toBeInTheDocument()
    expect(screen.getByTestId('thumb-h')).toBeInTheDocument()
  })
})
