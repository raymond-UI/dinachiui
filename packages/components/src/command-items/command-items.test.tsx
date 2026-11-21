import { commandsHint } from "./command-items"

describe("commandsHint", () => {
  it("lists each group's actions once", () => {
    const hint = commandsHint([
      { id: "ada", label: "Ada", group: "People", actions: [{ id: "open", label: "Open" }, { id: "email", label: "Email" }] },
      { id: "grace", label: "Grace", group: "People", actions: [{ id: "open", label: "Open" }] },
    ])
    expect(hint).toBe("Runs commands. select takes a label, then an action: People: Open, Email.")
  })

  it("leaves out the group name for ungrouped items", () => {
    expect(commandsHint([{ id: "ada", label: "Ada", actions: [{ id: "open", label: "Open" }] }])).toBe(
      "Runs commands. select takes a label, then an action: Open.",
    )
  })

  it("stops at the label when nothing has actions", () => {
    expect(commandsHint([{ id: "ada", label: "Ada" }])).toBe("Runs commands. select takes a label.")
    expect(commandsHint([])).toBe("Runs commands. select takes a label.")
  })
})
