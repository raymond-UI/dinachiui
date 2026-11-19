"use client";

import * as React from "react";
import { BedDouble, Building2, FileText, Receipt, User, Zap } from "lucide-react";
import {
  CommandPalette,
  CommandPaletteBody,
  CommandPaletteContent,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPalettePreview,
  CommandPaletteTrigger,
  type CommandAction,
  type CommandItem,
  type CommandPaletteProps,
} from "@/components/ui/command-palette";

const page = <FileText />;
const act = <Zap />;
const order = <Receipt />;
const guest = <User />;
const room = <BedDouble />;

const open = [{ id: "open", label: "Open" }];
const run = [{ id: "run", label: "Run" }];

/** A hotel's back office: pages, actions and the records an operator looks up. */
export const HOTEL: CommandItem[] = [
  { id: "orders", label: "Orders", group: "Pages", kind: "Page", icon: page, shortcut: "G O", actions: open },
  { id: "rooms", label: "Rooms", group: "Pages", kind: "Page", icon: page, shortcut: "G R", actions: open },
  { id: "rates", label: "Rates", group: "Pages", kind: "Page", icon: page, shortcut: "G A", actions: open },
  { id: "payouts", label: "Payouts", group: "Pages", kind: "Page", icon: page, actions: open },
  { id: "settings", label: "Settings", group: "Pages", kind: "Page", icon: page, shortcut: "⌘ ,", actions: open },
  { id: "new-booking", label: "New booking", group: "Actions", kind: "Action", icon: act, shortcut: "N", actions: run },
  { id: "refund", label: "Refund an order", group: "Actions", kind: "Action", icon: act, actions: run },
  { id: "block", label: "Block a room", group: "Actions", kind: "Action", icon: act, actions: run },
  { id: "export", label: "Export orders", group: "Actions", kind: "Action", icon: act, actions: run },
  {
    id: "property",
    label: "Switch property",
    group: "Actions",
    kind: "Action",
    icon: act,
    shortcut: "⌘ P",
    items: [
      { id: "saltmarsh", label: "Saltmarsh Hotel", description: "Whitstable", icon: <Building2 />, actions: open },
      { id: "harbour", label: "Harbour House", description: "Deal", icon: <Building2 />, actions: open },
      { id: "dunes", label: "The Dunes", description: "Camber", icon: <Building2 />, actions: open },
    ],
  },
  ...[
    { n: "4821", who: "Ada Okafor", amt: "£204.00" },
    { n: "4820", who: "Lukas Berg", amt: "£68.95" },
    { n: "4818", who: "Leila Haddad", amt: "£155.00" },
  ].map(({ n, who, amt }) => ({
    id: `order-${n}`,
    label: `Order #${n}`,
    description: who,
    group: "Orders",
    kind: "Order",
    icon: order,
    meta: amt,
    actions: [
      { id: "open", label: "Open order" },
      { id: "refund", label: "Refund" },
      { id: "email", label: "Email guest" },
    ],
  })),
  {
    id: "ada",
    label: "Ada Okafor",
    description: "3 stays · ada.okafor@fastmail.com",
    group: "Guests",
    kind: "Guest",
    icon: guest,
    actions: [
      { id: "open", label: "Open guest" },
      { id: "book", label: "New booking" },
      { id: "email", label: "Email" },
    ],
  },
  {
    id: "tomas",
    label: "Tomás Herrera",
    description: "1 stay · arriving 14 Dec",
    group: "Guests",
    kind: "Guest",
    icon: guest,
    actions: [
      { id: "open", label: "Open guest" },
      { id: "book", label: "New booking" },
      { id: "email", label: "Email" },
    ],
  },
  ...[
    { n: "214", s: "Sea View Double · overbooked 14 Dec" },
    { n: "108", s: "Garden Single · free tonight" },
  ].map(({ n, s }) => ({
    id: `room-${n}`,
    label: `Room ${n}`,
    description: s,
    group: "Rooms",
    kind: "Room",
    icon: room,
    actions: [
      { id: "open", label: "Open room" },
      { id: "block", label: "Block" },
      { id: "move", label: "Move guest" },
    ],
  })),
];

export const RECENT = ["order-4821", "rates", "room-214"];

/** Listed after the recent ones while the search is empty. */
export const SUGGESTED = ["new-booking", "refund", "block", "export"];

export const ORDERS: Record<string, [string, string][]> = {
  "order-4821": [["Status", "Pending"], ["Channel", "Android"], ["Placed", "17 Nov, 15:42"], ["Stay", "2 nights, Sea View Double"]],
  "order-4820": [["Status", "Pending"], ["Channel", "Web"], ["Placed", "17 Nov, 12:55"], ["Stay", "1 night, Garden Single"]],
  "order-4818": [["Status", "Paid"], ["Channel", "Android"], ["Placed", "17 Nov, 06:21"], ["Stay", "1 night, Harbour Twin"]],
};

/** The app's own fields for a record. The palette only lays out the name and actions. */
export function HotelPreview(item: CommandItem) {
  const rows = ORDERS[item.id];
  if (!rows) {
    return <p className="text-[15px] text-muted-foreground sm:text-[12.5px]">{item.description ?? `Go to ${item.label}.`}</p>;
  }
  return (
    <dl className="grid grid-cols-[90px_1fr] gap-x-2 gap-y-2 text-[15px] sm:grid-cols-[80px_1fr] sm:gap-y-1.5 sm:text-[12.5px]">
      {[["Amount", String(item.meta)], ...rows].map(([term, value]) => (
        <React.Fragment key={term}>
          <dt className="text-muted-foreground">{term}</dt>
          <dd className="tabular-nums">{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

export function HotelPalette({
  preview = true,
  onRan,
  ...props
}: Partial<CommandPaletteProps> & { preview?: boolean; onRan?: (text: string) => void }) {
  return (
    <CommandPalette
      items={HOTEL}
      recent={RECENT}
      suggested={SUGGESTED}
      label="Search Saltmarsh"
      {...props}
      onRun={(item, action, details) => {
        props.onRun?.(item, action, details);
        if (!details.isCanceled) onRan?.(describeRun(item, action));
      }}
    >
      <CommandPaletteTrigger />
      <CommandPaletteContent>
        <CommandPaletteInput placeholder="Search pages, actions, orders, guests, rooms" />
        <CommandPaletteBody>
          <CommandPaletteList />
          {preview && (
            <CommandPalettePreview placeholder="Type to search pages, actions, orders, guests and rooms.">
              {HotelPreview}
            </CommandPalettePreview>
          )}
        </CommandPaletteBody>
      </CommandPaletteContent>
    </CommandPalette>
  );
}

const describeRun = (item: CommandItem, action: CommandAction | undefined) =>
  action && !["open", "run"].includes(action.id) ? `${action.label}: ${item.label}` : item.label;

export function DefaultCommandPaletteExample() {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      {/* The site's own search holds Cmd+K here, so the examples open from the button. */}
      <HotelPalette shortcut={false} onRan={setRan} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {ran && `Ran ${ran}`}
      </p>
    </div>
  );
}

const SIMPLE: CommandItem[] = [
  { id: "inbox", label: "Inbox", group: "Go to", shortcut: "G I" },
  { id: "projects", label: "Projects", group: "Go to", shortcut: "G P" },
  { id: "new-issue", label: "New issue", group: "Create", shortcut: "C" },
  { id: "new-project", label: "New project", group: "Create" },
  { id: "theme", label: "Toggle theme", group: "Preferences", keywords: ["dark", "light"] },
];

export function ListOnlyCommandPaletteExample() {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <CommandPalette items={SIMPLE} shortcut={false} onRun={(item) => setRan(item.label)}>
        <CommandPaletteTrigger>Commands</CommandPaletteTrigger>
        <CommandPaletteContent className="sm:w-[520px]">
          <CommandPaletteInput placeholder="Type a command" />
          <CommandPaletteBody className="sm:h-auto sm:max-h-[320px]">
            <CommandPaletteList empty={(q) => `No command for “${q}”`} />
          </CommandPaletteBody>
        </CommandPaletteContent>
      </CommandPalette>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {ran && `Ran ${ran}`}
      </p>
    </div>
  );
}
