"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ToastList, ToastProvider, ToastViewport, createToastManager } from "@/components/ui/toast";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { type: "success" | "error" | "warning" | "loading"; title: string; description: string; timeout: number };

// The agent reads only the stage, so the stack sits in the stage's corner rather than a portal.
const STAGE_CORNER = "absolute bottom-4 right-4 sm:bottom-4 sm:right-4 sm:w-[280px]";

function Demo({ values: v, anatomy }: DemoProps<V>) {
  const [manager] = React.useState(() => createToastManager());
  const open = React.useRef(new Set<string>());
  const pinned = React.useRef<string | null>(null);
  const first = React.useRef(true);
  const opts = { title: v.title, description: v.description, type: v.type };
  const show = (extra?: { timeout: number }) => {
    let id = "";
    id = manager.add({ ...opts, ...extra, onClose: () => open.current.delete(id) });
    open.current.add(id);
    return id;
  };

  // A changed control shows on the open toasts, or on a fresh one when none is open.
  React.useEffect(() => {
    if (first.current) return void (first.current = false);
    if (open.current.size) for (const id of open.current) manager.update(id, opts);
    else show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager, v.title, v.description, v.type]);

  React.useEffect(() => {
    if (anatomy) {
      pinned.current = show({ timeout: 0 });
      return;
    }
    if (pinned.current) manager.close(pinned.current);
    pinned.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anatomy, manager]);

  return (
    <ToastProvider toastManager={manager} timeout={v.timeout}>
      <Button onClick={() => show()}>Show toast</Button>
      <ToastViewport className={STAGE_CORNER}>
        <ToastList />
      </ToastViewport>
    </ToastProvider>
  );
}

const str = (s: string) => JSON.stringify(s);

function code(v: V): string {
  return [
    `import { ToastList, ToastPortal, ToastProvider, ToastViewport, createToastManager } from "@/components/ui/toast"`,
    `import { Button } from "@/components/ui/button"`,
    "",
    "const toastManager = createToastManager()",
    "",
    "export function SendMessage() {",
    "  const showToast = () => {",
    "    toastManager.add({",
    `      title: ${str(v.title)},`,
    `      description: ${str(v.description)},`,
    `      type: "${v.type}",`,
    "    })",
    "  }",
    "",
    "  return (",
    `    <ToastProvider toastManager={toastManager}${v.timeout !== 5000 ? ` timeout={${v.timeout}}` : ""}>`,
    "      <Button onClick={showToast}>Show toast</Button>",
    "      <ToastPortal>",
    "        <ToastViewport>",
    "          <ToastList />",
    "        </ToastViewport>",
    "      </ToastPortal>",
    "    </ToastProvider>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "send-message.tsx",
  controls: [
    { name: "type", type: "select", options: ["success", "error", "warning", "loading"], default: "success" },
    { name: "title", type: "text", default: "Success" },
    { name: "description", type: "text", default: "Your message has been sent successfully." },
    { name: "timeout", type: "number", default: 5000, min: 0, max: 20000, step: 1000 },
  ],
  tries: [
    { label: "Press Show toast", action: "press", target: "Show toast" },
    { label: "Dismiss", action: "dismiss" },
  ],
  Demo,
  code,
});
