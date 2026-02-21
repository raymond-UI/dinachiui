import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from './number-field'

describe('NumberField', () => {
  it('renders input and controls', () => {
    render(
      <NumberField defaultValue={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement>-</NumberFieldDecrement>
          <NumberFieldInput aria-label="quantity" />
          <NumberFieldIncrement>+</NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>
    )

    expect(screen.getByRole('textbox', { name: 'quantity' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument()
  })

  it('fires onValueChange when incremented', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <NumberField defaultValue={1} onValueChange={onValueChange}>
        <NumberFieldGroup>
          <NumberFieldDecrement>-</NumberFieldDecrement>
          <NumberFieldInput aria-label="quantity" />
          <NumberFieldIncrement>+</NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>
    )

    await user.click(screen.getByRole('button', { name: 'Increase' }))
    expect(onValueChange).toHaveBeenCalled()
  })
})
