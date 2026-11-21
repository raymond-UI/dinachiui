"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertDismiss,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";

// The alert text is fixed rather than read from the rate, so it does not change while it fades out.
const FLOOR = 170;

export function VariantsAlertExample() {
  return (
    <div className="grid w-full max-w-[560px] gap-3">
      <Alert>
        <AlertIcon>
          <RefreshCw />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>Rates sync every 15 minutes. Last synced 10:42.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="info">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>New cancellation policy from 1 December</AlertTitle>
          <AlertDescription>Bookings made after that date get 48 hours of free cancellation.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="success">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Rates published to 4 channels</AlertTitle>
          <AlertDescription>Booking.com, Expedia, Airbnb and direct now show £148 for 12 to 18 Dec.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="warning">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Sea View Double is under your floor</AlertTitle>
          <AlertDescription>£162 on Wed 14 is below the £170 floor. It publishes to all channels at 18:00.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="destructive">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Payout failed</AlertTitle>
          <AlertDescription>Barclays declined the £12,480.00 transfer. Update the account to retry.</AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  );
}

export function ActionAlertExample() {
  const [open, setOpen] = useState(true);
  const [rate, setRate] = useState(162);
  const below = open && rate < FLOOR;
  return (
    <div className="grid w-full max-w-[560px] gap-3">
      <Alert variant="warning" open={below} onOpenChange={setOpen}>
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Sea View Double is under your floor</AlertTitle>
          <AlertDescription>£162 on Wed 14 is below the £{FLOOR} floor. It publishes to all channels at 18:00.</AlertDescription>
        </AlertContent>
        <AlertAction onClick={() => setRate(FLOOR)}>Raise to £{FLOOR}</AlertAction>
        <AlertDismiss />
      </Alert>
      {!below && (
        <Button
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() => {
            setRate(162);
            setOpen(true);
          }}
        >
          Show again
        </Button>
      )}
    </div>
  );
}

export function PhoneAlertExample() {
  const [open, setOpen] = useState(true);
  const [rate, setRate] = useState(162);
  const rooms = [
    ["Sea View Double", rate],
    ["Harbour Twin", 178],
    ["Garden Single", 172],
  ] as const;
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-2xl border bg-background">
      <div className="px-[18px] pb-3 pt-4">
        <div className="text-lg font-semibold">Rates</div>
        <div className="text-sm text-muted-foreground">Harbour House, Wed 14</div>
      </div>
      <Alert
        variant="warning"
        open={open && rate < FLOOR}
        onOpenChange={setOpen}
        className="rounded-none border-x-0 px-[18px] pb-4 pt-3.5"
      >
        <AlertIcon />
        <AlertContent>
          <AlertTitle className="text-[15px]">Sea View Double is under your floor</AlertTitle>
          <AlertDescription className="text-sm">£162 is below the £{FLOOR} floor. It publishes at 18:00.</AlertDescription>
          <AlertAction size="default" onClick={() => setRate(FLOOR)}>
            Raise to £{FLOOR}
          </AlertAction>
        </AlertContent>
        <AlertDismiss className="h-9 w-9" />
      </Alert>
      <ul>
        {rooms.map(([room, value]) => {
          const under = value < FLOOR;
          return (
            <li key={room} className="flex items-center justify-between border-b px-[18px] py-3.5 text-[15px] last:border-b-0">
              <span className="flex items-center gap-2">
                {under && <span aria-hidden="true" className="size-1.5 rounded-full bg-[color:var(--warning)]" />}
                {room}
              </span>
              <span className={under ? "tabular-nums text-[color:var(--warning)]" : "tabular-nums"}>
                £{value}
                {under && <span className="sr-only"> (under floor)</span>}
              </span>
            </li>
          );
        })}
      </ul>
      {(rate >= FLOOR || !open) && (
        <div className="px-[18px] pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRate(162);
              setOpen(true);
            }}
          >
            Show again
          </Button>
        </div>
      )}
    </div>
  );
}
