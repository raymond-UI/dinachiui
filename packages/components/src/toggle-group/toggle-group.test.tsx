import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

describe('ToggleGroup', () => {
  it('renders group and items', () => {
    render(
      <ToggleGroup aria-label="formatting" defaultValue={['bold']} multiple>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    )

    expect(screen.getByRole('group', { name: 'formatting' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
  })

  it('calls onValueChange when toggled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <ToggleGroup aria-label="formatting" defaultValue={['bold']} multiple onValueChange={onValueChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    )

    await user.click(screen.getByRole('button', { name: 'Italic' }))
    expect(onValueChange).toHaveBeenCalled()

    const latestCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]
    expect(latestCall?.[0]).toEqual(expect.arrayContaining(['bold', 'italic']))
  })

  it('supports single selection (default)', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <ToggleGroup aria-label="alignment" defaultValue={['left']} onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>
    )

    await user.click(screen.getByRole('button', { name: 'Center' }))
    expect(onValueChange).toHaveBeenCalled()

    const latestCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]
    expect(latestCall?.[0]).toEqual(['center'])
  })

  it('applies custom className to group', () => {
    render(
      <ToggleGroup aria-label="test" className="custom-group">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )

    expect(screen.getByRole('group')).toHaveClass('custom-group')
  })

  it('forwards ref on group', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ToggleGroup ref={ref} aria-label="test">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  describe('ToggleGroupItem', () => {
    it('applies custom className', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" className="custom-item">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('custom-item')
    })

    it('forwards ref', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem ref={ref} value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('renders with outline variant by default', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('border')
    })

    it('renders with default variant', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" variant="default">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('bg-transparent')
      expect(screen.getByRole('button')).not.toHaveClass('border')
    })

    it('renders with sm size by default', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('h-9')
    })

    it('renders with lg size', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" size="lg">A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveClass('h-11')
    })

    it('can be disabled', () => {
      render(
        <ToggleGroup aria-label="test">
          <ToggleGroupItem value="a" disabled>A</ToggleGroupItem>
        </ToggleGroup>
      )

      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
    })
  })

  it('disables all items when group is disabled', () => {
    render(
      <ToggleGroup aria-label="test" disabled>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })
  })
})
