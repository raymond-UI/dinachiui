import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

describe("Select", () => {
  it("renders correctly", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue>{(value) => value ?? "Select an option"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("opens and closes the select content", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue>{(value) => value ?? "Select an option"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await userEvent.click(trigger)
    expect(screen.getByText("Test")).toBeInTheDocument()

    await userEvent.click(trigger)
    expect(screen.getByRole("listbox", { hidden: true })).toBeInTheDocument()
  })

  it("selects an item", async () => {
    const handleChange = vi.fn()
    render(
      <Select onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue>{(value) => value ?? "Select an option"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await userEvent.click(trigger)
    await screen.findByRole("listbox") // Wait for the listbox to be visible

    const appleItem = screen.getByRole("option", { name: "Apple" })
    await userEvent.click(appleItem)

    expect(handleChange).toHaveBeenCalledWith("apple", expect.anything())
    expect(screen.getByRole("combobox")).toHaveTextContent("apple")
    expect(appleItem).toHaveAttribute("data-selected", "")
  })

  it("forwards ref correctly to trigger", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Select>
        <SelectTrigger ref={ref}>
          <SelectValue>{(value) => value ?? "Select an option"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("handles custom className on trigger", () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger-class">
          <SelectValue>{(value) => value ?? "Select an option"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox")).toHaveClass("custom-trigger-class")
  })
})
