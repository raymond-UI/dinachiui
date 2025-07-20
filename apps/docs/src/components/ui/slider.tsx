import * as React from "react";
import { Slider as BaseSlider } from "@base-ui-components/react/slider";
import { DirectionProvider } from "@base-ui-components/react/direction-provider";
import { cn } from "@/lib/utils"


const Slider = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Root>,
  React.ComponentProps<typeof BaseSlider.Root>
>(({ className, ...props }, ref) => {
  const internalRef = React.useRef<HTMLDivElement>(null);
  
  React.useImperativeHandle(ref, () => internalRef.current!, []);
  
  return (
    <BaseSlider.Root
      ref={internalRef as React.RefObject<HTMLDivElement>}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    />
  );
});
Slider.displayName = "Slider";

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
    className={cn("absolute h-full bg-primary rounded", className)}
    {...props}
  />
));
SliderRange.displayName = "SliderRange";

const SliderThumb = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Thumb>,
  React.ComponentProps<typeof BaseSlider.Thumb>
>(({ className, ...props }, ref) => (
  <BaseSlider.Thumb
    ref={ref}
    className={cn(
      "block h-5 w-5 z-10 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[dragging]:scale-110",
      className
    )}
    {...props}
  />
));
SliderThumb.displayName = "SliderThumb";

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
export type SliderDirectionProviderProps = React.ComponentProps<typeof DirectionProvider>;

export {
  Slider,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderDirectionProvider,
};