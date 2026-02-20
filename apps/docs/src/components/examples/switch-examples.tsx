"use client"

import React from 'react';
import { Switch, SwitchThumb } from '@/components/ui/switch';

export function DefaultSwitchExample() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode">
        <SwitchThumb />
      </Switch>
      <label htmlFor="airplane-mode" className="text-sm font-medium">
        Airplane Mode
      </label>
    </div>
  );
}

export function ControlledSwitchExample() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch checked={enabled} onCheckedChange={setEnabled}>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium">
          Dark Mode
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        Status: {enabled ? 'Enabled' : 'Disabled'}
      </p>
    </div>
  );
}

export function SwitchStatesExample() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium">Notifications (on)</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium">Marketing emails (off)</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium text-muted-foreground">Disabled</label>
      </div>
    </div>
  );
}
