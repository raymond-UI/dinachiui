import { act, render, screen, waitFor } from "@testing-library/react"
import { AgentProvider, createAgent } from "../agent"
import { Toast, useToastManager } from "./toast"

// The real Base UI toast, unlike toast.test.tsx, so the bridge reads what it renders.
function Notify() {
  const manager = useToastManager()
  return (
    <button
      onClick={() =>
        manager.add({
          title: "Saved",
          description: "Your file is saved",
          type: "success",
          actionProps: { children: "Undo" },
        })
      }
    >
      Save
    </button>
  )
}

function mount() {
  const agent = createAgent()
  render(
    <AgentProvider agent={agent}>
      <Toast>
        <Notify />
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
})
