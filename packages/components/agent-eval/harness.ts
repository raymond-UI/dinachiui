import fs from "node:fs"
import type * as React from "react"
import { cleanup, render } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, describe, it } from "vitest"
import type { Agent } from "../src/agent"
import { MODEL, VIA, available, runRequest, type Run } from "./model"

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

/**
 * How many times each case runs. A model can pass a case one run and miss it the next, so
 * with more than one a case passes when most of its runs do, and stops once that's settled.
 */
const RUNS = Math.max(1, Number(process.env.AGENT_EVAL_RUNS) || 1)

interface Result {
  name: string
  pass: boolean
  calls: number
  tokens: number
  failedSteps: number
  exhausted: boolean
  tools: string[]
  error?: string
  /** Each run's outcome, when the case ran more than once. */
  runs?: boolean[]
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

  describe.skipIf(!available())(`${title} (${MODEL}${VIA === "claude-code" ? ", via Claude Code" : ""})`, () => {
    for (const c of cases) {
      it(c.name, { timeout: RUNS * 180_000 }, async () => {
        const runs: Result[] = []
        const need = Math.floor(RUNS / 2) + 1
        while (runs.filter((r) => r.pass).length < need && runs.filter((r) => !r.pass).length < need) {
          runs.push(await once(c))
          cleanup()
        }
        const pass = runs.filter((r) => r.pass).length >= need
        // The trace kept is a run that went the way the case did.
        const shown = runs.find((r) => r.pass === pass)!
        results.push(RUNS > 1 ? { ...shown, runs: runs.map((r) => r.pass) } : shown)
        if (!pass) throw new Error(shown.error ?? "failed")
      })
    }
  })

  async function once(c: C): Promise<Result> {
    const page = mount(c)
    render(page.element)
    // Let effects settle, such as a toast added on mount.
    await new Promise((resolve) => setTimeout(resolve, 50))
    let run: Run | undefined
    try {
      run = await runRequest(page.agent, c.request, { turns })
      check(c, page.state, run, page.agent)
      return summary(c, run, true)
    } catch (error) {
      return summary(c, run, false, error)
    }
  }
}

function report(title: string, base: string, cases: LiveCase[], results: Result[]) {
  if (!results.length) return
  // Claude Code adds its own overhead to every call, so its token counts are kept apart.
  const file = VIA === "claude-code" ? base.replace(/\.json$/, ".claude-code.json") : base
  const previous: { results: Result[] } | null = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null
  const before = new Map(previous?.results.map((r) => [r.name, r]))
  const rows = results.map((r) => {
    const p = before.get(r.name)
    const was = p ? ` (was ${p.pass ? "pass" : "FAIL"}, ${p.calls} calls, ${p.tokens} tokens)` : ""
    const failed = r.failedSteps ? `, ${r.failedSteps} failed tool calls` : ""
    const votes = r.runs ? ` [${r.runs.filter(Boolean).length}/${r.runs.length} runs]` : ""
    return `${r.pass ? "pass" : "FAIL"}  ${r.name}${votes}: ${r.calls} calls, ${r.tokens} tokens${failed}${r.exhausted ? ", ran out of turns" : ""}${was}`
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
