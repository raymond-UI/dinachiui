"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TimeSlots, type TimeSlot } from "@/components/ui/time-slots";

export const roomBusy: TimeSlot[] = [
  { start: 540, end: 600 },
  { start: 750, end: 810 },
  { start: 900, end: 990 },
  { start: 1080, end: 1125 },
];

export function DefaultTimeSlotsExample() {
  const [slot, setSlot] = useState<TimeSlot | null>({ start: 645, end: 720 });
  return (
    <TimeSlots aria-label="Room" className="max-w-3xl" timeZone="GMT" busy={roomBusy} value={slot} onValueChange={setSlot}>
      <Button size="sm" disabled={!slot}>
        Book
      </Button>
    </TimeSlots>
  );
}

export function RowsTimeSlotsExample() {
  const [slot, setSlot] = useState<TimeSlot | null>({ start: 660, end: 720 });
  return (
    <TimeSlots aria-label="Room" layout="vertical" className="h-96 w-80" timeZone="GMT" busy={roomBusy} value={slot} onValueChange={setSlot}>
      <Button size="sm" disabled={!slot}>
        Book
      </Button>
    </TimeSlots>
  );
}
