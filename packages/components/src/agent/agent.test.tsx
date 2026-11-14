import { useEffect, useRef, useState } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { z } from "zod"
import {
  AgentProvider,
  agentToolsFor,
  createAgent,
  useAgentAction,
  useAgentControl,
  isAgentChange,
  registerTools,
  runAgentTool,
  type Agent,
  type AgentSchema,
} from "./agent"
import { Input } from "../input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select"
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../dialog"

function Settings({
  onName,
  onRegion,
}: {
  onName?: (value: string) => void
  onRegion?: (value: unknown) => void
}) {
  return (
    <div>
      <label htmlFor="name">Project name</label>
      <Input id="name" defaultValue="Apollo" onValueChange={(v) => onName?.(v)} />
      <Input aria-label="API key" type="password" defaultValue="sk-123" />
      <Select onValueChange={onRegion}>
        <SelectTrigger aria-label="Region">
          <SelectValue>{(value) => value ?? "Pick a region"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">us</SelectItem>
          <SelectItem value="eu">eu</SelectItem>
        </SelectContent>
      </Select>
      <Dialog>
        <DialogTrigger>Delete project</DialogTrigger>
        <DialogPortal>
          <DialogPopup>
            <DialogTitle>Delete Apollo?</DialogTitle>
            <DialogClose>Cancel</DialogClose>
            <button data-agent-confirm="Deleting needs a person">Delete</button>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
      <div data-agent-hidden>
        <Input aria-label="Internal note" />
      </div>
    </div>
  )
}

const find = (agent: Agent, label: string) => agent.snapshot().find((c) => c.label === label)

describe("createAgent without a provider", () => {
  it("lists labelled controls with their values and actions", () => {
    render(<Settings />)
    const snapshot = createAgent().snapshot()

    expect(snapshot).toContainEqual({
      ref: expect.stringMatching(/^c\d+$/),
      component: "input",
      label: "Project name",
      value: "Apollo",
      actions: ["setValue", "clear"],
    })
    expect(snapshot.find((c) => c.component === "select")).toMatchObject({
      label: "Region",
      open: false,
      value: "Pick a region",
    })
    expect(snapshot.find((c) => c.label === "Delete project")).toMatchObject({
      component: "button",
      actions: ["press"],
    })
  })

  it("leaves out a popup that is animating closed", () => {
    render(
      <div role="dialog" aria-label="Closing" data-ending-style="">
        <button>Inside</button>
      </div>
    )
    expect(createAgent().snapshot()).toEqual([])
  })

  it("redacts secrets and leaves out hidden regions", () => {
    render(<Settings />)
    const agent = createAgent()
    expect(find(agent, "API key")?.value).toBe("[redacted]")
    expect(find(agent, "Internal note")).toBeUndefined()
  })

  it("keeps a control's ref between snapshots", () => {
    render(<Settings />)
    const agent = createAgent()
    expect(find(agent, "Project name")?.ref).toBe(find(agent, "Project name")?.ref)
  })

  it("sets an input's value through React", async () => {
    const onName = vi.fn()
    render(<Settings onName={onName} />)
    const agent = createAgent()

    const result = await agent.act({
      steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }],
    })

    expect(result).toMatchObject({ ok: true, steps: [{ action: "setValue", value: "Atlas" }] })
    expect(onName).toHaveBeenCalledWith("Atlas")
    expect(screen.getByLabelText("Project name")).toHaveValue("Atlas")
  })

  it("picks a select option by its text", async () => {
    const onRegion = vi.fn()
    render(<Settings onRegion={onRegion} />)
    const agent = createAgent()

    const result = await agent.act({ steps: [{ ref: "Region", action: "select", args: ["eu"] }] })

    expect(result.ok).toBe(true)
    expect(onRegion).toHaveBeenCalledWith("eu", expect.anything())
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent("eu"))
  })

  it("names the options when the one asked for is missing", async () => {
    render(<Settings />)
    const result = await createAgent().act({
      steps: [{ ref: "Region", action: "select", args: ["mars"] }],
    })
    expect(result.ok).toBe(false)
    expect(result.error?.message).toContain("Options: us, eu")
  })

  it("opens a dialog and reports what appeared", async () => {
    render(<Settings />)
    const agent = createAgent()

    const result = await agent.act({ steps: [{ ref: "Delete project", action: "press" }] })

    expect(result.ok).toBe(true)
    expect(result.appeared).toContainEqual(
      expect.objectContaining({ component: "dialog", label: "Delete Apollo?", actions: ["close"] })
    )
    // The page behind the modal is out of reach, so it is out of the snapshot too.
    expect(find(agent, "Project name")).toBeUndefined()

    await agent.act({ steps: [{ ref: "Delete Apollo?", action: "close" }] })
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("refuses a confirm control unless allow approves it", async () => {
    render(<Settings />)
    const open = { ref: "Delete project", action: "press" }

    const plain = createAgent()
    const refused = await plain.act({ steps: [open, { ref: "Delete", action: "press" }] })
    expect(plain.snapshot().find((c) => c.label === "Delete")).toMatchObject({ approval: "person" })
    expect(createAgent({ allow: () => true }).snapshot().find((c) => c.label === "Delete")).toMatchObject({
      approval: "ask",
    })
    expect(refused).toMatchObject({ ok: false, error: { step: 1, message: "Deleting needs a person" } })

    const allow = vi.fn(() => true)
    const approved = await createAgent({ allow }).act({ steps: [{ ref: "Delete", action: "press" }] })
    expect(approved.ok).toBe(true)
    expect(allow).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Delete", action: "press", confirm: "Deleting needs a person" }),
      expect.anything()
    )
  })

  it("stops at a step allow refuses", async () => {
    const onName = vi.fn()
    render(<Settings onName={onName} />)
    const result = await createAgent({ allow: () => false }).act({
      steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }],
    })
    expect(result).toMatchObject({ ok: false, error: { step: 0 } })
    expect(onName).not.toHaveBeenCalled()
  })

  it("rejects an action the control does not support", async () => {
    render(<Settings />)
    const result = await createAgent().act({ steps: [{ ref: "Project name", action: "press" }] })
    expect(result.error?.message).toContain("It supports: setValue, clear")
  })

  it("finds controls by query", () => {
    render(<Settings />)
    const agent = createAgent()
    expect(agent.query({ kind: "select" }).map((c) => c.label)).toEqual(["Region"])
    expect(agent.query({ text: "project" }).map((c) => c.label)).toEqual([
      "Project name",
      "Delete project",
    ])
  })
})

function Registered({
  agent,
  onName,
  onRegion,
  onOpen,
  items,
}: {
  agent: Agent
  onName?: (value: string, details: unknown) => void
  onRegion?: (value: unknown, details: unknown) => void
  onOpen?: (open: boolean, details: unknown) => void
  items?: Record<string, string>
}) {
  return (
    <AgentProvider agent={agent}>
      <label htmlFor="name">Project name</label>
      <Input id="name" defaultValue="Apollo" onValueChange={onName} />
      <Select items={items} onValueChange={onRegion}>
        <SelectTrigger aria-label="Region">
          <SelectValue placeholder="Pick a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
        </SelectContent>
      </Select>
      <Dialog onOpenChange={onOpen}>
        <DialogTrigger>Delete project</DialogTrigger>
        <DialogPortal>
          <DialogPopup>
            <DialogTitle>Delete Apollo?</DialogTitle>
            <DialogClose>Cancel</DialogClose>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </AgentProvider>
  )
}

describe("createAgent with registered components", () => {
  it("reports what the components register", () => {
    const agent = createAgent()
    render(<Registered agent={agent} items={{ us: "United States", eu: "Europe" }} />)
    const snapshot = agent.snapshot()

    expect(snapshot.map((c) => [c.component, c.label])).toEqual([
      ["input", "Project name"],
      ["select", "Region"],
      ["dialog", "Delete project"],
    ])
    // With `items`, a closed select can still name its choices.
    expect(snapshot[1]).toMatchObject({ open: false, items: ["United States", "Europe"], actions: ["select", "open"] })
    expect(snapshot[2]).toMatchObject({ open: false, actions: ["open"] })
  })

  it("sets an input through onValueChange, marked as the agent's", async () => {
    const onName = vi.fn()
    const agent = createAgent()
    render(<Registered agent={agent} onName={onName} />)

    const result = await agent.act({ steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }] })

    expect(result.ok).toBe(true)
    expect(onName).toHaveBeenCalledTimes(1)
    expect(onName.mock.calls[0][0]).toBe("Atlas")
    expect(isAgentChange(onName.mock.calls[0][1])).toBe(true)
    expect(screen.getByLabelText("Project name")).toHaveValue("Atlas")
  })

  it("leaves the input alone when the app cancels the change", async () => {
    const agent = createAgent()
    render(<Registered agent={agent} onName={(_, details) => (details as { cancel(): void }).cancel()} />)

    const result = await agent.act({ steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }] })

    expect(result).toMatchObject({ ok: false, error: { message: "The app refused the change." } })
    expect(screen.getByLabelText("Project name")).toHaveValue("Apollo")
  })

  it("still fires onChange for an input that only listens to it", async () => {
    const onChange = vi.fn()
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Input aria-label="Email" onChange={onChange} />
      </AgentProvider>
    )
    await agent.act({ steps: [{ ref: "Email", action: "setValue", args: ["a@b.co"] }] })
    expect(onChange).toHaveBeenCalled()
    expect(screen.getByLabelText("Email")).toHaveValue("a@b.co")
  })

  it.each([
    ["with items", { us: "United States", eu: "Europe" }],
    ["without items", undefined],
  ])("selects an option by label %s", async (_, items) => {
    const onRegion = vi.fn()
    const agent = createAgent()
    render(<Registered agent={agent} onRegion={onRegion} items={items} />)

    const result = await agent.act({ steps: [{ ref: "Region", action: "select", args: ["Europe"] }] })

    expect(result.ok).toBe(true)
    expect(onRegion.mock.calls[0][0]).toBe("eu")
    expect(isAgentChange(onRegion.mock.calls[0][1])).toBe(true)
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent(items ? "Europe" : "eu"))
    expect(agent.snapshot()[1]).toMatchObject({ open: false })
  })

  it("lists the options when the one asked for is missing", async () => {
    const agent = createAgent()
    render(<Registered agent={agent} items={{ us: "United States", eu: "Europe" }} />)
    const result = await agent.act({ steps: [{ ref: "Region", action: "select", args: ["Mars"] }] })
    expect(result.error?.message).toBe('No option "Mars". Options: United States, Europe.')
  })

  it("opens and closes a dialog as one control", async () => {
    const onOpen = vi.fn()
    const agent = createAgent()
    render(<Registered agent={agent} onOpen={onOpen} />)
    const closed = agent.snapshot().find((c) => c.component === "dialog")!

    const opened = await agent.act({ steps: [{ ref: "Delete project", action: "open" }] })

    expect(opened).toMatchObject({ ok: true, steps: [{ ref: closed.ref, open: true }] })
    expect(isAgentChange(onOpen.mock.calls[0][1])).toBe(true)
    await screen.findByRole("dialog")
    const open = agent.snapshot().find((c) => c.component === "dialog")
    expect(open).toMatchObject({ ref: closed.ref, label: "Delete Apollo?", open: true, actions: ["close"] })
    // The close button inside is not registered, so it comes from the accessibility tree.
    expect(agent.snapshot().find((c) => c.label === "Cancel")).toMatchObject({ component: "button" })

    await agent.act({ steps: [{ ref: closed.ref, action: "close" }] })
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("stops registering when the provider goes away", () => {
    const agent = createAgent()
    const { unmount } = render(<Registered agent={agent} />)
    unmount()
    expect(agent.snapshot()).toEqual([])
  })
})

describe("tools", () => {
  it("runs a tool by name", async () => {
    render(<Settings />)
    const agent = createAgent()
    const snapshot = (await runAgentTool(agent, "snapshot", {})) as unknown[]
    expect(snapshot.length).toBeGreaterThan(0)
  })

  it("registers with WebMCP and gates the browser agent's steps", async () => {
    render(<Settings />)
    const tools = new Map<string, { execute: (input: unknown) => Promise<unknown> }>()
    const unregisterTool = vi.fn()
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: {
        registerTool: (tool: { name: string; execute: (input: unknown) => Promise<unknown> }) => {
          tools.set(tool.name, tool)
        },
        unregisterTool,
      },
    })

    const unregister = registerTools(createAgent(), { allow: () => false })
    expect([...tools.keys()]).toEqual(["snapshot", "query", "act"])

    const result = (await tools.get("act")!.execute({
      steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }],
    })) as { content: { text: string }[] }
    expect(JSON.parse(result.content[0].text)).toMatchObject({ ok: false })
    expect(screen.getByLabelText("Project name")).toHaveValue("Apollo")

    unregister()
    expect(unregisterTool).toHaveBeenCalledTimes(3)
    delete (navigator as { modelContext?: unknown }).modelContext
  })
})

const projects = ["Hermes", "Gemini"]

function ProjectCard({ name, onArchive }: { name: string; onArchive: (name: string, reason?: string) => void }) {
  const ref = useRef<HTMLElement>(null)
  useAgentAction({
    name: "archiveProject",
    description: "Archive this project.",
    input: z.object({ reason: z.string().optional() }),
    element: ref,
    run: ({ reason }) => {
      onArchive(name, reason)
      return { archived: name }
    },
  })
  return (
    <article ref={ref}>
      <h3>{name}</h3>
      <p>Some description of {name}.</p>
    </article>
  )
}

function Invite({ onInvite }: { onInvite: (email: string) => void }) {
  useAgentAction({
    name: "inviteMember",
    description: "Invite someone to the project.",
    input: z.object({ email: z.email(), role: z.enum(["viewer", "editor"]) }),
    confirm: "Invitations send an email",
    run: ({ email }) => onInvite(email),
  })
  return null
}

function Actions({ agent, onArchive = () => {}, onInvite = () => {}, invite = true }: {
  agent: Agent
  onArchive?: (name: string, reason?: string) => void
  onInvite?: (email: string) => void
  invite?: boolean
}) {
  return (
    <AgentProvider agent={agent}>
      {projects.map((name) => (
        <ProjectCard key={name} name={name} onArchive={onArchive} />
      ))}
      {invite && <Invite onInvite={onInvite} />}
    </AgentProvider>
  )
}

describe("app actions", () => {
  it("lists an attached action on each element, named by its heading, and the rest on the page", () => {
    const agent = createAgent()
    render(<Actions agent={agent} />)
    const snapshot = agent.snapshot()

    expect(snapshot.filter((c) => c.component === "region")).toEqual([
      { ref: expect.any(String), component: "region", label: "Hermes", actions: ["archiveProject"] },
      { ref: expect.any(String), component: "region", label: "Gemini", actions: ["archiveProject"] },
    ])
    expect(snapshot.find((c) => c.component === "page")).toMatchObject({ ref: "page", actions: ["inviteMember"] })

    const archive = agent.actions().find((a) => a.name === "archiveProject")
    expect(archive?.refs).toHaveLength(2)
    expect(archive?.input).toMatchObject({ type: "object", properties: { reason: { type: "string" } } })
  })

  it("runs the action on the element the step names and returns its result", async () => {
    const agent = createAgent()
    const onArchive = vi.fn()
    render(<Actions agent={agent} onArchive={onArchive} />)

    const result = await agent.act({ steps: [{ ref: "Gemini", action: "archiveProject", args: [{ reason: "Duplicate" }] }] })

    expect(result.ok).toBe(true)
    expect(result.steps[0].result).toEqual({ archived: "Gemini" })
    expect(onArchive).toHaveBeenCalledWith("Gemini", "Duplicate")
  })

  it("checks the input with the schema before running", async () => {
    const onInvite = vi.fn()
    const agent = createAgent({ allow: () => true })
    render(<Actions agent={agent} onInvite={onInvite} />)

    const result = await agent.act({ steps: [{ ref: "page", action: "inviteMember", args: [{ email: "sam", role: "owner" }] }] })

    expect(result.ok).toBe(false)
    expect(result.error?.message).toMatch(/^Invalid input for "inviteMember": .*email/s)
    expect(onInvite).not.toHaveBeenCalled()
  })

  it("holds an action that needs a person until allow approves it", async () => {
    const onInvite = vi.fn()
    const blocked = createAgent()
    const { unmount } = render(<Actions agent={blocked} onInvite={onInvite} />)
    const step = { ref: "page", action: "inviteMember", args: [{ email: "sam@example.com", role: "editor" }] }

    expect((await blocked.act({ steps: [step] })).error?.message).toBe("Invitations send an email")
    unmount()

    const allow = vi.fn(() => true)
    const approved = createAgent({ allow })
    render(<Actions agent={approved} onInvite={onInvite} />)
    expect((await approved.act({ steps: [step] })).ok).toBe(true)
    expect(allow).toHaveBeenCalledWith(expect.objectContaining({ confirm: "Invitations send an email" }), expect.anything())
    expect(onInvite).toHaveBeenCalledWith("sam@example.com")
  })

  it("says whether a confirm step asks the person or is theirs alone", () => {
    const refused = createAgent()
    const { unmount } = render(<Actions agent={refused} />)
    expect(refused.actions().find((a) => a.name === "inviteMember")).toMatchObject({ approval: "person" })
    expect(agentToolsFor(refused).find((t) => t.name === "inviteMember")?.description).toContain("Only the person")
    unmount()

    const asking = createAgent({ allow: () => true })
    render(<Actions agent={asking} />)
    expect(asking.actions().find((a) => a.name === "inviteMember")).toMatchObject({ approval: "ask" })
    expect(agentToolsFor(asking).find((t) => t.name === "inviteMember")?.description).toContain("Asks the person")
  })

  it("drops an action when its component unmounts", () => {
    const agent = createAgent()
    const { rerender } = render(<Actions agent={agent} />)
    rerender(<Actions agent={agent} invite={false} />)
    expect(agent.actions().map((a) => a.name)).toEqual(["archiveProject"])
    expect(agent.snapshot().some((c) => c.component === "page")).toBe(false)
  })

  it("adds an attached action to a control's own entry", async () => {
    function Exported() {
      const ref = useRef<HTMLButtonElement>(null)
      useAgentAction({ name: "exportCsv", description: "Download the data.", element: ref, run: () => "done.csv" })
      return <button ref={ref}>Export</button>
    }
    const agent = createAgent()
    render(<AgentProvider agent={agent}><Exported /></AgentProvider>)

    expect(agent.snapshot()).toEqual([
      { ref: expect.any(String), component: "button", label: "Export", actions: ["press", "exportCsv"] },
    ])
    expect((await agent.act({ steps: [{ ref: "Export", action: "exportCsv" }] })).steps[0].result).toBe("done.csv")
  })

  it("makes actions tools by default, and puts them in the snapshot in act mode", async () => {
    const agent = createAgent()
    const onArchive = vi.fn()
    render(<Actions agent={agent} onArchive={onArchive} invite={false} />)

    expect(agentToolsFor(agent, { actions: "act" }).map((t) => t.name)).toEqual(["snapshot", "query", "act"])
    expect(await runAgentTool(agent, "snapshot", {}, { actions: "act" })).toMatchObject({
      controls: expect.any(Array),
      actions: [{ name: "archiveProject" }],
    })

    const tools = agentToolsFor(agent)
    expect(tools.map((t) => t.name)).toEqual(["snapshot", "query", "act", "archiveProject"])
    const archive = tools.find((t) => t.name === "archiveProject")
    const refs = agent.actions()[0].refs
    expect(archive?.inputSchema).toMatchObject({
      required: ["ref"],
      properties: { ref: { enum: refs }, reason: { type: "string" } },
    })
    expect(archive?.description).toContain(`${refs[0]} (Hermes), ${refs[1]} (Gemini)`)
    expect(Array.isArray(await runAgentTool(agent, "snapshot", {}))).toBe(true)

    await runAgentTool(agent, "archiveProject", { ref: refs[0], reason: "Old" })
    expect(onArchive).toHaveBeenCalledWith("Hermes", "Old")
  })
})

describe("snapshot format", () => {
  it("names the container a control sits in", () => {
    render(
      <form aria-label="Billing">
        <fieldset>
          <legend>Card</legend>
          <input aria-label="Card number" />
        </fieldset>
        <input aria-label="Coupon" />
      </form>
    )
    const snapshot = createAgent().snapshot()
    expect(snapshot.find((c) => c.label === "Card number")?.in).toBe("Card")
    expect(snapshot.find((c) => c.label === "Coupon")?.in).toBe("Billing")
  })

  it("names a card an action is attached to as the container of the controls inside it", () => {
    function Card() {
      const ref = useRef<HTMLElement>(null)
      useAgentAction({ name: "archive", description: "Archive.", element: ref, run: () => {} })
      return (
        <article ref={ref}>
          <h3>Hermes</h3>
          <button>Edit</button>
        </article>
      )
    }
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Card />
      </AgentProvider>
    )
    expect(agent.snapshot().find((c) => c.label === "Edit")?.in).toBe("Hermes")
  })

  it("puts an open dialog's controls first", async () => {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <button>Before</button>
        <Dialog defaultOpen>
          <DialogTrigger>Open</DialogTrigger>
          <DialogPortal>
            <DialogPopup>
              <DialogTitle>Rename</DialogTitle>
              <input aria-label="New name" />
            </DialogPopup>
          </DialogPortal>
        </Dialog>
      </AgentProvider>
    )
    await screen.findByText("Rename")
    const snapshot = agent.snapshot()
    expect(snapshot[0]).toMatchObject({ component: "dialog", open: true })
    expect(snapshot[1]).toMatchObject({ label: "New name", in: "Rename" })
  })

  it("leaves out what is behind a dialog marked modal", () => {
    render(
      <div>
        <button>Behind</button>
        <div role="dialog" aria-modal="true" aria-label="Confirm">
          <button>Inside</button>
        </div>
        <div aria-live="polite">
          <button>Undo</button>
        </div>
      </div>
    )
    expect(createAgent().snapshot().map((c) => c.label)).toEqual(["Confirm", "Inside", "Undo"])
  })

  it("reports required, invalid and the error messages", () => {
    render(
      <div>
        <input aria-label="Email" required aria-invalid="true" aria-describedby="hint err" />
        <p id="hint">We never share it.</p>
        <p id="err" data-agent-error>
          Enter a valid email.
        </p>
      </div>
    )
    expect(createAgent().snapshot()[0]).toMatchObject({
      required: true,
      invalid: true,
      errors: ["Enter a valid email."],
    })
  })

  it("reads number and range inputs with their bounds", () => {
    render(
      <div>
        <input aria-label="Seats" type="number" min="1" max="10" defaultValue="3" />
        <input aria-label="Volume" type="range" min="0" max="100" step="5" defaultValue="40" />
      </div>
    )
    const [seats, volume] = createAgent().snapshot()
    expect(seats).toMatchObject({ component: "number", value: 3, min: 1, max: 10, actions: ["setValue"] })
    expect(volume).toMatchObject({ component: "slider", value: 40, min: 0, max: 100, step: 5 })
  })

  it("cuts long values and long lists, saying what was cut", async () => {
    const agent = createAgent()
    const long = "x".repeat(600)
    render(<textarea aria-label="Notes" defaultValue={long} />)
    const [notes] = agent.snapshot()
    expect((notes.value as string).length).toBe(500)
    expect(notes.truncated).toBe(true)
  })

  it("lists at most fifty choices and counts the rest", () => {
    const agent = createAgent()
    function Many() {
      useAgentControlFixture(agent)
      return null
    }
    render(<Many />)
    const [many] = agent.snapshot()
    expect(many.items).toHaveLength(50)
    expect(many.more).toBe(10)
  })

  it("says whether a secret is set without saying what it is", () => {
    render(
      <div>
        <input aria-label="Password" type="password" defaultValue="hunter2" />
        <input aria-label="New password" type="password" />
      </div>
    )
    const [set, unset] = createAgent().snapshot()
    expect(set.value).toBe("[redacted]")
    expect(unset.value).toBe("")
  })
})

function useAgentControlFixture(agent: Agent) {
  const items = Array.from({ length: 60 }, (_, i) => `Item ${i + 1}`)
  useEffectOnce(() =>
    agent.register(() => ({
      kind: "select",
      element: document.body,
      label: "Many",
      items,
      actions: { select: () => {} },
    }))
  )
}

function useEffectOnce(effect: () => () => void) {
  useEffect(effect, [])
}

describe("approval defaults", () => {
  it("needs approval for a press inside an alert dialog, but not for closing it", () => {
    render(
      <div role="alertdialog" aria-label="Delete project?">
        <button>Delete</button>
        <button data-agent-confirm="none">Cancel</button>
      </div>
    )
    const snapshot = createAgent().snapshot()
    expect(snapshot.find((c) => c.label === "Delete")?.confirm).toMatch(/alert dialog/)
    expect(snapshot.find((c) => c.label === "Cancel")?.confirm).toBeUndefined()
    expect(snapshot.find((c) => c.component === "dialog")?.confirm).toBeUndefined()
  })

  it("lets data-agent-confirm=\"none\" lift a control's default approval", () => {
    const agent = createAgent()
    function Held({ lifted }: { lifted?: boolean }) {
      const ref = useRef<HTMLButtonElement>(null)
      useEffectOnce(() =>
        agent.register(() => ({
          kind: "button",
          element: ref.current,
          confirm: "Holding confirms a payment",
          actions: { press: () => {} },
        }))
      )
      return (
        <button ref={ref} data-agent-confirm={lifted ? "none" : undefined}>
          {lifted ? "Lifted" : "Held"}
        </button>
      )
    }
    render(
      <div>
        <Held />
        <Held lifted />
      </div>
    )
    const snapshot = agent.snapshot()
    expect(snapshot.find((c) => c.label === "Held")?.confirm).toBe("Holding confirms a payment")
    expect(snapshot.find((c) => c.label === "Lifted")?.confirm).toBeUndefined()
  })

  it("gates a button's press when an action with confirm is attached to it", async () => {
    const agent = createAgent()
    const onClick = vi.fn()
    function Archive() {
      const ref = useRef<HTMLButtonElement>(null)
      useAgentAction({
        name: "archiveProject",
        description: "Archive the project.",
        confirm: "Archiving hides it from everyone",
        element: ref,
        run: () => {},
      })
      return (
        <button ref={ref} onClick={onClick}>
          Archive
        </button>
      )
    }
    render(
      <AgentProvider agent={agent}>
        <Archive />
      </AgentProvider>
    )
    const [button] = agent.snapshot()
    expect(button).toMatchObject({
      component: "button",
      actions: ["press", "archiveProject"],
      confirm: "Archiving hides it from everyone",
    })

    const result = await agent.act({ steps: [{ ref: "Archive", action: "press" }] })
    expect(result.ok).toBe(false)
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe("standard schema", () => {
  function Invite({ agent, input, onRun = () => {} }: { agent: Agent; input: AgentSchema; onRun?: (v: unknown) => void }) {
    function Inner() {
      useAgentAction({ name: "invite", description: "Invite someone.", input, run: onRun })
      return null
    }
    return (
      <AgentProvider agent={agent}>
        <Inner />
      </AgentProvider>
    )
  }

  it("reports each issue as path: message", async () => {
    const agent = createAgent()
    render(<Invite agent={agent} input={z.object({ user: z.object({ email: z.email() }) })} />)
    const result = await agent.act({ steps: [{ ref: "page", action: "invite", args: [{ user: { email: "nope" } }] }] })
    expect(result.error?.message).toMatch(/^Invalid input for "invite": user\.email: /)
  })

  it("awaits a schema that validates asynchronously", async () => {
    const agent = createAgent()
    const onRun = vi.fn()
    const input = z.object({ name: z.string().refine(async (n) => n !== "taken", "That name is taken") })
    render(<Invite agent={agent} input={input} onRun={onRun} />)

    const taken = await agent.act({ steps: [{ ref: "page", action: "invite", args: [{ name: "taken" }] }] })
    expect(taken.error?.message).toMatch(/name: That name is taken/)
    const free = await agent.act({ steps: [{ ref: "page", action: "invite", args: [{ name: "free" }] }] })
    expect(free.ok).toBe(true)
    expect(onRun).toHaveBeenCalledWith({ name: "free" })
  })

  it("passes the parsed output to run", async () => {
    const agent = createAgent()
    const onRun = vi.fn()
    render(<Invite agent={agent} input={z.object({ seats: z.coerce.number() })} onRun={onRun} />)
    await agent.act({ steps: [{ ref: "page", action: "invite", args: [{ seats: "3" }] }] })
    expect(onRun).toHaveBeenCalledWith({ seats: 3 })
  })

  it("gives the model any object when the schema cannot be written as JSON Schema", () => {
    const agent = createAgent()
    const input = z.object({ at: z.date() })
    render(<Invite agent={agent} input={input} />)
    expect(agent.actions()[0].input).toEqual({ type: "object", properties: {} })
  })

  it("drops $schema from the JSON Schema", () => {
    const agent = createAgent()
    render(<Invite agent={agent} input={z.object({ email: z.email() })} />)
    expect(agent.actions()[0].input).not.toHaveProperty("$schema")
  })

  it("refuses a schema that cannot describe itself, naming the wrappers", () => {
    const bare = { "~standard": { version: 1, vendor: "x", validate: (value: unknown) => ({ value }) } }
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<Invite agent={createAgent()} input={bare as unknown as AgentSchema} />)).toThrow(
      /toStandardJsonSchema/
    )
    error.mockRestore()
  })
})

describe("subscribe", () => {
  it("tells listeners once when several actions mount together", async () => {
    const agent = createAgent()
    const listener = vi.fn()
    agent.subscribe(listener)
    const { unmount } = render(<Actions agent={agent} />)
    await Promise.resolve()
    expect(listener).toHaveBeenCalledTimes(1)
    unmount()
    await Promise.resolve()
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it("adds and removes WebMCP tools as actions mount and unmount", async () => {
    const tools = new Map<string, unknown>()
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: {
        registerTool: (tool: { name: string }) => {
          tools.set(tool.name, tool)
        },
        unregisterTool: (name: string) => {
          tools.delete(name)
        },
      },
    })
    const agent = createAgent()
    const unregister = registerTools(agent, { allow: () => true })
    const { rerender } = render(<Actions agent={agent} />)
    await waitFor(() => expect([...tools.keys()]).toEqual(["snapshot", "query", "act", "archiveProject", "inviteMember"]))

    rerender(<Actions agent={agent} invite={false} />)
    await waitFor(() => expect(tools.has("inviteMember")).toBe(false))
    expect(tools.has("archiveProject")).toBe(true)

    unregister()
    expect(tools.size).toBe(0)
    delete (navigator as { modelContext?: unknown }).modelContext
  })
})

describe("select refit", () => {
  function Region({ agent, multiple, onValueChange }: { agent: Agent | null; multiple?: boolean; onValueChange?: (v: unknown) => void }) {
    const select = (
      <Select multiple={multiple} defaultValue={multiple ? ["eu"] : "eu"} onValueChange={onValueChange}>
        <SelectTrigger aria-label="Region">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="us">
              <b>United</b> States
            </SelectItem>
          </SelectGroup>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="ap" disabled>
            Asia Pacific
          </SelectItem>
        </SelectContent>
      </Select>
    )
    return agent ? <AgentProvider agent={agent}>{select}</AgentProvider> : select
  }

  it("lists a closed select's choices and reports its value by label", () => {
    const agent = createAgent()
    render(<Region agent={agent} />)
    expect(agent.snapshot()).toEqual([
      expect.objectContaining({
        component: "select",
        value: "Europe",
        open: false,
        items: ["United States", "Europe", "Asia Pacific"],
      }),
    ])
  })

  it("chooses from a closed select without opening it", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    render(<Region agent={agent} onValueChange={onValueChange} />)
    const result = await agent.act({ steps: [{ ref: "Region", action: "select", args: ["united states"] }] })
    expect(result.steps[0]).toMatchObject({ ok: true, value: "United States", open: false })
    expect(onValueChange).toHaveBeenCalledWith("us", expect.anything())
  })

  it("refuses a disabled choice and lists the valid ones on a miss", async () => {
    const agent = createAgent()
    render(<Region agent={agent} />)
    const disabled = await agent.act({ steps: [{ ref: "Region", action: "select", args: ["Asia Pacific"] }] })
    expect(disabled.error?.message).toBe('Option "Asia Pacific" is disabled.')
    const miss = await agent.act({ steps: [{ ref: "Region", action: "select", args: ["Mars"] }] })
    expect(miss.error?.message).toBe('No option "Mars". Options: United States, Europe, Asia Pacific.')
  })

  it("reports a multiple select's values and replaces them with setValue", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    render(<Region agent={agent} multiple onValueChange={onValueChange} />)
    expect(agent.snapshot()[0]).toMatchObject({ multiple: true, value: ["Europe"], actions: ["select", "setValue", "open"] })

    await agent.act({ steps: [{ ref: "Region", action: "select", args: ["United States"] }] })
    expect(onValueChange).toHaveBeenLastCalledWith(["eu", "us"], expect.anything())

    const result = await agent.act({ steps: [{ ref: "Region", action: "setValue", args: [["us"]] }] })
    expect(result.steps[0].value).toEqual(["United States"])
  })

  it("renders the same markup outside AgentProvider", () => {
    const { container: plain } = render(<Region agent={null} />)
    expect(plain.querySelector("[data-agent-hidden]")).toBeNull()
  })
})

describe("hardening", () => {
  function webmcp() {
    const tools = new Map<string, { execute: (input: unknown) => Promise<unknown> }>()
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: {
        registerTool: (tool: { name: string; execute: (input: unknown) => Promise<unknown> }) => {
          tools.set(tool.name, tool)
        },
        unregisterTool: () => {},
      },
    })
    const act = async (steps: unknown[]) => {
      const out = (await tools.get("act")!.execute({ steps })) as { content: { text: string }[] }
      return JSON.parse(out.content[0].text)
    }
    const done = () => delete (navigator as { modelContext?: unknown }).modelContext
    return { act, done }
  }

  it("shows the WebMCP gate the control a partial label resolves to, with its confirm", async () => {
    const onDelete = vi.fn()
    render(
      <button data-agent-confirm="Deleting cannot be undone" onClick={onDelete}>
        Delete account
      </button>
    )
    const { act, done } = webmcp()
    const gate = vi.fn(() => false)
    const unregister = registerTools(createAgent({ allow: () => true }), { allow: gate })

    const result = await act([{ ref: "delete acc", action: "press" }])
    expect(result.ok).toBe(false)
    expect(gate).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Delete account", confirm: "Deleting cannot be undone" }),
      expect.anything()
    )
    expect(onDelete).not.toHaveBeenCalled()
    unregister()
    done()
  })

  it("asks the WebMCP gate about a control that appears part way through", async () => {
    function Flow() {
      const [open, setOpen] = useState(false)
      return open ? (
        <button data-agent-confirm="Sends the invoice">Send</button>
      ) : (
        <button onClick={() => setOpen(true)}>Start</button>
      )
    }
    render(<Flow />)
    const { act, done } = webmcp()
    const gate = vi.fn((step: { label: string }) => step.label !== "Send")
    const unregister = registerTools(createAgent({ allow: () => true }), { allow: gate })

    const result = await act([
      { ref: "Start", action: "press" },
      { ref: "Send", action: "press" },
    ])
    expect(result).toMatchObject({ ok: false, error: { step: 1 } })
    expect(gate).toHaveBeenLastCalledWith(expect.objectContaining({ confirm: "Sends the invoice" }), expect.anything())
    unregister()
    done()
  })

  it("keeps secrets out of numbers, prefixed autocomplete, selects and labels", () => {
    const agent = createAgent()
    render(
      <div>
        <input aria-label="Code" type="number" autoComplete="one-time-code" defaultValue="123456" />
        <input aria-label="Card" autoComplete="billing cc-number" defaultValue="4242424242424242" />
        <div data-agent-secret>
          <div role="combobox" aria-label="Saved card" aria-expanded="false">
            Visa 4242
          </div>
        </div>
        <button>
          Copy <span data-agent-secret>sk-live-999</span>
        </button>
      </div>
    )
    const text = JSON.stringify(agent.snapshot())
    for (const secret of ["123456", "4242", "sk-live-999"]) expect(text).not.toContain(secret)
    expect(agent.snapshot().find((c) => c.component === "button")?.label).toBe("Copy")
  })

  it("fails the step, not the whole act, when a control's action throws", async () => {
    function Broken() {
      const ref = useRef<HTMLButtonElement>(null)
      useAgentControl(() => ({
        kind: "button",
        element: ref.current,
        actions: {
          press: () => {
            throw new Error("Upload failed")
          },
        },
      }))
      return <button ref={ref}>Upload</button>
    }
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Broken />
      </AgentProvider>
    )
    const result = await agent.act({ steps: [{ ref: "Upload", action: "press" }] })
    expect(result).toMatchObject({ ok: false, error: { step: 0, message: "Upload failed" } })
  })

  it("offers no setValue on a file input", () => {
    const agent = createAgent()
    render(
      <AgentProvider agent={agent}>
        <Input aria-label="Avatar" type="file" />
      </AgentProvider>
    )
    expect(agent.snapshot().find((c) => c.label === "Avatar")?.actions).toEqual([])
  })

  it("refuses to change a read-only select", async () => {
    const agent = createAgent()
    const onValueChange = vi.fn()
    render(
      <AgentProvider agent={agent}>
        <Select readOnly defaultValue="us" onValueChange={onValueChange}>
          <SelectTrigger aria-label="Region">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
          </SelectContent>
        </Select>
      </AgentProvider>
    )
    const result = await agent.act({ steps: [{ ref: "Region", action: "select", args: ["Europe"] }] })
    expect(result.error?.message).toMatch(/read-only/)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('reads setChecked("false") as false', async () => {
    function Box() {
      const [checked, setChecked] = useState(true)
      return (
        <div role="checkbox" aria-label="Notify" aria-checked={checked} onClick={() => setChecked(!checked)} />
      )
    }
    const agent = createAgent()
    render(<Box />)
    const result = await agent.act({ steps: [{ ref: "Notify", action: "setChecked", args: ["false"] }] })
    expect(result.steps[0]).toMatchObject({ checked: false })
  })

  it("does not run a step whose control changed while approval was pending", async () => {
    function Rows() {
      const [first, setFirst] = useState("Project A")
      useEffect(() => {
        const timer = setTimeout(() => setFirst("Project B"), 5)
        return () => clearTimeout(timer)
      }, [])
      return <button onClick={onPress}>{first}</button>
    }
    const onPress = vi.fn()
    const agent = createAgent({ allow: () => new Promise((resolve) => setTimeout(() => resolve(true), 30)) })
    render(<Rows />)
    const result = await agent.act({ steps: [{ ref: "Project A", action: "press" }] })
    expect(result.error?.message).toMatch(/changed while waiting/)
    expect(onPress).not.toHaveBeenCalled()
  })
})
