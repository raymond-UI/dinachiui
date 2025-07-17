"use client";
import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "@dinachi/core";

// Sheet Context
interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

const useSheetContext = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet.Root");
  }
  return context;
};

// Sheet Root
interface SheetRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const SheetRoot = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetRootProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const contextValue = React.useMemo(
    () => ({
      open: isOpen,
      onOpenChange: handleOpenChange,
    }),
    [isOpen, handleOpenChange]
  );

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
    </SheetContext.Provider>
  );
};

// Sheet Trigger
interface SheetTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ className, onClick, asChild, ...props }, ref) => {
    const { onOpenChange } = useSheetContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      onOpenChange(true);
    };

    // Note: asChild implementation would typically use a slot/polymorphic component
    // For now, we'll suppress the warning since it's part of the API design
    void asChild;

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center cursor-pointer justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "h-10 px-4 py-2",
          className
        )}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
SheetTrigger.displayName = "SheetTrigger";

// Sheet Portal
interface SheetPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

const SheetPortal = ({ children, container }: SheetPortalProps) => {
  const { open } = useSheetContext();

  if (!open) return null;

  if (container) {
    return ReactDOM.createPortal(children, container);
  }

  return ReactDOM.createPortal(children, document.body);
};

// We need to import ReactDOM for createPortal
import ReactDOM from "react-dom";

const SheetBackdrop = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => {
  const { onOpenChange } = useSheetContext();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    onOpenChange(false);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "animate-in fade-in-0",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
SheetBackdrop.displayName = "SheetBackdrop";

// Sheet Content
interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => {
    const { onOpenChange } = useSheetContext();

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onOpenChange(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [onOpenChange]);

    // Prevent body scroll when sheet is open
    React.useEffect(() => {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, []);

    return (
      <SheetPortal>
        <SheetBackdrop />
        <div
          ref={ref}
          className={cn(
            "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-all duration-300 flex flex-col",
            "animate-in",
            // Right side (default)
            side === "right" && [
              "inset-y-0 right-0 h-full w-3/4 border-l",
              "slide-in-from-right",
              "sm:max-w-sm",
            ],
            // Left side
            side === "left" && [
              "inset-y-0 left-0 h-full w-3/4 border-r",
              "slide-in-from-left",
              "sm:max-w-sm",
            ],
            // Top side
            side === "top" && ["inset-x-0 top-0 border-b", "slide-in-from-top"],
            // Bottom side
            side === "bottom" && [
              "inset-x-0 bottom-0 border-t",
              "slide-in-from-bottom",
            ],
            className
          )}
          {...props}
        >
          {children}
          <SheetClose />
        </div>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = "SheetContent";

// Sheet Close
interface SheetCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  ({ className, onClick, children, asChild, ...props }, ref) => {
    const { onOpenChange } = useSheetContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      onOpenChange(false);
    };

    void asChild;

    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
          "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none data-[state=open]:bg-secondary",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children || (
          <>
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </>
        )}
      </button>
    );
  }
);
SheetClose.displayName = "SheetClose";

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
));
SheetHeader.displayName = "SheetHeader";

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
));
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Portal: SheetPortal,
  Backdrop: SheetBackdrop,
  Content: SheetContent,
  Close: SheetClose,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
};

export {
  Sheet,
  SheetRoot,
  SheetTrigger,
  SheetPortal,
  SheetBackdrop,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
