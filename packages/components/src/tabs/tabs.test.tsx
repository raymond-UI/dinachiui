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