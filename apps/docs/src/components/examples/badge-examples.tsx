"use client"

import { Badge } from '@/components/ui/badge';

export function DefaultBadgeExample() {
  return <Badge>Badge</Badge>;
}

export function BadgeVariantsExample() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  );
}

export function BadgeSizesExample() {
  return (
    <div className="flex gap-2 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}
