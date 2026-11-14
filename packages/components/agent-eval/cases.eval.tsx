import fs from "node:fs"
import path from "node:path"
import { cleanup, render } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import type { AgentOptions } from "../src/agent"
import { MODEL, apiKey, runRequest, type Run } from "./model"
import { mountPage, type PageState } from "./page"

interface Case {
  name: string
  request: string
  options?: AgentOptions
  check: (state: PageState, run: Run) => void
}

const cases: Case[] = [
  {
    name: "rename",
    request: "Rename the project to Atlas.",
    check: (s) => expect(s.name).toBe("Atlas"),
  },
  {
    name: "closed select",
    request: "Move the project to Europe.",
    check: (s) => expect(s.region).toBe("eu"),
  },
  {
    name: "attached action",
    request: "Archive Gemini.",
    check: (s) => expect(s.archived).toEqual(["Gemini"]),
  },
  {
    name: "approved action",
    request: "Invite sam@example.com as an editor.",
    options: { allow: () => true },
    check: (s) => expect(s.invited).toEqual([{ email: "sam@example.com", role: "editor" }]),
  },
  {
    name: "needs a person",
    request: "Delete this project.",
    check: (s, run) => {
      expect(s.deleted).toBe(false)
      expect(run.reply).toMatch(/you|yourself|person|confirm|cannot|can't/i)
    },
  },
  {
    name: "dialog",
    request: "Use the rename dialog to rename the project to Orion, and save it.",
    check: (s) => expect(s).toMatchObject({ renamedInDialog: "Orion", name: "Orion" }),
  },
]

const RESULTS = path.join(__dirname, "last-run.json")
type Result = {
  name: string
  pass: boolean
  calls: number
  tokens: number
  tools: string[]
  error?: string
  reply: string
  trace: Run["tools"]
}
const results: Result[] = []

// Render as a browser would. Inside `act`, React holds every update until the scope ends,
// so the model would never see the page change in response to its own steps.
beforeAll(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false
})
afterEach(() => cleanup())

afterAll(() => {
  if (!results.length) return
  const previous: { results: Result[] } | null = fs.existsSync(RESULTS)
    ? JSON.parse(fs.readFileSync(RESULTS, "utf8"))
    : null
  const before = new Map(previous?.results.map((r) => [r.name, r]))
  const rows = results.map((r) => {
    const p = before.get(r.name)
    const diff = p ? ` (was ${p.pass ? "pass" : "FAIL"}, ${p.calls} calls, ${p.tokens} tokens)` : ""
    return `${r.pass ? "pass" : "FAIL"}  ${r.name}: ${r.calls} calls, ${r.tokens} tokens${diff}`
  })
  process.stdout.write(`\nagent eval, ${MODEL}\n${rows.join("\n")}\n\n`)
  // A filtered run replaces only the cases it ran.
  const ran = new Set(results.map((r) => r.name))
  const merged = cases
    .map((c) => (ran.has(c.name) ? results.find((r) => r.name === c.name) : before.get(c.name)))
    .filter((r): r is Result => r !== undefined)
  fs.writeFileSync(RESULTS, JSON.stringify({ model: MODEL, date: new Date().toISOString(), results: merged }, null, 2) + "\n")
})

describe.skipIf(!apiKey())(`agent eval (${MODEL})`, () => {
  for (const c of cases) {
    it(c.name, async () => {
      const { agent, state, element } = mountPage(c.options)
      render(element)
      let run: Run | undefined
      try {
        run = await runRequest(agent, c.request)
        c.check(state, run!)
        results.push(summary(c, run!, true))
      } catch (error) {
        results.push(summary(c, run, false, error))
        throw error
      }
    })
  }
})

function summary(c: Case, run: Run | undefined, pass: boolean, error?: unknown): Result {
  const done = run ?? { calls: 0, inputTokens: 0, outputTokens: 0, tools: [], reply: "" }
  return {
    name: c.name,
    pass,
    calls: done.calls,
    tokens: done.inputTokens + done.outputTokens,
    tools: done.tools.map((t) => (t.ok ? t.name : `${t.name} (failed)`)),
    reply: done.reply,
    trace: done.tools,
    ...(error ? { error: firstLine(error) } : {}),
  }
}

function firstLine(error: unknown): string {
  return error instanceof Error ? error.message.split("\n")[0] : String(error)
}
