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
};

export const examplesRegistry = {
  button: buttonExamples,
  contextMenu: contextMenuExamples,
};
