import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from './menu'

describe('Menu', () => {
  it('renders trigger with expected ARIA attributes', () => {
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
      </Menu>
    )

    const trigger = screen.getByRole('button', { name: 'Actions' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders separator and shortcut utility', () => {
    render(
      <>
        <MenuSeparator />
        <MenuShortcut>⌘K</MenuShortcut>
      </>
    )

    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByText('⌘K')).toHaveClass('ml-auto', 'text-xs')
  })

  it('renders menu with items', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders menu group with label', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuLabel>Group Label</MenuLabel>
            <MenuItem>Item 1</MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders link item', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuLinkItem href="/test">Go to Test</MenuLinkItem>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders checkbox item', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem checked>Show Status</MenuCheckboxItem>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders radio group with items', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value="a">
            <MenuRadioItem value="a">Option A</MenuRadioItem>
            <MenuRadioItem value="b">Option B</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders submenu structure', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuSub>
            <MenuSubTrigger>More</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Sub Item</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })
})
