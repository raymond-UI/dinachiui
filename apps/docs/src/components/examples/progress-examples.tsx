"use client"

import React from 'react';
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from '@/components/ui/progress';

export function DefaultProgressExample() {
  return (
    <Progress value={60} className="w-full max-w-sm">
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}

export function ProgressWithLabelExample() {
  return (
    <Progress value={75} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <ProgressLabel>Uploading...</ProgressLabel>
        <ProgressValue />
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}

export function AnimatedProgressExample() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Progress value={progress} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <ProgressLabel>Loading</ProgressLabel>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}
