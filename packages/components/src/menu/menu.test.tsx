import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  MenuFilter,
  MenuInput,
  MenuClear,
  MenuEmpty,
  MenuList,
} from './menu'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarContent,
  MenubarItem,
} from '../menubar/menubar'

describe('Menu', () => {
  it('renders trigger with expected ARIA attributes', () => {
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
      </Menu>
    )

    const trigger = screen.getByRole('button', { name: 'Actions' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders separator and shortcut utility', () => {
    render(
      <>
        <MenuSeparator />
        <MenuShortcut>⌘K</MenuShortcut>
      </>
    )

    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByText('⌘K')).toHaveClass('ml-auto', 'text-xs')
  })

  it('renders menu with items', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders menu group with label', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuLabel>Group Label</MenuLabel>
            <MenuItem>Item 1</MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders link item', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuLinkItem href="/test">Go to Test</MenuLinkItem>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders checkbox item', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuCheckboxItem checked>Show Status</MenuCheckboxItem>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders radio group with items', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuRadioGroup value="a">
            <MenuRadioItem value="a">Option A</MenuRadioItem>
            <MenuRadioItem value="b">Option B</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('renders submenu structure', () => {
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuSub>
            <MenuSubTrigger>More</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Sub Item</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })
})

function renderFilterableMenu() {
  render(
    <MenuFilter>
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuInput aria-label="Filter actions" placeholder="Filter" />
          <MenuClear />
          <MenuEmpty>No actions found.</MenuEmpty>
          <MenuList>
            <MenuGroup data-filter-section>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuGroup>
            <MenuGroup data-filter-section>
              <MenuSeparator data-filter-separator className="hidden" />
              <MenuItem>Share</MenuItem>
              <MenuItem>Download</MenuItem>
            </MenuGroup>
          </MenuList>
        </MenuContent>
      </Menu>
    </MenuFilter>
  )
}

function visibleItems() {
  return screen.queryAllByRole('menuitem').map((item) => item.textContent)
}

describe('Menu filtering', () => {
  it('narrows items to the typed query', async () => {
    const user = userEvent.setup()
    renderFilterableMenu()

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await screen.findByRole('menuitem', { name: 'Rename' })
    expect(visibleItems()).toEqual(['Rename', 'Delete', 'Share', 'Download'])

    await user.type(await screen.findByLabelText('Filter actions'), 'de')
    expect(visibleItems()).toEqual(['Delete'])
  })

  it('shows MenuEmpty only when nothing matches', async () => {
    const user = userEvent.setup()
    renderFilterableMenu()

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    const input = await screen.findByLabelText('Filter actions')

    await user.type(input, 'de')
    expect(screen.queryByText(/No actions found/)).not.toBeInTheDocument()

    await user.clear(input)
    await user.type(input, 'zzz')
    expect(screen.getByText(/No actions found/)).toBeInTheDocument()
    expect(visibleItems()).toEqual([])
  })

  it('clears the query with MenuClear', async () => {
    const user = userEvent.setup()
    renderFilterableMenu()

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    const input = (await screen.findByLabelText<HTMLInputElement>('Filter actions'))
    await user.type(input, 'de')
    expect(visibleItems()).toEqual(['Delete'])

    const clear = document.querySelector<HTMLElement>('button[aria-hidden="true"]')
    expect(clear).not.toBeNull()
    await user.click(clear!)

    expect(input.value).toBe('')
    expect(visibleItems()).toEqual(['Rename', 'Delete', 'Share', 'Download'])
  })

  it('moves the highlight through matching items only', async () => {
    const user = userEvent.setup()
    renderFilterableMenu()

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.type(await screen.findByLabelText('Filter actions'), 'd')
    expect(visibleItems()).toEqual(['Delete', 'Download'])

    const highlighted: (string | null)[] = []
    for (let i = 0; i < 2; i++) {
      await user.keyboard('{ArrowDown}')
      const current = document.querySelector('[data-highlighted][role="menuitem"]')
      highlighted.push(current?.textContent ?? null)
    }
    expect(highlighted).toEqual(['Delete', 'Download'])
  })

  it('resets the query when the menu reopens', async () => {
    const user = userEvent.setup()
    renderFilterableMenu()

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await user.type(await screen.findByLabelText('Filter actions'), 'de')
    expect(visibleItems()).toEqual(['Delete'])

    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Actions' }))

    expect((await screen.findByLabelText<HTMLInputElement>('Filter actions')).value).toBe('')
    expect(visibleItems()).toEqual(['Rename', 'Delete', 'Share', 'Download'])
  })

  it('filters a submenu wrapped in its own MenuFilter', async () => {
    const user = userEvent.setup()
    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem>Rename</MenuItem>
          <MenuFilter>
            <MenuSub>
              <MenuSubTrigger>Move to</MenuSubTrigger>
              <MenuSubContent>
                <MenuInput aria-label="Filter folders" />
                <MenuEmpty>No folders.</MenuEmpty>
                <MenuList>
                  <MenuItem>Desktop</MenuItem>
                  <MenuItem>Documents</MenuItem>
                  <MenuItem>Archive</MenuItem>
                </MenuList>
              </MenuSubContent>
            </MenuSub>
          </MenuFilter>
        </MenuContent>
      </Menu>
    )

    await user.click(screen.getByRole('button', { name: 'Actions' }))
    await screen.findByText('Move to')
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}')
    await user.type(await screen.findByLabelText('Filter folders'), 'doc')

    const folders = within(screen.getByRole('dialog', { name: 'Move to' })).queryAllByRole('menuitem')
    expect(folders.map((item) => item.textContent)).toEqual(['Documents'])
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument()
  })

  it('filters inside a Menubar menu', async () => {
    const user = userEvent.setup()
    render(
      <Menubar>
        <MenuFilter>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarPortal>
              <MenubarPositioner>
                <MenubarContent>
                  <MenuInput aria-label="Filter file" />
                  <MenuEmpty>No commands.</MenuEmpty>
                  <MenuList>
                    <MenubarItem>New</MenubarItem>
                    <MenubarItem>Open</MenubarItem>
                  </MenuList>
                </MenubarContent>
              </MenubarPositioner>
            </MenubarPortal>
          </MenubarMenu>
        </MenuFilter>
      </Menubar>
    )

    await user.click(screen.getByText('File'))
    await user.type(await screen.findByLabelText('Filter file'), 'op')
    expect(screen.getByRole('menuitem', { name: 'Open' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'New' })).not.toBeInTheDocument()
  })
})

