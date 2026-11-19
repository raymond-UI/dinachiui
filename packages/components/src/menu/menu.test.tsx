import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
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
import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { agentConformance } from '../test/agent-conformance'

describe('Menu', () => {
  it('passes side and align from MenuContent to its positioner', async () => {
    const user = userEvent.setup()
    render(
      <Menu>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent align="end" side="top">
          <MenuItem>Copy</MenuItem>
        </MenuContent>
      </Menu>
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await screen.findByRole('menuitem', { name: 'Copy' })
    const positioner = document.querySelector('[data-slot="menu-positioner"]')
    expect(positioner).toHaveAttribute('data-align', 'end')
    expect(positioner).toHaveAttribute('data-side', 'top')
  })

  it('stacks its popups above page layers, not just the popup inside a static box', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Open</MenuTrigger>
        <MenuContent>
          <MenuSub defaultOpen>
            <MenuSubTrigger>More</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>Nested</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>
    )
    const menus = screen.getAllByRole('menu')
    expect(menus).toHaveLength(2)
    for (const menu of menus) expect(menu.parentElement).toHaveClass('z-50')
  })

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


function Actions(props: React.ComponentProps<typeof Menu> & { onRename?: () => void; disabled?: boolean }) {
  const { onRename, disabled, ...menu } = props
  const [pinned, setPinned] = React.useState(false)
  return (
    <Menu {...menu}>
      <MenuTrigger disabled={disabled}>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem onClick={onRename}>Rename</MenuItem>
        <MenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</MenuCheckboxItem>
        <MenuRadioGroup defaultValue="list">
          <MenuRadioItem value="list">List</MenuRadioItem>
          <MenuRadioItem value="grid">Grid</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

agentConformance({
  name: 'Menu',
  label: 'Actions',
  render: ({ onChange, disabled }) => <Actions onOpenChange={onChange} disabled={disabled} />,
  entry: { component: 'menu', open: false, actions: ['open'] },
  act: { action: 'open', result: { open: true } },
  person: async (user) => {
    await user.click(screen.getByRole('button', { name: 'Actions' }))
  },
})

describe('Menu: agent', () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent()
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
    const run = (ref: string, action: string, ...args: unknown[]) => agent.act({ steps: [{ ref, action, args }] })
    const entry = (label: string) => agent.snapshot().find((c) => c.label === label)
    return { agent, run, entry }
  }

  it('lists the open menu first, and its items in it', async () => {
    const { run, entry, agent } = mount(<Actions />)
    await run('Actions', 'open')
    expect(agent.snapshot()[0]).toMatchObject({ component: 'menu', label: 'Actions', open: true, actions: ['close'] })
    expect(entry('Rename')).toMatchObject({ component: 'menuitem', actions: ['press'], in: 'Actions' })
    expect(entry('Pinned')).toMatchObject({ component: 'menuitem', checked: false, actions: ['press', 'setChecked'] })
  })

  it('lists its trigger once while open, so it closes by that name', async () => {
    const { run, agent } = mount(<Actions />)
    await run('Actions', 'open')
    expect(agent.snapshot().filter((c) => c.label === 'Actions')).toHaveLength(1)
    expect(await run('Actions', 'close')).toMatchObject({ ok: true })
  })

  it('offers only press on a radio item, which cannot be unchecked', async () => {
    const { run, entry } = mount(<Actions />)
    await run('Actions', 'open')
    expect(entry('List')).toMatchObject({ component: 'menuitem', checked: true, actions: ['press'] })
  })

  it('presses an item, which runs it and closes the menu', async () => {
    const onRename = vi.fn()
    const { run, entry } = mount(<Actions onRename={onRename} />)
    await run('Actions', 'open')
    expect(await run('Rename', 'press')).toMatchObject({ ok: true })
    expect(onRename).toHaveBeenCalledTimes(1)
    await vi.waitFor(() => expect(entry('Actions')).toMatchObject({ open: false }))
  })

  it('checks a checkbox item', async () => {
    const { run, entry } = mount(<Actions />)
    await run('Actions', 'open')
    expect(await run('Pinned', 'setChecked', true)).toMatchObject({ ok: true })
    await vi.waitFor(() => expect(screen.getByRole('menuitemcheckbox', { name: 'Pinned' })).toHaveAttribute('aria-checked', 'true'))
    await run('Pinned', 'setChecked', true)
    expect(entry('Pinned')).toMatchObject({ checked: true })
  })

  it('leaves the menu closed when the app refuses', async () => {
    const { run, entry } = mount(<Actions onOpenChange={(_, details) => details.cancel()} />)
    expect((await run('Actions', 'open')).error?.message).toMatch(/refused/)
    expect(entry('Actions')).toMatchObject({ open: false })
  })

  it('opens a controlled menu through its parent', async () => {
    const onOpenChange = vi.fn()
    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return <Actions open={open} onOpenChange={(next, details) => { onOpenChange(details); setOpen(next) }} />
    }
    const { run, entry } = mount(<Controlled />)
    await run('Actions', 'open')
    expect(entry('Actions')).toMatchObject({ open: true })
    expect(isAgentChange(onOpenChange.mock.calls[0][0])).toBe(true)
  })
})
