import fs from "node:fs"
import path from "node:path"
import { agentToolsFor, runAgentTool, type Agent, type AgentToolDefinition, type AgentToolOptions } from "../src/agent"

export const MODEL = process.env.AGENT_EVAL_MODEL ?? "claude-sonnet-5-5"

const SYSTEM = `You help a person with the web page in front of them by operating its controls through tools.
Call snapshot before acting unless you already know the controls. Name controls by their label.
Prefer an app action over operating controls one by one when one fits the request.
If a step fails, read the error: it says what went wrong and often lists valid choices.
If the app refuses a change, tell the person rather than retrying.
What you need may be on a tab, in a menu or in a collapsed section that is not open yet. Open the likely ones before saying it is not there.
Keep replies to one or two short sentences.`

/** The key from the environment, or from `.env.local` at the repo root. */
export function apiKey(): string | undefined {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY
  const file = path.resolve(__dirname, "../../../.env.local")
  if (!fs.existsSync(file)) return undefined
  const line = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .find((l) => l.startsWith("ANTHROPIC_API_KEY="))
  return line?.slice("ANTHROPIC_API_KEY=".length).trim().replace(/^["']|["']$/g, "") || undefined
}

type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string }
type Message = { role: "user" | "assistant"; content: string | Block[] }

export interface Run {
  /** Requests to the model. */
  calls: number
  inputTokens: number
  outputTokens: number
  /** Tool calls in order, with whether each succeeded. */
  tools: { name: string; input: unknown; ok: boolean; output: unknown }[]
  reply: string
  /** The model was still calling tools when the turn limit ran out. */
  exhausted?: boolean
}

/** Sends one request and lets the model work the page until it stops calling tools. */
export async function runRequest(
  agent: Agent,
  request: string,
  { turns = 12, ...options }: AgentToolOptions & { turns?: number } = {}
): Promise<Run> {
  const key = apiKey()
  if (!key) throw new Error("Set ANTHROPIC_API_KEY.")
  const run: Run = { calls: 0, inputTokens: 0, outputTokens: 0, tools: [], reply: "" }
  const messages: Message[] = [{ role: "user", content: request }]

  for (let turn = 0; turn < turns; turn++) {
    const data = await callModel(key, agentToolsFor(agent, options), messages)
    run.calls++
    run.inputTokens += data.usage?.input_tokens ?? 0
    run.outputTokens += data.usage?.output_tokens ?? 0
    messages.push({ role: "assistant", content: data.content })
    run.reply += data.content.map((b) => (b.type === "text" ? b.text : "")).join("")
    if (data.stop_reason !== "tool_use") break
    messages.push({ role: "user", content: await runTools(agent, data.content, run, options) })
    if (turn === turns - 1) run.exhausted = true
  }
  return run
}

interface Reply {
  content: Block[]
  stop_reason: string
  usage?: { input_tokens?: number; output_tokens?: number }
}

async function callModel(key: string, tools: AgentToolDefinition[], messages: Message[]): Promise<Reply> {
  // Overloaded and rate-limited replies say nothing about the model, so they are retried.
  for (let attempt = 0; ; attempt++) {
    const res = await request(key, tools, messages)
    if ((res.status === 429 || res.status === 529) && attempt < 4) {
      await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** attempt))
      continue
    }
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message ?? res.statusText)
    return data as Reply
  }
}

function request(key: string, tools: AgentToolDefinition[], messages: Message[]): Promise<Response> {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      tools: tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema })),
      messages,
    }),
  })
}

/** Runs each tool the model called, recording it, and returns the results to send back. */
async function runTools(agent: Agent, content: Block[], run: Run, options: AgentToolOptions): Promise<Block[]> {
  const results: Block[] = []
  for (const block of content) {
    if (block.type !== "tool_use") continue
    const result = (await runAgentTool(agent, block.name, block.input, options)) as { ok?: boolean }
    run.tools.push({ name: block.name, input: block.input, ok: result?.ok !== false, output: result })
    results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(result) })
  }
  return results
}
