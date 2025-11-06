import DocPageHeader from '@/components/layout/doc-page-header';
import CodeBlock from '@/components/reusables/CodeBlock';
import { Code, Eye, Lightbulb, Palette, Settings, Sparkles, Sun } from 'lucide-react';
import React from 'react';

const ThemeCard = ({ title, description, children, className = "" }: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border-dashed border border-border p-6 shadow-sm ${className}`}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    {children}
  </div>
);

const ColorSwatch = ({ name, variable, preview }: {
  name: string;
  variable: string;
  preview: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-card border border-border border-dashed">
    <div 
      className="w-8 h-8 rounded-lg shrink-0"
      style={{ backgroundColor: preview }}
    />
    <div className="flex-1">
      <p className="font-medium text-sm">{name}</p>
      <code className="text-xs text-muted-foreground">{variable}</code>
    </div>
  </div>
);

export default function ThemingPage() {
  return (
    <DocPageHeader title="Theming & Customization" description="Learn how to customize DinachiUI components with your own design system, colors, and themes.">

      {/* Overview */}
      <section className="mb-12">
        <div className="border-dashed border border-border p-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            Design System Foundation
          </h2>
          <p className="text-muted-foreground mb-4">
            DinachiUI uses CSS custom properties (variables) for theming, making it easy to customize colors, 
            typography, and spacing across all components. Since components are copied to your project, 
            you have complete control over styling.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium text-sm">CSS Variables</p>
                <p className="text-xs text-muted-foreground">HSL-based color system with CSS custom properties</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium text-sm">Dark Mode Ready</p>
                <p className="text-xs text-muted-foreground">Built-in support for light and dark themes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium text-sm">Tailwind Integration</p>
                <p className="text-xs text-muted-foreground">Seamless integration with Tailwind CSS</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
              <div>
                <p className="font-medium text-sm">Component Variants</p>
                <p className="text-xs text-muted-foreground">Easy to modify with class-variance-authority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color System */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          Color System
        </h2>
        
        <div className="grid gap-6 mb-6">
          <ThemeCard
            title="CSS Variables"
            description="All colors are defined as CSS custom properties in your globals.css"
          >
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
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
}`}
            </CodeBlock>
          </ThemeCard>

          <ThemeCard
            title="Dark Mode"
            description="Dark mode colors are automatically applied with the dark: selector"
          >
            <CodeBlock language="css" copyKey="dark-mode">
{`.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
}`}
            </CodeBlock>
          </ThemeCard>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ColorSwatch name="Background" variable="--background" preview="hsl(0, 0%, 100%)" />
          <ColorSwatch name="Foreground" variable="--foreground" preview="hsl(162.2, 84%, 49.9%)" />
          <ColorSwatch name="Primary" variable="--primary" preview="hsl(222.2, 47.4%, 76.2%)" />
          <ColorSwatch name="Secondary" variable="--secondary" preview="hsl(210, 40%, 96%)" />
          <ColorSwatch name="Accent" variable="--accent" preview="hsl(210, 40%, 96%)" />
          <ColorSwatch name="Destructive" variable="--destructive" preview="hsl(0, 84.2%, 60.2%)" />
        </div>
      </section>

      {/* Customization */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          Customization
        </h2>

        <div className="grid gap-6">
          <ThemeCard
            title="1. CSS Variables"
            description="The easiest way to customize colors across all components"
          >
            <CodeBlock language="css" copyKey="custom-colors">
{`:root {
  /* Custom brand colors */
  --primary: 263 70% 50%;        /* Purple primary */
  --primary-foreground: 0 0% 100%;
  --secondary: 270 20% 95%;
  --secondary-foreground: 263 70% 50%;
  
  /* Custom accent colors */
  --accent: 142 71% 45%;         /* Green accent */
  --accent-foreground: 0 0% 100%;
  
  /* Custom destructive colors */
  --destructive: 0 84% 60%;      /* Red destructive */
  --destructive-foreground: 0 0% 100%;
}`}
            </CodeBlock>
          </ThemeCard>

          <ThemeCard
            title="2. Component Variants"
            description="Modify component variants directly in your copied components"
          >
            <CodeBlock language="typescript" copyKey="button-variants">
{`// In your src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Add your custom variants
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        // Add your custom sizes
        xl: "h-12 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
  }
)`}
            </CodeBlock>
          </ThemeCard>

          <ThemeCard
            title="3. Tailwind Configuration"
            description="Extend your Tailwind config to use the CSS variables"
          >
            <CodeBlock language="javascript" copyKey="tailwind-config">
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Add custom color scales
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
      },
    },
  },
}`}
            </CodeBlock>
          </ThemeCard>
        </div>
      </section>

      {/* Theme Switching */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          Theme Switching
        </h2>

        <div className="grid gap-6">
          <ThemeCard
            title="Dark Mode Toggle"
            description="Implement theme switching with next-themes or your preferred solution"
          >
            <CodeBlock language="typescript" copyKey="theme-toggle">
{`import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg bg-accent hover:bg-accent/80"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
}`}
            </CodeBlock>
          </ThemeCard>

          <ThemeCard
            title="Multiple Themes"
            description="Create multiple theme variants using data attributes"
          >
            <CodeBlock language="css" copyKey="multiple-themes">
{`[data-theme="blue"] {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}

[data-theme="green"] {
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
}

[data-theme="purple"] {
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
}`}
            </CodeBlock>
          </ThemeCard>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          Typography & Spacing
        </h2>

        <div className="grid gap-6">
          <ThemeCard
            title="Font Family"
            description="Customize typography by updating your CSS variables and Tailwind config"
          >
            <CodeBlock language="css" copyKey="typography">
{`:root {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Fira Code", ui-monospace, monospace;
}

/* Or use Tailwind's font configuration */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: var(--font-sans);
  }
}`}
            </CodeBlock>
          </ThemeCard>

          <ThemeCard
            title="Spacing System"
            description="DinachiUI uses Tailwind's default spacing scale, but you can customize it"
          >
            <CodeBlock language="javascript" copyKey="spacing-config">
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
}`}
            </CodeBlock>
          </ThemeCard>
        </div>
      </section>

      {/* Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Real-world Examples</h2>

        <div className="grid gap-6">
          <ThemeCard
            title="Brand Colors"
            description="Example of implementing a complete brand color system"
          >
            <CodeBlock language="css" copyKey="brand-example">
{`:root {
  /* Brand: Spotify-inspired */
  --background: 0 0% 100%;
  --foreground: 0 0% 7%;
  --primary: 141 73% 42%;        /* Spotify Green */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 7%;
  --accent: 141 73% 42%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 141 73% 42%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
}

.dark {
  --background: 0 0% 7%;         /* Dark background */
  --foreground: 0 0% 100%;
  --primary: 141 73% 42%;        /* Keep brand green */
  --primary-foreground: 0 0% 7%;
  --secondary: 0 0% 15%;
  --secondary-foreground: 0 0% 100%;
  --accent: 0 0% 15%;
  --accent-foreground: 0 0% 100%;
  --border: 0 0% 15%;
  --input: 0 0% 15%;
  --ring: 141 73% 42%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 65%;
}`}
            </CodeBlock>
          </ThemeCard>

          <ThemeCard
            title="Component Customization"
            description="Example of customizing a specific component"
          >
            <CodeBlock language="typescript" copyKey="component-example">
{`// Custom Card component with brand styling
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BrandCardProps {
  variant?: 'default' | 'premium' | 'featured';
  className?: string;
  children: React.ReactNode;
}

export function BrandCard({ variant = 'default', className, children }: BrandCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        {
          'border-primary shadow-lg': variant === 'premium',
          'bg-linear-to-br from-primary/10 to-secondary/10 border-primary': variant === 'featured',
        },
        className
      )}
    >
      {children}
    </Card>
  );
}`}
            </CodeBlock>
          </ThemeCard>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-12">
        <div className="border-dashed border border-border p-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            Tips & Best Practices
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              Use HSL color format for better color manipulation and consistency
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              Test your theme in both light and dark modes before deployment
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              Keep accessibility in mind - maintain proper contrast ratios
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              Use semantic color names (primary, secondary) rather than specific colors (blue, red)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
              Since components are copied to your project, you can modify them directly without breaking updates
            </li>
          </ul>
        </div>
      </section>
    </DocPageHeader>
  );
}
