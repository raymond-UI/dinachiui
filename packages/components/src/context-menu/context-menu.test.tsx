import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLinkItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './context-menu'

describe('ContextMenu', () => {
  it('renders context menu trigger', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    expect(screen.getByText('Right click me')).toBeInTheDocument()
  })

  it('opens context menu on right click', async () => {
    const user = userEvent.setup()

    render(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Menu Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByText('Right click me')
    await user.pointer({ keys: '[MouseRight]', target: trigger })

    expect(screen.getByText('Menu Item')).toBeInTheDocument()
  })

  it('calls onClick when menu item is clicked', async () => {
    const handleClick = vi.fn()

    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleClick}>Clickable Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const menuItem = screen.getByText('Clickable Item')
    fireEvent.click(menuItem)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders disabled menu item', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled>Disabled Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const menuItem = screen.getByText('Disabled Item')
    expect(menuItem).toHaveAttribute('data-disabled')
  })

  it('renders checkbox item with checked state', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked>Checked Item</ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const checkboxItem = screen.getByText('Checked Item')
    expect(checkboxItem).toHaveAttribute('data-checked')
  })

  it('renders radio group with selected item', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioGroup value="option1">
            <ContextMenuRadioItem value="option1">Option 1</ContextMenuRadioItem>
            <ContextMenuRadioItem value="option2">Option 2</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    )

    const radioItem1 = screen.getByText('Option 1')
    const radioItem2 = screen.getByText('Option 2')

    expect(radioItem1).toHaveAttribute('data-checked')
    expect(radioItem2).toHaveAttribute('data-unchecked')
  })

  it('renders separator and shortcut', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByText('⌘C')).toHaveClass('ml-auto', 'text-xs')
  })

  it('renders group with label', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>Group Label</ContextMenuLabel>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    )

    expect(screen.getByText('Group Label')).toBeInTheDocument()
  })

  it('renders link item', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLinkItem href="/test">Go to Test</ContextMenuLinkItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    expect(screen.getByText('Go to Test')).toBeInTheDocument()
  })

  it('renders submenu', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Submenu Item</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    )

    const subTrigger = screen.getByText('More Options')
    expect(subTrigger).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger className="custom-trigger">Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="custom-item">Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByText('Right click me')
    const item = screen.getByText('Item')

    expect(trigger).toHaveClass('custom-trigger')
    expect(item).toHaveClass('custom-item')
  })

  it('handles inset prop on menu items', () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset>Inset Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const menuItem = screen.getByText('Inset Item')
    expect(menuItem).toHaveClass('pl-8')
  })
})
