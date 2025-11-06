import React from "react";
import {
  FileText,
  Layers,
  Code,
  Zap,
  Info,
  CheckCircle,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";
import CodeBlock from "@/components/reusables/CodeBlock";
import { Badge } from "@/components/ui";
import DocPageHeader from "@/components/layout/doc-page-header";

type ConventionCardProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};
const ConventionCard = ({
  icon: Icon,
  title,
  description = "",
  children,
  className = "",
}: ConventionCardProps) => (
  <section
    className={`bg-background border-[0.5px] border-border rounded-xl p-6 shadow-sm w-full ${className}`}
  >
    <div className="flex items-center gap-3 mb-4">
      {Icon && (
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent-foreground" />
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

const ComparisonBlock = ({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}) => (
  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">
        ❌ Other Libraries
      </p>
      <CodeBlock language="typescript" copyKey={`${label}-before`}>
        {before}
      </CodeBlock>
    </div>
    <div>
      <p className="text-sm font-medium text-foreground mb-2">
        ✅ DinachiUI with Base UI
      </p>
      <CodeBlock language="typescript" copyKey={`${label}-after`}>
        {after}
      </CodeBlock>
    </div>
  </div>
);

export default function ConventionsPage() {
  return (
    <DocPageHeader title="Dinachi design conventions" description="Understand the key conventions and patterns used in DinachiUI to build accessible, consistent and maintainable components.">
      {/* Overview */}
      <section className="mb-12">
        <div className="bg-background/50 backdrop-blur-xs border-[0.5px] border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            Why DinachiUI?
          </h2>
          <p className="text-muted-foreground mb-8">
            DinachiUI is built on top of Base UI, a library of unstyled React UI
            components that provides complete control over your app&apos;s CSS
            and accessibility features. This foundation gives us powerful
            features while maintaining flexibility.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Accessibility First</p>
                <p className="text-xs text-muted-foreground">
                  Built-in ARIA attributes and keyboard navigation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Unstyled Foundation</p>
                <p className="text-xs text-muted-foreground">
                  No CSS conflicts, complete style control
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Modern React</p>
                <p className="text-xs text-muted-foreground">
                  Hooks-based API with render props
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Render Props vs asChild */}
      <ConventionCard title="Render props instead of asChild">
        <p className="text-muted-foreground mb-4 text-pretty max-w-xl ml-0">
          Instead of the{" "}
          <code className="bg-accent px-1 py-0.5 rounded text-xs">asChild</code>{" "}
          prop pattern, Base UI components use render functions that give you
          complete control over the rendered output.
        </p>

        <ComparisonBlock
          label="render-pattern"
          before={`// Radix UI / other libraries
<Trigger asChild>
  <button className="custom-button">
    Click me
  </button>
</Trigger>`}
          after={`// Base UI / DinachiUI
<Trigger
  render={(props) => (
    <button {...props} className="custom-button">
      Click me
    </button>
  )}
/>`}
        />

        <div className="mt-4 border-[0.5px] border-accent rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Benefits & Trade-offs:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• More explicit control over props spreading</li>
            <li>• Easier to compose with other patterns and nest components</li>
            <li>• No React.cloneElement usage (more predictable behavior)</li>
            <li>• Slightly more verbose than asChild pattern</li>
            <li>• May be less intuitive for developers new to render props</li>
          </ul>
        </div>
      </ConventionCard>

      {/* useRender Hook */}
      <section className="mb-12">
        <ConventionCard title="Building custom components with useRender hook">
          <p className="text-muted-foreground mb-4 text-prletty max-w-xl">
            The useRender hook lets you build custom components that provide a
            render prop to override the default rendered element.
          </p>

          <CodeBlock language="typescript" copyKey="userender-basic">
            {`import { useRender } from '@base-ui-components/react/use-render';
import { mergeProps } from '@base-ui-components/react/merge-props';

interface TextProps extends useRender.ComponentProps<'p'> {}

function Text(props: TextProps) {
  const { render, ...otherProps } = props;
  
  const element = useRender({
    defaultTagName: 'p',
    render,
    props: mergeProps<'p'>({ className: 'text-class' }, otherProps),
  });
  
  return element;
}

// Usage
<Text>Default paragraph</Text>
<Text render={<strong />}>Strong text</Text>`}
          </CodeBlock>

          <div className="mt-4 border-[0.5px] border-accent rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">useRender enables:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Render prop pattern for custom components</li>
              <li>• Automatic prop merging and spreading</li>
              <li>• TypeScript support with proper inference</li>
              <li>• State passing through render callbacks</li>
            </ul>
          </div>
        </ConventionCard>

        <div className="mt-6">
          <ConventionCard
            icon={Layers}
            title="Render Function with State"
            description="Pass component state through render callbacks"
          >
            <p className="text-muted-foreground mb-4">
              The callback version of render prop provides access to internal
              component state.
            </p>

            <CodeBlock language="typescript" copyKey="userender-state">
              {`interface CounterState {
  odd: boolean;
}

interface CounterProps extends useRender.ComponentProps<'button', CounterState> {}

function Counter(props: CounterProps) {
  const { render = <button />, ...otherProps } = props;
  const [count, setCount] = React.useState(0);
  
  const odd = count % 2 === 1;
  const state = React.useMemo(() => ({ odd }), [odd]);

  const defaultProps: useRender.ElementProps<'button'> = {
    type: 'button',
    children: <>Counter: <span>{count}</span></>,
    onClick() { setCount(prev => prev + 1); },
  };

  const element = useRender({
    render,
    state,
    props: mergeProps<'button'>(defaultProps, otherProps),
  });

  return element;
}

// Usage with state access
<Counter
  render={(props, state) => (
    <button {...props}>
      {props.children}
      <span>{state.odd ? '👎' : '👍'}</span>
    </button>
  )}
/>`}
            </CodeBlock>
          </ConventionCard>
        </div>
      </section>

      {/* Prop Merging */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary-500" />
          Prop Merging with mergeProps
        </h2>

        <ConventionCard
          icon={Code}
          title="mergeProps Function"
          description="Safely merge React props including event handlers, className, and styles"
        >
          <p className="text-muted-foreground mb-4">
            The mergeProps function merges two or more sets of React props
            together, safely handling event handlers, className strings, and
            style properties.
          </p>

          <CodeBlock language="typescript" copyKey="mergeprops-basic">
            {`import { mergeProps } from '@base-ui-components/react/merge-props';

// Basic prop merging
function Button({ render = <button />, ...props }) {
  const defaultProps = {
    className: 'btn-default',
    onClick: () => console.log('default click'),
    style: { padding: '8px' }
  };
  
  return useRender({
    render,
    props: mergeProps<'button'>(defaultProps, props)
  });
}

// All props are safely merged:
// - Event handlers: both onClick functions will be called
// - className: strings are concatenated
// - style: objects are merged`}
          </CodeBlock>
        </ConventionCard>

        <div className="mt-6">
          <ConventionCard
            icon={Layers}
            title="Render Callback with mergeProps"
            description="Using mergeProps inside render callbacks for custom styling"
          >
            <CodeBlock language="typescript" copyKey="mergeprops-render">
              {`import { mergeProps } from '@base-ui-components/react/merge-props';

function CustomButton() {
  return (
    <Button
      render={(props, state) => (
        <button
          {...mergeProps<'button'>(props, {
            className: 'custom-button',
            style: { 
              backgroundColor: state.pressed ? 'blue' : 'gray' 
            }
          })}
        >
          {props.children}
        </button>
      )}
    >
      Click me
    </Button>
  );
}`}
            </CodeBlock>
          </ConventionCard>
        </div>
      </section>

      {/* Component Composition */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary-500" />
          Component Composition
        </h2>

        <div className="grid gap-6">
          <ConventionCard
            icon={Code}
            title="Custom Component Composition"
            description="Composing Base UI parts with custom React components"
          >
            <p className="text-muted-foreground mb-4">
              Use the render prop to compose Base UI components with your own
              custom components.
            </p>

            <CodeBlock language="typescript" copyKey="composition-basic">
              {`// Composing with custom components
<Menu.Trigger render={<MyButton size="md" />}>
  Open menu
</Menu.Trigger>

// MyButton must forward ref and spread props
const MyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function MyButton({ size = 'md', ...props }, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className={cn('my-button', \`size-\${size}\`, props.className)}
      />
    );
  }
);`}
            </CodeBlock>
          </ConventionCard>

          <ConventionCard
            icon={Layers}
            title="Multiple Component Composition"
            description="Nesting render props for complex component interactions"
          >
            <p className="text-muted-foreground mb-4">
              Render props can be nested deeply for complex component
              combinations like Tooltip + Dialog + Menu.
            </p>

            <CodeBlock language="typescript" copyKey="composition-nested">
              {`// Complex nested composition
<Dialog.Root>
  <Tooltip.Root>
    <Tooltip.Trigger
      render={
        <Dialog.Trigger
          render={
            <Menu.Trigger render={<MyButton size="md" />}>
              Open menu
            </Menu.Trigger>
          }
        />
      }
    />
    <Tooltip.Portal>
      <Tooltip.Content>Opens a dialog with menu</Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
  <Dialog.Portal>
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`}
            </CodeBlock>
          </ConventionCard>

          <ConventionCard
            icon={Code}
            title="Changing Default Elements"
            description="Override the default rendered element using render props"
          >
            <p className="text-muted-foreground mb-4">
              You can use render props to change the underlying HTML element,
              like rendering a Menu.Item as an anchor tag.
            </p>

            <CodeBlock language="typescript" copyKey="composition-element">
              {`// Rendering Menu.Item as a link
<Menu.Root>
  <Menu.Trigger>Song</Menu.Trigger>
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.Item render={<a href="https://base-ui.com" />}>
          Visit Base UI
        </Menu.Item>
        <Menu.Item render={<a href="/library" />}>
          Add to Library
        </Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>`}
            </CodeBlock>
          </ConventionCard>
        </div>
      </section>

      {/* Styling Conventions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-500" />
          Styling Conventions
        </h2>

        <div className="grid gap-6">
          <ConventionCard
            icon={Code}
            title="Class Variance Authority"
            description="Consistent variant system across all components"
          >
            <p className="text-muted-foreground mb-4">
              We use CVA (Class Variance Authority) to create type-safe,
              consistent variant systems.
            </p>

            <CodeBlock language="typescript" copyKey="cva-pattern">
              {`import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);`}
            </CodeBlock>
          </ConventionCard>

          <ConventionCard
            icon={Layers}
            title="CSS Custom Properties"
            description="Theme-aware styling with CSS variables"
          >
            <p className="text-muted-foreground mb-4">
              All colors and spacing use CSS custom properties for easy theming
              and dark mode support.
            </p>

            <CodeBlock language="css" copyKey="css-variables">
              {`:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other dark mode variables */
}`}
            </CodeBlock>
          </ConventionCard>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

        <div className="grid gap-6">
          <ConventionCard
            icon={CheckCircle}
            title="Component Composition"
            description="How to properly compose Base UI components"
          >
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  ✅ Do
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Use render props for custom markup</li>
                  <li>• Spread props correctly to maintain accessibility</li>
                  <li>• Follow the established variant patterns</li>
                  <li>• Use CSS custom properties for theming</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  ❌ Don&apos;t
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Override internal component structure</li>
                  <li>• Skip prop spreading in render functions</li>
                  <li>• Use hardcoded colors instead of CSS variables</li>
                  <li>• Mix asChild patterns with render props</li>
                </ul>
              </div>
            </div>
          </ConventionCard>

          <ConventionCard
            icon={Info}
            title="TypeScript Integration"
            description="Getting the most out of TypeScript with Base UI"
          >
            <p className="text-muted-foreground mb-4">
              Base UI provides excellent TypeScript support with proper
              inference for render props and component props.
            </p>

            <CodeBlock language="typescript" copyKey="typescript-example">
              {`// Type-safe render prop usage
interface CustomButtonProps {
  variant?: 'default' | 'destructive' | 'outline';
  children: React.ReactNode;
}

function CustomButton({ variant = 'default', children }: CustomButtonProps) {
  return (
    <Button
      render={(props) => (
        <button
          {...props}  // Properly typed with all button attributes
          className={cn(buttonVariants({ variant }), props.className)}
        >
          {children}
        </button>
      )}
    />
  );
}`}
            </CodeBlock>
          </ConventionCard>
        </div>
      </section>

      {/* Migration Guide */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          Migration from Other Libraries
        </h2>

        <ConventionCard
          icon={Code}
          title="Common Migration Patterns"
          description="How to adapt from other component libraries"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">From Radix UI:</h4>
              <ComparisonBlock
                label="radix-migration"
                before={`// Radix UI
<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Close asChild>
        <Button>Close</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`}
                after={`// DinachiUI with Base UI
<Dialog>
  <DialogTrigger
    render={(props) => (
      <Button {...props}>Open Dialog</Button>
    )}
  />
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogTitle>Title</DialogTitle>
      <DialogClose
        render={(props) => (
          <Button {...props}>Close</Button>
        )}
      />
    </DialogContent>
  </DialogPortal>
</Dialog>`}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">From Headless UI:</h4>
              <ComparisonBlock
                label="headless-migration"
                before={`// Headless UI
<Menu>
  <Menu.Button>Options</Menu.Button>
  <Menu.Items>
    <Menu.Item>
      {({ active }) => (
        <a className={active ? 'active' : ''}>
          Account
        </a>
      )}
    </Menu.Item>
  </Menu.Items>
</Menu>`}
                after={`// DinachiUI with Base UI
<Menu>
  <MenuTrigger
    render={(props) => (
      <Button {...props}>Options</Button>
    )}
  />
  <MenuPositioner>
    <MenuPopup>
      <MenuItem
        render={(props) => (
          <a {...props} className={cn('menu-item', props.className)}>
            Account
          </a>
        )}
      />
    </MenuPopup>
  </MenuPositioner>
</Menu>`}
              />
            </div>
          </div>
        </ConventionCard>
      </section>
    </DocPageHeader>
  );
}
