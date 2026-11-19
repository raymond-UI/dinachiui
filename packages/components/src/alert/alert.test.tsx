import * as React from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { AgentProvider, createAgent } from "../agent"
import { agentConformance } from "../test/agent-conformance"
import {
  Alert,
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertDismiss,
  AlertIcon,
  AlertTitle,
  type AlertProps,
} from "./alert"

function Floor({
  dismissible = true,
  disabled,
  onRaise,
  ...props
}: AlertProps & { dismissible?: boolean; disabled?: boolean; onRaise?: () => void }) {
  return (
    <Alert variant="warning" {...props}>
      <AlertIcon />
      <AlertContent>
        <AlertTitle>Room is under your floor</AlertTitle>
        <AlertDescription>The rate on Wednesday is below the floor.</AlertDescription>
      </AlertContent>
      <AlertAction onClick={onRaise}>Raise rate</AlertAction>
      {dismissible && <AlertDismiss disabled={disabled} />}
    </Alert>
  )
}

describe("Alert", () => {
  it("renders every part with its data-slot", () => {
    const { container } = render(<Floor />)
    for (const slot of ["alert", "alert-icon", "alert-content", "alert-title", "alert-description", "alert-action", "alert-dismiss"]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
  })

  it.each([
    ["default", "status"],
    ["info", "status"],
    ["success", "status"],
    ["warning", "alert"],
    ["destructive", "alert"],
  ] as const)("a %s alert has role %s", (variant, role) => {
    render(
      <Alert variant={variant}>
        <AlertDescription>Message</AlertDescription>
      </Alert>
    )
    expect(screen.getByRole(role)).toHaveAttribute("data-variant", variant)
  })

  it("defaults to the default variant and lets role be overridden", () => {
    render(
      <Alert role="note">
        <AlertDescription>Message</AlertDescription>
      </Alert>
    )
    expect(screen.getByRole("note")).toHaveAttribute("data-variant", "default")
  })

  it("hides the icon from assistive tech and accepts a custom one", () => {
    render(
      <Alert>
        <AlertIcon>
          <svg data-testid="custom" />
        </AlertIcon>
        <AlertDescription>Message</AlertDescription>
      </Alert>
    )
    expect(screen.getByTestId("custom").parentElement).toHaveAttribute("aria-hidden", "true")
  })

  it("names the dismiss button and removes the alert when pressed", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Floor onOpenChange={onOpenChange} />)
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: "close-press" }))
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
  })

  it("gives the dismiss a 44px target on phones without growing the button", () => {
    render(<Floor />)
    const dismiss = screen.getByRole("button", { name: "Dismiss" })
    expect(dismiss).toHaveClass("max-sm:h-9", "max-sm:w-9", "relative", "max-sm:after:absolute", "max-sm:after:-inset-1")
  })

  it("darkens a destructive action a touch, and only that one", () => {
    const mixed = "bg-[color:color-mix(in_oklab,var(--destructive)_94%,black)]"
    const { rerender } = render(<Floor variant="destructive" />)
    const action = screen.getByRole("button", { name: "Raise rate" })
    expect(action.className).toContain(mixed)
    expect(action).not.toHaveClass("bg-destructive")
    rerender(<Floor variant="warning" />)
    expect(screen.getByRole("button", { name: "Raise rate" }).className).not.toContain(mixed)
  })

  it("stays when the dismiss is canceled", async () => {
    const user = userEvent.setup()
    render(<Floor onOpenChange={(_, details) => details.cancel()} />)
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    await act(async () => {})
    expect(screen.getByRole("alert")).not.toHaveAttribute("data-ending-style")
  })

  it("follows a controlled open, playing its exit before unmounting", async () => {
    const { rerender } = render(<Floor open />)
    expect(screen.getByRole("alert")).toBeInTheDocument()
    rerender(<Floor open={false} />)
    expect(screen.getByRole("alert")).toHaveAttribute("data-ending-style")
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
    rerender(<Floor open />)
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("starts dismissed with defaultOpen false", () => {
    render(<Floor defaultOpen={false} />)
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("runs the action without dismissing", async () => {
    const user = userEvent.setup()
    const onRaise = vi.fn()
    render(<Floor onRaise={onRaise} />)
    await user.click(screen.getByRole("button", { name: "Raise rate" }))
    expect(onRaise).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("does not replay its entrance on re-render", async () => {
    const { rerender } = render(<Floor />)
    const el = screen.getByRole("alert")
    await waitFor(() => expect(el).not.toHaveAttribute("data-starting-style"))
    rerender(<Floor className="mt-2" />)
    expect(el).not.toHaveAttribute("data-starting-style")
  })

  it("animates in when a server-rendered alert that started closed opens later", () => {
    const html = renderToString(<Floor open={false} />)
    const container = document.createElement("div")
    container.innerHTML = html
    document.body.appendChild(container)
    let root!: ReturnType<typeof hydrateRoot>
    act(() => {
      root = hydrateRoot(container, <Floor open={false} />)
    })
    act(() => root.render(<Floor open />))
    expect(screen.getByRole("alert")).toHaveAttribute("data-starting-style")
    act(() => root.unmount())
    container.remove()
  })

  it("skips the entrance for an alert in the server-rendered page", () => {
    const container = document.createElement("div")
    container.innerHTML = renderToString(<Floor />)
    document.body.appendChild(container)
    let root!: ReturnType<typeof hydrateRoot>
    act(() => {
      root = hydrateRoot(container, <Floor />)
    })
    expect(screen.getByRole("alert")).not.toHaveAttribute("data-starting-style")
    act(() => root.unmount())
    container.remove()
  })

  it("moves focus to the next control when the focused dismiss closes it", async () => {
    const user = userEvent.setup()
    render(
      <>
        <button>Before</button>
        <Floor />
        <button>After</button>
      </>
    )
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus()
  })

  it("falls back to the control before it when nothing follows", async () => {
    const user = userEvent.setup()
    render(
      <>
        <button>Before</button>
        <Floor />
      </>
    )
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus()
  })

  it("reports one change when dismiss is pressed again during the exit", () => {
    const onOpenChange = vi.fn()
    render(<Floor onOpenChange={onOpenChange} />)
    const dismiss = screen.getByRole("button", { name: "Dismiss" })
    fireEvent.click(dismiss)
    expect(screen.getByRole("alert")).toHaveAttribute("data-ending-style")
    fireEvent.click(dismiss)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })

  it("throws a clear error for a part outside Alert", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<AlertTitle>Alone</AlertTitle>)).toThrow("AlertTitle must be used inside Alert.")
    spy.mockRestore()
  })
})

agentConformance({
  name: "Alert",
  label: "Room is under your floor",
  // An app can hold the whole alert back from the agent with data-disabled.
  render: ({ onChange, disabled }) => <Floor onOpenChange={onChange} data-disabled={disabled || undefined} />,
  entry: {
    component: "alert",
    value: "The rate on Wednesday is below the floor.",
    type: "warning",
    actions: ["dismiss"],
  },
  act: { action: "dismiss", result: { ok: true } },
  person: async (user) => {
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
  },
})

describe("Alert: agent", () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent()
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>)
    return agent
  }

  it("lists its action as a button in the alert, and its dismiss button only through the alert", () => {
    const agent = mount(<Floor />)
    const snapshot = agent.snapshot()
    expect(snapshot).toContainEqual(
      expect.objectContaining({ component: "button", label: "Raise rate", in: "Room is under your floor" })
    )
    expect(snapshot.some((c) => c.label === "Dismiss")).toBe(false)
  })

  it("presses the action", async () => {
    const onRaise = vi.fn()
    const agent = mount(<Floor onRaise={onRaise} />)
    expect(await agent.act({ steps: [{ ref: "Raise rate", action: "press" }] })).toMatchObject({ ok: true })
    expect(onRaise).toHaveBeenCalledTimes(1)
  })

  it("offers no dismiss when there is no AlertDismiss", () => {
    const agent = mount(<Floor dismissible={false} />)
    expect(agent.snapshot().find((c) => c.component === "alert")).toMatchObject({ actions: [] })
  })

  it("withholds dismiss when AlertDismiss is disabled, without disabling the alert", () => {
    const agent = mount(<Floor disabled />)
    const entry = agent.snapshot().find((c) => c.component === "alert")
    expect(entry).toMatchObject({ actions: [] })
    expect(entry).not.toHaveProperty("disabled")
  })

  it("reports as an alert, so an agent can tell it from a toast", () => {
    const agent = mount(<Floor />)
    const entry = agent.snapshot().find((c) => c.label === "Room is under your floor")
    expect(entry).toMatchObject({ component: "alert", type: "warning" })
  })

  it("is named by its description when it has no title", () => {
    const agent = mount(
      <Alert variant="info">
        <AlertDescription>Rates sync every 15 minutes</AlertDescription>
      </Alert>
    )
    const entry = agent.snapshot().find((c) => c.component === "alert")
    expect(entry).toMatchObject({ label: "Rates sync every 15 minutes", type: "info" })
    expect(entry).not.toHaveProperty("value")
  })

  it("leaves the snapshot once dismissed", async () => {
    const agent = mount(<Floor />)
    await agent.act({ steps: [{ ref: "Room is under your floor", action: "dismiss" }] })
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
    expect(agent.snapshot().some((c) => c.component === "alert")).toBe(false)
  })
})
