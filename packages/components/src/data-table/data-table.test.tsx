import * as React from "react"
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AgentProvider, createAgent } from "../agent"
import { agentConformance } from "../test/agent-conformance"
import {
  DataTable,
  DataTableAction,
  DataTableRowTrigger,
  createColumnHelper,
  type ColumnDef,
  type DataTableSelection,
} from "./data-table"

interface Order {
  id: string
  customer: string
  status: "Paid" | "Pending" | "Failed" | "Refunded"
  items: number
  amount: number
  lines?: Order[]
}

const STATUSES: Order["status"][] = ["Paid", "Paid", "Pending", "Paid", "Failed", "Paid", "Refunded", "Paid"]
const NAMES = ["Ada Obi", "Bea Lund", "Cal Ito", "Dee Park", "Eli Moss", "Fay Chen", "Gus Hale", "Hal Roy"]

function orders(n: number): Order[] {
  return Array.from({ length: n }, (_, i) => ({
    id: String(4821 - i),
    customer: NAMES[i % NAMES.length],
    status: STATUSES[i % STATUSES.length],
    items: (i % 5) + 1,
    amount: 10 + ((i * 37) % 200),
  }))
}

const col = createColumnHelper<Order>()
const columns: ColumnDef<Order, any>[] = [
  col.accessor("id", {
    header: "Order",
    size: 84,
    meta: { pin: "left", phone: "meta" },
    cell: (c) => <DataTableRowTrigger>#{c.getValue()}</DataTableRowTrigger>,
  }),
  col.accessor("customer", { header: "Customer", meta: { phone: "title" } }),
  col.accessor("status", { header: "Status", size: 100, meta: { phone: "meta" } }),
  col.accessor("items", { header: "Items", size: 64, meta: { numeric: true } }),
  col.accessor("amount", {
    header: "Amount",
    size: 96,
    meta: { numeric: true, phone: "value", sortLabels: ["Lowest", "Highest"] },
    cell: (c) => `£${c.getValue()}`,
  }),
]

const noun = { singular: "order", plural: "orders" }
const head = (name: string) => screen.getByRole("columnheader", { name: new RegExp(`^${name}`) })
const sortButton = (name: string) => within(head(name)).getByRole("button")
const bodyRows = () => within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")
const firstCustomers = (n = 3) => bodyRows().slice(0, n).map((r) => within(r).getAllByRole("cell")[2].textContent)
const amounts = () => bodyRows().map((r) => Number(within(r).getAllByRole("cell").slice(-1)[0].textContent!.slice(1)))

function Orders(props: Partial<React.ComponentProps<typeof DataTable<Order>>>) {
  return <DataTable<Order> data={orders(24)} columns={columns} noun={noun} facet={{ column: "status" }} {...props} />
}

describe("DataTable: sorting", () => {
  it("sorts by a header and reports it on aria-sort", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    expect(head("Amount")).not.toHaveAttribute("aria-sort")
    await user.click(sortButton("Amount"))
    expect(head("Amount")).toHaveAttribute("aria-sort", "descending")
    const desc = amounts()
    expect([...desc].sort((a, b) => b - a)).toEqual(desc)
    await user.click(sortButton("Amount"))
    expect(head("Amount")).toHaveAttribute("aria-sort", "ascending")
    expect(screen.getByRole("status")).toHaveTextContent("Sorted by Amount, ascending. 24 orders.")
  })

  it("adds a second sort with Shift and numbers both", async () => {
    const user = userEvent.setup()
    const onSortingChange = vi.fn()
    render(<Orders onSortingChange={onSortingChange} />)
    await user.click(sortButton("Customer"))
    await user.keyboard("{Shift>}")
    await user.click(sortButton("Amount"))
    await user.keyboard("{/Shift}")
    expect(onSortingChange).toHaveBeenLastCalledWith(
      [
        { id: "customer", desc: false },
        { id: "amount", desc: true },
      ],
      expect.objectContaining({ reason: "sort" })
    )
    expect(head("Customer").querySelector("sup")).toHaveTextContent("1")
    expect(head("Amount").querySelector("sup")).toHaveTextContent("2")
  })
})

describe("DataTable: filtering", () => {
  it("searches across columns", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    await user.type(screen.getByRole("searchbox", { name: "Search orders" }), "Cal")
    expect(bodyRows()).toHaveLength(3)
    expect(screen.getByRole("heading", { name: "3 orders" })).toBeInTheDocument()
  })

  it("filters by a facet chip, with counts", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    const group = screen.getByRole("group", { name: "Filter orders by Status" })
    expect(within(group).getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true")
    const failed = within(group).getByRole("button", { name: "Failed 3" })
    await user.click(failed)
    expect(failed).toHaveAttribute("aria-pressed", "true")
    expect(bodyRows()).toHaveLength(3)
  })

  it("says why nothing shows, and clears the filters", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    await user.type(screen.getByRole("searchbox"), "zzz")
    expect(screen.getByText("No orders match “zzz”")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Clear filters" }))
    expect(bodyRows()).toHaveLength(10)
  })
})

describe("DataTable: states", () => {
  it("draws skeleton rows under the real header while loading", () => {
    render(<Orders loading />)
    expect(head("Amount")).toBeInTheDocument()
    expect(screen.getByRole("grid")).toHaveAttribute("aria-busy", "true")
    expect(bodyRows()).toHaveLength(10)
    expect(screen.queryByText("Ada Obi")).not.toBeInTheDocument()
  })

  it("shows an error with a retry", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<Orders error onRetry={onRetry} />)
    expect(screen.getByText("Couldn't load orders.")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Try again" }))
    expect(onRetry).toHaveBeenCalled()
  })

  it("names the empty table by its noun", () => {
    render(<Orders data={[]} />)
    expect(screen.getByText("No orders yet")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument()
  })

  it("names an empty facet", () => {
    render(<Orders defaultColumnFilters={[{ id: "status", value: "Refunded" }]} data={orders(3)} />)
    expect(screen.getByText("No refunded orders")).toBeInTheDocument()
  })
})

describe("DataTable: selection", () => {
  it("selects the page, then everything that matches", async () => {
    const user = userEvent.setup()
    const onRowSelectionChange = vi.fn()
    render(<Orders onRowSelectionChange={onRowSelectionChange} />)
    const page = screen.getByRole("checkbox", { name: "Select page" })
    await user.click(screen.getByRole("checkbox", { name: "Select Order 4821" }))
    expect(screen.getByRole("checkbox", { name: "Select page" })).toHaveAttribute("data-indeterminate")
    expect(screen.getByText("selected").parentElement).toHaveTextContent("1 selected")
    await user.click(screen.getByRole("checkbox", { name: "Select page" }))
    expect(page).toBeTruthy()
    expect(screen.getByText("selected").parentElement).toHaveTextContent("10 selected")
    await user.click(screen.getByRole("button", { name: "Select all 24" }))
    expect(screen.getByText("selected").parentElement).toHaveTextContent("24 selected")
    expect(Object.keys(onRowSelectionChange.mock.lastCall![0])).toHaveLength(24)
    await user.click(screen.getByRole("button", { name: "Clear" }))
    expect(screen.getByRole("searchbox")).toBeInTheDocument()
  })

  it("hands the selected rows to the selection actions", async () => {
    const user = userEvent.setup()
    const actions = vi.fn((rows: Order[], _clear: () => void, _selection: DataTableSelection) => (
      <button type="button">Refund {rows.length}</button>
    ))
    render(<Orders selectionActions={actions} />)
    await user.click(screen.getByRole("checkbox", { name: "Select Order 4820" }))
    expect(screen.getByRole("button", { name: "Refund 1" })).toBeInTheDocument()
    expect(actions.mock.lastCall![0][0].id).toBe("4820")
  })
})

describe("DataTable: pagination", () => {
  it("pages and changes the page size", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    expect(screen.getByText("1–10 of 24")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Page 3" }))
    expect(screen.getByText("21–24 of 24")).toBeInTheDocument()
    expect(bodyRows()).toHaveLength(4)
    await user.click(screen.getByRole("combobox", { name: "Rows per page" }))
    await user.click(await screen.findByRole("option", { name: "25" }))
    expect(screen.getByText("1–24 of 24")).toBeInTheDocument()
  })

  it("goes back to page 1 on a sort", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    await user.click(screen.getByRole("button", { name: "Page 2" }))
    await user.click(sortButton("Amount"))
    expect(screen.getByText("1–10 of 24")).toBeInTheDocument()
  })
})

describe("DataTable: columns", () => {
  it("hides a column from the Columns menu", async () => {
    const user = userEvent.setup()
    const onColumnVisibilityChange = vi.fn()
    render(<Orders onColumnVisibilityChange={onColumnVisibilityChange} />)
    await user.click(screen.getByRole("button", { name: "Columns" }))
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Items" }))
    expect(onColumnVisibilityChange).toHaveBeenLastCalledWith({ items: false }, expect.anything())
    expect(screen.queryByRole("columnheader", { name: /^Items/ })).not.toBeInTheDocument()
    expect(screen.getByRole("menuitemcheckbox", { name: "Items" })).toBeInTheDocument()
  })

  it("opens the Columns menu at the end of its trigger, leaving out columns that cannot hide", async () => {
    const user = userEvent.setup()
    const fixed = columns.map((c, i) => (i === 0 ? { ...c, enableHiding: false } : c))
    render(<Orders columns={fixed} />)
    await user.click(screen.getByRole("button", { name: "Columns" }))
    await screen.findByRole("menuitemcheckbox", { name: "Items" })
    expect(screen.queryByRole("menuitemcheckbox", { name: "Order" })).not.toBeInTheDocument()
    expect(document.querySelector('[data-slot="menu-positioner"]')).toHaveAttribute("data-align", "end")
  })

  it("sizes each column in header order", () => {
    render(<Orders rowActions={() => null} />)
    const widths = Array.from(screen.getByRole("grid").querySelectorAll("col"), (c) => c.style.width)
    expect(widths).toEqual(["44px", "84px", "", "100px", "64px", "96px", "44px"])
    expect(screen.getAllByRole("columnheader").map((th) => th.getAttribute("data-column"))).toEqual([
      "select", "id", "customer", "status", "items", "amount", "actions",
    ])
  })

  it("resizes from the keyboard", () => {
    render(<Orders />)
    const handle = screen.getByRole("separator", { name: "Resize Amount" })
    expect(handle).toHaveAttribute("aria-valuenow", "96")
    fireEvent.keyDown(handle, { key: "ArrowRight" })
    expect(handle).toHaveAttribute("aria-valuenow", "112")
  })

  it("moves a column from the menu", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    await user.click(screen.getByRole("button", { name: "Columns" }))
    await user.click(await screen.findByRole("menuitem", { name: "Move columns" }))
    fireEvent.click(await screen.findByRole("menuitem", { name: "Move Amount left" }))
    const names = screen.getAllByRole("columnheader").map((th) => th.textContent)
    expect(names.indexOf("Amount")).toBeLessThan(names.indexOf("Items"))
  })
})

describe("DataTable: expand", () => {
  it("shows sub rows under a row", async () => {
    const user = userEvent.setup()
    const data = orders(3).map((o, i) =>
      i === 0 ? { ...o, lines: [{ ...o, id: `${o.id}-a`, customer: "Mug" }, { ...o, id: `${o.id}-b`, customer: "Pen" }] } : o
    )
    render(<Orders data={data} getSubRows={(o) => o.lines} />)
    expect(screen.queryByText("Mug")).not.toBeInTheDocument()
    const toggle = screen.getAllByRole("button", { name: "Show details" })[0]
    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Mug")).toBeInTheDocument()
    expect(screen.getByText("1–3 of 3")).toBeInTheDocument()
  })
})

describe("DataTable: full-width panels", () => {
  it("sizes the sub panel and the empty message to the scroll area, not the table", async () => {
    const user = userEvent.setup()
    const width = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(320)
    try {
      const { rerender } = render(<Orders renderSubComponent={(row) => <p>Lines of {row.id}</p>} getRowCanExpand={() => true} />)
      const container = screen.getByRole("grid").parentElement!
      expect(container.style.getPropertyValue("--data-table-viewport")).toBe("320px")
      await user.click(screen.getAllByRole("button", { name: "Show details" })[0])
      const panel = screen.getByText("Lines of 4821").closest('[data-slot="data-table-sub-panel"]')
      expect(panel).toHaveClass("sticky", "left-0", "w-[var(--data-table-viewport,100%)]")
      rerender(<Orders data={[]} />)
      expect(screen.getByText("No orders yet").closest(".sticky")).not.toBeNull()
    } finally {
      width.mockRestore()
    }
  })
})

describe("DataTable: row actions and sheet", () => {
  it("opens a row's menu and its detail sheet", async () => {
    const user = userEvent.setup()
    const onRefund = vi.fn()
    render(
      <Orders
        rowActions={(o) => (
          <DataTableAction destructive onClick={() => onRefund(o.id)}>
            Refund
          </DataTableAction>
        )}
      />
    )
    await user.click(screen.getByRole("button", { name: "Actions for Order 4821" }))
    const refund = await screen.findByRole("menuitem", { name: "Refund" })
    expect(refund.closest('[data-slot="menu-positioner"]')).toHaveAttribute("data-align", "end")
    await user.click(refund)
    expect(onRefund).toHaveBeenCalledWith("4821")

    await user.click(screen.getByRole("button", { name: "#4820" }))
    const sheet = await screen.findByRole("dialog")
    expect(within(sheet).getByText("Order 4820")).toBeInTheDocument()
    expect(within(sheet).getByText("Customer")).toBeInTheDocument()
  })
})

describe("DataTable: keyboard", () => {
  it("is one tab stop and moves by arrows", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    const grid = screen.getByRole("grid")
    const stops = grid.querySelectorAll('[tabindex="0"]')
    expect(stops).toHaveLength(1)
    const first = screen.getByRole("checkbox", { name: "Select Order 4821" })
    first.focus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("button", { name: "#4821" })).toHaveFocus()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("button", { name: "#4820" })).toHaveFocus()
    await user.keyboard("{ArrowUp}{ArrowUp}")
    expect(document.activeElement?.closest("th")).toBe(head("Order"))
    await user.keyboard("{ArrowDown}{End}")
    expect(document.activeElement?.closest("td")).toBe(within(bodyRows()[0]).getAllByRole("cell").slice(-1)[0])
    await user.keyboard("{Home}")
    expect(first).toHaveFocus()
    expect(grid.querySelectorAll('[tabindex="0"]')).toHaveLength(1)
  })

  it("toggles the row with Space from a cell", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    const cell = within(bodyRows()[0]).getAllByRole("cell")[2]
    cell.focus()
    await user.keyboard(" ")
    expect(bodyRows()[0]).toHaveAttribute("aria-selected", "true")
  })
})

describe("DataTable: server mode", () => {
  it("hands sorting, search and paging to the callbacks", async () => {
    const user = userEvent.setup()
    const onSortingChange = vi.fn()
    const onPaginationChange = vi.fn()
    const onStateChange = vi.fn()
    const page = orders(10)
    render(
      <Orders
        data={page}
        rowCount={248}
        onSortingChange={onSortingChange}
        onPaginationChange={onPaginationChange}
        onStateChange={onStateChange}
        facet={{ column: "status", options: [{ value: "Paid", count: 201 }, { value: "Failed", count: 9 }] }}
      />
    )
    expect(screen.getByText("1–10 of 248")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Paid 201" })).toBeInTheDocument()
    const before = firstCustomers(10)
    await user.click(sortButton("Customer"))
    expect(onSortingChange).toHaveBeenCalledWith([{ id: "customer", desc: false }], expect.anything())
    expect(firstCustomers(10)).toEqual(before)
    await user.type(screen.getByRole("searchbox"), "a")
    expect(bodyRows()).toHaveLength(10)
    await user.click(screen.getByRole("button", { name: "Page 25" }))
    expect(onPaginationChange).toHaveBeenLastCalledWith({ pageIndex: 24, pageSize: 10 }, expect.anything())
    expect(onStateChange).toHaveBeenLastCalledWith(expect.objectContaining({ globalFilter: "a" }), expect.anything())
  })
})

describe("DataTable: virtualize", () => {
  it("renders a window of rows and no pagination", () => {
    // jsdom lays nothing out, so the scroller reports the size the virtualiser reads.
    const height = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(452)
    try {
      render(<Orders data={orders(500)} virtualize />)
      const rows = bodyRows().filter((r) => !r.hasAttribute("data-spacer"))
      expect(rows.length).toBeGreaterThan(5)
      expect(rows.length).toBeLessThan(60)
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument()
      expect(screen.getByText("500 orders", { selector: "[data-slot='data-table-range']" })).toBeInTheDocument()
    } finally {
      height.mockRestore()
    }
  })
})

function onPhone() {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    matches: query.includes("max-width"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

describe("DataTable: phone", () => {
  let restore: () => void = () => {}
  afterEach(() => restore())

  it("orders the meta line by phoneOrder and renders phoneCell there only", async () => {
    restore = onPhone()
    const user = userEvent.setup()
    const phoneColumns: ColumnDef<Order, any>[] = [
      col.accessor("customer", { header: "Customer", meta: { phone: "title" } }),
      col.accessor("status", { header: "Status", meta: { phone: "meta", phoneOrder: 2 } }),
      col.accessor("items", {
        header: "Items",
        meta: { phone: "meta", phoneOrder: 1, phoneCell: (c) => `${c.getValue()} pcs` },
        cell: (c) => `${c.getValue()} items in the box`,
      }),
      col.accessor("id", { header: "Order", meta: { phone: "meta" } }),
    ]
    render(<Orders columns={phoneColumns} />)
    const first = within(screen.getByRole("list", { name: "Orders" })).getAllByRole("button")[0]
    expect(first).toHaveTextContent(/^Ada Obi4821\s*1 pcs\s*Paid$/)
    await user.click(first)
    expect(within(await screen.findByRole("dialog")).getByText("1 items in the box")).toBeInTheDocument()
  })

  it("puts the row actions in the sheet", async () => {
    restore = onPhone()
    const user = userEvent.setup()
    const onRefund = vi.fn()
    render(<Orders rowActions={(o) => <DataTableAction onClick={() => onRefund(o.id)}>Refund</DataTableAction>} />)
    await user.click(within(screen.getByRole("list", { name: "Orders" })).getAllByRole("button")[1])
    const sheet = await screen.findByRole("dialog")
    await user.click(within(sheet).getByRole("button", { name: "Actions for Order 4820" }))
    await user.click(await screen.findByRole("menuitem", { name: "Refund" }))
    expect(onRefund).toHaveBeenCalledWith("4820")
  })

  it("selects rows in Select mode and leaves it with Done", async () => {
    restore = onPhone()
    const user = userEvent.setup()
    const onRowSelectionChange = vi.fn()
    render(<Orders onRowSelectionChange={onRowSelectionChange} selectionActions={() => <button type="button">Export</button>} />)
    await user.click(screen.getByRole("button", { name: "Select" }))
    const rows = within(screen.getByRole("list", { name: "Orders" })).getAllByRole("checkbox")
    expect(rows).toHaveLength(10)
    await user.click(rows[1])
    expect(rows[1]).toHaveAttribute("aria-checked", "true")
    expect(onRowSelectionChange).toHaveBeenLastCalledWith({ "4820": true }, expect.anything())
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    const bar = screen.getByText("selected").parentElement!.parentElement!
    expect(bar).toHaveTextContent("1 selected")
    expect(within(bar).getByRole("button", { name: "Export" })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Done" }))
    expect(onRowSelectionChange).toHaveBeenLastCalledWith({}, expect.anything())
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0)
    expect(screen.getByRole("searchbox")).toBeInTheDocument()
  })

  it("keeps both rows when two are tapped in one event", async () => {
    restore = onPhone()
    const user = userEvent.setup()
    render(<Orders />)
    await user.click(screen.getByRole("button", { name: "Select" }))
    const rows = within(screen.getByRole("list", { name: "Orders" })).getAllByRole("checkbox")
    act(() => {
      rows[0].click()
      rows[2].click()
    })
    expect(screen.getByText("selected").parentElement).toHaveTextContent("2 selected")
  })

  it("starts selection on a long press, without opening the row", () => {
    restore = onPhone()
    vi.useFakeTimers()
    try {
      render(<Orders />)
      const row = within(screen.getByRole("list", { name: "Orders" })).getAllByRole("button")[2]
      fireEvent.pointerDown(row, { pointerType: "touch" })
      act(() => vi.advanceTimersByTime(500))
      fireEvent.pointerUp(row, { pointerType: "touch" })
      fireEvent.click(row)
      const checked = within(screen.getByRole("list", { name: "Orders" })).getAllByRole("checkbox")[2]
      expect(checked).toHaveAttribute("aria-checked", "true")
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it("lets the agent select rows on phone", async () => {
    restore = onPhone()
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Orders />
      </AgentProvider>
    )
    expect(await agent.act({ steps: [{ ref: "Select orders", action: "select", args: ["Order 4820"] }] })).toMatchObject({ ok: true })
    expect(within(screen.getByRole("list", { name: "Orders" })).getAllByRole("checkbox")[1]).toHaveAttribute("aria-checked", "true")
  })

  it("lists rows with their own layout and opens the sheet", async () => {
    const original = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
    try {
      const user = userEvent.setup()
      render(<Orders />)
      expect(screen.queryByRole("grid")).not.toBeInTheDocument()
      const list = screen.getByRole("list", { name: "Orders" })
      const items = within(list).getAllByRole("button")
      expect(items).toHaveLength(10)
      expect(items[0]).toHaveTextContent("Ada Obi")
      expect(screen.getByRole("button", { name: "Sort orders: Sort" })).toBeInTheDocument()
      await user.click(items[1])
      expect(within(await screen.findByRole("dialog")).getByText("Order 4820")).toBeInTheDocument()
    } finally {
      window.matchMedia = original
    }
  })
})

describe("DataTable: agent", () => {
  function mount(props: Partial<React.ComponentProps<typeof DataTable<Order>>> = {}) {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Orders {...props} />
      </AgentProvider>
    )
    return agent
  }

  it("lists the table's controls by name", () => {
    const labels = mount().snapshot().map((c) => c.label)
    expect(labels).toEqual(
      expect.arrayContaining(["Sort orders", "Select orders", "Search orders", "Filter orders by Status", "Pages of orders", "Rows per page"])
    )
    expect(labels).not.toContain("Select Order 4821")
  })

  it("sorts, searches, filters and pages", async () => {
    const agent = mount()
    expect(await agent.act({ steps: [{ ref: "Sort orders", action: "select", args: ["Amount ascending"] }] })).toMatchObject({ ok: true })
    expect(head("Amount")).toHaveAttribute("aria-sort", "ascending")
    expect(await agent.act({ steps: [{ ref: "Sort orders", action: "select", args: ["Highest"] }] })).toMatchObject({ ok: true })
    expect(head("Amount")).toHaveAttribute("aria-sort", "descending")
    await agent.act({ steps: [{ ref: "Filter orders by Status", action: "select", args: ["Paid"] }] })
    expect(bodyRows()).toHaveLength(10)
    await agent.act({ steps: [{ ref: "Pages of orders", action: "setValue", args: [2] }] })
    expect(screen.getByText("11–15 of 15")).toBeInTheDocument()
    await agent.act({ steps: [{ ref: "Search orders", action: "setValue", args: ["Ada"] }] })
    await waitFor(() => expect(bodyRows()).toHaveLength(3))
    expect(screen.getByText("1–3 of 3")).toBeInTheDocument()
  })

  it("selects rows by name, and all of them", async () => {
    const agent = mount()
    const one = await agent.act({ steps: [{ ref: "Select orders", action: "select", args: ["Order 4820"] }] })
    expect(one).toMatchObject({ ok: true })
    expect(bodyRows()[1]).toHaveAttribute("aria-selected", "true")
    await agent.act({ steps: [{ ref: "Select orders", action: "select", args: ["all"] }] })
    expect(screen.getByText("selected").parentElement).toHaveTextContent("24 selected")
    const missing = await agent.act({ steps: [{ ref: "Select orders", action: "select", args: ["Order 1"] }] })
    expect(missing).toMatchObject({ ok: false })
    expect(JSON.stringify(missing)).toContain('No order \\"Order 1\\"')
  })

  it("refuses a sort the table cannot do, naming what it can", async () => {
    const agent = mount()
    const result = await agent.act({ steps: [{ ref: "Sort orders", action: "select", args: ["Colour"] }] })
    expect(result).toMatchObject({ ok: false })
    expect(JSON.stringify(result)).toContain("Sortable: Order, Customer, Status, Items, Amount.")
  })
})

agentConformance({
  name: "DataTable",
  label: "Sort orders",
  render: ({ onChange, disabled }) => <Orders disabled={disabled} onSortingChange={onChange} />,
  entry: { component: "select", multiple: true, value: [], actions: ["select", "setValue", "clear"] },
  act: { action: "select", args: ["Amount descending"], result: { ok: true, value: ["Amount descending"] } },
  invalid: { action: "select", args: ["Colour"], lists: ["Customer", "Amount"] },
  // The page-size Select mounts in four commits on its own; the table adds none.
  commits: 4,
  person: async (user) => {
    await user.click(screen.getByRole("button", { name: "Amount" }))
  },
})

describe("DataTable: controlled through onStateChange", () => {
  it("keeps a sort when it also sends the page back to 1", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [state, setState] = React.useState({
        sorting: [] as { id: string; desc: boolean }[],
        pagination: { pageIndex: 1, pageSize: 10 },
      })
      return (
        <Orders
          sorting={state.sorting}
          pagination={state.pagination}
          onStateChange={(next) => setState({ sorting: next.sorting, pagination: next.pagination })}
        />
      )
    }
    render(<Controlled />)
    expect(screen.getByText("11–20 of 24")).toBeInTheDocument()
    await user.click(sortButton("Amount"))
    expect(head("Amount")).toHaveAttribute("aria-sort", "descending")
    expect(screen.getByText("1–10 of 24")).toBeInTheDocument()
  })
})

describe("DataTable: columns after hiding", () => {
  it("moves a column past its visible neighbour when a hidden one sits between", async () => {
    const user = userEvent.setup()
    render(<Orders defaultColumnVisibility={{ customer: false }} />)
    await user.click(screen.getByRole("button", { name: "Columns" }))
    await user.click(await screen.findByRole("menuitem", { name: "Move columns" }))
    fireEvent.click(await screen.findByRole("menuitem", { name: "Move Amount left" }))
    const names = screen.getAllByRole("columnheader").map((th) => th.getAttribute("data-column"))
    expect(names).toEqual(["select", "id", "status", "amount", "items"])
  })

  it("names a header by its label, not the resize handle's width", () => {
    render(<Orders />)
    expect(screen.getByRole("columnheader", { name: "Amount" })).toBeInTheDocument()
  })

  it("takes column order and sizes as controlled state", async () => {
    const onColumnOrderChange = vi.fn()
    const onColumnSizingChange = vi.fn()
    render(
      <Orders
        columnOrder={["id", "amount", "customer", "status", "items"]}
        onColumnOrderChange={onColumnOrderChange}
        columnSizing={{ amount: 200 }}
        onColumnSizingChange={onColumnSizingChange}
      />
    )
    expect(screen.getAllByRole("columnheader").map((th) => th.getAttribute("data-column"))).toEqual([
      "select", "id", "amount", "customer", "status", "items",
    ])
    const handle = screen.getByRole("separator", { name: "Resize Amount" })
    expect(handle).toHaveAttribute("aria-valuenow", "200")
    fireEvent.keyDown(handle, { key: "ArrowRight" })
    expect(onColumnSizingChange).toHaveBeenLastCalledWith({ amount: 216 }, expect.anything())
  })
})

describe("DataTable: selection and filters", () => {
  it("counts only the selected rows the filters show, and says how many they hide", async () => {
    const user = userEvent.setup()
    const actions = vi.fn((rows: Order[], _clear: () => void, _selection: DataTableSelection) => (
      <button type="button">Refund {rows.length}</button>
    ))
    render(<Orders selectionActions={actions} />)
    await user.click(screen.getByRole("checkbox", { name: "Select page" }))
    await user.click(screen.getByRole("button", { name: "Select all 24" }))
    await user.click(screen.getByRole("button", { name: "Failed 3" }))
    const bar = document.querySelector('[data-slot="data-table-selection-bar"]')!
    expect(bar).toHaveTextContent("3 selected")
    expect(bar).toHaveTextContent("21 hidden by filters")
    expect(screen.getByRole("button", { name: "Refund 3" })).toBeInTheDocument()
    expect(actions.mock.lastCall![2]).toEqual(expect.objectContaining({ count: 3, all: false }))
    expect(actions.mock.lastCall![2].hidden).toHaveLength(21)
    expect(actions.mock.lastCall![2].ids).toHaveLength(3)
  })

  it("keeps the search and columns in view while rows are selected", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    await user.click(screen.getByRole("checkbox", { name: "Select Order 4821" }))
    expect(screen.getByRole("searchbox", { name: "Search orders" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Columns" })).toBeInTheDocument()
  })

  it("leaves the header checkbox clear when the filters hide every selected row", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    await user.click(screen.getByRole("checkbox", { name: "Select Order 4821" }))
    await user.click(screen.getByRole("button", { name: "Failed 3" }))
    const page = screen.getByRole("checkbox", { name: "Select page" })
    expect(page).not.toHaveAttribute("data-indeterminate")
    expect(page).not.toHaveAttribute("data-checked")
  })

  it("formats a large selected count", async () => {
    const user = userEvent.setup()
    render(<Orders data={orders(1200)} pageSizes={[1200]} />)
    await user.click(screen.getByRole("checkbox", { name: "Select page" }))
    expect(document.querySelector('[data-slot="data-table-selection-bar"]')).toHaveTextContent("1,200 selected")
  })

  it("calls the header checkbox Select all when every row is in one scroll", () => {
    const height = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(452)
    try {
      render(<Orders data={orders(100)} virtualize />)
      expect(screen.getByRole("checkbox", { name: "Select all" })).toBeInTheDocument()
    } finally {
      height.mockRestore()
    }
  })
})

describe("DataTable: server selection", () => {
  it("selects every row on the server, and hands the actions every id", async () => {
    const user = userEvent.setup()
    const actions = vi.fn((_rows: Order[], _clear: () => void, _selection: DataTableSelection) => null)
    const { rerender } = render(<Orders data={orders(10)} rowCount={248} selectionActions={actions} />)
    await user.click(screen.getByRole("checkbox", { name: "Select page" }))
    await user.click(screen.getByRole("button", { name: "Select all 248" }))
    const bar = () => document.querySelector('[data-slot="data-table-selection-bar"]')!
    expect(bar()).toHaveTextContent("All 248 selected")
    expect(actions.mock.lastCall![2]).toEqual(expect.objectContaining({ all: true, count: 248 }))
    // The next page arrives already selected.
    const next = orders(20).slice(10)
    rerender(<Orders data={next} rowCount={248} selectionActions={actions} />)
    expect(screen.getByRole("checkbox", { name: `Select Order ${next[0].id}` })).toHaveAttribute("data-checked")
    expect(actions.mock.lastCall![2].ids).toHaveLength(20)
    await user.click(screen.getByRole("checkbox", { name: `Select Order ${next[0].id}` }))
    expect(bar()).toHaveTextContent("19 selected")
    expect(actions.mock.lastCall![2].all).toBe(false)
  })
})

describe("DataTable: opening a row", () => {
  it("opens a row on click or Enter, but not from its controls", async () => {
    const user = userEvent.setup()
    const onRowOpen = vi.fn()
    render(<Orders onRowOpen={onRowOpen} />)
    await user.click(within(bodyRows()[1]).getAllByRole("cell")[2])
    expect(onRowOpen).toHaveBeenLastCalledWith(expect.objectContaining({ id: "4820" }), expect.anything())
    await user.click(screen.getByRole("checkbox", { name: "Select Order 4819" }))
    expect(onRowOpen).toHaveBeenCalledTimes(1)
    const cell = within(bodyRows()[2]).getAllByRole("cell")[2]
    cell.focus()
    await user.keyboard("{Enter}")
    expect(onRowOpen).toHaveBeenLastCalledWith(expect.objectContaining({ id: "4819" }), expect.anything())
    await user.click(screen.getByRole("button", { name: "#4818" }))
    expect(onRowOpen).toHaveBeenLastCalledWith(expect.objectContaining({ id: "4818" }), expect.anything())
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("opens the sheet on Enter when there is no onRowOpen", async () => {
    const user = userEvent.setup()
    render(<Orders />)
    within(bodyRows()[0]).getAllByRole("cell")[2].focus()
    await user.keyboard("{Enter}")
    expect(within(await screen.findByRole("dialog")).getByText("Order 4821")).toBeInTheDocument()
  })
})

describe("DataTable: rendering work", () => {
  it("renders only the row whose selection changed", async () => {
    const user = userEvent.setup()
    const seen: string[] = []
    const counted = columns.map((c, i) =>
      i === 1
        ? {
            ...c,
            cell: (ctx: { row: { id: string }; getValue: () => unknown }) => {
              seen.push(ctx.row.id)
              return String(ctx.getValue())
            },
          }
        : c
    ) as ColumnDef<Order, any>[]
    render(<Orders columns={counted} rowActions={() => <DataTableAction>Refund</DataTableAction>} />)
    seen.length = 0
    await user.click(screen.getByRole("checkbox", { name: "Select Order 4820" }))
    expect(new Set(seen)).toEqual(new Set(["4820"]))
  })

  it("mounts a row's menu only once it opens", async () => {
    const user = userEvent.setup()
    render(<Orders rowActions={() => <DataTableAction>Refund</DataTableAction>} />)
    const grid = screen.getByRole("grid")
    expect(grid.querySelectorAll('[data-slot="menu-trigger"]')).toHaveLength(0)
    await user.click(screen.getByRole("button", { name: "Actions for Order 4821" }))
    expect(await screen.findByRole("menuitem", { name: "Refund" })).toBeInTheDocument()
    expect(grid.querySelectorAll('[data-slot="menu-trigger"]')).toHaveLength(1)
    expect(screen.getByRole("button", { name: "Actions for Order 4821" })).toHaveAttribute("aria-expanded", "true")
  })

  it("waits for a pause in typing before it searches, given a delay", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const onGlobalFilterChange = vi.fn()
      render(<Orders searchDelay={200} onGlobalFilterChange={onGlobalFilterChange} />)
      await user.type(screen.getByRole("searchbox"), "Cal")
      expect(screen.getByRole("searchbox")).toHaveValue("Cal")
      expect(onGlobalFilterChange).not.toHaveBeenCalled()
      await act(() => vi.advanceTimersByTimeAsync(250))
      expect(onGlobalFilterChange).toHaveBeenCalledTimes(1)
      expect(onGlobalFilterChange).toHaveBeenLastCalledWith("Cal", expect.anything())
      expect(bodyRows()).toHaveLength(3)
    } finally {
      vi.useRealTimers()
    }
  })

  it("reports the rows the filters leave", async () => {
    const user = userEvent.setup()
    const onFilteredRowsChange = vi.fn()
    render(<Orders onFilteredRowsChange={onFilteredRowsChange} />)
    expect(onFilteredRowsChange).toHaveBeenLastCalledWith(expect.any(Array))
    expect(onFilteredRowsChange.mock.lastCall![0]).toHaveLength(24)
    await user.click(screen.getByRole("button", { name: "Failed 3" }))
    expect(onFilteredRowsChange.mock.lastCall![0]).toHaveLength(3)
  })

  it("puts its own toolbar content beside the search", () => {
    render(<Orders toolbar={<button type="button">Channel</button>} />)
    const toolbar = document.querySelector('[data-slot="data-table-toolbar"]')!
    expect(within(toolbar as HTMLElement).getByRole("button", { name: "Channel" })).toBeInTheDocument()
  })
})

describe("DataTable: virtual rows and density", () => {
  it("sizes the scroll to the new row height after a density change", () => {
    const height = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(452)
    try {
      const total = () => {
        const body = screen.getAllByRole("rowgroup")[1]
        const spacers = Array.from(body.querySelectorAll<HTMLElement>("tr[data-spacer] > td"), (td) => parseFloat(td.style.height))
        const rows = body.querySelectorAll("tr[data-row-id]").length
        return { spacers: spacers.reduce((a, b) => a + b, 0), rows }
      }
      const { rerender } = render(<Orders data={orders(500)} virtualize />)
      const before = total()
      expect(before.spacers + before.rows * 48).toBe(500 * 48)
      rerender(<Orders data={orders(500)} virtualize density="compact" />)
      const after = total()
      expect(after.spacers + after.rows * 36).toBe(500 * 36)
    } finally {
      height.mockRestore()
    }
  })
})

describe("DataTable: loading and errors", () => {
  it("keeps the pager, and focus on it, while the next page loads", async () => {
    const user = userEvent.setup()
    function Server() {
      const [page, setPage] = React.useState(0)
      const [loading, setLoading] = React.useState(false)
      return (
        <Orders
          data={orders(10)}
          rowCount={248}
          loading={loading}
          pagination={{ pageIndex: page, pageSize: 10 }}
          onPaginationChange={(p) => {
            setPage(p.pageIndex)
            setLoading(true)
          }}
        />
      )
    }
    render(<Server />)
    await user.click(screen.getByRole("button", { name: "Page 2" }))
    expect(screen.getByRole("grid")).toHaveAttribute("aria-busy", "true")
    expect(document.activeElement).toHaveAccessibleName(/^Page 2\b/)
    expect(document.activeElement).toHaveAttribute("aria-current", "page")
  })

  it("alerts the error, says nothing of counts, and keeps focus in the table on retry", async () => {
    const user = userEvent.setup()
    function Failing() {
      const [state, setState] = React.useState<"error" | "loading" | "rows">("error")
      return (
        <Orders
          defaultSorting={[{ id: "amount", desc: true }]}
          error={state === "error"}
          loading={state === "loading"}
          onRetry={() => setState("loading")}
        />
      )
    }
    render(<Failing />)
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load orders.")
    expect(screen.getByRole("status")).toHaveTextContent("")
    await user.click(screen.getByRole("button", { name: "Try again" }))
    expect(document.activeElement).not.toBe(document.body)
    expect(screen.getByRole("grid").contains(document.activeElement)).toBe(true)
  })
})
