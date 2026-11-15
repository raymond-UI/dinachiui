import { vi } from "vitest"
import { act, render, screen, waitFor } from "@testing-library/react"
import { AgentProvider, createAgent } from "../agent"
import { Toast, useToastManager } from "./toast"

// The real Base UI toast, unlike toast.test.tsx, so the bridge reads what it renders.
type Options = Parameters<ReturnType<typeof useToastManager>["add"]>[0]

const SAVED: Options = {
  title: "Saved",
  description: "Your file is saved",
  type: "success",
  actionProps: { children: "Undo" },
}

function Notify({ options = SAVED }: { options?: Options }) {
  const manager = useToastManager()
  return <button onClick={() => manager.add(options)}>Save</button>
}

function mount(options?: Options) {
  const agent = createAgent()
  render(
    <AgentProvider agent={agent}>
      <Toast>
        <Notify options={options} />
      </Toast>
    </AgentProvider>
  )
  return agent
}

describe("Toast: agent", () => {
  it("lists a toast with its title, description and type, and its action button", async () => {
    const agent = mount()
    await act(async () => screen.getByText("Save").click())
    await waitFor(() => expect(agent.snapshot().some((c) => c.component === "toast")).toBe(true))
    expect(agent.snapshot()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          component: "toast",
          label: "Saved",
          value: "Your file is saved",
          type: "success",
          actions: ["dismiss"],
        }),
        expect.objectContaining({ component: "button", label: "Undo", in: "Saved" }),
      ])
    )
    expect(agent.snapshot().some((c) => c.label === "Close")).toBe(false)
  })

  it("dismisses the toast through its close button", async () => {
    const agent = mount()
    await act(async () => screen.getByText("Save").click())
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument())
    expect(await agent.act({ steps: [{ ref: "Saved", action: "dismiss" }] })).toMatchObject({ ok: true })
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  it("lists a high-priority toast, which Base UI hides from assistive tech, and lets its buttons be pressed", async () => {
    const onClick = vi.fn()
    const agent = mount({ title: "Payment failed", type: "error", priority: "high", actionProps: { children: "Retry", onClick } })
    await act(async () => screen.getByText("Save").click())
    await waitFor(() => expect(agent.snapshot().some((c) => c.component === "toast")).toBe(true))
    const retry = agent.snapshot().find((c) => c.label === "Retry")
    expect(retry).toMatchObject({ in: "Payment failed" })
    expect(retry).not.toHaveProperty("confirm")
    expect(await agent.act({ steps: [{ ref: "Retry", action: "press" }] })).toMatchObject({ ok: true })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("runs a toast action's onClick once for a person", async () => {
    const onClick = vi.fn()
    mount({ title: "Saved", actionProps: { children: "Undo", onClick } })
    await act(async () => screen.getByText("Save").click())
    await waitFor(() => expect(screen.getByText("Undo")).toBeInTheDocument())
    await act(async () => screen.getByText("Undo").click())
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("names a toast with no title by its kind, and keeps the description as its value", async () => {
    const agent = mount({ description: "Copied", actionProps: { children: "Undo" } })
    await act(async () => screen.getByText("Save").click())
    await waitFor(() => expect(agent.snapshot().some((c) => c.component === "toast")).toBe(true))
    expect(agent.snapshot().find((c) => c.component === "toast")).toMatchObject({ label: "toast", value: "Copied" })
  })
})
