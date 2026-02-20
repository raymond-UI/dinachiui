import type { ReactNode } from "react";

type StepsProps = {
  children: ReactNode;
};

export function Steps({ children }: StepsProps) {
  return (
    <div className="my-6 ml-4 flex flex-col gap-2 border-l-2 border-border pl-6 [counter-reset:step]">
      {children}
    </div>
  );
}

type StepProps = {
  title: string;
  children: ReactNode;
};

export function Step({ title, children }: StepProps) {
  return (
    <div className="relative pb-8 last:pb-0 [counter-increment:step]">
      <div className="absolute -left-[calc(2.3rem)] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground before:content-[counter(step)]" />
      <h4 className="mb-2 font-semibold text-foreground">{title}</h4>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
