import { ComponentExample } from './components-registry';
import { 
  DefaultButtonExample, 
  ButtonVariantsExample, 
  ButtonSizesExample 
} from '@/components/examples/button-examples';
import {
  DefaultContextMenuExample,
  ContextMenuWithCheckboxExample,
  ContextMenuWithRadioExample,
  ContextMenuWithSubmenuExample,
  AdvancedContextMenuExample,
  ContextMenuWithInsetExample
} from '@/components/examples/context-menu-examples';
import {
  DefaultAlertDialogExample,
  ConfirmationAlertDialogExample
} from '@/components/examples/alert-dialog-examples';
import {
  DefaultAccordionExample,
  MultipleAccordionExample
} from '@/components/examples/accordion-examples';
import {
  DefaultCheckboxExample,
  CheckboxStatesExample
} from '@/components/examples/checkbox-examples';
import {
  DefaultToastExample,
  ToastVariantsExample
} from '@/components/examples/toast-examples';
import {
  DefaultAvatarExample,
  AvatarSizesExample
} from '@/components/examples/avatar-examples';
import {
  DefaultToggleExample,
  ToggleVariantsExample
} from '@/components/examples/toggle-examples';
import {
  DefaultPopoverExample,
  PopoverWithCloseExample,
  PopoverPositionExample,
  PopoverHoverExample
} from '@/components/examples/popover-examples';
import {
  DefaultInputExample,
  InputTypesExample,
  InputWithLabelExample,
  InputDisabledExample,
  InputWithValidationExample
} from '@/components/examples/input-examples';

export const buttonExamples: ComponentExample[] = [
  {
    name: "Default Button",
    description: "A basic button with default styling",
    componentId: "button-default",
    code: `import { Button } from '@/components/ui/button';

export function Example() {
  return <Button>Click me</Button>;
}`
  },
  {
    name: "Button Variants",
    description: "Different button variants for various use cases",
    componentId: "button-variants",
    code: `import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}`
  },
  {
    name: "Button Sizes",
    description: "Different button sizes for different contexts",
    componentId: "button-sizes",
    code: `import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <div className="flex gap-2 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}`
  }
];

export const contextMenuExamples: ComponentExample[] = [
  {
    name: "Default Context Menu",
    description: "A basic context menu with menu items and shortcuts",
    componentId: "context-menu-default",
    code: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuPortal,
  ContextMenuPositioner,
} from '@/components/ui/context-menu';

export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuContent className="w-64">
            <ContextMenuItem>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              Developer Tools
              <ContextMenuShortcut>F12</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenu>
  );
}`
  },
  {
    name: "Context Menu with Checkbox",
    description: "Context menu with checkbox items for toggleable options",
    componentId: "context-menu-checkbox",
    code: `import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuPortal,
  ContextMenuPositioner,
} from '@/components/ui/context-menu';

export function Example() {
  const [bookmarksBar, setBookmarksBar] = React.useState(true);
  const [showFullUrls, setShowFullUrls] = React.useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
        Right click for checkbox menu
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuContent>
            <ContextMenuCheckboxItem 
              checked={bookmarksBar}
              onCheckedChange={setBookmarksBar}
            >
              Show Bookmarks Bar
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem 
              checked={showFullUrls}
              onCheckedChange={setShowFullUrls}
            >
              Show Full URLs
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenu>
  );
}`
  },
  {
    name: "Context Menu with Radio Group",
    description: "Context menu with radio group for single selection",
    componentId: "context-menu-radio",
    code: `import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuTrigger,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuPortal,
  ContextMenuPositioner,
} from '@/components/ui/context-menu';

export function Example() {
  const [person, setPerson] = React.useState('pedro');

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
        Right click for radio menu
        <br />
        <span className="text-xs text-muted-foreground mt-1">
          Current: {person}
        </span>
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuContent>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
              <ContextMenuRadioItem value="pedro">Pedro</ContextMenuRadioItem>
              <ContextMenuRadioItem value="colm">Colm</ContextMenuRadioItem>
              <ContextMenuRadioItem value="sarah">Sarah</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenu>
  );
}`
  },
  {
    name: "Context Menu with Submenu",
    description: "Context menu with nested submenus for hierarchical options",
    componentId: "context-menu-submenu",
    code: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuPortal,
  ContextMenuPositioner,
} from '@/components/ui/context-menu';

export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
        Right click for submenu
      </ContextMenuTrigger>
      <ContextMenuPortal>
        <ContextMenuPositioner>
          <ContextMenuContent>
            <ContextMenuItem>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Save Page As...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem>
              Inspect Element
              <ContextMenuShortcut>⌘⇧C</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextMenu>
  );
}`
  }
];

export const alertDialogExamples: ComponentExample[] = [
  {
    name: "Default Alert Dialog",
    description: "A basic alert dialog for confirmations",
    componentId: "alert-dialog-default",
    code: `import {
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}`
  },
  {
    name: "Controlled Alert Dialog",
    description: "Alert dialog with controlled open state",
    componentId: "alert-dialog-controlled",
    code: `import React from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogBackdrop, AlertDialogPopup, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Save Changes</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don't Save</AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpen(false)}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}`
  }
];

export const accordionExamples: ComponentExample[] = [
  {
    name: "Default Accordion",
    description: "A basic accordion with single item open",
    componentId: "accordion-default",
    code: `import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion';

export function Example() {
  return (
    <Accordion type="single" defaultValue="item-1" className="w-full">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Is it styled?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Yes. It comes with default styles.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}`
  },
  {
    name: "Multiple Accordion",
    description: "Accordion allowing multiple items to be open",
    componentId: "accordion-multiple",
    code: `import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion';

export function Example() {
  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Getting Started</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Start by installing the required dependencies.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Configuration</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Configure your project with the following steps.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}`
  }
];

export const checkboxExamples: ComponentExample[] = [
  {
    name: "Default Checkbox",
    description: "A basic checkbox with label",
    componentId: "checkbox-default",
    code: `import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Accept terms and conditions
      </label>
    </div>
  );
}`
  },
  {
    name: "Checkbox States",
    description: "Different checkbox states including indeterminate",
    componentId: "checkbox-states",
    code: `import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  const [checked, setChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState('indeterminate');

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        <label className="text-sm font-medium">Controlled checkbox</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox checked={indeterminate} onCheckedChange={setIndeterminate} />
        <label className="text-sm font-medium">Indeterminate checkbox</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox disabled />
        <label className="text-sm font-medium text-muted-foreground">Disabled checkbox</label>
      </div>
    </div>
  );
}`
  }
];

export const toastExamples: ComponentExample[] = [
  {
    name: "Default Toast",
    description: "A basic toast notification",
    componentId: "toast-default",
    code: `import { Toast, ToastProvider, ToastViewport, useToastManager } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export function Example() {
  const { addToast } = useToastManager();

  const showToast = () => {
    addToast({
      title: "Success",
      description: "Your message has been sent successfully.",
      type: "success"
    });
  };

  return (
    <ToastProvider>
      <Button onClick={showToast}>Show Toast</Button>
      <ToastViewport />
    </ToastProvider>
  );
}`
  },
  {
    name: "Toast Variants",
    description: "Different toast variants and types",
    componentId: "toast-variants",
    code: `import { Toast, ToastProvider, ToastViewport, useToastManager } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export function Example() {
  const { addToast } = useToastManager();

  const variants = {
    success: { title: "Success!", description: "Action completed.", type: "success" },
    error: { title: "Error", description: "Something went wrong.", type: "error" },
    warning: { title: "Warning", description: "Please review your input.", type: "warning" }
  };

  return (
    <ToastProvider>
      <div className="flex gap-2">
        {Object.entries(variants).map(([key, toast]) => (
          <Button key={key} onClick={() => addToast(toast)} variant="outline">
            {key}
          </Button>
        ))}
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}`
  }
];

export const avatarExamples: ComponentExample[] = [
  {
    name: "Default Avatar",
    description: "A basic avatar with image and fallback",
    componentId: "avatar-default",
    code: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}`
  },
  {
    name: "Avatar Sizes",
    description: "Different avatar sizes",
    componentId: "avatar-sizes",
    code: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  );
}`
  }
];

export const toggleExamples: ComponentExample[] = [
  {
    name: "Default Toggle",
    description: "A basic toggle button",
    componentId: "toggle-default",
    code: `import { Toggle } from '@/components/ui/toggle';
import { Bold } from 'lucide-react';

export function Example() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  );
}`
  },
  {
    name: "Toggle Variants",
    description: "Different toggle variants",
    componentId: "toggle-variants",
    code: `import { Toggle } from '@/components/ui/toggle';
import { Bold, Italic } from 'lucide-react';

export function Example() {
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
}`
  }
];

export const popoverExamples: ComponentExample[] = [
  {
    name: "Default Popover",
    description: "A basic popover with title and description",
    componentId: "popover-default",
    code: `import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverArrow,
  PopoverTitle,
  PopoverDescription
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverTitle>Notifications</PopoverTitle>
        <PopoverDescription>
          You are all caught up. Good job!
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}`
  },
  {
    name: "Popover with Close Button",
    description: "A popover with a close button and interactive content",
    componentId: "popover-close",
    code: `import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose
} from '@/components/ui/popover';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-start justify-between mb-2">
          <PopoverTitle>Settings</PopoverTitle>
          <PopoverClose asChild>
            <button className="rounded-sm opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </PopoverClose>
        </div>
        <PopoverDescription>
          Configure your application settings here.
        </PopoverDescription>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Enable notifications</label>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Auto-save</label>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}`
  },
  {
    name: "Popover Positions",
    description: "Popovers can be positioned on different sides",
    componentId: "popover-positions",
    code: `import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverArrow,
  PopoverTitle,
  PopoverDescription
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <PopoverArrow />
          <PopoverTitle>Top Position</PopoverTitle>
          <PopoverDescription>Opens at the top.</PopoverDescription>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <PopoverArrow />
          <PopoverTitle>Bottom Position</PopoverTitle>
          <PopoverDescription>Opens at the bottom.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  );
}`
  },
  {
    name: "Hover Popover",
    description: "A popover that opens on hover",
    componentId: "popover-hover",
    code: `import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverArrow,
  PopoverTitle,
  PopoverDescription
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Popover openOnHover delay={200} closeDelay={100}>
      <PopoverTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverTitle>Hover Popover</PopoverTitle>
        <PopoverDescription>
          Opens when you hover over the trigger.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}`
  }
];

export const inputExamples: ComponentExample[] = [
  {
    name: "Default Input",
    description: "A basic input field with placeholder text",
    componentId: "input-default",
    code: `import { Input } from '@/components/ui/input';

export function Example() {
  return <Input placeholder="Enter your email" />;
}`
  },
  {
    name: "Input Types",
    description: "Different input types for various data formats",
    componentId: "input-types",
    code: `import { Input } from '@/components/ui/input';

export function Example() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
        <Input 
          id="email" 
          type="email" 
          placeholder="user@example.com" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
        <Input 
          id="password" 
          type="password" 
          placeholder="Enter your password" 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="number" className="text-sm font-medium text-foreground">Number</label>
        <Input 
          id="number" 
          type="number" 
          placeholder="Enter a number" 
        />
      </div>
    </div>
  );
}`
  },
  {
    name: "Input with Label",
    description: "Input field with associated label and helper text",
    componentId: "input-label",
    code: `import { Input } from '@/components/ui/input';

export function Example() {
  return (
    <div className="space-y-2 w-full max-w-sm">
      <label htmlFor="username" className="text-sm font-medium text-foreground">Username</label>
      <Input 
        id="username" 
        placeholder="Enter your username" 
      />
      <p className="text-sm text-muted-foreground">
        This is your public display name.
      </p>
    </div>
  );
}`
  },
  {
    name: "Disabled Input",
    description: "Input fields in disabled and read-only states",
    componentId: "input-disabled",
    code: `import { Input } from '@/components/ui/input';

export function Example() {
  return (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <label htmlFor="disabled" className="text-sm font-medium text-foreground">Disabled Input</label>
        <Input 
          id="disabled" 
          placeholder="This input is disabled" 
          disabled 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="readonly" className="text-sm font-medium text-foreground">Read-only Input</label>
        <Input 
          id="readonly" 
          value="This input is read-only" 
          readOnly 
        />
      </div>
    </div>
  );
}`
  },
  {
    name: "Input with Validation",
    description: "Input with real-time validation and error feedback",
    componentId: "input-validation",
    code: `import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function Example() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !value.includes('@')) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  return (
    <div className="space-y-2 w-full max-w-sm">
      <label htmlFor="email-validation" className="text-sm font-medium text-foreground">Email Address</label>
      <Input 
        id="email-validation"
        type="email"
        placeholder="user@example.com"
        value={email}
        onChange={handleChange}
        aria-invalid={!!error}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {email && !error && (
        <p className="text-sm text-success">Valid email address</p>
      )}
    </div>
  );
}`
  }
];

// Component mapping for client-side resolution
export const exampleComponents = {
  'button-default': DefaultButtonExample,
  'button-variants': ButtonVariantsExample,
  'button-sizes': ButtonSizesExample,
  'context-menu-default': DefaultContextMenuExample,
  'context-menu-checkbox': ContextMenuWithCheckboxExample,
  'context-menu-radio': ContextMenuWithRadioExample,
  'context-menu-submenu': ContextMenuWithSubmenuExample,
  'context-menu-advanced': AdvancedContextMenuExample,
  'context-menu-inset': ContextMenuWithInsetExample,
  'alert-dialog-default': DefaultAlertDialogExample,
  'alert-dialog-controlled': ConfirmationAlertDialogExample,
  'accordion-default': DefaultAccordionExample,
  'accordion-multiple': MultipleAccordionExample,
  'checkbox-default': DefaultCheckboxExample,
  'checkbox-states': CheckboxStatesExample,
  'toast-default': DefaultToastExample,
  'toast-variants': ToastVariantsExample,
  'avatar-default': DefaultAvatarExample,
  'avatar-sizes': AvatarSizesExample,
  'toggle-default': DefaultToggleExample,
  'toggle-variants': ToggleVariantsExample,
  'popover-default': DefaultPopoverExample,
  'popover-close': PopoverWithCloseExample,
  'popover-positions': PopoverPositionExample,
  'popover-hover': PopoverHoverExample,
  'input-default': DefaultInputExample,
  'input-types': InputTypesExample,
  'input-label': InputWithLabelExample,
  'input-disabled': InputDisabledExample,
  'input-validation': InputWithValidationExample,
};

export const examplesRegistry = {
  button: buttonExamples,
  contextMenu: contextMenuExamples,
  alertDialog: alertDialogExamples,
  accordion: accordionExamples,
  checkbox: checkboxExamples,
  toast: toastExamples,
  avatar: avatarExamples,
  toggle: toggleExamples,
  popover: popoverExamples,
  input: inputExamples,
};
