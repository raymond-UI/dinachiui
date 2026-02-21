type ColorSwatchProps = {
  name: string;
  variable: string;
  preview: string;
};

export function ColorSwatch({ name, variable, preview }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
      <div
        className="w-8 h-8 rounded-lg shrink-0 border border-border/50"
        style={{ backgroundColor: preview }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{name}</p>
        <code className="text-xs text-muted-foreground">{variable}</code>
      </div>
    </div>
  );
}

type ColorGridProps = {
  children: React.ReactNode;
};

export function ColorGrid({ children }: ColorGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {children}
    </div>
  );
}
