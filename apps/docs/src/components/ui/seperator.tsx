"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Type definitions aligned with API
type Orientation = "horizontal" | "vertical";

// State interface to match API docs pattern
interface SeparatorState {
  orientation: Orientation;
}

interface SeparatorProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  /**
   * The orientation of the separator
   * @default 'horizontal'
   */
  orientation?: Orientation;

  /**
   * CSS class name - can be a string or function that receives state
   */
  className?: string | ((state: SeparatorState) => string);

  /**
   * Custom render function for complete control over rendering
   */
  render?:
    | React.ReactElement
    | ((
        props: React.HTMLProps<HTMLElement>,
        state: SeparatorState
      ) => React.ReactElement);
}

const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  ({ className, orientation = "horizontal", render, ...props }, ref) => {
    // Memoize state to prevent unnecessary re-renders
    const state = React.useMemo(
      (): SeparatorState => ({
        orientation,
      }),
      [orientation]
    );

    // Resolve className - handle both string and function forms
    const resolvedClassName = React.useMemo(() => {
      if (typeof className === "function") {
        return className(state);
      }
      return className;
    }, [className, state]);

    // Default styles based on orientation
    const defaultStyles = React.useMemo(
      () =>
        cn(
          "border-none bg-current shrink-0",
          orientation === "horizontal" ? "h-px w-full" : "w-px h-full"
        ),
      [orientation]
    );

    // Combine default and custom styles
    const finalClassName = cn(defaultStyles, resolvedClassName);

    // Props to pass to the rendered element - using HTMLProps as per API
    const elementProps: React.HTMLProps<HTMLElement> & {
      "data-orientation": Orientation;
      "aria-orientation": Orientation;
    } = {
      ...props,
      className: finalClassName,
      "data-orientation": orientation,
      "aria-orientation": orientation,
      role: "separator",
    };

    // Handle custom render function
    if (render) {
      if (React.isValidElement(render)) {
        return React.cloneElement(render, elementProps);
      }
      if (typeof render === "function") {
        return render(elementProps, state);
      }
    }

    // Default rendering - use div for more flexibility instead of hr
    return (
      <div {...elementProps} ref={ref as React.RefObject<HTMLDivElement>} />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps, SeparatorState, Orientation };
