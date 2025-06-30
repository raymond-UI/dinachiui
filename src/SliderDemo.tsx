import { useState } from 'react'
import {
  Slider,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderDirectionProvider,
} from '../packages/components/src/slider'

export function SliderDemo() {
  const [value, setValue] = useState(33)
  const [rangeValue, setRangeValue] = useState([25, 75])

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Slider Component Demo</h2>
        <p className="text-muted-foreground mb-6">
          An input where the user selects a value from within a given range.
        </p>
      </div>

      {/* Basic Slider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Slider</h3>
        <div className="w-64">
          <Slider defaultValue={50} max={100} step={1}>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      </div>

      {/* Slider with Value Display */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Value Display</h3>
        <div className="w-64 space-y-2">
          <Slider defaultValue={25}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volume</label>
              <SliderValue />
            </div>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      </div>

      {/* Controlled Slider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Controlled Slider</h3>
        <div className="w-64 space-y-2">
          <Slider value={value} onValueChange={(val) => setValue(val as number)}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Value: {value}</label>
              <SliderValue />
            </div>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
            onClick={() => setValue(0)}
          >
            Reset to 0
          </button>
          <button
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
            onClick={() => setValue(50)}
          >
            Set to 50
          </button>
          <button
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
            onClick={() => setValue(100)}
          >
            Set to 100
          </button>
        </div>
      </div>

      {/* Range Slider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Range Slider</h3>
        <div className="w-64 space-y-2">
          <Slider
            value={rangeValue}
            onValueChange={(val) => setRangeValue(val as number[])}
            max={100}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Range</label>
              <span className="text-sm text-muted-foreground">
                {rangeValue[0]} - {rangeValue[1]}
              </span>
            </div>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      </div>

      {/* Disabled Slider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled Slider</h3>
        <div className="w-64">
          <Slider disabled defaultValue={50}>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      </div>

      {/* Custom Step Size */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Step Size</h3>
        <div className="w-64 space-y-2">
          <Slider defaultValue={20} max={100} step={10}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Step by 10</label>
              <SliderValue />
            </div>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      </div>

      {/* Vertical Slider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vertical Slider</h3>
        <div className="h-48 flex items-center justify-center">
          <Slider orientation="vertical" defaultValue={50} className="h-40">
            <SliderControl className="h-full w-full">
              <SliderTrack className="h-full w-full">
                <SliderRange className="bg-red-500 h-full w-full rounded" />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      </div>

      {/* Custom Styling Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <div className="w-64">
          <Slider defaultValue={60} className="my-4">
            <SliderControl>
              <SliderTrack className="bg-red-100 h-3">
                <SliderRange className="bg-red-500" />
                <SliderThumb className="border-red-500 bg-white h-6 w-6" />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      </div>

      {/* RTL Support Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">International Support (RTL)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2" dir="ltr">
            <p className="text-sm font-medium">LTR (Left-to-Right)</p>
            <SliderDirectionProvider direction="ltr">
              <Slider defaultValue={30}>
                <SliderControl>
                  <SliderTrack>
                    <SliderRange />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider>
            </SliderDirectionProvider>
          </div>
          <div className="space-y-2" dir="rtl">
            <p className="text-sm font-medium">RTL (Right-to-Left)</p>
            <SliderDirectionProvider direction="rtl">
              <Slider defaultValue={70}>
                <SliderControl>
                  <SliderTrack>
                    <SliderRange />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider>
            </SliderDirectionProvider>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          See the dedicated RTL demo below for comprehensive international support examples.
        </p>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <h4 className="font-semibold mb-2">Usage Instructions:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Use arrow keys to adjust values</li>
          <li>• Hold Shift + arrow keys for larger steps</li>
          <li>• Press Home/End to go to min/max values</li>
          <li>• Click anywhere on the track to jump to that value</li>
          <li>• Drag the thumb for precise control</li>
          <li>• Wrap with SliderDirectionProvider for RTL support</li>
        </ul>
      </div>
    </div>
  )
} 