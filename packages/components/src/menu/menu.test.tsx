import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Menu,
  MenuTrigger,
  MenuSeparator,
  MenuShortcut,
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
})
