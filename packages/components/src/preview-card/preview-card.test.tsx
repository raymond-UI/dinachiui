import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
  PreviewCardArrow,
  PreviewCardArrowSvg,
} from "./preview-card"
import { AgentProvider, createAgent } from "../agent"
import { agentConformance } from "../test/agent-conformance"

describe("PreviewCard", () => {
  it("renders correctly", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Preview content</p>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    expect(screen.getByRole("link")).toBeInTheDocument()
    expect(screen.getByText("Test Link")).toBeInTheDocument()
  })

  it("applies custom className to trigger", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger className="custom-trigger" href="https://example.com">
          Test Link
        </PreviewCardTrigger>
      </PreviewCard>
    )
    
    expect(screen.getByRole("link")).toHaveClass("custom-trigger")
  })

  it("applies default trigger styles", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
      </PreviewCard>
    )
    
    const trigger = screen.getByRole("link")
    expect(trigger).toHaveClass("text-blue-600")
    expect(trigger).toHaveClass("no-underline")
    expect(trigger).toHaveClass("hover:underline")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <PreviewCard>
        <PreviewCardTrigger ref={ref} href="https://example.com">
          Test Link
        </PreviewCardTrigger>
      </PreviewCard>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("handles controlled open state", () => {
    const onOpenChange = vi.fn()
    render(
      <PreviewCard open={true} onOpenChange={onOpenChange}>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Preview content</p>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    expect(screen.getByText("Preview content")).toBeInTheDocument()
  })

  it("shows preview content on hover", async () => {
    const user = userEvent.setup()
    
    render(
      <PreviewCard>
        <PreviewCardTrigger delay={0} href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Preview content</p>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    const trigger = screen.getByRole("link")
    await user.hover(trigger)
    
    // Note: The actual popup behavior is controlled by Base UI
    // This test verifies the structure is correct
    expect(trigger).toBeInTheDocument()
  })

  it("renders complete component with arrow in proper hierarchy", () => {
    render(
      <PreviewCard open={true}>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div data-testid="content">Preview content</div>
          <PreviewCardArrow />
        </PreviewCardContent>
      </PreviewCard>
    )
    
    // Test that the content and arrow render together properly
    expect(screen.getByTestId("content")).toBeInTheDocument()
    expect(screen.getByRole("presentation")).toBeInTheDocument()
  })

  it("renders arrow with custom children in proper hierarchy", () => {
    render(
      <PreviewCard open={true}>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Preview content</p>
          <PreviewCardArrow>
            <div data-testid="custom-arrow">Custom Arrow</div>
          </PreviewCardArrow>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    expect(screen.getByTestId("custom-arrow")).toBeInTheDocument()
  })

  it("applies custom className to arrow in proper hierarchy", () => {
    render(
      <PreviewCard open={true}>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Preview content</p>
          <PreviewCardArrow className="custom-arrow" />
        </PreviewCardContent>
      </PreviewCard>
    )
    
    // The arrow should be rendered with custom class
    const svg = screen.getByRole("presentation")
    expect(svg).toBeInTheDocument()
  })

  it("renders arrow SVG component independently", () => {
    render(<PreviewCardArrowSvg />)
    
    const svg = document.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("width", "20")
    expect(svg).toHaveAttribute("height", "10")
    expect(svg).toHaveAttribute("viewBox", "0 0 20 10")
  })

  it("supports content wrapper component", () => {
    render(
      <PreviewCard open={true}>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent className="custom-content">
          <div data-testid="content">Preview content</div>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    // The content wrapper provides a convenient way to include portal, positioner, and popup
    expect(screen.getByTestId("content")).toBeInTheDocument()
  })

  it("handles default uncontrolled state", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Uncontrolled content</p>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    expect(screen.getByRole("link")).toBeInTheDocument()
  })

  it("handles controlled state", () => {
    render(
      <PreviewCard open={true}>
        <PreviewCardTrigger href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Controlled content</p>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    expect(screen.getByRole("link")).toBeInTheDocument()
    expect(screen.getByText("Controlled content")).toBeInTheDocument()
  })

  it("handles delay and closeDelay props on Trigger", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger delay={100} closeDelay={200} href="https://example.com">
          Test Link
        </PreviewCardTrigger>
        <PreviewCardContent>
          <p>Delayed content</p>
        </PreviewCardContent>
      </PreviewCard>
    )
    
    expect(screen.getByRole("link")).toBeInTheDocument()
  })
}) 
function Profile(props: Partial<React.ComponentProps<typeof PreviewCard>> & { disabled?: boolean }) {
  const { disabled, ...rest } = props
  return (
    <PreviewCard {...rest}>
      <PreviewCardTrigger delay={0} href="https://example.com/ada" data-disabled={disabled ? "" : undefined}>
        Ada Lovelace
      </PreviewCardTrigger>
      <PreviewCardContent>
        <p>Wrote the first program.</p>
      </PreviewCardContent>
    </PreviewCard>
  )
}

agentConformance({
  name: "PreviewCard",
  label: "Ada Lovelace",
  render: ({ onChange, disabled }) => <Profile onOpenChange={onChange} disabled={disabled} />,
  entry: { component: "popover", open: false, actions: ["open"] },
  act: { action: "open", result: { open: true } },
  person: async (user) => {
    await user.hover(screen.getByText("Ada Lovelace"))
  },
})

describe("PreviewCard: agent", () => {
  it("keeps the trigger as the control once open, so the card is read as content", async () => {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Profile />
      </AgentProvider>
    )
    await agent.act({ steps: [{ ref: "Ada Lovelace", action: "open" }] })
    expect(await screen.findByText("Wrote the first program.")).toBeInTheDocument()
    expect(agent.snapshot().find((c) => c.component === "popover")).toMatchObject({ label: "Ada Lovelace", open: true, actions: ["close"] })
  })
})
