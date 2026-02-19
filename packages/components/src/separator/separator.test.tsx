import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Separator } from './separator'

describe('Separator', () => {
  it('renders horizontal separator by default', () => {
    render(<Separator data-testid="separator" />)
    const separator = screen.getByTestId('separator')

    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveClass('h-px', 'w-full')
  })

  it('renders vertical separator', () => {
    render(<Separator data-testid="separator" orientation="vertical" />)
    const separator = screen.getByTestId('separator')

    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveClass('h-full', 'w-px')
  })
})
