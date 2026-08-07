"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cn } from "@dinachi/core";
import { type VariantProps, cva } from "class-variance-authority";
import {
  AnimatePresence,
  motion,
  MotionConfigContext,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { XIcon } from "lucide-react";

/*
 * The motion build of Toast.
 *
 * Same exports and same usage as the default build. What differs is under the viewport:
 * the queue collapses into depth until the reader hovers or focuses it, the arrangement is
 * sprung rather than eased, and a toast can be flicked away. Nothing about the provider,
 * the manager or `add()` changes, so moving between the two builds is a reinstall and no
 * edit to your app.
 *
 * Install it with `npx @dinachi/cli@latest add toast --motion`.
 */

// Toast Provider
const ToastProvider = BaseToast.Provider;

// Toast Portal
const ToastPortal: typeof BaseToast.Portal = BaseToast.Portal;

// Hook for using toast manager
const useToastManager = BaseToast.useToastManager;

// Create toast manager for global usage
const createToastManager = BaseToast.createToastManager;

/** `useReducedMotion` reads the OS setting only, and only at mount. Also honour an
 *  app-level `<MotionConfig reducedMotion>`, so a user preference in the host app
 *  reaches this component. */
function useReducedMotionConfig() {
  const config = React.useContext(MotionConfigContext);
  const prefersReduced = useReducedMotion();
  if (config.reducedMotion === "always") return true;
  if (config.reducedMotion === "never") return false;
  return prefersReduced ?? false;
}

/** How far back each toast sits while the stack is collapsed, in px. */
const STACK_OFFSET = 14;
/** How much smaller each toast is than the one in front of it. */
const STACK_SCALE = 0.05;
/** Past this the stack is just a shadow: more depth stops reading as more items. */
const VISIBLE_DEPTH = 3;
/** Space between toasts once the stack is open, in px. */
const GAP = 10;
/** Seconds of deceleration to project a flick forward by, and the distance that commits. */
const PROJECTION = 0.18;
const SWIPE_AT = 90;
/** Used before a toast has been measured. Only ever wrong for one frame. */
const ASSUMED_HEIGHT = 64;
/** Joins ids into one dependency string. NUL because no id can contain it. */
const SEPARATOR = "\u0000";
/** Base UI's swipe and this build's drag would both claim the pointer. */
const NO_BASE_SWIPE: never[] = [];

interface ToastArrangementContextValue {
  expanded: boolean;
  reducedMotion: boolean;
  visibleDepth: number;
  gap: number;
}

const ToastArrangementContext =
  React.createContext<ToastArrangementContextValue | null>(null);

interface ToastSlotContextValue {
  depth: number;
  /** Where this toast sits once the stack is open, measured off the toasts in front. */
  openY: number;
  zIndex: number;
  /** Rendered, but past the point where more depth stops reading as more items. */
  beyondDepth: boolean;
  /** The front toast's height, which the ones behind it are cut to while collapsed. */
  collapsedHeight: number;
  /** This toast's own height, once it has been measured. */
  height?: number;
  onHeight: (height: number) => void;
}

const ToastSlotContext = React.createContext<ToastSlotContextValue | null>(null);

export interface ToastViewportProps
  extends React.ComponentProps<typeof BaseToast.Viewport> {
  /** How many toasts the stack draws. One more is rendered invisibly behind them, so the
   *  toast moving into view fades in rather than appearing. */
  visibleDepth?: number;
  /** Space between toasts once the stack is open, in px. */
  gap?: number;
  /** Set false for a plain sprung column: the same motion, without the depth collapse. */
  stack?: boolean;
}

/**
 * Toast Viewport.
 *
 * Three notifications should cost the same screen area as one until the reader shows
 * interest. Collapsed, the toasts behind the front one are pushed back with a scale and a
 * small vertical offset, so the queue reads as depth rather than as a list that has been
 * cropped. Hovering or focusing it expands it into the real column.
 *
 * Position is `scale` and `y`, never margin. The stack has to be able to expand and
 * collapse while a toast is entering or leaving, and layout properties cannot be
 * interrupted mid-flight without jumping.
 */
const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  (
    {
      visibleDepth = VISIBLE_DEPTH,
      gap = GAP,
      stack = true,
      className,
      onPointerEnter,
      onPointerLeave,
      onFocusCapture,
      onBlurCapture,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotionConfig();
    const [hovered, setHovered] = React.useState(false);

    const arrangement = React.useMemo(
      () => ({
        // With stacking off there is nothing to expand: the column is always open.
        expanded: !stack || hovered,
        reducedMotion,
        visibleDepth: stack ? visibleDepth : Number.MAX_SAFE_INTEGER,
        gap,
      }),
      [stack, hovered, reducedMotion, visibleDepth, gap]
    );

    return (
      <ToastArrangementContext.Provider value={arrangement}>
        <BaseToast.Viewport
          ref={ref}
          // Base UI's viewport already pauses the timers on hover and focus. This is the
          // same signal read a second time, because the arrangement is animated in JS and
          // cannot be driven by the data attribute the CSS build uses.
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            setHovered(true);
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            setHovered(false);
          }}
          onFocusCapture={(event) => {
            onFocusCapture?.(event);
            setHovered(true);
          }}
          onBlurCapture={(event) => {
            onBlurCapture?.(event);
            setHovered(false);
          }}
          className={cn(
            "fixed z-10 top-auto right-4 bottom-4 w-[250px] sm:right-8 sm:bottom-8 sm:w-[300px]",
            className
          )}
          {...props}
        />
      </ToastArrangementContext.Provider>
    );
  }
);
ToastViewport.displayName = "ToastViewport";

// Toast variants for different types. The CSS build carries the whole stacking transform
// here; this one carries appearance only, because the transform is Motion's.
const toastVariants = cva(
  "relative overflow-hidden rounded-xl border bg-clip-padding bg-background shadow-lg select-none",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        destructive:
          "border-destructive border-l-4 bg-background text-foreground",
        success: "border-success border-l-4 bg-background text-foreground",
        warning: "border-warning border-l-4 bg-background text-foreground",
        loading: "border-primary/50 border-l-4 bg-background text-foreground",
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

/**
 * Toast Root.
 *
 * A Base UI toast root, so it is a labelled dialog the viewport's live region announces,
 * it can be reached with F6, and it closes itself on the provider's timeout. Nothing about
 * the root is animated, which is what lets Motion own the transform on the card inside it
 * without the two writing over each other every frame.
 *
 * It reads its place in the stack off `ToastList`, which is what arranges the queue.
 */
const ToastRoot = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, children, ...props }, ref) => {
    const arrangement = React.useContext(ToastArrangementContext);
    const slot = React.useContext(ToastSlotContext);

    if (!arrangement || !slot) {
      throw new Error(
        "ToastRoot must be rendered by ToastList inside a ToastViewport, which is what arranges the stack."
      );
    }

    const { expanded, reducedMotion } = arrangement;
    const { depth, openY, zIndex, beyondDepth, collapsedHeight, height, onHeight } =
      slot;
    const { close } = useToastManager();
    const toastId = props.toast.id;

    // Collapsed, a toast behind the front one is cut to the front one's height. Toasts are
    // not all one height, and a two-line body behind a one-line toast otherwise sticks out
    // from under it as a loose strip of text.
    const clamped = !expanded && depth > 0;

    const card = React.useRef<HTMLDivElement>(null);
    const content = React.useRef<HTMLDivElement>(null);
    React.useLayoutEffect(() => {
      const outer = card.current;
      const element = content.current;
      if (!outer || !element || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(([entry]) => {
        // The card's own border, read rather than assumed: `clientHeight` leaves it out and
        // `offsetHeight` does not, and the difference holds whatever the card's height has
        // been set to. The open column is spaced by whole cards, so a measurement short by
        // the border puts each toast a hairline inside the one in front.
        const border = outer.offsetHeight - outer.clientHeight;
        onHeight(
          (entry.borderBoxSize?.[0]?.blockSize ?? element.offsetHeight) + border
        );
      });
      observer.observe(element);
      return () => observer.disconnect();
    }, [onHeight]);

    return (
      <BaseToast.Root
        ref={ref}
        // Base UI's swipe and this build's drag would both claim the pointer, and Base UI's
        // is a threshold where this one projects the flick forward.
        swipeDirection={NO_BASE_SWIPE}
        style={{ zIndex }}
        className="absolute inset-x-0 bottom-0 focus-visible:outline-none"
        {...props}
      >
        <motion.div
          ref={card}
          // No `layout` here on purpose. Every toast is pinned to the same bottom edge and
          // placed by `y`, so there is no layout change to measure: a layout animation
          // would only give the projection something to fight the animated `y` over.
          // Same keys in every branch: a property `animate` sets and `initial` omits is
          // animated from `undefined` rather than skipped.
          initial={
            reducedMotion
              ? { opacity: 0, y: 0, scale: 1 }
              : { opacity: 0, y: 32, scale: 0.9 }
          }
          animate={{
            // The one past the visible depth is rendered but invisible, so the toast moving
            // up into the stack fades in rather than appearing whole.
            opacity: beyondDepth ? 0 : 1,
            // The stack grows up from the bottom edge, so the toasts behind the front one
            // are above it. Open, they sit in a real column measured off their own heights;
            // collapsed, they fall back into each other. Both are the same two properties.
            y: expanded ? -openY : -depth * STACK_OFFSET,
            scale: expanded ? 1 : 1 - depth * STACK_SCALE,
            height: clamped ? collapsedHeight : (height ?? "auto"),
          }}
          exit={
            reducedMotion
              ? { opacity: 0, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.94 }
          }
          transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
          drag={reducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_: unknown, info: PanInfo) => {
            if (Math.abs(info.offset.x + info.velocity.x * PROJECTION) > SWIPE_AT) {
              close(toastId);
            }
          }}
          className={cn(
            toastVariants({ variant }),
            !reducedMotion && "cursor-grab active:cursor-grabbing",
            className
          )}
        >
          {/* The measured row is its own element because the card's height is animated, and
              a card cannot also be what reports how tall its contents want to be: it would
              measure the animation and settle wherever it happened to look. */}
          <motion.div
            ref={content}
            // Collapsed, a toast behind the front one is a card edge and nothing else. The
            // strip of it that shows above the front toast is a few pixels tall, and a few
            // pixels of a sentence read as a rendering fault rather than as depth.
            // `initial={false}`: a toast that arrives behind another starts hidden rather
            // than fading out of a view it never had.
            initial={false}
            animate={{ opacity: clamped ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            {children}
          </motion.div>
        </motion.div>
      </BaseToast.Root>
    );
  }
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

// Toast Content — the row inside the card. Layout only; the card is the surface.
const ToastContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-start gap-3", className)} {...props} />
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
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

// Toast Close — renders XIcon by default, overridable via children
const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof BaseToast.Close>
>(({ className, children, ...props }, ref) => (
  <BaseToast.Close
    ref={ref}
    aria-label="Close"
    className={cn(
      "absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded border-none bg-transparent opacity-60 transition-opacity",
      "hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    {children ?? <XIcon className="h-4 w-4" />}
  </BaseToast.Close>
));
ToastClose.displayName = "ToastClose";

// Toast Positioner — positions a toast relative to an anchor element
const ToastPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToast.Positioner>
>(({ className, ...props }, ref) => (
  <BaseToast.Positioner ref={ref} className={cn("z-50", className)} {...props} />
));
ToastPositioner.displayName = "ToastPositioner";

// Toast Arrow — decorative arrow for anchored toasts
const ToastArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseToast.Arrow>
>(({ className, ...props }, ref) => (
  <BaseToast.Arrow
    ref={ref}
    className={cn(
      "fill-background [stroke-width:1px] stroke-border",
      "data-[side=bottom]:top-[-8px]",
      "data-[side=left]:right-[-8px]",
      "data-[side=right]:left-[-8px]",
      "data-[side=top]:bottom-[-8px]",
      className
    )}
    {...props}
  />
));
ToastArrow.displayName = "ToastArrow";

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

// Toast object type from Base UI
type ToastObject = React.ComponentProps<typeof BaseToast.Root>["toast"];

// renderToast callback type
type RenderToastFn = (toast: ToastObject) => React.ReactNode;

/**
 * Toast List.
 *
 * The queue, arranged. The open positions are measured, not assumed: toasts are not all one
 * height, and multiplying a constant by the index is right exactly until the first toast
 * wraps, after which every toast under it overlaps.
 */
function ToastList({ renderToast }: { renderToast?: RenderToastFn }) {
  const arrangement = React.useContext(ToastArrangementContext);

  if (!arrangement) {
    throw new Error("ToastList must be used within a ToastViewport");
  }

  const { visibleDepth, gap } = arrangement;
  const { toasts } = useToastManager();
  const [heights, setHeights] = React.useState<Record<string, number>>({});

  const reportHeight = React.useCallback((id: string, height: number) => {
    setHeights((current) =>
      current[id] === height ? current : { ...current, [id]: height }
    );
  }, []);

  // A toast that has left is never measured again, and a long-lived viewport would
  // otherwise accumulate a row per notification ever shown.
  const liveIds = toasts.map((toast) => toast.id).join(SEPARATOR);
  React.useEffect(() => {
    const live = new Set(liveIds.split(SEPARATOR));
    setHeights((current) => {
      const next = Object.fromEntries(
        Object.entries(current).filter(([id]) => live.has(id))
      );
      return Object.keys(next).length === Object.keys(current).length
        ? current
        : next;
    });
  }, [liveIds]);

  // Newest first, so index 0 is the toast in front.
  const visible = toasts.slice(0, visibleDepth + 1);

  /** Accumulated offsets for the open stack, front to back. */
  const offsets: number[] = [];
  visible.reduce((total, toast, index) => {
    offsets[index] = total;
    return total + (heights[toast.id] ?? ASSUMED_HEIGHT) + gap;
  }, 0);

  const collapsedHeight = visible.length
    ? (heights[visible[0].id] ?? ASSUMED_HEIGHT)
    : ASSUMED_HEIGHT;

  return (
    <AnimatePresence initial={false}>
      {visible.map((toast, depth) => (
        <ToastSlotContext.Provider
          // The key rides the provider because that is what `AnimatePresence` reads. The
          // toast inside picks up the presence context either way.
          key={toast.id}
          value={{
            depth,
            openY: offsets[depth],
            zIndex: visible.length - depth,
            beyondDepth: depth >= visibleDepth,
            collapsedHeight,
            height: heights[toast.id],
            onHeight: (height) => reportHeight(toast.id, height),
          }}
        >
          <ToastRoot toast={toast} variant={getVariantFromType(toast.type)}>
            {renderToast ? (
              renderToast(toast)
            ) : (
              <ToastContent>
                <div className="grid flex-1 gap-1">
                  {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                  {toast.description && (
                    <ToastDescription>{toast.description}</ToastDescription>
                  )}
                </div>
                {toast.actionProps && <ToastAction {...toast.actionProps} />}
                <ToastClose />
              </ToastContent>
            )}
          </ToastRoot>
        </ToastSlotContext.Provider>
      ))}
    </AnimatePresence>
  );
}

// Complete Toast component for easy setup
interface ToastComponentProps {
  children?: React.ReactNode;
  className?: string;
  limit?: number;
  timeout?: number;
  toastManager?: ReturnType<typeof createToastManager>;
  renderToast?: RenderToastFn;
  /** How many toasts the stack draws before the rest are held back. */
  visibleDepth?: number;
  /** Set false for a plain sprung column: the same motion, without the depth collapse. */
  stack?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastComponentProps>(
  (
    {
      children,
      className,
      limit = 3,
      timeout = 5000,
      toastManager,
      renderToast,
      visibleDepth,
      stack,
      ...props
    },
    ref
  ) => (
    <ToastProvider limit={limit} timeout={timeout} toastManager={toastManager}>
      {children}
      <ToastPortal>
        <ToastViewport
          ref={ref}
          className={className}
          visibleDepth={visibleDepth}
          stack={stack}
          {...props}
        >
          <ToastList renderToast={renderToast} />
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
  ToastPositioner,
  ToastArrow,
  ToastList,
  useToastManager,
  createToastManager,
  toastVariants,
  getVariantFromType,
};

export type { ToastComponentProps, RenderToastFn, ToastObject };
