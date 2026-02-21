'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { useRender } from '@base-ui/react/use-render'
import { cn } from "@dinachi/core"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-yellow-900 hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

type BadgeElement = React.ComponentRef<"div">

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof badgeVariants> {
  /**
   * The content of the badge
   */
  children?: React.ReactNode
  /**
   * Custom render prop for composition
   */
  render?: React.ReactElement
  /**
   * Whether the badge should be interactive (clickable)
   */
  interactive?: boolean
  /**
   * Icon to display before the content
   */
  icon?: React.ReactNode
  /**
   * Whether to show a close button
   */
  dismissible?: boolean
  /**
   * Callback when close button is clicked
   */
  onDismiss?: () => void
}

const Badge = React.forwardRef<BadgeElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    children,
    render = <div />,
    interactive = false,
    icon,
    dismissible = false,
    onDismiss,
    onClick,
    ...props 
  }, ref) => {
    // Handle keyboard interaction for dismissible badges
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (dismissible && onDismiss && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault()
        onDismiss()
      }
    }, [dismissible, onDismiss])

    // Handle click for interactive badges
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && onClick) {
        onClick(event)
      }
    }, [interactive, onClick])

    // Compute classes once
    const badgeClasses = React.useMemo(() => 
      cn(
        badgeVariants({ variant, size, rounded }),
        {
          'cursor-pointer hover:opacity-80': interactive,
          'focus:ring-2 focus:ring-offset-2': interactive || dismissible,
        },
        className
      ), 
      [variant, size, rounded, interactive, dismissible, className]
    )

    const content = (
      <>
        {icon && <span className="mr-1 shrink-0">{icon}</span>}
        {children}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-1 shrink-0 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-black/20"
            aria-label="Remove badge"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </>
    )

    return useRender({
      render: React.cloneElement(render, {
        ref,
        className: badgeClasses,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        tabIndex: interactive || dismissible ? 0 : undefined,
        role: interactive ? 'button' : dismissible ? 'button' : undefined,
        'aria-label': interactive ? 'Interactive badge' : dismissible ? 'Dismissible badge' : undefined,
        ...props,
      }),
      props: {
        children: content,
      },
    })
  }
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }