import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
} from './popover'

describe('Popover', () => {
  it('renders trigger correctly', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Test Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    )

    expect(screen.getByText('Open Popover')).toBeInTheDocument()
  })

  it('opens popover when trigger is clicked', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Test Title</PopoverTitle>
          <PopoverDescription>Test Description</PopoverDescription>
        </PopoverContent>
      </Popover>
    )

    const trigger = screen.getByText('Open Popover')
    fireEvent.click(trigger)

    // Wait for popover to appear
    expect(await screen.findByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('closes popover when close button is clicked', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Test Title</PopoverTitle>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    )

    const trigger = screen.getByText('Open Popover')
    fireEvent.click(trigger)

    expect(await screen.findByText('Test Title')).toBeInTheDocument()

    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)

    // Popover should be removed
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('handles controlled state', () => {
    const onOpenChange = vi.fn()
    
    const { rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Test Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    )

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()

    const trigger = screen.getByText('Open Popover')
    fireEvent.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object))

    rerender(
      <Popover open={true} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Test Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders with arrow', async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverArrow data-testid="popover-arrow" />
          <PopoverTitle>Test Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    )

    expect(await screen.findByTestId('popover-arrow')).toBeInTheDocument()
  })

  it('applies custom className to components', async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger className="custom-trigger">Trigger</PopoverTrigger>
        <PopoverContent className="custom-content">
          <PopoverTitle className="custom-title">Title</PopoverTitle>
          <PopoverDescription className="custom-description">
            Description
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    )

    expect(screen.getByText('Trigger')).toHaveClass('custom-trigger')
    
    const title = await screen.findByText('Title')
    expect(title).toHaveClass('custom-title')
    
    const description = screen.getByText('Description')
    expect(description).toHaveClass('custom-description')
  })

  it('supports different positions', async () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent side="top" align="start" sideOffset={16}>
          <PopoverTitle>Test Title</PopoverTitle>
        </PopoverContent>
      </Popover>
    )

    expect(await screen.findByText('Test Title')).toBeInTheDocument()
  })
})

