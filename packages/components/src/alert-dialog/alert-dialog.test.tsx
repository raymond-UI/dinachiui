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
import { AgentProvider, createAgent, isAgentChange } from "../agent"
import { agentConformance } from "../test/agent-conformance"

describe("AlertDialog", () => {
  it("exports the centred content and its viewport from the barrel", async () => {
    const barrel = await import("./index")
    expect(barrel.AlertDialogContent).toBeDefined()
    expect(barrel.AlertDialogViewport).toBeDefined()
  })

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

function DeleteProject(props: Partial<React.ComponentProps<typeof AlertDialog>> & { disabled?: boolean }) {
  const { disabled, ...rest } = props
  return (
    <AlertDialog {...rest}>
      <AlertDialogTrigger disabled={disabled}>Delete project</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

agentConformance({
  name: "AlertDialog",
  label: "Delete project",
  render: ({ onChange, disabled }) => <DeleteProject onOpenChange={onChange} disabled={disabled} />,
  entry: { component: "dialog", open: false, actions: ["open"] },
  act: { action: "open", result: { open: true } },
  person: async (user) => {
    await user.click(screen.getByRole("button", { name: "Delete project" }))
  },
})

describe("AlertDialog: agent", () => {
  function mount(props: Partial<React.ComponentProps<typeof AlertDialog>> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <DeleteProject {...props} />
      </AgentProvider>
    )
    return agent
  }

  it("names the open dialog by its title, and needs approval for presses inside but not to close", async () => {
    const agent = mount({ defaultOpen: true })
    const entries = agent.snapshot()
    expect(entries[0]).toMatchObject({ component: "dialog", label: "Delete this project?", open: true, actions: ["close"] })
    expect(entries[0].confirm).toBeUndefined()
    expect(entries.find((c) => c.label === "Delete")).toMatchObject({ confirm: expect.any(String), in: "Delete this project?" })
  })

  it("presses Cancel without approval, since it only closes the dialog", async () => {
    const onOpenChange = vi.fn()
    const agent = mount({ defaultOpen: true, onOpenChange })
    expect(agent.snapshot().find((c) => c.label === "Cancel")?.confirm).toBeUndefined()
    const result = await agent.act({ steps: [{ ref: "Cancel", action: "press" }] })
    expect(result.ok).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it("closes through onOpenChange, marked as the agent's", async () => {
    const onOpenChange = vi.fn()
    const agent = mount({ defaultOpen: true, onOpenChange })
    const result = await agent.act({ steps: [{ ref: "Delete this project?", action: "close" }] })
    expect(result.ok).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    expect(isAgentChange(onOpenChange.mock.calls[0][1])).toBe(true)
  })
})
