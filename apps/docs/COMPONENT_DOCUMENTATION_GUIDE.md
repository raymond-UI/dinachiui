# Component Documentation Guide

This guide explains how to create comprehensive documentation pages for new components in the DinachiUI documentation system.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Process](#step-by-step-process)
4. [Component Registry Structure](#component-registry-structure)
5. [Creating Examples](#creating-examples)
6. [Best Practices](#best-practices)
7. [Testing Your Documentation](#testing-your-documentation)
8. [Troubleshooting](#troubleshooting)

## Overview

The DinachiUI documentation system automatically generates component pages based on registry entries. Each component page includes:

- **Header**: Component name, description, category, and dependencies
- **Installation**: CLI and manual installation instructions
- **Examples**: Live previews with code snippets
- **API Reference**: Props documentation with types and descriptions
- **Navigation**: Links to previous/next components

## Prerequisites

Before creating documentation for a new component, ensure you have:

1. The component implemented in the UI library
2. Basic understanding of TypeScript interfaces
3. Component examples ready for demonstration
4. Knowledge of the component's props and their types

## Step-by-Step Process

### Step 1: Add Component to Registry

Open `src/lib/components-registry.ts` and add your component entry:

```typescript
export const componentsRegistry: Record<string, ComponentDoc> = {
  // ... existing components
  
  "your-component": {
    name: "YourComponent",
    description: "A detailed description of what your component does and its main use cases.",
    category: "Form", // Choose from: Form, Layout, Display, Navigation, Overlay, Feedback
    usage: "import { YourComponent } from '@/components/ui/your-component'",
    installation: {
      cli: "npx @dinachi/cli@latest add your-component",
      manual: [
        "Copy the component code from the source",
        "Install required dependencies: dependency1 dependency2",
        "Add the component to your project"
      ]
    },
    props: [
      {
        name: "variant",
        type: "'default' | 'secondary' | 'outline'",
        description: "The visual style variant of the component",
        defaultValue: "'default'",
        required: false
      },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        description: "The size of the component",
        defaultValue: "'md'",
        required: false
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the component is disabled",
        defaultValue: "false",
        required: false
      },
      {
        name: "onClick",
        type: "() => void",
        description: "Callback function when component is clicked",
        required: true
      }
    ],
    examples: examplesRegistry.yourComponent || [],
    dependencies: ["dependency1", "dependency2"],
    source: "https://github.com/dinachi/ui/tree/main/packages/components/src/your-component"
  }
};
```

### Step 2: Create Component Examples

Create `src/components/examples/your-component-examples.tsx`:

```typescript
import { YourComponent } from '@/components/ui/your-component';

// Basic usage example
export function DefaultYourComponentExample() {
  return <YourComponent>Default Example</YourComponent>;
}

// Variants example
export function YourComponentVariantsExample() {
  return (
    <div className="flex gap-4 flex-wrap">
      <YourComponent variant="default">Default</YourComponent>
      <YourComponent variant="secondary">Secondary</YourComponent>
      <YourComponent variant="outline">Outline</YourComponent>
    </div>
  );
}

// Sizes example
export function YourComponentSizesExample() {
  return (
    <div className="flex gap-4 items-center">
      <YourComponent size="sm">Small</YourComponent>
      <YourComponent size="md">Medium</YourComponent>
      <YourComponent size="lg">Large</YourComponent>
    </div>
  );
}

// Interactive example
export function YourComponentInteractiveExample() {
  const [state, setState] = useState(false);
  
  return (
    <div className="space-y-4">
      <YourComponent 
        onClick={() => setState(!state)}
        variant={state ? 'secondary' : 'default'}
      >
        {state ? 'Active' : 'Inactive'}
      </YourComponent>
      <p className="text-sm text-muted-foreground">
        Current state: {state ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
}
```

### Step 3: Register Examples

Update `src/lib/examples-registry.tsx`:

```typescript
// Import your example components
import { 
  DefaultYourComponentExample,
  YourComponentVariantsExample,
  YourComponentSizesExample,
  YourComponentInteractiveExample
} from '@/components/examples/your-component-examples';

// Define example metadata
export const yourComponentExamples: ComponentExample[] = [
  {
    name: "Default Usage",
    description: "Basic usage of the component with default props",
    componentId: "your-component-default",
    code: `import { YourComponent } from '@/components/ui/your-component';

export function Example() {
  return <YourComponent>Default Example</YourComponent>;
}`
  },
  {
    name: "Variants",
    description: "Different visual variants of the component",
    componentId: "your-component-variants",
    code: `import { YourComponent } from '@/components/ui/your-component';

export function Example() {
  return (
    <div className="flex gap-4 flex-wrap">
      <YourComponent variant="default">Default</YourComponent>
      <YourComponent variant="secondary">Secondary</YourComponent>
      <YourComponent variant="outline">Outline</YourComponent>
    </div>
  );
}`
  },
  {
    name: "Sizes",
    description: "Different sizes available for the component",
    componentId: "your-component-sizes",
    code: `import { YourComponent } from '@/components/ui/your-component';

export function Example() {
  return (
    <div className="flex gap-4 items-center">
      <YourComponent size="sm">Small</YourComponent>
      <YourComponent size="md">Medium</YourComponent>
      <YourComponent size="lg">Large</YourComponent>
    </div>
  );
}`
  },
  {
    name: "Interactive Example",
    description: "Component with interactive state management",
    componentId: "your-component-interactive",
    code: `import { YourComponent } from '@/components/ui/your-component';
import { useState } from 'react';

export function Example() {
  const [state, setState] = useState(false);
  
  return (
    <div className="space-y-4">
      <YourComponent 
        onClick={() => setState(!state)}
        variant={state ? 'secondary' : 'default'}
      >
        {state ? 'Active' : 'Inactive'}
      </YourComponent>
      <p className="text-sm text-muted-foreground">
        Current state: {state ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
}`
  }
];

// Map component IDs to actual components
export const exampleComponents = {
  // ... existing components
  'your-component-default': DefaultYourComponentExample,
  'your-component-variants': YourComponentVariantsExample,
  'your-component-sizes': YourComponentSizesExample,
  'your-component-interactive': YourComponentInteractiveExample,
};

// Add to examples registry
export const examplesRegistry = {
  // ... existing examples
  yourComponent: yourComponentExamples,
};
```

## Component Registry Structure

### ComponentDoc Interface

```typescript
interface ComponentDoc {
  name: string;           // Display name (e.g., "Button")
  description: string;    // Detailed description
  category: string;       // Category for grouping
  usage: string;          // Import statement
  installation: {
    cli: string;          // CLI installation command
    manual: string[];     // Manual installation steps
  };
  props: ComponentProp[]; // Props documentation
  examples: ComponentExample[]; // Usage examples
  dependencies: string[]; // Required dependencies
  source: string;         // GitHub source URL
}
```

### ComponentProp Interface

```typescript
interface ComponentProp {
  name: string;          // Prop name
  type: string;          // TypeScript type
  description: string;   // What the prop does
  defaultValue?: string; // Default value
  required?: boolean;    // Whether it's required
}
```

### ComponentExample Interface

```typescript
interface ComponentExample {
  name: string;        // Example name
  description: string; // Example description
  componentId: string; // Unique identifier
  code: string;        // Code snippet
}
```

## Creating Examples

### Example Types

1. **Basic Usage**: Simple, minimal example
2. **Variants**: Show different visual styles
3. **Sizes**: Display size variations
4. **States**: Different component states
5. **Interactive**: Examples with user interaction
6. **Complex**: Real-world usage scenarios

### Example Guidelines

- Keep examples focused and simple
- Use meaningful props and content
- Include interactive examples when relevant
- Show common use cases
- Provide clear, commented code

### Code Snippet Best Practices

- Use proper TypeScript types
- Include necessary imports
- Keep code concise but complete
- Use consistent formatting
- Add comments for complex logic

## Best Practices

### Documentation Writing

1. **Clear Descriptions**: Write concise, informative descriptions
2. **Use Cases**: Explain when to use the component
3. **Accessibility**: Mention accessibility features
4. **Performance**: Note any performance considerations

### Props Documentation

1. **Comprehensive Types**: Include all possible values
2. **Clear Descriptions**: Explain what each prop does
3. **Default Values**: Always specify defaults
4. **Required Props**: Mark required props clearly

### Examples Organization

1. **Progressive Complexity**: Start simple, add complexity
2. **Real-world Usage**: Show practical applications
3. **Edge Cases**: Include important edge cases
4. **Visual Variety**: Use different props combinations

### Categories

Use these standard categories:
- **Form**: Input components (Button, Input, Select, etc.)
- **Layout**: Layout components (Card, Container, Grid, etc.)
- **Display**: Display components (Badge, Avatar, etc.)
- **Navigation**: Navigation components (Tabs, Menu, etc.)
- **Overlay**: Overlay components (Dialog, Tooltip, etc.)
- **Feedback**: Feedback components (Toast, Alert, etc.)

## Testing Your Documentation

### Development Testing

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to your component**:
   ```
   http://localhost:3000/docs/components/your-component
   ```

3. **Check all sections**:
   - Header displays correctly
   - Installation instructions work
   - Examples render properly
   - API table is complete
   - Navigation works

### Quality Checklist

- [ ] Component renders without errors
- [ ] All examples work correctly
- [ ] Props table is complete and accurate
- [ ] Installation instructions are correct
- [ ] Code snippets are properly formatted
- [ ] Navigation between components works
- [ ] Mobile responsiveness is maintained

## Troubleshooting

### Common Issues

1. **Component not found**: Check registry key matches slug
2. **Examples not rendering**: Verify component mapping in examples-registry
3. **Props not displaying**: Ensure props array is properly formatted
4. **Code not copying**: Check code string formatting
5. **Navigation broken**: Verify component exists in registry

### Debug Steps

1. Check browser console for errors
2. Verify import paths are correct
3. Ensure all dependencies are installed
4. Check TypeScript compilation
5. Validate registry structure

### Error Messages

- **"Component not found"**: Registry key doesn't match URL slug
- **"Component not found in examples"**: Missing component mapping
- **Build errors**: TypeScript or import issues

## Advanced Features

### Custom Sections

You can extend the component page by modifying `component-page.tsx` to include custom sections:

```typescript
// Add after ComponentAPI
{component.customSection && (
  <CustomSection content={component.customSection} />
)}
```

### Rich Examples

Create more complex examples with:
- Multiple components interaction
- Form validation
- API integration
- State management

### Documentation Automation

Consider creating scripts to:
- Generate props from component files
- Validate documentation completeness
- Update examples automatically
- Check for broken links

## Conclusion

Following this guide ensures consistent, comprehensive documentation for all components. The automated system will generate beautiful, interactive documentation pages that help developers understand and use your components effectively.

For questions or improvements to this guide, please create an issue in the repository.
