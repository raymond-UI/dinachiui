import { ComponentExample } from './components-registry';
import { 
  DefaultButtonExample, 
  ButtonVariantsExample, 
  ButtonSizesExample 
} from '@/components/examples/button-examples';

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

// Component mapping for client-side resolution
export const exampleComponents = {
  'button-default': DefaultButtonExample,
  'button-variants': ButtonVariantsExample,
  'button-sizes': ButtonSizesExample,
};

export const examplesRegistry = {
  button: buttonExamples,
};
