import { cleanup, render, waitFor } from "@testing-library/react"
import type { Agent } from "../src/agent"
import type { Run } from "./model"
import { navCases } from "./nav-cases"
import { mountApp } from "./page-app"

/**
 * The live navigation cases without a model: each drives the page through the agent
 * bridge with the steps a model would take, then runs the live case's own check.
 */

const run: Run = { calls: 0, inputTokens: 0, outputTokens: 0, tools: [], reply: "" }

async function step(agent: Agent, ref: string, action: string, ...args: unknown[]) {
  const result = await agent.act({ steps: [{ ref, action, args }] })
  if (!result.ok) throw new Error(`${action} on "${ref}": ${result.error?.message}`)
  return result.steps[0].result
}

/** A control's ref by kind and exact label, for labels another control also contains. */
function ref(agent: Agent, kind: string, label: string) {
  const found = agent.snapshot().find((c) => c.component === kind && c.label === label)
  if (!found) throw new Error(`No ${kind} "${label}"`)
  return found.ref
}

const tab = (agent: Agent, name: string) => step(agent, "Workspace sections", "select", name)

/** Types the request into the Ask bar and presses the plan's button. */
async function ask(agent: Agent, request: string) {
  const found = (await step(agent, "Ask Orbit", "search", request)) as { run?: string }
  if (!found.run) throw new Error(`"${request}" resolved to no plan`)
  await step(agent, found.run, "press")
}

const openHermes = async (agent: Agent) => step(agent, ref(agent, "link", "Hermes"), "press")

const drive: Record<string, (agent: Agent) => Promise<void>> = {
  "seats alert": async (agent) => {
    await tab(agent, "Billing")
    await step(agent, "Add 2 seats", "press")
  },
  "at-risk project": async (agent) => {
    await step(agent, "Mark on track", "press")
  },
  "breadcrumb back": async (agent) => {
    await step(agent, "Breadcrumb", "goTo", "Projects")
  },
  "copy project link": async (agent) => {
    await step(agent, "Search Orbit", "select", "Apollo", "Copy link")
  },
  "dark theme": async (agent) => {
    await step(agent, "Search Orbit", "select", "Change theme")
    await step(agent, "Search Orbit", "select", "Dark")
  },
  "person's tasks": async (agent) => {
    await tab(agent, "Tasks")
    await step(agent, "Quick add", "select", "Priya Patel", "Show their tasks")
  },
  "quick add": async (agent) => {
    await tab(agent, "Tasks")
    await step(agent, "Quick add", "search", "Book offsite venue")
    await step(agent, "Quick add", "select", 'Create task "Book offsite venue"')
  },
  "bulk reassign": async (agent) => {
    await ask(agent, "Move all of Maya's tasks to Sam")
  },
  "bulk undo": async (agent) => {
    await ask(agent, "Hand all my open tasks to Priya")
    await waitFor(() => ref(agent, "button", "Undo"))
    await step(agent, ref(agent, "button", "Undo"), "press")
  },
  "reassign then filter": async (agent) => {
    await ask(agent, "Move all of Maya's tasks to Sam")
    await tab(agent, "Tasks")
    await step(agent, "Quick add", "select", "Sam Okafor", "Show their tasks")
  },
  "open, fix and go back": async (agent) => {
    await openHermes(agent)
    await step(agent, "Mark on track", "press")
    await step(agent, "Breadcrumb", "goTo", "Projects")
  },
}

describe("navigation cases, dry run", () => {
  // Render as the live harness does, so the bridge sees each step's result.
  beforeAll(() => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false
  })
  afterAll(() => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  })
  afterEach(() => cleanup())

  it("drives every live case", () => {
    expect(Object.keys(drive).sort()).toEqual(navCases.map((c) => c.name).sort())
  })

  for (const c of navCases) {
    it(c.name, async () => {
      const page = mountApp(c.options)
      c.setup?.(page.state)
      render(page.element)
      await new Promise((resolve) => setTimeout(resolve, 50))
      await drive[c.name](page.agent)
      await waitFor(() => c.check(page.state, run, page.agent))
    })
  }
})
