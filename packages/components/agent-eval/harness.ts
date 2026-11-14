import fs from "node:fs"
import type * as React from "react"
import { cleanup, render } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, describe, it } from "vitest"
import type { Agent } from "../src/agent"
import { MODEL, apiKey, runRequest, type Run } from "./model"

export interface LiveCase {
  name: string
  request: string
}

interface Mounted {
  agent: Agent
  state: unknown
  element: React.ReactElement
}

const TRACE_LIMIT = 400

interface Result {
  name: string
  pass: boolean
  calls: number
  tokens: number
  failedSteps: number
  exhausted: boolean
  tools: string[]
  error?: string
  reply: string
  trace: Run["tools"]
}

/**
 * Runs each case against the live model on a freshly mounted page, then prints a table
 * and writes the results to `file`. A filtered run replaces only the cases it ran.
 */
export function liveSuite<C extends LiveCase>(options: {
  title: string
  file: string
  cases: C[]
  mount: (c: C) => Mounted
  check: (c: C, state: unknown, run: Run, agent: Agent) => void
  turns?: number
}) {
  const { title, file, cases, mount, check, turns } = options
  const results: Result[] = []

  // Render as a browser would. Inside `act`, React holds every update until the scope ends,
  // so the model would never see the page change in response to its own steps.
  beforeAll(() => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false
  })
  afterEach(() => cleanup())
  afterAll(() => report(title, file, cases, results))

  describe.skipIf(!apiKey())(`${title} (${MODEL})`, () => {
    for (const c of cases) {
      it(c.name, async () => {
        const page = mount(c)
        render(page.element)
        // Let effects settle, such as a toast added on mount.
        await new Promise((resolve) => setTimeout(resolve, 50))
        let run: Run | undefined
        try {
          run = await runRequest(page.agent, c.request, { turns })
          check(c, page.state, run, page.agent)
          results.push(summary(c, run, true))
        } catch (error) {
          results.push(summary(c, run, false, error))
          throw error
        }
      })
    }
  })
}

function report(title: string, file: string, cases: LiveCase[], results: Result[]) {
  if (!results.length) return
  const previous: { results: Result[] } | null = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null
  const before = new Map(previous?.results.map((r) => [r.name, r]))
  const rows = results.map((r) => {
    const p = before.get(r.name)
    const was = p ? ` (was ${p.pass ? "pass" : "FAIL"}, ${p.calls} calls, ${p.tokens} tokens)` : ""
    const failed = r.failedSteps ? `, ${r.failedSteps} failed tool calls` : ""
    return `${r.pass ? "pass" : "FAIL"}  ${r.name}: ${r.calls} calls, ${r.tokens} tokens${failed}${r.exhausted ? ", ran out of turns" : ""}${was}`
  })
  const passed = results.filter((r) => r.pass).length
  process.stdout.write(`\n${title}, ${MODEL}: ${passed}/${results.length}\n${rows.join("\n")}\n\n`)
  const ran = new Map(results.map((r) => [r.name, r]))
  const merged = cases.map((c) => ran.get(c.name) ?? before.get(c.name)).filter((r): r is Result => r !== undefined)
  fs.writeFileSync(file, JSON.stringify({ model: MODEL, date: new Date().toISOString(), results: merged }, null, 2) + "\n")
}

function summary(c: LiveCase, run: Run | undefined, pass: boolean, error?: unknown): Result {
  const done = run ?? { calls: 0, inputTokens: 0, outputTokens: 0, tools: [], reply: "" }
  return {
    name: c.name,
    pass,
    calls: done.calls,
    tokens: done.inputTokens + done.outputTokens,
    failedSteps: done.tools.filter((t) => !t.ok).length,
    exhausted: done.exhausted ?? false,
    tools: done.tools.map((t) => (t.ok ? t.name : `${t.name} (failed)`)),
    reply: done.reply,
    trace: done.tools.map((t) => ({ ...t, output: clip(t.output) })),
    ...(error ? { error: error instanceof Error ? error.message.split("\n")[0] : String(error) } : {}),
  }
}

/** A tool's output cut to its start, which is enough to read a trace by. */
function clip(output: unknown): unknown {
  const text = JSON.stringify(output) ?? ""
  return text.length > TRACE_LIMIT ? `${text.slice(0, TRACE_LIMIT)}...` : output
}
