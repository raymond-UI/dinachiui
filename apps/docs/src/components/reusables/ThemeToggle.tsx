"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle({
  iconSize = "h-4 w-4",
  className = "h-9 w-9",
  variant = "outline",
}: {
  iconSize?: string;
  className?: string;
  variant?: "outline" | "ghost";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return <Button variant={variant} size="icon" className={className} aria-label="Toggle theme" />;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={variant}
            size="icon"
            className={className}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          />
        }
      >
        {resolvedTheme === "dark" ? (
          <Sun className={iconSize} />
        ) : (
          <Moon className={iconSize} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
