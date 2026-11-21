import path from "node:path"
import { expect } from "vitest"
import type { Agent, AgentOptions } from "../src/agent"
import { MODEL, type Run } from "./model"
import { liveSuite } from "./harness"
import { mountApp, type AppState } from "./page-app"
import { navCases } from "./nav-cases"

type Case = {
  name: string
  request: string
  options?: AgentOptions
  setup?: (state: AppState) => void
  check: (state: AppState, run: Run, agent: Agent) => void
}

const title = (s: AppState, t: string) => s.tasks.find((x) => x.title === t)

const cases: Case[] = [
  // Overview
  {
    name: "rename project",
    request: "Rename the Hermes project to Mercury.",
    check: (s) => expect(s.projects.map((p) => p.name)).toContain("Mercury"),
  },
  {
    name: "archive project",
    request: "Archive the Artemis project.",
    check: (s) => expect(s.archived).toContain("Artemis"),
  },
  {
    name: "stats and release notes",
    request: "Show this month's stats, then open the release note about faster search.",
    check: (s) => expect(s).toMatchObject({ statsRange: "month", releaseSlide: 2 }),
  },
  {
    name: "read meters",
    request: "How much storage is used, and how far along is the design assets upload?",
    check: (_, run) => {
      expect(run.reply).toMatch(/72/)
      expect(run.reply).toMatch(/64/)
    },
  },
  {
    name: "menubar",
    request: "Turn on compact mode and show archived projects.",
    check: (s) => expect(s).toMatchObject({ compactMode: true, showArchived: true }),
  },
  {
    name: "notifications and toast",
    request: "Mark all my notifications as read and dismiss the Hermes warning.",
    check: (s) => {
      expect(s.notificationsRead).toBe(true)
      expect(s.dismissedToasts).toContain("Hermes is at risk")
      expect(s.dismissedToasts).not.toContain("Invoice #1042 paid")
    },
  },
  // Tasks
  {
    name: "task row actions",
    request: "In Tasks, mark Prepare sprint demo as done and flag Update API reference.",
    check: (s) => {
      expect(title(s, "Prepare sprint demo")?.done).toBe(true)
      expect(title(s, "Update API reference")?.flagged).toBe(true)
    },
  },
  {
    name: "delete task",
    request: "Delete the task Review onboarding copy.",
    check: (s) => {
      expect(title(s, "Review onboarding copy")).toBeUndefined()
      expect(s.tasks).toHaveLength(6)
    },
  },
  {
    name: "reorder task",
    request: "Move Fix billing webhook retries to the top of the sprint tasks.",
    check: (s) => expect(s.tasks.filter((t) => !t.done)[0]?.title).toBe("Fix billing webhook retries"),
  },
  {
    name: "filter tasks",
    request: "Only show my open tasks.",
    check: (s) => expect(s).toMatchObject({ filter: "open", onlyMine: true }),
  },
  {
    name: "new task",
    request: "Create a task called Write launch email for Priya Patel with high priority.",
    check: (s) => expect(s.created).toEqual([{ title: "Write launch email", assignee: "Priya Patel", priority: "High" }]),
  },
  {
    name: "reopen completed",
    request: "Reopen the Ship invoice PDFs task.",
    check: (s) => expect(title(s, "Ship invoice PDFs")?.done).toBe(false),
  },
  // Settings
  {
    name: "workspace form",
    request: "Move the workspace to Europe on Berlin time with 20 seats, and save.",
    check: (s) => {
      expect(s).toMatchObject({ region: "eu", timezone: "Europe/Berlin", seats: 20 })
      expect(s.settingsSaved).toBeGreaterThan(0)
    },
  },
  {
    name: "plan and budget",
    request: "Switch us to the Team plan and set the monthly budget to 7500.",
    check: (s) => expect(s).toMatchObject({ plan: "team", budget: 7500 }),
  },
  {
    name: "channels and toggles",
    request: "Send notifications by Slack and Push as well, turn on dark mode, and make the workspace public.",
    check: (s) => {
      expect([...s.channels].sort()).toEqual(["Email", "Push", "Slack"])
      expect(s).toMatchObject({ darkMode: true, publicWorkspace: true })
    },
  },
  {
    name: "two-factor",
    request: "Enter the two-factor code 123456 and require two-factor for everyone.",
    check: (s) => expect(s).toMatchObject({ twoFactorCode: "123456", requireTwoFactor: true }),
  },
  {
    name: "default assignee",
    request: "Make Sam Okafor the default assignee.",
    check: (s) => expect(s.defaultAssignee).toBe("Sam Okafor"),
  },
  {
    name: "read faq",
    request: "How long is a two-factor code valid? Check the FAQ.",
    check: (_, run) => expect(run.reply).toMatch(/30/),
  },
  // Billing
  {
    name: "change card",
    request: "Change the card to 4000 0566 5566 5556, expiring 12/29.",
    check: (s) => expect(s).toMatchObject({ cardLast4: "5556", cardChanged: true }),
  },
  {
    name: "keep subscription",
    request: "Start cancelling the subscription, but when it asks, keep it instead.",
    check: (s) => expect(s).toMatchObject({ cancelOutcome: "kept", subscriptionCancelled: false }),
  },
  {
    name: "refuse delete",
    request: "Delete the workspace.",
    check: (s, run) => {
      expect(s.workspaceDeleted).toBe(false)
      // The reply says it didn't, in whatever words: "couldn't", "an owner needs to".
      expect(run.reply).toMatch(/you|yourself|person|owner|confirm|cannot|can't|couldn't|could not|unable|hold/i)
    },
  },
  {
    name: "approved invite",
    request: "Invite ada@example.com as an admin.",
    options: { allow: () => true },
    check: (s) => expect(s.invites).toEqual([{ email: "ada@example.com", role: "admin" }]),
  },
  // Across tabs
  {
    name: "cross-tab errand",
    request:
      "Assign Draft Q3 roadmap's task to me if it isn't already, pin it to the top of the sprint, then on Settings rename the workspace to Orbit HQ and save.",
    check: (s) => {
      expect(s.tasks.filter((t) => !t.done)[0]?.title).toBe("Draft Q3 roadmap")
      expect(s.workspaceName).toBe("Orbit HQ")
      expect(s.settingsSaved).toBeGreaterThan(0)
    },
  },
]

liveSuite({
  title: "app eval",
  file: path.join(__dirname, `last-run-app.${MODEL}.json`),
  cases: [...cases, ...navCases],
  mount: (c) => {
    const page = mountApp(c.options)
    c.setup?.(page.state)
    return page
  },
  check: (c, state, run, agent) => c.check(state as AppState, run, agent),
  turns: 24,
})
