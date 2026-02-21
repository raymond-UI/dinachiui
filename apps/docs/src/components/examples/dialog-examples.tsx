"use client"

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Checkbox } from '@/components/ui/checkbox';

export function DefaultDialogExample() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" defaultValue="John Doe" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <input id="username" defaultValue="@johndoe" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ControlledDialogExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Delete Item</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DialogWithFormExample() {
  const [severity, setSeverity] = React.useState("medium");

  return (
    <Dialog>
      <DialogTrigger>Create Rule</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Monitoring Rule</DialogTitle>
          <DialogDescription>
            Configure a rule to trigger notifications for important events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="rule-name" className="text-sm font-medium uppercase tracking-wide">Name</label>
              <Input id="rule-name" placeholder="Ex: NVDA" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium uppercase tracking-wide">Condition</label>
              <Select defaultValue="volatility">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent portal={false}>
                  <SelectItem value="price-above">Price above</SelectItem>
                  <SelectItem value="price-below">Price below</SelectItem>
                  <SelectItem value="volatility">Volatility</SelectItem>
                  <SelectItem value="volume-spike">Volume spike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide">Severity</label>
            <RadioGroup value={severity} onValueChange={(value) => setSeverity(value as string)} className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2.5 text-sm has-checked:border-primary has-checked:bg-primary/5"
                >
                  <Radio value={value} />
                  <span className="capitalize">{value}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide">Notify via</label>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: "Slack", defaultChecked: true }, { label: "Email", defaultChecked: true }, { label: "SMS", defaultChecked: false }].map((ch) => (
                <label
                  key={ch.label}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2.5 text-sm has-checked:border-primary has-checked:bg-primary/5"
                >
                  <Checkbox defaultChecked={ch.defaultChecked} />
                  <span>{ch.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="rule-notes" className="text-sm font-medium uppercase tracking-wide">Notes</label>
            <Textarea id="rule-notes" placeholder="Alert context, owner, and escalation path..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
