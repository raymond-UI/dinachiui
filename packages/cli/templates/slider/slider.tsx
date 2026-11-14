import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { cn } from "@/lib/utils";
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "@/components/ui/agent";

type SliderNumber = number | readonly number[];

/** One number, snapped to the step from min, or what is wrong with it. */
function snapped(item: unknown, min: number, max: number, step: number): number | string {
  const n = Number(item);
  if (item === "" || item === null || !Number.isFinite(n)) return `"${String(item)}" is not a number.`;
  if (n < min || n > max) return `${n} is out of range: ${min} to ${max}.`;
  return Math.min(max, min + Math.round((n - min) / step) * step);
}

/** Snaps to the step and checks the bounds and shape, or says what is wrong. */
function sliderValue(wanted: unknown, current: SliderNumber, min: number, max: number, step: number): SliderNumber | string {
  const count = Array.isArray(current) ? current.length : 0;
  const list: unknown[] = Array.isArray(wanted) ? wanted : [wanted];
  if (list.length !== Math.max(count, 1)) return count ? `Send ${count} numbers, low to high.` : "Send one number.";
  const next = list.map((item) => snapped(item, min, max, step));
  const wrong = next.find((n) => typeof n === "string");
  if (wrong !== undefined) return wrong;
  if (next.some((n, i) => i > 0 && n < next[i - 1])) return "Values must go from low to high.";
  return count ? (next as number[]) : (next[0] as number);
}

/**
 * Base UI's root, holding its own value so an agent can set it the way a parent would.
 * Controlled use is unchanged, and `onValueChange` sees the agent's change first and can
 * cancel it.
 */
const Slider = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Root>,
  React.ComponentProps<typeof BaseSlider.Root>
>(({ className, value: valueProp, defaultValue, onValueChange, ...props }, ref) => {
  type Details = BaseSlider.Root.ChangeEventDetails;
  const { min = 0, max = 100, step = 1 } = props;
  const [value, changeValue] = useAgentState<SliderNumber, Details>(
    valueProp,
    defaultValue ?? min,
    onValueChange as ((value: SliderNumber, details: Details) => void) | undefined
  );
  const element = React.useRef<HTMLDivElement>(null);

  useAgentControl(() => {
    const root = element.current;
    // Unnamed, the slider takes the name a thumb was given.
    const named = root?.matches("[aria-label], [aria-labelledby], [data-agent-label]");
    return {
      kind: "slider",
      element: root,
      label: named ? undefined : root?.querySelector("input")?.getAttribute("aria-label") ?? undefined,
      value: Array.isArray(value) ? [...value] : (value as number),
      min,
      max,
      step,
      disabled: props.disabled,
      actions: {
        setValue: (wanted: unknown) => {
          const next = sliderValue(wanted, value, min, max, step);
          return typeof next === "string" ? next : changeAsAgent(changeValue, next);
        },
      },
    };
  });

  return (
    <BaseSlider.Root
      ref={useMergedRef(ref, element)}
      className={cn("relative flex w-full flex-col gap-2", className)}
      value={value}
      onValueChange={changeValue}
      {...props}
    />
  );
});
Slider.displayName = "Slider";

/** The root reports every thumb as one control, so the thumbs' own inputs stay out. */
const hideFromAgent = (node: HTMLInputElement | null) => node?.setAttribute("data-agent-part", "");

const SliderValue = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Value>,
  React.ComponentProps<typeof BaseSlider.Value>
>(({ className, ...props }, ref) => (
  <BaseSlider.Value
    ref={ref}
    className={cn("text-sm font-medium", className)}
    {...props}
  />
));
SliderValue.displayName = "SliderValue";

const SliderControl = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Control>,
  React.ComponentProps<typeof BaseSlider.Control>
>(({ className, ...props }, ref) => (
  <BaseSlider.Control
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  />
));
SliderControl.displayName = "SliderControl";

const SliderTrack = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Track>,
  React.ComponentProps<typeof BaseSlider.Track>
>(({ className, ...props }, ref) => (
  <BaseSlider.Track
    ref={ref}
    className={cn(
      "relative h-2 w-full grow rounded-full bg-secondary shadow-[inset_0_0_0_1px] shadow-secondary-foreground/5",
      className
    )}
    {...props}
  />
));
SliderTrack.displayName = "SliderTrack";

const SliderRange = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Indicator>,
  React.ComponentProps<typeof BaseSlider.Indicator>
>(({ className, ...props }, ref) => (
  <BaseSlider.Indicator
    ref={ref}
    className={cn("absolute h-full bg-primary rounded-full", className)}
    {...props}
  />
));
SliderRange.displayName = "SliderRange";

const SliderThumb = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Thumb>,
  React.ComponentProps<typeof BaseSlider.Thumb>
>(({ className, inputRef, ...props }, ref) => (
  <BaseSlider.Thumb
    ref={ref}
    inputRef={useMergedRef(inputRef, useHasAgent() ? hideFromAgent : undefined)}
    className={cn(
      "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background",
      "transition-[color,background-color,border-color,transform,scale] duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[dragging]:scale-110 motion-reduce:data-[dragging]:scale-100",
      className
    )}
    {...props}
  />
));
SliderThumb.displayName = "SliderThumb";

const SliderLabel = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Label>,
  React.ComponentProps<typeof BaseSlider.Label>
>(({ className, ...props }, ref) => (
  <BaseSlider.Label
    ref={ref}
    className={cn("block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
SliderLabel.displayName = "SliderLabel";

const SliderDirectionProvider: React.FC<React.ComponentProps<typeof DirectionProvider>> = ({
  children,
  ...props
}) => (
  <DirectionProvider {...props}>
    {children}
  </DirectionProvider>
);
SliderDirectionProvider.displayName = "SliderDirectionProvider";

export type SliderProps = React.ComponentProps<typeof BaseSlider.Root>;
export type SliderValueProps = React.ComponentProps<typeof BaseSlider.Value>;
export type SliderControlProps = React.ComponentProps<typeof BaseSlider.Control>;
export type SliderTrackProps = React.ComponentProps<typeof BaseSlider.Track>;
export type SliderRangeProps = React.ComponentProps<typeof BaseSlider.Indicator>;
export type SliderThumbProps = React.ComponentProps<typeof BaseSlider.Thumb>;
export type SliderLabelProps = React.ComponentProps<typeof BaseSlider.Label>;
export type SliderDirectionProviderProps = React.ComponentProps<typeof DirectionProvider>;

export {
  Slider,
  SliderValue,
  SliderLabel,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderDirectionProvider,
};