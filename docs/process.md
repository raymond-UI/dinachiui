# Component Development Process

## Overview

This document outlines the detailed step-by-step process for creating new components in the DinachiUI design system. Following this process ensures consistency, quality, and maintainability across all components.

## Prerequisites

Before starting component development, ensure you have:
- Node.js 18+ installed
- pnpm package manager
- VS Code with TypeScript and React extensions
- Basic understanding of Base UI components
- Familiarity with Tailwind CSS and class-variance-authority

## Development Workflow

### Phase 1: Planning & Research

#### 1.1 Component Analysis
- **Research Base UI**: Check if Base UI has a foundation component
- **API Design**: Define the component's props interface and variants
- **Accessibility Review**: Identify ARIA requirements and keyboard interactions
- **Visual Design**: Define variants, sizes, and states
- **Dependencies**: List required Base UI components and utilities

#### 1.2 Documentation Setup
Create a planning document with:
```markdown
## [ComponentName] Planning

### Base UI Foundation
- Base component: `@base-ui/react/[component]`
- Documentation: [link to Base UI docs]

### API Design
```typescript
interface ComponentProps {
  // Define props here
}
```

### Variants
- variant: default | secondary | destructive
- size: sm | default | lg

### Accessibility Requirements
- ARIA attributes needed
- Keyboard interactions
- Screen reader considerations
```

### Phase 2: Implementation

#### 2.1 Create Component Directory
```bash
# Navigate to components package
cd packages/components/src

# Create component directory
mkdir [component-name]
cd [component-name]

# Create required files
touch [component-name].tsx
touch [component-name].test.tsx
touch index.ts
touch README.md
```

#### 2.2 Implement Base Component

**File: `[component-name].tsx`**

```typescript
"use client"

import * as React from "react"
import { [BaseComponent] } from "@base-ui/react/[component]"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@dinachi/core"

// Define variants using class-variance-authority
const [componentName]Variants = cva(
  // Base classes
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-variant-classes",
        secondary: "secondary-variant-classes",
        // Add more variants
      },
      size: {
        sm: "small-size-classes",
        default: "default-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Define component props interface
export interface [ComponentName]Props
  extends React.ComponentPropsWithoutRef<typeof [BaseComponent]>,
    VariantProps<typeof [componentName]Variants> {
  // Add custom props here
}

// Main component implementation
const [ComponentName] = React.forwardRef<
  React.ComponentRef<typeof [BaseComponent]>,
  [ComponentName]Props
>(({ className, variant, size, ...props }, ref) => (
  <[BaseComponent]
    ref={ref}
    className={cn([componentName]Variants({ variant, size }), className)}
    {...props}
  />
))

[ComponentName].displayName = "[ComponentName]"

export { [ComponentName], [componentName]Variants }
```

#### 2.3 Create Component Exports

**File: `index.ts`**

```typescript
export * from "./[component-name]"
```

#### 2.4 Update Main Package Export

**File: `packages/components/src/index.ts`**

```typescript
// Add to existing exports
export * from "./[component-name]"
```

### Phase 3: Testing

#### 3.1 Implement Component Tests

**File: `[component-name].test.tsx`**

```typescript
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { [ComponentName] } from "./[component-name]"

describe("[ComponentName]", () => {
  it("renders correctly", () => {
    render(<[ComponentName]>Test content</[ComponentName]>)
    expect(screen.getByRole("[appropriate-role]")).toBeInTheDocument()
  })

  it("applies variant classes correctly", () => {
    render(<[ComponentName] variant="secondary">Test</[ComponentName]>)
    expect(screen.getByRole("[appropriate-role]")).toHaveClass("secondary-variant-class")
  })

  it("applies size classes correctly", () => {
    render(<[ComponentName] size="lg">Test</[ComponentName]>)
    expect(screen.getByRole("[appropriate-role]")).toHaveClass("large-size-class")
  })

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLElement>()
    render(<[ComponentName] ref={ref}>Test</[ComponentName]>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it("handles custom className", () => {
    render(<[ComponentName] className="custom-class">Test</[ComponentName]>)
    expect(screen.getByRole("[appropriate-role]")).toHaveClass("custom-class")
  })

  // Add component-specific tests
  it("handles click events", async () => {
    const handleClick = vi.fn()
    render(<[ComponentName] onClick={handleClick}>Test</[ComponentName]>)
    
    await userEvent.click(screen.getByRole("[appropriate-role]"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### 3.2 Run Tests

```bash
# Run tests for specific component
pnpm test [component-name]

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Phase 4: Documentation

#### 4.1 Create Component README

**File: `README.md`**

```markdown
# [ComponentName]

[Brief description of the component and its purpose]

## Installation

```bash
npx @dinachi/cli add [component-name]
```

## Usage

```typescript
import { [ComponentName] } from "@/components/[component-name]"

export function Example() {
  return (
    <[ComponentName] variant="default" size="default">
      Content here
    </[ComponentName]>
  )
}
```

## API Reference

### [ComponentName]

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default" \| "secondary"` | `"default"` | The visual variant |
| size | `"sm" \| "default" \| "lg"` | `"default"` | The size variant |

## Examples

### Basic Usage
[Code example]

### Variants
[Code examples for each variant]

### Sizes
[Code examples for each size]

## Accessibility

- [Accessibility feature 1]
- [Accessibility feature 2]
- [Keyboard interactions]

## Base UI Foundation

This component is built on top of `@base-ui/react/[component]`. For more advanced usage and customization options, refer to the [Base UI documentation](https://base-ui.mui.com/).
```

### Phase 5: CLI Integration

#### 5.1 Create CLI Template

**Directory: `packages/cli/templates/[component-name]/`**

Create the template files:
- `[component-name].tsx` - Same as component implementation but with relative imports
- `index.ts` - Component exports

#### 5.2 Update CLI Registry

**File: `packages/cli/src/utils/registry.ts`**

```typescript
// Add to components object
"[component-name]": {
  name: "[component-name]",
  description: "[Brief description of the component]",
  files: [
    { name: "[component-name].tsx" },
    { name: "index.ts" }
  ],
  dependencies: [
    "@base-ui/react"  // ⚠️ IMPORTANT: Use main package, not sub-paths
  ],
  componentDependencies: ["other-component"], // If depends on other components
  utilityDependencies: ["cn"] // Add if component uses utilities
},
```

**⚠️ Critical Notes:**
- **Base UI Dependencies**: Always use `@base-ui/react` as the main package
- **Avoid Sub-paths**: Never use `@base-ui/react/[component]` in dependencies
- **Component Dependencies**: Use `componentDependencies` for inter-component relationships
- **Utility Dependencies**: Include utilities like `cn` that the component needs

#### 5.2.1 Rebuild CLI After Registry Changes

```bash
# Navigate to CLI package and rebuild
cd packages/cli
pnpm build
```

#### 5.3 Test CLI Installation

```bash
# 1. First, rebuild the CLI to include registry changes
cd packages/cli
pnpm build

# 2. Test CLI installation in temp directory
cd ../../temp-test
node ../packages/cli/dist/index.js add [component-name] --overwrite

# 3. Verify installation success
# - Check that files were created correctly
# - Verify no npm dependency errors
# - Confirm component dependencies were installed

# 4. Test component usage
# Create test HTML file or add to existing test file
```

**✅ Successful Installation Should Show:**
```
✔ ✅ Added [component-name] component(s)!

Files added:
  + src/components/[component-name].tsx
  + src/components/index.ts

Dependencies installed:
  ✓ @base-ui/react
  ✓ [other-dependencies]
```

**❌ Common Issues to Watch For:**
- `npm error enoent`: Usually indicates incorrect dependency path
- Missing component files: Check CLI template structure
- Import errors: Verify relative paths in templates

### Phase 6: Demo Implementation

#### 6.1 Create Demo Component

**File: `src/[ComponentName]Demo.tsx`**

```typescript
import { [ComponentName] } from "@dinachi/components"

export function [ComponentName]Demo() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">[ComponentName] Demo</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="flex gap-2">
          <[ComponentName] variant="default">Default</[ComponentName]>
          <[ComponentName] variant="secondary">Secondary</[ComponentName]>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex gap-2 items-center">
          <[ComponentName] size="sm">Small</[ComponentName]>
          <[ComponentName] size="default">Default</[ComponentName]>
          <[ComponentName] size="lg">Large</[ComponentName]>
        </div>
      </div>
    </div>
  )
}
```

#### 6.2 Update Main App

**File: `src/App.tsx`**

```typescript
// Add import
import { [ComponentName]Demo } from "./[ComponentName]Demo"

// Add to component list in render
<[ComponentName]Demo />
```

### Phase 7: Quality Assurance

#### 7.1 Checklist Before Completion

- [ ] **Implementation**
  - [ ] Component follows Base UI foundation pattern
  - [ ] Proper TypeScript interfaces and exports
  - [ ] Variant system implemented with cva
  - [ ] Ref forwarding working correctly
  - [ ] Custom className support

- [ ] **Testing**
  - [ ] All tests passing (minimum 5 test cases)
  - [ ] Event handling tested
  - [ ] Variant and size application tested
  - [ ] Accessibility testing completed

- [ ] **Documentation**
  - [ ] README.md complete with examples
  - [ ] API documentation accurate
  - [ ] Accessibility notes included

- [ ] **CLI Integration**
  - [ ] Template created and tested
  - [ ] Registry updated
  - [ ] Installation tested successfully

- [ ] **Demo**
  - [ ] Demo component created
  - [ ] All variants and sizes showcased
  - [ ] Added to main app

#### 7.2 Final Validation

```bash
# 1. Build all packages
pnpm build

# 2. Run all tests
pnpm test

# 3. Test CLI installation (critical step)
cd packages/cli && pnpm build  # Rebuild CLI first
cd ../../temp-test
node ../packages/cli/dist/index.js add [component-name] --overwrite

# 4. Verify CLI installation success
# - No npm errors
# - Files created correctly
# - Dependencies installed properly

# 5. Verify demo works
cd ..
pnpm dev
```

**Final Checklist:**
- [ ] All tests passing
- [ ] CLI installation working without errors
- [ ] Component demo functional in main app
- [ ] Documentation complete and accurate
- [ ] No TypeScript or build errors

## Best Practices

### Code Quality
- Follow existing code patterns and naming conventions
- Use TypeScript strictly with proper types
- Implement proper error boundaries where needed
- Follow React best practices (hooks, refs, etc.)

### Accessibility
- Always include proper ARIA attributes
- Test with screen readers
- Ensure keyboard navigation works
- Follow WCAG 2.1 AA guidelines

### Performance
- Use React.forwardRef for all components
- Minimize re-renders with proper prop design
- Lazy load heavy dependencies when possible

### Consistency
- Follow established variant patterns
- Use consistent prop naming across components
- Maintain consistent file structure
- Follow established testing patterns

## Troubleshooting

### Common Issues

1. **Build Errors**: Check TypeScript configuration and imports
2. **Test Failures**: Verify component roles and accessibility attributes
3. **CLI Installation Issues**: Check registry configuration and file paths
4. **Styling Issues**: Verify Tailwind classes and variant configuration

### CLI-Specific Troubleshooting

#### Issue: `npm error enoent` during CLI installation
**Symptoms**: 
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/path/to/@base-ui/react/[component]/package.json'
```

**Cause**: Using sub-path imports in CLI registry dependencies  
**Solution**: 
- Use `@base-ui/react` instead of `@base-ui/react/[component]`
- Rebuild CLI: `cd packages/cli && pnpm build`

#### Issue: Component not found after CLI installation
**Symptoms**: Import errors or missing component files

**Debugging Steps**:
1. Check if CLI was rebuilt after registry changes
2. Verify template files exist in `packages/cli/templates/[component-name]/`
3. Check registry entry syntax and required fields
4. Test with `--overwrite` flag to replace existing files

#### Issue: Component dependencies not working
**Symptoms**: Missing imports or undefined component references

**Solution**:
- Use `componentDependencies` in registry for inter-component relationships
- Ensure dependent components are installed first
- Verify import paths in template files

#### Issue: CLI registry changes not taking effect
**Symptoms**: Old behavior persists after registry updates

**Solution**:
```bash
cd packages/cli
pnpm build  # Always rebuild after registry changes
cd ../../temp-test
node ../packages/cli/dist/index.js add [component] --overwrite
```

### Getting Help

- Check existing component implementations for patterns
- Review Base UI documentation for foundation components
- Ask for code review before finalizing implementation
- Test thoroughly across different browsers and devices

## Component Lifecycle

1. **Planning** (1-2 hours): Research and design
2. **Implementation** (2-4 hours): Code the component
3. **Testing** (1-2 hours): Write and run tests
4. **Documentation** (1 hour): Create README and examples
5. **CLI Integration** (30 minutes): Templates and registry
6. **Demo** (30 minutes): Showcase component
7. **QA** (30 minutes): Final validation

**Total Time**: 5-8 hours per component (varies by complexity)

This process ensures every component meets our quality standards and provides a consistent developer experience. 