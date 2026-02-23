import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "./dialog"

describe("Dialog", () => {
  it("renders trigger correctly", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
      </Dialog>
    )
    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument()
  })

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description text</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Dialog Title")).toBeInTheDocument()
    expect(screen.getByText("Dialog description text")).toBeInTheDocument()
  })

  it("closes dialog when close button is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("closes dialog when escape key is pressed", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("applies custom className to content", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-content">
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByRole("dialog")).toHaveClass("custom-content")
  })

  it("renders header and footer correctly", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose>Confirm</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(screen.getByText("Dialog Title")).toBeInTheDocument()
    expect(screen.getByText("Dialog description")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
  })

  it("handles controlled state", async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()

    const ControlledDialog = () => {
      const [open, setOpen] = React.useState(false)

      return (
        <Dialog open={open} onOpenChange={(newOpen) => {
          setOpen(newOpen)
          onOpenChange(newOpen)
        }}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      )
    }

    render(<ControlledDialog />)

    await user.click(screen.getByRole("button", { name: "Open Dialog" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Dialog>
        <DialogTrigger ref={ref}>Open Dialog</DialogTrigger>
      </Dialog>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
