import {
  Button,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@dinachi/components";
import AccordionDemo from "./AccordionDemo";
import { AlertDialogDemo } from "./AlertDialogDemo";
import { SelectDemo } from "./SelectDemo";
import { AvatarDemo } from "./AvatarDemo";
import { CheckboxDemo } from "./CheckboxDemo";
import { CheckboxGroupDemo } from "./CheckboxGroupDemo";
import ContextMenuDemo from "./ContextMenuDemo";
import MenubarDemo from "./MenubarDemo";
import NavigationMenuDemo from "./NavigationMenuDemo";
import { DialogDemo } from "./DialogDemo";
import FieldDemoShowcase from "./FieldDemo";
import { SliderDemo } from "./SliderDemo";
import { SliderRTLDemo } from "./SliderRTLDemo";
import { TabsDemo } from "./TabsDemo";
import { CollapsibleDemo } from "./CollapsibleDemo";
import { ToastDemo } from "./ToastDemo";
import { PreviewCardDemo } from "./PreviewCardDemo";

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main content wrapper with responsive padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header section */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            My Design System
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Built with Base UI and Tailwind CSS
          </p>
        </div>

        {/* Navigation and primary components */}
        <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-12">
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <PreviewCardDemo />
          </div>
          <div className="w-full overflow-x-auto">
            <NavigationMenuDemo />
          </div>
          <div className="w-full overflow-x-auto">
            <MenubarDemo />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <SelectDemo />
            <CollapsibleDemo />
          </div>
        </div>

        {/* Button demonstrations */}
        <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-12">
          {/* Button Variants */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Button Variants
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button className="text-xs sm:text-sm">Default</Button>
              <Button variant="destructive" className="text-xs sm:text-sm">
                Destructive
              </Button>
              <Button variant="outline" className="text-xs sm:text-sm">
                Outline
              </Button>
              <Button variant="secondary" className="text-xs sm:text-sm">
                Secondary
              </Button>
              <Button variant="ghost" className="text-xs sm:text-sm">
                Ghost
              </Button>
              <Button variant="link" className="text-xs sm:text-sm">
                Link
              </Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Button Sizes
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg" className="flex items-center gap-1 sm:gap-2">
                <span className="text-lg sm:text-xl lg:text-2xl">Large</span>
                <span className="text-lg sm:text-xl lg:text-2xl">X</span>
              </Button>
              <Button size="icon">→</Button>
            </div>
          </div>

          {/* Interactive Examples */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Interactive Examples
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                onClick={() => alert("Button clicked!")}
                className="text-xs sm:text-sm"
              >
                Click Me
              </Button>
              <Button disabled className="text-xs sm:text-sm">
                Disabled
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Logged!")}
                className="text-xs sm:text-sm"
              >
                Log to Console
              </Button>
            </div>
          </div>

          {/* Field & Input Demo */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Field & Input Example
            </h2>
            <div className="max-w-full sm:max-w-md space-y-4 sm:space-y-6">
              <Field>
                <FieldLabel className="text-sm sm:text-base">Email</FieldLabel>
                <FieldControl
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full text-sm sm:text-base"
                />
                <FieldDescription className="text-xs sm:text-sm">
                  We'll never share your email.
                </FieldDescription>
                <FieldError match="valueMissing" className="text-xs sm:text-sm">
                  Email is required
                </FieldError>
                <FieldError match="typeMismatch" className="text-xs sm:text-sm">
                  Please enter a valid email address
                </FieldError>
              </Field>
              <Field>
                <FieldLabel className="text-sm sm:text-base">
                  Password
                </FieldLabel>
                <FieldControl
                  type="password"
                  required
                  minLength={8}
                  placeholder="Enter your password"
                  className="w-full text-sm sm:text-base"
                />
                <FieldDescription className="text-xs sm:text-sm">
                  Use at least 8 characters.
                </FieldDescription>
                <FieldError match="valueMissing" className="text-xs sm:text-sm">
                  Password is required
                </FieldError>
                <FieldError match="tooShort" className="text-xs sm:text-sm">
                  Password must be at least 8 characters
                </FieldError>
              </Field>
            </div>
          </div>
        </div>

        {/* Demo components grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="col-span-1">
            <FieldDemoShowcase />
          </div>
          <div className="col-span-1">
            <AccordionDemo />
          </div>
          <div className="col-span-1">
            <ContextMenuDemo />
          </div>
          <div className="col-span-1">
            <DialogDemo />
          </div>
          <div className="col-span-1">
            <ToastDemo />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <TabsDemo />
          </div>
          <div className="col-span-1">
            <SliderDemo />
          </div>
          <div className="col-span-1">
            <SliderRTLDemo />
          </div>
          <div className="col-span-1">
            <AvatarDemo />
          </div>
          <div className="col-span-1">
            <CheckboxDemo />
          </div>
          <div className="col-span-1">
            <CheckboxGroupDemo />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <AlertDialogDemo />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
