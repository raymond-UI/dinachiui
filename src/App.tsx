import {
  Button,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel
} from '@dinachi/components';
import AccordionDemo from './AccordionDemo';
import { AlertDialogDemo } from './AlertDialogDemo';
import { AvatarDemo } from './AvatarDemo';
import { CheckboxDemo } from './CheckboxDemo';
import { CheckboxGroupDemo } from './CheckboxGroupDemo';
import ContextMenuDemo from './ContextMenuDemo';
import { DialogDemo } from './DialogDemo';
import FieldDemoShowcase from './FieldDemo';
import { SliderDemo } from './SliderDemo';
import { SliderRTLDemo } from './SliderRTLDemo';
import { TabsDemo } from './TabsDemo';
import { CollapsibleDemo } from './CollapsibleDemo';
import { ToastDemo } from './ToastDemo';

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Design System</h1>
          <p className="text-muted-foreground">Built with Base UI and Tailwind CSS</p>
        </div>
        <div className="space-y-6 w-full">
          <CollapsibleDemo />

      
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
              <Button size="lg" className='flex items-center gap-2'>
                <span className="text-2xl">Large</span>
                <span className="text-2xl">X</span>
              </Button>
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
          {/* Field & Input Demo */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Field & Input Example</h2>
            <div className="max-w-md space-y-6">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldControl 
                  type="email"
                  required
                  placeholder="Enter your email"
                />
                <FieldDescription>We'll never share your email.</FieldDescription>
                <FieldError match="valueMissing">Email is required</FieldError>
                <FieldError match="typeMismatch">Please enter a valid email address</FieldError>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <FieldControl 
                  type="password"
                  required
                  minLength={8}
                  placeholder="Enter your password"
                />
                <FieldDescription>Use at least 8 characters.</FieldDescription>
                <FieldError match="valueMissing">Password is required</FieldError>
                <FieldError match="tooShort">Password must be at least 8 characters</FieldError>
              </Field>
            </div>
          </div>

          
        </div>
      </div>
      <FieldDemoShowcase />
      <AccordionDemo />
      <ContextMenuDemo />
      <DialogDemo />
      <ToastDemo />
      <TabsDemo />
      <SliderDemo />
      <SliderRTLDemo />
      <AvatarDemo />
      <CheckboxDemo />
      <CheckboxGroupDemo />
      <AlertDialogDemo />
      </div>

    </div>
  );
}

export default App;
