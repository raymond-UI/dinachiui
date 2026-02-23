import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./alert-dialog"

describe("AlertDialog", () => {
  it("renders trigger and opens dialog when clicked", async () => {
    const user = userEvent.setup()

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    const trigger = screen.getByRole("button", { name: "Open Dialog" })
    expect(trigger).toBeInTheDocument()

    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()

    await user.click(trigger)

    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  it("closes dialog when cancel button is clicked", async () => {
    const user = userEvent.setup()

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
  })

  it("closes dialog when action button is clicked", async () => {
    const user = userEvent.setup()

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Continue" }))
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
  })

  it("handles keyboard navigation with Escape key", async () => {
    const user = userEvent.setup()

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
  })

  it("applies custom className to content", async () => {
    const user = userEvent.setup()

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent className="custom-content">
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByRole("alertdialog")).toHaveClass("custom-content")
  })

  it("supports controlled state", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    const ControlledDialog = () => {
      const [open, setOpen] = React.useState(false)

      return (
        <AlertDialog open={open} onOpenChange={(newOpen) => {
          setOpen(newOpen)
          onOpenChange(newOpen)
        }}>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    render(<ControlledDialog />)

    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByText("Are you sure?")).toBeInTheDocument()
  })

  it("forwards refs correctly", () => {
    const triggerRef = React.createRef<HTMLButtonElement>()

    render(
      <AlertDialog>
        <AlertDialogTrigger ref={triggerRef}>Open Dialog</AlertDialogTrigger>
      </AlertDialog>
    )

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement)
  })
})
