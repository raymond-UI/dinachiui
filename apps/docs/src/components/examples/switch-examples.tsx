"use client"

import React from 'react';
import { Switch, SwitchThumb } from '@/components/ui/switch';

export function DefaultSwitchExample() {
  return (
    <label className="flex items-center space-x-2">
      <Switch>
        <SwitchThumb />
      </Switch>
      <span className="text-sm font-medium">Airplane Mode</span>
    </label>
  );
}

export function ControlledSwitchExample() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-2">
        <Switch checked={enabled} onCheckedChange={setEnabled}>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Dark Mode</span>
      </label>
      <p className="text-sm text-muted-foreground">
        Status: {enabled ? 'Enabled' : 'Disabled'}
      </p>
    </div>
  );
}

export function SwitchStatesExample() {
  return (
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Notifications (on)</span>
      </label>
      <label className="flex items-center space-x-2">
        <Switch>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Marketing emails (off)</span>
      </label>
      <label className="flex items-center space-x-2 text-muted-foreground">
        <Switch disabled>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Disabled</span>
      </label>
    </div>
  );
}
