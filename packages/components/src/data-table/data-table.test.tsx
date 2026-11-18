import * as React from "react"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AgentProvider, createAgent } from "../agent"
import { agentConformance } from "../test/agent-conformance"
import { DataTable, DataTableAction, DataTableRowTrigger, createColumnHelper, type ColumnDef } from "./data-table"

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
    const actions = vi.fn((rows: Order[]) => <button type="button">Refund {rows.length}</button>)
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
    await user.click(await screen.findByRole("menuitem", { name: "Refund" }))
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

describe("DataTable: phone", () => {
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
