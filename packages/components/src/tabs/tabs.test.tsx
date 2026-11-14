import * as React from 'react'
import { vi } from 'vitest'
import { AgentProvider, createAgent, isAgentChange } from '../agent'
import { agentConformance } from '../test/agent-conformance'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

describe('Tabs', () => {
  it('renders tabs correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('switches tabs when clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    await user.click(screen.getByText('Tab 2'))

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    )

    const firstTab = screen.getByText('Tab 1')
    firstTab.focus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Tab 2')).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Tab 3')).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('Tab 2')).toHaveFocus()
  })

  it('handles disabled tabs', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const disabledTab = screen.getByText('Tab 2')
    expect(disabledTab).toHaveAttribute('aria-disabled', 'true')
    expect(disabledTab).toHaveAttribute('data-disabled')
  })

  it('applies custom className', () => {
    render(
      <Tabs className="custom-tabs" defaultValue="tab1">
        <TabsList className="custom-list">
          <TabsTrigger className="custom-trigger" value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent className="custom-content" value="tab1">Content 1</TabsContent>
      </Tabs>
    )

    const tabsRoot = screen.getByText('Tab 1').closest('[class*="custom-tabs"]')
    const tabsList = screen.getByText('Tab 1').closest('[class*="custom-list"]')
    const tabTrigger = screen.getByText('Tab 1')
    const tabContent = screen.getByText('Content 1')

    expect(tabsRoot).toBeInTheDocument()
    expect(tabsList).toBeInTheDocument()
    expect(tabTrigger.className).toContain('custom-trigger')
    expect(tabContent.className).toContain('custom-content')
  })

  it('supports controlled mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    
    render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    await user.click(screen.getByText('Tab 2'))
    
    expect(onValueChange).toHaveBeenCalledWith('tab2', expect.any(Object))
  })
}) 
function Settings(props: Partial<React.ComponentProps<typeof Tabs>> & { disabled?: boolean }) {
  const { disabled, ...rest } = props
  return (
    <Tabs defaultValue="general" aria-label="Settings" {...rest}>
      <TabsList>
        <TabsTrigger value="general" disabled={disabled}>General</TabsTrigger>
        <TabsTrigger value="billing" disabled={disabled}>Billing</TabsTrigger>
        <TabsTrigger value="team" disabled>Team</TabsTrigger>
      </TabsList>
      <TabsContent value="general">General settings</TabsContent>
      <TabsContent value="billing">Billing settings</TabsContent>
      <TabsContent value="team">Team settings</TabsContent>
    </Tabs>
  )
}

agentConformance({
  name: 'Tabs',
  label: 'Settings',
  render: ({ onChange, disabled }) => <Settings onValueChange={onChange} disabled={disabled} />,
  entry: { component: 'tabs', value: 'General', items: ['General', 'Billing', 'Team'], actions: ['select'] },
  act: { action: 'select', args: ['Billing'], result: { value: 'Billing' } },
  invalid: { action: 'select', args: ['Danger'], lists: ['General', 'Billing', 'Team'] },
  person: async (user) => user.click(screen.getByRole('tab', { name: 'Billing' })),
  commits: 2,
})

describe('Tabs: agent', () => {
  function mount(ui: React.ReactElement = <Settings />) {
    const agent = createAgent()
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
    const select = (wanted: unknown) => agent.act({ steps: [{ ref: 'Settings', action: 'select', args: [wanted] }] })
    return { agent, select }
  }

  it('lists the tabs once, as one control', () => {
    const { agent } = mount()
    expect(agent.snapshot().map((c) => c.component)).toEqual(['tabs'])
  })

  it('selects by label and by value, and shows the panel', async () => {
    const { select } = mount()
    expect((await select('billing')).steps[0]?.value).toBe('Billing')
    expect(screen.getByText('Billing settings')).toBeInTheDocument()
    expect((await select('general')).steps[0]?.value).toBe('General')
  })

  it('refuses a disabled tab', async () => {
    const { select } = mount()
    expect((await select('Team')).error?.message).toMatch(/disabled/)
    expect(screen.getByText('General settings')).toBeInTheDocument()
  })

  it('stays put when the app refuses', async () => {
    const onValueChange = vi.fn((_: unknown, details: { cancel(): void }) => details.cancel())
    const { select } = mount(<Settings onValueChange={onValueChange} />)
    expect((await select('Billing')).error?.message).toMatch(/refused/)
    expect(isAgentChange(onValueChange.mock.calls[0][1])).toBe(true)
    expect(screen.getByText('General settings')).toBeInTheDocument()
  })

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = React.useState<unknown>('general')
      return <Settings value={value} onValueChange={setValue} />
    }
    const { select } = mount(<Controlled />)
    expect((await select('Billing')).steps[0]?.value).toBe('Billing')
    expect(screen.getByText('Billing settings')).toBeInTheDocument()
  })
})
