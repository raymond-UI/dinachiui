import * as React from "react"
import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Flag,
  Folder,
  HelpCircle,
  Keyboard,
  LayoutDashboard,
  ListTodo,
  Minimize2,
  Moon,
  MoreHorizontal,
  Orbit,
  Pin,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  Share2,
  Sparkles,
  Star,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react"
import { z } from "zod"
import { AgentProvider, createAgent, useAgentAction, type Agent, type AgentOptions } from "../src/agent"
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "../src/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../src/alert-dialog"
import { Alert, AlertAction, AlertContent, AlertDescription, AlertDismiss, AlertIcon, AlertTitle } from "../src/alert"
import { AnimatedIcon } from "../src/animated-icon"
import { AnimatedList, AnimatedListItem } from "../src/animated-list"
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "../src/animated-tabs"
import { AskBar, AskBarContent, AskBarTrigger, type AskPlan, type AskValues } from "../src/ask-bar"
import { Autocomplete, AutocompleteContent, AutocompleteInput, AutocompleteItem, AutocompleteList } from "../src/autocomplete"
import { Avatar, AvatarFallback } from "../src/avatar"
import { Badge } from "../src/badge"
import { Breadcrumb, type BreadcrumbItem } from "../src/breadcrumb"
import { Button } from "../src/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../src/card"
import { Carousel, CarouselDots, CarouselNext, CarouselPrevious, CarouselSlide, CarouselViewport } from "../src/carousel"
import { Checkbox } from "../src/checkbox"
import { CheckboxGroup } from "../src/checkbox-group"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "../src/collapsible"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "../src/combobox"
import type { CommandAction, CommandItem } from "../src/command-items"
import {
  CommandPalette,
  CommandPaletteBody,
  CommandPaletteContent,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPalettePreview,
  CommandPaletteTrigger,
} from "../src/command-palette"
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
import { Omnibar, OmnibarContent, OmnibarInput, OmnibarList, OmnibarScopes, OmnibarTrigger, type OmnibarScope } from "../src/omnibar"
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

const REGIONS = [
  ["us", "United States"],
  ["eu", "Europe"],
  ["uk", "United Kingdom"],
  ["ap", "Asia Pacific"],
] as const

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
  /** People in the workspace. Each needs a seat to sign in. */
  members: number
  /** Alerts closed with their dismiss button, by id. */
  dismissedAlerts: string[]
  // Navigation and bulk changes
  /** The project open on Overview, by id, or null for the project grid. */
  openProject: string | null
  /** Project links copied from search, by project name. */
  copiedLinks: string[]
  /** Tasks shows only this person's tasks; null shows everyone's. */
  person: string | null
  /** Bulk changes run from the Ask bar, in order. */
  bulk: { plan: string; tasks: string[]; undone: boolean }[]
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
    members: 14,
    dismissedAlerts: [],
    openProject: null,
    copiedLinks: [],
    person: null,
    bulk: [],
  }
}


const PLANS = [
  ["free", "Free", "$0", "Up to 3 members"],
  ["pro", "Pro", "$12", "Per seat, per month"],
  ["team", "Team", "$20", "Per seat, with SSO"],
  ["enterprise", "Enterprise", "Custom", "Audit logs and SLA"],
] as const

const RELEASE_NOTES: Record<string, string> = {
  "v2.4: Timeline view": "Plan a sprint on a timeline and drag tasks between weeks.",
  "v2.3: Guest access": "Invite clients to a single project without giving them a seat.",
  "v2.2: Faster search": "Search now returns results in under 100 ms, even across archived projects.",
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

const PLAN_PRICE: Record<string, number> = { free: 0, pro: 12, team: 20 }

const planName = (plan: string) => PLANS.find(([value]) => value === plan)?.[1] ?? "Pro"

function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <Text variant="h3" as="h1">
          {title}
        </Text>
        <Text variant="muted">{description}</Text>
      </div>
      {action}
    </div>
  )
}

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <Text variant="small" as="h2" className="text-muted-foreground">
        {children}
      </Text>
      {aside}
    </div>
  )
}

function Person({ name, size = "sm", nameClassName }: { name: string; size?: "sm" | "md"; nameClassName?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar className={size === "sm" ? "h-6 w-6" : "h-8 w-8"}>
        <AvatarFallback className="text-[10px]">{initials(name)}</AvatarFallback>
      </Avatar>
      <span className={nameClassName ? `truncate text-sm ${nameClassName}` : "truncate text-sm"}>{name}</span>
    </span>
  )
}

// ---------------------------------------------------------------------------------------
// Top bar

/** In-app links record where they lead instead of leaving the page. */
const followLink = (update: Update) => (label: string) => (event: React.MouseEvent) => {
  event.preventDefault()
  update((s) => s.navigated.push(label))
}

const PAGES = [
  ["overview", "Overview", "G O", LayoutDashboard],
  ["tasks", "Tasks", "G T", ListTodo],
  ["settings", "Settings", "G S", SettingsIcon],
  ["billing", "Billing", "G B", CreditCard],
] as const

const pageItems = (): CommandItem[] =>
  PAGES.map(([id, label, shortcut, Icon]) => ({ id: `page:${id}`, label, group: "Pages", kind: "Page", shortcut, icon: <Icon /> }))

const goToPage = (s: AppState, id: string) => {
  s.tab = id
  if (id === "overview") s.openProject = null
}

/** Everything the top bar's search can reach: pages, projects and workspace commands. */
function searchItems(state: AppState): CommandItem[] {
  const projects = state.projects
    .filter((p) => !state.archived.includes(p.name))
    .map<CommandItem>((p) => ({
      id: `project:${p.id}`,
      label: p.name,
      description: `${p.status}, ${p.progress}% done`,
      group: "Projects",
      kind: "Project",
      icon: <Folder />,
      actions: [
        { id: "open", label: "Open project" },
        { id: "copy", label: "Copy link" },
        { id: "pin", label: p.pinned ? "Unpin from sidebar" : "Pin to sidebar" },
        { id: "archive", label: "Archive project" },
      ],
    }))
  return [
    ...pageItems(),
    ...projects,
    { id: "new-task", label: "New task", group: "Actions", icon: <Plus />, keywords: ["create", "add"] },
    { id: "export", label: "Export tasks as CSV", group: "Actions", icon: <Download />, keywords: ["download"] },
    { id: "compact", label: state.compactMode ? "Turn off compact mode" : "Turn on compact mode", group: "Actions", icon: <Minimize2 /> },
    {
      id: "theme",
      label: "Change theme",
      group: "Actions",
      icon: state.darkMode ? <Moon /> : <Sun />,
      keywords: ["dark", "light", "appearance"],
      items: [
        { id: "theme:light", label: "Light", icon: <Sun /> },
        { id: "theme:dark", label: "Dark", icon: <Moon /> },
      ],
    },
  ]
}

function runSearchItem(s: AppState, item: CommandItem, action: CommandAction | undefined) {
  const [kind, id] = item.id.split(":")
  if (kind === "page") return goToPage(s, id)
  if (kind === "theme") return void (s.darkMode = id === "dark")
  if (kind === "project") {
    const project = s.projects.find((p) => p.id === id)
    if (!project) return
    if (action?.id === "copy") s.copiedLinks.push(project.name)
    else if (action?.id === "pin") project.pinned = !project.pinned
    else if (action?.id === "archive") {
      if (!s.archived.includes(project.name)) s.archived.push(project.name)
    } else {
      s.tab = "overview"
      s.openProject = project.id
    }
    return
  }
  if (item.id === "new-task") {
    s.tab = "tasks"
    s.newTaskOpen = true
  } else if (item.id === "export") s.commands.push("Search > Export tasks as CSV")
  else if (item.id === "compact") s.compactMode = !s.compactMode
}

function SiteSearch({ state, update }: { state: AppState; update: Update }) {
  return (
    <CommandPalette
      label="Search Orbit"
      items={searchItems(state)}
      suggested={["page:tasks", "new-task", "theme"]}
      onRun={(item, action) => update((s) => runSearchItem(s, item, action))}
    >
      <CommandPaletteTrigger className="mr-2 w-40 lg:w-56" />
      <CommandPaletteContent>
        <CommandPaletteInput placeholder="Search projects, pages and commands" />
        <CommandPaletteBody>
          <CommandPaletteList empty={(query) => `Nothing in Orbit matches "${query}".`} />
          <CommandPalettePreview placeholder="Jump to a page or project, or run a command." />
        </CommandPaletteBody>
      </CommandPaletteContent>
    </CommandPalette>
  )
}

function TopBar({ state, update }: { state: AppState; update: Update }) {
  const follow = followLink(update)
  const unread = state.notificationsRead ? 0 : 3

  return (
    <div className="flex h-14 items-center gap-6 px-6">
      <span className="flex items-center gap-2.5">
        <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Orbit className="h-4 w-4" />
        </span>
        <Text variant="small" as="span">
          {state.workspaceName}
        </Text>
        <Badge variant="secondary" size="sm">
          {planName(state.plan)}
        </Badge>
      </span>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-64 gap-1 p-2">
                {[
                  ["Roadmaps", "#/roadmaps", "Plan quarters and milestones"],
                  ["Sprints", "#/sprints", "Run two-week cycles"],
                  ["Insights", "#/insights", "Track velocity and load"],
                ].map(([label, href, hint]) => (
                  <li key={label}>
                    <NavigationMenuLink href={href} onClick={follow(label)} className="block rounded-md px-3 py-2 hover:bg-accent">
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block text-xs text-muted-foreground">{hint}</span>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="docs">
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-56 gap-1 p-2">
                {[
                  ["Getting started", "#/docs/start"],
                  ["API reference", "#/docs/api"],
                  ["Changelog", "#/docs/changelog"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <NavigationMenuLink href={href} onClick={follow(label)} className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
                      {label}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#/pricing" onClick={follow("Pricing")}>
              Pricing
            </NavigationMenuLink>
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

      <span className="ml-auto flex items-center gap-1">
        <SiteSearch state={state} update={update} />
        <span className="mr-3 hidden items-center gap-1.5 text-sm lg:flex">
          <span aria-hidden className="h-2 w-2 rounded-full bg-success" />
          <Text variant="muted" as="span">
            On call
          </Text>
          <PreviewCard>
            <PreviewCardTrigger delay={0} href="#/people/maya" onClick={follow("Maya Chen")} className="font-medium hover:underline">
              Maya Chen
            </PreviewCardTrigger>
            <PreviewCardContent className="w-64 space-y-2">
              <Person name="Maya Chen" size="md" />
              <Text variant="muted">Staff engineer. Owns Hermes and the billing pipeline. Based in Berlin.</Text>
            </PreviewCardContent>
          </PreviewCard>
        </span>

        <Link href="#/help" onClick={follow("Help center")} className="mr-2 hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
          Help center
        </Link>

        <Tooltip>
          <TooltipTrigger
            aria-label="Keyboard shortcuts"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Keyboard className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>Press ? anywhere to see shortcuts</TooltipContent>
        </Tooltip>

        <Popover>
          <PopoverTrigger
            aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 ? (
              <span aria-hidden className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {unread}
              </span>
            ) : null}
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <PopoverTitle className="text-sm font-semibold">Notifications</PopoverTitle>
              <PopoverClose
                onClick={() => update((s) => (s.notificationsRead = true))}
                render={<Button variant="ghost" size="sm" className="-mr-2 h-7 px-2 text-xs" />}
              >
                Mark all as read
              </PopoverClose>
            </div>
            <ul className="divide-y text-sm">
              {[
                ["Maya Chen", "commented on Hermes", "2m"],
                ["Billing", "Invoice #1042 was paid", "1h"],
                ["Priya Patel", 'assigned you "Update API reference"', "3h"],
              ].map(([who, what, when]) => (
                <li key={what} className="flex gap-3 px-4 py-3">
                  {!state.notificationsRead ? <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" /> : <span className="w-2 shrink-0" />}
                  <span className="flex-1">
                    <span className="font-medium">{who}</span> {what}
                  </span>
                  <span className="text-xs text-muted-foreground">{when}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" aria-label={`Account, signed in as ${ME}`} onClick={follow("Account")} className="ml-1 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">JL</AvatarFallback>
          </Avatar>
        </Button>
      </span>
    </div>
  )
}

/** The app's own commands, under the section tabs, the way a desktop editor keeps them. */
function CommandBar({ state, update }: { state: AppState; update: Update }) {
  const follow = followLink(update)
  const command = (name: string) => () => update((s) => s.commands.push(name))

  return (
    <span className="-mx-6 flex max-w-[100vw] items-center gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0">
      <Menubar aria-label="Workspace menu" className="h-9 border-0 bg-transparent p-0 shadow-none">
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

      <Separator orientation="vertical" className="h-5" />

      <ToolbarRoot aria-label="Workspace tools" className="flex shrink-0 flex-nowrap items-center gap-1">
        <ToolbarButton
          onClick={command("Toolbar > Share")}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm hover:bg-accent"
        >
          <Share2 aria-hidden className="h-3.5 w-3.5" />
          Share
        </ToolbarButton>
        <ToolbarButton
          aria-label="Favorite workspace"
          aria-pressed={state.favorite}
          onClick={() => update((s) => (s.favorite = !s.favorite))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
        >
          <AnimatedIcon
            active={state.favorite}
            from={<Star className="h-4 w-4" />}
            to={<Star className="h-4 w-4 fill-warning text-warning" />}
          />
        </ToolbarButton>
        <ToolbarSeparator className="mx-1 h-5" />
        <ToolbarLink href="#/changelog" onClick={follow("What's new")} className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
          What's new
        </ToolbarLink>
      </ToolbarRoot>
    </span>
  )
}

// ---------------------------------------------------------------------------------------
// Overview

const STATUS_BADGE = { "On track": "info", "At risk": "warning", Shipped: "success" } as const

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
    <Card
      ref={ref as React.Ref<HTMLDivElement>}
      role="article"
      aria-label={project.name}
      className={archived ? "flex flex-col opacity-60" : "flex flex-col"}
    >
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0 p-5 pb-0">
        {renaming ? (
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              update((s) => {
                const p = s.projects.find((x) => x.id === project.id)!
                s.renamed.push({ from: p.name, to: draft })
                p.name = draft
                s.renaming = null
              })
            }}
          >
            <Input aria-label="Project name" value={draft} onValueChange={setDraft} autoFocus />
            <span className="flex gap-2">
              <Button size="sm" type="submit">
                Save
              </Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => update((s) => (s.renaming = null))}>
                Cancel
              </Button>
            </span>
          </form>
        ) : (
          <span className="min-w-0 space-y-1.5">
            <CardTitle className="flex items-center gap-1.5 text-base">
              <Link
                href={`#/projects/${project.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  update((s) => (s.openProject = project.id))
                }}
                className="text-foreground hover:underline"
              >
                {project.name}
              </Link>
              {project.pinned ? <Pin aria-label="Pinned" className="h-3.5 w-3.5 text-muted-foreground" /> : null}
            </CardTitle>
            <span className="flex flex-wrap gap-1.5">
              <Badge variant={STATUS_BADGE[project.status]} size="sm">
                {project.status}
              </Badge>
              {archived ? (
                <Badge variant="outline" size="sm">
                  Archived
                </Badge>
              ) : null}
            </span>
          </span>
        )}
        {renaming ? null : (
          <Menu>
            <MenuTrigger
              aria-label={`Actions for ${project.name}`}
              className="-mr-2 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </MenuTrigger>
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
              <MenuItem onClick={archive} disabled={archived}>
                Archive
              </MenuItem>
            </MenuContent>
          </Menu>
        )}
      </CardHeader>
      <CardContent className="mt-auto flex items-center gap-4 p-5">
        <ProgressRing value={project.progress} label={`${project.name} progress`} size={52} showValue />
        <span className="text-sm text-muted-foreground">
          {project.progress === 100 ? "Complete" : `${100 - project.progress}% to go`}
        </span>
      </CardContent>
    </Card>
  )
}

const SUMMARY =
  "Apollo is on track for the July launch. Hermes slipped a week because of the billing webhook retries; Sam is on it. Gemini shipped on Tuesday."

function SummarySkeleton() {
  return (
    <div className="space-y-2.5 py-1">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="min-w-0 space-y-1 rounded-lg border bg-background p-3 sm:p-4">
      <dt className="text-xs text-muted-foreground sm:text-sm">{label}</dt>
      <dd className="text-2xl font-semibold sm:text-3xl tabular-nums tracking-tight">
        <NumberTicker value={value} />
      </dd>
      <dd className="text-xs text-muted-foreground">{hint}</dd>
    </div>
  )
}

function DashboardMock({ version }: { version: "old" | "new" }) {
  const isNew = version === "new"
  return (
    <div className={isNew ? "flex h-56 gap-3 bg-muted/40 p-4" : "flex h-56 gap-3 bg-muted p-4"}>
      <div className={isNew ? "w-28 space-y-2 rounded-lg bg-background p-3 shadow-sm" : "w-28 space-y-2 bg-muted-foreground/20 p-3"}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={isNew ? "h-2 rounded-full bg-primary/20" : "h-2 bg-muted-foreground/30"} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={isNew ? "h-14 rounded-lg bg-background shadow-sm" : "h-14 bg-muted-foreground/20"} />
          ))}
        </div>
        <div className={isNew ? "flex-1 rounded-lg bg-background shadow-sm" : "flex-1 bg-muted-foreground/20"} />
        <span className="text-xs font-medium text-muted-foreground">{isNew ? "New dashboard" : "Old dashboard"}</span>
      </div>
    </div>
  )
}

const PROJECT_NOTES: Record<string, string> = {
  apollo: "The new dashboard, launching to every workspace on July 14.",
  hermes: "The billing pipeline rewrite. Releases once webhook retries are fixed.",
  gemini: "Faster search across archived projects. Shipped on Tuesday.",
  artemis: "Discovery for the mobile app.",
}

function ProjectDetail({ project, state, update }: { project: Project; state: AppState; update: Update }) {
  const trail: BreadcrumbItem[] = [
    { label: state.workspaceName, href: "#/" },
    { label: "Projects", href: "#/projects" },
    { label: project.name },
  ]
  const leave = (item: BreadcrumbItem) =>
    update((s) => {
      s.navigated.push(item.label)
      s.openProject = null
    })
  const archived = state.archived.includes(project.name)

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb items={trail} hideCurrent onNavigate={leave} className="-ml-1.5" />
        <PageHeader
          title={project.name}
          description={PROJECT_NOTES[project.id] ?? "A project in this workspace."}
          action={
            <span className="flex gap-1.5">
              <Badge variant={STATUS_BADGE[project.status]}>{project.status}</Badge>
              {archived ? <Badge variant="outline">Archived</Badge> : null}
            </span>
          }
        />
      </div>

      {project.status === "At risk" ? (
        <Alert variant="warning">
          <AlertIcon />
          <AlertContent>
            <AlertTitle>{project.name} is behind schedule</AlertTitle>
            <AlertDescription>Two tasks are past their due date. Mark it on track once they are unblocked.</AlertDescription>
          </AlertContent>
          <AlertAction onClick={() => update((s) => (s.projects.find((p) => p.id === project.id)!.status = "On track"))}>
            Mark on track
          </AlertAction>
        </Alert>
      ) : null}

      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <ProgressRing value={project.progress} label={`${project.name} progress`} size={52} showValue />
          <span className="space-y-0.5">
            <dt className="text-xs text-muted-foreground">Progress</dt>
            <dd className="text-sm font-medium">{project.progress === 100 ? "Complete" : `${100 - project.progress}% to go`}</dd>
          </span>
        </div>
        <div className="space-y-1 rounded-lg border p-4">
          <dt className="text-xs text-muted-foreground">Lead</dt>
          <dd>
            <Person name={project.id === "hermes" ? "Maya Chen" : ME} />
          </dd>
        </div>
        <div className="space-y-1 rounded-lg border p-4">
          <dt className="text-xs text-muted-foreground">Sidebar</dt>
          <dd className="text-sm font-medium">{project.pinned ? "Pinned" : "Not pinned"}</dd>
        </div>
      </dl>
    </div>
  )
}

function Overview({ state, update }: { state: AppState; update: Update }) {
  const detail = state.projects.find((p) => p.id === state.openProject)
  if (detail) return <ProjectDetail project={detail} state={state} update={update} />
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
    <div className="space-y-10">
      <PageHeader title="Overview" description={`Sprint 14 for ${state.workspaceName}. ${open} tasks open.`} />

      <section aria-label="Stats">
        <Tabs aria-label="Stats range" value={state.statsRange} onValueChange={(v) => update((s) => (s.statsRange = v as string))}>
          <SectionTitle
            aside={
              <TabsList>
                <TabsTrigger value="week">This week</TabsTrigger>
                <TabsTrigger value="month">This month</TabsTrigger>
                <TabsTrigger value="quarter">This quarter</TabsTrigger>
              </TabsList>
            }
          >
            Activity
          </SectionTitle>
          {["week", "month", "quarter"].map((range) => (
            <TabsContent key={range} value={range} className="mt-0">
              <dl className="grid grid-cols-3 gap-2 sm:gap-4">
                <Stat label="Open tasks" value={open} hint="Across all projects" />
                <Stat label="Completed" value={done * factor} hint={`This ${range}`} />
                <Stat label="Hours logged" value={38 * factor} hint={`This ${range}`} />
              </dl>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section aria-label="Projects">
        <SectionTitle aside={<Text variant="muted" as="span">{visible.length} projects</Text>}>Projects</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              archived={state.archived.includes(p.name)}
              renaming={state.renaming === p.id}
              update={update}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card aria-label="AI summary" className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles aria-hidden className="h-4 w-4 text-primary" />
              <TextMorph>{state.summaryLoading ? "Summarizing" : "Weekly summary"}</TextMorph>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={regenerate} disabled={state.summaryLoading}>
              <RefreshCw aria-hidden className="mr-1.5 h-3.5 w-3.5" />
              Regenerate summary
            </Button>
          </CardHeader>
          <CardContent className="min-h-24">
            <LoadTransition loading={state.summaryLoading} skeleton={<SummarySkeleton />}>
              {state.summaryLoading ? (
                <TextShimmer>Reading this week's activity…</TextShimmer>
              ) : (
                <StreamingText text={SUMMARY} complete runKey={state.summaryRuns} className="leading-7" />
              )}
            </LoadTransition>
          </CardContent>
        </Card>

        <Card aria-label="Usage">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Meter value={72} min={0} max={100} className="space-y-2">
              <span className="flex justify-between text-sm">
                <MeterLabel>Storage used</MeterLabel>
                <span className="text-muted-foreground">72 of 100 GB</span>
              </span>
              <MeterTrack>
                <MeterIndicator />
              </MeterTrack>
            </Meter>
            <Progress value={64} className="space-y-2">
              <span className="flex justify-between text-sm">
                <ProgressLabel>Uploading design-assets.zip</ProgressLabel>
                <span className="text-muted-foreground">64%</span>
              </span>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScrollReveal>
          <section aria-label="Release notes">
            <SectionTitle>Release notes</SectionTitle>
            <Carousel label="Release notes" index={state.releaseSlide} onIndexChange={(i) => update((s) => (s.releaseSlide = i))}>
              <CarouselViewport>
                {RELEASES.map((title) => (
                  <CarouselSlide key={title} label={title}>
                    <div className="flex h-40 flex-col justify-between rounded-xl border bg-card p-5">
                      <Badge variant="outline" size="sm" className="self-start">
                        {title.split(":")[0]}
                      </Badge>
                      <span className="space-y-1">
                        <Text variant="large">{title.split(": ")[1]}</Text>
                        <Text variant="muted">{RELEASE_NOTES[title]}</Text>
                      </span>
                    </div>
                  </CarouselSlide>
                ))}
              </CarouselViewport>
              <div className="flex items-center justify-between">
                <CarouselDots labels={RELEASES} />
                <span className="flex gap-2">
                  <CarouselPrevious />
                  <CarouselNext />
                </span>
              </div>
            </Carousel>
          </section>
        </ScrollReveal>

        <section aria-label="Dashboard redesign">
          <SectionTitle>Dashboard redesign</SectionTitle>
          <div className="overflow-hidden rounded-xl border">
            <CompareSlider
              label="Dashboard before and after"
              defaultPosition={state.compareSplit}
              before={<DashboardMock version="old" />}
              after={<DashboardMock version="new" />}
              onPositionChange={(v) => update((s) => (s.compareSplit = v))}
            />
          </div>
        </section>
      </div>

      <section aria-label="Team activity">
        <SectionTitle>Team activity</SectionTitle>
        <Card>
          <ScrollArea viewportClassName="max-h-64">
            <StaggerList className="divide-y">
              {[
                ["Maya Chen", "moved Hermes to At risk", "10:42"],
                ["Sam Okafor", "opened a pull request for webhook retries", "09:15"],
                ["Priya Patel", "shipped Gemini", "Yesterday"],
              ].map(([who, what, when]) => (
                <StaggerListItem key={what} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <Person name={who} />
                  <span className="flex-1 text-muted-foreground">{what}</span>
                  <span className="text-xs text-muted-foreground">{when}</span>
                </StaggerListItem>
              ))}
            </StaggerList>
          </ScrollArea>
        </Card>
      </section>

      <section className="space-y-3 border-t pt-8 text-center">
        <Text variant="muted">Teams using Orbit</Text>
        <Marquee label="Teams using Orbit" duration={30}>
          {["Northwind", "Acme Corp", "Globex", "Initech", "Umbrella"].map((name) => (
            <span key={name} className="px-8 text-lg font-semibold text-muted-foreground/70">
              {name}
            </span>
          ))}
        </Marquee>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------------------
// Tasks

const PRIORITY_BADGE = { High: "destructive", Medium: "secondary", Low: "outline" } as const

function TaskRow({ task, update }: { task: Task; update: Update }) {
  const remove = () =>
    update((s) => {
      s.tasks = s.tasks.filter((t) => t.id !== task.id)
      s.deleted.push(task.title)
    })
  const setDone = (done: boolean) => update((s) => (s.tasks.find((t) => t.id === task.id)!.done = done))
  return (
    <SortableItem id={task.id} label={task.title} className="border-0 bg-transparent p-0">
      <SwipeableRow
        className="min-w-0 flex-1 rounded-lg"
        actions={[
          task.done
            ? { label: "Reopen", icon: <RotateCcw className="h-4 w-4" />, onSelect: () => setDone(false) }
            : { label: "Complete", icon: <Check className="h-4 w-4" />, onSelect: () => setDone(true) },
          { label: "Delete", icon: <Trash2 className="h-4 w-4" />, destructive: true, onSelect: remove },
        ]}
        onDismiss={remove}
      >
        <ContextMenu>
          <ContextMenuTrigger aria-label={task.title} className="block">
            <span className="flex items-center gap-3">
              <SortableHandle />
              <Checkbox
                aria-label={task.done ? `Reopen ${task.title}` : `Complete ${task.title}`}
                checked={task.done}
                onCheckedChange={(v) => setDone(v)}
              />
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className={task.done ? "truncate text-muted-foreground line-through" : "truncate font-medium"}>{task.title}</span>
                {task.flagged ? (
                  <Badge variant="warning" size="sm" icon={<Flag className="h-3 w-3" />} className="shrink-0">
                    Flagged
                  </Badge>
                ) : null}
              </span>
              <Badge variant={PRIORITY_BADGE[task.priority]} size="sm" className="hidden sm:inline-flex">
                {task.priority}
              </Badge>
              <span className="shrink-0 md:w-36">
                <Person name={task.assignee} nameClassName="hidden md:inline" />
              </span>
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
            <ContextMenuItem onClick={remove} className="text-destructive">
              Delete task
            </ContextMenuItem>
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
      <DrawerTrigger render={<Button />}>
        <Plus aria-hidden className="mr-1.5 h-4 w-4" />
        New task
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>New task</DrawerTitle>
          <DrawerDescription>Add a task to the current sprint.</DrawerDescription>
        </DrawerHeader>
        <Form
          aria-label="New task"
          className="flex flex-1 flex-col gap-4"
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
            <Input value={title} onValueChange={setTitle} placeholder="What needs doing?" required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
            <Button type="submit">Create task</Button>
          </DrawerFooter>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

const QUICK_SCOPES: OmnibarScope[] = [
  { id: "people", label: "People", prefix: "@" },
  { id: "projects", label: "Projects", prefix: "#" },
  { id: "tasks", label: "Tasks" },
]

/** Adds a task from what was typed, or jumps to a person, project or task. */
function QuickAdd({ state, update }: { state: AppState; update: Update }) {
  const [query, setQuery] = React.useState("")
  const title = query.trim()
  const openCount = (name: string) => state.tasks.filter((t) => t.assignee === name && !t.done).length
  const items: CommandItem[] = [
    ...(title
      ? [{ id: "create", label: `Create task "${title}"`, description: "Assigned to you, medium priority", group: "Create", icon: <Plus />, actions: [{ id: "create", label: "Create task" }] }]
      : []),
    ...TEAM.map<CommandItem>((name) => ({
      id: `person:${name}`,
      label: name,
      description: `${openCount(name)} open tasks`,
      group: "People",
      icon: <User />,
      actions: [{ id: "show", label: "Show their tasks" }],
    })),
    ...state.projects
      .filter((p) => !state.archived.includes(p.name))
      .map<CommandItem>((p) => ({
        id: `project:${p.id}`,
        label: p.name,
        description: p.status,
        group: "Projects",
        icon: <Folder />,
        actions: [{ id: "open", label: "Open project" }],
      })),
    ...state.tasks.map<CommandItem>((t) => ({
      id: `task:${t.id}`,
      label: t.title,
      description: `${t.assignee}, ${t.done ? "done" : t.priority.toLowerCase()}`,
      group: "Tasks",
      icon: t.done ? <Check /> : <ListTodo />,
      actions: [{ id: "find", label: "Show in list" }, t.done ? { id: "reopen", label: "Reopen" } : { id: "done", label: "Mark as done" }],
    })),
  ]

  const run = (item: CommandItem, action: CommandAction | undefined) =>
    update((s) => {
      const [kind, id] = item.id.split(":")
      if (kind === "create") {
        s.created.push({ title, assignee: ME, priority: "Medium" })
        s.tasks.unshift({ id: `n${s.created.length}`, title, assignee: ME, priority: "Medium", done: false, flagged: false })
      } else if (kind === "person") {
        s.person = id
        s.onlyMine = false
      } else if (kind === "project") {
        s.tab = "overview"
        s.openProject = id
      } else if (kind === "task") {
        const task = s.tasks.find((t) => t.id === id)
        if (!task) return
        if (action?.id === "find") s.search = task.title
        else task.done = action?.id === "done"
      }
    })

  return (
    <Omnibar
      label="Quick add"
      items={items}
      scopes={QUICK_SCOPES}
      suggested={TEAM.map((name) => `person:${name}`)}
      value={query}
      onValueChange={setQuery}
      onRun={run}
    >
      <OmnibarTrigger placeholder="Add a task, or jump to a person or project" className="w-full max-w-none" />
      <OmnibarContent align="start">
        <OmnibarInput placeholder="Name a task, or @ a person, # a project" />
        <OmnibarScopes />
        <OmnibarList empty={(q) => `Nothing matches "${q}".`} />
      </OmnibarContent>
    </Omnibar>
  )
}

function Tasks({ state, update }: { state: AppState; update: Update }) {
  const shown = (t: Task) =>
    (state.filter === "all" || (state.filter === "open" ? !t.done : t.done)) &&
    (!state.onlyMine || t.assignee === ME) &&
    (!state.person || t.assignee === state.person) &&
    (!state.search || t.title.toLowerCase().includes(state.search.toLowerCase()))
  const visible = state.tasks.filter(shown)
  const completed = state.tasks.filter((t) => t.done)
  const open = state.tasks.length - completed.length

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
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description={`Sprint 14. ${open} open, ${completed.length} done. Drag to reorder, right-click a task for more.`}
        action={<NewTaskDrawer state={state} update={update} />}
      />

      <ExpandableCard open={state.briefOpen} onOpenChange={(o) => update((s) => (s.briefOpen = o))}>
        <ExpandableCardTrigger className="rounded-xl hover:bg-accent/40">
          <span className="flex items-center gap-4 p-4">
            <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">Q3 launch brief</span>
              <span className="block text-sm text-muted-foreground">Launch dates, owners and what Hermes is waiting on</span>
            </span>
            <ChevronRight aria-hidden className="h-4 w-4 text-muted-foreground" />
          </span>
        </ExpandableCardTrigger>
        <ExpandableCardPanel title="Q3 launch brief">
          <ExpandableCardBody>
            Launch Apollo to all workspaces on July 14. Hermes follows once webhook retries are fixed. Owner: Jordan Lee.
          </ExpandableCardBody>
        </ExpandableCardPanel>
      </ExpandableCard>

      <div className="flex flex-wrap items-center gap-3">
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
          <User aria-hidden className="mr-1.5 h-4 w-4" />
          Only mine
        </Toggle>
        {state.person ? (
          <Button variant="secondary" size="sm" aria-label={`${state.person.split(" ")[0]}'s tasks, clear to show everyone's`} onClick={() => update((s) => (s.person = null))}>
            {state.person.split(" ")[0]}'s tasks
            <X aria-hidden className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        ) : null}
        <div className="relative ml-auto w-full sm:w-64">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Autocomplete
            items={state.tasks.map((t) => t.title)}
            value={state.search}
            onValueChange={(v) => update((s) => (s.search = v as string))}
          >
            <AutocompleteInput aria-label="Search tasks" placeholder="Search tasks" className="pl-9" />
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
      </div>

      <QuickAdd state={state} update={update} />

      <section aria-label="Sprint task list">
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
        {visible.length === 0 ? (
          <div className="rounded-lg border border-dashed py-10 text-center">
            <Text variant="muted">No tasks match these filters.</Text>
          </div>
        ) : null}
      </section>

      <Collapsible open={state.completedOpen} onOpenChange={(o) => update((s) => (s.completedOpen = o))} className="rounded-lg border">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium">
          <span>
            Completed tasks <span className="ml-1 text-muted-foreground">{completed.length}</span>
          </span>
          <ChevronDown aria-hidden className={state.completedOpen ? "h-4 w-4 rotate-180 transition-transform" : "h-4 w-4 transition-transform"} />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <AnimatedList aria-label="Completed tasks" className="divide-y border-t">
            {completed.map((t) => (
              <AnimatedListItem key={t.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Check aria-hidden className="h-4 w-4 text-success" />
                  {t.title}
                </span>
                <Button size="sm" variant="ghost" aria-label={`Reopen ${t.title}`} onClick={() => update((s) => (s.tasks.find((x) => x.id === t.id)!.done = false))}>
                  Reopen
                </Button>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}

// ---------------------------------------------------------------------------------------
// Settings

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <Fieldset className="space-y-5 rounded-xl border-0 p-6">
        <span className="block space-y-1">
          <FieldsetLegend className="px-0 text-base font-semibold">{title}</FieldsetLegend>
          <Text variant="muted">{description}</Text>
        </span>
        {children}
      </Fieldset>
    </Card>
  )
}

function SwitchRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="space-y-0.5">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-sm text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange}>
        <SwitchThumb />
      </Switch>
    </label>
  )
}

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
      <PageHeader title="Settings" description="Manage how your workspace looks, who it notifies and what it costs." />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SettingsSection title="Workspace" description="The name and description your team sees.">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" value={state.workspaceName} onValueChange={(v) => update((s) => (s.workspaceName = v))} />
            </div>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea value={state.description} onValueChange={(v) => update((s) => (s.description = v))} rows={3} />
              <FieldDescription>Shown on the workspace's public page.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Seats</FieldLabel>
              <NumberField value={state.seats} min={1} max={200} onValueChange={(v) => update((s) => (s.seats = v))} className="w-40">
                <NumberFieldGroup>
                  <NumberFieldDecrement />
                  <NumberFieldInput aria-label="Seats" />
                  <NumberFieldIncrement />
                </NumberFieldGroup>
              </NumberField>
              <FieldDescription>Billed per seat each month.</FieldDescription>
            </Field>
          </SettingsSection>

          <SettingsSection title="Localization" description="Where data is stored and which clock due dates follow.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Region</FieldLabel>
                <Select value={state.region} onValueChange={(v) => update((s) => (s.region = v as string))}>
                  <SelectTrigger aria-label="Region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
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
            </div>
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
              <FieldDescription>New tasks go to this person unless someone else is picked.</FieldDescription>
            </Field>
          </SettingsSection>

          <SettingsSection title="Security" description="Verify this device, then decide whether everyone needs two-factor.">
            <div className="space-y-2">
              <Text variant="small" as="span">
                Two-factor code
              </Text>
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
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox checked={state.requireTwoFactor} onCheckedChange={(v) => update((s) => (s.requireTwoFactor = v))} />
              Require two-factor for all members
            </label>
          </SettingsSection>

          <SettingsSection title="Plan" description="Pick a plan and cap what the workspace can spend.">
            <RadioGroup aria-label="Plan" value={state.plan} onValueChange={(v) => update((s) => (s.plan = v as string))} className="grid gap-3 sm:grid-cols-2">
              {PLANS.map(([value, label, price, hint]) => (
                <label
                  key={value}
                  className={
                    state.plan === value
                      ? "flex cursor-pointer items-start gap-3 rounded-lg border border-primary bg-primary/5 p-4"
                      : "flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-accent/50"
                  }
                >
                  <Radio value={value} className="mt-0.5" />
                  <span className="flex-1">
                    <span className="flex justify-between text-sm font-medium">
                      {label}
                      <span>{price}</span>
                    </span>
                    <span className="block text-xs text-muted-foreground">{hint}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
            <Slider value={state.budget} min={0} max={20000} step={500} onValueChange={(v) => update((s) => (s.budget = v as number))} className="space-y-3">
              <span className="flex justify-between text-sm">
                <SliderLabel>Monthly budget</SliderLabel>
                <span className="font-medium tabular-nums">${state.budget.toLocaleString("en-US")}</span>
              </span>
              <SliderControl>
                <SliderTrack>
                  <SliderRange />
                  <SliderThumb />
                </SliderTrack>
              </SliderControl>
            </Slider>
          </SettingsSection>

          <SettingsSection title="Notifications" description="Where Orbit reaches you about mentions and due dates.">
            <CheckboxGroup
              aria-label="Notification channels"
              value={state.channels}
              onValueChange={(v) => update((s) => (s.channels = v as string[]))}
              className="grid gap-3 sm:grid-cols-4"
            >
              {CHANNELS.map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm">
                  <Checkbox value={c} /> {c}
                </label>
              ))}
            </CheckboxGroup>
          </SettingsSection>

          <SettingsSection title="Appearance and visibility" description="How the workspace looks, and who can find it.">
            <SwitchRow label="Dark mode" hint="Use the dark theme for everyone." checked={state.darkMode} onChange={(v) => update((s) => (s.darkMode = v))} />
            <Separator />
            <SwitchRow
              label="Public workspace"
              hint="Anyone with the link can view projects."
              checked={state.publicWorkspace}
              onChange={(v) => update((s) => (s.publicWorkspace = v))}
            />
          </SettingsSection>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Advanced</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <Card className="lg:sticky lg:top-32">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle aria-hidden className="h-4 w-4 text-muted-foreground" />
              FAQ
            </CardTitle>
            <CardDescription>Common questions about these settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="pr-3" viewportClassName="max-h-80">
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
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 -mx-6 flex items-center justify-end gap-4 border-t bg-background px-6 py-4">
        {state.settingsSaved > 0 ? (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Check aria-hidden className="h-4 w-4 text-success" />
            Saved
          </span>
        ) : null}
        <Button type="submit">Save changes</Button>
      </div>
    </Form>
  )
}

// ---------------------------------------------------------------------------------------
// Billing

const INVOICES = [
  ["#1042", "Jun 1", "$1,140.00"],
  ["#1031", "May 1", "$1,140.00"],
  ["#1019", "Apr 1", "$950.00"],
]

function Billing({ state, update }: { state: AppState; update: Update }) {
  const toasts = useToastManager()
  const [number, setNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const seats = state.seats ?? 0
  const needed = state.members + state.invites.length
  const short = needed - seats
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Your plan, payment method and invoices." />

      {short > 0 && !state.subscriptionCancelled ? (
        <Alert
          variant="warning"
          open={!state.dismissedAlerts.includes("seats")}
          onOpenChange={(open) => {
            if (!open) update((s) => s.dismissedAlerts.push("seats"))
          }}
        >
          <AlertIcon />
          <AlertContent>
            <AlertTitle>{short === 1 ? "1 person can't sign in" : `${short} people can't sign in`}</AlertTitle>
            <AlertDescription>
              {needed} people share {seats} seats. Each extra seat is ${PLAN_PRICE[state.plan] ?? 12} a month.
            </AlertDescription>
          </AlertContent>
          <AlertAction onClick={() => update((s) => (s.seats = needed))}>
            Add {short} {short === 1 ? "seat" : "seats"}
          </AlertAction>
          <AlertDismiss />
        </Alert>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card aria-label="Subscription" className="lg:col-span-2">
          <CardHeader>
            <span className="flex items-center gap-2">
              <CardTitle className="text-base">Subscription</CardTitle>
              <Badge variant={state.subscriptionCancelled ? "outline" : "success"} size="sm">
                {state.subscriptionCancelled ? "Cancelled" : "Active"}
              </Badge>
            </span>
            <CardDescription>
              {state.subscriptionCancelled ? "Cancelled. Access ends on June 30." : `${seats} seats, renews on June 30.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <dl className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
              <div>
                <dt className="text-xs text-muted-foreground">Plan</dt>
                <dd className="font-medium">{planName(state.plan)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Seats</dt>
                <dd className="font-medium tabular-nums">{seats}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Budget</dt>
                <dd className="font-medium tabular-nums">${state.budget.toLocaleString("en-US")}/mo</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span aria-hidden className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border bg-background">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </span>
              <span className="min-w-40 flex-1">
                <Text variant="small" as="span" className="block">
                  Visa ending in {state.cardLast4}
                </Text>
                <Text variant="muted" as="span" className="block">
                  Charged on the 1st of each month
                </Text>
              </span>
              <Dialog>
                <DialogTrigger render={<Button variant="outline" size="sm" />}>Change card</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change card</DialogTitle>
                    <DialogDescription>The new card is charged from the next invoice.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <Field>
                      <FieldLabel>Card number</FieldLabel>
                      <Input aria-label="Card number" placeholder="1234 1234 1234 1234" inputMode="numeric" value={number} onValueChange={setNumber} />
                    </Field>
                    <Field>
                      <FieldLabel>Expiry</FieldLabel>
                      <Input aria-label="Expiry" placeholder="MM/YY" value={expiry} onValueChange={setExpiry} className="w-28" />
                    </Field>
                  </div>
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
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="ghost" className="text-muted-foreground" />} disabled={state.subscriptionCancelled}>
                Cancel subscription
              </AlertDialogTrigger>
              <AlertDialogContent>
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
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        <Card aria-label="Invoices">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y text-sm">
              {INVOICES.map(([id, date, amount]) => (
                <li key={id} className="flex items-center justify-between px-6 py-3">
                  <span>
                    <span className="font-medium">{id}</span>
                    <span className="ml-2 text-muted-foreground">{date}</span>
                  </span>
                  <span className="tabular-nums">{amount}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card aria-label="Danger zone" className="border-destructive/40">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-4 space-y-0">
          <span className="space-y-1.5">
            <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
            <CardDescription>
              {state.workspaceDeleted
                ? "This workspace is scheduled for deletion."
                : "Deleting the workspace removes every project, task and invoice. Press and hold to confirm."}
            </CardDescription>
          </span>
          <HoldToConfirm duration={1500} resetAfter={0} confirmedLabel="Deleted" onConfirm={() => update((s) => (s.workspaceDeleted = true))}>
            Delete workspace
          </HoldToConfirm>
        </CardHeader>
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

/** "Maya", "maya chen", "Maya's" or "my" to a teammate's full name. */
function teammate(text: string): string | undefined {
  const name = text.trim().toLowerCase().replace(/[.!?]+$/, "").replace(/'s$/, "")
  if (["me", "my", "mine", "i", "myself"].includes(name)) return ME
  return TEAM.find((n) => n.toLowerCase() === name || n.split(" ")[0].toLowerCase() === name)
}

const REASSIGN = /^(?:please\s+)?(?:move|reassign|give|hand(?:\s+over)?|transfer)\s+(?:all\s+)?(?:of\s+)?(.+?)\s+(?:open\s+)?tasks?\s+(?:over\s+)?to\s+(.+?)[.!]?$/i
const COMPLETE = /^(?:please\s+)?(?:complete|finish|close)\s+(?:all\s+)?(?:of\s+)?(.+?)\s+(?:open\s+)?tasks?[.!]?$/i

const tasksWord = (n: number) => (n === 1 ? "1 task" : `${n} tasks`)

/** Bulk changes typed as a request: moving or completing someone's open tasks. */
function AskOrbit({ state, update }: { state: AppState; update: Update }) {
  const openOf = (name: string | undefined) => state.tasks.filter((t) => t.assignee === name && !t.done)
  const named = (field: string, value: string) => {
    const name = teammate(value)
    if (!name) throw new Error(`No one called "${value}" is on the team. ${field} needs a teammate.`)
    return name
  }

  /** Changes each open task of `from` and records it, then returns how to put them back. */
  const change = (plan: string, from: string, apply: (t: Task) => void, revert: (t: Task) => void) => {
    const ids = openOf(from).map((t) => t.id)
    if (!ids.length) throw new Error(`${from} has no open tasks.`)
    const index = state.bulk.length
    update((s) => {
      const tasks = s.tasks.filter((t) => ids.includes(t.id))
      tasks.forEach(apply)
      s.bulk.push({ plan, tasks: tasks.map((t) => t.title), undone: false })
    })
    return () =>
      update((s) => {
        s.tasks.filter((t) => ids.includes(t.id)).forEach(revert)
        s.bulk[index].undone = true
      })
  }

  const resolve = (query: string): AskPlan | null => {
    const move = REASSIGN.exec(query.trim())
    if (move) {
      const from = teammate(move[1])
      const to = teammate(move[2])
      return {
        title: "Reassign tasks",
        sentence: ["Move the open tasks of ", { field: "from" }, " to ", { field: "to" }, "."],
        fields: [
          { id: "from", label: "From", value: from ?? move[1] },
          { id: "to", label: "To", value: to ?? move[2] },
        ],
        touches: from ? openOf(from).map((t) => t.title).join(", ") || `${from} has no open tasks.` : "Pick a teammate to move tasks from.",
        call: (v: AskValues) => `tasks.reassign({ from: "${teammate(v.from) ?? v.from}", to: "${teammate(v.to) ?? v.to}", status: "open" })`,
        verb: (v: AskValues) => `Move ${tasksWord(openOf(teammate(v.from)).length)} to ${(teammate(v.to) ?? v.to).split(" ")[0]}`,
        run: (v: AskValues) => {
          const source = named("From", v.from)
          const target = named("To", v.to)
          if (source === target) throw new Error(`Those tasks are already ${source}'s.`)
          const count = openOf(source).length
          const undo = change(`Move ${source}'s open tasks to ${target}`, source, (t) => (t.assignee = target), (t) => (t.assignee = source))
          return { message: `Moved ${tasksWord(count)} from ${source} to ${target}.`, undo }
        },
      }
    }
    const complete = COMPLETE.exec(query.trim())
    if (complete) {
      const who = teammate(complete[1])
      return {
        title: "Complete tasks",
        sentence: ["Mark the open tasks of ", { field: "who" }, " as done."],
        fields: [{ id: "who", label: "Assignee", value: who ?? complete[1] }],
        touches: who ? openOf(who).map((t) => t.title).join(", ") || `${who} has no open tasks.` : "Pick a teammate.",
        call: (v: AskValues) => `tasks.complete({ assignee: "${teammate(v.who) ?? v.who}", status: "open" })`,
        verb: (v: AskValues) => `Complete ${tasksWord(openOf(teammate(v.who)).length)}`,
        run: (v: AskValues) => {
          const person = named("Assignee", v.who)
          const count = openOf(person).length
          const undo = change(`Complete ${person}'s open tasks`, person, (t) => (t.done = true), (t) => (t.done = false))
          return { message: `Completed ${tasksWord(count)} for ${person}.`, undo }
        },
      }
    }
    return null
  }

  return (
    <AskBar
      label="Ask Orbit"
      shortcut="j"
      resolve={resolve}
      commands={pageItems()}
      onCommand={(item) => update((s) => goToPage(s, item.id.split(":")[1]))}
      suggestions={["Move all of Maya's tasks to Sam", "Complete all of my open tasks"]}
    >
      <AskBarTrigger />
      <AskBarContent />
    </AskBar>
  )
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
      <div className={state.compactMode ? "min-h-screen bg-background text-sm" : "min-h-screen bg-background"}>
        <ScrollProgress />
        <AnimatedTabs aria-label="Workspace sections" value={state.tab} onValueChange={(v) => update((s) => (s.tab = v as string))}>
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
            <TopBar state={state} update={update} />
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-2">
              <AnimatedTabsList>
                <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="tasks">Tasks</AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="settings">Settings</AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="billing">Billing</AnimatedTabsTrigger>
              </AnimatedTabsList>
              <CommandBar state={state} update={update} />
            </div>
          </header>
          {/* Clears the Ask bar docked below. */}
          <main className={state.compactMode ? "mx-auto max-w-6xl px-6 pb-32 pt-6" : "mx-auto max-w-6xl px-6 pb-32 pt-10"}>
            <AnimatedTabsContent value="overview" className="mt-0">
              <Overview state={state} update={update} />
            </AnimatedTabsContent>
            <AnimatedTabsContent value="tasks" className="mt-0">
              <Tasks state={state} update={update} />
            </AnimatedTabsContent>
            <AnimatedTabsContent value="settings" className="mt-0">
              <Settings state={state} update={update} />
            </AnimatedTabsContent>
            <AnimatedTabsContent value="billing" className="mt-0">
              <Billing state={state} update={update} />
            </AnimatedTabsContent>
          </main>
        </AnimatedTabs>
        <AppActions update={update} />
        <AskOrbit state={state} update={update} />
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
