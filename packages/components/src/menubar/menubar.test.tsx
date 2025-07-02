import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarPortal,
  MenubarPositioner,
} from './menubar'

describe('Menubar', () => {
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