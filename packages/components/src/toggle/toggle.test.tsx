import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { Toggle } from "./toggle"

describe("Toggle", () => {
  it("renders correctly", () => {
    render(<Toggle aria-label="Toggle feature">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveTextContent("Toggle")
  })

  it("applies variant classes correctly", () => {
    render(<Toggle variant="outline" aria-label="Outline toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("border", "border-input", "bg-transparent")
  })

  it("applies default variant classes correctly", () => {
    render(<Toggle variant="default" aria-label="Default toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("bg-transparent")
  })

  it("applies size classes correctly", () => {
    const { rerender } = render(<Toggle size="sm" aria-label="Small toggle">Small</Toggle>)
    expect(screen.getByRole("button")).toHaveClass("h-9", "px-2.5", "text-xs")

    rerender(<Toggle size="default" aria-label="Default toggle">Default</Toggle>)
    expect(screen.getByRole("button")).toHaveClass("h-10", "px-3")

    rerender(<Toggle size="lg" aria-label="Large toggle">Large</Toggle>)
    expect(screen.getByRole("button")).toHaveClass("h-11", "px-5")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Toggle ref={ref} aria-label="Toggle with ref">Toggle</Toggle>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("applies custom className", () => {
    render(<Toggle className="custom-class" aria-label="Custom toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("custom-class")
  })

  it("handles click events and toggles pressed state", async () => {
    const user = userEvent.setup()
    
    render(<Toggle aria-label="Clickable toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    
    // Initially not pressed
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    
    // Click to press
    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-pressed", "true")
    
    // Click again to unpress
    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  it("handles controlled pressed state", () => {
    const onPressedChange = vi.fn()
    
    render(
      <Toggle 
        pressed={true} 
        onPressedChange={onPressedChange}
        aria-label="Controlled toggle"
      >
        Controlled Toggle
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveAttribute("aria-pressed", "true")
  })

  it("calls onPressedChange when state changes", async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    
    render(
      <Toggle 
        onPressedChange={onPressedChange}
        aria-label="Toggle with handler"
      >
        Toggle
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    await user.click(toggle)
    
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it("supports defaultPressed prop", () => {
    render(
      <Toggle 
        defaultPressed={true}
        aria-label="Default pressed toggle"
      >
        Default Pressed
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveAttribute("aria-pressed", "true")
  })

  it("can be disabled", () => {
    render(<Toggle disabled aria-label="Disabled toggle">Disabled</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toBeDisabled()
    expect(toggle).toHaveClass("disabled:opacity-50")
  })

  it("handles keyboard interaction", async () => {
    const user = userEvent.setup()
    
    render(<Toggle aria-label="Keyboard toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    toggle.focus()
    
    // Space key should toggle
    await user.keyboard(" ")
    expect(toggle).toHaveAttribute("aria-pressed", "true")
    
    // Enter key should also toggle
    await user.keyboard("{Enter}")
    expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  it("applies improved focus-visible styles", () => {
    render(<Toggle aria-label="Focusable toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("focus-visible:outline-none", "focus-visible:ring-2", "focus-visible:ring-ring", "focus-visible:ring-offset-2")
  })

  it("applies pressed state styling with data attributes", () => {
    render(
      <Toggle 
        defaultPressed={true}
        aria-label="Pressed toggle"
      >
        Pressed
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("data-[state=on]:bg-accent", "data-[state=on]:text-accent-foreground")
    expect(toggle).toHaveClass("data-[pressed]:bg-accent", "data-[pressed]:text-accent-foreground")
  })

  it("applies improved transition styles", () => {
    render(<Toggle aria-label="Transition toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("transition-all", "duration-200", "ease-in-out")
  })

  it("applies disabled state styling with data attributes", () => {
    render(<Toggle disabled aria-label="Disabled toggle">Disabled</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("data-[disabled]:pointer-events-none", "data-[disabled]:opacity-50")
  })

  it("applies outline variant pressed state styling", () => {
    render(
      <Toggle 
        variant="outline"
        defaultPressed={true}
        aria-label="Pressed outline toggle"
      >
        Pressed Outline
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass(
      "data-[state=on]:bg-accent", 
      "data-[state=on]:text-accent-foreground", 
      "data-[state=on]:border-accent"
    )
  })

  it("applies hover state styling for default variant", () => {
    render(<Toggle variant="default" aria-label="Hoverable toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("hover:bg-muted", "hover:text-muted-foreground")
  })

  it("applies hover state styling for outline variant", () => {
    render(<Toggle variant="outline" aria-label="Hoverable outline toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("hover:bg-accent", "hover:text-accent-foreground", "hover:border-accent")
  })

  it("applies pressed hover state styling", () => {
    render(
      <Toggle 
        defaultPressed={true}
        aria-label="Pressed hoverable toggle"
      >
        Pressed Hoverable
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("data-[state=on]:hover:bg-accent/90", "data-[pressed]:hover:bg-accent/90")
  })

  it("applies disabled pressed state styling", () => {
    render(
      <Toggle 
        disabled
        defaultPressed={true}
        aria-label="Disabled pressed toggle"
      >
        Disabled Pressed
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("data-[state=on]:data-[disabled]:bg-accent/50")
  })

  it("combines variant and size classes correctly", () => {
    render(
      <Toggle 
        variant="outline" 
        size="lg"
        aria-label="Large outline toggle"
      >
        Large Outline
      </Toggle>
    )
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("border", "border-input", "h-11", "px-5")
  })

  it("passes through aria-label correctly", () => {
    render(<Toggle aria-label="Accessible toggle">Toggle</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveAttribute("aria-label", "Accessible toggle")
  })

  it("supports additional props correctly", () => {
    render(
      <Toggle 
        data-testid="toggle-with-props"
        aria-label="Toggle with extra props"
        title="Toggle button"
      >
        Toggle
      </Toggle>
    )
    
    const toggle = screen.getByTestId("toggle-with-props")
    expect(toggle).toHaveAttribute("title", "Toggle button")
    expect(toggle).toHaveAttribute("aria-label", "Toggle with extra props")
  })

  it("applies small size text styling", () => {
    render(<Toggle size="sm" aria-label="Small text toggle">Small</Toggle>)
    
    const toggle = screen.getByRole("button")
    expect(toggle).toHaveClass("text-xs")
  })

  it("exports ToggleProps interface correctly", () => {
    // This test ensures the ToggleProps interface is properly exported
    // TypeScript will catch any issues with the interface
    const props: import("./toggle").ToggleProps = {
      variant: "outline",
      size: "lg",
      "aria-label": "Test toggle",
    }
    
    render(<Toggle {...props}>Test</Toggle>)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
}) 