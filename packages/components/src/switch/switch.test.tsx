import * as React from 'react'
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

  it('supports defaultChecked', () => {
    render(
      <Switch data-testid="switch-root" defaultChecked>
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveAttribute('data-checked', '')
  })

  it('supports controlled checked state', () => {
    render(
      <Switch data-testid="switch-root" checked={true} onCheckedChange={() => {}}>
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveAttribute('data-checked', '')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()

    render(
      <Switch data-testid="switch-root">
        <SwitchThumb />
      </Switch>
    )

    const root = screen.getByTestId('switch-root')
    expect(root).toHaveAttribute('data-unchecked', '')

    await user.click(root)
    expect(root).toHaveAttribute('data-checked', '')

    await user.click(root)
    expect(root).toHaveAttribute('data-unchecked', '')
  })

  it('can be disabled', () => {
    render(
      <Switch data-testid="switch-root" disabled>
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveAttribute('data-disabled', '')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()

    render(
      <Switch data-testid="switch-root" disabled onCheckedChange={onCheckedChange}>
        <SwitchThumb />
      </Switch>
    )

    await user.click(screen.getByTestId('switch-root'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('applies custom className to root', () => {
    render(
      <Switch data-testid="switch-root" className="custom-switch">
        <SwitchThumb />
      </Switch>
    )

    expect(screen.getByTestId('switch-root')).toHaveClass('custom-switch')
  })

  it('applies custom className to thumb', () => {
    render(
      <Switch>
        <SwitchThumb data-testid="switch-thumb" className="custom-thumb" />
      </Switch>
    )

    expect(screen.getByTestId('switch-thumb')).toHaveClass('custom-thumb')
  })

  it('forwards ref on root', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <Switch ref={ref}>
        <SwitchThumb />
      </Switch>
    )

    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('forwards ref on thumb', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <Switch>
        <SwitchThumb ref={ref} />
      </Switch>
    )

    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})
