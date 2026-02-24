"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
} from "@/components/ui/meter";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { Tile } from "./Tile";

export function AccessibleTile() {
  return (
    <Tile className="h-full" delay={0}>
      <div className="pl-8 pb-4 pt-6">
        <h3 className="text-lg font-medium font-pixel mb-1">Accessible</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          Built on Base UI with WAI-ARIA compliance. Keyboard navigation, focus
          management, and screen reader support included.
        </p>
      </div>
      <div className="flex w-full pl-8 pt-5 h-full">
        <div className="w-full rounded-tl-md bg-muted border border-r-0 border-border overflow-hidden p-6 space-y-5">
          <div className="flex gap-3">
            <Button size="sm">Primary</Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox id="a11y-check" defaultChecked />
              <label
                htmlFor="a11y-check"
                className="text-sm text-muted-foreground"
              >
                Enable notifications
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dark mode</span>
              <Switch>
                <SwitchThumb />
              </Switch>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <Meter value={25} className="w-full">
              <div className="flex items-center justify-between">
                <MeterLabel>CPU Usage</MeterLabel>
                <span className="text-xs text-muted-foreground">25%</span>
              </div>
              <MeterTrack>
                <MeterIndicator className="bg-green-500" />
              </MeterTrack>
            </Meter>
            <Meter value={65} className="w-full">
              <div className="flex items-center justify-between">
                <MeterLabel>Memory</MeterLabel>
                <span className="text-xs text-muted-foreground">65%</span>
              </div>
              <MeterTrack>
                <MeterIndicator className="bg-yellow-500" />
              </MeterTrack>
            </Meter>
            <Meter value={90} className="w-full">
              <div className="flex items-center justify-between">
                <MeterLabel>Disk Space</MeterLabel>
                <span className="text-xs text-muted-foreground">90%</span>
              </div>
              <MeterTrack>
                <MeterIndicator className="bg-red-500" />
              </MeterTrack>
            </Meter>
          </div>
        </div>
      </div>
    </Tile>
  );
}
