"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { cn } from "@/lib/utils";

// Provider Component
const TooltipProvider = BaseTooltip.Provider;

// Root Component
const Tooltip = BaseTooltip.Root;

// Trigger Component with Base UI's native render prop support
interface TooltipTriggerProps
  extends React.ComponentProps<typeof BaseTooltip.Trigger> {
  variant?: "default" | "ghost" | "outline" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
}

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof BaseTooltip.Trigger>,
  TooltipTriggerProps
>(
  (
    { className, variant = "ghost", size = "default", render, ...props },
    ref
  ) => {
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      icon: "bg-transparent hover:bg-transparent rounded-full w-fit h-fit",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "size-auto",
    };

    const triggerClassName = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    return (
      <BaseTooltip.Trigger
        ref={ref}
        className={triggerClassName}
        render={render}
        {...props}
      />
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

// Portal Component
const TooltipPortal = BaseTooltip.Portal;

// Positioner Component
const TooltipPositioner = React.forwardRef<
  React.ElementRef<typeof BaseTooltip.Positioner>,
  React.ComponentProps<typeof BaseTooltip.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <BaseTooltip.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
));
TooltipPositioner.displayName = "TooltipPositioner";

// Popup Component with variant support
interface TooltipPopupProps
  extends React.ComponentProps<typeof BaseTooltip.Popup> {
  variant?: "default" | "inverse";
}

const TooltipPopup = React.forwardRef<
  React.ElementRef<typeof BaseTooltip.Popup>,
  TooltipPopupProps
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-popover text-popover-foreground border border-border",
    inverse: "bg-primary text-primary-foreground",
  };

  return (
    <BaseTooltip.Popup
      ref={ref}
      className={cn(
        "origin-[var(--transform-origin)] rounded-md px-3 py-1.5 text-sm shadow-md",
        "transition-[transform,scale,opacity] duration-200",
        "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});
TooltipPopup.displayName = "TooltipPopup";

// Arrow Component with custom SVG
const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof BaseTooltip.Arrow>,
  React.ComponentProps<typeof BaseTooltip.Arrow> & {
    children?: React.ReactNode;
    variant?: "default" | "inverse";
  }
>(({ className, children, variant = "default", ...props }, ref) => (
  <BaseTooltip.Arrow
    ref={ref}
    className={cn(
      "data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90",
      "data-[side=right]:left-[-13px] data-[side=right]:-rotate-90",
      "data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180",
      className
    )}
    {...props}
  >
    {children || <TooltipArrowSvg variant={variant} />}
  </BaseTooltip.Arrow>
));
TooltipArrow.displayName = "TooltipArrow";

// Combined Content Component for easier usage
interface TooltipContentProps extends TooltipPopupProps {
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  showArrow?: boolean;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof BaseTooltip.Popup>,
  TooltipContentProps
>(
  (
    {
      className,
      children,
      sideOffset = 4,
      side = "top",
      align = "center",
      showArrow = true,
      variant = "default",
      ...props
    },
    ref
  ) => (
    <TooltipPortal>
      <TooltipPositioner sideOffset={sideOffset} side={side} align={align}>
        <TooltipPopup
          ref={ref}
          className={className}
          variant={variant}
          {...props}
        >
          {showArrow && <TooltipArrow variant={variant} />}
          {children}
        </TooltipPopup>
      </TooltipPositioner>
    </TooltipPortal>
  )
);
TooltipContent.displayName = "TooltipContent";

// Optimized Arrow SVG Component
const TooltipArrowSvg = React.memo(
  ({
    variant = "default",
    ...props
  }: React.ComponentProps<"svg"> & { variant?: "default" | "inverse" }) => {
    const fillClasses = variant === "inverse" ? "fill-primary" : "fill-popover";

    const borderClasses =
      variant === "inverse" ? "fill-primary" : "fill-border";

    return (
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
        <path
          d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
          className={fillClasses}
        />
        <path
          d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
          className={borderClasses}
        />
      </svg>
    );
  }
);
TooltipArrowSvg.displayName = "TooltipArrowSvg";

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
  TooltipContent,
  TooltipArrowSvg,
};
