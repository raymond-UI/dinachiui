import { render, screen } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('applies default variant classes', () => {
    render(<Input data-testid="input" />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('h-10') // default size
  })

  it('applies size variants correctly', () => {
    const { rerender } = render(<Input data-testid="input" size="sm" />)
    expect(screen.getByTestId('input')).toHaveClass('h-9')

    rerender(<Input data-testid="input" size="lg" />)
    expect(screen.getByTestId('input')).toHaveClass('h-11')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Input data-testid="input" variant="destructive" />)
    expect(screen.getByTestId('input')).toHaveClass('border-destructive')

    rerender(<Input data-testid="input" variant="success" />)
    expect(screen.getByTestId('input')).toHaveClass('border-green-500')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
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
