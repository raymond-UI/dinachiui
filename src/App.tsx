import React from 'react';
import { Button } from '@myds/components';

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Design System</h1>
          <p className="text-muted-foreground">Built with Base UI and Tailwind CSS</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Button Variants</h2>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Button Sizes</h2>
            <div className="flex items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">→</Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Interactive Examples</h2>
            <div className="flex gap-3">
              <Button onClick={() => alert('Button clicked!')}>
                Click Me
              </Button>
              <Button disabled>Disabled</Button>
              <Button variant="outline" onClick={() => console.log('Logged!')}>
                Log to Console
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
