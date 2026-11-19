"use client";

import * as React from "react";
import { BedDouble, FileText, Receipt, User, Zap } from "lucide-react";
import {
  Omnibar,
  OmnibarContent,
  OmnibarInput,
  OmnibarList,
  OmnibarScopes,
  OmnibarTrigger,
  type CommandAction,
  type CommandItem,
  type OmnibarProps,
  type OmnibarScope,
} from "@/components/ui/omnibar";

const open = [{ id: "open", label: "Open" }];
const run = [{ id: "run", label: "Run" }];
const guestActions = [
  { id: "check-in", label: "Check in" },
  { id: "assign", label: "Assign room" },
  { id: "message", label: "Message" },
];
const roomActions = [
  { id: "open", label: "Open" },
  { id: "clean", label: "Mark clean" },
  { id: "block", label: "Block" },
];
const bookingActions = [
  { id: "open", label: "Open" },
  { id: "extend", label: "Extend stay" },
  { id: "cancel", label: "Cancel" },
];

const page = (id: string, label: string, shortcut: string): CommandItem => ({
  id, label, shortcut, group: "Pages", kind: "Page", icon: <FileText />, actions: open,
});
const action = (id: string, label: string, shortcut?: string): CommandItem => ({
  id, label, shortcut, group: "Actions", kind: "Action", icon: <Zap />, actions: run,
});
const guest = (id: string, label: string, description: string): CommandItem => ({
  id, label, description, group: "Guests", kind: "Guest", icon: <User />, actions: guestActions,
});
const room = (n: string, description: string): CommandItem => ({
  id: `room-${n}`, label: `Room ${n}`, description, group: "Rooms", kind: "Room", icon: <BedDouble />, actions: roomActions,
});
const booking = (n: string, description: string): CommandItem => ({
  id: `booking-${n}`, label: `Booking #${n}`, description, group: "Bookings", kind: "Booking", icon: <Receipt />, actions: bookingActions,
});

/** A hotel front desk: its pages, what the desk does, and the guests, rooms and bookings it looks up. */
export const DESK: CommandItem[] = [
  page("arrivals", "Arrivals", "G A"),
  page("departures", "Departures", "G D"),
  page("housekeeping", "Housekeeping", "G H"),
  action("check-in", "Check in a guest", "C"),
  action("walk-in", "Walk-in booking", "N"),
  action("key-cards", "Print key cards"),
  action("fault", "Report a fault"),
  guest("tomas", "Tomás Herrera", "Arriving 14:00 · room 108 not ready"),
  guest("ada", "Ada Okafor", "Arriving 15:30 · room 214"),
  guest("jonas", "Jonas Weber", "Late arrival, 23:00 · room 110"),
  guest("mei", "Mei Lin", "Checked in · room 302"),
  room("108", "Garden Single · being cleaned"),
  room("110", "Garden Single · ready"),
  room("214", "Sea View Double · ready"),
  booking("4807", "Tomás Herrera · 14 to 16 Dec"),
  booking("4821", "Ada Okafor · 14 to 16 Dec"),
];

export const SCOPES: OmnibarScope[] = [
  { id: "actions", label: "Actions", prefix: ">" },
  { id: "guests", label: "Guests", prefix: "@" },
  { id: "rooms", label: "Rooms", prefix: "#" },
  { id: "bookings", label: "Bookings" },
];

export const RECENT = ["tomas", "room-108", "housekeeping"];
export const SUGGESTED = ["check-in", "walk-in", "key-cards", "fault"];

export const describeRun = (item: CommandItem, act: CommandAction | undefined) =>
  act && !["open", "run"].includes(act.id) ? `${act.label}: ${item.label}` : item.label;

/** A slice of the desk's header, so the omnibar sits where it would in the app. */
function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3 rounded-xl border bg-background p-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="text-sm font-semibold">Front desk</p>
        <p className="text-xs text-muted-foreground">Saltmarsh Hotel · Mon 14 Dec</p>
      </div>
      {children}
    </div>
  );
}

export function DeskOmnibar({
  scopes = true,
  onRan,
  ...props
}: Omit<Partial<OmnibarProps>, "scopes"> & { scopes?: boolean; onRan?: (text: string) => void }) {
  return (
    <Omnibar
      items={DESK}
      scopes={scopes ? SCOPES : undefined}
      recent={RECENT}
      suggested={SUGGESTED}
      label="Search the desk"
      {...props}
      onRun={(item, act, details) => {
        props.onRun?.(item, act, details);
        if (!details.isCanceled) onRan?.(describeRun(item, act));
      }}
    >
      <OmnibarTrigger placeholder="Search guests, rooms, bookings" />
      <OmnibarContent>
        <OmnibarInput placeholder="Search guests, rooms, bookings or type > for actions" phonePlaceholder="Search guests, rooms, bookings" />
        <OmnibarScopes />
        <OmnibarList />
      </OmnibarContent>
    </Omnibar>
  );
}

export function DefaultOmnibarExample() {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Header>
        {/* The stage at the top of the page holds /, so this one opens from its field. */}
        <DeskOmnibar shortcut={false} onRan={setRan} />
      </Header>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {ran && `Ran ${ran}`}
      </p>
    </div>
  );
}

const SIMPLE: CommandItem[] = [
  { id: "inbox", label: "Inbox", group: "Go to" },
  { id: "projects", label: "Projects", group: "Go to" },
  { id: "new-issue", label: "New issue", group: "Create" },
  { id: "new-project", label: "New project", group: "Create" },
];

export function UnscopedOmnibarExample() {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Header>
        <Omnibar items={SIMPLE} shortcut={false} onRun={(item) => setRan(item.label)}>
          <OmnibarTrigger placeholder="Jump to" />
          <OmnibarContent className="sm:w-[400px]">
            <OmnibarInput placeholder="Jump to" />
            <OmnibarList empty={(q) => `Nowhere called “${q}”`} />
          </OmnibarContent>
        </Omnibar>
      </Header>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {ran && `Went to ${ran}`}
      </p>
    </div>
  );
}
