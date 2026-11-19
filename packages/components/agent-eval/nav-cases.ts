import { expect } from "vitest"
import type { Agent, AgentOptions } from "../src/agent"
import type { Run } from "./model"
import type { AppState } from "./page-app"

/** A live case for the navigation and command components, shared with the dry run. */
export type NavCase = {
  name: string
  request: string
  options?: AgentOptions
  /** Puts the page where the request starts, before it renders. */
  setup?: (state: AppState) => void
  check: (state: AppState, run: Run, agent: Agent) => void
}

const allow: AgentOptions = { allow: () => true }

const task = (s: AppState, title: string) => s.tasks.find((t) => t.title === title)
const openOf = (s: AppState, name: string) => s.tasks.filter((t) => t.assignee === name && !t.done)

export const navCases: NavCase[] = [
  // Alert
  {
    name: "seats alert",
    request: "Some of the team can't sign in because we've run out of seats. Sort that out.",
    check: (s) => expect(s.seats).toBe(14),
  },
  {
    name: "at-risk project",
    request: "Sam fixed the webhook retries, so mark Hermes as back on track.",
    check: (s) => expect(s.projects.find((p) => p.id === "hermes")?.status).toBe("On track"),
  },
  // Breadcrumb
  {
    name: "breadcrumb back",
    request: "Take me back up to the list of projects.",
    setup: (s) => {
      s.openProject = "hermes"
    },
    check: (s) => {
      expect(s.openProject).toBeNull()
      expect(s.navigated).toContain("Projects")
    },
  },
  // Command palette
  {
    name: "copy project link",
    request: "Copy a link to the Apollo project so I can paste it in Slack.",
    check: (s) => expect(s.copiedLinks).toEqual(["Apollo"]),
  },
  {
    name: "dark theme",
    request: "Change the theme to dark.",
    check: (s) => expect(s.darkMode).toBe(true),
  },
  // Omnibar
  {
    name: "person's tasks",
    request: "Show me only Priya's tasks.",
    check: (s) => expect(s).toMatchObject({ person: "Priya Patel", tab: "tasks" }),
  },
  {
    name: "quick add",
    request: "Add a task called Book offsite venue and assign it to me.",
    check: (s) => expect(s.created).toContainEqual({ title: "Book offsite venue", assignee: "Jordan Lee", priority: "Medium" }),
  },
  // Ask bar
  {
    name: "bulk reassign",
    request: "Move all of Maya's tasks to Sam.",
    options: allow,
    check: (s) => {
      expect(task(s, "Review onboarding copy")?.assignee).toBe("Sam Okafor")
      expect(openOf(s, "Maya Chen")).toEqual([])
    },
  },
  {
    name: "bulk undo",
    request: "Hand all my open tasks to Priya, then undo it, I changed my mind.",
    options: allow,
    check: (s) => {
      expect(s.bulk).toHaveLength(1)
      expect(s.bulk[0].undone).toBe(true)
      expect(task(s, "Draft Q3 roadmap")?.assignee).toBe("Jordan Lee")
      expect(task(s, "Prepare sprint demo")?.assignee).toBe("Jordan Lee")
    },
  },
  // Combined
  {
    name: "reassign then filter",
    request: "Move all of Maya's tasks to Sam, then show me only Sam's tasks.",
    options: allow,
    check: (s) => {
      expect(openOf(s, "Maya Chen")).toEqual([])
      expect(s).toMatchObject({ person: "Sam Okafor", tab: "tasks" })
    },
  },
  {
    name: "open, fix and go back",
    request: "Open Hermes, mark it back on track, then go back to the projects list.",
    check: (s) => {
      expect(s.projects.find((p) => p.id === "hermes")?.status).toBe("On track")
      expect(s.openProject).toBeNull()
      expect(s.navigated).toContain("Projects")
    },
  },
]
