"use client"

import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export function DefaultScrollAreaExample() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag) => (
              <div key={tag}>
                <div className="text-sm">{tag}</div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
}

export function HorizontalScrollAreaExample() {
  const items = Array.from({ length: 20 }).map((_, i) => ({
    title: `Item ${i + 1}`,
    color: `hsl(${i * 18}, 70%, 80%)`,
  }));

  return (
    <ScrollArea className="w-full max-w-md rounded-md border">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <div className="flex gap-3 p-4">
            {items.map((item) => (
              <div
                key={item.title}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md text-xs font-medium"
                style={{ backgroundColor: item.color }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
}
