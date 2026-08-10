import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
} from './animated-tabs'

const TABS = ['Overview', 'Activity', 'Settings']

function renderTabs(props: React.ComponentProps<typeof AnimatedTabs> = {}) {
  return render(
    <AnimatedTabs defaultValue="overview" {...props}>
      <AnimatedTabsList>
        {TABS.map((tab) => (
          <AnimatedTabsTrigger key={tab} value={tab.toLowerCase()}>
            {tab}
          </AnimatedTabsTrigger>
        ))}
      </AnimatedTabsList>
      {TABS.map((tab) => (
        <AnimatedTabsContent key={tab} value={tab.toLowerCase()}>
          {tab} panel
        </AnimatedTabsContent>
      ))}
    </AnimatedTabs>
  )
}

/**
 * The pill is the one element carrying `layoutId`, and it is mounted on the active
 * trigger alone. Motion measures both positions and interpolates between them, so the
 * whole travel is expressed by which trigger owns this node.
 */
function indicatorsOf() {
  return document.querySelectorAll('[aria-hidden="true"]')
}

describe('AnimatedTabs', () => {
  it('renders a tablist with a panel for the selected tab', () => {
    renderTabs()

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByText('Overview panel')).toBeInTheDocument()
    expect(screen.queryByText('Activity panel')).not.toBeInTheDocument()
  })

  /**
   * Base UI marks the selected tab `data-active`. The styling hangs off that attribute,
   * so a variant name that does not match leaves every tab the same colour — and with
   * the default palette the two colours are close enough that it still looks right.
   */
  it('colours the selected tab off the attribute Base UI actually sets', () => {
    renderTabs()

    const tab = screen.getByRole('tab', { name: 'Overview' })
    expect(tab).toHaveAttribute('data-active')
    expect(tab).toHaveClass('data-[active]:text-foreground')
  })

  it('leaves the selected tab alone on hover, so an overridden colour survives', () => {
    render(
      <AnimatedTabs defaultValue="one">
        <AnimatedTabsList>
          <AnimatedTabsTrigger
            value="one"
            className="data-[active]:text-primary-foreground"
          >
            One
          </AnimatedTabsTrigger>
        </AnimatedTabsList>
      </AnimatedTabs>
    )

    const tab = screen.getByRole('tab', { name: 'One' })
    expect(tab).toHaveClass('data-[active]:text-primary-foreground')
    expect(tab).not.toHaveClass('hover:text-foreground')
  })

  it('switches panels on click', async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.click(screen.getByRole('tab', { name: 'Activity' }))

    expect(screen.getByText('Activity panel')).toBeInTheDocument()
    expect(screen.queryByText('Overview panel')).not.toBeInTheDocument()
  })

  it('roves focus with the arrow keys and selects on Enter', async () => {
    const user = userEvent.setup()
    renderTabs()

    screen.getByRole('tab', { name: 'Overview' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(screen.getByText('Activity panel')).toBeInTheDocument()
    // The pill still ends up on the selected tab. What the keyboard changes is only
    // whether it travels to get there.
    expect(
      screen.getByRole('tab', { name: 'Activity' }).querySelector('[aria-hidden]')
    ).toBeInTheDocument()
  })

  describe('the indicator', () => {
    it('sits on the selected tab, and only there', () => {
      renderTabs()

      expect(indicatorsOf()).toHaveLength(1)
      expect(
        screen.getByRole('tab', { name: 'Overview' }).querySelector('[aria-hidden]')
      ).toBeInTheDocument()
    })

    it('moves to the tab that was clicked', async () => {
      const user = userEvent.setup()
      renderTabs()

      await user.click(screen.getByRole('tab', { name: 'Settings' }))

      expect(indicatorsOf()).toHaveLength(1)
      expect(
        screen.getByRole('tab', { name: 'Settings' }).querySelector('[aria-hidden]')
      ).toBeInTheDocument()
    })

    it('takes a className of its own, so it can be themed without touching the tab', () => {
      render(
        <AnimatedTabs defaultValue="one">
          <AnimatedTabsList>
            <AnimatedTabsTrigger value="one" indicatorClassName="bg-primary">
              One
            </AnimatedTabsTrigger>
          </AnimatedTabsList>
        </AnimatedTabs>
      )

      expect(
        screen.getByRole('tab').querySelector('[aria-hidden]')
      ).toHaveClass('bg-primary')
    })
  })

  describe('value', () => {
    it('reports changes', async () => {
      const user = userEvent.setup()
      const onValueChange = vi.fn()
      renderTabs({ onValueChange })

      await user.click(screen.getByRole('tab', { name: 'Activity' }))

      expect(onValueChange).toHaveBeenCalledWith('activity', expect.anything())
    })

    it('stays where a controlling parent puts it', async () => {
      const user = userEvent.setup()
      renderTabs({ value: 'overview', defaultValue: undefined })

      await user.click(screen.getByRole('tab', { name: 'Activity' }))

      // The parent did not move it, so neither does the component.
      expect(screen.getByText('Overview panel')).toBeInTheDocument()
    })
  })

  describe('composition', () => {
    it('refuses to render a trigger outside an AnimatedTabs, where it has no pill to share', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() =>
        render(<AnimatedTabsTrigger value="one">One</AnimatedTabsTrigger>)
      ).toThrow('AnimatedTabsTrigger must be used within an AnimatedTabs')

      error.mockRestore()
    })

    it('merges className on every part', () => {
      render(
        <AnimatedTabs defaultValue="one" className="max-w-sm">
          <AnimatedTabsList className="w-full">
            <AnimatedTabsTrigger value="one" className="flex-1">
              One
            </AnimatedTabsTrigger>
          </AnimatedTabsList>
          <AnimatedTabsContent value="one" className="pt-6">
            Panel
          </AnimatedTabsContent>
        </AnimatedTabs>
      )

      expect(screen.getByRole('tablist')).toHaveClass('w-full', 'rounded-full')
      expect(screen.getByRole('tab')).toHaveClass('flex-1', 'rounded-full')
      expect(screen.getByRole('tabpanel')).toHaveClass('pt-6', 'mt-3')
    })
  })
})
