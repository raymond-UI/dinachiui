import type { HTMLAttributes } from "react";

type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  "data-language"?: string;
  "data-theme"?: string;
};

export function CodeBlock({
  className,
  children,
  "data-language": language,
  ...props
}: CodeBlockProps) {
  return (
    <div className="group relative">
      {language && (
        <div className="absolute right-3 top-2 z-10 text-xs text-muted-foreground">
          {language}
        </div>
      )}
      <pre
        className={`overflow-x-auto rounded-xl border border-primary/20 p-4 text-sm ${className ?? ""}`}
        {...props}
        style={{
          ...props.style,
          backgroundColor: "black",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
