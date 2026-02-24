import { type HTMLAttributes, type ReactNode, Children, isValidElement } from "react";
import { CopyButton } from "./CopyButton";

type CodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  "data-language"?: string;
  "data-theme"?: string;
};

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  if (Array.isArray(node)) {
    return Children.toArray(node).map(extractText).join("");
  }
  return "";
}

export function CodeBlock({
  className,
  children,
  "data-language": language,
  ...props
}: CodeBlockProps) {
  const text = extractText(children).replace(/\n$/, "");

  return (
    <div className="group relative my-5">
      {language && (
        <div className="absolute right-3 top-2 z-10 text-xs text-muted-foreground transition-opacity group-hover:opacity-0">
          {language}
        </div>
      )}
      <CopyButton text={text} />
      <pre
        className={`overflow-x-auto rounded-xl border border-border bg-muted p-4 text-sm font-pixel ${className ?? ""}`}
        {...props}
        style={{
          ...props.style,
          backgroundColor: undefined,
        }}
      >
        {children}
      </pre>
    </div>
  );
}
