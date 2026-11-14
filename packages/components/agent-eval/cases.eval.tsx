import path from "node:path"
import { expect } from "vitest"
import type { Agent, AgentOptions } from "../src/agent"
import { liveSuite } from "./harness"
import type { Run } from "./model"
import { mountPage, type PageState } from "./page"
import { mountGroups, type GroupsState } from "./page-groups"

type Case = {
  name: string
  request: string
  options?: AgentOptions
} & (
  | { page?: "settings"; check: (state: PageState, run: Run, agent: Agent) => void }
  | { page: "groups"; check: (state: GroupsState, run: Run, agent: Agent) => void }
)

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
  {
    name: "fields",
    page: "groups",
    request: "Set the description to Moon mission, seats to 12 and volume to 30.",
    check: (s) => expect(s).toMatchObject({ description: "Moon mission", seats: 12, volume: 30 }),
  },
  {
    name: "choices",
    page: "groups",
    request: "Turn on email alerts, switch to the Pro plan, accept the terms and pick Cherry as the snack.",
    check: (s) => expect(s).toMatchObject({ alerts: true, plan: "pro", terms: true, fruit: "Cherry" }),
  },
  {
    name: "menu",
    page: "groups",
    request: "Pin it from the Actions menu.",
    check: (s) => expect(s).toMatchObject({ pinned: true, duplicated: false }),
  },
  {
    name: "disclosure",
    page: "groups",
    request: "Show me the Returns answer in the FAQ.",
    check: (s) => expect(s.faq).toEqual(["returns"]),
  },
  {
    name: "navigation",
    page: "groups",
    request: "Go to the Billing section, and move Components to the top of the chapters.",
    check: (s) => expect(s).toMatchObject({ tab: "billing", chapters: ["Components", "Overview", "Installation"] }),
  },
  {
    name: "read only",
    page: "groups",
    request: "How far along is the upload, and how full is storage? Then dismiss the notification.",
    check: (_, run, agent) => {
      expect(run.reply).toMatch(/55/)
      expect(run.reply).toMatch(/40/)
      expect(agent.snapshot().some((c) => c.component === "toast")).toBe(false)
    },
  },
]

liveSuite({
  title: "agent eval",
  file: path.join(__dirname, "last-run.json"),
  cases,
  mount: (c) => (c.page === "groups" ? mountGroups(c.options) : mountPage(c.options)),
  check: (c, state, run, agent) => (c.check as (state: unknown, run: Run, agent: Agent) => void)(state, run, agent),
})
