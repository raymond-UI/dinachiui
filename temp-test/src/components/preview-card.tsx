"use client"

import * as React from "react"
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card"
import { cn } from "@/lib/utils"


const PreviewCard = BasePreviewCard.Root

const PreviewCardTrigger = React.forwardRef<
  React.ComponentRef<typeof BasePreviewCard.Trigger>,
  React.ComponentProps<typeof BasePreviewCard.Trigger>
>(({ className, ...props }, ref) => (
  <BasePreviewCard.Trigger
    ref={ref}
    className={cn(
      "text-blue-600 no-underline decoration-blue-600/60 decoration-1 underline-offset-2 outline-none",
      "hover:underline focus-visible:rounded-sm focus-visible:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600",
      "data-[popup-open]:underline data-[popup-open]:focus-visible:no-underline",
      "dark:text-blue-400 dark:decoration-blue-400/60 dark:focus-visible:outline-blue-400",
      className
    )}
    {...props}
  />
))
PreviewCardTrigger.displayName = "PreviewCardTrigger"

const PreviewCardPortal = BasePreviewCard.Portal

const PreviewCardBackdrop = React.forwardRef<
  React.ComponentRef<typeof BasePreviewCard.Backdrop>,
  React.ComponentProps<typeof BasePreviewCard.Backdrop>
>(({ className, ...props }, ref) => (
  <BasePreviewCard.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-40",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      className
    )}
    {...props}
  />
))
PreviewCardBackdrop.displayName = "PreviewCardBackdrop"

const PreviewCardPositioner = React.forwardRef<
  React.ComponentRef<typeof BasePreviewCard.Positioner>,
  React.ComponentProps<typeof BasePreviewCard.Positioner>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <BasePreviewCard.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
))
PreviewCardPositioner.displayName = "PreviewCardPositioner"

const PreviewCardPopup = React.forwardRef<
  React.ComponentRef<typeof BasePreviewCard.Popup>,
  React.ComponentProps<typeof BasePreviewCard.Popup>
>(({ className, ...props }, ref) => (
  <BasePreviewCard.Popup
    ref={ref}
    className={cn(
      "flex w-[280px] origin-[var(--transform-origin)] flex-col gap-3 rounded-lg bg-secondary/80 p-4 shadow-lg shadow-secondary/20",
      "outline outline-1 outline-border",
      "transition-[transform,scale,opacity] duration-200",
      "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
      "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
      "bg-secondary/80 backdrop-blur-sm dark:shadow-none dark:-outline-offset-1",
      className
    )}
    {...props}
  />
))
PreviewCardPopup.displayName = "PreviewCardPopup"

const PreviewCardArrow = React.forwardRef<
  React.ComponentRef<typeof BasePreviewCard.Arrow>,
  React.ComponentProps<typeof BasePreviewCard.Arrow> & {
    children?: React.ReactNode
  }
>(({ className, children, ...props }, ref) => (
  <BasePreviewCard.Arrow
    ref={ref}
    className={cn(
      "data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90",
      "data-[side=right]:left-[-13px] data-[side=right]:-rotate-90",
      "data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180",
      className
    )}
    {...props}
  >
    {children || <PreviewCardArrowSvg />}
  </BasePreviewCard.Arrow>
))
PreviewCardArrow.displayName = "PreviewCardArrow"

const PreviewCardContent = React.forwardRef<
  React.ComponentRef<typeof BasePreviewCard.Popup>,
  React.ComponentProps<typeof BasePreviewCard.Popup>
>(({ className, children, ...props }, ref) => (
  <PreviewCardPortal>
    <PreviewCardPositioner>
      <PreviewCardPopup ref={ref} className={className} {...props}>
        <PreviewCardArrow />
        {children}
      </PreviewCardPopup>
    </PreviewCardPositioner>
  </PreviewCardPortal>
))
PreviewCardContent.displayName = "PreviewCardContent"

function PreviewCardArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
            className="fill-secondary"
        />
      
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="fill-border"
      />
    </svg>
  )
}

export {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardBackdrop,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
  PreviewCardContent,
  PreviewCardArrowSvg,
} 