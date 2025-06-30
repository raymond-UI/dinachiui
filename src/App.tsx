import { 
  Button, 
  Field, 
  FieldLabel, 
  FieldControl, 
  FieldDescription, 
  FieldError, 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from '@dinachi/components';
import FieldDemoShowcase from './FieldDemo';
import AccordionDemo from './AccordionDemo';
import ContextMenuDemo from './ContextMenuDemo';
import { TabsDemo } from './TabsDemo';

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Design System</h1>
          <p className="text-muted-foreground">Built with Base UI and Tailwind CSS</p>
        </div>
        <div className="space-y-6 w-full">

      
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

          {/* Alert Dialog Demo */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Alert Dialog Example</h2>
            <div className="flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
                <AlertDialogPortal>
                  <AlertDialogBackdrop />
                  <AlertDialogPopup>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogPopup>
                </AlertDialogPortal>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger className="border border-input hover:bg-accent hover:text-accent-foreground">Save Changes</AlertDialogTrigger>
                <AlertDialogPortal>
                  <AlertDialogBackdrop />
                  <AlertDialogPopup>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Save your changes?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have unsaved changes. Would you like to save them before continuing?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Don't save</AlertDialogCancel>
                      <AlertDialogAction>Save changes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogPopup>
                </AlertDialogPortal>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger className="bg-yellow-600 hover:bg-yellow-700">
                  Warning Action
                </AlertDialogTrigger>
                <AlertDialogPortal>
                  <AlertDialogBackdrop />
                  <AlertDialogPopup>
                    <AlertDialogHeader>
                      <AlertDialogTitle>⚠️ Warning</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action may have unintended consequences. Please review before proceeding.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Go back</AlertDialogCancel>
                      <AlertDialogAction>I understand</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogPopup>
                </AlertDialogPortal>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      <FieldDemoShowcase />
      <AccordionDemo />
      <ContextMenuDemo />
      <TabsDemo />
      </div>

    </div>
  );
}

export default App;
