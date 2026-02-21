import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { isValidElement } from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return extractText(children.props.children);
  }
  return "";
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as: "h2" | "h3" | "h4";
  children: ReactNode;
};

function Heading({ as: Tag, children, className, ...props }: HeadingProps) {
  const text = extractText(children);
  const id = slugify(text);

  const sizeClasses = {
    h2: "text-2xl mt-12 mb-4",
    h3: "text-xl mt-8 mb-3",
    h4: "text-lg mt-6 mb-2",
  };

  return (
    <Tag
      id={id}
      className={`group relative font-semibold tracking-tight scroll-mt-20 ${sizeClasses[Tag]} ${className ?? ""}`}
      {...props}
    >
      <Link
        href={`#${id}`}
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label={`Link to ${text}`}
      >
        <span className="text-muted-foreground hover:text-foreground">#</span>
      </Link>
      {children}
    </Tag>
  );
}

export function H2(props: Omit<HeadingProps, "as">) {
  return <Heading as="h2" {...props} />;
}

export function H3(props: Omit<HeadingProps, "as">) {
  return <Heading as="h3" {...props} />;
}

export function H4(props: Omit<HeadingProps, "as">) {
  return <Heading as="h4" {...props} />;
}
