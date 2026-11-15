import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerBackdrop,
} from './drawer'
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'

describe('Drawer', () => {
  it('renders trigger and opens content', async () => {
    const user = userEvent.setup()

    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Drawer body</DrawerDescription>
        </DrawerContent>
      </Drawer>
    )

    await user.click(screen.getByRole('button', { name: 'Open Drawer' }))

    expect(screen.getByText('Drawer Title')).toBeInTheDocument()
    expect(screen.getByText('Drawer body')).toBeInTheDocument()
  })

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
    )

    expect(screen.getByText('Drawer Title')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument()
  })

  it('applies custom classes to backdrop and content', () => {
    render(
      <Drawer defaultOpen>
        <DrawerBackdrop data-testid="drawer-backdrop" className="custom-backdrop" />
        <DrawerContent data-testid="drawer-content" className="custom-content">
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
    )

    expect(screen.getByTestId('drawer-backdrop')).toHaveClass('custom-backdrop')
    expect(screen.getByTestId('drawer-content')).toHaveClass('custom-content')
  })
})

function Settings(props: Partial<React.ComponentProps<typeof Drawer>> & { disabled?: boolean }) {
  const { disabled, ...rest } = props
  return (
    <Drawer {...rest}>
      <DrawerTrigger disabled={disabled}>Open settings</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>Settings</DrawerTitle>
        <DrawerClose>Done</DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}

agentConformance({
  name: 'Drawer',
  label: 'Open settings',
  render: ({ onChange, disabled }) => <Settings onOpenChange={onChange} disabled={disabled} />,
  entry: { component: 'dialog', open: false, actions: ['open'] },
  act: { action: 'open', result: { open: true } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Open settings' }))
  },
})

describe('Drawer: agent', () => {
  it('reports the open drawer by its title, and closes it', async () => {
    const onOpenChange = vi.fn()
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Settings defaultOpen onOpenChange={onOpenChange} />
      </AgentProvider>
    )
    expect(agent.snapshot()[0]).toMatchObject({ component: 'dialog', label: 'Settings', open: true, actions: ['close'] })
    expect(await agent.act({ steps: [{ ref: 'Settings', action: 'close' }] })).toMatchObject({ ok: true })
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })
})
