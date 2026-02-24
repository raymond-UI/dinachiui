import { Tile } from "./Tile";

export function ThemeableTile() {
  return (
    <Tile delay={0.1} className="h-full">
      <div className="pl-8 pb-4 pt-6">
        <h3 className="text-lg font-medium font-pixel mb-1">Themeable</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          OKLCH design tokens with CSS custom properties. Light and dark modes
          built-in.
        </p>
      </div>
      <div className="flex w-full pl-8 pt-5 h-full">
        <div className="w-full rounded-tl-md bg-muted border border-r-0 border-border overflow-hidden p-5 space-y-4">
          <div className="font-mono text-xs text-muted-foreground/60">
            @theme
          </div>
          <div className="space-y-3">
            {[
              { name: "--primary", color: "bg-primary" },
              { name: "--secondary", color: "bg-secondary" },
              { name: "--accent", color: "bg-accent" },
              { name: "--destructive", color: "bg-destructive" },
              { name: "--muted", color: "bg-muted-foreground/20" },
            ].map((token) => (
              <div key={token.name} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${token.color} border border-border/30 shrink-0`}
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {token.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tile>
  );
}
