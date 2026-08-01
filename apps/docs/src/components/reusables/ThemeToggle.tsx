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

export function ThemeToggle({ iconSize = "h-4 w-4" }: { iconSize?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Toggle theme" />;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
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
