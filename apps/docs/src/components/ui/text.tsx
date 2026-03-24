"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      lead: "text-xl text-muted-foreground",
      muted: "text-sm text-muted-foreground",
      blockquote: "border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      span: "",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

type Variant = NonNullable<VariantProps<typeof textVariants>["variant"]>

const variantElementMap: Record<Variant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  large: "p",
  small: "p",
  lead: "p",
  muted: "p",
  blockquote: "blockquote",
  code: "code",
  span: "span",
}

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant = "p", as, children, ...props }, ref) => {
    const Component = as ?? variantElementMap[variant!]

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant }), className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Text.displayName = "Text"

export { Text, textVariants }
