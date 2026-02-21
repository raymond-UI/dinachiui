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
})
