import { render, screen } from '@testing-library/react'
import { Input } from './input'
import { vi } from 'vitest'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })

  it('accepts custom className', () => {
    render(<Input data-testid="input" className="custom-class" />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-class')
  })

  it('supports input types', () => {
    render(<Input data-testid="input" type="email" />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('passes through input props', () => {
    render(<Input data-testid="input" disabled required />)
    
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
    expect(input).toBeRequired()
  })
})
