import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-11')
  })

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLElement>()
    render(<Button ref={ref}>Button</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('renders as a different element via render prop', () => {
    render(<Button render={<a href="/contact" />}>Contact</Button>)
    const link = screen.getByRole('button', { name: 'Contact' })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/contact')
    expect(link).toHaveClass('bg-primary')
  })
})