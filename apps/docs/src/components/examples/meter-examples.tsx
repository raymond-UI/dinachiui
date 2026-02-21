"use client"

import { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue } from '@/components/ui/meter';

export function DefaultMeterExample() {
  return (
    <Meter value={40} className="w-full max-w-sm">
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}

export function MeterWithLabelExample() {
  return (
    <Meter value={72} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <MeterLabel>Storage Used</MeterLabel>
        <MeterValue />
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}

export function MeterLevelsExample() {
  return (
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
  );
}
