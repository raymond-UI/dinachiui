import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from "./collapsible"

describe("Collapsible", () => {
  it("renders correctly with trigger", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )
    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByText("Trigger")).toBeInTheDocument()
    // Panel content is hidden when closed
    expect(screen.queryByText("Content")).not.toBeInTheDocument()
  })

  it("shows content when defaultOpen is true", () => {
    render(
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("toggles the data-panel-open attribute on click", async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )

    const trigger = screen.getByRole("button")
    expect(trigger).not.toHaveAttribute("data-panel-open")

    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute("data-panel-open")

    await userEvent.click(trigger)
    expect(trigger).not.toHaveAttribute("data-panel-open")
  })

  it("handles controlled state correctly", () => {
    const onOpenChange = vi.fn()
    render(
      <Collapsible open={true} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )

    const trigger = screen.getByRole("button")
    expect(trigger).toHaveAttribute("data-panel-open")
    expect(screen.getByText("Content")).toBeInTheDocument()
  })

  it("calls onOpenChange when clicked", async () => {
    const onOpenChange = vi.fn()
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )

    await userEvent.click(screen.getByRole("button"))
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it("applies defaultOpen correctly", () => {
    render(
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )

    const trigger = screen.getByRole("button")
    expect(trigger).toHaveAttribute("data-panel-open")
  })

  it("handles disabled state correctly", async () => {
    const onOpenChange = vi.fn()
    render(
      <Collapsible disabled onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )

    const trigger = screen.getByRole("button")
    expect(trigger).toHaveAttribute("aria-disabled", "true")
    expect(trigger).toHaveAttribute("data-disabled")

    await userEvent.click(trigger)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("forwards refs to all components", () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const triggerRef = React.createRef<HTMLButtonElement>()
    const panelRef = React.createRef<HTMLDivElement>()

    render(
      <Collapsible ref={rootRef} defaultOpen={true}>
        <CollapsibleTrigger ref={triggerRef}>Trigger</CollapsibleTrigger>
        <CollapsiblePanel ref={panelRef}>Content</CollapsiblePanel>
      </Collapsible>
    )

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
    expect(panelRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it("applies custom classNames to all components", () => {
    render(
      <Collapsible className="custom-root" defaultOpen={true}>
        <CollapsibleTrigger className="custom-trigger">Trigger</CollapsibleTrigger>
        <CollapsiblePanel className="custom-panel">Content</CollapsiblePanel>
      </Collapsible>
    )

    const root = screen.getByRole("button").closest(".custom-root")
    expect(root).toHaveClass("custom-root")
    expect(screen.getByRole("button")).toHaveClass("custom-trigger")
    expect(screen.getByText("Content")).toHaveClass("custom-panel")
  })

  it("applies proper accessibility attributes", () => {
    render(
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )

    const trigger = screen.getByRole("button")
    const panel = screen.getByText("Content")

    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(trigger).toHaveAttribute("aria-controls")
    expect(panel).toHaveAttribute("id")
  })

  it("handles keyboard navigation", async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </Collapsible>
    )

    const trigger = screen.getByRole("button")
    trigger.focus()

    await userEvent.keyboard("{Enter}")
    expect(trigger).toHaveAttribute("data-panel-open")

    await userEvent.keyboard("{Enter}")
    expect(trigger).not.toHaveAttribute("data-panel-open")
  })
})
