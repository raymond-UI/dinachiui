"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@dinachi/core"

const linkVariants = cva(
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "text-primary underline underline-offset-4 hover:text-primary/80",
        muted:
          "text-muted-foreground underline underline-offset-4 hover:text-foreground",
        plain: "text-foreground hover:text-primary",
        unstyled: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /** Render as a different element (e.g., Next.js Link, React Router Link).
   *  Accepts a ReactElement or a render function `(props, state) => ReactElement`. */
  render?: useRender.RenderProp
  /** Show external link indicator and add target="_blank" */
  external?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant, render, external, children, rel, target, ...props },
    ref
  ) => {
    const externalProps = external
      ? {
          target: target ?? ("_blank" as const),
          rel: rel ?? "noopener noreferrer",
        }
      : { target, rel }

    const content = (
      <>
        {children}
        {external && (
          <>
            <svg
              className="inline-block h-3 w-3 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </>
    )

    return useRender({
      defaultTagName: 'a',
      render,
      ref,
      props: {
        className: cn(
          linkVariants({ variant }),
          external && "inline-flex items-center gap-1",
          className
        ),
        ...externalProps,
        ...props,
        children: content,
      },
    })
  }
)

Link.displayName = "Link"

export { Link, linkVariants }
