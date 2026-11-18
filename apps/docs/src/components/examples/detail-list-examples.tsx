"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DetailList,
  DetailListDetails,
  DetailListItem,
  DetailListTerm,
  type DetailListChangeDetails,
  type DetailListLayout,
} from "@/components/ui/detail-list";
import { cn } from "@/lib/utils";

export const ORDER = {
  email: "ada.okafor@fastmail.com",
  address: "Flat 4, 21 Elgin Crescent\nLondon W11 2JD\nUnited Kingdom",
  note: "Leave with the concierge if no one answers.",
};

export const validateEmail = (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Enter an email address.");

type Edit = (value: string, details: DetailListChangeDetails) => void;

export function OrderDetails({
  layout = "side",
  editable = true,
  onEmailChange,
  onNoteChange,
  disabled,
  brief = false,
  className,
}: {
  layout?: DetailListLayout;
  editable?: boolean;
  onEmailChange?: Edit;
  onNoteChange?: Edit;
  disabled?: boolean;
  /** Customer to Order ID without the rows in between, for a short stage. */
  brief?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("w-full max-w-[600px] rounded-xl border bg-popover px-[22px] py-2 text-popover-foreground shadow-sm max-md:px-4", className)}>
      <h3 className="pb-3 pt-3.5 text-lg font-semibold tracking-[-0.01em]">Order #4821</h3>
      <DetailList layout={layout}>
        {!brief && (
          <DetailListItem>
            <DetailListTerm>Status</DetailListTerm>
            <DetailListDetails>
              <Badge variant="outline" className="gap-1.5 font-medium">
                <span aria-hidden className="size-[7px] rounded-full shadow-[inset_0_0_0_1.5px_var(--muted-foreground)]" />
                Pending
              </Badge>
            </DetailListDetails>
          </DetailListItem>
        )}
        <DetailListItem>
          <DetailListTerm>Customer</DetailListTerm>
          <DetailListDetails>Ada Okafor</DetailListDetails>
        </DetailListItem>
        <DetailListItem copyable editable={editable} disabled={disabled} defaultValue={ORDER.email} validate={validateEmail} onValueChange={onEmailChange}>
          <DetailListTerm>Email</DetailListTerm>
          <DetailListDetails />
        </DetailListItem>
        {!brief && (
          <DetailListItem>
            <DetailListTerm>Placed</DetailListTerm>
            <DetailListDetails>17 Nov 2026, 15:42</DetailListDetails>
          </DetailListItem>
        )}
        {!brief && (
          <DetailListItem>
            <DetailListTerm>Amount</DetailListTerm>
            <DetailListDetails>
              <span className="tabular-nums">£204.00</span>
              <span className="text-muted-foreground"> · 2 items</span>
            </DetailListDetails>
          </DetailListItem>
        )}
        {!brief && (
          <DetailListItem>
            <DetailListTerm>Payment</DetailListTerm>
            <DetailListDetails>Visa ending 4242</DetailListDetails>
          </DetailListItem>
        )}
        <DetailListItem copyable editable={editable} disabled={disabled} multiline defaultValue={ORDER.address}>
          <DetailListTerm>Delivery to</DetailListTerm>
          <DetailListDetails />
        </DetailListItem>
        <DetailListItem editable={editable} disabled={disabled} multiline defaultValue={ORDER.note} onValueChange={onNoteChange}>
          <DetailListTerm>Note</DetailListTerm>
          <DetailListDetails />
        </DetailListItem>
        <DetailListItem copyable defaultValue="ord_8f2kq4821">
          <DetailListTerm>Order ID</DetailListTerm>
          <DetailListDetails>{(v) => <span className="font-mono text-[13px]">{v}</span>}</DetailListDetails>
        </DetailListItem>
      </DetailList>
    </div>
  );
}

export function DefaultDetailListExample() {
  return <OrderDetails />;
}

export function ControlledDetailListExample() {
  const [email, setEmail] = useState(ORDER.email);
  const [saved, setSaved] = useState<string | null>(null);
  return (
    <div className="grid w-full max-w-[600px] gap-3">
      <p className="text-[13px] text-muted-foreground" aria-live="polite">
        {saved ? `Saved ${saved}` : "Edit the email and press Enter."}
      </p>
      <div className="rounded-xl border bg-popover px-[22px] py-2 shadow-sm max-md:px-4">
        <DetailList layout="stacked">
          <DetailListItem
            copyable
            editable
            value={email}
            validate={validateEmail}
            onValueChange={(next) => {
              setEmail(next);
              setSaved(next);
            }}
          >
            <DetailListTerm>Email</DetailListTerm>
            <DetailListDetails />
          </DetailListItem>
        </DetailList>
      </div>
    </div>
  );
}
