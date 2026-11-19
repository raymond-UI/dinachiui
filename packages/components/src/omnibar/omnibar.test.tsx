import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import {
  Omnibar,
  OmnibarContent,
  OmnibarInput,
  OmnibarList,
  OmnibarScopes,
  OmnibarTrigger,
  filterCommands,
  type CommandItem,
  type OmnibarProps,
  type OmnibarScope,
} from "./omnibar"
import * as Palette from "../command-palette"
import { AgentProvider, createAgent, isAgentChange } from "../agent"
import { agentConformance } from "../test/agent-conformance"

const open2 = [
  { id: "open", label: "Open" },
  { id: "email", label: "Email" },
]
const items: CommandItem[] = [
  { id: "inbox", label: "Inbox", group: "Pages" },
  { id: "new", label: "New invoice", group: "Actions", actions: [{ id: "run", label: "Run" }] },
  { id: "ada", label: "Ada Lovelace", description: "Customer", group: "People", actions: open2 },
  { id: "alan", label: "Alan Turing", description: "Customer", group: "People", actions: open2 },
  {
    id: "theme",
    label: "Change theme",
    group: "Actions",
    items: [
      { id: "light", label: "Light", group: "Actions" },
      { id: "dark", label: "Dark", group: "Actions" },
    ],
  },
]
const scopes: OmnibarScope[] = [
  { id: "actions", label: "Actions", prefix: ">" },
  { id: "people", label: "People", prefix: "@" },
]

function Bar(props: Partial<OmnibarProps>) {
  return (
    <Omnibar items={items} scopes={scopes} {...props}>
      <OmnibarTrigger />
      <OmnibarContent>
        <OmnibarInput />
        <OmnibarScopes />
        <OmnibarList />
      </OmnibarContent>
    </Omnibar>
  )
}

const options = () => screen.getAllByRole("option").map((o) => o.querySelector("span.flex-1")?.textContent)
const field = () => screen.getByRole("combobox")

async function opened(props: Partial<OmnibarProps> = {}) {
  const user = userEvent.setup()
  render(<Bar {...props} />)
  await user.click(screen.getByRole("button", { name: "Search" }))
  await waitFor(() => expect(field()).toHaveFocus())
  return user
}

describe("filterCommands", () => {
  it("is the Command Palette's", () => {
    expect(filterCommands).toBe(Palette.filterCommands)
  })
})

describe("Omnibar", () => {
  it("focuses on / from the page", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    await user.keyboard("/")
    await waitFor(() => expect(field()).toHaveFocus())
    expect(field()).toHaveValue("")
  })

  it("leaves / to another field", async () => {
    const user = userEvent.setup()
    render(
      <>
        <input aria-label="Note" />
        <Bar />
      </>
    )
    await user.type(screen.getByRole("textbox", { name: "Note" }), "a/b")
    expect(screen.getByRole("textbox", { name: "Note" })).toHaveValue("a/b")
    expect(screen.queryByRole("combobox")).toBeNull()
  })

  it("takes another shortcut, or none", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Bar shortcut={false} />)
    await user.keyboard("/")
    expect(screen.queryByRole("combobox")).toBeNull()
    unmount()
    render(<Bar shortcut="mod+j" />)
    await user.keyboard("{Control>}j{/Control}")
    await waitFor(() => expect(field()).toHaveFocus())
  })

  it("lists recent items first while the search is empty", async () => {
    await opened({ recent: ["alan"] })
    expect(screen.getByText("Recent")).toBeInTheDocument()
    expect(options()[0]).toBe("Alan TuringCustomer")
  })

  it("lists a sub-list's items in its place", async () => {
    await opened()
    expect(options()).toEqual(["Inbox", "New invoice", "Light", "Dark", "Ada LovelaceCustomer", "Alan TuringCustomer"])
  })

  it("filters and says when nothing matches", async () => {
    const user = await opened()
    await user.keyboard("zzz")
    expect(screen.getByText("Nothing matches “zzz”")).toBeInTheDocument()
  })

  it("picks a scope from a typed prefix, and Backspace drops it", async () => {
    const user = await opened()
    await user.keyboard("@al")
    expect(field()).toHaveValue("al")
    expect(screen.getByRole("button", { name: /^People/, pressed: true })).toBeInTheDocument()
    expect(options()).toEqual(["Alan TuringCustomer"])
    await user.keyboard("{Backspace}{Backspace}")
    expect(options()).toHaveLength(2)
    await user.keyboard("{Backspace}")
    expect(screen.getByRole("button", { name: "All", pressed: true })).toBeInTheDocument()
    expect(options()).toHaveLength(6)
  })

  it("picks a scope from its chip", async () => {
    const user = await opened()
    await user.click(screen.getByRole("button", { name: /^Actions/ }))
    expect(options()).toEqual(["New invoice", "Light", "Dark"])
    expect(field()).toHaveFocus()
  })

  it("moves through the highlighted row's actions with Tab and runs the one picked", async () => {
    const onRun = vi.fn()
    const user = await opened({ onRun })
    await user.keyboard("ada")
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument()
    await user.keyboard("{Tab}")
    expect(field()).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onRun).toHaveBeenCalledWith(items[2], open2[1], expect.anything())
    await waitFor(() => expect(screen.queryByRole("combobox")).toBeNull())
  })

  it("runs the first action on Enter, and Shift+Tab wraps round", async () => {
    const onRun = vi.fn()
    const user = await opened({ onRun })
    await user.keyboard("alan")
    await user.keyboard("{Shift>}{Tab}{/Shift}{Shift>}{Tab}{/Shift}{Enter}")
    expect(onRun).toHaveBeenLastCalledWith(items[3], open2[0], expect.anything())
  })

  it("stays open when the app cancels the run", async () => {
    const user = await opened({ onRun: (_, __, details) => details.cancel() })
    await user.keyboard("inbox{Enter}")
    expect(field()).toBeInTheDocument()
  })

  it("forgets the search and scope when it closes", async () => {
    const user = await opened()
    await user.keyboard("@al")
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("combobox")).toBeNull())
    await user.click(screen.getByRole("button", { name: "Search" }))
    await waitFor(() => expect(field()).toHaveValue(""))
    expect(options()).toHaveLength(6)
  })

  it("starts the search with a letter typed on the field", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    screen.getByRole("button", { name: "Search" }).focus()
    await user.keyboard("a")
    await waitFor(() => expect(field()).toHaveValue("a"))
  })

  it("names its parts", async () => {
    await opened()
    for (const slot of ["omnibar-trigger", "omnibar-content", "omnibar-input", "omnibar-scopes", "omnibar-list", "omnibar-item"]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
  })

  describe("agent", () => {
    function mount(props: Partial<OmnibarProps> = {}) {
      const agent = createAgent()
      render(
        <AgentProvider agent={agent}>
          <Bar {...props} />
        </AgentProvider>
      )
      const run = (action: string, ...args: unknown[]) => agent.act({ steps: [{ ref: "Search", action, args }] })
      return { agent, run, entry: () => agent.snapshot().find((c) => c.label === "Search")! }
    }

    it("is one control listing every command while closed", () => {
      const { agent, entry } = mount()
      expect(entry()).toMatchObject({ component: "combobox", open: false })
      expect(entry().items).toEqual(["Inbox", "New invoice", "Light", "Dark", "Ada Lovelace", "Alan Turing"])
      expect(agent.snapshot()).toHaveLength(1)
    })

    it("searches in a scope and reports the matches", async () => {
      const { run, entry } = mount()
      const result = await run("search", "a", "People")
      expect(result.steps[0].result).toEqual([
        { label: "Ada Lovelace", group: "People", actions: ["Open", "Email"] },
        { label: "Alan Turing", group: "People", actions: ["Open", "Email"] },
      ])
      expect(entry().value).toBe("@a")
    })

    it("reads a typed prefix as the scope", async () => {
      const { run } = mount()
      const result = await run("search", ">dark")
      expect(result.steps[0].result).toEqual([{ label: "Dark", group: "Actions" }])
    })

    it("lists the scopes when one does not exist", async () => {
      const { run } = mount()
      const result = await run("search", "a", "Rooms")
      expect(result.ok).toBe(false)
      expect(result.error?.message).toContain("People")
    })

    it("runs an item's named action, marked as the agent's", async () => {
      const onRun = vi.fn()
      const { run } = mount({ onRun })
      const result = await run("select", "Alan Turing", "Email")
      expect(result.ok).toBe(true)
      expect(onRun).toHaveBeenCalledWith(items[3], open2[1], expect.anything())
      expect(isAgentChange(onRun.mock.calls[0][2])).toBe(true)
    })

    it("tells the agent when the app refuses", async () => {
      const { run } = mount({ onRun: (_, __, details) => details.cancel() })
      const result = await run("select", "Inbox")
      expect(result.ok).toBe(false)
      expect(result.error?.message).toMatch(/refused/)
    })

    it("closes", async () => {
      const { run, entry } = mount({ defaultOpen: true })
      await act(() => run("close"))
      await waitFor(() => expect(entry().open).toBe(false))
    })
  })
})

agentConformance({
  name: "Omnibar",
  label: "Search",
  render: ({ onChange, disabled }) => (
    <Omnibar items={items} onOpenChange={onChange} disabled={disabled}>
      <OmnibarTrigger />
      <OmnibarContent>
        <OmnibarInput />
        <OmnibarList />
      </OmnibarContent>
    </Omnibar>
  ),
  entry: { component: "combobox", open: false, actions: ["open", "search", "select"] },
  act: { action: "open", result: { open: true } },
  invalid: { action: "select", args: ["Nope"], lists: ["Inbox", "Alan Turing"] },
  person: async (user) => {
    await user.click(screen.getByRole("button", { name: "Search" }))
  },
})
