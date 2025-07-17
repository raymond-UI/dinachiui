import React from "react";

interface RequirementItemProps {
  title: string;
  version: string;
  description: string;
}

export const RequirementItem = ({
  title,
  version,
  description,
}: RequirementItemProps) => (
  <div className="flex items-start gap-3 p-3 bg-muted/20 backdrop-blur-sm border border-border rounded-lg">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-accent-foreground bg-muted px-2 py-0.5 rounded">
          {version}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);
