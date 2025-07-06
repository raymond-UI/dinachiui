import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip"

describe("Tooltip", () => {
  it("renders correctly", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Test Trigger</TooltipTrigger>
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    expect(screen.getByRole("button", { name: "Test Trigger" })).toBeInTheDocument()
  })

  it("shows tooltip content on hover", async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Test Trigger</TooltipTrigger>
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    const trigger = screen.getByRole("button", { name: "Test Trigger" })
    await user.hover(trigger)

    expect(await screen.findByText("Tooltip content")).toBeInTheDocument()
  })

  it("handles controlled open state", () => {
    render(
      <TooltipProvider>
        <Tooltip open={true}>
          <TooltipTrigger>Test Trigger</TooltipTrigger>
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    expect(screen.getByText("Tooltip content")).toBeInTheDocument()
  })
})