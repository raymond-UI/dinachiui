import Link from "next/link";
import type { ReactNode } from "react";

type MdxLinkProps = {
  href?: string;
  children?: ReactNode;
  className?: string;
};

export function MdxLink({ href, children, className }: MdxLinkProps) {
  if (!href) {
    return (
      <a className={`underline underline-offset-4 ${className ?? ""}`}>
        {children}
      </a>
    );
  }

  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`underline underline-offset-4 ${className ?? ""}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`underline underline-offset-4 ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
