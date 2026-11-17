import type { ReactNode } from "react";

type StepsProps = {
  children: ReactNode;
};

/** A rail with numbered dots on wider screens. On a phone the rail would eat the width
 * the code needs, so each step becomes a numbered section instead. */
export function Steps({ children }: StepsProps) {
  return (
    <div className="my-6 flex w-auto flex-col [counter-reset:step] sm:ml-4 sm:gap-2 sm:border-l-2 sm:border-border sm:pl-6">
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
    <div className="relative [counter-increment:step] max-sm:border-t max-sm:border-border max-sm:py-6 max-sm:first:border-t-0 max-sm:first:pt-0 sm:pb-8 sm:last:pb-0">
      <div className="absolute -left-[calc(2.3rem)] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground before:content-[counter(step)] max-sm:hidden" />
      <h4 className="mb-2 flex items-baseline gap-2.5 font-semibold text-foreground max-sm:text-[17px]">
        <span className="font-mono text-xs font-normal text-muted-foreground before:content-[counter(step,decimal-leading-zero)] sm:hidden" />
        {title}
      </h4>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
