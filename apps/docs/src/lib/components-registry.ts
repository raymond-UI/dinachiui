export interface ComponentExample {
  name: string;
  description: string;
  componentId: string;
  code: string;
  codeBlock?: React.ReactNode;
}

export interface ComponentProp {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  required?: boolean;
}

export interface ComponentDoc {
  name: string;
  slug: string;
  description: string;
  category: string;
  usage: string;
  installation: {
    cli: string;
    manual: string[];
  };
  props: ComponentProp[];
  examples: ComponentExample[];
  dependencies: string[];
  source: string;
}

import { examplesRegistry } from './examples-registry';

export const componentsRegistry: Record<string, ComponentDoc> = {
  button: {
    name: "Button",
    slug: "button",
    description: "A customizable button component with multiple variants and sizes. Built with accessibility in mind.",
    category: "Form",
    usage: "import { Button } from '@/components/ui/button'",
    installation: {
      cli: "npx @dinachi/cli@latest add button",
      manual: [
        "Copy the button component code",
        "Install dependencies: @base-ui-components/react class-variance-authority",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "variant",
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        description: "The visual style variant of the button",
        defaultValue: "'default'",
        required: false
      },
      {
        name: "size",
        type: "'default' | 'sm' | 'lg' | 'icon'",
        description: "The size of the button",
        defaultValue: "'default'",
        required: false
      },
      {
        name: "asChild",
        type: "boolean",
        description: "Change the component to the HTML tag or custom component of the only child",
        defaultValue: "false",
        required: false
      }
    ],
    examples: examplesRegistry.button || [],
    dependencies: ["@base-ui-components/react", "class-variance-authority"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/button"
  },
  input: {
    name: "Input",
    slug: "input",
    description: "A customizable input field component with support for different types and states.",
    category: "Form",
    usage: "import { Input } from '@/components/ui/input'",
    installation: {
      cli: "npx @dinachi/cli@latest add input",
      manual: [
        "Copy the input component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "type",
        type: "string",
        description: "The type of input field",
        defaultValue: "'text'",
        required: false
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text for the input",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the input is disabled",
        defaultValue: "false",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/input"
  },
  card: {
    name: "Card",
    slug: "card",
    description: "A flexible container component for displaying content with optional header, body, and footer.",
    category: "Layout",
    usage: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'",
    installation: {
      cli: "npx @dinachi/cli@latest add card",
      manual: [
        "Copy the card component code",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to apply to the card",
        required: false
      }
    ],
    examples: [],
    dependencies: [],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/card"
  },
  badge: {
    name: "Badge",
    slug: "badge",
    description: "A small label component for displaying status, categories, or other metadata.",
    category: "Display",
    usage: "import { Badge } from '@/components/ui/badge'",
    installation: {
      cli: "npx @dinachi/cli@latest add badge",
      manual: [
        "Copy the badge component code",
        "Install dependencies: class-variance-authority",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "variant",
        type: "'default' | 'secondary' | 'destructive' | 'outline'",
        description: "The visual style variant of the badge",
        defaultValue: "'default'",
        required: false
      }
    ],
    examples: [],
    dependencies: ["class-variance-authority"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/badge"
  },
  dialog: {
    name: "Dialog",
    slug: "dialog",
    description: "A modal overlay component for displaying content on top of the main interface.",
    category: "Overlay",
    usage: "import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'",
    installation: {
      cli: "npx @dinachi/cli@latest add dialog",
      manual: [
        "Copy the dialog component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Whether the dialog is open",
        required: false
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the dialog open state changes",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/dialog"
  },
  tabs: {
    name: "Tabs",
    slug: "tabs",
    description: "A component for organizing content into multiple panels, with only one panel visible at a time.",
    category: "Navigation",
    usage: "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'",
    installation: {
      cli: "npx @dinachi/cli@latest add tabs",
      manual: [
        "Copy the tabs component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "defaultValue",
        type: "string",
        description: "The default selected tab",
        required: false
      },
      {
        name: "value",
        type: "string",
        description: "The controlled selected tab",
        required: false
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Callback fired when the selected tab changes",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/tabs"
  },
  "context-menu": {
    name: "Context Menu",
    slug: "context-menu",
    description: "A versatile context menu component that appears on right-click or long press, providing contextual actions and options with support for items, checkboxes, radio groups, separators, shortcuts, and nested submenus.",
    category: "Overlay",
    usage: "import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'",
    installation: {
      cli: "npx @dinachi/cli@latest add context-menu",
      manual: [
        "Copy the context-menu component code",
        "Install dependencies: @base-ui-components/react lucide-react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "defaultOpen",
        type: "boolean",
        description: "Whether the context menu is open by default",
        defaultValue: "false",
        required: false
      },
      {
        name: "open",
        type: "boolean",
        description: "Controls the open state of the context menu",
        required: false
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the context menu open state changes",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the context menu is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "The content of the context menu",
        required: true
      }
    ],
    examples: examplesRegistry.contextMenu || [],
    dependencies: ["@base-ui-components/react", "lucide-react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/context-menu"
  },
  "alert-dialog": {
    name: "Alert Dialog",
    slug: "alert-dialog",
    description: "A modal dialog component that interrupts the user with important content and expects a response. Used for confirmations, warnings, and critical actions.",
    category: "Overlay",
    usage: "import { AlertDialog, AlertDialogTrigger, AlertDialogPortal, AlertDialogBackdrop, AlertDialogPopup, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog'",
    installation: {
      cli: "npx @dinachi/cli@latest add alert-dialog",
      manual: [
        "Copy the alert-dialog component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controls the open state of the alert dialog",
        required: false
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the alert dialog open state changes",
        required: false
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "The content of the alert dialog",
        required: true
      }
    ],
    examples: examplesRegistry.alertDialog || [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/alert-dialog"
  },
  "accordion": {
    name: "Accordion",
    slug: "accordion",
    description: "A collapsible component that allows users to toggle the visibility of content sections. Perfect for FAQs, documentation, and organizing large amounts of information.",
    category: "Display",
    usage: "import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion'",
    installation: {
      cli: "npx @dinachi/cli@latest add accordion",
      manual: [
        "Copy the accordion component code",
        "Install dependencies: @base-ui-components/react lucide-react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "type",
        type: "'single' | 'multiple'",
        description: "Whether multiple panels can be open simultaneously",
        defaultValue: "'single'",
        required: false
      },
      {
        name: "defaultValue",
        type: "string | string[]",
        description: "The default open panels",
        required: false
      },
      {
        name: "value",
        type: "string | string[]",
        description: "Controls the open panels",
        required: false
      },
      {
        name: "onValueChange",
        type: "(value: string | string[]) => void",
        description: "Callback fired when the open panels change",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the accordion is disabled",
        defaultValue: "false",
        required: false
      }
    ],
    examples: examplesRegistry.accordion || [],
    dependencies: ["@base-ui-components/react", "lucide-react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/accordion"
  },
  "checkbox": {
    name: "Checkbox",
    slug: "checkbox",
    description: "A checkbox component that allows users to select multiple options from a list. Includes support for indeterminate state and custom styling.",
    category: "Form",
    usage: "import { Checkbox } from '@/components/ui/checkbox'",
    installation: {
      cli: "npx @dinachi/cli@latest add checkbox",
      manual: [
        "Copy the checkbox component code",
        "Install dependencies: @base-ui-components/react lucide-react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "checked",
        type: "boolean | 'indeterminate'",
        description: "The checked state of the checkbox",
        required: false
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description: "The default checked state",
        defaultValue: "false",
        required: false
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean | 'indeterminate') => void",
        description: "Callback fired when the checked state changes",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the checkbox is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "required",
        type: "boolean",
        description: "Whether the checkbox is required",
        defaultValue: "false",
        required: false
      }
    ],
    examples: examplesRegistry.checkbox || [],
    dependencies: ["@base-ui-components/react", "lucide-react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/checkbox"
  },
  "checkbox-group": {
    name: "Checkbox Group",
    slug: "checkbox-group",
    description: "A group component that manages multiple checkboxes with shared state and validation. Perfect for multi-select forms and preference settings.",
    category: "Form",
    usage: "import { CheckboxGroup } from '@/components/ui/checkbox-group'",
    installation: {
      cli: "npx @dinachi/cli@latest add checkbox-group",
      manual: [
        "Copy the checkbox-group component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "value",
        type: "string[]",
        description: "The currently selected values",
        required: false
      },
      {
        name: "defaultValue",
        type: "string[]",
        description: "The default selected values",
        defaultValue: "[]",
        required: false
      },
      {
        name: "onValueChange",
        type: "(value: string[]) => void",
        description: "Callback fired when the selected values change",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the checkbox group is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "required",
        type: "boolean",
        description: "Whether at least one checkbox must be selected",
        defaultValue: "false",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/checkbox-group"
  },
  "slider": {
    name: "Slider",
    slug: "slider",
    description: "A customizable slider component for selecting numeric values within a range. Supports single and multiple handles, custom steps, and vertical orientation.",
    category: "Form",
    usage: "import { Slider, SliderControl, SliderTrack, SliderRange, SliderThumb, SliderValue } from '@/components/ui/slider'",
    installation: {
      cli: "npx @dinachi/cli@latest add slider",
      manual: [
        "Copy the slider component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "value",
        type: "number[]",
        description: "The current value(s) of the slider",
        required: false
      },
      {
        name: "defaultValue",
        type: "number[]",
        description: "The default value(s) of the slider",
        required: false
      },
      {
        name: "onValueChange",
        type: "(value: number[]) => void",
        description: "Callback fired when the slider values change",
        required: false
      },
      {
        name: "min",
        type: "number",
        description: "The minimum value of the slider",
        defaultValue: "0",
        required: false
      },
      {
        name: "max",
        type: "number",
        description: "The maximum value of the slider",
        defaultValue: "100",
        required: false
      },
      {
        name: "step",
        type: "number",
        description: "The step increment for the slider",
        defaultValue: "1",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the slider is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        description: "The orientation of the slider",
        defaultValue: "'horizontal'",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/slider"
  },
  "collapsible": {
    name: "Collapsible",
    slug: "collapsible",
    description: "A flexible collapsible component that can show and hide content with smooth animations. Perfect for FAQs, expandable sections, and space-saving layouts.",
    category: "Display",
    usage: "import { Collapsible, CollapsibleTrigger, CollapsiblePanel } from '@/components/ui/collapsible'",
    installation: {
      cli: "npx @dinachi/cli@latest add collapsible",
      manual: [
        "Copy the collapsible component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controls the open state of the collapsible",
        required: false
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "The default open state",
        defaultValue: "false",
        required: false
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the open state changes",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the collapsible is disabled",
        defaultValue: "false",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/collapsible"
  },
  "toast": {
    name: "Toast",
    slug: "toast",
    description: "A non-intrusive notification system that displays temporary messages to users. Supports multiple variants, stacking, actions, and promise states for async operations.",
    category: "Feedback",
    usage: "import { Toast, ToastProvider, ToastViewport, ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, useToastManager } from '@/components/ui/toast'",
    installation: {
      cli: "npx @dinachi/cli@latest add toast",
      manual: [
        "Copy the toast component code",
        "Install dependencies: @base-ui-components/react class-variance-authority",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "variant",
        type: "'default' | 'destructive' | 'success' | 'warning' | 'loading'",
        description: "The visual style variant of the toast",
        defaultValue: "'default'",
        required: false
      },
      {
        name: "limit",
        type: "number",
        description: "Maximum number of toasts to show at once",
        defaultValue: "3",
        required: false
      },
      {
        name: "timeout",
        type: "number",
        description: "Auto-dismiss timeout in milliseconds",
        defaultValue: "5000",
        required: false
      },
      {
        name: "swipeDirection",
        type: "Array<'up' | 'down' | 'left' | 'right'>",
        description: "Allowed swipe directions for dismissing",
        defaultValue: "['down', 'right']",
        required: false
      },
      {
        name: "title",
        type: "string",
        description: "The title of the toast message",
        required: false
      },
      {
        name: "description",
        type: "string",
        description: "The description text of the toast",
        required: false
      }
    ],
    examples: examplesRegistry.toast || [],
    dependencies: ["@base-ui-components/react", "class-variance-authority"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/toast"
  },
  "menubar": {
    name: "Menubar",
    slug: "menubar",
    description: "A horizontal menu component that provides navigation and actions through dropdown menus. Supports nested submenus, keyboard navigation, and various item types.",
    category: "Navigation",
    usage: "import { Menubar, MenubarMenu, MenubarTrigger, MenubarPortal, MenubarContent, MenubarItem, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarLabel, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubTrigger, MenubarSubContent } from '@/components/ui/menubar'",
    installation: {
      cli: "npx @dinachi/cli@latest add menubar",
      manual: [
        "Copy the menubar component code",
        "Install dependencies: @base-ui-components/react lucide-react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "value",
        type: "string",
        description: "The currently active menu value",
        required: false
      },
      {
        name: "defaultValue",
        type: "string",
        description: "The default active menu value",
        required: false
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Callback fired when the active menu changes",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the menubar is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "dir",
        type: "'ltr' | 'rtl'",
        description: "The reading direction of the menubar",
        defaultValue: "'ltr'",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react", "lucide-react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/menubar"
  },
  "navigation-menu": {
    name: "Navigation Menu",
    slug: "navigation-menu",
    description: "A collection of navigation links with dropdown functionality. Features smooth animations, keyboard navigation, and flexible content positioning.",
    category: "Navigation",
    usage: "import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport } from '@/components/ui/navigation-menu'",
    installation: {
      cli: "npx @dinachi/cli@latest add navigation-menu",
      manual: [
        "Copy the navigation-menu component code",
        "Install dependencies: @base-ui-components/react lucide-react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "value",
        type: "string",
        description: "The currently active navigation item",
        required: false
      },
      {
        name: "defaultValue",
        type: "string",
        description: "The default active navigation item",
        required: false
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Callback fired when the active item changes",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the navigation menu is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "dir",
        type: "'ltr' | 'rtl'",
        description: "The reading direction of the navigation menu",
        defaultValue: "'ltr'",
        required: false
      },
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        description: "The orientation of the navigation menu",
        defaultValue: "'horizontal'",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react", "lucide-react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/navigation-menu"
  },
  "preview-card": {
    name: "Preview Card",
    slug: "preview-card",
    description: "A hover card component that displays rich content when hovering over a trigger element. Perfect for link previews, user profiles, and contextual information.",
    category: "Overlay",
    usage: "import { PreviewCard, PreviewCardTrigger, PreviewCardPortal, PreviewCardContent, PreviewCardArrow } from '@/components/ui/preview-card'",
    installation: {
      cli: "npx @dinachi/cli@latest add preview-card",
      manual: [
        "Copy the preview-card component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "openDelay",
        type: "number",
        description: "The delay in milliseconds before opening",
        defaultValue: "700",
        required: false
      },
      {
        name: "closeDelay",
        type: "number",
        description: "The delay in milliseconds before closing",
        defaultValue: "300",
        required: false
      },
      {
        name: "open",
        type: "boolean",
        description: "Controls the open state of the preview card",
        required: false
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the open state changes",
        required: false
      },
      {
        name: "side",
        type: "'top' | 'right' | 'bottom' | 'left'",
        description: "The preferred side of the trigger to render against",
        defaultValue: "'bottom'",
        required: false
      },
      {
        name: "sideOffset",
        type: "number",
        description: "The distance in pixels from the trigger",
        defaultValue: "8",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/preview-card"
  },
  "popover": {
    name: "Popover",
    slug: "popover",
    description: "An accessible popup anchored to a button. A high-quality, unstyled React popover component that displays content in a floating panel.",
    category: "Overlay",
    usage: "import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverTitle, PopoverDescription, PopoverClose } from '@/components/ui/popover'",
    installation: {
      cli: "npx @dinachi/cli@latest add popover",
      manual: [
        "Copy the popover component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "defaultOpen",
        type: "boolean",
        description: "Whether the popover is initially open",
        defaultValue: "false",
        required: false
      },
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state",
        required: false
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when open state changes",
        required: false
      },
      {
        name: "modal",
        type: "boolean | 'trap-focus'",
        description: "Whether to enter modal mode",
        defaultValue: "false",
        required: false
      },
      {
        name: "openOnHover",
        type: "boolean",
        description: "Open popover on hover",
        defaultValue: "false",
        required: false
      },
      {
        name: "delay",
        type: "number",
        description: "Hover delay in milliseconds",
        defaultValue: "300",
        required: false
      },
      {
        name: "closeDelay",
        type: "number",
        description: "Close delay in milliseconds",
        defaultValue: "0",
        required: false
      },
      {
        name: "side",
        type: "'top' | 'bottom' | 'left' | 'right'",
        description: "Preferred side",
        defaultValue: "'bottom'",
        required: false
      },
      {
        name: "align",
        type: "'start' | 'center' | 'end'",
        description: "Alignment relative to trigger",
        defaultValue: "'center'",
        required: false
      },
      {
        name: "sideOffset",
        type: "number",
        description: "Distance from trigger in pixels",
        defaultValue: "8",
        required: false
      }
    ],
    examples: examplesRegistry.popover || [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/popover"
  },
  "toggle": {
    name: "Toggle",
    slug: "toggle",
    description: "A two-state button that can be either on or off. Perfect for settings, filters, and boolean controls with visual feedback.",
    category: "Form",
    usage: "import { Toggle } from '@/components/ui/toggle'",
    installation: {
      cli: "npx @dinachi/cli@latest add toggle",
      manual: [
        "Copy the toggle component code",
        "Install dependencies: @base-ui-components/react class-variance-authority",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "variant",
        type: "'default' | 'outline'",
        description: "The visual style variant of the toggle",
        defaultValue: "'default'",
        required: false
      },
      {
        name: "size",
        type: "'default' | 'sm' | 'lg'",
        description: "The size of the toggle",
        defaultValue: "'default'",
        required: false
      },
      {
        name: "pressed",
        type: "boolean",
        description: "The pressed state of the toggle",
        required: false
      },
      {
        name: "defaultPressed",
        type: "boolean",
        description: "The default pressed state",
        defaultValue: "false",
        required: false
      },
      {
        name: "onPressedChange",
        type: "(pressed: boolean) => void",
        description: "Callback fired when the pressed state changes",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the toggle is disabled",
        defaultValue: "false",
        required: false
      }
    ],
    examples: examplesRegistry.toggle || [],
    dependencies: ["@base-ui-components/react", "class-variance-authority"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/toggle"
  },
  "toolbar": {
    name: "Toolbar",
    slug: "toolbar",
    description: "A container for grouping related controls and actions. Provides keyboard navigation and supports various toolbar items like buttons, inputs, and separators.",
    category: "Layout",
    usage: "import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, ToolbarGroup, ToolbarInput } from '@/components/ui/toolbar'",
    installation: {
      cli: "npx @dinachi/cli@latest add toolbar",
      manual: [
        "Copy the toolbar component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        description: "The orientation of the toolbar",
        defaultValue: "'horizontal'",
        required: false
      },
      {
        name: "dir",
        type: "'ltr' | 'rtl'",
        description: "The reading direction of the toolbar",
        defaultValue: "'ltr'",
        required: false
      },
      {
        name: "loop",
        type: "boolean",
        description: "Whether to loop keyboard navigation",
        defaultValue: "true",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/toolbar"
  },
  "tooltip": {
    name: "Tooltip",
    slug: "tooltip",
    description: "A floating label that appears when hovering over or focusing on an element. Provides contextual information and help text with accessibility support.",
    category: "Overlay",
    usage: "import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'",
    installation: {
      cli: "npx @dinachi/cli@latest add tooltip",
      manual: [
        "Copy the tooltip component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "variant",
        type: "'default' | 'inverse'",
        description: "The visual style variant of the tooltip",
        defaultValue: "'default'",
        required: false
      },
      {
        name: "openDelay",
        type: "number",
        description: "The delay in milliseconds before opening",
        defaultValue: "700",
        required: false
      },
      {
        name: "closeDelay",
        type: "number",
        description: "The delay in milliseconds before closing",
        defaultValue: "300",
        required: false
      },
      {
        name: "side",
        type: "'top' | 'right' | 'bottom' | 'left'",
        description: "The preferred side of the trigger to render against",
        defaultValue: "'top'",
        required: false
      },
      {
        name: "sideOffset",
        type: "number",
        description: "The distance in pixels from the trigger",
        defaultValue: "4",
        required: false
      },
      {
        name: "showArrow",
        type: "boolean",
        description: "Whether to show the tooltip arrow",
        defaultValue: "true",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/tooltip"
  },
  "avatar": {
    name: "Avatar",
    slug: "avatar",
    description: "A component for displaying user profile images with fallback support. Includes automatic fallback to initials when images fail to load.",
    category: "Display",
    usage: "import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'",
    installation: {
      cli: "npx @dinachi/cli@latest add avatar",
      manual: [
        "Copy the avatar component code",
        "Install dependencies: @base-ui-components/react class-variance-authority",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        description: "The size of the avatar",
        defaultValue: "'md'",
        required: false
      },
      {
        name: "src",
        type: "string",
        description: "The source URL of the avatar image",
        required: false
      },
      {
        name: "alt",
        type: "string",
        description: "Alternative text for the avatar image",
        required: false
      },
      {
        name: "fallback",
        type: "React.ReactNode",
        description: "Fallback content when image fails to load",
        required: false
      }
    ],
    examples: examplesRegistry.avatar || [],
    dependencies: ["@base-ui-components/react", "class-variance-authority"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/avatar"
  },
  "field": {
    name: "Field",
    slug: "field",
    description: "A comprehensive form field component with label, control, description, and error handling. Provides validation state management and accessibility features.",
    category: "Form",
    usage: "import { Field, FieldLabel, FieldControl, FieldDescription, FieldError, FieldValidity } from '@/components/ui/field'",
    installation: {
      cli: "npx @dinachi/cli@latest add field",
      manual: [
        "Copy the field component code",
        "Install dependencies: @base-ui-components/react",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "name",
        type: "string",
        description: "The name of the field for form submission",
        required: true
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the field is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "invalid",
        type: "boolean",
        description: "Whether the field has validation errors",
        defaultValue: "false",
        required: false
      },
      {
        name: "required",
        type: "boolean",
        description: "Whether the field is required",
        defaultValue: "false",
        required: false
      },
      {
        name: "validate",
        type: "(value: any) => string | undefined",
        description: "Custom validation function",
        required: false
      }
    ],
    examples: [],
    dependencies: ["@base-ui-components/react"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/field"
  }
};

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return componentsRegistry[slug];
}

export function getAllComponents(): ComponentDoc[] {
  return Object.values(componentsRegistry);
}

export function getComponentsByCategory(category: string): ComponentDoc[] {
  return Object.values(componentsRegistry).filter(component => component.category === category);
}

export const categories = [
  "Form",
  "Layout", 
  "Display",
  "Navigation",
  "Overlay",
  "Feedback"
] as const;
