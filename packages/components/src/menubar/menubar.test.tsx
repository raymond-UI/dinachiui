import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AgentProvider, createAgent } from '../agent'
import { agentConformance } from '../test/agent-conformance'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarPortal,
  MenubarPositioner,
} from './menubar'

describe('Menubar', () => {
  it('stacks its popup above page layers, not just the popup inside a static box', async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarPortal>
            <MenubarPositioner>
              <MenubarContent>
                <MenubarItem>New</MenubarItem>
              </MenubarContent>
            </MenubarPositioner>
          </MenubarPortal>
        </MenubarMenu>
      </Menubar>
    )
    await userEvent.click(screen.getByText('File'))
    const menu = await screen.findByRole('menu')
    expect(menu.parentElement).toHaveClass('z-50')
  })

  it('renders menubar container', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )

    expect(screen.getByRole('menubar')).toBeInTheDocument()
    expect(screen.getByText('File')).toBeInTheDocument()
  })

  it('applies custom className to menubar', () => {
    render(
      <Menubar className="custom-menubar">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )

    expect(screen.getByRole('menubar')).toHaveClass('custom-menubar')
  })

  it('applies correct ARIA attributes to trigger', async () => {
    const user = userEvent.setup()
    
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarPortal>
            <MenubarPositioner>
              <MenubarContent>
                <MenubarItem>New</MenubarItem>
                <MenubarItem>Open</MenubarItem>
              </MenubarContent>
            </MenubarPositioner>
          </MenubarPortal>
        </MenubarMenu>
      </Menubar>
    )

    const trigger = screen.getByText('File')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    
    await user.click(trigger)
    // Note: Menu content rendering in Portal is not reliable in JSDOM tests
  })

  it('renders shortcut with correct styling', () => {
    render(<MenubarShortcut>⌘N</MenubarShortcut>)
    const shortcut = screen.getByText('⌘N')
    expect(shortcut).toBeInTheDocument()
    expect(shortcut).toHaveClass('ml-auto', 'text-xs', 'tracking-widest')
  })

  it('renders separator with correct role', () => {
    render(<MenubarSeparator />)
    const separator = screen.getByRole('separator')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveClass('my-1', 'h-px', 'bg-border')
  })

  it('menubar displays the correct orientation', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )

    const menubar = screen.getByRole('menubar')
    expect(menubar).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('menubar trigger has proper classes', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )

    const trigger = screen.getByText('File')
    expect(trigger).toHaveClass('flex', 'cursor-default', 'select-none')
  })

  it('menubar shortcut renders correctly', () => {
    render(<MenubarShortcut>Ctrl+N</MenubarShortcut>)
    const shortcut = screen.getByText('Ctrl+N')
    expect(shortcut).toHaveClass('ml-auto', 'text-xs')
  })

  it('supports multiple menus in menubar', () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )

    expect(screen.getByText('File')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('View')).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    
    render(
      <Menubar ref={ref}>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
}) 
function Editor({ onNew, disabled, ...menu }: React.ComponentProps<typeof MenubarMenu> & { onNew?: () => void }) {
  return (
    <Menubar aria-label="Editor">
      <MenubarMenu {...menu} disabled={disabled}>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem onClick={onNew}>New</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  )
}

agentConformance({
  name: 'Menubar',
  label: 'File',
  render: ({ onChange, disabled }) => <Editor onOpenChange={onChange} disabled={disabled} />,
  entry: { component: 'menu', open: false, in: 'Editor', actions: ['open'] },
  act: { action: 'open', result: { open: true } },
  commits: 2,
  person: async (user) => {
    await user.click(screen.getByRole('menuitem', { name: 'File' }))
  },
})

describe('Menubar: agent', () => {
  it('lists each menu in the menubar, and its items in the menu', async () => {
    const onNew = vi.fn()
    const agent = createAgent()
    render(<AgentProvider agent={agent}><Editor onNew={onNew} /></AgentProvider>)
    const menus = agent.snapshot().filter((c) => c.component === 'menu')
    expect(menus.map((c) => [c.label, c.in])).toEqual([['File', 'Editor'], ['View', 'Editor']])
    await agent.act({ steps: [{ ref: 'File', action: 'open' }] })
    expect(agent.snapshot().find((c) => c.label === 'New')).toMatchObject({ component: 'menuitem', in: 'File' })
    expect(await agent.act({ steps: [{ ref: 'New', action: 'press' }] })).toMatchObject({ ok: true })
    expect(onNew).toHaveBeenCalledTimes(1)
  })
})
