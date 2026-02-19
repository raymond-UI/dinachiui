import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerBackdrop,
} from './drawer'

describe('Drawer', () => {
  it('renders trigger and opens content', async () => {
    const user = userEvent.setup()

    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Drawer body</DrawerDescription>
        </DrawerContent>
      </Drawer>
    )

    await user.click(screen.getByRole('button', { name: 'Open Drawer' }))

    expect(screen.getByText('Drawer Title')).toBeInTheDocument()
    expect(screen.getByText('Drawer body')).toBeInTheDocument()
  })

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
    )

    expect(screen.getByText('Drawer Title')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Drawer Title')).not.toBeInTheDocument()
  })

  it('applies custom classes to backdrop and content', () => {
    render(
      <Drawer defaultOpen>
        <DrawerBackdrop data-testid="drawer-backdrop" className="custom-backdrop" />
        <DrawerContent data-testid="drawer-content" className="custom-content">
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
    )

    expect(screen.getByTestId('drawer-backdrop')).toHaveClass('custom-backdrop')
    expect(screen.getByTestId('drawer-content')).toHaveClass('custom-content')
  })
})
