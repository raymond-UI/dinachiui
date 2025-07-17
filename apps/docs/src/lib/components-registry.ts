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
