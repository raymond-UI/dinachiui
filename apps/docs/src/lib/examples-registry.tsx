export type ComponentExample = {
  name: string;
  description: string;
  componentId: string;
  code: string;
};
import {
  DefaultTextExample,
  TextVariantsExample,
  TextAsOverrideExample,
} from '@/components/examples/text-examples';
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
  ContextMenuWithSubmenuExample
} from '@/components/examples/context-menu-examples';
import {
  DefaultAlertDialogExample,
  ConfirmationAlertDialogExample
} from '@/components/examples/alert-dialog-examples';
import {
  DefaultAccordionExample,
  MultipleAccordionExample,
  ControlledAccordionExample,
  DisabledAccordionExample,
  PersistentAccordionExample,
} from '@/components/examples/accordion-examples';
import {
  DefaultCheckboxExample,
  CheckboxStatesExample
} from '@/components/examples/checkbox-examples';
import {
  DefaultToastExample,
  ToastLoadingExample,
  ToastVariantsExample,
  ToastCloseAllExample,
  ToastCustomRenderExample
} from '@/components/examples/toast-examples';
import {
  DefaultAvatarExample,
  AvatarSizesExample,
  AvatarKeepMountedExample
} from '@/components/examples/avatar-examples';
import {
  DefaultToggleExample,
  ToggleVariantsExample,
  ToggleSizesExample,
  ToggleControlledExample,
} from '@/components/examples/toggle-examples';
import {
  DefaultPopoverExample,
  PopoverWithCloseExample,
  PopoverPositionExample,
  PopoverHoverExample,
  PopoverMultiTriggerExample
} from '@/components/examples/popover-examples';
import {
  DefaultInputExample,
  InputTypesExample,
  InputWithLabelExample,
  InputDisabledExample,
  InputWithValidationExample
} from '@/components/examples/input-examples';
import { AgentBridgeExample } from '@/components/examples/agent-examples';
import {
  DefaultTextareaExample,
  TextareaWithLabelExample,
  TextareaDisabledExample,
  TextareaWithCountExample
} from '@/components/examples/textarea-examples';
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
  DefaultCalendarExample,
  RangeCalendarExample,
  MultipleCalendarExample,
} from '@/components/examples/calendar-examples';
import { DefaultDatePickerExample, WeekdaysDatePickerExample } from '@/components/examples/date-picker-examples';
import { DefaultDateRangePickerExample, FutureDateRangePickerExample } from '@/components/examples/date-range-picker-examples';
import { DefaultMonthPickerExample, RangeMonthPickerExample } from '@/components/examples/month-picker-examples';
import { DefaultWeekStripExample, BookingsWeekStripExample } from '@/components/examples/week-strip-examples';
import { InvoiceTableExample, CompactTableExample } from '@/components/examples/table-examples';
import { DefaultPaginationExample, CompactPaginationExample, LinksPaginationExample } from '@/components/examples/pagination-examples';
import { BasicDataTableExample, ServerDataTableExample, VirtualDataTableExample } from '@/components/examples/data-table-examples';
import { DefaultTimeSlotsExample, RowsTimeSlotsExample } from '@/components/examples/time-slots-examples';
import { DefaultYearViewExample, MonthsYearViewExample } from '@/components/examples/year-view-examples';
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
  NestedDialogExample,
  DialogWithFormExample
} from '@/components/examples/dialog-examples';
import {
  DefaultTabsExample,
  ControlledTabsExample,
  TabsWithIndicatorExample,
  DisabledTabsExample
} from '@/components/examples/tabs-examples';
import {
  ControlledSelectExample,
  MultipleSelectExample,
  SelectWithGroupsExample,
  DisabledItemSelectExample,
  FormSelectExample,
} from '@/components/examples/select-examples';
import {
  DefaultTooltipExample,
  TooltipPositionsExample,
  TooltipCloseOnClickExample,
  TooltipVariantsExample
} from '@/components/examples/tooltip-examples';
import {
  DefaultMenuExample,
  MenuWithCheckboxExample,
  MenuWithRadioExample,
  MenuWithSubmenuExample,
  MenuFilterExample,
  MenuFilterSubmenuExample
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
  NavigationMenuWithArrowExample,
  NavigationMenuWithBackdropExample,
  SimpleNavigationMenuExample
} from '@/components/examples/navigation-menu-examples';
import {
  DefaultComboboxExample,
  ComboboxWithGroupsExample,
  ComboboxWithClearExample,
  ComboboxCreateItemsExample
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
  DefaultOTPFieldExample,
  OTPFieldWithSeparatorExample,
  OTPFieldMaskedExample,
  OTPFieldControlledExample,
  OTPFieldDisabledExample
} from '@/components/examples/otp-field-examples';
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
  DefaultSkeletonExample,
  SkeletonCardExample
} from '@/components/examples/skeleton-examples';
import {
  DefaultLabelExample,
  LabelDisabledExample
} from '@/components/examples/label-examples';
import {
  DefaultLinkExample,
  LinkVariantsExample,
  LinkExternalExample,
  LinkRenderExample,
  LinkRenderFunctionExample,
} from '@/components/examples/link-examples';
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
  PreviewCardWithImageExample,
  PreviewCardViewportExample
} from '@/components/examples/preview-card-examples';
import {
  DefaultToolbarExample,
  ToolbarWithTogglesExample,
  ToolbarWithInputExample,
  ToolbarVerticalExample,
} from '@/components/examples/toolbar-examples';
import {
  DefaultNumberTickerExample,
  NumberTickerVariantsExample,
  NumberTickerFormatExample,
  NumberTickerLiveExample,
} from '@/components/examples/number-ticker-examples';
import {
  DefaultMarqueeExample,
  MarqueeDirectionExample,
  MarqueeLinksExample,
  MarqueeFitsExample,
} from '@/components/examples/marquee-examples';
import {
  DefaultTextShimmerExample,
  TextShimmerVariantsExample,
  TextShimmerDimExample,
  TextShimmerPendingExample,
} from '@/components/examples/text-shimmer-examples';
import {
  DefaultTextMorphExample,
  TextMorphRelatedExample,
  TextMorphTuningExample,
} from '@/components/examples/text-morph-examples';
import {
  DefaultScrollRevealExample,
  ScrollRevealDirectionExample,
  ScrollRevealCascadeExample,
} from '@/components/examples/scroll-reveal-examples';
import {
  DefaultStaggerListExample,
  StaggerListVariantsExample,
  StaggerListGridExample,
} from '@/components/examples/stagger-list-examples';
import {
  DefaultAnimatedListExample,
  AnimatedListTwoExitsExample,
  AnimatedListFromBottomExample,
} from '@/components/examples/animated-list-examples';
import {
  DefaultStreamingTextExample,
  StreamingTextPauseExample,
  StreamingTextCompleteExample,
} from '@/components/examples/streaming-text-examples';
import {
  DefaultSwipeableRowExample,
  SwipeableRowNoDismissExample,
  SwipeableRowKeyboardExample,
} from '@/components/examples/swipeable-row-examples';
import {
  DefaultSortableExample,
  SortableKeyboardExample,
  SortableCustomHandleExample,
} from '@/components/examples/sortable-examples';
import {
  DefaultProgressRingExample,
  IndeterminateProgressRingExample,
  ProgressRingSizesExample,
} from '@/components/examples/progress-ring-examples';
import {
  DefaultExpandableCardExample,
  ControlledExpandableCardExample,
  ExpandableCardFullscreenExample,
  ExpandableCardRowExample,
} from '@/components/examples/expandable-card-examples';
import {
  DefaultAnimatedIconExample,
  AnimatedIconModesExample,
  AnimatedIconSizesExample,
} from '@/components/examples/animated-icon-examples';
import {
  DefaultCarouselExample,
  CarouselUnevenExample,
  CarouselControlledExample,
} from '@/components/examples/carousel-examples';
import {
  DefaultLoadTransitionExample,
  LoadTransitionThresholdsExample,
  LoadTransitionBareExample,
} from '@/components/examples/load-transition-examples';
import {
  DefaultScrollProgressExample,
  ScrollProgressSmoothExample,
  ScrollProgressStyledExample,
} from '@/components/examples/scroll-progress-examples';
import {
  DefaultAnimatedTabsExample,
  AnimatedTabsStyledExample,
  AnimatedTabsControlledExample,
} from '@/components/examples/animated-tabs-examples';
import {
  DefaultCompareSliderExample,
  CompareSliderPanelExample,
  CompareSliderLiveExample,
} from '@/components/examples/compare-slider-examples';
import {
  DefaultHoldToConfirmExample,
  HoldToConfirmVariantsExample,
  HoldToConfirmTuningExample,
} from '@/components/examples/hold-to-confirm-examples';

export const buttonExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A button with the default style.",
    componentId: "button-default",
    code: `import { Button } from '@/components/ui/button';

export function Example() {
  return <Button>Click me</Button>;
}`
  },
  {
    name: "Variants",
    description: "Each visual style, from default to destructive.",
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
    name: "Sizes",
    description: "Small, default and large.",
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
    name: "Icon",
    description: "Square buttons that hold a single icon.",
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
    name: "With tooltip",
    description: "Icon buttons with tooltips, through the render prop.",
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
    name: "Default",
    description: "Items with shortcuts and a disabled item.",
    componentId: "context-menu-default",
    code: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
        Right click here
      </ContextMenuTrigger>
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
    </ContextMenu>
  );
}`
  },
  {
    name: "Checkbox items",
    description: "Toggle options without closing the menu.",
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
} from '@/components/ui/context-menu';

export function Example() {
  const [bookmarksBar, setBookmarksBar] = React.useState(true);
  const [showFullUrls, setShowFullUrls] = React.useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
        Right click for checkbox menu
      </ContextMenuTrigger>
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
    </ContextMenu>
  );
}`
  },
  {
    name: "Radio group",
    description: "Pick one option from a set.",
    componentId: "context-menu-radio",
    code: `import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
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
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuRadioItem value="pedro">Pedro</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm</ContextMenuRadioItem>
            <ContextMenuRadioItem value="sarah">Sarah</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}`
  },
  {
    name: "Submenu",
    description: "Nest options under a trigger item.",
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
} from '@/components/ui/context-menu';

export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm bg-card hover:bg-accent/50 transition-colors">
        Right click for submenu
      </ContextMenuTrigger>
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
    </ContextMenu>
  );
}`
  }
];

export const alertDialogExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A confirmation before a destructive action.",
    componentId: "alert-dialog-default",
    code: `import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
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
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent>
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
      </AlertDialogContent>
    </AlertDialog>
  );
}`
  },
  {
    name: "Controlled",
    description: "The open state held in React state.",
    componentId: "alert-dialog-controlled",
    code: `import React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button />}>
        Save Changes
      </AlertDialogTrigger>
      <AlertDialogContent>
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
      </AlertDialogContent>
    </AlertDialog>
  );
}`
  }
];

export const accordionExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "One item open at a time.",
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
    name: "Multiple",
    description: "Several items open at once.",
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
  },
  {
    name: "Controlled",
    description: "The open items held in React state.",
    componentId: "accordion-controlled",
    code: `import * as React from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion';

export function Example() {
  const [value, setValue] = React.useState(["features"]);

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
        Controlled value: {value.length > 0 ? value.join(", ") : "none"}
      </div>

      <Accordion
        value={value}
        onValueChange={(nextValue) => setValue(nextValue as string[])}
      >
        <AccordionItem value="features">
          <AccordionHeader>
            <AccordionTrigger>Features</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Our component library includes over 20 production-ready components with full TypeScript support.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="pricing">
          <AccordionHeader>
            <AccordionTrigger>Pricing</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            DinachiUI is completely free and open source. Use it in your personal and commercial projects.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionHeader>
            <AccordionTrigger>Support</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Get support through our GitHub issues, Discord community, or comprehensive documentation.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}`
  },
  {
    name: "Disabled item",
    description: "One item locked while the rest stay interactive.",
    componentId: "accordion-disabled",
    code: `import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion';

export function Example() {
  return (
    <Accordion defaultValue={["available"]} className="w-full">
      <AccordionItem value="available">
        <AccordionHeader>
          <AccordionTrigger>Available Section</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          This item is interactive and behaves like a standard accordion section.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionHeader>
          <AccordionTrigger>Disabled Section</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Disabled accordion items keep their structure but ignore pointer and keyboard interaction.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="notes">
        <AccordionHeader>
          <AccordionTrigger>Notes</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Use item-level disabled when only one section should be locked while the rest remain interactive.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}`
  },
  {
    name: "Keep mounted",
    description: "A closed panel keeps its field state, and the item reports each change.",
    componentId: "accordion-persistent",
    code: `import * as React from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion';

export function Example() {
  const [draft, setDraft] = React.useState("Draft notes stay mounted between toggles.");
  const [events, setEvents] = React.useState<Array<{ id: number; message: string }>>([]);

  return (
    <div className="w-full space-y-4">
      <Accordion className="w-full">
        <AccordionItem
          value="draft"
          onOpenChange={(open) => {
            setEvents((current) => [
              {
                id: Date.now() + current.length,
                message: \`\${open ? "Opened" : "Closed"} draft section\`,
              },
              ...current,
            ].slice(0, 3));
          }}
        >
          <AccordionHeader>
            <AccordionTrigger>Persistent Draft</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel keepMounted>
            <div className="space-y-3">
              <p className="text-muted-foreground">
                This panel uses keepMounted, so field state is preserved after collapse.
              </p>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="search">
          <AccordionHeader>
            <AccordionTrigger>Find-in-Page Friendly Content</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel hiddenUntilFound>
            Content inside this panel can be revealed by the browser's built-in find-in-page when hiddenUntilFound is enabled.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Recent item events</p>
        <ul className="mt-2 space-y-1">
          {events.length > 0 ? (
            events.map((event) => <li key={event.id}>{event.message}</li>)
          ) : (
            <li>Open or close the draft section to see item-level events.</li>
          )}
        </ul>
      </div>
    </div>
  );
}`
  }
];

export const checkboxExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A checkbox named by its label.",
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
    name: "States",
    description: "Controlled, checked and disabled checkboxes.",
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
    name: "Default",
    description: "A success toast from a button.",
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
    name: "Variants",
    description: "One toast for each type.",
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
    name: "Loading",
    description: "Toasts that update, with promise tracking and retry.",
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
  },
  {
    name: "Close all",
    description: "manager.close() with no id dismisses every toast.",
    componentId: "toast-close-all",
    code: `import { ToastProvider, ToastPortal, ToastViewport, ToastList, useToastManager, createToastManager } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const toastManager = createToastManager();

function CloseAllButtons() {
  const manager = useToastManager();
  let counter = 0;

  const addMultiple = () => {
    for (let i = 0; i < 3; i++) {
      counter++;
      manager.add({
        title: \`Toast #\${counter}\`,
        description: "This is a queued toast.",
        type: "default",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={addMultiple} variant="outline">
        Add 3 Toasts
      </Button>
      <Button onClick={() => manager.close()} variant="destructive">
        Close All
      </Button>
    </div>
  );
}

export function Example() {
  return (
    <ToastProvider toastManager={toastManager}>
      <CloseAllButtons />
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
    name: "Custom render",
    description: "Custom icons through renderToast.",
    componentId: "toast-custom-render",
    code: `import { ToastProvider, ToastPortal, ToastViewport, ToastList, ToastContent, ToastTitle, ToastDescription, ToastClose, createToastManager } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon, AlertCircleIcon, InfoIcon, Loader2Icon } from 'lucide-react';

const toastManager = createToastManager();

const typeIcons = {
  success: <CheckCircle2Icon className="h-5 w-5 text-green-500" />,
  error: <AlertCircleIcon className="h-5 w-5 text-red-500" />,
  loading: <Loader2Icon className="h-5 w-5 animate-spin text-blue-500" />,
};

export function Example() {
  const showToast = (type) => {
    toastManager.add({
      title: type === "success" ? "Saved" : type === "error" ? "Failed" : "Saving...",
      description: type === "success" ? "Your changes have been saved." : type === "error" ? "Could not save changes." : "Please wait...",
      type,
    });
  };

  return (
    <ToastProvider toastManager={toastManager}>
      <div className="flex gap-2">
        <Button onClick={() => showToast("success")} variant="outline">Success</Button>
        <Button onClick={() => showToast("error")} variant="outline">Error</Button>
        <Button onClick={() => showToast("loading")} variant="outline">Loading</Button>
      </div>
      <ToastPortal>
        <ToastViewport>
          <ToastList renderToast={(toast) => (
            <ToastContent>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {typeIcons[toast.type] ?? <InfoIcon className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="grid gap-1">
                  {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                  {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
                </div>
              </div>
              <ToastClose />
            </ToastContent>
          )} />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}`
  },
];

export const avatarExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "An image with initials as the fallback.",
    componentId: "avatar-default",
    code: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.png" alt="@raymond-ui" />
      <AvatarFallback>RA</AvatarFallback>
    </Avatar>
  );
}`
  },
  {
    name: "Sizes",
    description: "Small, medium and large.",
    componentId: "avatar-sizes",
    code: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="/avatar.png" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src="/avatar.png" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/avatar.png" />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  );
}`
  },
  {
    name: "Keep mounted",
    description: "The image loads in place, with the fallback beneath it.",
    componentId: "avatar-keep-mounted",
    code: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>DN</AvatarFallback>
        <AvatarImage keepMounted src="/avatar.png" alt="@raymond-ui" />
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarImage keepMounted src="https://broken-link.invalid/avatar.png" alt="Broken" />
      </Avatar>
    </div>
  );
}`
  }
];

export const toggleExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "An icon toggle for bold.",
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
    name: "Variants",
    description: "Default and outline.",
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
  },
  {
    name: "Sizes",
    description: "Small, default and large.",
    componentId: "toggle-sizes",
    code: `import { Toggle } from '@/components/ui/toggle';
import { Bold } from 'lucide-react';

export function Example() {
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
}`
  },
  {
    name: "Controlled",
    description: "Pressed state held in React, with a live status.",
    componentId: "toggle-controlled",
    code: `import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Bold, Italic, Underline } from 'lucide-react';

export function Example() {
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
        Active: {Object.entries(formatting)
          .filter(([, active]) => active)
          .map(([format]) => format)
          .join(', ') || 'none'}
      </div>
    </div>
  );
}`
  }
];

export const popoverExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A title and description behind an icon button.",
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
      <PopoverTrigger render={<Button variant="outline" size="icon" />}>
        <Bell className="h-4 w-4" />
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
    name: "With close",
    description: "Settings with a close button and controls inside.",
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
      <PopoverTrigger render={<Button variant="outline" />}>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-start justify-between mb-2">
          <PopoverTitle>Settings</PopoverTitle>
          <PopoverClose render={<button className="rounded-sm opacity-70 hover:opacity-100" />}>
            <X className="h-4 w-4" />
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
    name: "Sides",
    description: "The popup on each side of its trigger.",
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
        <PopoverTrigger render={<Button variant="outline" />}>Top</PopoverTrigger>
        <PopoverContent side="top">
          <PopoverArrow />
          <PopoverTitle>Top Position</PopoverTitle>
          <PopoverDescription>Opens at the top.</PopoverDescription>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>Bottom</PopoverTrigger>
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
    name: "On hover",
    description: "Opens when the pointer rests on the trigger.",
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
    <Popover>
      <PopoverTrigger openOnHover delay={200} closeDelay={100} render={<Button variant="outline" />}>Hover me</PopoverTrigger>
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
  },
  {
    name: "Shared popup",
    description: "Several triggers share one popup through a handle.",
    componentId: "popover-multi-trigger",
    code: `import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
  PopoverViewport,
  PopoverTitle,
  PopoverDescription,
  createPopoverHandle,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const tabs = [
  { id: 'profile', label: 'Profile', title: 'Your Profile', description: 'Manage your display name, avatar, and public bio.' },
  { id: 'account', label: 'Account', title: 'Account Settings', description: 'Update your email, password, and two-factor authentication.' },
  { id: 'billing', label: 'Billing', title: 'Billing & Plans', description: 'View invoices, update payment methods, and change your plan.' },
];

export function Example() {
  const handle = createPopoverHandle();

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <PopoverTrigger
          key={tab.id}
          handle={handle}
          payload={tab}
          openOnHover
          delay={200}
          closeDelay={150}
          render={(props) => (
            <Button variant="outline" size="sm" {...props}>{tab.label}</Button>
          )}
        />
      ))}
      <Popover handle={handle}>
        {({ payload }) => {
          const tab = payload as (typeof tabs)[number] | undefined;
          return (
            <PopoverPortal>
              <PopoverPositioner sideOffset={8}>
                <PopoverPopup>
                  <PopoverArrow />
                  <PopoverViewport>
                    {tab && (
                      <>
                        <PopoverTitle>{tab.title}</PopoverTitle>
                        <PopoverDescription>{tab.description}</PopoverDescription>
                      </>
                    )}
                  </PopoverViewport>
                </PopoverPopup>
              </PopoverPositioner>
            </PopoverPortal>
          );
        }}
      </Popover>
    </div>
  );
}`
  }
];

export const fieldExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Label, control and description.",
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
    name: "Validation",
    description: "Validate as you type after the first blur.",
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
    name: "Error",
    description: "An invalid field with its message.",
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
    name: "Required",
    description: "Required controls with a visible marker.",
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
    name: "Disabled",
    description: "Disable the whole field from its root.",
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
    name: "Default",
    description: "An uncontrolled group with one value ticked.",
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
    name: "Controlled",
    description: "The ticked values live in your state.",
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
    name: "Horizontal",
    description: "The group laid out in a row.",
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
    name: "Disabled",
    description: "A group that blocks every checkbox.",
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

export const calendarExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "One day, months scrolling as a column.",
    componentId: "calendar-default",
    code: `import { useState } from 'react';
import { Calendar, toISODate } from '@/components/ui/calendar';

export function Example() {
  const [day, setDay] = useState<Date | null>(null);
  return (
    <div className="grid justify-items-center gap-3">
      <Calendar aria-label="Due date" value={day} onValueChange={setDay} className="rounded-lg border" />
      <p className="text-sm text-muted-foreground">{day ? toISODate(day) : "No day picked"}</p>
    </div>
  );
}`
  },
  {
    name: "Range, paged",
    description: "Two months side by side, from today on.",
    componentId: "calendar-range",
    code: `import { useState } from 'react';
import { Calendar, type DateRange } from '@/components/ui/calendar';

export function Example() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  return (
    <Calendar
      mode="range"
      layout="paged"
      numberOfMonths={2}
      aria-label="Stay"
      value={range}
      onValueChange={setRange}
      min={new Date()}
      className="rounded-lg border p-3"
    />
  );
}`
  },
  {
    name: "Several days",
    description: "Weekdays only, with week numbers.",
    componentId: "calendar-multiple",
    code: `import { Calendar } from '@/components/ui/calendar';

export function Example() {
  return (
    <Calendar
      mode="multiple"
      aria-label="Rota days"
      weekNumbers
      isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
      className="rounded-lg border"
    />
  );
}`
  }
];

export const datePickerExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Due from today on.",
    componentId: "date-picker-default",
    code: `import { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

export function Example() {
  const [due, setDue] = useState<Date | null>(null);
  return <DatePicker aria-label="Due date" label="Due date" value={due} onValueChange={setDue} min={new Date()} />;
}`
  },
  {
    name: "Weekdays only",
    description: "Weekends are refused, typed or picked.",
    componentId: "date-picker-weekdays",
    code: `import { DatePicker } from '@/components/ui/date-picker';

export function Example() {
  return (
    <DatePicker
      aria-label="Delivery day"
      label="Delivery day"
      min={new Date()}
      isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
      placeholder="mon or 24 nov"
    />
  );
}`
  }
];

export const dateRangePickerExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A report period, nothing after today.",
    componentId: "date-range-picker-default",
    code: `import { useState } from 'react';
import { addDays, startOfDay, type DateRange } from '@/components/ui/calendar';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export function Example() {
  const today = startOfDay(new Date());
  const [range, setRange] = useState<DateRange>({ from: addDays(today, -6), to: today });
  return <DateRangePicker aria-label="Period" value={range} onValueChange={setRange} max={today} />;
}`
  },
  {
    name: "Own presets",
    description: "A stay from today on, with presets that look ahead.",
    componentId: "date-range-picker-future",
    code: `import { addDays, startOfDay } from '@/components/ui/calendar';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export function Example() {
  const today = startOfDay(new Date());
  const saturday = addDays(today, (6 - today.getDay() + 7) % 7);
  return (
    <DateRangePicker
      aria-label="Stay"
      label="Stay"
      placeholder="Check in, check out"
      min={today}
      presets={[
        { label: "This weekend", value: { from: saturday, to: addDays(saturday, 1) } },
        { label: "Next 7 nights", value: { from: today, to: addDays(today, 7) } },
      ]}
    />
  );
}`
  }
];

export const monthPickerExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "One billing month, nothing after this one.",
    componentId: "month-picker-default",
    code: `import { useState } from 'react';
import { MonthPicker } from '@/components/ui/month-picker';

export function Example() {
  const [month, setMonth] = useState<Date | null>(null);
  return <MonthPicker aria-label="Billing month" className="w-72" value={month} onValueChange={setMonth} max={new Date()} />;
}`
  },
  {
    name: "Range",
    description: "A reporting period of whole months.",
    componentId: "month-picker-range",
    code: `import { useState } from 'react';
import { type DateRange } from '@/components/ui/calendar';
import { MonthPicker } from '@/components/ui/month-picker';

export function Example() {
  const [span, setSpan] = useState<DateRange>({ from: null, to: null });
  return <MonthPicker aria-label="Reporting period" mode="range" className="w-72" value={span} onValueChange={setSpan} max={new Date()} />;
}`
  }
];

export const timeSlotsExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A room's day, with busy time a booking can't cross.",
    componentId: "time-slots-default",
    code: `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TimeSlots, type TimeSlot } from '@/components/ui/time-slots';

export function Example({ busy }: { busy: TimeSlot[] }) {
  const [slot, setSlot] = useState<TimeSlot | null>({ start: 645, end: 720 });
  return (
    <TimeSlots aria-label="Room" className="max-w-3xl" timeZone="GMT" busy={busy} value={slot} onValueChange={setSlot}>
      <Button size="sm" disabled={!slot}>Book</Button>
    </TimeSlots>
  );
}`
  },
  {
    name: "Rows",
    description: "The phone layout: half-hour rows, tapped to book and stretch.",
    componentId: "time-slots-rows",
    code: `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TimeSlots, type TimeSlot } from '@/components/ui/time-slots';

export function Example({ busy }: { busy: TimeSlot[] }) {
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  return (
    <TimeSlots aria-label="Room" layout="vertical" className="h-96 w-80" timeZone="GMT" busy={busy} value={slot} onValueChange={setSlot}>
      <Button size="sm" disabled={!slot}>Book</Button>
    </TimeSlots>
  );
}`
  }
];

export const tableExamples: ComponentExample[] = [
  {
    name: "Invoice",
    description: "Numeric columns, a caption, and totals in the footer. Below 768px each line stacks.",
    componentId: "table-invoice",
    code: `import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const lines = [
  { item: 'Merino jumper', variant: 'Charcoal, M', qty: 1, price: 118 },
  { item: 'Linen shirt', variant: 'Sand, L', qty: 2, price: 64 },
  { item: 'Wool scarf', variant: 'Rust', qty: 1, price: 38 },
  { item: 'Socks, 3 pack', variant: 'Grey marl', qty: 2, price: 15 },
];
const money = (n: number) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2 });

export function Example() {
  const total = lines.reduce((sum, l) => sum + l.qty * l.price, 0) + 4.95;
  return (
    <Table stack>
      <TableCaption>
        <span className="flex items-baseline justify-between">
          <span className="text-base font-semibold text-foreground">Invoice 2048</span>
          <span>Due 1 Dec 2026</span>
        </span>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead numeric>Qty</TableHead>
          <TableHead numeric>Price</TableHead>
          <TableHead numeric>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((l) => (
          <TableRow key={l.item}>
            <TableCell stack="title">
              {l.item}
              <span className="block text-xs font-normal text-muted-foreground">{l.variant}</span>
            </TableCell>
            <TableCell numeric stack="meta">
              {l.qty}<span className="md:hidden"> ×</span>
            </TableCell>
            <TableCell numeric stack="meta">{money(l.price)}</TableCell>
            <TableCell numeric stack="value">{money(l.qty * l.price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-muted-foreground">Delivery</TableCell>
          <TableCell numeric>{money(4.95)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3} className="text-muted-foreground">VAT included</TableCell>
          <TableCell numeric className="text-muted-foreground">{money(total / 6)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell numeric>{money(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}`
  },
  {
    name: "Compact",
    description: "Compact rows without dividers, for dense figures where spacing groups the cells.",
    componentId: "table-compact",
    code: `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function Example({ rows }: { rows: { region: string; requests: number; errors: number; p95: number }[] }) {
  return (
    <Table density="compact" dividers="none">
      <TableCaption>Requests by region, last 24 hours</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Region</TableHead>
          <TableHead numeric>Requests</TableHead>
          <TableHead numeric>Errors</TableHead>
          <TableHead numeric>p95</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.region}>
            <TableCell>{r.region}</TableCell>
            <TableCell numeric>{r.requests.toLocaleString()}</TableCell>
            <TableCell numeric>{r.errors.toFixed(2)}%</TableCell>
            <TableCell numeric>{r.p95} ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`
  }
];

export const dataTableExamples: ComponentExample[] = [
  {
    name: "Orders",
    description: "Search, status chips with counts, sorting, selection, row menus and paging, all on the client.",
    componentId: "data-table-basic",
    code: `import { DataTable, DataTableAction, DataTableRowTrigger, createColumnHelper } from '@/components/ui/data-table';

type Order = { id: number; customer: string; status: string; placed: Date; amount: number };
const col = createColumnHelper<Order>();

const columns = [
  col.accessor('id', {
    header: 'Order',
    size: 84,
    enableHiding: false,
    meta: { pin: 'left', phone: 'meta' },
    cell: (c) => <DataTableRowTrigger>#{c.getValue()}</DataTableRowTrigger>,
  }),
  col.accessor('customer', { header: 'Customer', meta: { phone: 'title' } }),
  col.accessor('status', { header: 'Status', size: 100, meta: { phone: 'meta', phoneOrder: 2 } }),
  col.accessor('placed', {
    header: 'Placed',
    sortingFn: 'datetime',
    // The phone line has room for the day, not the time.
    meta: { phone: 'meta', phoneOrder: 1, phoneCell: (c) => c.getValue().toLocaleDateString() },
    cell: (c) => c.getValue().toLocaleString(),
  }),
  col.accessor('amount', { header: 'Amount', size: 96, meta: { numeric: true, phone: 'value' } }),
];

export function Example({ orders }: { orders: Order[] }) {
  return (
    <DataTable
      data={orders}
      columns={columns}
      getRowLabel={(o) => \`Order #\${o.id}\`}
      noun={{ singular: 'order', plural: 'orders' }}
      facet={{ column: 'status' }}
      rowActions={() => (
        <>
          <DataTableAction>Copy order ID</DataTableAction>
          <DataTableAction destructive>Refund</DataTableAction>
        </>
      )}
    />
  );
}`
  },
  {
    name: "Server-side",
    description: "rowCount hands sorting, filtering and paging to you. Fetch on each change and pass back the page.",
    componentId: "data-table-server",
    code: `import { useEffect, useState } from 'react';
import { DataTable, type DataTableState } from '@/components/ui/data-table';

export function Example() {
  const [state, setState] = useState<Partial<DataTableState>>({
    sorting: [{ id: 'placed', desc: true }],
    columnFilters: [],
    globalFilter: '',
    pagination: { pageIndex: 0, pageSize: 10 },
  });
  const [page, setPage] = useState<{ rows: Order[]; total: number } | null>(null);

  useEffect(() => {
    fetchOrders(state).then(setPage);
  }, [state]);

  // Selection and column changes need no new page, so keep the query unless it changed.
  const onStateChange = (next: DataTableState) => {
    const asked = { sorting: next.sorting, columnFilters: next.columnFilters, globalFilter: next.globalFilter, pagination: next.pagination };
    setState((prev) => (JSON.stringify(prev) === JSON.stringify(asked) ? prev : asked));
  };

  return (
    <DataTable
      data={page?.rows ?? []}
      rowCount={page?.total ?? 0}
      loading={!page}
      columns={columns}
      noun={{ singular: 'order', plural: 'orders' }}
      facet={{ column: 'status', options: [{ value: 'Paid', count: 201 }, { value: 'Pending', count: 31 }] }}
      sorting={state.sorting}
      columnFilters={state.columnFilters}
      globalFilter={state.globalFilter}
      pagination={state.pagination}
      onStateChange={onStateChange}
    />
  );
}`
  },
  {
    name: "Virtualized",
    description: "Five thousand rows in a scrolling body. Only the rows in view are drawn.",
    componentId: "data-table-virtual",
    code: `import { DataTable } from '@/components/ui/data-table';

export function Example({ orders }: { orders: Order[] }) {
  return (
    <DataTable
      data={orders}
      columns={columns}
      noun={{ singular: 'order', plural: 'orders' }}
      virtualize
      maxHeight={452}
    />
  );
}`
  }
];

export const paginationExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Page numbers under a list, with the range beside them. Either gap opens a go-to-page field.",
    componentId: "pagination-default",
    code: `import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export function Example() {
  const [page, setPage] = useState(6);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm tabular-nums text-muted-foreground">
        {(page - 1) * 6 + 1}–{page * 6} of 150
      </span>
      <Pagination aria-label="Orders" count={25} page={page} onPageChange={setPage} />
    </div>
  );
}`
  },
  {
    name: "Compact",
    description: "One line for phones and narrow footers, with 44px targets. Tap the number to jump.",
    componentId: "pagination-compact",
    code: `import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export function Example() {
  const [page, setPage] = useState(6);
  return (
    <Pagination
      aria-label="Orders"
      variant="compact"
      size="lg"
      count={25}
      page={page}
      onPageChange={setPage}
      className="w-full justify-between"
    />
  );
}`
  },
  {
    name: "Links",
    description: "Pages with their own URL render as links. Cancel the change to route it yourself.",
    componentId: "pagination-links",
    code: `import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';

export function Example({ count }: { count: number }) {
  const router = useRouter();
  const page = Number(useSearchParams().get('page') ?? 1);
  return (
    <Pagination
      aria-label="Archive"
      count={count}
      page={page}
      getHref={(p) => \`?page=\${p}\`}
      onPageChange={(next, details) => {
        details.cancel();
        router.push(\`?page=\${next}\`);
      }}
    />
  );
}`
  }
];

export const weekStripExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Last week to three weeks ahead, today selected.",
    componentId: "week-strip-default",
    code: `import { useState } from 'react';
import { startOfDay } from '@/components/ui/calendar';
import { WeekStrip } from '@/components/ui/week-strip';

export function Example() {
  const [day, setDay] = useState(() => startOfDay(new Date()));
  return <WeekStrip aria-label="Schedule" className="max-w-xl" value={day} onValueChange={setDay} />;
}`
  },
  {
    name: "Bookings",
    description: "Dots for each day's bookings, and the day's list under the strip.",
    componentId: "week-strip-bookings",
    code: `import { useState } from 'react';
import { startOfDay, toISODate } from '@/components/ui/calendar';
import { WeekStrip } from '@/components/ui/week-strip';

export function Example({ bookings }: { bookings: Record<string, string[]> }) {
  const [day, setDay] = useState(() => startOfDay(new Date()));
  const counts = Object.fromEntries(Object.entries(bookings).map(([k, v]) => [k, v.length]));
  const list = bookings[toISODate(day)] ?? [];
  return (
    <WeekStrip
      aria-label="Bookings"
      className="max-w-xl"
      value={day}
      onValueChange={setDay}
      counts={counts}
      formatCount={(n) => \`\${n} \${n === 1 ? "booking" : "bookings"}\`}
    >
      <ul className="grid gap-1 px-[1.125rem] pt-2 text-sm">
        {list.length ? list.map((v) => <li key={v}>{v}</li>) : <li className="text-muted-foreground">No bookings</li>}
      </ul>
    </WeekStrip>
  );
}`
  }
];

export const yearViewExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A year of deploys. Picking a day shows its count.",
    componentId: "year-view-default",
    code: `import { useState } from 'react';
import { YearView } from '@/components/ui/year-view';

export function Example({ counts }: { counts: Record<string, number> }) {
  const [day, setDay] = useState<Date | null>(null);
  return (
    <YearView
      aria-label="Deploys"
      counts={counts}
      value={day}
      onValueChange={setDay}
      formatCount={(n) => \`\${n.toLocaleString("en-US")} \${n === 1 ? "deploy" : "deploys"}\`}
    />
  );
}`
  },
  {
    name: "Months",
    description: "Months stacked latest first, with squares big enough to tap.",
    componentId: "year-view-months",
    code: `import { YearView } from '@/components/ui/year-view';

export function Example({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="h-96 w-80 overflow-y-auto">
      <YearView
        aria-label="Deploys"
        layout="months"
        counts={counts}
        formatCount={(n) => \`\${n.toLocaleString("en-US")} \${n === 1 ? "deploy" : "deploys"}\`}
      />
    </div>
  );
}`
  }
];

export const sliderExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "One thumb with a label.",
    componentId: "slider-default",
    code: `import { Slider, SliderLabel, SliderControl, SliderTrack, SliderRange, SliderThumb } from '@/components/ui/slider';

export function Example() {
  return (
    <Slider defaultValue={50} className="w-full max-w-sm">
      <SliderLabel>Volume</SliderLabel>
      <SliderControl>
        <SliderTrack>
          <SliderRange />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
}`
  },
  {
    name: "Controlled",
    description: "Controlled value shown beside the label.",
    componentId: "slider-value",
    code: `import { Slider, SliderLabel, SliderControl, SliderTrack, SliderRange, SliderThumb, SliderValue } from '@/components/ui/slider';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState(50);

  return (
    <div className="w-full max-w-sm space-y-4">
      <Slider value={value} onValueChange={(val) => setValue(val as number)}>
        <div className="flex items-center justify-between gap-2">
          <SliderLabel>Brightness</SliderLabel>
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
    name: "Range",
    description: "Two thumbs select a low and a high value.",
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
    name: "Steps",
    description: "Snaps to steps of 25.",
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
    name: "Disabled",
    description: "Blocks people and agents.",
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
    name: "Default",
    description: "A header with a title and description, then content.",
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
    name: "With footer",
    description: "A form card with actions in the footer.",
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
    name: "Pricing",
    description: "Two cards side by side for comparing plans.",
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
    name: "Interactive",
    description: "A card with a hover shadow and a progress bar.",
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

export const agentExamples: ComponentExample[] = [
  {
    name: "Snapshot and act",
    description: "Take a snapshot, then fill the input and pick a region.",
    componentId: "agent-bridge",
    code: `import { useState } from "react";
import {
  AgentProvider,
  isAgentChange,
  useAgent,
  type AgentActResult,
  type AgentComponent,
} from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const regions = { us: "United States", eu: "Europe", ap: "Asia Pacific" };

export function Example() {
  const [log, setLog] = useState<string>("");
  const [changedBy, setChangedBy] = useState<string>("");
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  // Scoped to the demo, so the agent does not also see the docs site around it.
  const agent = useAgent({ root: root ?? undefined });

  const show = (value: AgentComponent[] | AgentActResult) =>
    setLog(JSON.stringify(value, null, 2));

  return (
    <AgentProvider agent={agent}>
      <div className="grid w-full max-w-2xl gap-6 md:grid-cols-2">
        <div className="space-y-4" ref={setRoot}>
          <div className="space-y-2">
            <label htmlFor="agent-project" className="text-sm font-medium">
              Project name
            </label>
            <Input id="agent-project" defaultValue="Apollo" />
          </div>
          <div className="space-y-2">
            <Select
              items={regions}
              defaultValue="us"
              onValueChange={(_, details) =>
                setChangedBy(isAgentChange(details) ? "the agent" : "you")
              }
            >
              <SelectFieldLabel>Region</SelectFieldLabel>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(regions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {changedBy && (
              <p className="text-xs text-muted-foreground">
                Region last changed by {changedBy}.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2" data-agent-hidden>
            <Button
              variant="outline"
              size="sm"
              onClick={() => show(agent.snapshot())}
            >
              Snapshot
            </Button>
            <Button
              size="sm"
              onClick={async () =>
                show(
                  await agent.act({
                    steps: [
                      {
                        ref: "Project name",
                        action: "setValue",
                        args: ["Atlas"],
                      },
                      { ref: "Region", action: "select", args: ["Europe"] },
                    ],
                  }),
                )
              }
            >
              Run agent steps
            </Button>
          </div>
        </div>
        <pre
          className="max-h-72 overflow-auto rounded-md border bg-muted/40 p-3 text-xs"
          data-agent-hidden
        >
          {log || "Press Snapshot to see what an agent sees."}
        </pre>
      </div>
    </AgentProvider>
  );
}`
  }
];

export const inputExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A plain field with placeholder text.",
    componentId: "input-default",
    code: `import { Input } from '@/components/ui/input';

export function Example() {
  return <Input placeholder="Enter your email" />;
}`
  },
  {
    name: "Types",
    description: "Email, password and number fields.",
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
    name: "With label",
    description: "A label and helper text tied to the field.",
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
    name: "Disabled",
    description: "Disabled and read-only fields.",
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
    name: "Validation",
    description: "An error shown while the person types.",
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

export const textareaExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A multi-line field with placeholder text.",
    componentId: "textarea-default",
    code: `import { Textarea } from '@/components/ui/textarea';

export function Example() {
  return <Textarea placeholder="Tell us what happened" className="max-w-md" />;
}`
  },
  {
    name: "With label",
    description: "A labelled field with helper text.",
    componentId: "textarea-label",
    code: `import { Textarea } from '@/components/ui/textarea';

export function Example() {
  return (
    <div className="space-y-2 w-full max-w-md">
      <label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</label>
      <Textarea
        id="bio"
        placeholder="A sentence or two about yourself"
        rows={4}
      />
      <p className="text-sm text-muted-foreground">
        This appears on your public profile.
      </p>
    </div>
  );
}`
  },
  {
    name: "Disabled",
    description: "Disabled and read-only states.",
    componentId: "textarea-disabled",
    code: `import { Textarea } from '@/components/ui/textarea';

export function Example() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="disabled-note" className="text-sm font-medium text-foreground">Disabled</label>
        <Textarea id="disabled-note" placeholder="Not accepting notes right now" disabled />
      </div>
      <div className="space-y-2">
        <label htmlFor="readonly-note" className="text-sm font-medium text-foreground">Read-only</label>
        <Textarea
          id="readonly-note"
          value="Submitted on 12 March. Edits are closed."
          readOnly
        />
      </div>
    </div>
  );
}`
  },
  {
    name: "Character count",
    description: "A length limit the reader sees as they approach it.",
    componentId: "textarea-count",
    code: `import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState('');
  const limit = 180;

  return (
    <div className="space-y-2 w-full max-w-md">
      <label htmlFor="summary" className="text-sm font-medium text-foreground">Summary</label>
      <Textarea
        id="summary"
        placeholder="What is this release about?"
        rows={4}
        maxLength={limit}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-describedby="summary-count"
      />
      <p id="summary-count" aria-live="polite" className="text-sm text-muted-foreground">
        {value.length} / {limit} characters
      </p>
    </div>
  );
}`
  }
];

export const dialogExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A header, two fields and footer actions.",
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
      <DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>
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
    name: "Controlled",
    description: "Hold the open state to close it from your own button.",
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
      <DialogTrigger render={<Button variant="destructive" />}>Delete Item</DialogTrigger>
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
    name: "Nested",
    description: "A dialog that opens another on top.",
    componentId: "dialog-nested",
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
import { Input } from '@/components/ui/input';

export function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Edit Settings</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="display-name" className="text-sm font-medium">Display name</label>
            <Input id="display-name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" defaultValue="john@example.com" />
          </div>
        </div>
        <DialogFooter>
          <Dialog>
            <DialogTrigger render={<Button variant="destructive" />}>
              Delete Account
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>Go Back</DialogClose>
                <Button variant="destructive">Yes, Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DialogClose>Cancel</DialogClose>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`
  },
  {
    name: "With form",
    description: "Inputs, a select, radios and a checkbox inside a modal.",
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
      <DialogTrigger render={<Button />}>Create Rule</DialogTrigger>
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
    name: "Default",
    description: "Three panels, one showing at a time.",
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
    name: "Controlled",
    description: "Hold the active tab in state to read or set it.",
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
    name: "With indicator",
    description: "A bar that slides to the active tab.",
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
    name: "Disabled tab",
    description: "Keep a tab visible but out of reach, for people and agents.",
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
    name: "Controlled",
    description: "Hold the value in state to read it or reset it.",
    componentId: "select-controlled",
    code: `import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const regions = [
  { value: "fra", label: "Frankfurt" },
  { value: "lhr", label: "London" },
  { value: "iad", label: "Virginia" },
  { value: "pdx", label: "Oregon" },
  { value: "sin", label: "Singapore" },
  { value: "nrt", label: "Tokyo" },
]

export function Example() {
  const [region, setRegion] = React.useState<string | null>("lhr")
  return (
    <div className="flex items-center gap-2">
      <Select items={regions} value={region} onValueChange={setRegion}>
        <SelectTrigger aria-label="Region">
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="ghost" onClick={() => setRegion(null)}>Clear</Button>
    </div>
  )
}`
  },
  {
    name: "Multiple",
    description: "Pick several. The value is an array.",
    componentId: "select-multiple",
    code: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const regions = [
  { value: "fra", label: "Frankfurt" },
  { value: "lhr", label: "London" },
  { value: "iad", label: "Virginia" },
  { value: "pdx", label: "Oregon" },
  { value: "sin", label: "Singapore" },
  { value: "nrt", label: "Tokyo" },
]
const labelOf = (v: string) => regions.find((r) => r.value === v)?.label

export function Example() {
  return (
    <Select items={regions} multiple defaultValue={["fra", "sin"]}>
      <SelectTrigger aria-label="Replica regions">
        <SelectValue>
          {(value: string[]) => (value.length ? value.map(labelOf).join(", ") : "No replicas")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {regions.map((r) => (
          <SelectItem key={r.value} value={r.value} showIndicator>{r.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}`
  },
  {
    name: "Groups",
    description: "Label sets of options and divide them.",
    componentId: "select-groups",
    code: `import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Example() {
  return (
    <Select>
      <SelectTrigger aria-label="Timezone" className="w-[240px]">
        <SelectValue placeholder="Choose a timezone" />
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
  )
}`
  },
  {
    name: "Disabled item",
    description: "Keep an option visible but out of reach, for people and agents.",
    componentId: "select-disabled-item",
    code: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const regions = [
  { value: "fra", label: "Frankfurt" },
  { value: "lhr", label: "London" },
  { value: "iad", label: "Virginia" },
  { value: "pdx", label: "Oregon" },
  { value: "sin", label: "Singapore" },
  { value: "nrt", label: "Tokyo" },
]
const full = new Set(["pdx"])

export function Example() {
  return (
    <Select items={regions}>
      <SelectTrigger aria-label="Region">
        <SelectValue placeholder="Choose a region" />
      </SelectTrigger>
      <SelectContent>
        {regions.map((r) => (
          <SelectItem key={r.value} value={r.value} disabled={full.has(r.value)}>
            {r.label}{full.has(r.value) && " (full)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}`
  },
  {
    name: "In a form",
    description: "Give it a name and it submits like a native field.",
    componentId: "select-form",
    code: `import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectFieldLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const regions = [
  { value: "fra", label: "Frankfurt" },
  { value: "lhr", label: "London" },
  { value: "iad", label: "Virginia" },
  { value: "pdx", label: "Oregon" },
  { value: "sin", label: "Singapore" },
  { value: "nrt", label: "Tokyo" },
]

export function Example() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        console.log(new FormData(e.currentTarget).get("region"))
      }}
    >
      <Select items={regions} name="region" required>
        <SelectFieldLabel>Region</SelectFieldLabel>
        <SelectTrigger>
          <SelectValue placeholder="Choose a region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Deploy</Button>
    </form>
  )
}`
  }
];

export const tooltipExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A tooltip on an icon button.",
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
    name: "Positions",
    description: "Top, bottom, left and right.",
    componentId: "tooltip-positions",
    code: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <TooltipProvider>
      <div className="flex gap-4 flex-wrap">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Top</TooltipTrigger>
          <TooltipContent side="top">Tooltip on top</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Bottom</TooltipTrigger>
          <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Left</TooltipTrigger>
          <TooltipContent side="left">Tooltip on left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Right</TooltipTrigger>
          <TooltipContent side="right">Tooltip on right</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}`
  },
  {
    name: "Close on click",
    description: "Whether clicking the trigger dismisses the tooltip.",
    componentId: "tooltip-close-on-click",
    code: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />} closeOnClick={true}>
            Dismisses on click
          </TooltipTrigger>
          <TooltipContent>This tooltip closes when you click the trigger (default)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />} closeOnClick={false}>
            Persists on click
          </TooltipTrigger>
          <TooltipContent>This tooltip stays open when you click the trigger</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}`
  },
  {
    name: "Variants",
    description: "Default and inverse.",
    componentId: "tooltip-variants",
    code: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';

export function Example() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" />}>
            <Settings className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent variant="default">Default tooltip</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" />}>
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
    name: "Default",
    description: "Items, shortcuts and separators.",
    componentId: "menu-default",
    code: `import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuGroup,
  MenuLabel,
} from '@/components/ui/menu';

export function Example() {
  return (
    <Menu>
      <MenuTrigger>Open Menu</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuLabel>My Account</MenuLabel>
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
        </MenuGroup>
        <MenuSeparator />
        <MenuItem>Log out</MenuItem>
      </MenuContent>
    </Menu>
  );
}`
  },
  {
    name: "Checkbox items",
    description: "Items that toggle on and off.",
    componentId: "menu-checkbox",
    code: `import React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuCheckboxItem,
} from '@/components/ui/menu';

export function Example() {
  const [showStatus, setShowStatus] = React.useState(true);
  const [showActivity, setShowActivity] = React.useState(false);

  return (
    <Menu>
      <MenuTrigger>View Options</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuLabel>Appearance</MenuLabel>
          <MenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            Show Status Bar
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
            Show Activity Panel
          </MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}`
  },
  {
    name: "Radio items",
    description: "One choice from a group.",
    componentId: "menu-radio",
    code: `import React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
} from '@/components/ui/menu';

export function Example() {
  const [theme, setTheme] = React.useState('system');

  return (
    <Menu>
      <MenuTrigger>Theme</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuLabel>Select Theme</MenuLabel>
          <MenuRadioGroup value={theme} onValueChange={setTheme}>
            <MenuRadioItem value="light">Light</MenuRadioItem>
            <MenuRadioItem value="dark">Dark</MenuRadioItem>
            <MenuRadioItem value="system">System</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}`
  },
  {
    name: "Submenu",
    description: "A nested menu of related actions.",
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
  },
  {
    name: "Filter",
    description: "A search input, an empty state and separated groups.",
    componentId: "menu-filter",
    code: `import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuGroup,
  MenuLabel,
  MenuFilter,
  MenuInput,
  MenuClear,
  MenuEmpty,
  MenuList,
} from '@/components/ui/menu';

export function Example() {
  return (
    <MenuFilter>
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent className="w-56">
          <MenuInput aria-label="Filter actions" placeholder="Filter actions">
            <MenuClear />
          </MenuInput>
          <MenuEmpty>No actions found.</MenuEmpty>
          <MenuList>
            <MenuGroup data-filter-section>
              <MenuLabel>File</MenuLabel>
              <MenuItem>
                New File
                <MenuShortcut>⌘N</MenuShortcut>
              </MenuItem>
              <MenuItem>
                Open File
                <MenuShortcut>⌘O</MenuShortcut>
              </MenuItem>
              <MenuItem>
                Save
                <MenuShortcut>⌘S</MenuShortcut>
              </MenuItem>
            </MenuGroup>
            <MenuGroup data-filter-section>
              <MenuSeparator data-filter-separator className="hidden" />
              <MenuLabel>Edit</MenuLabel>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Duplicate</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuGroup>
          </MenuList>
        </MenuContent>
      </Menu>
    </MenuFilter>
  );
}`
  },
  {
    name: "Filterable submenu",
    description: "A submenu with its own search input.",
    componentId: "menu-filter-submenu",
    code: `import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  MenuFilter,
  MenuInput,
  MenuClear,
  MenuEmpty,
  MenuList,
} from '@/components/ui/menu';

export function Example() {
  return (
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem>New File</MenuItem>
        <MenuFilter>
          <MenuSub>
            <MenuSubTrigger>Move to</MenuSubTrigger>
            <MenuSubContent className="w-56">
              <MenuInput aria-label="Filter folders" placeholder="Filter folders">
                <MenuClear />
              </MenuInput>
              <MenuEmpty>No folders found.</MenuEmpty>
              <MenuList>
                <MenuItem>Desktop</MenuItem>
                <MenuItem>Documents</MenuItem>
                <MenuItem>Downloads</MenuItem>
                <MenuItem>Projects</MenuItem>
                <MenuItem>Archive</MenuItem>
              </MenuList>
            </MenuSubContent>
          </MenuSub>
        </MenuFilter>
        <MenuSeparator />
        <MenuItem>Delete</MenuItem>
      </MenuContent>
    </Menu>
  );
}`
  }
];

export const drawerExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A form panel that slides in from the right.",
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
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Drawer
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
          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}`
  },
  {
    name: "Sides",
    description: "Enter from any edge with side.",
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
          <DrawerTrigger render={<Button variant="outline" />}>
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </DrawerTrigger>
          <DrawerContent side={side}>
            <DrawerHeader>
              <DrawerTitle>{side.charAt(0).toUpperCase() + side.slice(1)} Drawer</DrawerTitle>
              <DrawerDescription>This drawer slides in from the {side}.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}`
  },
  {
    name: "Navigation",
    description: "A left drawer used as site navigation.",
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
      <DrawerTrigger render={<Button variant="outline" />}>
        Navigation
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
    name: "Default",
    description: "File, Edit and View menus.",
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
    name: "Checkbox items",
    description: "Items that toggle on and off.",
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
    name: "Submenu",
    description: "A nested menu of recent files.",
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
    name: "Default",
    description: "Triggers that open panels of links, beside a plain link.",
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
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
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
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            <NavigationMenuViewport />
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}`
  },
  {
    name: "Links only",
    description: "Plain links with no panels.",
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
  },
  {
    name: "With arrow",
    description: "An arrow points from the panel to its trigger.",
    componentId: "navigation-menu-arrow",
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
  NavigationMenuViewport,
  NavigationMenuArrow,
} from '@/components/ui/navigation-menu';

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 md:w-[300px]">
            <ul className="grid gap-3">
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Analytics</div>
                  <p className="text-xs text-muted-foreground">
                    Track your key metrics in real time.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Automation</div>
                  <p className="text-xs text-muted-foreground">
                    Automate repetitive workflows easily.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            <NavigationMenuArrow />
            <NavigationMenuViewport />
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}`
  },
  {
    name: "With backdrop",
    description: "The page dims behind an open panel.",
    componentId: "navigation-menu-backdrop",
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
  NavigationMenuViewport,
  NavigationMenuBackdrop,
} from '@/components/ui/navigation-menu';

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 md:w-[300px]">
            <ul className="grid gap-3">
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Documentation</div>
                  <p className="text-xs text-muted-foreground">
                    Guides and API references.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Blog</div>
                  <p className="text-xs text-muted-foreground">
                    Latest news and updates.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuBackdrop />
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            <NavigationMenuViewport />
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}`
  }
];

export const comboboxExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Type to filter a list, then pick one.",
    componentId: "combobox-default",
    code: `import {
  Combobox,
  ComboboxInputGroup,
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
      <div className="space-y-2">
        <label htmlFor="combobox-framework" className="block text-sm font-medium leading-none">Framework</label>
        <ComboboxInputGroup className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <ComboboxInput id="combobox-framework" placeholder="Search frameworks..." />
          <ComboboxTrigger />
        </ComboboxInputGroup>
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
    name: "Groups",
    description: "Options under labelled groups.",
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
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <ComboboxInput placeholder="Search languages..." />
        <ComboboxTrigger />
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
    name: "With clear",
    description: "A clear button resets the value.",
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
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <ComboboxInput placeholder="Select a country..." />
        <ComboboxClear />
        <ComboboxTrigger />
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
  },
  {
    name: "Selecting by ID",
    description: "Items built from objects, with the ID as the value.",
    componentId: "combobox-create-items",
    code: `import {
  Combobox,
  ComboboxInput,
  ComboboxClear,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  createComboboxItems,
} from '@/components/ui/combobox';
import { useState } from 'react';

type User = { id: string; name: string; email: string };

const users: User[] = [
  { id: "u1", name: "Ada Lovelace", email: "ada@example.com" },
  { id: "u2", name: "Grace Hopper", email: "grace@example.com" },
  { id: "u3", name: "Katherine Johnson", email: "katherine@example.com" },
  { id: "u4", name: "Linus Torvalds", email: "linus@example.com" },
];

const userItems = createComboboxItems(users, {
  getValue: (user) => user.id,
  getLabel: (user) => user.name,
});

export function Example() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Combobox items={userItems} value={value} onValueChange={setValue} openOnInputClick>
        <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <ComboboxInput placeholder="Select a user..." />
          <ComboboxClear />
          <ComboboxTrigger />
        </div>
        <ComboboxContent>
          <ComboboxEmpty>No users found.</ComboboxEmpty>
          <ComboboxList>
            {(user: User) => (
              <ComboboxItem key={user.id} value={user.id}>
                {user.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p className="text-sm text-muted-foreground">Selected ID: {value ?? "none"}</p>
    </div>
  );
}`
  }
];

export const autocompleteExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Suggestions filter as you type.",
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
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <AutocompleteInput placeholder="Search cities..." />
        <AutocompleteTrigger />
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
    name: "Groups",
    description: "Suggestions under group labels.",
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
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <AutocompleteInput placeholder="Search foods..." />
        <AutocompleteTrigger />
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
    name: "With clear",
    description: "A button that empties the input.",
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
      <div className="flex w-[280px] items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <AutocompleteInput placeholder="Search colors..." />
        <AutocompleteClear />
        <AutocompleteTrigger />
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
    name: "Default",
    description: "Required fields checked on submit.",
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
    name: "Validation",
    description: "Return errors from onFormSubmit and show them per field.",
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
    name: "Contact form",
    description: "Several fields with submit and reset.",
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
    name: "Default",
    description: "Three options with one chosen to start.",
    componentId: "radio-default",
    code: `import { Radio, RadioGroup } from '@/components/ui/radio';

export function Example() {
  return (
    <RadioGroup defaultValue="comfortable">
      <label className="flex items-center gap-2">
        <Radio value="default" />
        <span className="text-sm font-medium">Default</span>
      </label>
      <label className="flex items-center gap-2">
        <Radio value="comfortable" />
        <span className="text-sm font-medium">Comfortable</span>
      </label>
      <label className="flex items-center gap-2">
        <Radio value="compact" />
        <span className="text-sm font-medium">Compact</span>
      </label>
    </RadioGroup>
  );
}`
  },
  {
    name: "Controlled",
    description: "The value lives in state and is shown below.",
    componentId: "radio-controlled",
    code: `import React from 'react';
import { Radio, RadioGroup } from '@/components/ui/radio';

export function Example() {
  const [value, setValue] = React.useState('email');

  return (
    <div className="space-y-3">
      <RadioGroup value={value} onValueChange={setValue}>
        <label className="flex items-center gap-2">
          <Radio value="email" />
          <span className="text-sm font-medium">Email</span>
        </label>
        <label className="flex items-center gap-2">
          <Radio value="sms" />
          <span className="text-sm font-medium">SMS</span>
        </label>
        <label className="flex items-center gap-2">
          <Radio value="push" />
          <span className="text-sm font-medium">Push Notification</span>
        </label>
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  );
}`
  },
  {
    name: "Disabled",
    description: "The whole group is blocked.",
    componentId: "radio-disabled",
    code: `import { Radio, RadioGroup } from '@/components/ui/radio';

export function Example() {
  return (
    <RadioGroup defaultValue="active" disabled>
      <label className="flex items-center gap-2 text-muted-foreground">
        <Radio value="active" />
        <span className="text-sm font-medium">Active</span>
      </label>
      <label className="flex items-center gap-2 text-muted-foreground">
        <Radio value="inactive" />
        <span className="text-sm font-medium">Inactive</span>
      </label>
    </RadioGroup>
  );
}`
  }
];

export const switchExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A switch named by the label around it.",
    componentId: "switch-default",
    code: `import { Switch, SwitchThumb } from '@/components/ui/switch';

export function Example() {
  return (
    <label className="flex items-center space-x-2">
      <Switch>
        <SwitchThumb />
      </Switch>
      <span className="text-sm font-medium">Airplane Mode</span>
    </label>
  );
}`
  },
  {
    name: "Controlled",
    description: "Hold the checked state to show it elsewhere.",
    componentId: "switch-controlled",
    code: `import React from 'react';
import { Switch, SwitchThumb } from '@/components/ui/switch';

export function Example() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-2">
        <Switch checked={enabled} onCheckedChange={setEnabled}>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Dark Mode</span>
      </label>
      <p className="text-sm text-muted-foreground">
        Status: {enabled ? 'Enabled' : 'Disabled'}
      </p>
    </div>
  );
}`
  },
  {
    name: "States",
    description: "On, off and disabled.",
    componentId: "switch-states",
    code: `import { Switch, SwitchThumb } from '@/components/ui/switch';

export function Example() {
  return (
    <div className="space-y-4">
      <label className="flex items-center space-x-2">
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Notifications (on)</span>
      </label>
      <label className="flex items-center space-x-2">
        <Switch>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Marketing emails (off)</span>
      </label>
      <label className="flex items-center space-x-2 text-muted-foreground">
        <Switch disabled>
          <SwitchThumb />
        </Switch>
        <span className="text-sm font-medium">Disabled</span>
      </label>
    </div>
  );
}`
  }
];

export const toggleGroupExamples: ComponentExample[] = [
  {
    name: "Multiple",
    description: "Several items can be pressed at once.",
    componentId: "toggle-group-default",
    code: `import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';

export function Example() {
  return (
    <ToggleGroup multiple>
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
    name: "Single",
    description: "One item pressed at a time.",
    componentId: "toggle-group-single",
    code: `import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function Example() {
  return (
    <ToggleGroup defaultValue={["center"]}>
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
    name: "Sizes",
    description: "Small and default items.",
    componentId: "toggle-group-sizes",
    code: `import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic } from 'lucide-react';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup multiple>
        <ToggleGroupItem value="bold" size="sm" aria-label="Bold">
          <Bold className="h-3 w-3" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="sm" aria-label="Italic">
          <Italic className="h-3 w-3" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup multiple>
        <ToggleGroupItem value="bold" size="default" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" size="default" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup multiple>
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
    name: "Default",
    description: "A bar at 60 percent.",
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
    name: "With label",
    description: "A label and the formatted value.",
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
    name: "Animated",
    description: "The bar eases between values.",
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
    name: "Default",
    description: "A track filled to the value.",
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
    name: "With label",
    description: "A label and the formatted value above the track.",
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
    name: "Levels",
    description: "Indicator colours for low, middle and high readings.",
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
    name: "Default",
    description: "An input between decrement and increment buttons.",
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
    name: "Min and max",
    description: "The value stays between 1 and 10.",
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
    name: "Step",
    description: "A price that steps by 0.01.",
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

export const otpFieldExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Six digits that advance as you type and fill on paste.",
    componentId: "otp-field-default",
    code: `import { OTPField, OTPFieldGroup, OTPFieldInput } from '@/components/ui/otp-field';

export function Example() {
  return (
    <OTPField length={6}>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  );
}`
  },
  {
    name: "With separator",
    description: "The code split into two groups.",
    componentId: "otp-field-separator",
    code: `import { OTPField, OTPFieldGroup, OTPFieldInput, OTPFieldSeparator } from '@/components/ui/otp-field';

export function Example() {
  return (
    <OTPField length={6}>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
      <OTPFieldSeparator>-</OTPFieldSeparator>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  );
}`
  },
  {
    name: "Masked",
    description: "Hides each character like a password field.",
    componentId: "otp-field-masked",
    code: `import { OTPField, OTPFieldGroup, OTPFieldInput } from '@/components/ui/otp-field';

export function Example() {
  return (
    <OTPField length={4} mask>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  );
}`
  },
  {
    name: "Controlled",
    description: "Tracks the value and reacts once the code is complete.",
    componentId: "otp-field-controlled",
    code: `import * as React from 'react';
import { OTPField, OTPFieldGroup, OTPFieldInput } from '@/components/ui/otp-field';

export function Example() {
  const [value, setValue] = React.useState('');
  const [completed, setCompleted] = React.useState<string | null>(null);

  return (
    <div className="space-y-3">
      <OTPField
        length={6}
        value={value}
        onValueChange={(next) => setValue(next)}
        onValueComplete={(next) => setCompleted(next)}
      >
        <OTPFieldGroup>
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
          <OTPFieldInput />
        </OTPFieldGroup>
      </OTPField>
      <p className="text-sm text-muted-foreground">Value: {value || '(empty)'}</p>
      {completed ? <p className="text-sm text-success">Code complete: {completed}</p> : null}
    </div>
  );
}`
  },
  {
    name: "Disabled",
    description: "Blocks input and keeps the value visible.",
    componentId: "otp-field-disabled",
    code: `import { OTPField, OTPFieldGroup, OTPFieldInput } from '@/components/ui/otp-field';

export function Example() {
  return (
    <OTPField length={4} defaultValue="1234" disabled>
      <OTPFieldGroup>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPFieldGroup>
    </OTPField>
  );
}`
  }
];

export const badgeExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A badge with the default style.",
    componentId: "badge-default",
    code: `import { Badge } from '@/components/ui/badge';

export function Example() {
  return <Badge>Badge</Badge>;
}`
  },
  {
    name: "Variants",
    description: "Each colour scheme, from default to info.",
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
    name: "Sizes",
    description: "Small, default and large.",
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
    name: "Default",
    description: "Divides a heading from a row of links.",
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
    name: "Orientations",
    description: "Horizontal and vertical lines.",
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

export const skeletonExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "An avatar and two lines of text.",
    componentId: "skeleton-default",
    code: `import { Skeleton } from '@/components/ui/skeleton';

export function Example() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`
  },
  {
    name: "Card",
    description: "A placeholder for a card with an image.",
    componentId: "skeleton-card",
    code: `import { Skeleton } from '@/components/ui/skeleton';

export function Example() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}`
  }
];

export const labelExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A label paired with an input.",
    componentId: "label-default",
    code: `import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function Example() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}`
  },
  {
    name: "Disabled",
    description: "A label beside a disabled input.",
    componentId: "label-disabled",
    code: `import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function Example() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Disabled
      </Label>
      <Input type="text" id="disabled" placeholder="Disabled" disabled className="peer" />
    </div>
  );
}`
  }
];

export const linkExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A link in the default style.",
    componentId: "link-default",
    code: `import { Link } from '@/components/ui/link';

export function Example() {
  return <Link href="#">DinachiUI Documentation</Link>;
}`
  },
  {
    name: "Variants",
    description: "Default, muted, plain and unstyled.",
    componentId: "link-variants",
    code: `import { Link } from '@/components/ui/link';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="#" variant="default">Default link with underline</Link>
      <Link href="#" variant="muted">Muted link for secondary actions</Link>
      <Link href="#" variant="plain">Plain link without underline</Link>
      <Link href="#" variant="unstyled">Unstyled link for custom styling</Link>
    </div>
  );
}`
  },
  {
    name: "External",
    description: "Opens in a new tab and shows an icon.",
    componentId: "link-external",
    code: `import { Link } from '@/components/ui/link';

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="https://github.com" external>GitHub</Link>
      <Link href="https://react.dev" external variant="muted">React Documentation</Link>
    </div>
  );
}`
  },
  {
    name: "Render element",
    description: "Swaps the anchor for another element, such as a router link.",
    componentId: "link-render",
    code: `import { Link } from '@/components/ui/link';
// import NextLink from 'next/link';

export function Example() {
  // <Link render={<NextLink href="/about" />}>About</Link>
  return (
    <Link render={<button type="button" />}>
      Renders as a button
    </Link>
  );
}`
  },
  {
    name: "Render function",
    description: "Spreads the props onto your own element.",
    componentId: "link-render-function",
    code: `import { Link } from '@/components/ui/link';
// import NextLink from 'next/link';

export function Example() {
  // <Link render={(props) => <NextLink {...props} href="/about" />}>About</Link>
  return (
    <Link render={(props) => <button type="button" {...props} />} variant="muted">
      Render function
    </Link>
  );
}`
  },
];

export const collapsibleExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A section that opens from its trigger.",
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
    name: "Controlled",
    description: "The open state lives in your state.",
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
    name: "Vertical",
    description: "A long list in a fixed height.",
    componentId: "scroll-area-default",
    code: `import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => \`v1.2.0-beta.\${a.length - i}\`
);

export function Example() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`
  },
  {
    name: "Horizontal",
    description: "A row of tiles that scrolls sideways.",
    componentId: "scroll-area-horizontal",
    code: `import { ScrollArea } from '@/components/ui/scroll-area';

export function Example() {
  const items = Array.from({ length: 20 }).map((_, i) => ({
    title: \`Item \${i + 1}\`,
    color: \`hsl(\${i * 18}, 70%, 80%)\`,
  }));

  return (
    <ScrollArea className="w-full max-w-md rounded-md border" orientation="horizontal">
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
    </ScrollArea>
  );
}`
  }
];

export const fieldsetExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A legend over a group of fields.",
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
    name: "Groups",
    description: "Split a long form into labelled sections.",
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
    name: "Default",
    description: "Links in a paragraph that preview on hover.",
    componentId: "preview-card-default",
    code: `import { PreviewCard, PreviewCardTrigger, PreviewCardContent } from '@/components/ui/preview-card';

export function Example() {
  return (
    <p className="text-sm leading-relaxed text-foreground max-w-md">
      Dinachi UI is heavily inspired by{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#">
          Base UI
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Base UI</h4>
            <p className="text-sm text-muted-foreground">
              Unstyled React components and hooks from the creators of Material UI. Ship accessible interfaces without compromising creative freedom.
            </p>
          </div>
        </PreviewCardContent>
      </PreviewCard>
      {' '}and provides accessible, composable components styled with{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#">
          Tailwind CSS
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Tailwind CSS</h4>
            <p className="text-sm text-muted-foreground">
              A utility-first CSS framework for rapidly building custom designs without ever leaving your HTML.
            </p>
          </div>
        </PreviewCardContent>
      </PreviewCard>
      .
    </p>
  );
}`
  },
  {
    name: "Profile",
    description: "An avatar and bio behind a user link.",
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
  },
  {
    name: "Shared card",
    description: "Several links share one card through a handle.",
    componentId: "preview-card-viewport",
    code: `import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
  PreviewCardViewport,
  createPreviewCardHandle,
} from '@/components/ui/preview-card';

const profiles = [
  { name: 'Alice Chen', handle: '@alice', bio: 'Design systems engineer. Building accessible UIs.', initials: 'AC' },
  { name: 'Bob Rivera', handle: '@bob', bio: 'Full-stack developer. Open source contributor.', initials: 'BR' },
  { name: 'Carol Park', handle: '@carol', bio: 'Frontend architect. Tailwind CSS enthusiast.', initials: 'CP' },
];

export function Example() {
  const handle = createPreviewCardHandle();

  return (
    <div className="flex gap-4 items-center">
      {profiles.map((profile) => (
        <PreviewCardTrigger key={profile.handle} href="#" handle={handle} payload={profile}>
          {profile.handle}
        </PreviewCardTrigger>
      ))}
      <PreviewCard handle={handle}>
        {({ payload }) => {
          const profile = payload as (typeof profiles)[number] | undefined;
          return (
            <PreviewCardPortal>
              <PreviewCardPositioner>
                <PreviewCardPopup>
                  <PreviewCardArrow />
                  <PreviewCardViewport>
                    {profile && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            {profile.initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">{profile.name}</h4>
                            <p className="text-xs text-muted-foreground">{profile.handle}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{profile.bio}</p>
                      </div>
                    )}
                  </PreviewCardViewport>
                </PreviewCardPopup>
              </PreviewCardPositioner>
            </PreviewCardPortal>
          );
        }}
      </PreviewCard>
    </div>
  );
}`
  }
];

export const toolbarExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Buttons in groups, separators and a link.",
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
    name: "With toggles",
    description: "Toggles and toggle groups rendered through ToolbarButton.",
    componentId: "toolbar-toggles",
    code: `import { Toolbar, ToolbarButton, ToolbarSeparator } from '@/components/ui/toolbar';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function Example() {
  return (
    <Toolbar>
      <ToggleGroup defaultValue={["bold"]} multiple>
        <ToolbarButton render={<Toggle value="bold" />} aria-label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="italic" />} aria-label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="underline" />} aria-label="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToggleGroup defaultValue={["align-left"]}>
        <ToolbarButton render={<Toggle value="align-left" />} aria-label="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="align-center" />} aria-label="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle value="align-right" />} aria-label="Align right">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </ToggleGroup>
    </Toolbar>
  );
}`
  },
  {
    name: "With input",
    description: "A search input inside the toolbar.",
    componentId: "toolbar-input",
    code: `import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup, ToolbarLink, ToolbarInput } from '@/components/ui/toolbar';
import { Bold, Italic, Link, Search } from 'lucide-react';

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
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarLink href="#">
        <Link className="mr-1 h-4 w-4" />
        Insert Link
      </ToolbarLink>
      <ToolbarSeparator />
      <div className="relative flex items-center">
        <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
        <ToolbarInput placeholder="Search..." className="h-8 w-40 pl-7" />
      </div>
    </Toolbar>
  );
}`
  },
  {
    name: "Vertical",
    description: "A column of buttons with horizontal separators.",
    componentId: "toolbar-vertical",
    code: `import { Toolbar, ToolbarButton, ToolbarSeparator } from '@/components/ui/toolbar';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function Example() {
  return (
    <Toolbar orientation="vertical" className="inline-flex flex-col">
      <ToolbarButton aria-label="Bold">
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Underline">
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarSeparator orientation="horizontal" />
      <ToolbarButton aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
    </Toolbar>
  );
}`
  }
];

export const textExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A plain paragraph.",
    componentId: "text-default",
    code: `import { Text } from '@/components/ui/text';

export function Example() {
  return (
    <Text>
      The quick brown fox jumps over the lazy dog. This is a default paragraph
      rendered as a {'<p>'} element with comfortable leading.
    </Text>
  );
}`
  },
  {
    name: "Variants",
    description: "Every type style, from headings to muted text.",
    componentId: "text-variants",
    code: `import { Text } from '@/components/ui/text';

export function Example() {
  return (
    <div className="space-y-4">
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="p">Paragraph — the default variant with comfortable line height.</Text>
      <Text variant="large">Large text for emphasized body content.</Text>
      <Text variant="small">Small text for captions and metadata.</Text>
      <Text variant="lead">Lead text for introductory paragraphs.</Text>
      <Text variant="muted">Muted text for secondary information and descriptions.</Text>
      <Text variant="blockquote">The best way to predict the future is to invent it.</Text>
      <Text variant="code">console.log("hello world")</Text>
      <Text variant="span">Inline span text for use within other elements.</Text>
    </div>
  );
}`
  },
  {
    name: "Element override",
    description: "The as prop changes the element and keeps the style.",
    componentId: "text-as-override",
    code: `import { Text } from '@/components/ui/text';

export function Example() {
  return (
    <div className="space-y-4">
      <Text variant="h2" as="h3">
        Styled as h2, rendered as {'<h3>'}
      </Text>
      <Text variant="muted" as="span">
        Styled as muted, rendered as {'<span>'} instead of {'<p>'}
      </Text>
    </div>
  );
}`
  }
];

// Component mapping for client-side resolution
export const numberTickerExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Digit columns roll to the value.",
    componentId: "number-ticker-default",
    code: `import { useState } from 'react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Button } from '@/components/ui/button';

export function Example() {
  const [value, setValue] = useState(12480);

  return (
    <div className="flex flex-col items-center gap-4">
      <NumberTicker value={value} className="text-4xl font-semibold" />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setValue(Math.floor(2000 + Math.random() * 90000))}
      >
        Recount
      </Button>
    </div>
  );
}`
  },
  {
    name: "Variants",
    description: "Odometer, counter and split-flap.",
    componentId: "number-ticker-variants",
    code: `import { NumberTicker } from '@/components/ui/number-ticker';

export function Example() {
  return (
    <div className="flex flex-col gap-3">
      <NumberTicker variant="odometer" value={1284} className="text-3xl font-semibold" />
      <NumberTicker variant="counter" value={1284} className="text-3xl font-semibold" />
      <NumberTicker variant="flip" value={1284} className="text-3xl font-semibold" />
    </div>
  );
}`
  },
  {
    name: "Formatting",
    description: "Currency, locale and percent through Intl.NumberFormat.",
    componentId: "number-ticker-format",
    code: `import { NumberTicker } from '@/components/ui/number-ticker';

export function Example() {
  return (
    <div className="grid gap-3 text-center">
      <NumberTicker
        value={48291.5}
        decimals={2}
        locale="en-US"
        format={{ style: 'currency', currency: 'USD' }}
        className="text-3xl font-semibold"
      />
      <NumberTicker
        value={48291.5}
        decimals={1}
        locale="de-DE"
        className="text-3xl font-semibold"
      />
      <NumberTicker
        value={0.482}
        decimals={1}
        format={{ style: 'percent' }}
        className="text-3xl font-semibold"
      />
    </div>
  );
}`
  },
  {
    name: "Live",
    description: "A value on a timer updates instantly, with no roll.",
    componentId: "number-ticker-live",
    code: `import { useEffect, useState } from 'react';
import { NumberTicker } from '@/components/ui/number-ticker';

export function Example() {
  const [requests, setRequests] = useState(1284);

  useEffect(() => {
    const timer = setInterval(
      () => setRequests((n) => n + Math.floor(Math.random() * 40)),
      1200
    );
    return () => clearInterval(timer);
  }, []);

  // Without \`live\` this would restart its roll every 1.2s and never settle.
  return <NumberTicker value={requests} live className="text-4xl font-semibold" />;
}`
  },
];

export const marqueeExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A seamless loop that brakes on hover.",
    componentId: "marquee-default",
    code: `import { Marquee } from '@/components/ui/marquee';

const logos = ['Vercel', 'Linear', 'Supabase', 'Resend', 'Clerk', 'Neon'];

export function Example() {
  return (
    <Marquee className="py-2">
      {logos.map((name) => (
        <span
          key={name}
          className="whitespace-nowrap px-5 text-lg font-semibold text-muted-foreground"
        >
          {name}
        </span>
      ))}
    </Marquee>
  );
}`
  },
  {
    name: "Direction",
    description: "Two strips travelling opposite ways.",
    componentId: "marquee-direction",
    code: `import { Marquee } from '@/components/ui/marquee';

const logos = ['Vercel', 'Linear', 'Supabase', 'Resend', 'Clerk', 'Neon'];

export function Example() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Marquee direction="left" duration={18} className="py-2">
        {logos.map((name) => <Logo key={name} name={name} />)}
      </Marquee>
      <Marquee direction="right" duration={18} className="py-2">
        {logos.map((name) => <Logo key={name} name={name} />)}
      </Marquee>
    </div>
  );
}`
  },
  {
    name: "Interactive content",
    description: "Focus pauses the strip, and the copy stays out of the tab order.",
    componentId: "marquee-links",
    code: `import { Marquee } from '@/components/ui/marquee';

const links = ['Changelog', 'Docs', 'Pricing', 'Blog', 'Careers', 'Support'];

export function Example() {
  return (
    <Marquee duration={30} className="py-2">
      {links.map((label) => (
        <a
          key={label}
          href={\`/\${label.toLowerCase()}\`}
          className="whitespace-nowrap rounded-md px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          {label}
        </a>
      ))}
    </Marquee>
  );
}`
  },
  {
    name: "Content that fits",
    description: "Nothing to reveal, so the strip sits still.",
    componentId: "marquee-fits",
    code: `import { Marquee } from '@/components/ui/marquee';

// No prop turns the loop off. The marquee measures its own content and only
// animates when there is more of it than the container can show.
export function Example() {
  return (
    <Marquee className="py-2">
      <span className="px-5 text-lg font-semibold">Vercel</span>
      <span className="px-5 text-lg font-semibold">Linear</span>
    </Marquee>
  );
}`
  },
];

export const textShimmerExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A band travelling across a pending label.",
    componentId: "text-shimmer-default",
    code: `import { TextShimmer } from '@/components/ui/text-shimmer';

export function Example() {
  return <TextShimmer className="text-lg">Thinking…</TextShimmer>;
}`
  },
  {
    name: "Variants",
    description: "A travelling band, or the whole label breathing.",
    componentId: "text-shimmer-variants",
    code: `import { TextShimmer } from '@/components/ui/text-shimmer';

export function Example() {
  return (
    <div className="flex flex-col gap-4 text-lg">
      <TextShimmer variant="sweep">Sweeping a band across</TextShimmer>
      <TextShimmer variant="pulse">Breathing dim to lit</TextShimmer>
    </div>
  );
}`
  },
  {
    name: "Dim",
    description: "How far the un-lit text drops.",
    componentId: "text-shimmer-dim",
    code: `import { TextShimmer } from '@/components/ui/text-shimmer';

export function Example() {
  return (
    <div className="flex flex-col gap-4 text-lg">
      <TextShimmer dim={0.85}>Barely dimmed</TextShimmer>
      <TextShimmer dim={0.7}>Default</TextShimmer>
      <TextShimmer dim={0.4}>Deeply dimmed</TextShimmer>
    </div>
  );
}`
  },
  {
    name: "Pending",
    description: "Mounted when the work starts, gone when it lands.",
    componentId: "text-shimmer-pending",
    code: `import { useState } from 'react';
import { TextShimmer } from '@/components/ui/text-shimmer';

export function Example() {
  const [reply, setReply] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function ask() {
    setPending(true);
    setReply(await generate());
    setPending(false);
  }

  // Unmounting is what stops the loop. Leaving it up over a settled answer
  // turns a signal into decoration.
  return pending ? <TextShimmer>Generating a reply…</TextShimmer> : <p>{reply}</p>;
}`
  },
];

export const textMorphExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A status label rearranging in place.",
    componentId: "text-morph-default",
    code: `import { useState } from 'react';
import { TextMorph } from '@/components/ui/text-morph';

const statuses = ['Deploying', 'Deployed', 'Deploy failed'];

export function Example() {
  const [index, setIndex] = useState(0);

  return (
    <TextMorph className="text-xl font-medium">{statuses[index]}</TextMorph>
  );
}`
  },
  {
    name: "Related strings",
    description: "The effect lives on how much the two strings share.",
    componentId: "text-morph-related",
    code: `import { TextMorph } from '@/components/ui/text-morph';

export function Example() {
  return (
    <div className="flex flex-col gap-6 text-lg">
      {/* Most characters survive and slide. */}
      <TextMorph>{subscribed ? 'Subscribed' : 'Unsubscribed'}</TextMorph>

      {/* Nothing to share, so every character fades: an expensive crossfade. */}
      <TextMorph>{subscribed ? 'Subscribed' : 'Archive'}</TextMorph>
    </div>
  );
}`
  },
  {
    name: "Tuning",
    description: "How far the arriving and departing characters travel.",
    componentId: "text-morph-tuning",
    code: `import { TextMorph } from '@/components/ui/text-morph';

export function Example() {
  return (
    <div className="flex flex-col gap-4 text-lg">
      <TextMorph blur={0} distance={0}>{label}</TextMorph>
      <TextMorph>{label}</TextMorph>
      <TextMorph blur={6} distance={16}>{label}</TextMorph>
    </div>
  );
}`
  },
];

export const scrollRevealExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A block uncovered edge-first as it arrives.",
    componentId: "scroll-reveal-default",
    code: `import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function Example() {
  return (
    <ScrollReveal>
      <FeatureGrid />
    </ScrollReveal>
  );
}`
  },
  {
    name: "Direction",
    description: "The aperture opens against the travel.",
    componentId: "scroll-reveal-direction",
    code: `import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function Example() {
  return (
    <div className="space-y-40">
      {(['up', 'down', 'left', 'right'] as const).map((direction) => (
        <ScrollReveal key={direction} direction={direction}>
          <Block>{direction}</Block>
        </ScrollReveal>
      ))}
    </div>
  );
}`
  },
  {
    name: "Cascade",
    description: "Sibling reveals offset by a small delay.",
    componentId: "scroll-reveal-cascade",
    code: `import { ScrollReveal } from '@/components/ui/scroll-reveal';

const panels = ['Deploys', 'Incidents', 'Costs'];

export function Example() {
  return (
    <div className="space-y-3">
      {panels.map((panel, index) => (
        // Keep the step in the 0.03-0.08s range. Past that the last block is
        // late enough to read as a wait.
        <ScrollReveal key={panel} delay={index * 0.06}>
          <Block>{panel}</Block>
        </ScrollReveal>
      ))}
    </div>
  );
}`
  },
];

export const staggerListExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Items arriving one after another.",
    componentId: "stagger-list-default",
    code: `import { StaggerList, StaggerListItem } from '@/components/ui/stagger-list';

export function Example() {
  return (
    <StaggerList className="w-56 space-y-2">
      {items.map((item) => (
        <StaggerListItem key={item.id}>{item.label}</StaggerListItem>
      ))}
    </StaggerList>
  );
}`
  },
  {
    name: "Variants",
    description: "Rise, scale, or pull into focus.",
    componentId: "stagger-list-variants",
    code: `import { StaggerList, StaggerListItem } from '@/components/ui/stagger-list';

export function Example() {
  return (
    <StaggerList variant="blur" className="w-32 space-y-2">
      {items.map((item) => (
        <StaggerListItem key={item.id}>{item.label}</StaggerListItem>
      ))}
    </StaggerList>
  );
}`
  },
  {
    name: "Grid",
    description: "A card wall, where a rise has no direction to follow.",
    componentId: "stagger-list-grid",
    code: `import { StaggerList, StaggerListItem } from '@/components/ui/stagger-list';

export function Example() {
  return (
    <StaggerList
      variant="scale"
      stagger={0.04}
      className="grid w-64 grid-cols-2 gap-2"
    >
      {cards.map((card) => (
        <StaggerListItem key={card.id}>{card.label}</StaggerListItem>
      ))}
    </StaggerList>
  );
}`
  },
];

export const animatedListExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A feed whose rows enter, leave and make room for each other.",
    componentId: "animated-list-default",
    code: `import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-list';

export function Example() {
  const [rows, setRows] = React.useState(SEED);
  const [dismissed, setDismissed] = React.useState<string | null>(null);

  const dismiss = (id: string) => {
    setDismissed(id);
    setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <AnimatedList dismissed={dismissed} className="space-y-2">
      {rows.map((row) => (
        <AnimatedListItem key={row.id} itemKey={row.id}>
          <Row row={row} onDismiss={() => dismiss(row.id)} />
        </AnimatedListItem>
      ))}
    </AnimatedList>
  );
}`
  },
  {
    name: "Two exits",
    description: "A row the reader closed leaves differently from one that was retracted.",
    componentId: "animated-list-two-exits",
    code: `// The reader closed it: recorded in the same update that removes it.
const dismiss = (id: string) => {
  setDismissed(id);
  setRows((current) => current.filter((row) => row.id !== id));
};

// Removal the reader did not ask for: no \`dismissed\`, so it collapses in place.
const retract = (id: string) =>
  setRows((current) => current.filter((row) => row.id !== id));`
  },
  {
    name: "From below",
    description: "A log grows downward, so its rows arrive from below.",
    componentId: "animated-list-from-bottom",
    code: `import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-list';

export function Example() {
  return (
    <AnimatedList from="bottom" className="space-y-2">
      {rows.map((row) => (
        <AnimatedListItem key={row.id} itemKey={row.id}>
          <Row row={row} />
        </AnimatedListItem>
      ))}
    </AnimatedList>
  );
}`
  },
];

export const streamingTextExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Words arriving as the stream delivers them.",
    componentId: "streaming-text-default",
    code: `import { StreamingText } from '@/components/ui/streaming-text';

export function Example() {
  const [text, setText] = React.useState("");
  const [pending, setPending] = React.useState(true);

  return <StreamingText text={text} complete={!pending} />;
}`
  },
  {
    name: "Pausing",
    description: "The clock stops with the reveal, so there is no catch-up burst.",
    componentId: "streaming-text-pause",
    code: `<StreamingText text={text} complete={!pending} paused={paused} />`
  },
  {
    name: "Completion",
    description: "onDone waits for the caller, because catching up is not finishing.",
    componentId: "streaming-text-complete",
    code: `// Catching up to the current chunk and the stream ending are indistinguishable
// from inside the component. Only the caller knows which one happened.
<StreamingText
  text={text}
  complete={!pending}
  onDone={() => setDone(true)}
/>`
  },
];

export const swipeableRowExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Flick to open, drag past halfway to commit.",
    componentId: "swipeable-row-default",
    code: `import { SwipeableRow, SwipeableRowGroup } from '@/components/ui/swipeable-row';
import { Archive, Trash2 } from 'lucide-react';

export function Example() {
  return (
    <SwipeableRowGroup>
      {rows.map((row) => (
        <SwipeableRow
          key={row.id}
          actions={[
            { label: \`Archive \${row.title}\`, icon: <Archive className="h-4 w-4" />, onSelect: () => archive(row.id) },
            { label: \`Delete \${row.title}\`, icon: <Trash2 className="h-4 w-4" />, onSelect: () => remove(row.id), destructive: true },
          ]}
          onDismiss={() => remove(row.id)}
        >
          {row.title}
        </SwipeableRow>
      ))}
    </SwipeableRowGroup>
  );
}`
  },
  {
    name: "No full swipe",
    description: "Omit onDismiss and the row only ever opens.",
    componentId: "swipeable-row-no-dismiss",
    code: `<SwipeableRow
  actions={[
    { label: \`Archive \${row.title}\`, icon: <Archive className="h-4 w-4" />, onSelect: () => archive(row.id) },
  ]}
>
  {row.title}
</SwipeableRow>`
  },
  {
    name: "Keyboard",
    description: "Focusing an action opens the row it belongs to.",
    componentId: "swipeable-row-keyboard",
    code: `// The actions are real buttons with accessible names, so the whole interaction
// is reachable without the gesture. Focusing one opens its row.
<SwipeableRow
  actions={[
    { label: \`Archive \${row.title}\`, icon: <Archive className="h-4 w-4" />, onSelect: () => archive(row.id) },
    { label: \`Delete \${row.title}\`, icon: <Trash2 className="h-4 w-4" />, onSelect: () => remove(row.id), destructive: true },
  ]}
>
  {row.title}
</SwipeableRow>`
  },
];

export const sortableExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Drag a row by its grip.",
    componentId: "sortable-default",
    code: `import { Sortable, SortableItem, SortableHandle } from '@/components/ui/sortable';

export function Example() {
  const [order, setOrder] = useState(['overview', 'install', 'components']);

  return (
    <Sortable value={order} onValueChange={setOrder}>
      {order.map((id) => (
        <SortableItem key={id} id={id} label={pages[id].title}>
          <SortableHandle />
          <span className="min-w-0 flex-1 truncate text-sm">{pages[id].title}</span>
        </SortableItem>
      ))}
    </Sortable>
  );
}`
  },
  {
    name: "Keyboard",
    description: "Space to grab, arrows to move, Escape to cancel.",
    componentId: "sortable-keyboard",
    code: `// Nothing to add. The handle is a real button, so the keyboard path comes with it:
// Space grabs, the arrows move, Space drops, Escape restores the pre-grab order, and
// Tab drops the row where it is. Every move goes out through a live region.
<SortableItem id={id} label={pages[id].title}>
  <SortableHandle />
  <span>{pages[id].title}</span>
</SortableItem>`
  },
  {
    name: "Custom handle",
    description: "Your own grip, with the same keyboard and drag behaviour.",
    componentId: "sortable-custom-handle",
    code: `// The handle is a button with your contents inside it. Where it sits in the row is
// a layout decision, not the component's.
<SortableItem id={id} label={pages[id].title}>
  <span className="min-w-0 flex-1 truncate text-sm">{pages[id].title}</span>
  <SortableHandle className="shrink-0 px-2 text-xs font-medium">Move</SortableHandle>
</SortableItem>`
  },
];

export const progressRingExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Press the buttons quickly and watch the spring re-target.",
    componentId: "progress-ring-default",
    code: `import { ProgressRing } from '@/components/ui/progress-ring';

export function Example() {
  return <ProgressRing value={64} label="Upload" />;
}`
  },
  {
    name: "Indeterminate",
    description: "Omit value when there is nothing honest to report.",
    componentId: "progress-ring-indeterminate",
    code: `// No value, so no number and no claim about how far along it is.
<ProgressRing label="Fetching" />`
  },
  {
    name: "Sizes",
    description: "The stroke scales with the ring unless you pin it.",
    componentId: "progress-ring-sizes",
    code: `<ProgressRing value={68} size={128} label="Large" />
<ProgressRing value={68} label="Default" />
<ProgressRing value={68} size={56} label="Compact" />
<ProgressRing value={68} size={56} thickness={3} showValue={false} label="Hairline" />`
  },
];

export const expandableCardExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Focus lands inside, Escape closes, focus comes back.",
    componentId: "expandable-card-default",
    code: `import {
  ExpandableCard,
  ExpandableCardTrigger,
  ExpandableCardPanel,
  ExpandableCardShared,
  ExpandableCardBody,
} from '@/components/ui/expandable-card';

export function Example() {
  return (
    <ExpandableCard>
      <ExpandableCardTrigger>
        <ExpandableCardShared part="art" className="h-24 bg-muted" />
        <ExpandableCardShared part="title" className="p-4 text-sm font-medium">
          The card travels
        </ExpandableCardShared>
      </ExpandableCardTrigger>

      <ExpandableCardPanel title="The card travels">
        <ExpandableCardShared part="art" className="h-40 bg-muted" />
        <ExpandableCardShared part="title" className="px-5 pt-4 text-lg font-medium">
          The card travels
        </ExpandableCardShared>
        <ExpandableCardBody className="px-5 pb-5">
          Content that only exists in the panel arrives after the landing.
        </ExpandableCardBody>
      </ExpandableCardPanel>
    </ExpandableCard>
  );
}`
  },
  {
    name: "Controlled",
    description: "You hold the open state and the close control.",
    componentId: "expandable-card-controlled",
    code: `const [open, setOpen] = useState(false);

// showClose={false} hands the close control over too, which only works if
// something you own can still set open back to false.
<ExpandableCard open={open} onOpenChange={setOpen}>
  <ExpandableCardTrigger>{/* ... */}</ExpandableCardTrigger>
  <ExpandableCardPanel title="Own the open state" showClose={false}>
    {/* ... */}
    <button type="button" onClick={() => setOpen(false)}>Done reading</button>
  </ExpandableCardPanel>
</ExpandableCard>`
  },
  {
    name: "Full screen",
    description: "The same travel, landing on all four edges.",
    componentId: "expandable-card-fullscreen",
    code: `// The card travels the same way; it just lands on the whole viewport. Content
// taller than the screen scrolls, and the close button stays put while it does.
<ExpandableCardPanel fullscreen title="The road that ends at the water">
  <ExpandableCardShared part="art" className="h-56 bg-muted sm:h-72" />
  <div className="mx-auto max-w-2xl space-y-3 px-6 py-8">
    <ExpandableCardShared part="title" className="text-2xl font-medium">
      The road that ends at the water
    </ExpandableCardShared>
    <ExpandableCardBody className="space-y-4 text-base">
      {paragraphs.map((p) => <p key={p}>{p}</p>)}
    </ExpandableCardBody>
  </div>
</ExpandableCardPanel>`
  },
  {
    name: "Not only cards",
    description: "A row expands the same way.",
    componentId: "expandable-card-row",
    code: `// Nothing here is card-shaped. Name the parts that exist on both sides and they
// travel; everything else waits for the landing.
<ExpandableCard>
  <ExpandableCardTrigger className="rounded-lg px-4 py-3">
    <div className="flex items-center justify-between gap-4">
      <ExpandableCardShared part="title">Invoice 4021</ExpandableCardShared>
      <ExpandableCardShared part="meta">Paid · 12 Aug</ExpandableCardShared>
    </div>
  </ExpandableCardTrigger>

  <ExpandableCardPanel title="Invoice 4021" className="max-w-sm">
    {/* the same two parts, larger */}
  </ExpandableCardPanel>
</ExpandableCard>`
  },
];

export const animatedIconExamples: ComponentExample[] = [
  {
    name: "Any pair",
    description: "The shell holds any two icons you give it.",
    componentId: "animated-icon-default",
    code: `import { AnimatedIcon } from '@/components/ui/animated-icon';
import { Play, Pause, Volume2, VolumeX, Copy, Check } from 'lucide-react';

export function Example() {
  const [playing, setPlaying] = useState(false);

  // The icon is decoration; the button is what gets named.
  return (
    <button
      type="button"
      aria-label={playing ? 'Pause' : 'Play'}
      onClick={() => setPlaying((v) => !v)}
    >
      <AnimatedIcon active={playing} from={<Play />} to={<Pause />} />
    </button>
  );
}

// Nothing about the shell is play-specific.
<AnimatedIcon active={muted} from={<Volume2 />} to={<VolumeX />} />
<AnimatedIcon active={copied} from={<Copy />} to={<Check />} />`
  },
  {
    name: "Modes",
    description: "Four ways for the two icons to trade places.",
    componentId: "animated-icon-modes",
    code: `// scale is the default: the outgoing icon drops to 0.7 and the incoming one rises.
<AnimatedIcon active={open} from={<Menu />} to={<X />} />
<AnimatedIcon active={open} from={<Menu />} to={<X />} mode="rotate" />
<AnimatedIcon active={open} from={<Menu />} to={<X />} mode="flip" />
<AnimatedIcon active={open} from={<Menu />} to={<X />} mode="fade" />`
  },
  {
    name: "Sizes",
    description: "One class on the shell sizes both icons.",
    componentId: "animated-icon-sizes",
    code: `// The shell owns the size and both icons fill it. Default is size-5.
<AnimatedIcon active={dark} mode="rotate" from={<Sun />} to={<Moon />} className="size-4" />
<AnimatedIcon active={dark} mode="rotate" from={<Sun />} to={<Moon />} className="size-8" />

// Do not size the icons individually: an icon library ships an intrinsic 24x24,
// which a smaller box squashes on one axis, and two icons sized apart jump.
<AnimatedIcon active={dark} from={<Bell />} to={<BellOff />} className="size-12" />`
  },
];

export const carouselExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Flick it, then drag it slowly and let go.",
    componentId: "carousel-default",
    code: `import {
  Carousel,
  CarouselViewport,
  CarouselSlide,
  CarouselDots,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

export function Example() {
  return (
    <Carousel label="Gesture techniques">
      <CarouselViewport>
        {slides.map((slide) => (
          <CarouselSlide key={slide.id} label={slide.title}>
            <Card slide={slide} />
          </CarouselSlide>
        ))}
      </CarouselViewport>

      <div className="flex items-center justify-between">
        <CarouselDots labels={slides.map((s) => s.title)} />
        <div className="flex gap-1.5">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  );
}`
  },
  {
    name: "Uneven slides",
    description: "Nothing here assumes a slide width.",
    componentId: "carousel-uneven",
    code: `// Positions are read from the DOM, not derived from a nominal slide width, so a
// mixed set lands as accurately as an even one.
<CarouselSlide label={slide.title} className="w-[45%]">
  <Card slide={slide} />
</CarouselSlide>`
  },
  {
    name: "Controlled",
    description: "The index lives with you.",
    componentId: "carousel-controlled",
    code: `const [index, setIndex] = useState(0);

<Carousel label="Highlights" index={index} onIndexChange={setIndex}>
  {/* ... */}
</Carousel>

<p>Slide {index + 1} of {slides.length}</p>`
  },
];

export const loadTransitionExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "The card is taller than its skeleton, and nothing jumps.",
    componentId: "load-transition-default",
    code: `import { LoadTransition } from '@/components/ui/load-transition';

export function Example() {
  const { data, isLoading } = useDeployment();

  // The skeleton mirrors the card's shape, not its height — real content is almost
  // always taller. The panel animates the difference so the page below rides it.
  return (
    <LoadTransition loading={isLoading} skeleton={<DeploySkeleton />}>
      <DeployCard data={data} />
    </LoadTransition>
  );
}`
  },
  {
    name: "Thresholds",
    description: "Two loads, and only the slow one shows a skeleton.",
    componentId: "load-transition-thresholds",
    code: `// Nothing shows for the first 180ms, so a request that returns in 120ms goes
// straight to content. Once shown, the skeleton is held 420ms so it cannot flash.
<LoadTransition loading={isLoading} skeleton={<Placeholder />} delay={180} minimum={420}>
  <Metric value={data.rpm} />
</LoadTransition>

// The hook behind that is exported, if you need to know whether a skeleton is up —
// for a test, or to report the fast path where nothing visible happens at all.
const skeletonVisible = useSkeletonVisibility(isLoading, 180, 420);`
  },
  {
    name: "Without chrome",
    description: "The panel styling is a default, not a requirement.",
    componentId: "load-transition-bare",
    code: `// radius is a number in px, applied inline: motion can only correct the distortion
// its own scale introduces on a value it is animating, and a class is invisible to it.
<LoadTransition
  loading={isLoading}
  skeleton={<div className="h-6 w-28 animate-pulse rounded bg-muted" />}
  className="border-0 bg-transparent p-0"
  radius={0}
>
  <p className="text-xl font-semibold">94 deploys</p>
</LoadTransition>`
  },
];

export const scrollProgressExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "How far a scroll container has been read.",
    componentId: "scroll-progress-default",
    code: `import { ScrollProgress } from '@/components/ui/scroll-progress';

export function Example() {
  // Tracks the page, pinned to the top of the viewport.
  return <ScrollProgress />;
}`
  },
  {
    name: "Smoothing",
    description: "A spring against a 1:1 bar.",
    componentId: "scroll-progress-smooth",
    code: `import { useRef } from 'react';
import { ScrollProgress } from '@/components/ui/scroll-progress';

export function Example() {
  const scrollport = useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollProgress containerRef={scrollport} fixed={false} />
      <ScrollProgress containerRef={scrollport} fixed={false} smooth={false} />
      <article ref={scrollport} className="h-56 overflow-y-auto">
        {children}
      </article>
    </>
  );
}`
  },
  {
    name: "Styling",
    description: "Any div prop reaches the bar.",
    componentId: "scroll-progress-styled",
    code: `import { ScrollProgress } from '@/components/ui/scroll-progress';

export function Example() {
  return (
    <ScrollProgress className="h-1 bg-gradient-to-r from-primary to-primary/40" />
  );
}`
  },
];

export const animatedTabsExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "The pill travels to the tab you click.",
    componentId: "animated-tabs-default",
    code: `import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
} from '@/components/ui/animated-tabs';

export function Example() {
  return (
    <AnimatedTabs defaultValue="overview">
      <AnimatedTabsList>
        <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="activity">Activity</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="settings">Settings</AnimatedTabsTrigger>
      </AnimatedTabsList>
      <AnimatedTabsContent value="overview">Everything at a glance.</AnimatedTabsContent>
      <AnimatedTabsContent value="activity">Who changed what, and when.</AnimatedTabsContent>
      <AnimatedTabsContent value="settings">Names, keys, and members.</AnimatedTabsContent>
    </AnimatedTabs>
  );
}`
  },
  {
    name: "Styled indicator",
    description: "The pill themed without restyling the tab.",
    componentId: "animated-tabs-styled",
    code: `import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from '@/components/ui/animated-tabs';

export function Example() {
  return (
    <AnimatedTabs defaultValue="week">
      <AnimatedTabsList className="bg-transparent p-0">
        {['Day', 'Week', 'Month'].map((label) => (
          <AnimatedTabsTrigger
            key={label}
            value={label.toLowerCase()}
            indicatorClassName="rounded-md bg-primary"
            className="rounded-md data-[active]:text-primary-foreground"
          >
            {label}
          </AnimatedTabsTrigger>
        ))}
      </AnimatedTabsList>
    </AnimatedTabs>
  );
}`
  },
  {
    name: "Controlled",
    description: "The selection held in React state.",
    componentId: "animated-tabs-controlled",
    code: `import { useState } from 'react';
import {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
} from '@/components/ui/animated-tabs';

export function Example() {
  const [value, setValue] = useState('overview');

  return (
    <AnimatedTabs value={value} onValueChange={(next) => setValue(next as string)}>
      <AnimatedTabsList>
        <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="activity">Activity</AnimatedTabsTrigger>
      </AnimatedTabsList>
    </AnimatedTabs>
  );
}`
  },
];

export const compareSliderExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "Drag the divider, or focus it and use the arrow keys.",
    componentId: "compare-slider-default",
    code: `import { CompareSlider } from '@/components/ui/compare-slider';

export function Example() {
  return (
    <CompareSlider
      label="Compare the two revisions"
      before={<img src="/before.jpg" alt="Before retouching" />}
      after={<img src="/after.jpg" alt="After retouching" />}
    />
  );
}`
  },
  {
    name: "Panel drag",
    description: "Press anywhere to jump the divider there.",
    componentId: "compare-slider-panel",
    code: `import { CompareSlider } from '@/components/ui/compare-slider';

export function Example() {
  // Both sides are images, so there is nothing to click and a 2px handle is a
  // needlessly small target.
  return (
    <CompareSlider
      drag="panel"
      label="Compare the two revisions"
      before={<img src="/before.jpg" alt="Before retouching" />}
      after={<img src="/after.jpg" alt="After retouching" />}
    />
  );
}`
  },
  {
    name: "Live content",
    description: "Both layers stay interactive while the handle drags.",
    componentId: "compare-slider-live",
    code: `import { CompareSlider } from '@/components/ui/compare-slider';
import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <CompareSlider
      label="Compare the two plans"
      before={<CurrentPlan />}
      after={
        <ProposedPlan>
          <Button onClick={upgrade}>Upgrade</Button>
        </ProposedPlan>
      }
    />
  );
}`
  },
];

export const holdToConfirmExamples: ComponentExample[] = [
  {
    name: "Default",
    description: "A bar sweeps behind the label.",
    componentId: "hold-to-confirm-default",
    code: `import { HoldToConfirm } from '@/components/ui/hold-to-confirm';

export function Example() {
  return (
    <HoldToConfirm onConfirm={deleteProject} confirmedLabel="Deleted">
      Hold to delete
    </HoldToConfirm>
  );
}`
  },
  {
    name: "Variants",
    description: "Fill, ring, or the button's own border.",
    componentId: "hold-to-confirm-variants",
    code: `import { Trash2 } from 'lucide-react';
import { HoldToConfirm } from '@/components/ui/hold-to-confirm';

export function Example() {
  return (
    <>
      <HoldToConfirm>Fill</HoldToConfirm>
      <HoldToConfirm variant="border">Border</HoldToConfirm>
      {/* Icon-only, so the name has to come from somewhere other than the label. */}
      <HoldToConfirm variant="ring" aria-label="Hold to delete project">
        <Trash2 className="h-4 w-4" />
      </HoldToConfirm>
    </>
  );
}`
  },
  {
    name: "Tuning",
    description: "Duration, and whether the confirmed state returns.",
    componentId: "hold-to-confirm-tuning",
    code: `import { HoldToConfirm } from '@/components/ui/hold-to-confirm';

export function Example() {
  return (
    <>
      <HoldToConfirm duration={800} confirmedLabel="Revoked" onConfirm={revokeKey}>
        Hold briefly
      </HoldToConfirm>

      {/* The row is about to disappear, so there is nothing to return to. */}
      <HoldToConfirm resetAfter={0} confirmedLabel="Deleted" onConfirm={deleteProject}>
        Stays confirmed
      </HoldToConfirm>
    </>
  );
}`
  },
];

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
  'alert-dialog-default': DefaultAlertDialogExample,
  'alert-dialog-controlled': ConfirmationAlertDialogExample,
  'accordion-default': DefaultAccordionExample,
  'accordion-multiple': MultipleAccordionExample,
  'accordion-controlled': ControlledAccordionExample,
  'accordion-disabled': DisabledAccordionExample,
  'accordion-persistent': PersistentAccordionExample,
  'checkbox-default': DefaultCheckboxExample,
  'checkbox-states': CheckboxStatesExample,
  'toast-default': DefaultToastExample,
  'toast-loading': ToastLoadingExample,
  'toast-variants': ToastVariantsExample,
  'toast-close-all': ToastCloseAllExample,
  'toast-custom-render': ToastCustomRenderExample,
  'avatar-default': DefaultAvatarExample,
  'avatar-sizes': AvatarSizesExample,
  'avatar-keep-mounted': AvatarKeepMountedExample,
  'toggle-default': DefaultToggleExample,
  'toggle-variants': ToggleVariantsExample,
  'toggle-sizes': ToggleSizesExample,
  'toggle-controlled': ToggleControlledExample,
  'popover-default': DefaultPopoverExample,
  'popover-close': PopoverWithCloseExample,
  'popover-positions': PopoverPositionExample,
  'popover-hover': PopoverHoverExample,
  'popover-multi-trigger': PopoverMultiTriggerExample,
  'agent-bridge': AgentBridgeExample,
  'input-default': DefaultInputExample,
  'input-types': InputTypesExample,
  'input-label': InputWithLabelExample,
  'input-disabled': InputDisabledExample,
  'input-validation': InputWithValidationExample,
  'textarea-default': DefaultTextareaExample,
  'textarea-label': TextareaWithLabelExample,
  'textarea-disabled': TextareaDisabledExample,
  'textarea-count': TextareaWithCountExample,
  'field-default': DefaultFieldExample,
  'field-validation': FieldWithValidationExample,
  'field-error': FieldWithErrorExample,
  'field-required': RequiredFieldExample,
  'field-disabled': DisabledFieldExample,
  'checkbox-group-default': DefaultCheckboxGroupExample,
  'checkbox-group-controlled': ControlledCheckboxGroupExample,
  'checkbox-group-horizontal': HorizontalCheckboxGroupExample,
  'checkbox-group-disabled': DisabledCheckboxGroupExample,
  'calendar-default': DefaultCalendarExample,
  'calendar-range': RangeCalendarExample,
  'calendar-multiple': MultipleCalendarExample,
  'date-picker-default': DefaultDatePickerExample,
  'date-picker-weekdays': WeekdaysDatePickerExample,
  'date-range-picker-default': DefaultDateRangePickerExample,
  'date-range-picker-future': FutureDateRangePickerExample,
  'month-picker-default': DefaultMonthPickerExample,
  'month-picker-range': RangeMonthPickerExample,
  'week-strip-default': DefaultWeekStripExample,
  'table-invoice': InvoiceTableExample,
  'table-compact': CompactTableExample,
  'pagination-default': DefaultPaginationExample,
  'pagination-compact': CompactPaginationExample,
  'pagination-links': LinksPaginationExample,
  'data-table-basic': BasicDataTableExample,
  'data-table-server': ServerDataTableExample,
  'data-table-virtual': VirtualDataTableExample,
  'week-strip-bookings': BookingsWeekStripExample,
  'year-view-default': DefaultYearViewExample,
  'year-view-months': MonthsYearViewExample,
  'time-slots-default': DefaultTimeSlotsExample,
  'time-slots-rows': RowsTimeSlotsExample,
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
  'dialog-nested': NestedDialogExample,
  'dialog-form': DialogWithFormExample,
  'tabs-default': DefaultTabsExample,
  'tabs-controlled': ControlledTabsExample,
  'tabs-indicator': TabsWithIndicatorExample,
  'tabs-disabled': DisabledTabsExample,
  'select-controlled': ControlledSelectExample,
  'select-multiple': MultipleSelectExample,
  'select-groups': SelectWithGroupsExample,
  'select-disabled-item': DisabledItemSelectExample,
  'select-form': FormSelectExample,
  'tooltip-default': DefaultTooltipExample,
  'tooltip-positions': TooltipPositionsExample,
  'tooltip-close-on-click': TooltipCloseOnClickExample,
  'tooltip-variants': TooltipVariantsExample,
  'menu-default': DefaultMenuExample,
  'menu-checkbox': MenuWithCheckboxExample,
  'menu-radio': MenuWithRadioExample,
  'menu-submenu': MenuWithSubmenuExample,
  'menu-filter': MenuFilterExample,
  'menu-filter-submenu': MenuFilterSubmenuExample,
  'drawer-default': DefaultDrawerExample,
  'drawer-sides': DrawerSidesExample,
  'drawer-navigation': DrawerWithNavigationExample,
  'menubar-default': DefaultMenubarExample,
  'menubar-checkbox': MenubarWithCheckboxExample,
  'menubar-submenu': MenubarWithSubmenuExample,
  'navigation-menu-default': DefaultNavigationMenuExample,
  'navigation-menu-simple': SimpleNavigationMenuExample,
  'navigation-menu-arrow': NavigationMenuWithArrowExample,
  'navigation-menu-backdrop': NavigationMenuWithBackdropExample,
  'combobox-default': DefaultComboboxExample,
  'combobox-groups': ComboboxWithGroupsExample,
  'combobox-clear': ComboboxWithClearExample,
  'combobox-create-items': ComboboxCreateItemsExample,
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
  'otp-field-default': DefaultOTPFieldExample,
  'otp-field-separator': OTPFieldWithSeparatorExample,
  'otp-field-masked': OTPFieldMaskedExample,
  'otp-field-controlled': OTPFieldControlledExample,
  'otp-field-disabled': OTPFieldDisabledExample,
  'badge-default': DefaultBadgeExample,
  'badge-variants': BadgeVariantsExample,
  'badge-sizes': BadgeSizesExample,
  'separator-default': DefaultSeparatorExample,
  'separator-orientations': SeparatorOrientationsExample,
  'skeleton-default': DefaultSkeletonExample,
  'skeleton-card': SkeletonCardExample,
  'label-default': DefaultLabelExample,
  'label-disabled': LabelDisabledExample,
  'link-default': DefaultLinkExample,
  'link-variants': LinkVariantsExample,
  'link-external': LinkExternalExample,
  'link-render': LinkRenderExample,
  'link-render-function': LinkRenderFunctionExample,
  'collapsible-default': DefaultCollapsibleExample,
  'collapsible-controlled': ControlledCollapsibleExample,
  'scroll-area-default': DefaultScrollAreaExample,
  'scroll-area-horizontal': HorizontalScrollAreaExample,
  'fieldset-default': DefaultFieldsetExample,
  'fieldset-groups': FieldsetWithMultipleGroupsExample,
  'preview-card-default': DefaultPreviewCardExample,
  'preview-card-image': PreviewCardWithImageExample,
  'preview-card-viewport': PreviewCardViewportExample,
  'toolbar-default': DefaultToolbarExample,
  'toolbar-toggles': ToolbarWithTogglesExample,
  'toolbar-input': ToolbarWithInputExample,
  'toolbar-vertical': ToolbarVerticalExample,
  'text-default': DefaultTextExample,
  'text-variants': TextVariantsExample,
  'text-as-override': TextAsOverrideExample,
  'number-ticker-default': DefaultNumberTickerExample,
  'number-ticker-variants': NumberTickerVariantsExample,
  'number-ticker-format': NumberTickerFormatExample,
  'number-ticker-live': NumberTickerLiveExample,
  'marquee-default': DefaultMarqueeExample,
  'marquee-direction': MarqueeDirectionExample,
  'marquee-links': MarqueeLinksExample,
  'marquee-fits': MarqueeFitsExample,
  'text-shimmer-default': DefaultTextShimmerExample,
  'text-shimmer-variants': TextShimmerVariantsExample,
  'text-shimmer-dim': TextShimmerDimExample,
  'text-shimmer-pending': TextShimmerPendingExample,
  'text-morph-default': DefaultTextMorphExample,
  'text-morph-related': TextMorphRelatedExample,
  'text-morph-tuning': TextMorphTuningExample,
  'scroll-reveal-default': DefaultScrollRevealExample,
  'scroll-reveal-direction': ScrollRevealDirectionExample,
  'scroll-reveal-cascade': ScrollRevealCascadeExample,
  'stagger-list-default': DefaultStaggerListExample,
  'stagger-list-variants': StaggerListVariantsExample,
  'stagger-list-grid': StaggerListGridExample,
  'animated-list-default': DefaultAnimatedListExample,
  'animated-list-two-exits': AnimatedListTwoExitsExample,
  'animated-list-from-bottom': AnimatedListFromBottomExample,
  'streaming-text-default': DefaultStreamingTextExample,
  'streaming-text-pause': StreamingTextPauseExample,
  'streaming-text-complete': StreamingTextCompleteExample,
  'swipeable-row-default': DefaultSwipeableRowExample,
  'swipeable-row-no-dismiss': SwipeableRowNoDismissExample,
  'swipeable-row-keyboard': SwipeableRowKeyboardExample,
  'sortable-default': DefaultSortableExample,
  'sortable-keyboard': SortableKeyboardExample,
  'sortable-custom-handle': SortableCustomHandleExample,
  'progress-ring-default': DefaultProgressRingExample,
  'progress-ring-indeterminate': IndeterminateProgressRingExample,
  'progress-ring-sizes': ProgressRingSizesExample,
  'expandable-card-default': DefaultExpandableCardExample,
  'expandable-card-controlled': ControlledExpandableCardExample,
  'expandable-card-fullscreen': ExpandableCardFullscreenExample,
  'expandable-card-row': ExpandableCardRowExample,
  'animated-icon-default': DefaultAnimatedIconExample,
  'animated-icon-modes': AnimatedIconModesExample,
  'animated-icon-sizes': AnimatedIconSizesExample,
  'carousel-default': DefaultCarouselExample,
  'carousel-uneven': CarouselUnevenExample,
  'carousel-controlled': CarouselControlledExample,
  'load-transition-default': DefaultLoadTransitionExample,
  'load-transition-thresholds': LoadTransitionThresholdsExample,
  'load-transition-bare': LoadTransitionBareExample,
  'scroll-progress-default': DefaultScrollProgressExample,
  'scroll-progress-smooth': ScrollProgressSmoothExample,
  'scroll-progress-styled': ScrollProgressStyledExample,
  'animated-tabs-default': DefaultAnimatedTabsExample,
  'animated-tabs-styled': AnimatedTabsStyledExample,
  'animated-tabs-controlled': AnimatedTabsControlledExample,
  'compare-slider-default': DefaultCompareSliderExample,
  'compare-slider-panel': CompareSliderPanelExample,
  'compare-slider-live': CompareSliderLiveExample,
  'hold-to-confirm-default': DefaultHoldToConfirmExample,
  'hold-to-confirm-variants': HoldToConfirmVariantsExample,
  'hold-to-confirm-tuning': HoldToConfirmTuningExample,
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
  agent: agentExamples,
  input: inputExamples,
  textarea: textareaExamples,
  field: fieldExamples,
  checkboxGroup: checkboxGroupExamples,
  calendar: calendarExamples,
  datePicker: datePickerExamples,
  dateRangePicker: dateRangePickerExamples,
  monthPicker: monthPickerExamples,
  weekStrip: weekStripExamples,
  table: tableExamples,
  pagination: paginationExamples,
  dataTable: dataTableExamples,
  yearView: yearViewExamples,
  timeSlots: timeSlotsExamples,
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
  otpField: otpFieldExamples,
  badge: badgeExamples,
  separator: separatorExamples,
  skeleton: skeletonExamples,
  label: labelExamples,
  link: linkExamples,
  collapsible: collapsibleExamples,
  scrollArea: scrollAreaExamples,
  fieldset: fieldsetExamples,
  previewCard: previewCardExamples,
  toolbar: toolbarExamples,
  text: textExamples,
  numberTicker: numberTickerExamples,
  marquee: marqueeExamples,
  textShimmer: textShimmerExamples,
  textMorph: textMorphExamples,
  scrollReveal: scrollRevealExamples,
  staggerList: staggerListExamples,
  animatedList: animatedListExamples,
  streamingText: streamingTextExamples,
  swipeableRow: swipeableRowExamples,
  sortable: sortableExamples,
  progressRing: progressRingExamples,
  expandableCard: expandableCardExamples,
  animatedIcon: animatedIconExamples,
  carousel: carouselExamples,
  loadTransition: loadTransitionExamples,
  scrollProgress: scrollProgressExamples,
  animatedTabs: animatedTabsExamples,
  compareSlider: compareSliderExamples,
  holdToConfirm: holdToConfirmExamples,
};
