type ComparisonGridProps = {
  children: React.ReactNode;
};

export function ComparisonGrid({ children }: ComparisonGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 my-4 [&>div]:space-y-2">
      {children}
    </div>
  );
}
