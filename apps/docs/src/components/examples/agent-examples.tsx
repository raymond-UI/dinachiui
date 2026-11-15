"use client";

import { useState } from "react";
import {
  AgentProvider,
  isAgentChange,
  useAgent,
  type AgentActResult,
  type AgentComponent,
} from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const regions = { us: "United States", eu: "Europe", ap: "Asia Pacific" };

export function AgentBridgeExample() {
  const [log, setLog] = useState<string>("");
  const [changedBy, setChangedBy] = useState<string>("");
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  // Scoped to the demo, so the agent does not also see the docs site around it.
  const agent = useAgent({ root: root ?? undefined });

  const show = (value: AgentComponent[] | AgentActResult) =>
    setLog(JSON.stringify(value, null, 2));

  return (
    <AgentProvider agent={agent}>
      <div className="grid w-full max-w-2xl gap-6 md:grid-cols-2">
        <div className="space-y-4" ref={setRoot}>
          <div className="space-y-2">
            <label htmlFor="agent-project" className="text-sm font-medium">
              Project name
            </label>
            <Input id="agent-project" defaultValue="Apollo" />
          </div>
          <div className="space-y-2">
            <Select
              items={regions}
              defaultValue="us"
              onValueChange={(_, details) =>
                setChangedBy(isAgentChange(details) ? "the agent" : "you")
              }
            >
              <SelectFieldLabel>Region</SelectFieldLabel>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(regions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {changedBy && (
              <p className="text-xs text-muted-foreground">
                Region last changed by {changedBy}.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2" data-agent-hidden>
            <Button
              variant="outline"
              size="sm"
              onClick={() => show(agent.snapshot())}
            >
              Snapshot
            </Button>
            <Button
              size="sm"
              onClick={async () =>
                show(
                  await agent.act({
                    steps: [
                      {
                        ref: "Project name",
                        action: "setValue",
                        args: ["Atlas"],
                      },
                      { ref: "Region", action: "select", args: ["Europe"] },
                    ],
                  }),
                )
              }
            >
              Run agent steps
            </Button>
          </div>
        </div>
        <pre
          className="max-h-72 overflow-auto rounded-md border bg-muted/40 p-3 text-xs"
          data-agent-hidden
        >
          {log || "Press Snapshot to see what an agent sees."}
        </pre>
      </div>
    </AgentProvider>
  );
}
