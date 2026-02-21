import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio, RadioGroup } from './radio'

describe('Radio', () => {
  it('renders radio group and items', () => {
    render(
      <RadioGroup defaultValue="a" aria-label="options">
        <Radio aria-label="Option A" value="a" />
        <Radio aria-label="Option B" value="b" />
      </RadioGroup>
    )

    expect(screen.getByRole('radiogroup', { name: 'options' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeInTheDocument()
  })

  it('calls onValueChange when a radio is selected', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <RadioGroup defaultValue="a" onValueChange={onValueChange} aria-label="options">
        <Radio aria-label="Option A" value="a" />
        <Radio aria-label="Option B" value="b" />
      </RadioGroup>
    )

    await user.click(screen.getByRole('radio', { name: 'Option B' }))
    expect(onValueChange).toHaveBeenCalledWith('b', expect.any(Object))
  })
})
