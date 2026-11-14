import * as React from 'react'
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
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'

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


function Filters(props: Partial<React.ComponentProps<typeof Popover>> & { disabled?: boolean; title?: boolean }) {
  const { disabled, title = true, ...rest } = props
  return (
    <Popover {...rest}>
      <PopoverTrigger disabled={disabled}>Filters</PopoverTrigger>
      <PopoverContent>
        {title ? <PopoverTitle>Filter results</PopoverTitle> : null}
        <p>Only show open issues.</p>
        <PopoverClose>Apply</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

agentConformance({
  name: 'Popover',
  label: 'Filters',
  render: ({ onChange, disabled }) => <Filters onOpenChange={onChange} disabled={disabled} />,
  entry: { component: 'popover', open: false, actions: ['open'] },
  act: { action: 'open', result: { open: true } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Filters' }))
  },
})

describe('Popover: agent', () => {
  function mount(props: Partial<React.ComponentProps<typeof Filters>> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <button>Elsewhere</button>
        <Filters {...props} />
      </AgentProvider>
    )
    return agent
  }

  it('lists the open popover and what is in it before the page', () => {
    const agent = mount({ defaultOpen: true })
    const labels = agent.snapshot().map((c) => c.label)
    expect(labels.indexOf('Filter results')).toBeLessThan(labels.indexOf('Elsewhere'))
    expect(agent.snapshot().find((c) => c.label === 'Apply')).toMatchObject({ in: 'Filter results' })
  })

  it('goes by its trigger name when the popup has no title', () => {
    const agent = mount({ defaultOpen: true, title: false })
    expect(agent.snapshot().find((c) => c.component === 'popover')).toMatchObject({ label: 'Filters', open: true })
  })

  it('closes', async () => {
    const onOpenChange = vi.fn()
    const agent = mount({ defaultOpen: true, onOpenChange })
    expect(await agent.act({ steps: [{ ref: 'Filter results', action: 'close' }] })).toMatchObject({ ok: true })
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })
})
