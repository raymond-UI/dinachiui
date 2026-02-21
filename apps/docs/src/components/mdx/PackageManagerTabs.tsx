"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
type PM = (typeof MANAGERS)[number];

type ShorthandProps = {
  type: "exec" | "install" | "run" | "global";
  command: string;
};

type ExplicitProps = {
  npm: string;
  pnpm: string;
  yarn: string;
  bun: string;
};

type PackageManagerTabsProps = ShorthandProps | ExplicitProps;

function generateCommands(
  type: ShorthandProps["type"],
  command: string,
): Record<PM, string> {
  switch (type) {
    case "exec":
      return {
        npm: `npx ${command}`,
        pnpm: `pnpm dlx ${command}`,
        yarn: `npx ${command}`,
        bun: `bunx ${command}`,
      };
    case "install":
      return {
        npm: `npm install ${command}`,
        pnpm: `pnpm add ${command}`,
        yarn: `yarn add ${command}`,
        bun: `bun add ${command}`,
      };
    case "run":
      return {
        npm: `npm run ${command}`,
        pnpm: `pnpm ${command}`,
        yarn: `yarn ${command}`,
        bun: `bun ${command}`,
      };
    case "global":
      return {
        npm: `npm install -g ${command}`,
        pnpm: `pnpm add -g ${command}`,
        yarn: `yarn global add ${command}`,
        bun: `bun add -g ${command}`,
      };
  }
}

function isExplicit(props: PackageManagerTabsProps): props is ExplicitProps {
  return "npm" in props;
}

export function PackageManagerTabs(props: PackageManagerTabsProps) {
  const [active, setActive] = useState<PM>("npm");
  const [copied, setCopied] = useState(false);

  const commands: Record<PM, string> = isExplicit(props)
    ? { npm: props.npm, pnpm: props.pnpm, yarn: props.yarn, bun: props.bun }
    : generateCommands(props.type, props.command);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4">
      <div className="flex items-center border-b border-border">
        {MANAGERS.map((pm) => (
          <button
            key={pm}
            onClick={() => setActive(pm)}
            className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
              active === pm
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {pm}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 rounded-b-xl border border-t-0 border-border bg-muted px-4 py-3">
        <code className="text-sm text-foreground font-mono">
          {commands[active]}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
