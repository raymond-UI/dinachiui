import * as React from "react"
import { z } from "zod"
import { AgentProvider, createAgent, useAgentAction, type Agent, type AgentOptions } from "../src/agent"
import { Button } from "../src/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../src/dialog"
import { Input } from "../src/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/select"

/** What the page did, so a case checks the outcome rather than the calls that got there. */
export interface PageState {
  name: string
  region: string
  archived: string[]
  invited: { email: string; role: string }[]
  deleted: boolean
  renamedInDialog: string | null
}

function Card({ name, onArchive }: { name: string; onArchive: () => void }) {
  const ref = React.useRef<HTMLElement>(null)
  useAgentAction({
    name: "archiveProject",
    description: "Archive this project. It disappears from the list for the whole team.",
    element: ref,
    run: () => {
      onArchive()
      return { archived: name }
    },
  })
  return (
    <article ref={ref} aria-label={name}>
      <h3>{name}</h3>
    </article>
  )
}

function PageActions({ onInvite }: { onInvite: (email: string, role: string) => void }) {
  useAgentAction({
    name: "inviteMember",
    description: "Invite someone to this project by email. They get an email with a link.",
    input: z.object({ email: z.email(), role: z.enum(["viewer", "editor", "admin"]) }),
    confirm: "Sends an email to someone outside the page",
    run: ({ email, role }) => {
      onInvite(email, role)
      return { invited: email, role }
    },
  })
  return null
}

function Page({ state }: { state: PageState }) {
  const [, rerender] = React.useReducer((n: number) => n + 1, 0)
  const update = (fn: (s: PageState) => void) => {
    fn(state)
    rerender()
  }
  const [draft, setDraft] = React.useState("")
  return (
    <main>
      <h1>Project settings</h1>
      <Input aria-label="Project name" value={state.name} onValueChange={(v) => update((s) => (s.name = v))} />
      <Select value={state.region} onValueChange={(v) => update((s) => (s.region = v as string))}>
        <SelectTrigger aria-label="Region">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="ap">Asia Pacific</SelectItem>
        </SelectContent>
      </Select>

      <Dialog>
        <DialogTrigger>Rename in dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Rename project</DialogTitle>
          <Input aria-label="New name" value={draft} onValueChange={setDraft} />
          <DialogClose render={<Button />} onClick={() => update((s) => (s.renamedInDialog = s.name = draft))}>
            Save
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger data-agent-confirm="Deleting cannot be undone">Delete project</DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This removes the project for everyone.</DialogDescription>
          <Button onClick={() => update((s) => (s.deleted = true))}>Delete</Button>
        </DialogContent>
      </Dialog>

      <section aria-label="Other projects">
        {["Hermes", "Gemini"]
          .filter((p) => !state.archived.includes(p))
          .map((p) => (
            <Card key={p} name={p} onArchive={() => update((s) => s.archived.push(p))} />
          ))}
      </section>
      <PageActions onInvite={(email, role) => update((s) => s.invited.push({ email, role }))} />
    </main>
  )
}

export function mountPage(options: AgentOptions = {}): { agent: Agent; state: PageState; element: React.ReactElement } {
  const state: PageState = { name: "Apollo", region: "us", archived: [], invited: [], deleted: false, renamedInDialog: null }
  const agent = createAgent(options)
  const element = (
    <AgentProvider agent={agent}>
      <Page state={state} />
    </AgentProvider>
  )
  return { agent, state, element }
}
