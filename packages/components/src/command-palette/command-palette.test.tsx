import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import {
  CommandPalette,
  CommandPaletteBody,
  CommandPaletteContent,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPalettePreview,
  CommandPaletteTrigger,
  filterCommands,
  type CommandItem,
  type CommandPaletteProps,
} from "./command-palette"
import { AgentProvider, createAgent, isAgentChange } from "../agent"
import { agentConformance } from "../test/agent-conformance"

const items: CommandItem[] = [
  { id: "inbox", label: "Inbox", group: "Pages", shortcut: "G I" },
  { id: "reports", label: "Reports", group: "Pages", keywords: ["analytics"] },
  { id: "new", label: "New invoice", group: "Actions", actions: [{ id: "run", label: "Run" }] },
  {
    id: "ada",
    label: "Ada Lovelace",
    description: "Customer",
    group: "People",
    kind: "Person",
    actions: [
      { id: "open", label: "Open" },
      { id: "email", label: "Email" },
    ],
  },
  {
    id: "theme",
    label: "Change theme",
    group: "Actions",
    items: [
      { id: "light", label: "Light" },
      { id: "dark", label: "Dark" },
    ],
  },
]

function Palette(props: Partial<CommandPaletteProps>) {
  return (
    <CommandPalette items={items} {...props}>
      <CommandPaletteTrigger />
      <CommandPaletteContent>
        <CommandPaletteInput />
        <CommandPaletteBody>
          <CommandPaletteList />
          <CommandPalettePreview placeholder="Type to search" />
        </CommandPaletteBody>
      </CommandPaletteContent>
    </CommandPalette>
  )
}

const options = () => screen.getAllByRole("option").map((o) => o.textContent)

describe("filterCommands", () => {
  it("matches every word across label, description and keywords", () => {
    expect(filterCommands(items[3], "ada cust")).toBe(true)
    expect(filterCommands(items[3], "ada invoice")).toBe(false)
    expect(filterCommands(items[1], "analytics")).toBe(true)
  })
})

describe("CommandPalette", () => {
  it("opens on Cmd or Ctrl+K and focuses the search", async () => {
    const user = userEvent.setup()
    render(<Palette />)
    expect(screen.queryByRole("dialog")).toBeNull()
    await user.keyboard("{Control>}k{/Control}")
    expect(await screen.findByRole("dialog", { name: "Command palette" })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus())
  })

  it("does not take the shortcut when it is turned off", async () => {
    const user = userEvent.setup()
    render(<Palette shortcut={false} />)
    await user.keyboard("{Meta>}k{/Meta}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("lists groups, filters as you type and says when nothing matches", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    expect(screen.getByText("Pages")).toBeInTheDocument()
    expect(screen.getByText("People")).toBeInTheDocument()
    await user.type(screen.getByRole("combobox"), "repo")
    expect(options()).toEqual(["Reports"])
    await user.clear(screen.getByRole("combobox"))
    await user.type(screen.getByRole("combobox"), "zzz")
    expect(screen.queryAllByRole("option")).toHaveLength(0)
    expect(screen.getByText("Nothing matches “zzz”")).toBeInTheDocument()
  })

  it("lists recent items first while the search is empty", () => {
    render(<Palette defaultOpen recent={["ada", "reports"]} />)
    expect(screen.getByText("Recent")).toBeInTheDocument()
    expect(options().slice(0, 2)).toEqual(["Ada LovelaceCustomer", "Reports"])
    expect(options().filter((o) => o === "Reports")).toHaveLength(1)
  })

  it("moves the highlight with the arrows and runs the item on Enter", async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<Palette defaultOpen onRun={onRun} />)
    await user.type(screen.getByRole("combobox"), "invoice")
    await user.keyboard("{Enter}")
    expect(onRun).toHaveBeenCalledWith(items[2], items[2].actions![0], expect.objectContaining({ reason: "item-press" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  it("runs the second action on Mod+Enter", async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<Palette defaultOpen onRun={onRun} />)
    await user.type(screen.getByRole("combobox"), "ada")
    await user.keyboard("{Control>}{Enter}{/Control}")
    expect(onRun).toHaveBeenCalledWith(items[3], items[3].actions![1], expect.anything())
  })

  it("stays open when the app cancels the run", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen onRun={(_, __, details) => details.cancel()} />)
    await user.type(screen.getByRole("combobox"), "invoice")
    await user.keyboard("{Enter}")
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("previews the highlighted item", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    await user.type(screen.getByRole("combobox"), "ada")
    expect(screen.getByText("Person")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Email/ })).toBeInTheDocument()
  })

  it("drills into a sub-list, and Escape and Backspace step back out", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    await user.type(screen.getByRole("combobox"), "theme")
    await user.keyboard("{Enter}")
    expect(options()).toEqual(["Light", "Dark"])
    expect(screen.getByRole("combobox")).toHaveValue("")
    await user.keyboard("{Escape}")
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(options()).toContain("Reports")

    await user.type(screen.getByRole("combobox"), "theme")
    await user.keyboard("{Enter}")
    await user.keyboard("{Backspace}")
    expect(options()).toContain("Reports")
  })

  it("forgets the search and sub-list when it closes", async () => {
    const user = userEvent.setup()
    render(<Palette />)
    await user.click(screen.getByRole("button", { name: /Search/ }))
    await user.type(await screen.findByRole("combobox"), "theme")
    await user.keyboard("{Enter}")
    await user.keyboard("{Escape}{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await user.keyboard("{Control>}k{/Control}")
    expect(await screen.findByRole("combobox")).toHaveValue("")
    expect(options()).toContain("Reports")
  })

  it("marks every part with a data-slot", () => {
    render(<Palette defaultOpen />)
    for (const slot of ["content", "input", "body", "list", "item", "group", "group-label", "preview", "shortcut"]) {
      expect(document.querySelector(`[data-slot="command-palette-${slot}"]`), slot).not.toBeNull()
    }
  })

  describe("agent", () => {
    function mount(props: Partial<CommandPaletteProps> = {}) {
      const agent = createAgent()
      render(
        <AgentProvider agent={agent}>
          <Palette {...props} />
        </AgentProvider>
      )
      const run = (action: string, ...args: unknown[]) => agent.act({ steps: [{ ref: "Command palette", action, args }] })
      return { agent, run, entry: () => agent.snapshot().find((c) => c.label === "Command palette")! }
    }

    it("lists every command while closed, as one control", () => {
      const { agent, entry } = mount()
      expect(entry()).toMatchObject({ component: "combobox", open: false })
      expect(entry().items).toEqual(items.map((i) => i.label))
      expect(agent.snapshot().filter((c) => c.component === "dialog")).toHaveLength(0)
    })

    it("searches and reports the matches", async () => {
      const { run } = mount()
      const result = await run("search", "ada")
      expect(result).toMatchObject({ ok: true })
      expect(result.steps[0].result).toEqual([{ label: "Ada Lovelace", group: "People", actions: ["Open", "Email"] }])
      expect(screen.getByRole("combobox")).toHaveValue("ada")
    })

    it("runs a command with a named action, marked as the agent's", async () => {
      const onRun = vi.fn()
      const { run } = mount({ onRun })
      const result = await run("select", "Ada Lovelace", "Email")
      expect(result.ok).toBe(true)
      expect(onRun).toHaveBeenCalledWith(items[3], items[3].actions![1], expect.anything())
      expect(isAgentChange(onRun.mock.calls[0][2])).toBe(true)
    })

    it("opens a sub-list and lists it", async () => {
      const { run, entry } = mount()
      const result = await run("select", "Change theme")
      expect(result.steps[0].result).toEqual([{ label: "Light" }, { label: "Dark" }])
      await waitFor(() => expect(entry().items).toEqual(["Light", "Dark"]))
    })

    it("tells the agent when the app refuses the command", async () => {
      const { run } = mount({ onRun: (_, __, details) => details.cancel() })
      const result = await run("select", "Inbox")
      expect(result.ok).toBe(false)
      expect(result.error?.message).toMatch(/refused/)
    })

    it("lists the commands when one does not exist", async () => {
      const { run } = mount()
      const result = await run("select", "Nope")
      expect(result.ok).toBe(false)
      expect(result.error?.message).toContain("Inbox")
    })

    it("closes", async () => {
      const { run, entry } = mount({ defaultOpen: true })
      await act(() => run("close"))
      await waitFor(() => expect(entry().open).toBe(false))
    })
  })
})

agentConformance({
  name: "CommandPalette",
  label: "Command palette",
  render: ({ onChange, disabled }) => (
    <CommandPalette items={items} onOpenChange={onChange} disabled={disabled}>
      <CommandPaletteTrigger />
      <CommandPaletteContent>
        <CommandPaletteInput />
        <CommandPaletteList />
      </CommandPaletteContent>
    </CommandPalette>
  ),
  entry: { component: "combobox", open: false, actions: ["open", "search", "select"] },
  act: { action: "open", result: { open: true } },
  invalid: { action: "select", args: ["Nope"], lists: ["Inbox", "Reports"] },
  person: async (user) => {
    await user.click(screen.getByRole("button", { name: /Search/ }))
  },
})
