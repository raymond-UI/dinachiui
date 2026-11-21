import * as React from "react"
import { render, screen, waitFor, act, fireEvent, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import {
  Omnibar,
  OmnibarContent,
  OmnibarInput,
  OmnibarItem,
  OmnibarList,
  OmnibarScopes,
  OmnibarTrigger,
  filterCommands,
  type CommandItem,
  type OmnibarProps,
  type OmnibarScope,
} from "./omnibar"
import * as Shared from "../command-items"
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
const spoken = () => Array.from(document.querySelectorAll('[aria-live="polite"]')).map((e) => e.textContent)

async function opened(props: Partial<OmnibarProps> = {}) {
  const user = userEvent.setup()
  render(<Bar {...props} />)
  await user.click(screen.getByRole("button", { name: "Search" }))
  await waitFor(() => expect(field()).toHaveFocus())
  return user
}

describe("filterCommands", () => {
  it("is the shared one", () => {
    expect(filterCommands).toBe(Shared.filterCommands)
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
    expect(document.querySelector("[data-omnibar-action]")).toHaveTextContent("Open")
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

  it("opens empty when / is pressed on the field itself", async () => {
    const user = userEvent.setup()
    render(<Bar />)
    screen.getByRole("button", { name: "Search" }).focus()
    await user.keyboard("/")
    await waitFor(() => expect(field()).toHaveFocus())
    expect(field()).toHaveValue("")
  })

  it("ignores a held or composing shortcut", () => {
    render(<Bar />)
    act(() => {
      document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "/", repeat: true, bubbles: true }))
      document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "/", isComposing: true, bubbles: true }))
    })
    expect(screen.queryByRole("combobox")).toBeNull()
  })

  it("puts disabled rows last, so Enter runs a usable one and they show no actions", async () => {
    const onRun = vi.fn()
    const list: CommandItem[] = [
      { id: "off", label: "Archived guest", group: "People", disabled: true, actions: open2 },
      { id: "on", label: "Active guest", group: "People", actions: open2 },
    ]
    const user = await opened({ items: list, scopes: [], onRun })
    expect(options()).toEqual(["Active guest", "Archived guest"])
    await user.keyboard("{ArrowDown}")
    expect(document.querySelector("[data-omnibar-action]")).toBeNull()
    await user.keyboard("{ArrowUp}{Enter}")
    expect(onRun).toHaveBeenCalledWith(list[1], open2[0], expect.anything())
  })

  it("lists Recent then suggestions while idle, up to idleLimit rows", async () => {
    await opened({ recent: ["alan"], suggested: ["inbox", "new", "light", "dark", "ada"], idleLimit: 5 })
    expect(screen.getByText("Recent")).toBeInTheDocument()
    expect(options()).toEqual(["Alan TuringCustomer", "Inbox", "New invoice", "Light", "Dark"])
  })

  it("names the action Enter runs, and announces it when Tab moves it", async () => {
    const user = await opened()
    await user.keyboard("ada")
    const option = screen.getByRole("option")
    expect(option).toHaveAccessibleDescription("Enter: Open. Tab: next action")
    await user.keyboard("{Tab}")
    expect(option).toHaveAccessibleDescription("Enter: Email. Tab: next action")
    expect(spoken()).toContain("Enter: Email")
  })

  it("keeps the actions out of the option, and runs one a pointer clicks", async () => {
    const onRun = vi.fn()
    const user = await opened({ onRun })
    await user.keyboard("ada")
    const option = screen.getByRole("option")
    expect(option.querySelector("button, a, input, [tabindex]")).toBeNull()
    expect(option.querySelector("[data-omnibar-action]")!.parentElement).toHaveAttribute("aria-hidden", "true")
    await user.click(option.querySelector('[data-omnibar-action="1"]')!)
    expect(onRun).toHaveBeenCalledWith(items[2], open2[1], expect.objectContaining({ reason: "action-press" }))
  })

  it("marks the highlighted option aria-selected, which a row's own props cannot override", async () => {
    const user = userEvent.setup()
    render(
      <Omnibar items={items}>
        <OmnibarTrigger />
        <OmnibarContent>
          <OmnibarInput />
          <OmnibarList>{(item) => <OmnibarItem key={item.id} item={item} aria-selected={false} />}</OmnibarList>
        </OmnibarContent>
      </Omnibar>
    )
    await user.click(screen.getByRole("button", { name: "Search" }))
    await waitFor(() => expect(field()).toHaveFocus())
    const [first, second] = screen.getAllByRole("option")
    await waitFor(() => expect(first).toHaveAttribute("aria-selected", "true"))
    expect(second).toHaveAttribute("aria-selected", "false")
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(second).toHaveAttribute("aria-selected", "true"))
    expect(first).toHaveAttribute("aria-selected", "false")
  })

  it("speaks the same text again once the highlight moves", async () => {
    const twins: CommandItem[] = [
      { id: "a", label: "Ada", actions: [{ id: "o", label: "Open" }, { id: "r", label: "Reply" }] },
      { id: "b", label: "Bea", actions: [{ id: "o", label: "Open" }, { id: "r", label: "Reply" }] },
    ]
    const user = await opened({ items: twins, scopes: [] })
    await user.keyboard("{Tab}")
    expect(spoken()).toContain("Enter: Reply")
    await user.keyboard("{ArrowDown}")
    await waitFor(() => expect(spoken()).not.toContain("Enter: Reply"))
    await user.keyboard("{Tab}")
    expect(spoken()).toContain("Enter: Reply")
  })

  it("lets a chip's pressed state speak for itself", async () => {
    const user = await opened()
    await user.click(screen.getByRole("button", { name: /^Actions\s*>$/ }))
    expect(screen.getByRole("button", { name: /^Actions\s*>$/ })).toHaveAttribute("aria-pressed", "true")
    expect(spoken().join("")).not.toContain("Scope:")
    await user.keyboard("{Backspace}")
    await waitFor(() => expect(spoken()).toContain("Scope: All"))
  })

  it("names the listbox by its label", async () => {
    await opened()
    expect(screen.getByRole("listbox", { name: "Search" })).toBeInTheDocument()
  })

  it("announces a scope a typed prefix picks", async () => {
    const user = await opened()
    await user.keyboard(">")
    await waitFor(() => expect(spoken()).toContain("Scope: Actions"))
    await user.keyboard("{Backspace}")
    await waitFor(() => expect(spoken()).toContain("Scope: All"))
  })

  it("renders at most limit rows, says how many matched, and tells the agent the same", async () => {
    const many: CommandItem[] = Array.from({ length: 120 }, (_, i) => ({ id: `r${i}`, label: `Room ${i}`, group: "Rooms" }))
    const user = await opened({ items: many, scopes: [], limit: 10 })
    expect(screen.getAllByRole("option")).toHaveLength(10)
    await user.keyboard("room")
    expect(screen.getAllByRole("option")).toHaveLength(10)
    await waitFor(() => expect(screen.getAllByRole("status").map((s) => s.textContent)).toContain("10 of 120 results"))
  })

  it("defaults to 50 rows", async () => {
    const many: CommandItem[] = Array.from({ length: 120 }, (_, i) => ({ id: `r${i}`, label: `Room ${i}` }))
    await opened({ items: many, scopes: [] })
    expect(screen.getAllByRole("option")).toHaveLength(50)
  })

  it("re-renders only the rows the highlight leaves and lands on", async () => {
    const many: CommandItem[] = Array.from({ length: 200 }, (_, i) => ({ id: `r${i}`, label: `Room ${i}` }))
    let renders = 0
    const count = () => void renders++
    render(
      <Omnibar items={many} defaultOpen shortcut={false} limit={200}>
        <OmnibarContent>
          <OmnibarInput />
          <OmnibarList>
            {(item) => (
              <React.Profiler key={item.id} id="row" onRender={count}>
                <OmnibarItem item={item} />
              </React.Profiler>
            )}
          </OmnibarList>
        </OmnibarContent>
      </Omnibar>
    )
    await waitFor(() => expect(field()).toHaveFocus())
    expect(renders).toBeLessThanOrEqual(202)
    renders = 0
    act(() => void fireEvent.keyDown(field(), { key: "ArrowDown" }))
    expect(renders).toBeLessThanOrEqual(4)
  })

  it("bolds every searched word", async () => {
    const user = await opened()
    await user.keyboard("ada cust")
    expect(Array.from(document.querySelectorAll("mark")).map((m) => m.textContent)).toEqual(["Ada", "Cust"])
  })

  it("keeps one shortcut listener when onOpenChange changes", () => {
    const add = vi.spyOn(document, "addEventListener")
    const { rerender } = render(<Bar onOpenChange={() => {}} />)
    rerender(<Bar onOpenChange={() => {}} />)
    rerender(<Bar onOpenChange={() => {}} />)
    expect(add.mock.calls.filter(([type]) => type === "keydown")).toHaveLength(1)
    add.mockRestore()
  })

  it("announces how many results match", async () => {
    const user = await opened()
    await user.keyboard("ada")
    await waitFor(() => expect(screen.getAllByRole("status").map((s) => s.textContent)).toContain("1 result"))
  })

  it("names the scope chips' group", async () => {
    const user = userEvent.setup()
    render(
      <Omnibar items={items} scopes={scopes} defaultOpen>
        <OmnibarContent>
          <OmnibarInput />
          <OmnibarScopes aria-label="Search in" />
          <OmnibarList />
        </OmnibarContent>
      </Omnibar>
    )
    void user
    expect(await screen.findByRole("group", { name: "Search in" })).toBeInTheDocument()
  })

  describe("on a phone", () => {
    const real = window.matchMedia
    beforeEach(() => {
      window.matchMedia = ((query: string) => ({ ...real(query), matches: true })) as typeof window.matchMedia
    })
    afterEach(() => {
      window.matchMedia = real
    })

    it("gives the top hit its actions, but never a disabled one", async () => {
      const list: CommandItem[] = [
        { id: "off", label: "Ada Archived", group: "People", disabled: true, actions: open2 },
        { id: "on", label: "Ada Active", group: "People", actions: open2 },
      ]
      const user = await opened({ items: list, scopes: [] })
      await user.keyboard("ada")
      expect(screen.getAllByRole("button", { name: "Email", hidden: true })).toHaveLength(1)
      expect(screen.getByRole("button", { name: "Actions for Ada Active" })).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: "Actions for Ada Archived" })).toBeNull()
    })

    it("keeps every control in the listbox out of the accessibility tree and the tab order", async () => {
      const user = await opened({ recent: [], scopes: [] })
      await user.keyboard("a")
      const listbox = screen.getByRole("listbox")
      expect(within(listbox).queryAllByRole("button")).toHaveLength(0)
      const buttons = listbox.querySelectorAll("button")
      expect(buttons.length).toBeGreaterThan(0)
      for (const button of buttons) {
        expect(button.closest("[aria-hidden]")).not.toBeNull()
        expect(button).toHaveAttribute("tabindex", "-1")
      }
    })

    it("reaches each row's actions from outside the listbox", async () => {
      const onRun = vi.fn()
      const user = await opened({ recent: [], scopes: [], onRun })
      await user.keyboard("a")
      const menu = screen.getByRole("button", { name: "Actions for Alan Turing" })
      expect(screen.getByRole("listbox").contains(menu)).toBe(false)
      await user.click(menu)
      await user.click(await screen.findByRole("button", { name: "Email" }))
      expect(onRun).toHaveBeenCalledWith(items[3], open2[1], expect.objectContaining({ reason: "action-press" }))
    })

    it("describes the action Enter runs and moves it with Tab, as on a desktop", async () => {
      const onRun = vi.fn()
      const user = await opened({ onRun, scopes: [] })
      await user.keyboard("ada")
      const option = screen.getByRole("option")
      expect(option).toHaveAccessibleDescription("Enter: Open. Tab: next action")
      await user.keyboard("{Tab}{Enter}")
      expect(onRun).toHaveBeenCalledWith(items[2], open2[1], expect.anything())
    })

    it("leaves live regions and hidden nodes as they were, and restores the rest exactly", async () => {
      const user = userEvent.setup()
      render(
        <>
          <main>Arrivals</main>
          <aside aria-hidden="true">Ads</aside>
          <section>
            <p>Footer</p>
            <div aria-live="polite">Saved</div>
          </section>
          <Bar />
        </>
      )
      await user.click(screen.getByRole("button", { name: "Search" }))
      await waitFor(() => expect(field()).toHaveFocus())
      expect(screen.getByText("Saved").closest("[aria-hidden]")).toBeNull()
      expect(screen.getByText("Footer")).toHaveAttribute("aria-hidden", "true")
      await user.click(screen.getByRole("button", { name: "Cancel" }))
      await waitFor(() => expect(screen.queryByRole("combobox")).toBeNull())
      expect(screen.getByText("Footer")).not.toHaveAttribute("aria-hidden")
      expect(screen.getByText("Saved").closest("[aria-hidden]")).toBeNull()
      expect(screen.getByText("Ads")).toHaveAttribute("aria-hidden", "true")
    })

    it("is modal: aria-modal on the panel and the page behind hidden", async () => {
      const user = userEvent.setup()
      render(
        <>
          <main>Arrivals</main>
          <Bar />
        </>
      )
      await user.click(screen.getByRole("button", { name: "Search" }))
      await waitFor(() => expect(field()).toHaveFocus())
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true")
      expect(screen.getByText("Arrivals").closest("[aria-hidden]")).toHaveAttribute("aria-hidden", "true")
      await user.click(screen.getByRole("button", { name: "Cancel" }))
      await waitFor(() => expect(screen.queryByRole("combobox")).toBeNull())
      expect(screen.getByText("Arrivals").closest("[aria-hidden]")).toBeNull()
    })

    it("puts the row menu beside the option, not in it", async () => {
      const user = await opened({ recent: [], scopes: [] })
      await user.keyboard("a")
      const menu = screen.getByRole("button", { name: "Actions for Alan Turing" })
      expect(menu.closest('[role="option"]')).toBeNull()
      for (const option of screen.getAllByRole("option")) expect(option.querySelector("button")).toBeNull()
    })

    it("takes a shorter placeholder", async () => {
      const user = userEvent.setup()
      render(
        <Omnibar items={items}>
          <OmnibarTrigger />
          <OmnibarContent>
            <OmnibarInput placeholder="Search guests, rooms or type > for actions" phonePlaceholder="Search guests" />
            <OmnibarList />
          </OmnibarContent>
        </Omnibar>
      )
      await user.click(screen.getByRole("button", { name: "Search" }))
      await waitFor(() => expect(field()).toHaveAttribute("placeholder", "Search guests"))
    })
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
      expect(entry()).toMatchObject({ component: "combobox", open: false, hint: expect.stringContaining("actions") })
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
