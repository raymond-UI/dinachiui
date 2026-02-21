import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type DocCardProps = {
  title: string;
  href?: string;
  description?: string;
  children?: React.ReactNode;
};

export function DocCard({ title, href, description, children }: DocCardProps) {
  const card = (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}

type DocCardGridProps = {
  cols?: number;
  children: React.ReactNode;
};

export function DocCardGrid({ cols = 3, children }: DocCardGridProps) {
  const gridCols =
    cols === 2
      ? "grid-cols-1 md:grid-cols-2"
      : cols === 4
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 md:grid-cols-3";

  return <div className={`grid ${gridCols} gap-4 my-6`}>{children}</div>;
}
