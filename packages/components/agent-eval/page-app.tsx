import * as React from "react"
import { z } from "zod"
import { AgentProvider, createAgent, useAgentAction, type Agent, type AgentOptions } from "../src/agent"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "../src/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBackdrop,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../src/alert-dialog"
import { AnimatedIcon } from "../src/animated-icon"
import { AnimatedList, AnimatedListItem } from "../src/animated-list"
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "../src/animated-tabs"
import { Autocomplete, AutocompleteContent, AutocompleteInput, AutocompleteItem, AutocompleteList } from "../src/autocomplete"
import { Avatar, AvatarFallback, AvatarImage } from "../src/avatar"
import { Badge } from "../src/badge"
import { Button } from "../src/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../src/card"
import { Carousel, CarouselDots, CarouselNext, CarouselPrevious, CarouselSlide, CarouselViewport } from "../src/carousel"
import { Checkbox } from "../src/checkbox"
import { CheckboxGroup } from "../src/checkbox-group"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "../src/collapsible"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "../src/combobox"
import { CompareSlider } from "../src/compare-slider"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../src/context-menu"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../src/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../src/drawer"
import { ExpandableCard, ExpandableCardBody, ExpandableCardPanel, ExpandableCardTrigger } from "../src/expandable-card"
import { Field, FieldDescription, FieldLabel } from "../src/field"
import { Fieldset, FieldsetLegend } from "../src/fieldset"
import { Form } from "../src/form"
import { HoldToConfirm } from "../src/hold-to-confirm"
import { Input } from "../src/input"
import { Label } from "../src/label"
import { Link } from "../src/link"
import { LoadTransition } from "../src/load-transition"
import { Marquee } from "../src/marquee"
import { Menu, MenuCheckboxItem, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "../src/menu"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarPositioner,
  MenubarSeparator,
  MenubarTrigger,
} from "../src/menubar"
import { Meter, MeterIndicator, MeterLabel, MeterTrack } from "../src/meter"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../src/navigation-menu"
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from "../src/number-field"
import { NumberTicker } from "../src/number-ticker"
import { OTPField, OTPFieldGroup, OTPFieldInput, OTPFieldSeparator } from "../src/otp-field"
import { Popover, PopoverClose, PopoverContent, PopoverTitle, PopoverTrigger } from "../src/popover"
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "../src/preview-card"
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack } from "../src/progress"
import { ProgressRing } from "../src/progress-ring"
import { Radio, RadioGroup } from "../src/radio"
import { ScrollArea } from "../src/scroll-area"
import { ScrollProgress } from "../src/scroll-progress"
import { ScrollReveal } from "../src/scroll-reveal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/select"
import { Separator } from "../src/separator"
import { Skeleton } from "../src/skeleton"
import { Slider, SliderControl, SliderLabel, SliderRange, SliderThumb, SliderTrack } from "../src/slider"
import { Sortable, SortableHandle, SortableItem } from "../src/sortable"
import { StaggerList, StaggerListItem } from "../src/stagger-list"
import { StreamingText } from "../src/streaming-text"
import { SwipeableRow, SwipeableRowGroup } from "../src/swipeable-row"
import { Switch, SwitchThumb } from "../src/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/tabs"
import { Text } from "../src/text"
import { TextMorph } from "../src/text-morph"
import { TextShimmer } from "../src/text-shimmer"
import { Textarea } from "../src/textarea"
import { Toast, useToastManager } from "../src/toast"
import { Toggle } from "../src/toggle"
import { ToggleGroup, ToggleGroupItem } from "../src/toggle-group"
import { ToolbarButton, ToolbarLink, ToolbarRoot, ToolbarSeparator } from "../src/toolbar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../src/tooltip"

// jsdom has no Web Animations API. Base UI's ScrollArea viewport calls `getAnimations()`
// from a timeout after mount, which throws an uncaught TypeError without this.
if (typeof Element !== "undefined" && typeof Element.prototype.getAnimations !== "function") {
  Element.prototype.getAnimations = () => []
}

const ME = "Jordan Lee"
const TEAM = ["Jordan Lee", "Maya Chen", "Priya Patel", "Sam Okafor", "Lena Fischer"]
const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Africa/Lagos",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
]
const CHANNELS = ["Email", "Slack", "SMS", "Push"]
const RELEASES = ["v2.4: Timeline view", "v2.3: Guest access", "v2.2: Faster search"]

export interface Project {
  id: string
  name: string
  progress: number
  status: "On track" | "At risk" | "Shipped"
  pinned: boolean
}

export interface Task {
  id: string
  title: string
  assignee: string
  priority: "Low" | "Medium" | "High"
  done: boolean
  flagged: boolean
}

/** Everything the app did, so a case checks the outcome rather than the calls that got there. */
export interface AppState {
  /** Main section: "overview" | "tasks" | "settings" | "billing". */
  tab: string
  // Top bar
  /** Every link followed, by its label, in order. */
  navigated: string[]
  /** Menubar and toolbar commands run, as "Menu > Item". */
  commands: string[]
  compactMode: boolean
  showArchived: boolean
  favorite: boolean
  notificationsRead: boolean
  // Overview
  projects: Project[]
  archived: string[]
  duplicated: string[]
  renamed: { from: string; to: string }[]
  /** The project being renamed inline, by id. */
  renaming: string | null
  statsRange: string
  releaseSlide: number
  compareSplit: number
  summaryRuns: number
  summaryLoading: boolean
  // Tasks
  /** In display order. */
  tasks: Task[]
  deleted: string[]
  filter: "all" | "open" | "done"
  onlyMine: boolean
  search: string
  completedOpen: boolean
  briefOpen: boolean
  newTaskOpen: boolean
  created: { title: string; assignee: string; priority: string }[]
  // Settings
  workspaceName: string
  description: string
  region: string
  timezone: string
  defaultAssignee: string | null
  seats: number | null
  twoFactorCode: string
  requireTwoFactor: boolean
  channels: string[]
  plan: string
  darkMode: boolean
  publicWorkspace: boolean
  budget: number
  faq: string[]
  advanced: string[]
  settingsSaved: number
  // Billing
  cardLast4: string
  cardChanged: boolean
  /** How the cancel dialog was left: "kept", "cancelled", or null if never answered. */
  cancelOutcome: "kept" | "cancelled" | null
  subscriptionCancelled: boolean
  workspaceDeleted: boolean
  invites: { email: string; role: string }[]
  dismissedToasts: string[]
}

type Update = (fn: (s: AppState) => void) => void

function initialState(): AppState {
  return {
    tab: "overview",
    navigated: [],
    commands: [],
    compactMode: false,
    showArchived: false,
    favorite: false,
    notificationsRead: false,
    projects: [
      { id: "apollo", name: "Apollo", progress: 72, status: "On track", pinned: true },
      { id: "hermes", name: "Hermes", progress: 45, status: "At risk", pinned: false },
      { id: "gemini", name: "Gemini", progress: 100, status: "Shipped", pinned: false },
      { id: "artemis", name: "Artemis", progress: 18, status: "On track", pinned: false },
    ],
    archived: [],
    duplicated: [],
    renamed: [],
    renaming: null,
    statsRange: "week",
    releaseSlide: 0,
    compareSplit: 50,
    summaryRuns: 0,
    summaryLoading: false,
    tasks: [
      { id: "t1", title: "Draft Q3 roadmap", assignee: "Jordan Lee", priority: "High", done: false, flagged: false },
      { id: "t2", title: "Review onboarding copy", assignee: "Maya Chen", priority: "Medium", done: false, flagged: false },
      { id: "t3", title: "Fix billing webhook retries", assignee: "Sam Okafor", priority: "High", done: false, flagged: true },
      { id: "t4", title: "Prepare sprint demo", assignee: "Jordan Lee", priority: "Low", done: false, flagged: false },
      { id: "t5", title: "Update API reference", assignee: "Priya Patel", priority: "Medium", done: false, flagged: false },
      { id: "t6", title: "Migrate search index", assignee: "Lena Fischer", priority: "Medium", done: true, flagged: false },
      { id: "t7", title: "Ship invoice PDFs", assignee: "Jordan Lee", priority: "High", done: true, flagged: false },
    ],
    deleted: [],
    filter: "all",
    onlyMine: false,
    search: "",
    completedOpen: false,
    briefOpen: false,
    newTaskOpen: false,
    created: [],
    workspaceName: "Orbit Labs",
    description: "Product and platform work for the Orbit team.",
    region: "us",
    timezone: "America/New_York",
    defaultAssignee: "Maya Chen",
    seats: 12,
    twoFactorCode: "",
    requireTwoFactor: false,
    channels: ["Email"],
    plan: "pro",
    darkMode: false,
    publicWorkspace: false,
    budget: 5000,
    faq: [],
    advanced: [],
    settingsSaved: 0,
    cardLast4: "4242",
    cardChanged: false,
    cancelOutcome: null,
    subscriptionCancelled: false,
    workspaceDeleted: false,
    invites: [],
    dismissedToasts: [],
  }
}

// ---------------------------------------------------------------------------------------
// Top bar

function TopBar({ state, update }: { state: AppState; update: Update }) {
  const follow = (label: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    update((s) => s.navigated.push(label))
  }
  const command = (name: string) => () => update((s) => s.commands.push(name))
  const unread = state.notificationsRead ? 0 : 3

  return (
    <header className="flex items-center gap-4 border-b px-6 py-3">
      <ScrollProgress />
      <Text variant="large" as="span">
        Orbit
      </Text>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#/roadmaps" onClick={follow("Roadmaps")}>Roadmaps</NavigationMenuLink>
              <NavigationMenuLink href="#/sprints" onClick={follow("Sprints")}>Sprints</NavigationMenuLink>
              <NavigationMenuLink href="#/insights" onClick={follow("Insights")}>Insights</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="docs">
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#/docs/start" onClick={follow("Getting started")}>Getting started</NavigationMenuLink>
              <NavigationMenuLink href="#/docs/api" onClick={follow("API reference")}>API reference</NavigationMenuLink>
              <NavigationMenuLink href="#/docs/changelog" onClick={follow("Changelog")}>Changelog</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#/pricing" onClick={follow("Pricing")}>Pricing</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPortal>
          <NavigationMenuPositioner>
            <NavigationMenuPopup>
              <NavigationMenuViewport />
            </NavigationMenuPopup>
          </NavigationMenuPositioner>
        </NavigationMenuPortal>
      </NavigationMenu>

      <Menubar aria-label="Workspace menu">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarPortal>
            <MenubarPositioner>
              <MenubarContent>
                <MenubarItem onClick={() => update((s) => { s.commands.push("File > New task"); s.newTaskOpen = true })}>
                  New task
                </MenubarItem>
                <MenubarItem
                  onClick={() =>
                    update((s) => {
                      s.commands.push("File > New project")
                      s.projects.push({ id: `p${s.projects.length + 1}`, name: "Untitled project", progress: 0, status: "On track", pinned: false })
                    })
                  }
                >
                  New project
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={command("File > Import CSV")}>Import CSV</MenubarItem>
                <MenubarItem onClick={command("File > Export CSV")}>Export CSV</MenubarItem>
              </MenubarContent>
            </MenubarPositioner>
          </MenubarPortal>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarPortal>
            <MenubarPositioner>
              <MenubarContent>
                <MenubarItem onClick={command("Edit > Undo")}>Undo</MenubarItem>
                <MenubarItem onClick={command("Edit > Redo")}>Redo</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={command("Edit > Select all tasks")}>Select all tasks</MenubarItem>
              </MenubarContent>
            </MenubarPositioner>
          </MenubarPortal>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarPortal>
            <MenubarPositioner>
              <MenubarContent>
                <MenubarCheckboxItem checked={state.compactMode} onCheckedChange={(v) => update((s) => (s.compactMode = v))}>
                  Compact mode
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked={state.showArchived} onCheckedChange={(v) => update((s) => (s.showArchived = v))}>
                  Show archived projects
                </MenubarCheckboxItem>
                <MenubarSeparator />
                <MenubarItem onClick={command("View > Zoom in")}>Zoom in</MenubarItem>
              </MenubarContent>
            </MenubarPositioner>
          </MenubarPortal>
        </MenubarMenu>
      </Menubar>

      <ToolbarRoot aria-label="Workspace tools">
        <ToolbarButton onClick={command("Toolbar > Share")}>Share</ToolbarButton>
        <ToolbarButton
          aria-label="Favorite workspace"
          aria-pressed={state.favorite}
          onClick={() => update((s) => (s.favorite = !s.favorite))}
        >
          <AnimatedIcon active={state.favorite} from={<span>☆</span>} to={<span>★</span>} />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarLink href="#/changelog" onClick={follow("What's new")}>
          What's new
        </ToolbarLink>
      </ToolbarRoot>

      <span className="ml-auto flex items-center gap-3">
        <Text variant="muted" as="span">
          On call:{" "}
        </Text>
        <PreviewCard>
          <PreviewCardTrigger delay={0} href="#/people/maya" onClick={follow("Maya Chen")}>
            Maya Chen
          </PreviewCardTrigger>
          <PreviewCardContent>
            <Text variant="small">Maya Chen, Staff engineer</Text>
            <Text variant="muted">Owns Hermes and the billing pipeline. Based in Berlin.</Text>
          </PreviewCardContent>
        </PreviewCard>

        <Popover>
          <PopoverTrigger>
            Notifications {unread > 0 ? <Badge variant="destructive" size="sm">{unread}</Badge> : null}
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Notifications</PopoverTitle>
            <ul>
              <li>Maya Chen commented on Hermes</li>
              <li>Invoice #1042 was paid</li>
              <li>Priya Patel assigned you "Update API reference"</li>
            </ul>
            <PopoverClose onClick={() => update((s) => (s.notificationsRead = true))}>Mark all as read</PopoverClose>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger aria-label="Keyboard shortcuts">?</TooltipTrigger>
          <TooltipContent>Press ? anywhere to see shortcuts</TooltipContent>
        </Tooltip>

        <Link href="#/help" onClick={follow("Help center")}>
          Help center
        </Link>

        <Button variant="ghost" size="sm" aria-label={`Account, signed in as ${ME}`} onClick={follow("Account")}>
          <Avatar>
            <AvatarImage src="https://example.com/jordan.png" alt={ME} />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
        </Button>
        <Badge variant="secondary">{state.plan === "free" ? "Free" : state.plan === "team" ? "Team" : "Pro"}</Badge>
      </span>
    </header>
  )
}

// ---------------------------------------------------------------------------------------
// Overview

function ProjectCard({ project, archived, renaming, update }: { project: Project; archived: boolean; renaming: boolean; update: Update }) {
  const ref = React.useRef<HTMLElement>(null)
  const [draft, setDraft] = React.useState(project.name)
  const archive = () =>
    update((s) => {
      if (!s.archived.includes(project.name)) s.archived.push(project.name)
    })
  useAgentAction({
    name: "archiveProject",
    description: "Archive this project. It is hidden from the overview for the whole team.",
    element: ref,
    disabled: archived,
    run: () => {
      archive()
      return { archived: project.name }
    },
  })

  return (
    <Card ref={ref as React.Ref<HTMLDivElement>} role="article" aria-label={project.name}>
      <CardHeader>
        <span className="flex items-center justify-between">
          {renaming ? (
            <span className="flex gap-2">
              <Input aria-label="Project name" value={draft} onValueChange={setDraft} />
              <Button
                size="sm"
                onClick={() =>
                  update((s) => {
                    const p = s.projects.find((x) => x.id === project.id)!
                    s.renamed.push({ from: p.name, to: draft })
                    p.name = draft
                    s.renaming = null
                  })
                }
              >
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => update((s) => (s.renaming = null))}>
                Cancel
              </Button>
            </span>
          ) : (
            <CardTitle>{project.name}</CardTitle>
          )}
          <Menu>
            <MenuTrigger aria-label="Project actions">⋯</MenuTrigger>
            <MenuContent>
              <MenuItem onClick={() => { setDraft(project.name); update((s) => (s.renaming = project.id)) }}>Rename</MenuItem>
              <MenuItem
                onClick={() =>
                  update((s) => {
                    s.duplicated.push(project.name)
                    s.projects.push({ ...project, id: `${project.id}-copy`, name: `${project.name} copy`, pinned: false })
                  })
                }
              >
                Duplicate
              </MenuItem>
              <MenuCheckboxItem
                checked={project.pinned}
                onCheckedChange={(v) => update((s) => (s.projects.find((x) => x.id === project.id)!.pinned = v))}
              >
                Pin to sidebar
              </MenuCheckboxItem>
              <MenuSeparator />
              <MenuItem onClick={archive}>Archive</MenuItem>
            </MenuContent>
          </Menu>
        </span>
        <span className="flex gap-2">
          <Badge variant={project.status === "At risk" ? "warning" : project.status === "Shipped" ? "success" : "info"}>
            {project.status}
          </Badge>
          {archived ? <Badge variant="outline">Archived</Badge> : null}
        </span>
      </CardHeader>
      <CardContent>
        <ProgressRing value={project.progress} label={`${project.name} progress`} size={48} showValue />
      </CardContent>
    </Card>
  )
}

const SUMMARY =
  "Apollo is on track for the July launch. Hermes slipped a week because of the billing webhook retries; Sam is on it. Gemini shipped on Tuesday."

function Overview({ state, update }: { state: AppState; update: Update }) {
  const open = state.tasks.filter((t) => !t.done).length
  const done = state.tasks.filter((t) => t.done).length
  const factor = state.statsRange === "week" ? 1 : state.statsRange === "month" ? 4 : 12
  const visible = state.projects.filter((p) => state.showArchived || !state.archived.includes(p.name))

  const regenerate = () => {
    update((s) => {
      s.summaryRuns++
      s.summaryLoading = true
    })
    setTimeout(() => update((s) => (s.summaryLoading = false)), 300)
  }

  return (
    <div className="space-y-6">
      <Text variant="h2">Overview</Text>
      <section aria-label="Projects" className="grid grid-cols-4 gap-4">
        {visible.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            archived={state.archived.includes(p.name)}
            renaming={state.renaming === p.id}
            update={update}
          />
        ))}
      </section>

      <Separator />

      <section aria-label="Stats">
        <Tabs aria-label="Stats range" value={state.statsRange} onValueChange={(v) => update((s) => (s.statsRange = v as string))}>
          <TabsList>
            <TabsTrigger value="week">This week</TabsTrigger>
            <TabsTrigger value="month">This month</TabsTrigger>
            <TabsTrigger value="quarter">This quarter</TabsTrigger>
          </TabsList>
          {["week", "month", "quarter"].map((range) => (
            <TabsContent key={range} value={range}>
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dt>Open tasks</dt>
                  <dd><NumberTicker value={open} /></dd>
                </div>
                <div>
                  <dt>Completed</dt>
                  <dd><NumberTicker value={done * factor} /></dd>
                </div>
                <div>
                  <dt>Hours logged</dt>
                  <dd><NumberTicker value={38 * factor} /></dd>
                </div>
              </dl>
            </TabsContent>
          ))}
        </Tabs>

        <Meter value={72} min={0} max={100}>
          <MeterLabel>Storage used</MeterLabel>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
        <Progress value={64}>
          <ProgressLabel>Uploading design-assets.zip</ProgressLabel>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </section>

      <Card aria-label="AI summary">
        <CardHeader>
          <CardTitle>
            <TextMorph>{state.summaryLoading ? "Summarizing" : "Weekly summary"}</TextMorph>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadTransition loading={state.summaryLoading} skeleton={<Skeleton className="h-16 w-full" />}>
            {state.summaryLoading ? (
              <TextShimmer>Reading this week's activity…</TextShimmer>
            ) : (
              <StreamingText text={SUMMARY} complete runKey={state.summaryRuns} />
            )}
          </LoadTransition>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={regenerate}>
            Regenerate summary
          </Button>
        </CardFooter>
      </Card>

      <ScrollReveal>
        <section aria-label="Release notes">
          <Text variant="h3">Release notes</Text>
          <Carousel
            label="Release notes"
            index={state.releaseSlide}
            onIndexChange={(i) => update((s) => (s.releaseSlide = i))}
          >
            <CarouselViewport>
              {RELEASES.map((title) => (
                <CarouselSlide key={title} label={title}>
                  <Text variant="large">{title}</Text>
                </CarouselSlide>
              ))}
            </CarouselViewport>
            <CarouselDots labels={RELEASES} />
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </ScrollReveal>

      <section aria-label="Dashboard redesign">
        <Text variant="h3">Dashboard redesign</Text>
        <CompareSlider
          label="Dashboard before and after"
          defaultPosition={state.compareSplit}
          before={<div>Old dashboard</div>}
          after={<div>New dashboard</div>}
          onPositionChange={(v) => update((s) => (s.compareSplit = v))}
        />
      </section>

      <section aria-label="Team activity">
        <Text variant="h4">Team activity</Text>
        <StaggerList>
          <StaggerListItem>Maya Chen moved Hermes to At risk</StaggerListItem>
          <StaggerListItem>Sam Okafor opened a pull request for webhook retries</StaggerListItem>
          <StaggerListItem>Priya Patel shipped Gemini</StaggerListItem>
        </StaggerList>
      </section>

      <Marquee label="Teams using Orbit" duration={30}>
        <span>Northwind</span>
        <span>Acme Corp</span>
        <span>Globex</span>
        <span>Initech</span>
        <span>Umbrella</span>
      </Marquee>
    </div>
  )
}

// ---------------------------------------------------------------------------------------
// Tasks

function TaskRow({ task, update }: { task: Task; update: Update }) {
  const remove = () =>
    update((s) => {
      s.tasks = s.tasks.filter((t) => t.id !== task.id)
      s.deleted.push(task.title)
    })
  const setDone = (done: boolean) => update((s) => (s.tasks.find((t) => t.id === task.id)!.done = done))
  return (
    <SortableItem id={task.id} label={task.title}>
      <SwipeableRow
        actions={[
          task.done
            ? { label: "Reopen", icon: <span>↺</span>, onSelect: () => setDone(false) }
            : { label: "Complete", icon: <span>✓</span>, onSelect: () => setDone(true) },
          { label: "Delete", icon: <span>✕</span>, destructive: true, onSelect: remove },
        ]}
        onDismiss={remove}
      >
        <ContextMenu>
          <ContextMenuTrigger aria-label={task.title}>
            <span className="flex items-center gap-3">
              <SortableHandle />
              <span className={task.done ? "line-through" : undefined}>{task.title}</span>
              <Badge variant={task.priority === "High" ? "destructive" : "secondary"} size="sm">
                {task.priority}
              </Badge>
              {task.flagged ? <Badge variant="warning" size="sm">Flagged</Badge> : null}
              <Text variant="muted" as="span">{task.assignee}</Text>
            </span>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setDone(!task.done)}>{task.done ? "Mark as open" : "Mark as done"}</ContextMenuItem>
            <ContextMenuItem onClick={() => update((s) => (s.tasks.find((t) => t.id === task.id)!.assignee = ME))}>
              Assign to me
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => update((s) => { const t = s.tasks.find((x) => x.id === task.id)!; t.flagged = !t.flagged })}
            >
              {task.flagged ? "Remove flag" : "Flag"}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={remove}>Delete task</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SwipeableRow>
    </SortableItem>
  )
}

function NewTaskDrawer({ state, update }: { state: AppState; update: Update }) {
  const [title, setTitle] = React.useState("")
  const [assignee, setAssignee] = React.useState(ME)
  const [priority, setPriority] = React.useState("Medium")
  return (
    <Drawer open={state.newTaskOpen} onOpenChange={(o) => update((s) => (s.newTaskOpen = o))}>
      <DrawerTrigger render={<Button />}>New task</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New task</DrawerTitle>
          <DrawerDescription>Add a task to the current sprint.</DrawerDescription>
        </DrawerHeader>
        <Form
          aria-label="New task"
          onSubmit={(event) => {
            event.preventDefault()
            if (!title.trim()) return
            update((s) => {
              s.created.push({ title, assignee, priority })
              s.tasks.unshift({ id: `n${s.created.length}`, title, assignee, priority: priority as Task["priority"], done: false, flagged: false })
              s.newTaskOpen = false
            })
            setTitle("")
          }}
        >
          <Field>
            <FieldLabel>Task title</FieldLabel>
            <Input value={title} onValueChange={setTitle} required />
          </Field>
          <Field>
            <FieldLabel>Assignee</FieldLabel>
            <Select value={assignee} onValueChange={(v) => setAssignee(v as string)}>
              <SelectTrigger aria-label="Assignee">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEAM.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Priority</FieldLabel>
            <Select value={priority} onValueChange={(v) => setPriority(v as string)}>
              <SelectTrigger aria-label="Priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High"].map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <DrawerFooter>
            <Button type="submit">Create task</Button>
            <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
          </DrawerFooter>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

function Tasks({ state, update }: { state: AppState; update: Update }) {
  const shown = (t: Task) =>
    (state.filter === "all" || (state.filter === "open" ? !t.done : t.done)) &&
    (!state.onlyMine || t.assignee === ME) &&
    (!state.search || t.title.toLowerCase().includes(state.search.toLowerCase()))
  const visible = state.tasks.filter(shown)
  const completed = state.tasks.filter((t) => t.done)

  const reorder = (next: string[]) =>
    update((s) => {
      // Only the visible tasks moved: put them back into the slots they occupied.
      const ids = new Set(next)
      const slots = s.tasks.map((t, i) => (ids.has(t.id) ? i : -1)).filter((i) => i >= 0)
      const byId = new Map(s.tasks.map((t) => [t.id, t]))
      const tasks = [...s.tasks]
      next.forEach((id, n) => (tasks[slots[n]] = byId.get(id)!))
      s.tasks = tasks
    })

  return (
    <div className="space-y-4">
      <span className="flex items-center justify-between">
        <Text variant="h2">Tasks</Text>
        <NewTaskDrawer state={state} update={update} />
      </span>

      <div className="flex items-center gap-3">
        <ToggleGroup
          aria-label="Show"
          value={[state.filter]}
          onValueChange={(v) => {
            const next = (v as string[])[0]
            if (next) update((s) => (s.filter = next as AppState["filter"]))
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="done">Done</ToggleGroupItem>
        </ToggleGroup>
        <Toggle aria-label="Only mine" pressed={state.onlyMine} onPressedChange={(v) => update((s) => (s.onlyMine = v))}>
          Only mine
        </Toggle>
        <Autocomplete
          items={state.tasks.map((t) => t.title)}
          value={state.search}
          onValueChange={(v) => update((s) => (s.search = v as string))}
        >
          <AutocompleteInput aria-label="Search tasks" placeholder="Search tasks" />
          <AutocompleteContent>
            <AutocompleteList>
              {(item: string) => (
                <AutocompleteItem key={item} value={item}>
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </div>

      <SwipeableRowGroup>
        <Sortable
          aria-label="Sprint tasks"
          value={visible.map((t) => t.id)}
          onValueChange={(next, details) => {
            if (!details.isCanceled) reorder(next)
          }}
        >
          {visible.map((t) => (
            <TaskRow key={t.id} task={t} update={update} />
          ))}
        </Sortable>
      </SwipeableRowGroup>
      {visible.length === 0 ? <Text variant="muted">No tasks match these filters.</Text> : null}

      <Collapsible open={state.completedOpen} onOpenChange={(o) => update((s) => (s.completedOpen = o))}>
        <CollapsibleTrigger>Completed tasks</CollapsibleTrigger>
        <CollapsiblePanel>
          <AnimatedList aria-label="Completed tasks">
            {completed.map((t) => (
              <AnimatedListItem key={t.id}>
                <span>{t.title}</span>
                <Button size="sm" variant="ghost" aria-label={`Reopen ${t.title}`} onClick={() => update((s) => (s.tasks.find((x) => x.id === t.id)!.done = false))}>
                  Reopen
                </Button>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </CollapsiblePanel>
      </Collapsible>

      <ExpandableCard open={state.briefOpen} onOpenChange={(o) => update((s) => (s.briefOpen = o))}>
        <ExpandableCardTrigger>Q3 launch brief</ExpandableCardTrigger>
        <ExpandableCardPanel title="Q3 launch brief">
          <ExpandableCardBody>
            Launch Apollo to all workspaces on July 14. Hermes follows once webhook retries are fixed. Owner: Jordan Lee.
          </ExpandableCardBody>
        </ExpandableCardPanel>
      </ExpandableCard>
    </div>
  )
}

// ---------------------------------------------------------------------------------------
// Settings

function Settings({ state, update }: { state: AppState; update: Update }) {
  return (
    <Form
      aria-label="Workspace settings"
      onSubmit={(event) => {
        event.preventDefault()
        update((s) => s.settingsSaved++)
      }}
      className="space-y-6"
    >
      <Text variant="h2">Settings</Text>

      <Fieldset>
        <FieldsetLegend>Workspace</FieldsetLegend>
        <div>
          <Label htmlFor="workspace-name">Workspace name</Label>
          <Input id="workspace-name" value={state.workspaceName} onValueChange={(v) => update((s) => (s.workspaceName = v))} />
        </div>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea value={state.description} onValueChange={(v) => update((s) => (s.description = v))} />
          <FieldDescription>Shown on the workspace's public page.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Seats</FieldLabel>
          <NumberField value={state.seats} min={1} max={200} onValueChange={(v) => update((s) => (s.seats = v))}>
            <NumberFieldGroup>
              <NumberFieldDecrement />
              <NumberFieldInput aria-label="Seats" />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        </Field>
      </Fieldset>

      <Fieldset>
        <FieldsetLegend>Localization</FieldsetLegend>
        <Field>
          <FieldLabel>Region</FieldLabel>
          <Select value={state.region} onValueChange={(v) => update((s) => (s.region = v as string))}>
            <SelectTrigger aria-label="Region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ap">Asia Pacific</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Timezone</FieldLabel>
          <Select value={state.timezone} onValueChange={(v) => update((s) => (s.timezone = v as string))}>
            <SelectTrigger aria-label="Timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Default assignee</FieldLabel>
          <Combobox items={TEAM} value={state.defaultAssignee} onValueChange={(v) => update((s) => (s.defaultAssignee = v as string | null))}>
            <ComboboxInput aria-label="Default assignee" />
            <ComboboxContent>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </Fieldset>

      <Fieldset>
        <FieldsetLegend>Security</FieldsetLegend>
        <OTPField
          length={6}
          aria-label="Two-factor code"
          value={state.twoFactorCode}
          onValueChange={(v) => update((s) => (s.twoFactorCode = v))}
        >
          <OTPFieldGroup>
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldSeparator />
            <OTPFieldInput />
            <OTPFieldInput />
            <OTPFieldInput />
          </OTPFieldGroup>
        </OTPField>
        <label className="flex items-center gap-2">
          <Checkbox checked={state.requireTwoFactor} onCheckedChange={(v) => update((s) => (s.requireTwoFactor = v))} />
          Require two-factor for all members
        </label>
      </Fieldset>

      <Fieldset>
        <FieldsetLegend>Plan</FieldsetLegend>
        <RadioGroup aria-label="Plan" value={state.plan} onValueChange={(v) => update((s) => (s.plan = v as string))}>
          <label><Radio value="free" /> Free</label>
          <label><Radio value="pro" /> Pro</label>
          <label><Radio value="team" /> Team</label>
          <label><Radio value="enterprise" /> Enterprise</label>
        </RadioGroup>
        <Slider value={state.budget} min={0} max={20000} step={500} onValueChange={(v) => update((s) => (s.budget = v as number))}>
          <SliderLabel>Monthly budget</SliderLabel>
          <SliderControl>
            <SliderTrack>
              <SliderRange />
              <SliderThumb />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </Fieldset>

      <ScrollArea className="h-72">
        <Fieldset>
          <FieldsetLegend>Notifications</FieldsetLegend>
          <CheckboxGroup aria-label="Notification channels" value={state.channels} onValueChange={(v) => update((s) => (s.channels = v as string[]))}>
            {CHANNELS.map((c) => (
              <label key={c} className="flex items-center gap-2">
                <Checkbox value={c} /> {c}
              </label>
            ))}
          </CheckboxGroup>
        </Fieldset>

        <Fieldset>
          <FieldsetLegend>Appearance and visibility</FieldsetLegend>
          <label className="flex items-center gap-2">
            <Switch checked={state.darkMode} onCheckedChange={(v) => update((s) => (s.darkMode = v))}>
              <SwitchThumb />
            </Switch>
            Dark mode
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={state.publicWorkspace} onCheckedChange={(v) => update((s) => (s.publicWorkspace = v))}>
              <SwitchThumb />
            </Switch>
            Public workspace
          </label>
        </Fieldset>

        <Text variant="h4">Advanced</Text>
        <Accordion aria-label="Advanced" value={state.advanced} onValueChange={(v) => update((s) => (s.advanced = v as string[]))}>
          {["Data export", "API access", "Danger zone"].map((name) => (
            <AccordionItem key={name} value={name}>
              <AccordionHeader>
                <AccordionTrigger>{name}</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>{name} options are managed by workspace owners.</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Text variant="h4">FAQ</Text>
        <Accordion aria-label="FAQ" value={state.faq} onValueChange={(v) => update((s) => (s.faq = v as string[]))}>
          {[
            ["Billing", "You are billed monthly per seat. Change your card on the Billing tab."],
            ["Seats", "Seats are counted on the first of each month."],
            ["Security", "Two-factor codes are six digits and expire after 30 seconds."],
            ["Data export", "Exports include tasks, projects and comments as CSV."],
          ].map(([name, answer]) => (
            <AccordionItem key={name} value={name.toLowerCase()}>
              <AccordionHeader>
                <AccordionTrigger>{name}</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>{answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      <Button type="submit">Save changes</Button>
    </Form>
  )
}

// ---------------------------------------------------------------------------------------
// Billing

function Billing({ state, update }: { state: AppState; update: Update }) {
  const toasts = useToastManager()
  const [number, setNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  return (
    <div className="space-y-6">
      <Text variant="h2">Billing</Text>
      <Card aria-label="Subscription">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            {state.subscriptionCancelled ? "Cancelled. Access ends on June 30." : `${state.seats ?? 0} seats, renews on June 30.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Visa ending in {state.cardLast4}</Text>
        </CardContent>
        <CardFooter className="gap-2">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Change card</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change card</DialogTitle>
                <DialogDescription>The new card is charged from the next invoice.</DialogDescription>
              </DialogHeader>
              <Field>
                <FieldLabel>Card number</FieldLabel>
                <Input aria-label="Card number" value={number} onValueChange={setNumber} />
              </Field>
              <Field>
                <FieldLabel>Expiry</FieldLabel>
                <Input aria-label="Expiry" placeholder="MM/YY" value={expiry} onValueChange={setExpiry} />
              </Field>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                <DialogClose
                  render={<Button />}
                  onClick={() => {
                    const digits = number.replace(/\D/g, "")
                    if (digits.length < 4) return
                    update((s) => {
                      s.cardLast4 = digits.slice(-4)
                      s.cardChanged = true
                    })
                    toasts.add({ title: "Card updated", description: `Visa ending in ${digits.slice(-4)}`, type: "success", timeout: 0 })
                  }}
                >
                  Save card
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />} disabled={state.subscriptionCancelled}>
              Cancel subscription
            </AlertDialogTrigger>
            {/* The barrel does not export AlertDialogContent, so compose its parts. */}
            <AlertDialogPortal>
              <AlertDialogBackdrop />
              <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                <AlertDialogDescription>Your team keeps access until the end of the billing period.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => update((s) => (s.cancelOutcome = "kept"))}>Keep subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    update((s) => {
                      s.cancelOutcome = "cancelled"
                      s.subscriptionCancelled = true
                    })
                  }
                >
                  Cancel subscription
                </AlertDialogAction>
              </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialogPortal>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card aria-label="Danger zone">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Deleting the workspace removes every project, task and invoice.</CardDescription>
        </CardHeader>
        <CardFooter>
          <HoldToConfirm duration={1500} resetAfter={0} confirmedLabel="Deleted" onConfirm={() => update((s) => (s.workspaceDeleted = true))}>
            Delete workspace
          </HoldToConfirm>
        </CardFooter>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------------------
// App

function AppActions({ update }: { update: Update }) {
  useAgentAction({
    name: "inviteMember",
    description: "Invite someone to the workspace by email. They get an email with a join link and take a seat.",
    input: z.object({ email: z.email(), role: z.enum(["viewer", "member", "admin"]) }),
    confirm: "Sends an email to someone outside the workspace",
    run: ({ email, role }) => {
      update((s) => s.invites.push({ email, role }))
      return { invited: email, role }
    },
  })
  useAgentAction({
    name: "createTask",
    description: "Add a task to the current sprint, at the top of the task list.",
    input: z.object({ title: z.string().min(1), assignee: z.enum(TEAM as [string, ...string[]]), priority: z.enum(["Low", "Medium", "High"]).optional() }),
    run: ({ title, assignee, priority = "Medium" }) => {
      update((s) => {
        s.created.push({ title, assignee, priority })
        s.tasks.unshift({ id: `n${s.created.length}`, title, assignee, priority, done: false, flagged: false })
      })
      return { created: title }
    },
  })
  return null
}

function Welcome({ update }: { update: Update }) {
  const manager = useToastManager()
  const added = React.useRef(false)
  React.useEffect(() => {
    if (added.current) return
    added.current = true
    const dismissed = (title: string) => () => update((s) => s.dismissedToasts.push(title))
    manager.add({ title: "Invoice #1042 paid", description: "$1,140.00 charged to Visa ending in 4242", type: "success", timeout: 0, onClose: dismissed("Invoice #1042 paid") })
    manager.add({ title: "Hermes is at risk", description: "Two tasks are past their due date", type: "warning", timeout: 0, onClose: dismissed("Hermes is at risk") })
  }, [manager, update])
  return null
}

function App({ state }: { state: AppState }) {
  const [, rerender] = React.useReducer((n: number) => n + 1, 0)
  const update = React.useCallback<Update>(
    (fn) => {
      fn(state)
      rerender()
    },
    [state]
  )

  return (
    <TooltipProvider>
      <div className={state.compactMode ? "text-sm" : undefined}>
        <TopBar state={state} update={update} />
        <main className="p-6">
          <AnimatedTabs aria-label="Workspace sections" value={state.tab} onValueChange={(v) => update((s) => (s.tab = v as string))}>
            <AnimatedTabsList>
              <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="tasks">Tasks</AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="settings">Settings</AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="billing">Billing</AnimatedTabsTrigger>
            </AnimatedTabsList>
            <AnimatedTabsContent value="overview">
              <Overview state={state} update={update} />
            </AnimatedTabsContent>
            <AnimatedTabsContent value="tasks">
              <Tasks state={state} update={update} />
            </AnimatedTabsContent>
            <AnimatedTabsContent value="settings">
              <Settings state={state} update={update} />
            </AnimatedTabsContent>
            <AnimatedTabsContent value="billing">
              <Billing state={state} update={update} />
            </AnimatedTabsContent>
          </AnimatedTabs>
        </main>
        <AppActions update={update} />
        <Welcome update={update} />
      </div>
    </TooltipProvider>
  )
}

export function mountApp(options: AgentOptions = {}): { agent: Agent; state: AppState; element: React.ReactElement } {
  const state = initialState()
  const agent = createAgent(options)
  const element = (
    <AgentProvider agent={agent}>
      <Toast>
        <App state={state} />
      </Toast>
    </AgentProvider>
  )
  return { agent, state, element }
}
