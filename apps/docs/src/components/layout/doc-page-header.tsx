"use client";

import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";

interface DocPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const formatOptions = [
  { value: null, label: "Open in:" },
  { value: "markdown", label: "Claude" },
  { value: "html", label: "ChatGPT" },
  { value: "react", label: "Gemini" },
];

export default function DocPageHeader({
  title = "Page Title",
  description = "Page Description",
  action,
  className,
  children,
}: DocPageHeaderProps) {
  return (
    <div
      className={cn(
        "w-full p-6 pt-12 bg-radial from-accent/5 to-muted/5 backdrop-blur-xs border-[0.5px] border-r-0 border-accent",
        className
      )}
    >
      <div className="flex flex-col gap-2 text- mb-12">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-pretty">{description}</p>
        {action && action}
        <div className="flex  items-center gap-2">
          <Button variant="outline" >
            <Copy className="size-4" />
            Copy as Markdown
          </Button>
          <Select>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {children}
    </div>
  );
}
