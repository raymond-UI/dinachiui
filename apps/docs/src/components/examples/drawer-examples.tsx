"use client"

import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export function DefaultDrawerExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile settings.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="drawer-name" className="text-sm font-medium">Name</label>
            <input
              id="drawer-name"
              defaultValue="John Doe"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="drawer-email" className="text-sm font-medium">Email</label>
            <input
              id="drawer-email"
              type="email"
              defaultValue="john@example.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function DrawerSidesExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Left</Button>
        </DrawerTrigger>
        <DrawerContent side="left">
          <DrawerHeader>
            <DrawerTitle>Left Drawer</DrawerTitle>
            <DrawerDescription>This drawer slides in from the left.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Right</Button>
        </DrawerTrigger>
        <DrawerContent side="right">
          <DrawerHeader>
            <DrawerTitle>Right Drawer</DrawerTitle>
            <DrawerDescription>This drawer slides in from the right.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Top</Button>
        </DrawerTrigger>
        <DrawerContent side="top">
          <DrawerHeader>
            <DrawerTitle>Top Drawer</DrawerTitle>
            <DrawerDescription>This drawer slides in from the top.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </DrawerTrigger>
        <DrawerContent side="bottom">
          <DrawerHeader>
            <DrawerTitle>Bottom Drawer</DrawerTitle>
            <DrawerDescription>This drawer slides in from the bottom.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function DrawerWithNavigationExample() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Navigation</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-1">
          {['Dashboard', 'Projects', 'Team', 'Settings', 'Help'].map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
