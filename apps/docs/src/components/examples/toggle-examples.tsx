import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Bold, Italic, Underline } from 'lucide-react';

export function DefaultToggleExample() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  );
}

export function ToggleVariantsExample() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="default" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      
      <Toggle variant="outline" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

export function ToggleSizesExample() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Small">
        <Bold className="h-3 w-3" />
      </Toggle>
      
      <Toggle size="default" aria-label="Default">
        <Bold className="h-4 w-4" />
      </Toggle>
      
      <Toggle size="lg" aria-label="Large">
        <Bold className="h-5 w-5" />
      </Toggle>
    </div>
  );
}

export function ToggleControlledExample() {
  const [formatting, setFormatting] = React.useState({
    bold: false,
    italic: false,
    underline: false
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Toggle 
          pressed={formatting.bold}
          onPressedChange={(pressed) => setFormatting(prev => ({ ...prev, bold: pressed }))}
          aria-label="Toggle bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={formatting.italic}
          onPressedChange={(pressed) => setFormatting(prev => ({ ...prev, italic: pressed }))}
          aria-label="Toggle italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={formatting.underline}
          onPressedChange={(pressed) => setFormatting(prev => ({ ...prev, underline: pressed }))}
          aria-label="Toggle underline"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Active formatting: {Object.entries(formatting)
          .filter(([, active]) => active)
          .map(([format]) => format)
          .join(', ') || 'none'}
      </div>
    </div>
  );
}