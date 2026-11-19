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
  const [floor, setFloor] = useState(162);
  return (
    <div className="grid w-full max-w-[560px] gap-3">
      <Alert variant="warning" open={open && floor < 170} onOpenChange={setOpen}>
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Sea View Double is under your floor</AlertTitle>
          <AlertDescription>£{floor} on Wed 14 is below the £170 floor. It publishes to all channels at 18:00.</AlertDescription>
        </AlertContent>
        <AlertAction onClick={() => setFloor(170)}>Raise to £170</AlertAction>
        <AlertDismiss />
      </Alert>
      {!(open && floor < 170) && (
        <Button
          variant="outline"
          size="sm"
          className="justify-self-start"
          onClick={() => {
            setFloor(162);
            setOpen(true);
          }}
        >
          Show again
        </Button>
      )}
    </div>
  );
}

const ROOMS = [
  ["Sea View Double", 162],
  ["Harbour Twin", 138],
  ["Garden Single", 96],
] as const;

export function PhoneAlertExample() {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-2xl border bg-background">
      <div className="px-[18px] pb-3 pt-4">
        <div className="text-lg font-semibold">Rates</div>
        <div className="text-sm text-muted-foreground">Harbour House, Wed 14</div>
      </div>
      <Alert
        variant="warning"
        open={open}
        onOpenChange={setOpen}
        className="rounded-none border-x-0 px-[18px] pb-4 pt-3.5"
      >
        <AlertIcon />
        <AlertContent>
          <AlertTitle className="text-[15px]">Sea View Double is under your floor</AlertTitle>
          <AlertDescription className="text-sm">£162 is below the £170 floor. It publishes at 18:00.</AlertDescription>
          <AlertAction size="default">Raise to £170</AlertAction>
        </AlertContent>
        <AlertDismiss className="h-9 w-9" />
      </Alert>
      <ul>
        {ROOMS.map(([room, rate]) => (
          <li key={room} className="flex justify-between border-b px-[18px] py-3.5 text-[15px] last:border-b-0">
            <span>{room}</span>
            <span className="tabular-nums">£{rate}</span>
          </li>
        ))}
      </ul>
      {!open && (
        <div className="px-[18px] pb-4">
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Show again
          </Button>
        </div>
      )}
    </div>
  );
}
