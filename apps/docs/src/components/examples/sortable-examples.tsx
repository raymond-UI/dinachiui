"use client";

import * as React from "react";
import { Sortable, SortableItem, SortableHandle } from "@/components/ui/sortable";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

const PAGES: Record<string, { title: string; path: string }> = {
  overview: { title: "Overview", path: "/docs" },
  install: { title: "Installation", path: "/docs/installation" },
  components: { title: "Components", path: "/docs/components" },
  cli: { title: "CLI", path: "/docs/cli" },
};

const INITIAL = ["overview", "install", "components", "cli"];

function useOrder() {
  const [order, setOrder] = React.useState(INITIAL);

  const reset = (
    <PreviewAction>
      <Button
        variant="outline"
        size="sm"
        disabled={order.join() === INITIAL.join()}
        onClick={() => setOrder(INITIAL)}
      >
        Reset
      </Button>
    </PreviewAction>
  );

  return { order, setOrder, reset };
}

export function DefaultSortableExample() {
  const { order, setOrder, reset } = useOrder();

  return (
    <div className="w-full max-w-sm">
      {reset}
      <Sortable value={order} onValueChange={setOrder}>
        {order.map((id) => (
          <SortableItem key={id} id={id} label={PAGES[id].title}>
            <SortableHandle />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {PAGES[id].title}
              </p>
              <p className="truncate text-xs text-muted-foreground">{PAGES[id].path}</p>
            </div>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}

export function SortableKeyboardExample() {
  const { order, setOrder, reset } = useOrder();

  return (
    <div className="w-full max-w-sm">
      {reset}
      <Sortable value={order} onValueChange={setOrder}>
        {order.map((id) => (
          <SortableItem key={id} id={id} label={PAGES[id].title}>
            <SortableHandle />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {PAGES[id].title}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
              {order.indexOf(id) + 1}
            </span>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}

export function SortableCustomHandleExample() {
  const { order, setOrder, reset } = useOrder();

  return (
    <div className="w-full max-w-sm">
      {reset}
      <Sortable value={order} onValueChange={setOrder}>
        {order.map((id) => (
          <SortableItem key={id} id={id} label={PAGES[id].title}>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {PAGES[id].title}
            </span>
            {/* The handle is a button with your contents inside it. Where it sits in the
                row is a layout decision, not the component's. */}
            <SortableHandle className="shrink-0 px-2 text-xs font-medium">
              Move
            </SortableHandle>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}
