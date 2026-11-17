"use client";

import { isAgentChange } from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  DialogTitle: string;
  DialogDescription: boolean;
  DialogClose: boolean;
  modal: boolean;
  disablePointerDismissal: boolean;
};

const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

// The dialog stays closed in Anatomy: open, it would cover the page and trap focus.
function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <Dialog
      modal={v.modal}
      disablePointerDismissal={v.disablePointerDismissal}
      onOpenChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      <DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{v.DialogTitle}</DialogTitle>
          {v.DialogDescription && (
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="pg-dialog-name" className="text-sm font-medium">Name</label>
            <input id="pg-dialog-name" defaultValue="John Doe" className={field} />
          </div>
          <div className="space-y-2">
            <label htmlFor="pg-dialog-username" className="text-sm font-medium">Username</label>
            <input id="pg-dialog-username" defaultValue="@johndoe" className={field} />
          </div>
        </div>
        <DialogFooter>
          {v.DialogClose && <DialogClose>Cancel</DialogClose>}
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Dialog", "DialogContent", "DialogFooter", "DialogHeader", "DialogTitle", "DialogTrigger"];
  if (v.DialogDescription) parts.push("DialogDescription");
  if (v.DialogClose) parts.push("DialogClose");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { Button } from "@/components/ui/button"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/dialog"`);
  L.push("", "export function EditProfile() {", "  return (");
  const rootProps: string[] = [];
  if (!v.modal) rootProps.push("modal={false}");
  if (v.disablePointerDismissal) rootProps.push("disablePointerDismissal");
  if (refuse) {
    L.push("    <Dialog");
    rootProps.forEach((p) => L.push(`      ${p}`));
    L.push("      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Dialog${rootProps.map((p) => " " + p).join("")}>`);
  }
  L.push("      <DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>");
  L.push("      <DialogContent>", "        <DialogHeader>");
  L.push(`          <DialogTitle>${v.DialogTitle}</DialogTitle>`);
  if (v.DialogDescription) {
    L.push("          <DialogDescription>", "            Make changes to your profile here. Click save when you're done.", "          </DialogDescription>");
  }
  L.push("        </DialogHeader>");
  L.push('        <div className="space-y-4 py-4">');
  for (const [id, label, value] of [["name", "Name", "John Doe"], ["username", "Username", "@johndoe"]]) {
    L.push('          <div className="space-y-2">');
    L.push(`            <label htmlFor="${id}" className="text-sm font-medium">${label}</label>`);
    L.push(`            <input id="${id}" defaultValue="${value}" className="${field}" />`);
    L.push("          </div>");
  }
  L.push("        </div>", "        <DialogFooter>");
  if (v.DialogClose) L.push("          <DialogClose>Cancel</DialogClose>");
  L.push("          <Button>Save changes</Button>", "        </DialogFooter>", "      </DialogContent>", "    </Dialog>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "edit-profile.tsx",
  refusable: true,
  controls: [
    { name: "DialogTitle", type: "text", default: "Edit profile" },
    { name: "DialogDescription", type: "boolean", default: true },
    { name: "DialogClose", type: "boolean", default: true },
    { name: "modal", type: "boolean", default: true },
    { name: "disablePointerDismissal", type: "boolean", default: false },
  ],
  tries: [{ label: "Open", action: "open" }],
  Demo,
  code,
});
