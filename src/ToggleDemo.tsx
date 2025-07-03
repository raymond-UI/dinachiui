import { Toggle } from "@dinachi/components/toggle";
import { useState } from "react";
import { Bold, Italic, Underline, Bell, BellOff, Eye, EyeOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export function ToggleDemo() {
  const [isPressed, setIsPressed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [boldText, setBoldText] = useState(false);
  const [italicText, setItalicText] = useState(false);
  const [underlineText, setUnderlineText] = useState(false);
  const [visibility, setVisibility] = useState(true);
  const [microphone, setMicrophone] = useState(false);
  const [sound, setSound] = useState(true);

  return (
    <div className="space-y-12 p-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Toggle Demo</h2>
        <p className="text-muted-foreground max-w-2xl">
          A two-state button that can be toggled on or off. Demonstrates comprehensive 
          styling, state handling, and accessibility features.
        </p>
      </div>
      
      {/* Basic Variants */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Basic Variants</h3>
        <div className="flex flex-wrap gap-3">
          <Toggle variant="default" aria-label="Default toggle">
            Default
          </Toggle>
          <Toggle variant="outline" aria-label="Outline toggle">
            Outline
          </Toggle>
          <Toggle variant="default" defaultPressed aria-label="Default pressed">
            Default Pressed
          </Toggle>
          <Toggle variant="outline" defaultPressed aria-label="Outline pressed">
            Outline Pressed
          </Toggle>
        </div>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Size Variants</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Toggle size="sm" variant="outline" aria-label="Small toggle">
            Small
          </Toggle>
          <Toggle size="default" variant="outline" aria-label="Default size toggle">
            Default
          </Toggle>
          <Toggle size="lg" variant="outline" aria-label="Large toggle">
            Large
          </Toggle>
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Disabled States</h3>
        <div className="flex flex-wrap gap-3">
          <Toggle disabled aria-label="Disabled unpressed">
            Disabled
          </Toggle>
          <Toggle disabled defaultPressed aria-label="Disabled pressed">
            Disabled Pressed
          </Toggle>
          <Toggle disabled variant="outline" aria-label="Disabled outline">
            Outline Disabled
          </Toggle>
          <Toggle disabled variant="outline" defaultPressed aria-label="Disabled outline pressed">
            Outline Disabled Pressed
          </Toggle>
        </div>
      </section>

      {/* Controlled State */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Controlled State</h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <Toggle
              pressed={isPressed}
              onPressedChange={setIsPressed}
              variant="outline"
              aria-label="Controlled toggle"
            >
              {isPressed ? "ON" : "OFF"}
            </Toggle>
            <span className="text-sm text-muted-foreground">
              State: {isPressed ? "Pressed" : "Not Pressed"}
            </span>
          </div>
        </div>
      </section>

      {/* Text Formatting Toolbar */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Text Formatting Toolbar</h3>
        <div className="space-y-3">
          <div className="flex gap-1 p-2 border rounded-lg bg-muted/20">
            <Toggle
              size="sm"
              variant="outline"
              pressed={boldText}
              onPressedChange={setBoldText}
              aria-label="Bold formatting"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              variant="outline"
              pressed={italicText}
              onPressedChange={setItalicText}
              aria-label="Italic formatting"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              variant="outline"
              pressed={underlineText}
              onPressedChange={setUnderlineText}
              aria-label="Underline formatting"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="p-4 border rounded-lg bg-background">
            <p 
              className={`text-sm ${
                boldText ? 'font-bold' : ''
              } ${
                italicText ? 'italic' : ''
              } ${
                underlineText ? 'underline' : ''
              }`}
            >
              This text reflects the formatting options above.
            </p>
          </div>
        </div>
      </section>

      {/* Settings Panel */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Settings Panel</h3>
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          
          {/* Notifications Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Push Notifications
              </label>
              <p className="text-xs text-muted-foreground">
                Receive updates about important changes
              </p>
            </div>
            <Toggle
              pressed={notifications}
              onPressedChange={setNotifications}
              variant="outline"
              aria-label="Enable notifications"
            >
              {notifications ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          {/* Visibility Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Profile Visibility
              </label>
              <p className="text-xs text-muted-foreground">
                Make your profile visible to others
              </p>
            </div>
            <Toggle
              pressed={visibility}
              onPressedChange={setVisibility}
              variant="outline"
              aria-label="Toggle profile visibility"
            >
              {visibility ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          {/* Audio Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Audio Settings</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm">Microphone</label>
                <p className="text-xs text-muted-foreground">Enable microphone access</p>
              </div>
              <Toggle
                pressed={microphone}
                onPressedChange={setMicrophone}
                size="sm"
                aria-label="Toggle microphone"
              >
                {microphone ? (
                  <Mic className="h-3 w-3" />
                ) : (
                  <MicOff className="h-3 w-3" />
                )}
              </Toggle>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm">Sound Effects</label>
                <p className="text-xs text-muted-foreground">Play interface sounds</p>
              </div>
              <Toggle
                pressed={sound}
                onPressedChange={setSound}
                size="sm"
                aria-label="Toggle sound effects"
              >
                {sound ? (
                  <Volume2 className="h-3 w-3" />
                ) : (
                  <VolumeX className="h-3 w-3" />
                )}
              </Toggle>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styled Examples */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Custom Styled Examples</h3>
        <div className="flex flex-wrap gap-3">
          <Toggle 
            className="
              bg-gradient-to-r from-blue-500 to-purple-600 
              text-white border-0 shadow-lg
              data-[state=on]:from-purple-600 data-[state=on]:to-pink-600
              hover:shadow-xl transition-all
            "
            aria-label="Gradient toggle"
          >
            Gradient
          </Toggle>
          
          <Toggle 
            className="
              border-2 border-dashed border-orange-300
              bg-orange-50 text-orange-700
              data-[state=on]:bg-orange-500 data-[state=on]:text-white
              data-[state=on]:border-orange-500
              hover:bg-orange-100
            "
            aria-label="Dashed border toggle"
          >
            Dashed
          </Toggle>

          <Toggle 
            className="
              rounded-full bg-green-100 text-green-700 border-green-300
              data-[state=on]:bg-green-500 data-[state=on]:text-white
              hover:bg-green-200 transition-colors
            "
            size="lg"
            aria-label="Rounded toggle"
          >
            Rounded
          </Toggle>
        </div>
      </section>

      {/* Accessibility Information */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Accessibility Features</h3>
        <div className="p-4 border rounded-lg bg-blue-50/50 border-blue-200">
          <ul className="space-y-2 text-sm">
            <li>• <strong>Keyboard:</strong> Use Space or Enter to toggle</li>
            <li>• <strong>Screen Readers:</strong> Announces "pressed" or "not pressed" state</li>
            <li>• <strong>Focus:</strong> Visible focus indicators with ring outline</li>
            <li>• <strong>ARIA:</strong> Proper <code>aria-pressed</code> and <code>role="button"</code> attributes</li>
            <li>• <strong>Labels:</strong> Always provide <code>aria-label</code> for icon-only toggles</li>
          </ul>
        </div>
      </section>

      {/* State Summary */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Current State Summary</h3>
        <div className="p-4 border rounded-lg bg-muted/20 font-mono text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>Controlled: {isPressed ? '✓' : '✗'}</div>
            <div>Notifications: {notifications ? '✓' : '✗'}</div>
            <div>Bold: {boldText ? '✓' : '✗'}</div>
            <div>Italic: {italicText ? '✓' : '✗'}</div>
            <div>Underline: {underlineText ? '✓' : '✗'}</div>
            <div>Visibility: {visibility ? '✓' : '✗'}</div>
            <div>Microphone: {microphone ? '✓' : '✗'}</div>
            <div>Sound: {sound ? '✓' : '✗'}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
