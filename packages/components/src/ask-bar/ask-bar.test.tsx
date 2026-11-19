import * as React from "react"
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
import { filterCommands, type CommandItem } from "../command-items"
import { AgentProvider, createAgent, isAgentChange, type AgentOptions } from "../agent"
import { agentConformance } from "../test/agent-conformance"

vi.mock("../command-items", async (original) => {
  const actual = await original<typeof import("../command-items")>()
  return { ...actual, filterCommands: vi.fn(actual.filterCommands) }
})

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
    expect(screen.queryByRole("option", { name: "raise prices 10%" })).toBeNull()
    expect(screen.queryByRole("group")).toBeNull()
  })

  it("shows every suggestion on focus, and picking one keeps focus", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.click(field())
    await user.click(screen.getByRole("option", { name: "raise prices 10%" }))
    expect(field()).toHaveFocus()
    expect(field()).toHaveValue("raise prices 10%")
    expect(screen.getByRole("group", { name: "Raise prices" })).toBeInTheDocument()
  })

  it("shows only matching suggestions while typing with suggest=typing", async () => {
    const user = userEvent.setup()
    render(<Bar suggest="typing" resolve={() => null} />)
    await user.click(field())
    expect(screen.queryByRole("option", { name: "close the shop" })).toBeNull()
    await user.type(field(), "clo")
    expect(screen.getByRole("option", { name: "close the shop" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "raise prices 10%" })).toBeNull()
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
    const done = () => document.querySelector('[data-slot="ask-bar-done"]')
    await waitFor(() => expect(done()).toHaveTextContent("Raised by 10%"))
    expect(field()).toHaveValue("")
    await user.click(screen.getByRole("button", { name: "Undo" }))
    expect(undo).toHaveBeenCalled()
    expect(done()).toBeNull()
  })

  it("moves focus to Undo after a run, and back to the field after undo", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise{Enter}")
    await waitFor(() => expect(screen.getByRole("button", { name: "Undo" })).toHaveFocus())
    await user.keyboard("{Enter}")
    await waitFor(() => expect(field()).toHaveFocus())
  })

  it("keeps the done line and says why when undo fails", async () => {
    const user = userEvent.setup()
    const failing = { ...raise, run: () => ({ message: "Raised", undo: () => Promise.reject(new Error("Too late.")) }) }
    render(<Bar resolve={() => failing} />)
    await user.type(field(), "raise{Enter}")
    await user.click(await screen.findByRole("button", { name: "Undo" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("Too late.")
    expect(document.querySelector('[data-slot="ask-bar-done"]')).toHaveTextContent("Raised")
  })

  it("holds the fields while a run is in flight, and keeps newer text", async () => {
    const user = userEvent.setup()
    let finish!: () => void
    const slow = { ...raise, run: () => new Promise<{ message: string }>((r) => (finish = () => r({ message: "Raised" }))) }
    render(<Bar resolve={(q) => (q ? slow : null)} />)
    await user.type(field(), "raise{Enter}")
    expect(field()).toHaveAttribute("readonly")
    expect(screen.getByRole("textbox", { name: "Change %" })).toHaveAttribute("readonly")
    await act(async () => finish())
    expect(field()).not.toHaveAttribute("readonly")
    expect(field()).toHaveValue("")
  })

  it("announces the settled plan, then the result", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    const live = document.querySelector('[aria-live="polite"]')!
    await user.type(field(), "raise")
    await waitFor(() => expect(live).toHaveTextContent("Raise all items by 10%. Raise 12 prices by 10%"), { timeout: 2000 })
    await user.keyboard("{Enter}")
    await waitFor(() => expect(live).toHaveTextContent("Raised by 10%"))
  })

  it("announces only the plan the text settles on", async () => {
    const user = userEvent.setup()
    const byNumber = (q: string): AskPlan | null => {
      const pct = q.match(/\d+/)?.[0]
      return pct ? { ...raise, fields: [raise.fields[0], { ...raise.fields[1], value: pct }] } : null
    }
    render(<Bar resolve={byNumber} suggestions={[]} />)
    await waitFor(() => expect(document.querySelector('[aria-live="polite"]')).not.toBeNull())
    const live = document.querySelector('[aria-live="polite"]')!
    const heard: string[] = []
    const observer = new MutationObserver(() => heard.push(live.textContent ?? ""))
    observer.observe(live, { childList: true, characterData: true, subtree: true })
    await user.type(field(), "raise by 1")
    await new Promise((r) => setTimeout(r, 150))
    await user.type(field(), "0")
    await waitFor(() => expect(live).toHaveTextContent("by 10%"), { timeout: 2000 })
    await new Promise((r) => setTimeout(r, 800))
    observer.disconnect()
    expect(heard).toEqual(["Raise all items by 10%. Raise 12 prices by 10%"])
  })

  it("speaks from one polite region, and reads the undo there", async () => {
    const user = userEvent.setup()
    const undone = { ...raise, run: () => ({ message: "Raised", undo: () => "Put 12 prices back." }) }
    render(<Bar resolve={() => undone} />)
    await user.type(field(), "raise{Enter}")
    const live = document.querySelectorAll("[aria-live]")
    expect(live).toHaveLength(1)
    await waitFor(() => expect(live[0]).toHaveTextContent("Raised"))
    expect(document.querySelector('[data-slot="ask-bar-done"]')!.closest("[aria-live]")).toBeNull()
    await user.click(screen.getByRole("button", { name: "Undo" }))
    await waitFor(() => expect(live[0]).toHaveTextContent("Put 12 prices back."))
    expect(document.querySelectorAll("[aria-live]")).toHaveLength(1)
  })

  it("says Undone when undo returns no line", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "raise{Enter}")
    await user.click(await screen.findByRole("button", { name: "Undo" }))
    await waitFor(() => expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent("Undone."))
  })

  it("tints the bar's border while focus is inside it, with no ring", () => {
    render(<Bar />)
    const cls = document.querySelector('[data-slot="ask-bar-content"]')!.className
    expect(cls).toMatch(/focus-within:border-muted-foreground/)
    expect(cls).not.toMatch(/ring-ring/)
  })

  it("passes resolve a signal that aborts once the text moves on", async () => {
    const user = userEvent.setup()
    const signals: AbortSignal[] = []
    render(<Bar resolve={(q, { signal }) => (signals.push(signal), resolve(q))} />)
    await user.type(field(), "ra")
    expect(signals).toHaveLength(2)
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
  })

  it("never commits a pending frame for a sync resolver", async () => {
    const user = userEvent.setup()
    const seen: string[] = []
    const busy = () => document.querySelector('[aria-busy="true"]')
    const observer = new MutationObserver((records) => {
      for (const r of records) if ((r.target as Element).getAttribute?.("aria-busy") === "true") seen.push("mutation")
    })
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["aria-busy"] })
    let commits = 0
    render(
      <React.Profiler id="ask" onRender={() => (commits++, busy() && seen.push("commit"))}>
        <Bar />
      </React.Profiler>
    )
    await user.type(field(), "raise prices")
    observer.disconnect()
    expect(commits).toBeGreaterThan(12)
    expect(seen).toEqual([])
    expect(screen.getByRole("button", { name: "Raise 12 prices by 10%" })).toBeEnabled()
  })

  it("shows an async resolver as pending and aborts the call before", async () => {
    const user = userEvent.setup()
    const calls: { signal: AbortSignal; settle: (plan: AskPlan) => void }[] = []
    render(<Bar resolve={(_, { signal }) => new Promise((r) => calls.push({ signal, settle: r }))} />)
    await user.type(field(), "r")
    await act(async () => calls[0].settle(raise))
    const group = screen.getByRole("group", { name: "Raise prices" })
    expect(group).not.toHaveAttribute("aria-busy")
    await user.type(field(), "a")
    expect(group).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("button", { name: "Raise 12 prices by 10%" })).toBeDisabled()
    expect(calls[0].signal.aborted).toBe(true)
    expect(calls[1].signal.aborted).toBe(false)
    await act(async () => calls[1].settle(raise))
    expect(group).not.toHaveAttribute("aria-busy")
  })

  it("stops matching commands once it has enough", async () => {
    const user = userEvent.setup()
    const many = Array.from({ length: 200 }, (_, i) => ({ id: `o${i}`, label: `Order ${i}` }))
    render(<Bar resolve={() => null} commands={many} suggestions={[]} limit={5} />)
    await user.click(field())
    const calls = vi.mocked(filterCommands)
    calls.mockClear()
    await user.keyboard("o")
    expect(screen.getAllByRole("option")).toHaveLength(5)
    // React may render twice per keystroke; a full scan would be 200 calls.
    expect(calls.mock.calls.length).toBeLessThanOrEqual(10)
    calls.mockClear()
    await user.keyboard("rder 7x")
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Order 0", "Order 1", "Order 2", "Order 3", "Order 4"])
  })

  it("stops a custom filter once it has enough", async () => {
    const user = userEvent.setup()
    const many = Array.from({ length: 200 }, (_, i) => ({ id: `o${i}`, label: `Order ${i}` }))
    const filter = vi.fn(() => true)
    render(<Bar resolve={() => null} commands={many} filter={filter} suggestions={[]} limit={3} />)
    await user.type(field(), "o")
    expect(screen.getAllByRole("option")).toHaveLength(3)
    expect(filter.mock.calls.length).toBeLessThanOrEqual(6)
  })

  it("subscribes to the document's keys once, however much it re-renders", async () => {
    const user = userEvent.setup()
    const add = vi.spyOn(document, "addEventListener")
    render(<Bar />)
    await user.type(field(), "raise prices")
    expect(add.mock.calls.filter(([type, listener]) => type === "keydown" && typeof listener === "function" && listener.length === 1)).toHaveLength(1)
    add.mockRestore()
  })

  it("reads touches as a function of the values", async () => {
    const user = userEvent.setup()
    const live = { ...raise, touches: (v: Record<string, string>) => `${v.pct}% on 12 items.` }
    render(<Bar resolve={() => live} />)
    await user.type(field(), "raise")
    const pct = screen.getByRole("textbox", { name: "Change %" })
    await user.clear(pct)
    await user.type(pct, "15")
    expect(screen.getByRole("group", { name: "Raise prices" })).toHaveTextContent("15% on 12 items.")
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

  it("keeps focus in the field after Enter runs a command", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.type(field(), "orders{Enter}")
    expect(field()).toHaveFocus()
    expect(field()).toHaveValue("")
  })

  it("reaches the chips with the arrows, and Enter picks one", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.click(field())
    expect(field()).not.toHaveAttribute("aria-activedescendant")
    await user.keyboard("{Enter}")
    expect(field()).toHaveValue("")
    await user.keyboard("{ArrowDown}{ArrowDown}")
    const chip = screen.getByRole("option", { name: "close the shop" })
    expect(chip).toHaveAttribute("data-highlighted")
    expect(field()).toHaveAttribute("aria-activedescendant", chip.id)
    await user.keyboard("{ArrowUp}{ArrowUp}")
    expect(chip).toHaveAttribute("data-highlighted")
    await user.keyboard("{Enter}")
    expect(field()).toHaveValue("close the shop")
    expect(field()).toHaveFocus()
  })

  it("moves from the commands to the chips under one highlight", async () => {
    const user = userEvent.setup()
    render(<Bar suggest="typing" resolve={() => null} suggestions={["order history"]} />)
    await user.type(field(), "order")
    expect(screen.getByRole("option", { name: "Orders" })).toHaveAttribute("data-highlighted")
    await user.keyboard("{ArrowDown}{ArrowDown}")
    expect(screen.getByRole("option", { name: "order history" })).toHaveAttribute("data-highlighted")
    expect(screen.getByRole("option", { name: "Orders" })).not.toHaveAttribute("data-highlighted")
  })

  it("completes the highlighted entry with Tab, then Tab moves on", async () => {
    const user = userEvent.setup()
    render(<Bar resolve={() => null} />)
    await user.type(field(), "exp")
    await user.keyboard("{Tab}")
    expect(field()).toHaveValue("Export orders")
    expect(field()).toHaveFocus()
    await user.tab()
    expect(field()).not.toHaveFocus()
  })

  it("completes a chip with Tab", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.click(field())
    await user.keyboard("{ArrowDown}{Tab}")
    expect(field()).toHaveValue("raise prices 10%")
    expect(field()).toHaveFocus()
  })

  it("focuses on Cmd or Ctrl+K, and the shortcut can be turned off", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Bar />)
    await user.keyboard("{Control>}k{/Control}")
    expect(field()).toHaveFocus()
    unmount()
    const again = render(<Bar shortcut="K" />)
    await user.keyboard("{Control>}k{/Control}")
    expect(field()).toHaveFocus()
    again.unmount()
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

    it("is a modal dialog that hides the page from assistive tech", async () => {
      const user = userEvent.setup()
      render(
        <main>
          <p>Rates</p>
          <Bar />
        </main>
      )
      await user.click(screen.getByRole("button", { name: "Ask" }))
      const dialog = await screen.findByRole("dialog", { name: "Ask" })
      expect(dialog).toHaveAttribute("aria-modal", "true")
      await waitFor(() => expect(document.querySelector("main")!.closest('[aria-hidden="true"]')).not.toBeNull())
      expect(document.querySelector('[aria-live="polite"]')!.closest("[aria-hidden]")).toBeNull()
    })

    it("opens from the Ask button, and a suggestion sends on tap", async () => {
      const user = userEvent.setup()
      render(<Bar />)
      expect(screen.queryByRole("combobox")).toBeNull()
      await user.click(screen.getByRole("button", { name: "Ask" }))
      await user.click(await screen.findByRole("option", { name: "raise prices 10%" }))
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

    it("finds the plan's button in the snapshot by its current label", async () => {
      const { agent, step } = mount()
      await step("Ask", "search", "raise prices")
      await step("Change %", "setValue", "20")
      await waitFor(() => expect(agent.snapshot().find((c) => c.label === "Raise 12 prices by 20%")).toMatchObject({ component: "button" }))
      expect(agent.snapshot().some((c) => c.label === "Raise 12 prices by 10%")).toBe(false)
    })

    it("reads touches from the current values", async () => {
      const plan = { ...raise, touches: (v: Record<string, string>) => `${v.pct}% on 12 items.` }
      const { step } = mount({ resolve: () => plan })
      const result = await step("Ask", "search", "raise prices")
      expect(result.steps[0].result).toMatchObject({ touches: "10% on 12 items." })
    })

    it("still needs a person when confirm is empty", async () => {
      const { agent, step } = mount({ confirm: "" })
      await step("Ask", "search", "raise prices")
      expect(agent.snapshot().find((c) => c.label === "Raise 12 prices by 10%")).toMatchObject({ approval: "person" })
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
