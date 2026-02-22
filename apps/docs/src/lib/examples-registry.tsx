export type ComponentExample = {
  name: string;
  description: string;
  componentId: string;
  code: string;
};
import {
  DefaultButtonExample,
  ButtonVariantsExample,
  ButtonSizesExample,
  ButtonIconExample,
  ButtonIconWithTooltipExample,
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
  ToastLoadingExample,
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
import {
  DefaultFieldExample,
  FieldWithValidationExample,
  FieldWithErrorExample,
  RequiredFieldExample,
  DisabledFieldExample
} from '@/components/examples/field-examples';
import {
  DefaultCheckboxGroupExample,
  ControlledCheckboxGroupExample,
  HorizontalCheckboxGroupExample,
  DisabledCheckboxGroupExample
} from '@/components/examples/checkbox-group-examples';
import {
  DefaultSliderExample,
  SliderWithValueExample,
  RangeSliderExample,
  StepSliderExample,
  DisabledSliderExample
} from '@/components/examples/slider-examples';
import {
  DefaultCardExample,
  CardWithFooterExample,
  CardVariationsExample,
  InteractiveCardExample
} from '@/components/examples/card-examples';
import {
  DefaultDialogExample,
  ControlledDialogExample,
  DialogWithFormExample
} from '@/components/examples/dialog-examples';
import {
  DefaultTabsExample,
  ControlledTabsExample,
  TabsWithIndicatorExample,
  DisabledTabsExample
} from '@/components/examples/tabs-examples';
import {
  DefaultSelectExample,
  SelectWithGroupsExample,
  SelectWithIndicatorExample,
  ControlledSelectExample
} from '@/components/examples/select-examples';
import {
  DefaultTooltipExample,
  TooltipPositionsExample,
  TooltipVariantsExample
} from '@/components/examples/tooltip-examples';
import {
  DefaultMenuExample,
  MenuWithCheckboxExample,
  MenuWithRadioExample,
  MenuWithSubmenuExample
} from '@/components/examples/menu-examples';
import {
  DefaultDrawerExample,
  DrawerSidesExample,
  DrawerWithNavigationExample
} from '@/components/examples/drawer-examples';
import {
  DefaultMenubarExample,
  MenubarWithCheckboxExample,
  MenubarWithSubmenuExample
} from '@/components/examples/menubar-examples';
import {
  DefaultNavigationMenuExample,
  SimpleNavigationMenuExample
} from '@/components/examples/navigation-menu-examples';
import {
  DefaultComboboxExample,
  ComboboxWithGroupsExample,
  ComboboxWithClearExample
} from '@/components/examples/combobox-examples';
import {
  DefaultAutocompleteExample,
  AutocompleteWithGroupsExample,
  AutocompleteWithClearExample
} from '@/components/examples/autocomplete-examples';
import {
  DefaultFormExample,
  FormWithValidationExample,
  FormWithFieldsExample
} from '@/components/examples/form-examples';
import {
  DefaultRadioExample,
  ControlledRadioExample,
  DisabledRadioExample
} from '@/components/examples/radio-examples';
import {
  DefaultSwitchExample,
  ControlledSwitchExample,
  SwitchStatesExample
} from '@/components/examples/switch-examples';
import {
  DefaultToggleGroupExample,
  SingleToggleGroupExample,
  ToggleGroupSizesExample
} from '@/components/examples/toggle-group-examples';
import {
  DefaultProgressExample,
  ProgressWithLabelExample,
  AnimatedProgressExample
} from '@/components/examples/progress-examples';
import {
  DefaultMeterExample,
  MeterWithLabelExample,
  MeterLevelsExample
} from '@/components/examples/meter-examples';
import {
  DefaultNumberFieldExample,
  NumberFieldWithMinMaxExample,
  NumberFieldWithStepExample
} from '@/components/examples/number-field-examples';
import {
  DefaultBadgeExample,
  BadgeVariantsExample,
  BadgeSizesExample
} from '@/components/examples/badge-examples';
import {
  DefaultSeparatorExample,
  SeparatorOrientationsExample
} from '@/components/examples/separator-examples';
import {
  DefaultCollapsibleExample,
  ControlledCollapsibleExample
} from '@/components/examples/collapsible-examples';
import {
  DefaultScrollAreaExample,
  HorizontalScrollAreaExample
} from '@/components/examples/scroll-area-examples';
import {
  DefaultFieldsetExample,
  FieldsetWithMultipleGroupsExample
} from '@/components/examples/fieldset-examples';
import {
  DefaultPreviewCardExample,
  PreviewCardWithImageExample
} from '@/components/examples/preview-card-examples';
import {
  DefaultToolbarExample,
  ToolbarWithLabelsExample
} from '@/components/examples/toolbar-examples';

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
  },
  {
    name: "Icon Buttons",
    description: "Buttons with only icons for compact actions",
    componentId: "button-icon",
    code: `import { Button } from '@/components/ui/button';
import { Bold, Italic, Plus, Search, Trash2, Underline } from 'lucide-react';

export function Example() {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button variant="outline" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="destructive" size="icon">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}`
  },
  {
    name: "Icon Buttons with Tooltip",
    description: "Icon buttons with tooltips for accessibility using Base UI's render prop",
    componentId: "button-icon-tooltip",
    code: `import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Bold, Mail, Search, Trash2 } from 'lucide-react';

export function Example() {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" />}>
          <Mail className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Send email</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon" />}>
          <Search className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Search</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
          <Bold className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="destructive" size="icon" />}>
          <Trash2 className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
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

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        Delete Account
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
import {
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

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        Save Changes
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
    <Accordion defaultValue={["item-1"]} className="w-full">
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
    <Accordion multiple className="w-full">
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
    code: `import { ToastProvider, ToastPortal, ToastViewport, ToastList, createToastManager } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const toastManager = createToastManager();

export function Example() {
  const showToast = () => {
    toastManager.add({
      title: "Success",
      description: "Your message has been sent successfully.",
      type: "success"
    });
  };

  return (
    <ToastProvider toastManager={toastManager}>
      <Button onClick={showToast}>Show Toast</Button>
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}`
  },
  {
    name: "Toast Variants",
    description: "Different toast variants and types",
    componentId: "toast-variants",
    code: `import { ToastProvider, ToastPortal, ToastViewport, ToastList, createToastManager } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const toastManager = createToastManager();

export function Example() {
  const variants = {
    success: { title: "Success!", description: "Action completed.", type: "success" },
    error: { title: "Error", description: "Something went wrong.", type: "error" },
    warning: { title: "Warning", description: "Please review your input.", type: "warning" }
  };

  return (
    <ToastProvider toastManager={toastManager}>
      <div className="flex gap-2">
        {Object.entries(variants).map(([key, toast]) => (
          <Button key={key} onClick={() => toastManager.add(toast)} variant="outline">
            {key}
          </Button>
        ))}
      </div>
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}`
  },
  {
    name: "Loading Toast",
    description: "Loading toasts that update, with promise tracking and retry actions",
    componentId: "toast-loading",
    code: `import { ToastProvider, ToastPortal, ToastViewport, ToastList, useToastManager, createToastManager } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const toastManager = createToastManager();

function LoadingToastButtons() {
  const manager = useToastManager();

  const handleUpdate = () => {
    const id = manager.add({
      title: "Saving changes...",
      description: "Please wait while we save your data.",
      type: "loading",
      timeout: 0,
    });

    setTimeout(() => {
      manager.update(id, {
        title: "Changes saved",
        description: "Your data has been saved successfully.",
        type: "success",
        timeout: 5000,
      });
    }, 2000);
  };

  const handleUpdateWithError = () => {
    const id = manager.add({
      title: "Uploading file...",
      description: "Please wait while we upload your file.",
      type: "loading",
      timeout: 0,
    });

    setTimeout(() => {
      manager.update(id, {
        title: "Upload failed",
        description: "The file could not be uploaded.",
        type: "error",
        timeout: 5000,
        actionProps: {
          children: "Retry",
          onClick: () => {
            manager.update(id, {
              title: "Retrying upload...",
              description: "Attempting to upload again.",
              type: "loading",
              timeout: 0,
              actionProps: undefined,
            });
            setTimeout(() => {
              manager.update(id, {
                title: "Upload complete",
                description: "Your file has been uploaded.",
                type: "success",
                timeout: 5000,
              });
            }, 1500);
          },
        },
      });
    }, 2000);
  };

  const handlePromise = () => {
    const fakeRequest = new Promise((resolve) =>
      setTimeout(() => resolve("Done!"), 2500)
    );

    manager.promise(fakeRequest, {
      loading: {
        title: "Processing...",
        description: "Running your request.",
      },
      success: (result) => ({
        title: "Complete",
        description: \`Request finished: \${result}\`,
      }),
      error: (err) => ({
        title: "Request failed",
        description: err?.message || "Something went wrong.",
      }),
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={handleUpdate} variant="outline">
        Loading → Success
      </Button>
      <Button onClick={handleUpdateWithError} variant="outline">
        Loading → Error → Retry
      </Button>
      <Button onClick={handlePromise} variant="outline">
        Promise Toast
      </Button>
    </div>
  );
}

export function Example() {
  return (
    <ToastProvider toastManager={toastManager}>
      <LoadingToastButtons />
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
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

export const fieldExamples: ComponentExample[] = [
  {
    name: "Default Field",
    description: "A basic field with label, control, and description",
    componentId: "field-default",
    code: `import { Field, FieldLabel, FieldControl, FieldDescription } from '@/components/ui/field';

export function Example() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" placeholder="Enter your email" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  );
}`
  },
  {
    name: "Field with Validation",
    description: "Interactive field with real-time validation feedback",
    componentId: "field-validation",
    code: `import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from '@/components/ui/field';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = value.length >= 3;
  const showError = touched && !isValid;

  return (
    <Field invalid={showError} className="w-full max-w-sm">
      <FieldLabel>Username</FieldLabel>
      <FieldControl
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="Enter username"
      />
      <FieldDescription>Must be at least 3 characters.</FieldDescription>
      {showError && <FieldError>Username must be at least 3 characters</FieldError>}
    </Field>
  );
}`
  },
  {
    name: "Field with Error",
    description: "Field displaying an error state",
    componentId: "field-error",
    code: `import { Field, FieldLabel, FieldControl, FieldError } from '@/components/ui/field';

export function Example() {
  return (
    <Field invalid className="w-full max-w-sm">
      <FieldLabel>Password</FieldLabel>
      <FieldControl type="password" placeholder="Enter password" />
      <FieldError>Password is required</FieldError>
    </Field>
  );
}`
  },
  {
    name: "Required Field",
    description: "Fields marked as required with visual indicators",
    componentId: "field-required",
    code: `import { Field, FieldLabel, FieldControl, FieldDescription } from '@/components/ui/field';

export function Example() {
  return (
    <div className="space-y-4 w-full max-w-sm">
      <Field className="w-full">
        <FieldLabel>
          Full Name <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldControl placeholder="Enter your full name" required />
        <FieldDescription>Your legal name as it appears on documents.</FieldDescription>
      </Field>

      <Field className="w-full">
        <FieldLabel>
          Phone Number <span className="text-destructive">*</span>
        </FieldLabel>
        <FieldControl type="tel" placeholder="+1 (555) 000-0000" required />
        <FieldDescription>We'll use this for account recovery.</FieldDescription>
      </Field>
    </div>
  );
}`
  },
  {
    name: "Disabled Field",
    description: "Field in a disabled state",
    componentId: "field-disabled",
    code: `import { Field, FieldLabel, FieldControl, FieldDescription } from '@/components/ui/field';

export function Example() {
  return (
    <Field disabled className="w-full max-w-sm">
      <FieldLabel>Account ID</FieldLabel>
      <FieldControl value="ACC-12345-ABCDE" readOnly />
      <FieldDescription>This field cannot be modified.</FieldDescription>
    </Field>
  );
}`
  }
];

export const checkboxGroupExamples: ComponentExample[] = [
  {
    name: "Default Checkbox Group",
    description: "A basic checkbox group with multiple options",
    componentId: "checkbox-group-default",
    code: `import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Select your interests
      </label>
      <CheckboxGroup defaultValue={["design"]}>
        <div className="flex items-center space-x-2">
          <Checkbox id="design" name="interests" value="design" />
          <label htmlFor="design" className="text-sm text-foreground">Design</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="development" name="interests" value="development" />
          <label htmlFor="development" className="text-sm text-foreground">Development</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" name="interests" value="marketing" />
          <label htmlFor="marketing" className="text-sm text-foreground">Marketing</label>
        </div>
      </CheckboxGroup>
    </div>
  );
}`
  },
  {
    name: "Controlled Checkbox Group",
    description: "Checkbox group with controlled state and live value display",
    componentId: "checkbox-group-controlled",
    code: `import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export function Example() {
  const [selected, setSelected] = useState<string[]>(["react"]);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Select frameworks you know
      </label>
      <CheckboxGroup value={selected} onValueChange={setSelected}>
        <div className="flex items-center space-x-2">
          <Checkbox id="react" name="frameworks" value="react" />
          <label htmlFor="react" className="text-sm text-foreground">React</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="vue" name="frameworks" value="vue" />
          <label htmlFor="vue" className="text-sm text-foreground">Vue</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="angular" name="frameworks" value="angular" />
          <label htmlFor="angular" className="text-sm text-foreground">Angular</label>
        </div>
      </CheckboxGroup>
      <p className="text-sm text-muted-foreground">
        Selected: {selected.length > 0 ? selected.join(", ") : "None"}
      </p>
    </div>
  );
}`
  },
  {
    name: "Horizontal Checkbox Group",
    description: "Checkbox group with horizontal layout",
    componentId: "checkbox-group-horizontal",
    code: `import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Notification preferences
      </label>
      <CheckboxGroup defaultValue={["email"]} className="flex flex-row gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="email-notif" name="notifications" value="email" />
          <label htmlFor="email-notif" className="text-sm text-foreground">Email</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sms-notif" name="notifications" value="sms" />
          <label htmlFor="sms-notif" className="text-sm text-foreground">SMS</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="push-notif" name="notifications" value="push" />
          <label htmlFor="push-notif" className="text-sm text-foreground">Push</label>
        </div>
      </CheckboxGroup>
    </div>
  );
}`
  },
  {
    name: "Disabled Checkbox Group",
    description: "Checkbox group in disabled state",
    componentId: "checkbox-group-disabled",
    code: `import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        Plan features (upgrade to enable)
      </label>
      <CheckboxGroup disabled defaultValue={["basic"]}>
        <div className="flex items-center space-x-2">
          <Checkbox id="basic" name="features" value="basic" />
          <label htmlFor="basic" className="text-sm text-muted-foreground">Basic features</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="advanced" name="features" value="advanced" />
          <label htmlFor="advanced" className="text-sm text-muted-foreground">Advanced features</label>
        </div>
      </CheckboxGroup>
    </div>
  );
}`
  }
];

export const sliderExamples: ComponentExample[] = [
  {
    name: "Default Slider",
    description: "A basic slider for value selection",
    componentId: "slider-default",
    code: `import { Slider, SliderControl, SliderTrack, SliderRange, SliderThumb } from '@/components/ui/slider';

export function Example() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <label className="text-sm font-medium text-foreground">Volume</label>
      <Slider defaultValue={50}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb aria-label="Volume" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}`
  },
  {
    name: "Slider with Value Display",
    description: "Controlled slider showing current value",
    componentId: "slider-value",
    code: `import { Slider, SliderControl, SliderTrack, SliderRange, SliderThumb, SliderValue } from '@/components/ui/slider';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState(50);

  return (
    <div className="w-full max-w-sm space-y-4">
      <Slider value={value} onValueChange={(val) => setValue(val as number)}>
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-foreground">Brightness</label>
          <SliderValue className="text-sm text-muted-foreground" />
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb aria-label="Brightness" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}`
  },
  {
    name: "Range Slider",
    description: "Slider with two thumbs for selecting a range",
    componentId: "slider-range",
    code: `import { Slider, SliderControl, SliderTrack, SliderRange, SliderThumb } from '@/components/ui/slider';
import { useState } from 'react';

export function Example() {
  const [range, setRange] = useState([25, 75]);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Price Range</label>
        <span className="text-sm text-muted-foreground">
          \${range[0]} - \${range[1]}
        </span>
      </div>
      <Slider value={range} onValueChange={(val) => setRange(val as number[])}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb index={0} aria-label="Minimum price" />
            <SliderThumb index={1} aria-label="Maximum price" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}`
  },
  {
    name: "Step Slider",
    description: "Slider with defined step increments",
    componentId: "slider-step",
    code: `import { Slider, SliderControl, SliderTrack, SliderRange, SliderThumb } from '@/components/ui/slider';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState(50);
  const steps = [0, 25, 50, 75, 100];

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Quality</label>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Slider value={value} onValueChange={(val) => setValue(val as number)} step={25}>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb aria-label="Quality" />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <div className="flex justify-between text-xs text-muted-foreground">
        {steps.map((step) => (
          <span key={step}>{step}%</span>
        ))}
      </div>
    </div>
  );
}`
  },
  {
    name: "Disabled Slider",
    description: "Slider in disabled state",
    componentId: "slider-disabled",
    code: `import { Slider, SliderControl, SliderTrack, SliderRange, SliderThumb } from '@/components/ui/slider';

export function Example() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <label className="text-sm font-medium text-muted-foreground">
        Volume (Locked)
      </label>
      <Slider defaultValue={30} disabled>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            <SliderThumb aria-label="Volume" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}`
  }
];

export const cardExamples: ComponentExample[] = [
  {
    name: "Default Card",
    description: "A basic card with header and content",
    componentId: "card-default",
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function Example() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the main content area of the card.
        </p>
      </CardContent>
    </Card>
  );
}`
  },
  {
    name: "Card with Footer",
    description: "Card with header, content, and footer with actions",
    componentId: "card-footer",
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create a new account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input id="name" placeholder="John Doe" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" placeholder="john@example.com" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  );
}`
  },
  {
    name: "Card Variations",
    description: "Multiple card styles for pricing comparison",
    componentId: "card-variations",
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <div className="grid gap-4 md:grid-cols-2 w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Free Plan</CardTitle>
          <CardDescription>For personal use</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$0</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">Get Started</Button>
        </CardFooter>
      </Card>
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Pro Plan</CardTitle>
          <CardDescription>For teams and businesses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$29</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Subscribe</Button>
        </CardFooter>
      </Card>
    </div>
  );
}`
  },
  {
    name: "Interactive Card",
    description: "Card with hover effects and progress indicator",
    componentId: "card-interactive",
    code: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Card className="w-full max-w-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Status</CardTitle>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
        </div>
        <CardDescription>Last updated 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">75%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto">View Details →</Button>
      </CardFooter>
    </Card>
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

export const dialogExamples: ComponentExample[] = [
  {
    name: "Default Dialog",
    description: "A basic dialog with header, form fields, and footer actions",
    componentId: "dialog-default",
    code: `import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" defaultValue="John Doe" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <input id="username" defaultValue="@johndoe" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`
  },
  {
    name: "Controlled Dialog",
    description: "Dialog with controlled open state for confirmation flows",
    componentId: "dialog-controlled",
    code: `import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Delete Item</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`
  },
  {
    name: "Dialog with Form",
    description: "Dialog composing Input, Select, Radio, Checkbox, and Textarea inside a modal",
    componentId: "dialog-form",
    code: `import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radio, RadioGroup } from '@/components/ui/radio';
import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  const [severity, setSeverity] = React.useState("medium");

  return (
    <Dialog>
      <DialogTrigger>Create Rule</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Monitoring Rule</DialogTitle>
          <DialogDescription>
            Configure a rule to trigger notifications for important events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="rule-name" className="text-sm font-medium uppercase tracking-wide">Name</label>
              <Input id="rule-name" placeholder="Ex: NVDA" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium uppercase tracking-wide">Condition</label>
              <Select defaultValue="volatility">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                {/* portal={false} keeps the dropdown inside the dialog focus trap */}
                <SelectContent portal={false}>
                  <SelectItem value="price-above">Price above</SelectItem>
                  <SelectItem value="price-below">Price below</SelectItem>
                  <SelectItem value="volatility">Volatility</SelectItem>
                  <SelectItem value="volume-spike">Volume spike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide">Severity</label>
            <RadioGroup value={severity} onValueChange={(value) => setSeverity(value as string)} className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2.5 text-sm has-checked:border-primary has-checked:bg-primary/5"
                >
                  <Radio value={value} />
                  <span className="capitalize">{value}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide">Notify via</label>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: "Slack", defaultChecked: true }, { label: "Email", defaultChecked: true }, { label: "SMS", defaultChecked: false }].map((ch) => (
                <label
                  key={ch.label}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2.5 text-sm has-checked:border-primary has-checked:bg-primary/5"
                >
                  <Checkbox defaultChecked={ch.defaultChecked} />
                  <span>{ch.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="rule-notes" className="text-sm font-medium uppercase tracking-wide">Notes</label>
            <Textarea id="rule-notes" placeholder="Alert context, owner, and escalation path..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`
  }
];

export const tabsExamples: ComponentExample[] = [
  {
    name: "Default Tabs",
    description: "Basic tabs with multiple panels",
    componentId: "tabs-default",
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function Example() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-2 pt-4">
        <h3 className="text-sm font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="password" className="space-y-2 pt-4">
        <h3 className="text-sm font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password and security settings.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="space-y-2 pt-4">
        <h3 className="text-sm font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your application preferences.
        </p>
      </TabsContent>
    </Tabs>
  );
}`
  },
  {
    name: "Controlled Tabs",
    description: "Tabs with controlled active state",
    componentId: "tabs-controlled",
    code: `import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function Example() {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="w-full max-w-md space-y-2">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <div className="rounded-md border p-4">
            <p className="text-sm">Overview content for your dashboard.</p>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="pt-4">
          <div className="rounded-md border p-4">
            <p className="text-sm">Analytics data and charts.</p>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="pt-4">
          <div className="rounded-md border p-4">
            <p className="text-sm">Generated reports and exports.</p>
          </div>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground">Active tab: {activeTab}</p>
    </div>
  );
}`
  },
  {
    name: "Tabs with Indicator",
    description: "Tabs with an animated indicator bar",
    componentId: "tabs-indicator",
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator } from '@/components/ui/tabs';

export function Example() {
  return (
    <Tabs defaultValue="music" className="w-full max-w-md">
      <TabsList className="relative">
        <TabsTrigger value="music">Music</TabsTrigger>
        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        <TabsTrigger value="audiobooks">Audiobooks</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="music" className="pt-4">
        <p className="text-sm text-muted-foreground">Browse your music library.</p>
      </TabsContent>
      <TabsContent value="podcasts" className="pt-4">
        <p className="text-sm text-muted-foreground">Discover new podcasts.</p>
      </TabsContent>
      <TabsContent value="audiobooks" className="pt-4">
        <p className="text-sm text-muted-foreground">Listen to audiobooks.</p>
      </TabsContent>
    </Tabs>
  );
}`
  },
  {
    name: "Disabled Tab",
    description: "Tabs with a disabled tab trigger",
    componentId: "tabs-disabled",
    code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function Example() {
  return (
    <Tabs defaultValue="active" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="pt-4">
        <p className="text-sm text-muted-foreground">Active content is visible here.</p>
      </TabsContent>
      <TabsContent value="archived" className="pt-4">
        <p className="text-sm text-muted-foreground">Archived items are shown here.</p>
      </TabsContent>
    </Tabs>
  );
}`
  }
];

export const selectExamples: ComponentExample[] = [
  {
    name: "Default Select",
    description: "A basic select with simple options",
    componentId: "select-default",
    code: `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export function Example() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  );
}`
  },
  {
    name: "Select with Groups",
    description: "Select with grouped and labeled options",
    componentId: "select-groups",
    code: `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';

export function Example() {
  return (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern (EST)</SelectItem>
          <SelectItem value="cst">Central (CST)</SelectItem>
          <SelectItem value="pst">Pacific (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">GMT</SelectItem>
          <SelectItem value="cet">Central European (CET)</SelectItem>
          <SelectItem value="eet">Eastern European (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}`
  },
  {
    name: "Select with Indicator",
    description: "Select items with a check indicator for the selected item",
    componentId: "select-indicator",
    code: `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export function Example() {
  return (
    <Select defaultValue="medium">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low" showIndicator>Low</SelectItem>
        <SelectItem value="medium" showIndicator>Medium</SelectItem>
        <SelectItem value="high" showIndicator>High</SelectItem>
        <SelectItem value="critical" showIndicator>Critical</SelectItem>
      </SelectContent>
    </Select>
  );
}`
  },
  {
    name: "Controlled Select",
    description: "Select with controlled value and disabled option",
    componentId: "select-controlled",
    code: `import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export function Example() {
  const [value, setValue] = React.useState('');

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="guest" disabled>Guest (Disabled)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Selected: {value || 'None'}
      </p>
    </div>
  );
}`
  }
];

export const tooltipExamples: ComponentExample[] = [
  {
    name: "Default Tooltip",
    description: "A basic tooltip on a button",
    componentId: "tooltip-default",
    code: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';

export function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Plus className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          Add new item
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`
  },
  {
    name: "Tooltip Positions",
    description: "Tooltips placed on different sides of the trigger",
    componentId: "tooltip-positions",
    code: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

export function Example() {
  return (
    <TooltipProvider>
      <div className="flex gap-4 flex-wrap">
        <Tooltip>
          <TooltipTrigger variant="outline">Top</TooltipTrigger>
          <TooltipContent side="top">Tooltip on top</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger variant="outline">Bottom</TooltipTrigger>
          <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger variant="outline">Left</TooltipTrigger>
          <TooltipContent side="left">Tooltip on left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger variant="outline">Right</TooltipTrigger>
          <TooltipContent side="right">Tooltip on right</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}`
  },
  {
    name: "Tooltip Variants",
    description: "Default and inverse tooltip visual styles",
    componentId: "tooltip-variants",
    code: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Settings, Trash2 } from 'lucide-react';

export function Example() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger variant="outline">
            <Settings className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent variant="default">Default tooltip</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger variant="outline">
            <Trash2 className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent variant="inverse">Inverse tooltip</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}`
  }
];

export const menuExamples: ComponentExample[] = [
  {
    name: "Default Menu",
    description: "A basic menu with items, shortcuts, and separators",
    componentId: "menu-default",
    code: `import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuLabel,
} from '@/components/ui/menu';

export function Example() {
  return (
    <Menu>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuContent>
        <MenuLabel>My Account</MenuLabel>
        <MenuSeparator />
        <MenuItem>
          Profile
          <MenuShortcut>⌘P</MenuShortcut>
        </MenuItem>
        <MenuItem>
          Settings
          <MenuShortcut>⌘S</MenuShortcut>
        </MenuItem>
        <MenuItem>
          Keyboard Shortcuts
          <MenuShortcut>⌘K</MenuShortcut>
        </MenuItem>
        <MenuSeparator />
        <MenuItem>Log out</MenuItem>
      </MenuContent>
    </Menu>
  );
}`
  },
  {
    name: "Menu with Checkboxes",
    description: "Menu with toggleable checkbox items",
    componentId: "menu-checkbox",
    code: `import React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuLabel,
  MenuSeparator,
  MenuCheckboxItem,
} from '@/components/ui/menu';

export function Example() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showActivity, setShowActivity] = React.useState(false);

  return (
    <Menu>
      <MenuTrigger>View Options</MenuTrigger>
      <MenuContent>
        <MenuLabel>Appearance</MenuLabel>
        <MenuSeparator />
        <MenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
          Show Status Bar
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
          Show Activity Panel
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
  );
}`
  },
  {
    name: "Menu with Radio Group",
    description: "Menu with radio items for single selection",
    componentId: "menu-radio",
    code: `import React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuLabel,
  MenuSeparator,
  MenuRadioGroup,
  MenuRadioItem,
} from '@/components/ui/menu';

export function Example() {
  const [theme, setTheme] = React.useState('system');

  return (
    <Menu>
      <MenuTrigger>Theme</MenuTrigger>
      <MenuContent>
        <MenuLabel>Select Theme</MenuLabel>
        <MenuSeparator />
        <MenuRadioGroup value={theme} onValueChange={setTheme}>
          <MenuRadioItem value="light">Light</MenuRadioItem>
          <MenuRadioItem value="dark">Dark</MenuRadioItem>
          <MenuRadioItem value="system">System</MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}`
  },
  {
    name: "Menu with Submenu",
    description: "Menu with nested submenus for hierarchical actions",
    componentId: "menu-submenu",
    code: `import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from '@/components/ui/menu';

export function Example() {
  return (
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem>New File</MenuItem>
        <MenuItem>New Window</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Share</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Email</MenuItem>
            <MenuItem>Messages</MenuItem>
            <MenuItem>Copy Link</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem>Print</MenuItem>
      </MenuContent>
    </Menu>
  );
}`
  }
];

export const drawerExamples: ComponentExample[] = [
  {
    name: "Default Drawer",
    description: "A drawer panel with form content sliding from the right",
    componentId: "drawer-default",
    code: `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile settings.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input defaultValue="John Doe" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" defaultValue="john@example.com" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}`
  },
  {
    name: "Drawer Sides",
    description: "Drawers can slide in from any edge of the screen",
    componentId: "drawer-sides",
    code: `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Drawer key={side}>
          <DrawerTrigger asChild>
            <Button variant="outline">{side.charAt(0).toUpperCase() + side.slice(1)}</Button>
          </DrawerTrigger>
          <DrawerContent side={side}>
            <DrawerHeader>
              <DrawerTitle>{side.charAt(0).toUpperCase() + side.slice(1)} Drawer</DrawerTitle>
              <DrawerDescription>This drawer slides in from the {side}.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}`
  },
  {
    name: "Navigation Drawer",
    description: "Drawer used as a sidebar navigation panel",
    componentId: "drawer-navigation",
    code: `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Navigation</Button>
      </DrawerTrigger>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-1">
          {['Dashboard', 'Projects', 'Team', 'Settings', 'Help'].map((item) => (
            <a key={item} href="#" className="rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
              {item}
            </a>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}`
  }
];

export const menubarExamples: ComponentExample[] = [
  {
    name: "Default Menubar",
    description: "A complete menubar with File, Edit, and View menus",
    componentId: "menubar-default",
    code: `import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/components/ui/menubar';

export function Example() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
              <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
              <MenubarItem>Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
              <MenubarItem>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
              <MenubarItem>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>Zoom In <MenubarShortcut>⌘+</MenubarShortcut></MenubarItem>
              <MenubarItem>Zoom Out <MenubarShortcut>⌘-</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Toggle Fullscreen</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}`
  },
  {
    name: "Menubar with Checkboxes",
    description: "Menubar with toggleable checkbox items",
    componentId: "menubar-checkbox",
    code: `import React from 'react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
  MenubarGroup,
  MenubarLabel,
} from '@/components/ui/menubar';

export function Example() {
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showSidebar, setShowSidebar] = React.useState(false);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel>Panels</MenubarLabel>
                <MenubarSeparator />
                <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
                  Show Toolbar
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
                  Show Sidebar
                </MenubarCheckboxItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarItem>Toggle Fullscreen</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}`
  },
  {
    name: "Menubar with Submenu",
    description: "Menubar with nested submenus for recent files",
    componentId: "menubar-submenu",
    code: `import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarPortal,
  MenubarPositioner,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from '@/components/ui/menubar';

export function Example() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarPositioner>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>project-a.ts</MenubarItem>
                  <MenubarItem>readme.md</MenubarItem>
                  <MenubarItem>config.json</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Save All</MenubarItem>
            </MenubarContent>
          </MenubarPositioner>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
}`
  }
];

export const navigationMenuExamples: ComponentExample[] = [
  {
    name: "Default Navigation Menu",
    description: "Navigation menu with dropdown content panels",
    componentId: "navigation-menu-default",
    code: `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
} from '@/components/ui/navigation-menu';

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuPortal>
            <NavigationMenuPositioner>
              <NavigationMenuPopup>
                <NavigationMenuContent className="p-4 md:w-[400px]">
                  <ul className="grid gap-3">
                    <li>
                      <NavigationMenuLink href="#">
                        <div className="text-sm font-medium">Introduction</div>
                        <p className="text-xs text-muted-foreground">
                          Learn the basics and get up and running quickly.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#">
                        <div className="text-sm font-medium">Installation</div>
                        <p className="text-xs text-muted-foreground">
                          Step-by-step guide to install and configure.
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuPopup>
            </NavigationMenuPositioner>
          </NavigationMenuPortal>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}`
  },
  {
    name: "Simple Navigation",
    description: "Navigation menu with plain links only",
    componentId: "navigation-menu-simple",
    code: `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {['Home', 'About', 'Blog', 'Contact'].map((item) => (
          <NavigationMenuItem key={item}>
            <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              {item}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}`
  }
];

export const comboboxExamples: ComponentExample[] = [
  {
    name: "Default Combobox",
    description: "A searchable combobox for selecting from a list",
    componentId: "combobox-default",
    code: `import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';

const frameworks = ["React", "Vue", "Angular", "Svelte", "Solid", "Next.js", "Nuxt", "Remix"];

export function Example() {
  return (
    <Combobox items={frameworks} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <ComboboxInput placeholder="Search frameworks..." className="border-0 focus:ring-0" />
        <ComboboxTrigger className="border-0" />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList>
          {(fw: string) => (
            <ComboboxItem key={fw} value={fw}>
              {fw}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}`
  },
  {
    name: "Combobox with Groups",
    description: "Combobox with labeled option groups",
    componentId: "combobox-groups",
    code: `import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
} from '@/components/ui/combobox';

const languages = [
  { value: "Frontend", items: ["JavaScript", "TypeScript", "HTML", "CSS"] },
  { value: "Backend", items: ["Python", "Go", "Rust", "Java"] },
];

export function Example() {
  return (
    <Combobox items={languages} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <ComboboxInput placeholder="Search languages..." className="border-0 focus:ring-0" />
        <ComboboxTrigger className="border-0" />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No results found.</ComboboxEmpty>
        <ComboboxList>
          {(group: { value: string; items: string[] }) => (
            <ComboboxGroup key={group.value}>
              <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
              {group.items.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}`
  },
  {
    name: "Combobox with Clear",
    description: "Combobox with a clear button to reset selection",
    componentId: "combobox-clear",
    code: `import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox';

const countries = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan"];

export function Example() {
  return (
    <Combobox items={countries} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <ComboboxInput placeholder="Select a country..." className="border-0 focus:ring-0" />
        <ComboboxClear />
        <ComboboxTrigger className="border-0" />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {(country: string) => (
            <ComboboxItem key={country} value={country}>
              {country}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}`
  }
];

export const autocompleteExamples: ComponentExample[] = [
  {
    name: "Default Autocomplete",
    description: "A text input with type-ahead suggestions",
    componentId: "autocomplete-default",
    code: `import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from '@/components/ui/autocomplete';

const cities = ["New York", "San Francisco", "London", "Tokyo", "Paris", "Berlin", "Sydney"];

export function Example() {
  return (
    <Autocomplete items={cities} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search cities..." className="border-0 focus:ring-0" />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteEmpty>No cities found.</AutocompleteEmpty>
        <AutocompleteList>
          {(city: string) => (
            <AutocompleteItem key={city} value={city}>
              {city}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}`
  },
  {
    name: "Autocomplete with Groups",
    description: "Autocomplete with grouped suggestion categories",
    componentId: "autocomplete-groups",
    code: `import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteCollection,
} from '@/components/ui/autocomplete';

const foods = [
  { value: "Fruits", items: ["Apple", "Banana", "Mango"] },
  { value: "Vegetables", items: ["Carrot", "Broccoli", "Spinach"] },
];

export function Example() {
  return (
    <Autocomplete items={foods} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search foods..." className="border-0 focus:ring-0" />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteEmpty>No results found.</AutocompleteEmpty>
        <AutocompleteList>
          {(group: { value: string; items: string[] }) => (
            <AutocompleteGroup key={group.value}>
              <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
              {group.items.map((item) => (
                <AutocompleteItem key={item} value={item}>
                  {item}
                </AutocompleteItem>
              ))}
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}`
  },
  {
    name: "Autocomplete with Clear",
    description: "Autocomplete with a clear button to reset input",
    componentId: "autocomplete-clear",
    code: `import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from '@/components/ui/autocomplete';

const colors = ["Red", "Blue", "Green", "Purple", "Orange", "Yellow"];

export function Example() {
  return (
    <Autocomplete items={colors} openOnInputClick>
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input">
        <AutocompleteInput placeholder="Search colors..." className="border-0 focus:ring-0" />
        <AutocompleteClear />
        <AutocompleteTrigger className="border-0" />
      </div>
      <AutocompleteContent>
        <AutocompleteEmpty>No colors found.</AutocompleteEmpty>
        <AutocompleteList>
          {(color: string) => (
            <AutocompleteItem key={color} value={color}>
              {color}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}`
  }
];

export const formExamples: ComponentExample[] = [
  {
    name: "Default Form",
    description: "A basic form with field components",
    componentId: "form-default",
    code: `import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldControl } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Form className="w-full max-w-sm space-y-4">
      <Field name="name">
        <FieldLabel>Name</FieldLabel>
        <FieldControl placeholder="Enter your name" required />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" placeholder="you@example.com" required />
      </Field>
      <Button type="submit">Submit</Button>
    </Form>
  );
}`
  },
  {
    name: "Form with Validation",
    description: "Form with error handling on submit",
    componentId: "form-validation",
    code: `import React from 'react';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldControl, FieldError } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export function Example() {
  const [errors, setErrors] = React.useState({});

  const handleFormSubmit = (values) => {
    const newErrors = {};
    if (!values.username) newErrors.username = 'Username is required';
    if (!values.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
  };

  return (
    <Form errors={errors} onFormSubmit={handleFormSubmit} className="w-full max-w-sm space-y-4">
      <Field name="username" invalid={!!errors.username}>
        <FieldLabel>Username</FieldLabel>
        <FieldControl placeholder="Choose a username" />
        {errors.username && <FieldError>{errors.username}</FieldError>}
      </Field>
      <Field name="password" invalid={!!errors.password}>
        <FieldLabel>Password</FieldLabel>
        <FieldControl type="password" placeholder="Enter password" />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </Field>
      <Button type="submit">Sign Up</Button>
    </Form>
  );
}`
  },
  {
    name: "Contact Form",
    description: "A complete contact form with multiple field types",
    componentId: "form-contact",
    code: `import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldControl } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <Form className="w-full max-w-sm space-y-4">
      <Field name="firstName">
        <FieldLabel>First Name</FieldLabel>
        <FieldControl placeholder="John" />
      </Field>
      <Field name="lastName">
        <FieldLabel>Last Name</FieldLabel>
        <FieldControl placeholder="Doe" />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl type="email" placeholder="john@example.com" />
      </Field>
      <div className="flex gap-2">
        <Button type="submit">Send</Button>
        <Button type="reset" variant="outline">Reset</Button>
      </div>
    </Form>
  );
}`
  }
];

export const radioExamples: ComponentExample[] = [
  {
    name: "Default Radio",
    description: "A basic radio group with preset options",
    componentId: "radio-default",
    code: `import { Radio, RadioGroup } from '@/components/ui/radio';

export function Example() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <Radio value="default" id="r1" />
        <label htmlFor="r1" className="text-sm font-medium">Default</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="comfortable" id="r2" />
        <label htmlFor="r2" className="text-sm font-medium">Comfortable</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="compact" id="r3" />
        <label htmlFor="r3" className="text-sm font-medium">Compact</label>
      </div>
    </RadioGroup>
  );
}`
  },
  {
    name: "Controlled Radio",
    description: "Radio group with controlled state and value display",
    componentId: "radio-controlled",
    code: `import React from 'react';
import { Radio, RadioGroup } from '@/components/ui/radio';

export function Example() {
  const [value, setValue] = React.useState('email');

  return (
    <div className="space-y-3">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center space-x-2">
          <Radio value="email" id="notify-email" />
          <label htmlFor="notify-email" className="text-sm font-medium">Email</label>
        </div>
        <div className="flex items-center space-x-2">
          <Radio value="sms" id="notify-sms" />
          <label htmlFor="notify-sms" className="text-sm font-medium">SMS</label>
        </div>
        <div className="flex items-center space-x-2">
          <Radio value="push" id="notify-push" />
          <label htmlFor="notify-push" className="text-sm font-medium">Push Notification</label>
        </div>
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  );
}`
  },
  {
    name: "Disabled Radio",
    description: "Radio group in disabled state",
    componentId: "radio-disabled",
    code: `import { Radio, RadioGroup } from '@/components/ui/radio';

export function Example() {
  return (
    <RadioGroup defaultValue="active" disabled>
      <div className="flex items-center space-x-2">
        <Radio value="active" id="d1" />
        <label htmlFor="d1" className="text-sm font-medium text-muted-foreground">Active</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="inactive" id="d2" />
        <label htmlFor="d2" className="text-sm font-medium text-muted-foreground">Inactive</label>
      </div>
    </RadioGroup>
  );
}`
  }
];

export const switchExamples: ComponentExample[] = [
  {
    name: "Default Switch",
    description: "A basic switch toggle",
    componentId: "switch-default",
    code: `import { Switch, SwitchThumb } from '@/components/ui/switch';

export function Example() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode">
        <SwitchThumb />
      </Switch>
      <label htmlFor="airplane-mode" className="text-sm font-medium">
        Airplane Mode
      </label>
    </div>
  );
}`
  },
  {
    name: "Controlled Switch",
    description: "Switch with controlled state and status display",
    componentId: "switch-controlled",
    code: `import React from 'react';
import { Switch, SwitchThumb } from '@/components/ui/switch';

export function Example() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch checked={enabled} onCheckedChange={setEnabled}>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium">Dark Mode</label>
      </div>
      <p className="text-sm text-muted-foreground">
        Status: {enabled ? 'Enabled' : 'Disabled'}
      </p>
    </div>
  );
}`
  },
  {
    name: "Switch States",
    description: "Switches in different states including disabled",
    componentId: "switch-states",
    code: `import { Switch, SwitchThumb } from '@/components/ui/switch';

export function Example() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium">Notifications (on)</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium">Marketing emails (off)</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled>
          <SwitchThumb />
        </Switch>
        <label className="text-sm font-medium text-muted-foreground">Disabled</label>
      </div>
    </div>
  );
}`
  }
];

export const toggleGroupExamples: ComponentExample[] = [
  {
    name: "Default Toggle Group",
    description: "A toggle group with multiple selection",
    componentId: "toggle-group-default",
    code: `import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';

export function Example() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}`
  },
  {
    name: "Single Toggle Group",
    description: "Toggle group with single selection mode",
    componentId: "toggle-group-single",
    code: `import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function Example() {
  return (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}`
  },
  {
    name: "Toggle Group Sizes",
    description: "Toggle groups in different sizes",
    componentId: "toggle-group-sizes",
    code: `import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic } from 'lucide-react';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" size="sm" aria-label="Bold">
          <Bold className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="sm" aria-label="Italic">
          <Italic className="h-3 w-3" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" size="default" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="default" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" size="lg" aria-label="Bold">
          <Bold className="h-5 w-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="lg" aria-label="Italic">
          <Italic className="h-5 w-5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}`
  }
];

export const progressExamples: ComponentExample[] = [
  {
    name: "Default Progress",
    description: "A basic progress bar",
    componentId: "progress-default",
    code: `import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';

export function Example() {
  return (
    <Progress value={60} className="w-full max-w-sm">
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}`
  },
  {
    name: "Progress with Label",
    description: "Progress bar with label and percentage value",
    componentId: "progress-label",
    code: `import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from '@/components/ui/progress';

export function Example() {
  return (
    <Progress value={75} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <ProgressLabel>Uploading...</ProgressLabel>
        <ProgressValue />
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}`
  },
  {
    name: "Animated Progress",
    description: "Progress bar with animated value changes",
    componentId: "progress-animated",
    code: `import React from 'react';
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel } from '@/components/ui/progress';

export function Example() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Progress value={progress} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <ProgressLabel>Loading</ProgressLabel>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}`
  }
];

export const meterExamples: ComponentExample[] = [
  {
    name: "Default Meter",
    description: "A basic meter gauge",
    componentId: "meter-default",
    code: `import { Meter, MeterTrack, MeterIndicator } from '@/components/ui/meter';

export function Example() {
  return (
    <Meter value={40} className="w-full max-w-sm">
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}`
  },
  {
    name: "Meter with Label",
    description: "Meter with descriptive label and value",
    componentId: "meter-label",
    code: `import { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue } from '@/components/ui/meter';

export function Example() {
  return (
    <Meter value={72} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <MeterLabel>Storage Used</MeterLabel>
        <MeterValue />
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}`
  },
  {
    name: "Meter Levels",
    description: "Meters showing different severity levels with colors",
    componentId: "meter-levels",
    code: `import { Meter, MeterTrack, MeterIndicator, MeterLabel } from '@/components/ui/meter';

export function Example() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Meter value={25} className="w-full">
        <div className="flex items-center justify-between">
          <MeterLabel>CPU Usage</MeterLabel>
          <span className="text-xs text-muted-foreground">25%</span>
        </div>
        <MeterTrack>
          <MeterIndicator className="bg-green-500" />
        </MeterTrack>
      </Meter>
      <Meter value={65} className="w-full">
        <div className="flex items-center justify-between">
          <MeterLabel>Memory</MeterLabel>
          <span className="text-xs text-muted-foreground">65%</span>
        </div>
        <MeterTrack>
          <MeterIndicator className="bg-yellow-500" />
        </MeterTrack>
      </Meter>
      <Meter value={90} className="w-full">
        <div className="flex items-center justify-between">
          <MeterLabel>Disk Space</MeterLabel>
          <span className="text-xs text-muted-foreground">90%</span>
        </div>
        <MeterTrack>
          <MeterIndicator className="bg-red-500" />
        </MeterTrack>
      </Meter>
    </div>
  );
}`
  }
];

export const numberFieldExamples: ComponentExample[] = [
  {
    name: "Default Number Field",
    description: "A basic number input with increment/decrement buttons",
    componentId: "number-field-default",
    code: `import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from '@/components/ui/number-field';

export function Example() {
  return (
    <NumberField defaultValue={5} className="w-[180px]">
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}`
  },
  {
    name: "Number Field with Min/Max",
    description: "Number field with minimum and maximum constraints",
    componentId: "number-field-minmax",
    code: `import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from '@/components/ui/number-field';

export function Example() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quantity (1-10)</label>
      <NumberField defaultValue={1} min={1} max={10} className="w-[180px]">
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}`
  },
  {
    name: "Number Field with Step",
    description: "Number field with decimal step increments",
    componentId: "number-field-step",
    code: `import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from '@/components/ui/number-field';

export function Example() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Price ($)</label>
      <NumberField defaultValue={9.99} step={0.01} min={0} className="w-[180px]">
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}`
  }
];

export const badgeExamples: ComponentExample[] = [
  {
    name: "Default Badge",
    description: "A basic badge",
    componentId: "badge-default",
    code: `import { Badge } from '@/components/ui/badge';

export function Example() {
  return <Badge>Badge</Badge>;
}`
  },
  {
    name: "Badge Variants",
    description: "Different badge variants for various contexts",
    componentId: "badge-variants",
    code: `import { Badge } from '@/components/ui/badge';

export function Example() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  );
}`
  },
  {
    name: "Badge Sizes",
    description: "Badges in different sizes",
    componentId: "badge-sizes",
    code: `import { Badge } from '@/components/ui/badge';

export function Example() {
  return (
    <div className="flex gap-2 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}`
  }
];

export const separatorExamples: ComponentExample[] = [
  {
    name: "Default Separator",
    description: "A basic separator with horizontal and vertical usage",
    componentId: "separator-default",
    code: `import { Separator } from '@/components/ui/separator';

export function Example() {
  return (
    <div className="w-full max-w-sm">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Dinachi UI</h4>
        <p className="text-sm text-muted-foreground">
          An accessible component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
        <Separator orientation="vertical" />
        <div>Blog</div>
      </div>
    </div>
  );
}`
  },
  {
    name: "Separator Orientations",
    description: "Separators in horizontal and vertical orientations",
    componentId: "separator-orientations",
    code: `import { Separator } from '@/components/ui/separator';

export function Example() {
  return (
    <div className="space-y-6 w-full max-w-sm">
      <div>
        <p className="text-sm font-medium mb-2">Horizontal</p>
        <Separator />
      </div>
      <div className="flex items-center space-x-4 h-8">
        <span className="text-sm">Item A</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Item B</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Item C</span>
      </div>
    </div>
  );
}`
  }
];

export const collapsibleExamples: ComponentExample[] = [
  {
    name: "Default Collapsible",
    description: "A basic collapsible section",
    componentId: "collapsible-default",
    code: `import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export function Example() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger>
        <span>View more details</span>
        <ChevronDown className="h-4 w-4 transition-transform" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="px-4 pb-4 text-sm text-muted-foreground">
          This is the collapsible content. It can contain any elements you need,
          including text, images, or other components.
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}`
  },
  {
    name: "Controlled Collapsible",
    description: "Collapsible with controlled open state and status display",
    componentId: "collapsible-controlled",
    code: `import React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full max-w-sm space-y-2">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <span>{open ? 'Hide' : 'Show'} settings</span>
          <ChevronDown className="h-4 w-4 transition-transform" />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="space-y-2 px-4 pb-4">
            <div className="rounded-md border px-4 py-3 text-sm">Setting 1</div>
            <div className="rounded-md border px-4 py-3 text-sm">Setting 2</div>
            <div className="rounded-md border px-4 py-3 text-sm">Setting 3</div>
          </div>
        </CollapsiblePanel>
      </Collapsible>
      <p className="text-xs text-muted-foreground px-4">
        State: {open ? 'Open' : 'Closed'}
      </p>
    </div>
  );
}`
  }
];

export const scrollAreaExamples: ComponentExample[] = [
  {
    name: "Default Scroll Area",
    description: "A scroll area with a list of items",
    componentId: "scroll-area-default",
    code: `import { ScrollArea, ScrollAreaViewport, ScrollAreaContent, ScrollAreaScrollbar, ScrollAreaThumb } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => \`v1.2.0-beta.\${a.length - i}\`
);

export function Example() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag) => (
              <div key={tag}>
                <div className="text-sm">{tag}</div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
}`
  },
  {
    name: "Horizontal Scroll Area",
    description: "Scroll area with horizontal scrolling",
    componentId: "scroll-area-horizontal",
    code: `import { ScrollArea, ScrollAreaViewport, ScrollAreaContent, ScrollAreaScrollbar, ScrollAreaThumb } from '@/components/ui/scroll-area';

export function Example() {
  const items = Array.from({ length: 20 }).map((_, i) => ({
    title: \`Item \${i + 1}\`,
    color: \`hsl(\${i * 18}, 70%, 80%)\`,
  }));

  return (
    <ScrollArea className="w-full max-w-md rounded-md border">
      <ScrollAreaViewport>
        <ScrollAreaContent>
          <div className="flex gap-3 p-4">
            {items.map((item) => (
              <div
                key={item.title}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md text-xs font-medium"
                style={{ backgroundColor: item.color }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollArea>
  );
}`
  }
];

export const fieldsetExamples: ComponentExample[] = [
  {
    name: "Default Fieldset",
    description: "A basic fieldset with form fields",
    componentId: "fieldset-default",
    code: `import { Fieldset, FieldsetLegend } from '@/components/ui/fieldset';
import { Field, FieldLabel, FieldControl } from '@/components/ui/field';

export function Example() {
  return (
    <Fieldset className="w-full max-w-sm">
      <FieldsetLegend>Personal Information</FieldsetLegend>
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <FieldControl placeholder="John" />
      </Field>
      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <FieldControl placeholder="Doe" />
      </Field>
    </Fieldset>
  );
}`
  },
  {
    name: "Fieldset with Multiple Groups",
    description: "Multiple fieldsets for organizing form sections",
    componentId: "fieldset-groups",
    code: `import { Fieldset, FieldsetLegend } from '@/components/ui/fieldset';
import { Field, FieldLabel, FieldControl } from '@/components/ui/field';

export function Example() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Fieldset>
        <FieldsetLegend>Account Details</FieldsetLegend>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldControl type="email" placeholder="you@example.com" />
        </Field>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <FieldControl placeholder="johndoe" />
        </Field>
      </Fieldset>
      <Fieldset>
        <FieldsetLegend>Address</FieldsetLegend>
        <Field>
          <FieldLabel>Street</FieldLabel>
          <FieldControl placeholder="123 Main St" />
        </Field>
        <Field>
          <FieldLabel>City</FieldLabel>
          <FieldControl placeholder="New York" />
        </Field>
      </Fieldset>
    </div>
  );
}`
  }
];

export const previewCardExamples: ComponentExample[] = [
  {
    name: "Default Preview Card",
    description: "A basic hover preview card",
    componentId: "preview-card-default",
    code: `import { PreviewCard, PreviewCardTrigger, PreviewCardContent } from '@/components/ui/preview-card';

export function Example() {
  return (
    <PreviewCard>
      <PreviewCardTrigger href="#">
        Hover over this link
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Preview Card</h4>
          <p className="text-sm text-muted-foreground">
            This card appears on hover to show a preview of the linked content.
          </p>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}`
  },
  {
    name: "Preview Card with Profile",
    description: "Preview card with avatar and profile information",
    componentId: "preview-card-image",
    code: `import { PreviewCard, PreviewCardTrigger, PreviewCardContent } from '@/components/ui/preview-card';

export function Example() {
  return (
    <PreviewCard>
      <PreviewCardTrigger href="#">
        @dinachi
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              D
            </div>
            <div>
              <h4 className="text-sm font-semibold">Dinachi UI</h4>
              <p className="text-xs text-muted-foreground">@dinachi</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            A modern React component library built with Base UI and Tailwind CSS.
          </p>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}`
  }
];

export const toolbarExamples: ComponentExample[] = [
  {
    name: "Default Toolbar",
    description: "A toolbar with formatting buttons, separators, and a link",
    componentId: "toolbar-default",
    code: `import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup, ToolbarLink } from '@/components/ui/toolbar';
import { Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function Example() {
  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarLink href="#">
        <Link className="mr-1 h-4 w-4" />
        Insert Link
      </ToolbarLink>
    </Toolbar>
  );
}`
  },
  {
    name: "Toolbar with Labels",
    description: "Toolbar buttons with text labels",
    componentId: "toolbar-labels",
    code: `import { Toolbar, ToolbarButton, ToolbarSeparator } from '@/components/ui/toolbar';
import { Bold, Italic } from 'lucide-react';

export function Example() {
  return (
    <Toolbar>
      <ToolbarButton>
        <Bold className="mr-1 h-4 w-4" />
        Bold
      </ToolbarButton>
      <ToolbarButton>
        <Italic className="mr-1 h-4 w-4" />
        Italic
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Heading 1</ToolbarButton>
      <ToolbarButton>Heading 2</ToolbarButton>
    </Toolbar>
  );
}`
  }
];

// Component mapping for client-side resolution
export const exampleComponents = {
  'button-default': DefaultButtonExample,
  'button-variants': ButtonVariantsExample,
  'button-sizes': ButtonSizesExample,
  'button-icon': ButtonIconExample,
  'button-icon-tooltip': ButtonIconWithTooltipExample,
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
  'toast-loading': ToastLoadingExample,
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
  'field-default': DefaultFieldExample,
  'field-validation': FieldWithValidationExample,
  'field-error': FieldWithErrorExample,
  'field-required': RequiredFieldExample,
  'field-disabled': DisabledFieldExample,
  'checkbox-group-default': DefaultCheckboxGroupExample,
  'checkbox-group-controlled': ControlledCheckboxGroupExample,
  'checkbox-group-horizontal': HorizontalCheckboxGroupExample,
  'checkbox-group-disabled': DisabledCheckboxGroupExample,
  'slider-default': DefaultSliderExample,
  'slider-value': SliderWithValueExample,
  'slider-range': RangeSliderExample,
  'slider-step': StepSliderExample,
  'slider-disabled': DisabledSliderExample,
  'card-default': DefaultCardExample,
  'card-footer': CardWithFooterExample,
  'card-variations': CardVariationsExample,
  'card-interactive': InteractiveCardExample,
  'dialog-default': DefaultDialogExample,
  'dialog-controlled': ControlledDialogExample,
  'dialog-form': DialogWithFormExample,
  'tabs-default': DefaultTabsExample,
  'tabs-controlled': ControlledTabsExample,
  'tabs-indicator': TabsWithIndicatorExample,
  'tabs-disabled': DisabledTabsExample,
  'select-default': DefaultSelectExample,
  'select-groups': SelectWithGroupsExample,
  'select-indicator': SelectWithIndicatorExample,
  'select-controlled': ControlledSelectExample,
  'tooltip-default': DefaultTooltipExample,
  'tooltip-positions': TooltipPositionsExample,
  'tooltip-variants': TooltipVariantsExample,
  'menu-default': DefaultMenuExample,
  'menu-checkbox': MenuWithCheckboxExample,
  'menu-radio': MenuWithRadioExample,
  'menu-submenu': MenuWithSubmenuExample,
  'drawer-default': DefaultDrawerExample,
  'drawer-sides': DrawerSidesExample,
  'drawer-navigation': DrawerWithNavigationExample,
  'menubar-default': DefaultMenubarExample,
  'menubar-checkbox': MenubarWithCheckboxExample,
  'menubar-submenu': MenubarWithSubmenuExample,
  'navigation-menu-default': DefaultNavigationMenuExample,
  'navigation-menu-simple': SimpleNavigationMenuExample,
  'combobox-default': DefaultComboboxExample,
  'combobox-groups': ComboboxWithGroupsExample,
  'combobox-clear': ComboboxWithClearExample,
  'autocomplete-default': DefaultAutocompleteExample,
  'autocomplete-groups': AutocompleteWithGroupsExample,
  'autocomplete-clear': AutocompleteWithClearExample,
  'form-default': DefaultFormExample,
  'form-validation': FormWithValidationExample,
  'form-contact': FormWithFieldsExample,
  'radio-default': DefaultRadioExample,
  'radio-controlled': ControlledRadioExample,
  'radio-disabled': DisabledRadioExample,
  'switch-default': DefaultSwitchExample,
  'switch-controlled': ControlledSwitchExample,
  'switch-states': SwitchStatesExample,
  'toggle-group-default': DefaultToggleGroupExample,
  'toggle-group-single': SingleToggleGroupExample,
  'toggle-group-sizes': ToggleGroupSizesExample,
  'progress-default': DefaultProgressExample,
  'progress-label': ProgressWithLabelExample,
  'progress-animated': AnimatedProgressExample,
  'meter-default': DefaultMeterExample,
  'meter-label': MeterWithLabelExample,
  'meter-levels': MeterLevelsExample,
  'number-field-default': DefaultNumberFieldExample,
  'number-field-minmax': NumberFieldWithMinMaxExample,
  'number-field-step': NumberFieldWithStepExample,
  'badge-default': DefaultBadgeExample,
  'badge-variants': BadgeVariantsExample,
  'badge-sizes': BadgeSizesExample,
  'separator-default': DefaultSeparatorExample,
  'separator-orientations': SeparatorOrientationsExample,
  'collapsible-default': DefaultCollapsibleExample,
  'collapsible-controlled': ControlledCollapsibleExample,
  'scroll-area-default': DefaultScrollAreaExample,
  'scroll-area-horizontal': HorizontalScrollAreaExample,
  'fieldset-default': DefaultFieldsetExample,
  'fieldset-groups': FieldsetWithMultipleGroupsExample,
  'preview-card-default': DefaultPreviewCardExample,
  'preview-card-image': PreviewCardWithImageExample,
  'toolbar-default': DefaultToolbarExample,
  'toolbar-labels': ToolbarWithLabelsExample,
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
  field: fieldExamples,
  checkboxGroup: checkboxGroupExamples,
  slider: sliderExamples,
  card: cardExamples,
  dialog: dialogExamples,
  tabs: tabsExamples,
  select: selectExamples,
  tooltip: tooltipExamples,
  menu: menuExamples,
  drawer: drawerExamples,
  menubar: menubarExamples,
  navigationMenu: navigationMenuExamples,
  combobox: comboboxExamples,
  autocomplete: autocompleteExamples,
  form: formExamples,
  radio: radioExamples,
  switch: switchExamples,
  toggleGroup: toggleGroupExamples,
  progress: progressExamples,
  meter: meterExamples,
  numberField: numberFieldExamples,
  badge: badgeExamples,
  separator: separatorExamples,
  collapsible: collapsibleExamples,
  scrollArea: scrollAreaExamples,
  fieldset: fieldsetExamples,
  previewCard: previewCardExamples,
  toolbar: toolbarExamples,
};
