import * as React from "react"
import { cleanup, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  AgentProvider,
  createAgent,
  isAgentChange,
  type Agent,
  type AgentComponent,
  type AgentOptions,
  type AgentStepResult,
} from "../agent"

export interface AgentFixtureProps {
  /** Wire this to the component's change callback: `onValueChange` or `onOpenChange`. */
  onChange: (value: unknown, details: unknown) => void
  disabled?: boolean
}

export interface AgentConformance {
  name: string
  render: (props: AgentFixtureProps) => React.ReactElement
  /** The label the control is found by. */
  label: string
  /** Fields its snapshot entry must have. */
  entry: Partial<AgentComponent>
  /** An action that changes the control, and what the step reports after it. */
  act: { action: string; args?: unknown[]; result: Partial<AgentStepResult> }
  /** A choice that does not exist, and the valid choices the error must list. */
  invalid?: { action: string; args: unknown[]; lists: string[] }
  /** Makes the same kind of change as a person would. */
  person: (user: ReturnType<typeof userEvent.setup>) => Promise<void>
  /**
   * Commits on mount with the bare Base UI parts, which the component must not add to.
   * Defaults to 1.
   */
  commits?: number
}

/**
 * The checks every component that registers with the bridge passes. One call per
 * component, from its own test file.
 */
export function agentConformance(fixture: AgentConformance) {
  const { label } = fixture

  function mount(props: Partial<AgentFixtureProps> = {}, options: AgentOptions = {}) {
    const agent = createAgent(options)
    const onChange = props.onChange ?? vi.fn()
    const result = render(
      <AgentProvider agent={agent}>{fixture.render({ onChange, disabled: props.disabled })}</AgentProvider>
    )
    return { agent, onChange, ...result }
  }

  const entryOf = (agent: Agent) => agent.snapshot().find((c) => c.label === label)

  describe(`${fixture.name}: agent conformance`, () => {
    it("reports its kind, label, state and actions", () => {
      const { agent } = mount()
      expect(entryOf(agent)).toMatchObject({ label, ...fixture.entry })
    })

    it("acts by label and by ref", async () => {
      const { action, args, result } = fixture.act
      const byLabel = mount()
      const first = await byLabel.agent.act({ steps: [{ ref: label, action, args }] })
      expect(first).toMatchObject({ ok: true, steps: [result] })
      cleanup()

      const byRef = mount()
      const ref = entryOf(byRef.agent)!.ref
      const second = await byRef.agent.act({ steps: [{ ref, action, args }] })
      expect(second).toMatchObject({ ok: true, steps: [result] })
    })

    if (fixture.invalid) {
      const { action, args, lists } = fixture.invalid
      it("lists the valid choices when a choice does not exist", async () => {
        const { agent } = mount()
        const result = await agent.act({ steps: [{ ref: label, action, args }] })
        expect(result.ok).toBe(false)
        for (const choice of lists) expect(result.error?.message).toContain(choice)
      })
    }

    it("sends the agent's change through the callback, marked as the agent's", async () => {
      const { agent, onChange } = mount()
      await agent.act({ steps: [{ ref: label, action: fixture.act.action, args: fixture.act.args }] })
      const calls = vi.mocked(onChange).mock.calls
      expect(calls.length).toBeGreaterThan(0)
      expect(calls.every(([, details]) => isAgentChange(details))).toBe(true)
    })

    it("does not mark a person's change as the agent's", async () => {
      const user = userEvent.setup()
      const { onChange } = mount()
      await fixture.person(user)
      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(vi.mocked(onChange).mock.calls.some(([, details]) => isAgentChange(details))).toBe(false)
    })

    it("lets the app cancel the agent's change, and tells the agent", async () => {
      const onChange = vi.fn((_: unknown, details: unknown) => (details as { cancel(): void }).cancel())
      const { agent } = mount({ onChange })
      const before = entryOf(agent)
      const result = await agent.act({ steps: [{ ref: label, action: fixture.act.action, args: fixture.act.args }] })
      expect(result.ok).toBe(false)
      expect(result.error?.message).toMatch(/refused/i)
      const after = entryOf(agent)
      expect(after?.value).toEqual(before?.value)
      expect(after?.open).toEqual(before?.open)
    })

    it("refuses every action when disabled", async () => {
      const { agent, onChange } = mount({ disabled: true })
      const entry = entryOf(agent)!
      expect(entry.disabled).toBe(true)
      for (const action of entry.actions) {
        const result = await agent.act({ steps: [{ ref: label, action, args: fixture.act.args }] })
        expect(result.error?.message).toMatch(/disabled/)
      }
      expect(onChange).not.toHaveBeenCalled()
    })

    it("holds a confirm step for the person", async () => {
      const step = { ref: label, action: fixture.act.action, args: fixture.act.args }
      const wrap = (props: AgentFixtureProps) => (
        <div data-agent-confirm="Needs a person">{fixture.render(props)}</div>
      )
      const run = async (options: AgentOptions) => {
        const agent = createAgent(options)
        const onChange = vi.fn()
        render(<AgentProvider agent={agent}>{wrap({ onChange })}</AgentProvider>)
        const entry = entryOf(agent)
        const result = await agent.act({ steps: [step] })
        cleanup()
        return { entry, result, onChange }
      }

      const alone = await run({})
      expect(alone.entry).toMatchObject({ confirm: "Needs a person", approval: "person" })
      expect(alone.result.ok).toBe(false)
      expect(alone.onChange).not.toHaveBeenCalled()

      const refused = await run({ allow: () => false })
      expect(refused.entry?.approval).toBe("ask")
      expect(refused.result.ok).toBe(false)
      expect(refused.onChange).not.toHaveBeenCalled()

      const allow = vi.fn(() => true)
      const approved = await run({ allow })
      expect(approved.result.ok).toBe(true)
      expect(allow).toHaveBeenCalledWith(expect.objectContaining({ confirm: "Needs a person" }), expect.anything())
    })

    it("outside AgentProvider renders no agent markup and does not render again", () => {
      let commits = 0
      const onChange = vi.fn()
      const { container } = render(
        <React.Profiler id="plain" onRender={() => commits++}>
          {fixture.render({ onChange })}
        </React.Profiler>
      )
      expect(container.querySelector("[data-agent-hidden]")).toBeNull()
      expect(commits).toBe(fixture.commits ?? 1)
      expect(onChange).not.toHaveBeenCalled()
    })
  })
}
