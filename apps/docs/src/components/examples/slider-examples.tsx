"use client";

import {
  Slider,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderValue,
} from "@/components/ui/slider";
import { useState } from "react";

export function DefaultSliderExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <label className="text-sm font-medium text-foreground">Volume</label>
      <Slider defaultValue={50}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}

export function SliderWithValueExample() {
  const [value, setValue] = useState(50);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Brightness
        </label>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Slider value={value} onValueChange={(val) => setValue(val as number)}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}

export function RangeSliderExample() {
  const [range, setRange] = useState([25, 75]);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Price Range
        </label>
        <span className="text-sm text-muted-foreground">
          ${range[0]} - ${range[1]}
        </span>
      </div>
      <Slider value={range} onValueChange={(val) => setRange(val as number[])}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}

export function StepSliderExample() {
  const [value, setValue] = useState(50);
  const steps = [0, 25, 50, 75, 100];

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Quality</label>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Slider
        value={value}
        onValueChange={(val) => setValue(val as number)}
        step={25}
      >
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <div className="flex justify-between text-xs text-muted-foreground">
        {steps.map((step) => (
          <span key={step}>{step}%</span>
        ))}
      </div>
    </div>
  );
}

export function DisabledSliderExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <label className="text-sm font-medium text-muted-foreground">
        Volume (Locked)
      </label>
      <Slider defaultValue={30} disabled>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}
