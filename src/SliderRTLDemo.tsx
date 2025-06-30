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

export function SliderRTLDemo() {
  const [ltrValue, setLtrValue] = useState(33)
  const [rtlValue, setRtlValue] = useState(67)
  const [currentDirection, setCurrentDirection] = useState<'ltr' | 'rtl'>('ltr')

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Slider with Direction Provider</h2>
        <p className="text-muted-foreground mb-6">
          Demonstrates RTL (right-to-left) language support for international applications.
        </p>
      </div>

      {/* Direction Toggle */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Direction Controls</h3>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              currentDirection === 'ltr'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setCurrentDirection('ltr')}
          >
            LTR (Left-to-Right)
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentDirection === 'rtl'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
            onClick={() => setCurrentDirection('rtl')}
          >
            RTL (Right-to-Left)
          </button>
        </div>
      </div>

      {/* LTR vs RTL Comparison */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* LTR Example */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">LTR (English/Default)</h3>
          <div className="w-64 space-y-2" dir="ltr">
            <SliderDirectionProvider direction="ltr">
              <Slider value={ltrValue} onValueChange={(val) => setLtrValue(val as number)}>
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
            </SliderDirectionProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Slider fills from left to right. Thumb moves rightward for higher values.
          </p>
        </div>

        {/* RTL Example */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">RTL (Arabic/Hebrew)</h3>
          <div className="w-64 space-y-2" dir="rtl">
            <SliderDirectionProvider direction="rtl">
              <Slider value={rtlValue} onValueChange={(val) => setRtlValue(val as number)}>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">الصوت</label>
                  <SliderValue />
                </div>
                <SliderControl>
                  <SliderTrack>
                    <SliderRange />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider>
            </SliderDirectionProvider>
          </div>
          <p className="text-sm text-muted-foreground">
            Slider fills from right to left. Thumb moves leftward for higher values.
          </p>
        </div>
      </div>

      {/* Dynamic Direction Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dynamic Direction Change</h3>
        <div className="w-64 space-y-2" dir={currentDirection}>
          <SliderDirectionProvider direction={currentDirection}>
            <Slider defaultValue={50}>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {currentDirection === 'rtl' ? 'القيمة' : 'Value'}
                </label>
                <SliderValue />
              </div>
              <SliderControl>
                <SliderTrack>
                  <SliderRange />
                  <SliderThumb />
                </SliderTrack>
              </SliderControl>
            </Slider>
          </SliderDirectionProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          Use the direction buttons above to see how the slider adapts to different reading directions.
        </p>
      </div>

      {/* Range Slider with RTL */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Range Slider with RTL Support</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2" dir="ltr">
            <h4 className="text-md font-medium">LTR Range Slider</h4>
            <SliderDirectionProvider direction="ltr">
              <Slider defaultValue={[25, 75]} max={100}>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Range</label>
                  <span className="text-sm text-muted-foreground">25 - 75</span>
                </div>
                <SliderControl>
                  <SliderTrack>
                    <SliderRange />
                    <SliderThumb />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider>
            </SliderDirectionProvider>
          </div>
          
          <div className="space-y-2" dir="rtl">
            <h4 className="text-md font-medium">RTL Range Slider</h4>
            <SliderDirectionProvider direction="rtl">
              <Slider defaultValue={[25, 75]} max={100}>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">المدى</label>
                  <span className="text-sm text-muted-foreground">25 - 75</span>
                </div>
                <SliderControl>
                  <SliderTrack>
                    <SliderRange />
                    <SliderThumb />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider>
            </SliderDirectionProvider>
          </div>
        </div>
      </div>

      {/* Implementation Example */}
      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <h4 className="font-semibold mb-2">Implementation Example:</h4>
        <pre className="text-sm overflow-x-auto bg-background p-3 rounded border">
{`import { SliderDirectionProvider } from "@/components/slider"

// RTL Support
<div dir="rtl">
  <SliderDirectionProvider direction="rtl">
    <Slider defaultValue={50}>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  </SliderDirectionProvider>
</div>`}
        </pre>
        <ul className="text-sm space-y-1 text-muted-foreground mt-3">
          <li>• Wrap slider with SliderDirectionProvider</li>
          <li>• Set direction prop to "rtl" or "ltr"</li>
          <li>• Add dir attribute to parent container</li>
          <li>• Slider automatically adapts behavior</li>
        </ul>
      </div>
    </div>
  )
} 