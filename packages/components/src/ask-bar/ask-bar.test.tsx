import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import {
  AskBar,
  AskBarContent,
  AskBarTrigger,
  type AskBarProps,
  type AskPlan,
} from "./ask-bar"
import type { CommandItem } from "../command-palette"
import { AgentProvider, createAgent, isAgentChange, type AgentOptions } from "../agent"
import { agentConformance } from "../test/agent-conformance"

const undo = vi.fn()
const runPlan = vi.fn((v: Record<string, string>) => ({ message: `Raised by ${v.pct}%`, undo }))

const raise: AskPlan = {
  title: "Raise prices",
  sentence: ["Raise ", { field: "what" }, " by ", { field: "pct" }, "%."],
  fields: [
    { id: "what", label: "Items", value: "all items", fixed: true },
    { id: "pct", label: "Change %", value: "10", inputMode: "decimal" },
  ],
  touches: "12 items in 3 groups.",
  call: "prices.adjust(0.1)",
  verb: (v) => `Raise 12 prices by ${v.pct}%`,
  run: runPlan,
}

const commands: CommandItem[] = [
  { id: "orders", label: "Orders", group: "Pages" },
  { id: "export", label: "Export orders", group: "Actions", actions: [{ id: "csv", label: "CSV" }] },
]

const resolve = (q: string) => (q.startsWith("raise") ? raise : null)

function Bar(props: Partial<AskBarProps>) {
  return (
    <AskBar resolve={resolve} commands={commands} suggestions={["raise prices 10%", "close the shop"]} {...props}>
      <AskBarTrigger />
      <AskBarContent />
    </AskBar>
  )
}

const field = () => screen.getByRole("combobox", { name: "Ask" })

beforeEach(() => {
  runPlan.mockClear()
  undo.mockClear()
})

describe("AskBar", () => {
  it("is just the field at rest", () => {
    render(<Bar />)
    expect(field()).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "raise prices 10%" })).toBeNull()
    expect(screen.queryByRole("group")).toBeNull()
  })

  it("shows every suggestion on focus, and picking one keeps focus", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.click(field())
    await user.click(screen.getByRole("button", { name: "raise prices 10%" }))
    expect(field()).toHaveFocus()
    expect(field()).toHaveValue("raise prices 10%")
    expect(screen.getByRole("group", { name: "Raise prices" })).toBeInTheDocument()
  })

  it("shows only matching suggestions while typing with suggest=typing", async () => {
    const user = userEvent.setup()
    render(<Bar suggest="typing" resolve={() => null} />)
    await user.click(field())
    expect(screen.queryByRole("button", { name: "close the shop" })).toBeNull()
    await user.type(field(), "clo")
    expect(screen.getByRole("button", { name: "close the shop" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "raise prices 10%" })).toBeNull()
  })

  it("reads the plan back as a sentence with editable values inline", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise")
    const plan = screen.getByRole("group", { name: "Raise prices" })
    expect(plan).toHaveTextContent("Raise all items by %.")
    expect(screen.getByRole("textbox", { name: "Change %" })).toHaveValue("10")
    expect(screen.queryByRole("textbox", { name: "Items" })).toBeNull()
    expect(plan).toHaveTextContent("12 items in 3 groups.")
  })

  it("names the change on the button as fields are edited", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise")
    const pct = screen.getByRole("textbox", { name: "Change %" })
    await user.clear(pct)
    await user.type(pct, "15")
    expect(screen.getByRole("button", { name: "Raise 12 prices by 15%" })).toBeInTheDocument()
  })

  it("reveals the call on request", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise")
    expect(screen.queryByText("prices.adjust(0.1)")).toBeNull()
    await user.click(screen.getByRole("button", { name: "Show call" }))
    expect(screen.getByText("prices.adjust(0.1)")).toBeInTheDocument()
  })

  it("runs on Enter, then shows the done line with Undo", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise{Enter}")
    expect(runPlan).toHaveBeenCalledWith({ what: "all items", pct: "10" })
    expect(await screen.findByRole("status")).toHaveTextContent("Raised by 10%")
    expect(field()).toHaveValue("")
    await user.click(screen.getByRole("button", { name: "Undo" }))
    expect(undo).toHaveBeenCalled()
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("keeps the plan and shows why when the run fails", async () => {
    const user = userEvent.setup()
    const failing = { ...raise, run: () => Promise.reject(new Error("Rates are locked.")) }
    render(<Bar resolve={() => failing} />)
    await user.type(field(), "raise{Enter}")
    expect(await screen.findByRole("alert")).toHaveTextContent("Rates are locked.")
    expect(screen.getByRole("group", { name: "Raise prices" })).toBeInTheDocument()
  })

  it("waits for an async plan before it can run", async () => {
    const user = userEvent.setup()
    let settle!: (plan: AskPlan) => void
    render(<Bar resolve={() => new Promise((r) => (settle = r))} />)
    await user.type(field(), "r")
    expect(screen.queryByRole("group")).toBeNull()
    await act(async () => settle(raise))
    expect(screen.getByRole("button", { name: "Raise 12 prices by 10%" })).toBeEnabled()
  })

  it("falls back to commands when there is no plan", async () => {
    const user = userEvent.setup()
    const onCommand = vi.fn()
    render(<Bar onCommand={onCommand} />)
    await user.type(field(), "orders")
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Orders", "Export orders"])
    await user.keyboard("{ArrowDown}{Enter}")
    expect(onCommand).toHaveBeenCalledWith(commands[1], commands[1].actions![0], expect.anything())
    expect(field()).toHaveValue("")
  })

  it("focuses on Cmd or Ctrl+K, and the shortcut can be turned off", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Bar />)
    await user.keyboard("{Control>}k{/Control}")
    expect(field()).toHaveFocus()
    unmount()
    render(<Bar shortcut={false} />)
    await user.keyboard("{Control>}k{/Control}")
    expect(field()).not.toHaveFocus()
  })

  it("clears and lets go on Escape", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise{Escape}")
    expect(field()).toHaveValue("")
    expect(field()).not.toHaveFocus()
  })

  it("marks its parts", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise")
    for (const slot of ["content", "input", "plan"]) {
      expect(document.querySelector(`[data-slot="ask-bar-${slot}"]`), slot).not.toBeNull()
    }
  })

  describe("on a phone", () => {
    beforeEach(() => {
      vi.spyOn(window, "matchMedia").mockImplementation(
        (query) => ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList
      )
    })
    afterEach(() => vi.restoreAllMocks())

    it("opens from the Ask button, and a suggestion sends on tap", async () => {
      const user = userEvent.setup()
      render(<Bar />)
      expect(screen.queryByRole("combobox")).toBeNull()
      await user.click(screen.getByRole("button", { name: "Ask" }))
      await user.click(await screen.findByRole("button", { name: "raise prices 10%" }))
      const plan = await screen.findByRole("group", { name: "Raise prices" })
      await waitFor(() => expect(plan).toHaveFocus())
      expect(screen.queryByRole("combobox")).toBeNull()
      expect(screen.getByRole("textbox", { name: "Change %" })).toBeInTheDocument()
      await user.click(screen.getByRole("button", { name: /Edit/ }))
      expect(await screen.findByRole("combobox")).toHaveValue("raise prices 10%")
    })
  })

  describe("agent", () => {
    function mount(props: Partial<AskBarProps> = {}, options: AgentOptions = {}) {
      const agent = createAgent(options)
      render(
        <AgentProvider agent={agent}>
          <Bar {...props} />
        </AgentProvider>
      )
      const step = (ref: string, action: string, ...args: unknown[]) => agent.act({ steps: [{ ref, action, args }] })
      return { agent, step }
    }

    it("types a request and reads the plan", async () => {
      const { step } = mount()
      const result = await step("Ask", "search", "raise prices")
      expect(result.steps[0].result).toEqual({
        plan: "Raise prices",
        sentence: "Raise all items by 10%.",
        fields: [
          { label: "Items", value: "all items", fixed: true },
          { label: "Change %", value: "10" },
        ],
        touches: "12 items in 3 groups.",
        call: "prices.adjust(0.1)",
        run: "Raise 12 prices by 10%",
      })
    })

    it("reads the commands when there is no plan, and runs one", async () => {
      const onCommand = vi.fn()
      const { step } = mount({ onCommand })
      const result = await step("Ask", "search", "orders")
      expect(result.steps[0].result).toEqual({ commands: ["Orders", "Export orders"] })
      await step("Ask", "select", "Export orders", "CSV")
      expect(onCommand).toHaveBeenCalledWith(commands[1], commands[1].actions![0], expect.anything())
      expect(isAgentChange(onCommand.mock.calls[0][2])).toBe(true)
    })

    it("never runs without a person's approval", async () => {
      const { agent, step } = mount()
      await step("Ask", "search", "raise prices")
      const button = agent.snapshot().find((c) => c.label === "Raise 12 prices by 10%")!
      expect(button).toMatchObject({ component: "button", approval: "person" })
      const result = await step(button.ref, "press")
      expect(result.ok).toBe(false)
      expect(runPlan).not.toHaveBeenCalled()
    })

    it("edits a field, runs once allowed, and undoes", async () => {
      const allow = vi.fn(() => true)
      const { agent, step } = mount({}, { allow })
      await step("Ask", "search", "raise prices")
      await step("Change %", "setValue", "20")
      const result = await step("Raise 12 prices by 20%", "press")
      expect(allow).toHaveBeenCalled()
      expect(result.steps[0].result).toBe("Raised by 20%")
      await waitFor(() => expect(agent.snapshot().some((c) => c.label === "Undo")).toBe(true))
      await step("Undo", "press")
      expect(undo).toHaveBeenCalled()
    })

    it("runs unasked when confirm is false", async () => {
      const { step } = mount({ confirm: false })
      await step("Ask", "search", "raise prices")
      const result = await step("Raise 12 prices by 10%", "press")
      expect(result.ok).toBe(true)
      expect(runPlan).toHaveBeenCalled()
    })
  })
})

agentConformance({
  name: "AskBar",
  label: "Ask",
  render: ({ onChange, disabled }) => (
    <AskBar resolve={resolve} commands={commands} onValueChange={onChange} disabled={disabled}>
      <AskBarContent />
    </AskBar>
  ),
  entry: { component: "combobox", value: "", actions: ["search", "select"] },
  act: { action: "search", args: ["orders"], result: { result: { commands: ["Orders", "Export orders"] } } },
  invalid: { action: "select", args: ["Nope"], lists: ["Orders", "Export orders"] },
  person: async (user) => {
    await user.type(screen.getByRole("combobox"), "o")
  },
})
