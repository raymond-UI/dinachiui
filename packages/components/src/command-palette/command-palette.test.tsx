import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { onTestFinished, vi } from "vitest"
import {
  CommandPalette,
  CommandPaletteBody,
  CommandPaletteContent,
  CommandPaletteInput,
  CommandPaletteItem,
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

/** Makes the palette take its phone layout for one test. */
function asPhone() {
  const real = window.matchMedia
  window.matchMedia = ((query: string) => ({ ...real(query), matches: query.includes("max-width") })) as typeof window.matchMedia
  return () => {
    window.matchMedia = real
  }
}

function asMac() {
  return vi.spyOn(navigator, "platform", "get").mockReturnValue("MacIntel")
}

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

  it("takes only Cmd+K on a Mac, and ignores a held key", async () => {
    const mac = asMac()
    onTestFinished(() => mac.mockRestore())
    const user = userEvent.setup()
    render(<Palette shortcut="K" />)
    expect(screen.getByRole("button", { name: /Search/ })).toHaveTextContent("⌘ K")
    await user.keyboard("{Control>}k{/Control}")
    expect(screen.queryByRole("dialog")).toBeNull()
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, repeat: true, bubbles: true }))
    })
    expect(screen.queryByRole("dialog")).toBeNull()
    await user.keyboard("{Meta>}k{/Meta}")
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })

  it("matches the physical key on a layout that types another script", async () => {
    render(<Palette />)
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "л", code: "KeyK", ctrlKey: true, bubbles: true }))
    })
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })

  it("hides the trigger's hint when the shortcut is off", () => {
    render(<Palette shortcut={false} />)
    expect(screen.getByRole("button", { name: /Search/ })).not.toHaveTextContent("K")
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

  it("does not run a disabled item on Mod+Enter or from the preview", async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    const list = items.map((i) => (i.id === "ada" ? { ...i, disabled: true } : i))
    render(<Palette defaultOpen onRun={onRun} items={list} />)
    await user.type(screen.getByRole("combobox"), "ada")
    await user.keyboard("{Control>}{Enter}{/Control}")
    expect(onRun).not.toHaveBeenCalled()
  })

  it("completes the highlighted item into the search with Tab", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    const input = screen.getByRole("combobox")
    await user.type(input, "rep")
    await user.tab()
    expect(input).toHaveValue("Reports")
    expect(input).toHaveFocus()
  })

  it("opens a sub-list with Tab and keeps the search focused", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    const input = screen.getByRole("combobox")
    await user.type(input, "theme")
    await user.tab()
    expect(options()).toEqual(["Light", "Dark"])
    expect(input).toHaveFocus()
    await user.keyboard("da")
    expect(options()).toEqual(["Dark"])
  })

  it("keeps the search focused after Enter opens a sub-list", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    await user.type(screen.getByRole("combobox"), "theme")
    await user.keyboard("{Enter}")
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus())
    await user.keyboard("li")
    expect(options()).toEqual(["Light"])
  })

  it("reaches every action with Tab from the search", async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    const many = [
      ...items,
      {
        id: "booking",
        label: "Booking 4821",
        actions: ["Open", "Refund", "Move dates"].map((label) => ({ id: label, label })),
      },
    ]
    render(<Palette defaultOpen onRun={onRun} items={many} />)
    await user.type(screen.getByRole("combobox"), "4821")
    const target = screen.getByRole("button", { name: "Move dates" })
    // The first Tab completes the search; jsdom has no CSS, so the phone's Cancel button is in the order too.
    for (let i = 0; i < 5 && document.activeElement !== target; i++) await user.tab()
    expect(target).toHaveFocus()
    expect(screen.getByText("Booking 4821")).toBeInTheDocument()
    await user.keyboard("{Enter}")
    expect(onRun).toHaveBeenCalledWith(many[5], many[5].actions![2], expect.objectContaining({ reason: "action-press" }))
  })

  it("names the results and announces how many match", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    expect(screen.getByRole("listbox", { name: "Command palette results" })).toBeInTheDocument()
    await user.type(screen.getByRole("combobox"), "repo")
    expect(screen.getAllByRole("status").map((e) => e.textContent)).toContain("1 result")
  })

  it("keeps a group named Recent apart from the recent items", () => {
    const list = items.map((i) => (i.group === "People" ? { ...i, group: "Recent" } : i))
    render(<Palette defaultOpen items={list} recent={["reports"]} />)
    expect(screen.getAllByText("Recent")).toHaveLength(2)
  })

  it("shows only recent and suggested items, capped, while the search is empty", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen recent={["reports"]} suggested={["new", "inbox", "theme"]} idleLimit={3} />)
    expect(options()).toEqual(["Reports", "New invoice", "InboxG I"])
    await user.type(screen.getByRole("combobox"), "ada")
    expect(options()).toEqual(["Ada LovelaceCustomer"])
  })

  it("clears a controlled search through onValueChange when it closes", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    function Controlled() {
      const [value, setValue] = React.useState("")
      return (
        <Palette
          defaultOpen
          value={value}
          onValueChange={(next, details) => {
            onValueChange(next, details)
            setValue(next)
          }}
        />
      )
    }
    render(<Controlled />)
    await user.type(screen.getByRole("combobox"), "ada")
    await user.keyboard("{Escape}")
    await waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith("", expect.anything()))
    await user.keyboard("{Control>}k{/Control}")
    expect(await screen.findByRole("combobox")).toHaveValue("")
  })

  it("does not step back out on Backspace while composing", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    await user.type(screen.getByRole("combobox"), "theme")
    await user.keyboard("{Enter}")
    const input = screen.getByRole("combobox")
    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", isComposing: true, bubbles: true, cancelable: true }))
    })
    expect(options()).toEqual(["Light", "Dark"])
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

  describe("rendering", () => {
    const many: CommandItem[] = Array.from({ length: 120 }, (_, i) => ({ id: `r${i}`, label: `Room ${i}`, group: i % 2 ? "Odd" : "Even" }))

    function Counted(props: Partial<CommandPaletteProps> & { rows: Map<string, number> }) {
      const { rows, ...rest } = props
      const count = (id: string) => () => rows.set(id, (rows.get(id) ?? 0) + 1)
      return (
        <CommandPalette items={many} defaultOpen {...rest}>
          <CommandPaletteContent>
            <CommandPaletteInput />
            <CommandPaletteBody>
              <CommandPaletteList>
                {(item) => (
                  <React.Profiler key={item.id} id={item.id} onRender={count(item.id)}>
                    <CommandPaletteItem item={item} />
                  </React.Profiler>
                )}
              </CommandPaletteList>
              <CommandPalettePreview />
            </CommandPaletteBody>
          </CommandPaletteContent>
        </CommandPalette>
      )
    }

    it("renders each row once on open, and only the two rows a highlight leaves and reaches", async () => {
      const rows = new Map<string, number>()
      render(<Counted rows={rows} />)
      await act(async () => {})
      expect(rows.size).toBe(50)
      // Only the row the highlight lands on renders again, which Base UI does itself.
      expect([...rows].filter(([, n]) => n > 1).map(([id]) => id)).toEqual(["r0"])
      screen.getByRole("combobox").focus()
      rows.clear()
      await userEvent.setup().keyboard("{ArrowDown}")
      expect(screen.getByRole("option", { name: "Room 2" })).toHaveAttribute("data-highlighted")
      expect([...rows.keys()].sort()).toEqual(["r0", "r2"])
    })

    it("lists at most limit rows, says how many matched, and lets limit change", async () => {
      const user = userEvent.setup()
      const { unmount } = render(<Palette defaultOpen items={many} />)
      expect(screen.getAllByRole("option")).toHaveLength(50)
      await user.type(screen.getByRole("combobox"), "room")
      expect(screen.getAllByRole("option")).toHaveLength(50)
      expect(screen.getAllByRole("status").map((e) => e.textContent)).toContain("50 of 120 results")
      unmount()
      render(<Palette defaultOpen items={many} limit={10} />)
      expect(screen.getAllByRole("option")).toHaveLength(10)
    })

    it("announces a long sub-list as shown of total", async () => {
      const user = userEvent.setup()
      const big: CommandItem[] = [{ id: "rooms", label: "Rooms", items: many }]
      render(<Palette defaultOpen items={big} />)
      await user.keyboard("{Enter}")
      await waitFor(() => expect(screen.getAllByRole("status").map((e) => e.textContent)).toContain("Rooms, 50 of 120 options"))
    })

    it("keeps aria-selected when an item renders as another element", async () => {
      const user = userEvent.setup()
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <CommandPalette items={items} defaultOpen>
          <CommandPaletteContent>
            <CommandPaletteInput />
            <CommandPaletteList>
              {(item) => <CommandPaletteItem key={item.id} item={item} render={<a href={`#${item.id}`} ref={ref} className="mine" />} />}
            </CommandPaletteList>
          </CommandPaletteContent>
        </CommandPalette>
      )
      screen.getByRole("combobox").focus()
      await user.keyboard("{ArrowDown}")
      const second = screen.getAllByRole("option")[1]
      expect(second.tagName).toBe("A")
      expect(second).toHaveClass("mine")
      expect(second).toHaveAttribute("aria-selected", "true")
      expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "false")
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    it("builds the highlight's pattern once per search, not per row", async () => {
      const user = userEvent.setup()
      render(<Palette defaultOpen items={many} />)
      const input = screen.getByRole("combobox")
      await user.type(input, "roo")
      const sources: string[] = []
      vi.stubGlobal(
        "RegExp",
        new Proxy(RegExp, {
          construct: (target, args) => (sources.push(String(args[0])), Reflect.construct(target, args)),
        })
      )
      onTestFinished(() => void vi.unstubAllGlobals())
      await user.type(input, "m")
      expect(sources.filter((source) => source === "(room)")).toHaveLength(1)
    })

    it("keeps one shortcut listener while an inline onOpenChange changes", () => {
      const add = vi.spyOn(document, "addEventListener")
      onTestFinished(() => add.mockRestore())
      const { rerender } = render(<Palette onOpenChange={() => {}} />)
      const keydowns = () => add.mock.calls.filter(([type]) => type === "keydown").length
      const before = keydowns()
      rerender(<Palette onOpenChange={() => {}} />)
      rerender(<Palette onOpenChange={() => {}} />)
      expect(keydowns()).toBe(before)
    })

    it("settles after Escape leaves a sub-list", async () => {
      const user = userEvent.setup()
      let commits = 0
      render(
        <React.Profiler id="palette" onRender={() => commits++}>
          <Palette defaultOpen />
        </React.Profiler>
      )
      await user.type(screen.getByRole("combobox"), "theme")
      await user.keyboard("{Enter}")
      await act(() => new Promise((resolve) => setTimeout(resolve, 20)))
      commits = 0
      await user.keyboard("{Escape}")
      await act(() => new Promise((resolve) => setTimeout(resolve, 50)))
      const settled = commits
      expect(settled).toBeLessThan(10)
      await act(() => new Promise((resolve) => setTimeout(resolve, 50)))
      expect(commits).toBe(settled)
      expect(options()).toContain("Reports")
      expect(screen.getByRole("dialog")).toBeInTheDocument()
    })
  })

  it("names the search after a sub-list and announces it", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    await user.type(screen.getByRole("combobox"), "theme")
    await user.keyboard("{Enter}")
    expect(screen.getByRole("combobox", { name: "Change theme" })).toBeInTheDocument()
    expect(screen.getAllByRole("status").map((e) => e.textContent)).toContain("Change theme, 2 options")
    await user.keyboard("{Escape}")
    expect(screen.getByRole("combobox", { name: "Command palette" })).toBeInTheDocument()
  })

  it("marks the highlighted option selected", async () => {
    const user = userEvent.setup()
    render(<Palette defaultOpen />)
    const selected = () => screen.getAllByRole("option").filter((o) => o.getAttribute("aria-selected") === "true")
    expect(selected().map((o) => o.textContent)).toEqual(["InboxG I"])
    screen.getByRole("combobox").focus()
    await user.keyboard("{ArrowDown}")
    expect(selected().map((o) => o.textContent)).toEqual(["Reports"])
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-activedescendant", selected()[0].id)
  })

  describe("on a phone", () => {
    let restore: () => void
    beforeEach(() => {
      restore = asPhone()
    })
    afterEach(() => restore())

    it("opens a record with focus on Back, hides the list, and returns to the field", async () => {
      const user = userEvent.setup()
      render(<Palette defaultOpen />)
      await user.type(screen.getByRole("combobox"), "ada")
      await user.keyboard("{Enter}")
      const back = await screen.findByRole("button", { name: "Back to search" })
      await waitFor(() => expect(back).toHaveFocus())
      expect(document.querySelector('[data-slot="command-palette-list"]')!.closest("[inert]")).not.toBeNull()
      await user.click(back)
      await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus())
      expect(document.querySelector("[inert]")).toBeNull()
    })

    it("takes a translated name for Back", async () => {
      const user = userEvent.setup()
      render(
        <CommandPalette items={items} defaultOpen>
          <CommandPaletteContent>
            <CommandPaletteInput />
            <CommandPaletteBody>
              <CommandPaletteList />
              <CommandPalettePreview backLabel="Suche" backAriaLabel="Zurück zur Suche" />
            </CommandPaletteBody>
          </CommandPaletteContent>
        </CommandPalette>
      )
      await user.type(screen.getByRole("combobox"), "ada")
      await user.keyboard("{Enter}")
      expect(await screen.findByRole("button", { name: "Zurück zur Suche" })).toHaveTextContent("Suche")
    })

    it("moves the highlight the way the arrows point on the bottom-up list", async () => {
      const user = userEvent.setup()
      render(<Palette defaultOpen />)
      const input = screen.getByRole("combobox")
      await user.click(input)
      await waitFor(() => expect(input).toHaveAttribute("aria-activedescendant"))
      const first = input.getAttribute("aria-activedescendant")
      expect(document.getElementById(first!)).toHaveTextContent("Inbox")
      await user.keyboard("{ArrowUp}")
      await waitFor(() => expect(document.getElementById(input.getAttribute("aria-activedescendant")!)).toHaveTextContent("Reports"))
      await user.keyboard("{ArrowDown}")
      await waitFor(() => expect(document.getElementById(input.getAttribute("aria-activedescendant")!)).toHaveTextContent("Inbox"))
    })
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
      expect(entry()).toMatchObject({ component: "combobox", open: false, hint: expect.stringContaining("Actions: Run; People: ") })
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

    it("runs on a closed palette without closing it again", async () => {
      const onOpenChange = vi.fn()
      const { run } = mount({ onOpenChange })
      const result = await run("select", "Inbox")
      expect(result.ok).toBe(true)
      expect(onOpenChange).not.toHaveBeenCalled()
    })

    it("steps back out of a sub-list", async () => {
      const { run, entry } = mount()
      await run("select", "Change theme")
      await waitFor(() => expect(entry().actions).toContain("back"))
      const result = await run("back")
      expect(result.steps[0].result).toContainEqual({ label: "Inbox", group: "Pages" })
      await waitFor(() => expect(entry().items).toContain("Reports"))
    })

    it("reports only the rows the search shows", async () => {
      const many: CommandItem[] = Array.from({ length: 80 }, (_, i) => ({ id: `r${i}`, label: `Room ${i}` }))
      const { run, entry } = mount({ items: many, limit: 5 })
      const result = await run("search", "room")
      expect(result.steps[0].result).toHaveLength(5)
      expect(entry().items).toHaveLength(5)
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
