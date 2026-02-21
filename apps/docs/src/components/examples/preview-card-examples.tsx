"use client"

import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
} from '@/components/ui/preview-card';

export function DefaultPreviewCardExample() {
  return (
    <PreviewCard>
      <PreviewCardTrigger href="#">
        Hover over this link
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Preview Card</h4>
          <p className="text-sm text-muted-foreground">
            This card appears on hover to show a preview of the linked content.
          </p>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}

export function PreviewCardWithImageExample() {
  return (
    <PreviewCard>
      <PreviewCardTrigger href="#">
        @dinachi
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              D
            </div>
            <div>
              <h4 className="text-sm font-semibold">Dinachi UI</h4>
              <p className="text-xs text-muted-foreground">@dinachi</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            A modern React component library built with Base UI and Tailwind CSS.
          </p>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}
