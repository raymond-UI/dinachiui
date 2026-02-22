"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

// Toast Provider
const ToastProvider = BaseToast.Provider;

// Toast Viewport
const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToast.Viewport>
>(({ className, ...props }, ref) => (
  <BaseToast.Viewport
    ref={ref}
    className={cn(
      "fixed z-10 top-auto right-4 bottom-4 mx-auto flex w-[250px] sm:right-8 sm:bottom-8 sm:w-[300px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

// Toast Portal
const ToastPortal: typeof BaseToast.Portal = BaseToast.Portal;

// Toast variants for different types
const toastVariants = cva(
  [
    // CSS variables for stacking
    "[--gap:1rem] [--peek:0.75rem]",
    "[--scale:calc(max(0,1-(var(--toast-index)*0.1)))]",
    "[--shrink:calc(1-var(--scale))]",
    "[--height:var(--toast-frontmost-height,var(--toast-height))]",
    "[--offset-y:calc(var(--toast-offset-y)*-1+(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
    // Positioning
    "absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 w-full",
    // Transform (collapsed stacking with peek/shrink)
    "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
    // Height management (collapse to frontmost height)
    "h-[var(--height)]",
    // Appearance
    "origin-bottom cursor-default rounded-lg border bg-clip-padding bg-background p-4 shadow-lg select-none",
    // Transition (includes height for expand/collapse animation)
    "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
    // Gap pseudo-element for hover detection between stacked toasts
    "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
    // Ending style (fade out)
    "data-[ending-style]:opacity-0",
    // Expanded state (full height, offset positioning)
    "data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
    "data-[expanded]:h-[var(--toast-height)]",
    // Limited (exceeded limit)
    "data-[limited]:opacity-0",
    // Starting style (enter from below)
    "data-[starting-style]:[transform:translateY(150%)]",
    // Default ending style (slide out, but not when limited or swiped)
    "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
    // Swipe direction ending styles
    "data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
    "data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
    "data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
    "data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
    "data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
    "data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
    "data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
    "data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        destructive:
          "border-destructive border-l-4 bg-background text-foreground",
        success: "border-success border-l-4 bg-background text-foreground",
        warning: "border-warning border-l-4 bg-background text-foreground",
        loading:
          "border-primary/50 border-l-4 bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof BaseToast.Root>,
    VariantProps<typeof toastVariants> {}

// Toast Root
const ToastRoot = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, ...props }, ref) => (
    <BaseToast.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
);
ToastRoot.displayName = "ToastRoot";

// Toast Title
const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<typeof BaseToast.Title>
>(({ className, ...props }, ref) => (
  <BaseToast.Title
    ref={ref}
    className={cn("text-[0.975rem] leading-5 font-medium", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

// Toast Description
const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<typeof BaseToast.Description>
>(({ className, ...props }, ref) => (
  <BaseToast.Description
    ref={ref}
    className={cn("text-[0.925rem] leading-5 opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

// Toast Content (clips overflow for stacking, handles behind/expanded states)
const ToastContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToast.Content>
>(({ className, ...props }, ref) => (
  <BaseToast.Content
    ref={ref}
    className={cn(
      "overflow-hidden transition-opacity [transition-duration:250ms]",
      "data-[behind]:pointer-events-none data-[behind]:opacity-0",
      "data-[expanded]:pointer-events-auto data-[expanded]:opacity-100",
      className
    )}
    {...props}
  />
));
ToastContent.displayName = "ToastContent";

// Toast Action
const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseToast.Action>
>(({ className, ...props }, ref) => (
  <BaseToast.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors",
      "hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

// Toast Close
const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseToast.Close>
>(({ className, ...props }, ref) => (
  <BaseToast.Close
    ref={ref}
    className={cn(
      "absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded border-none bg-transparent opacity-60 transition-opacity",
      "hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:pointer-events-none",
      className
    )}
    {...props}
  />
));
ToastClose.displayName = "ToastClose";

// Hook for using toast manager
const useToastManager = BaseToast.useToastManager;

// Create toast manager for global usage
const createToastManager = BaseToast.createToastManager;

// Helper function to get variant from toast type
function getVariantFromType(
  type?: string
): VariantProps<typeof toastVariants>["variant"] {
  switch (type) {
    case "success":
      return "success";
    case "error":
      return "destructive";
    case "warning":
      return "warning";
    case "loading":
      return "loading";
    default:
      return "default";
  }
}

// Default ToastList component for easy usage
// Returns toast roots directly without a wrapper — Base UI requires
// Toast.Root elements as direct children of Toast.Viewport.
function ToastList() {
  const { toasts } = useToastManager();

  return toasts.map((toast) => (
    <ToastRoot
      key={toast.id}
      toast={toast}
      variant={getVariantFromType(toast.type)}
      swipeDirection={["down", "right"]}
    >
      <ToastContent>
        <div className="grid gap-1">
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && (
            <ToastDescription>{toast.description}</ToastDescription>
          )}
        </div>
        {toast.actionProps && <ToastAction {...toast.actionProps} />}
        <ToastClose aria-label="Close">
          <X className="h-4 w-4" />
        </ToastClose>
      </ToastContent>
    </ToastRoot>
  ));
}

// X Icon component
const X = React.forwardRef<SVGSVGElement, React.ComponentProps<"svg">>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
);
X.displayName = "X";

// Complete Toast component for easy setup
interface ToastComponentProps {
  children?: React.ReactNode;
  className?: string;
  limit?: number;
  timeout?: number;
  toastManager?: ReturnType<typeof createToastManager>;
}

const Toast = React.forwardRef<HTMLDivElement, ToastComponentProps>(
  (
    { children, className, limit = 3, timeout = 5000, toastManager, ...props },
    ref
  ) => (
    <ToastProvider limit={limit} timeout={timeout} toastManager={toastManager}>
      {children}
      <ToastPortal>
        <ToastViewport ref={ref} className={className} {...props}>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
);
Toast.displayName = "Toast";

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastPortal,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastList,
  useToastManager,
  createToastManager,
  toastVariants,
  getVariantFromType,
};
