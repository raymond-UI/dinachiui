"use client"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
  PopoverViewport,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  createPopoverHandle,
} from '@/components/ui/popover';
import { Bell, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DefaultPopoverExample() {
  return (
    <Popover>
      <PopoverTrigger render={(props) => (
        <Button variant="outline" size="icon" {...props}>
          <Bell className="h-4 w-4" />
        </Button>
      )} />
      <PopoverContent>
        <PopoverArrow />
        <PopoverTitle>Notifications</PopoverTitle>
        <PopoverDescription>
          You are all caught up. Good job!
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

export function PopoverWithCloseExample() {
  return (
    <Popover>
      <PopoverTrigger render={(props) => (
        <Button variant="outline" {...props}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      )} />
      <PopoverContent className="w-80">
        <div className="flex items-start justify-between mb-2">
          <PopoverTitle>Settings</PopoverTitle>
          <PopoverClose render={(props) => (
            <button {...props} className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )} />
        </div>
        <PopoverDescription>
          Configure your application settings here.
        </PopoverDescription>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Enable notifications</label>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Auto-save</label>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function PopoverPositionExample() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <Popover>
        <PopoverTrigger render={(props) => (
          <Button variant="outline" {...props}>Top</Button>
        )} />
        <PopoverContent side="top">
          <PopoverArrow />
          <PopoverTitle>Top Position</PopoverTitle>
          <PopoverDescription>This popover opens at the top.</PopoverDescription>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger render={(props) => (
          <Button variant="outline" {...props}>Bottom</Button>
        )} />
        <PopoverContent side="bottom">
          <PopoverArrow />
          <PopoverTitle>Bottom Position</PopoverTitle>
          <PopoverDescription>This popover opens at the bottom.</PopoverDescription>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger render={(props) => (
          <Button variant="outline" {...props}>Left</Button>
        )} />
        <PopoverContent side="left">
          <PopoverArrow />
          <PopoverTitle>Left Position</PopoverTitle>
          <PopoverDescription>This popover opens on the left.</PopoverDescription>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger render={(props) => (
          <Button variant="outline" {...props}>Right</Button>
        )} />
        <PopoverContent side="right">
          <PopoverArrow />
          <PopoverTitle>Right Position</PopoverTitle>
          <PopoverDescription>This popover opens on the right.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function PopoverHoverExample() {
  return (
    <Popover>
      <PopoverTrigger openOnHover delay={200} closeDelay={100} render={(props) => (
        <Button variant="outline" {...props}>Hover me</Button>
      )} />
      <PopoverContent>
        <PopoverArrow />
        <PopoverTitle>Hover Popover</PopoverTitle>
        <PopoverDescription>
          This popover opens when you hover over the trigger button.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

const tabs = [
  { id: 'profile', label: 'Profile', title: 'Your Profile', description: 'Manage your display name, avatar, and public bio.' },
  { id: 'account', label: 'Account', title: 'Account Settings', description: 'Update your email, password, and two-factor authentication.' },
  { id: 'billing', label: 'Billing', title: 'Billing & Plans', description: 'View invoices, update payment methods, and change your plan.' },
];

export function PopoverMultiTriggerExample() {
  const handle = createPopoverHandle();

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <PopoverTrigger
          key={tab.id}
          handle={handle}
          payload={tab}
          openOnHover
          delay={200}
          closeDelay={150}
          render={(props) => (
            <Button variant="outline" size="sm" {...props}>{tab.label}</Button>
          )}
        />
      ))}
      <Popover handle={handle}>
        {({ payload }) => {
          const tab = payload as (typeof tabs)[number] | undefined;
          return (
            <PopoverPortal>
              <PopoverPositioner sideOffset={8}>
                <PopoverPopup>
                  <PopoverArrow />
                  <PopoverViewport>
                    {tab && (
                      <>
                        <PopoverTitle>{tab.title}</PopoverTitle>
                        <PopoverDescription>{tab.description}</PopoverDescription>
                      </>
                    )}
                  </PopoverViewport>
                </PopoverPopup>
              </PopoverPositioner>
            </PopoverPortal>
          );
        }}
      </Popover>
    </div>
  );
}

