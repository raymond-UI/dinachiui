import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
} from './otp-field'

function renderOTP(props: Partial<React.ComponentProps<typeof OTPField>> = {}) {
  return render(
    <OTPField length={4} aria-label="verification code" {...props}>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  )
}

describe('OTPField', () => {
  it('renders the requested number of slots', () => {
    renderOTP()
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('renders the initial value across slots', () => {
    renderOTP({ defaultValue: '1234' })
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs.map((i) => i.value)).toEqual(['1', '2', '3', '4'])
  })

  it('fires onValueChange as the user types', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderOTP({ onValueChange })

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    await user.click(inputs[0])
    await user.keyboard('1')

    expect(onValueChange).toHaveBeenCalled()
    expect(onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0]).toBe('1')
  })

  it('fires onValueComplete when all slots are filled', async () => {
    const user = userEvent.setup()
    const onValueComplete = vi.fn()
    renderOTP({ onValueComplete })

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    await user.click(inputs[0])
    await user.keyboard('1234')

    expect(onValueComplete).toHaveBeenCalledWith('1234', expect.anything())
  })

  it('disables all slots when disabled', () => {
    renderOTP({ disabled: true })
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    inputs.forEach((input) => expect(input).toBeDisabled())
  })

  it('masks entered characters when mask is set', () => {
    render(
      <OTPField length={2} defaultValue="12" mask aria-label="masked code">
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
      </OTPField>
    )
    const inputs = screen.queryAllByRole('textbox')
    expect(inputs).toHaveLength(0)
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    expect(passwordInputs.length).toBe(2)
  })

  it('renders separator between groups', () => {
    render(
      <OTPField length={4} aria-label="code">
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
        <OTPFieldSeparator>-</OTPFieldSeparator>
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
      </OTPField>
    )
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
})
