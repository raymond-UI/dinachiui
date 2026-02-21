import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch, SwitchThumb } from './switch'

describe('Switch', () => {
  it('renders switch and thumb', () => {
    render(
      <Switch data-testid="switch-root">
        <SwitchThumb data-testid="switch-thumb" />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toBeInTheDocument()
    expect(screen.getByTestId('switch-thumb')).toBeInTheDocument()
  })

  it('calls onCheckedChange when clicked', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(
      <Switch data-testid="switch-root" onCheckedChange={onCheckedChange}>
        <SwitchThumb />
      </Switch>
    )

    await user.click(screen.getByTestId('switch-root'))
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.any(Object))
  })
})
