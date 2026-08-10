import * as React from "react"
import { Button as BaseButton } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@dinachi/core"

const buttonVariants = cva(
  [
    "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md text-sm font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    // `transform` and `scale` are both named because Tailwind 3 compiles scale-* into
    // `transform` while Tailwind 4 compiles it into `scale`, and a copied component has
    // no say in which major its project runs.
    "transition-[color,background-color,border-color,transform,scale] duration-[var(--motion-duration-fast,150ms)]",
    // The button gives way under the press and comes back when released. 0.97 is small
    // enough to read as the surface yielding rather than the button resizing.
    "active:scale-[0.97]",
    // Faster down than up: the press is the system answering the user, the release is
    // the button settling. Equal timings in both directions read as mushy.
    "active:duration-100",
    // The colour change on hover and press already carries the feedback, so dropping
    // the movement costs nothing.
    "motion-reduce:active:scale-100",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // A run of text is not a surface, so there is nothing to press into.
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'className'>,
    VariantProps<typeof buttonVariants> {
  className?: string
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant, size, render, nativeButton, ...props }, ref) => {
    return (
      <BaseButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        render={render}
        nativeButton={render ? (nativeButton ?? false) : nativeButton}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
