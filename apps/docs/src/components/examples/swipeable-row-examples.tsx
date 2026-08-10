"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, Trash2 } from "lucide-react";
import { SwipeableRow, SwipeableRowGroup } from "@/components/ui/swipeable-row";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

const ROWS = [
  { id: "1", title: "Weekly digest", detail: "product@dinachi.dev · 09:04" },
  { id: "2", title: "Your invoice is ready", detail: "billing · yesterday" },
  { id: "3", title: "Re: motion tier scope", detail: "sam · Tuesday" },
];

function Body({ title, detail }: { title: string; detail: string }) {
  return (
    <>
      <p className="truncate text-sm font-medium text-foreground">{title}</p>
      <p className="truncate text-xs text-muted-foreground">{detail}</p>
    </>
  );
}

function useRows() {
  const [rows, setRows] = React.useState(ROWS);
  const remove = (id: string) => setRows((c) => c.filter((r) => r.id !== id));

  // In the header rather than under the list, and always there rather than only once the
  // list is empty: a control that appears when you have run out of rows arrives too late
  // to read as the way back.
  const reset = (
    <PreviewAction>
      <Button
        variant="outline"
        size="sm"
        disabled={rows.length === ROWS.length}
        onClick={() => setRows(ROWS)}
      >
        Bring them back
      </Button>
    </PreviewAction>
  );

  return { rows, remove, reset };
}

export function DefaultSwipeableRowExample() {
  const { rows, remove, reset } = useRows();

  return (
    <div className="w-full max-w-sm">
      {reset}
      <SwipeableRowGroup>
        <ul className="list-none space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map((row) => (
              <motion.li
                key={row.id}
                layout
                // A dismissed row has already travelled off the edge under the finger.
                // All that is left is closing the gap it held.
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              >
                <SwipeableRow
                  actions={[
                    {
                      label: `Archive ${row.title}`,
                      icon: <Archive className="h-4 w-4" />,
                      onSelect: () => remove(row.id),
                    },
                    {
                      label: `Delete ${row.title}`,
                      icon: <Trash2 className="h-4 w-4" />,
                      onSelect: () => remove(row.id),
                      destructive: true,
                    },
                  ]}
                  onDismiss={() => remove(row.id)}
                >
                  <Body title={row.title} detail={row.detail} />
                </SwipeableRow>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </SwipeableRowGroup>
    </div>
  );
}

export function SwipeableRowNoDismissExample() {
  const { rows, remove, reset } = useRows();

  return (
    <div className="w-full max-w-sm">
      {reset}
      <SwipeableRowGroup>
        <ul className="list-none space-y-2">
          {rows.map((row) => (
            <li key={row.id}>
              {/* No `onDismiss`, so the row only ever opens. Arming a threshold that
                  leads nowhere is a promise the row cannot keep. */}
              <SwipeableRow
                actions={[
                  {
                    label: `Archive ${row.title}`,
                    icon: <Archive className="h-4 w-4" />,
                    onSelect: () => remove(row.id),
                  },
                ]}
              >
                <Body title={row.title} detail={row.detail} />
              </SwipeableRow>
            </li>
          ))}
        </ul>
      </SwipeableRowGroup>
    </div>
  );
}

export function SwipeableRowKeyboardExample() {
  const { rows, remove, reset } = useRows();

  return (
    <div className="w-full max-w-sm">
      {reset}
      <SwipeableRowGroup>
        <ul className="list-none space-y-2">
          {rows.map((row) => (
            <li key={row.id}>
              <SwipeableRow
                actions={[
                  {
                    label: `Archive ${row.title}`,
                    icon: <Archive className="h-4 w-4" />,
                    onSelect: () => remove(row.id),
                  },
                  {
                    label: `Delete ${row.title}`,
                    icon: <Trash2 className="h-4 w-4" />,
                    onSelect: () => remove(row.id),
                    destructive: true,
                  },
                ]}
              >
                <Body title={row.title} detail={row.detail} />
              </SwipeableRow>
            </li>
          ))}
        </ul>
      </SwipeableRowGroup>
    </div>
  );
}
