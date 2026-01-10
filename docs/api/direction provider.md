Direction Provider
Enables RTL behavior for Base UI components.


index.tsx
tailwind
import * as React from 'react';
import { Slider } from '@base-ui/react/slider';
import { DirectionProvider } from '@base-ui/react/direction-provider';

export default function ExampleDirectionProvider() {
  return (
    <div dir="rtl">
      <DirectionProvider direction="rtl">
        <Slider.Root defaultValue={25}>
          <Slider.Control className="flex w-56 items-center py-3">
            <Slider.Track className="relative h-1 w-full rounded bg-gray-200 shadow-[inset_0_0_0_1px] shadow-gray-200">
              <Slider.Indicator className="rounded bg-gray-700" />
              <Slider.Thumb className="size-4 rounded-full bg-white outline outline-1 outline-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </DirectionProvider>
    </div>
  );
}
API reference
Import the component and wrap it around your app:

Anatomy
import { DirectionProvider } from '@base-ui/react/direction-provider';
<DirectionProvider>
  {/* Your app or a group of components */}
</DirectionProvider>
Prop
Type
Default
direction
TextDirection

'ltr'

children
ReactNode

undefined

