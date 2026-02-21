"use client"

import { Separator } from '@/components/ui/separator';

export function DefaultSeparatorExample() {
  return (
    <div className="w-full max-w-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Dinachi UI</h4>
        <p className="text-sm text-muted-foreground">
          An accessible component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
        <Separator orientation="vertical" />
        <div>Blog</div>
      </div>
    </div>
  );
}

export function SeparatorOrientationsExample() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <div>
        <p className="text-sm font-medium mb-2">Horizontal</p>
        <Separator />
      </div>
      <div className="flex items-center space-x-4 h-8">
        <span className="text-sm">Item A</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Item B</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Item C</span>
      </div>
    </div>
  );
}
