import CodeBlock from "@/components/reusables/CodeBlock";
import { CheckCircle, Code, Package, Shield, Zap } from "lucide-react";
import React from "react";

const StepCard = ({
  number,
  title,
  description,
  children,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
  icon: React.ElementType;
}) => (
  <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-accent-foreground bg-accent px-2 py-1 rounded-full">
            {number}
          </span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        {children}
      </div>
    </div>
  </div>
);

export default function NextjsInstallationPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Package className="w-4 h-4" />
          Next.js Installation
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          DinachiUI + Next.js
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete setup guide for integrating DinachiUI with Next.js projects
          including App Router and Server Components.
        </p>
      </div>

      {/* Prerequisites */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-500" />
          Prerequisites
        </h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Next.js 13.4+</p>
                <p className="text-xs text-muted-foreground">
                  App Router support
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">React 18+</p>
                <p className="text-xs text-muted-foreground">
                  Server Components ready
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">TypeScript</p>
                <p className="text-xs text-muted-foreground">
                  Recommended for best experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Tailwind CSS</p>
                <p className="text-xs text-muted-foreground">
                  Required for styling
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="space-y-8">
        <StepCard
          number="01"
          title="Create Next.js Project"
          description="Start with a new Next.js project or use an existing one"
          icon={Package}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Create new project:
              </p>
              <CodeBlock language="bash" copyKey="create-nextjs">
                npx create-next-app@latest my-app --typescript --tailwind
                --eslint --app
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Or use existing project:
              </p>
              <CodeBlock language="bash" copyKey="cd-existing">
                cd my-existing-nextjs-app
              </CodeBlock>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="02"
          title="Initialize DinachiUI"
          description="Set up DinachiUI configuration and install dependencies"
          icon={Zap}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Initialize DinachiUI:
              </p>
              <CodeBlock language="bash" copyKey="init-dinachi">
                npx @dinachi/cli@latest init
              </CodeBlock>
            </div>
            <div className="bg-accent border border-border rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>What this does:</strong> Creates a components.json
                config file with Next.js-specific settings:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Sets RSC (React Server Components) to true</li>
                <li>• Configures TypeScript support</li>
                <li>• Sets up Tailwind config path as tailwind.config.ts</li>
                <li>• Points CSS to src/app/globals.css</li>
                <li>• Installs required dependencies</li>
              </ul>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="03"
          title="Add Components"
          description="Install the components you need for your project"
          icon={Code}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Add individual components:
              </p>
              <CodeBlock language="bash" copyKey="add-components">
                npx @dinachi/cli@latest add button input card
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Or add all components:
              </p>
              <CodeBlock language="bash" copyKey="add-all-components">
                npx @dinachi/cli@latest add --all
              </CodeBlock>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="04"
          title="Start Using Components"
          description="Import and use DinachiUI components in your Next.js app"
          icon={CheckCircle}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Server Component example:
              </p>
              <CodeBlock language="typescript" copyKey="server-component">
                {`// app/page.tsx (Server Component)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to DinachiUI</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a server component with DinachiUI components.</p>
        <Button>Static Button</Button>
      </CardContent>
    </Card>
  );
}`}
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Client Component example:
              </p>
              <CodeBlock language="typescript" copyKey="client-component">
                {`// components/interactive-demo.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';

export function InteractiveDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-4">
      <Input placeholder="Enter something..." />
      <Button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </Button>
    </div>
  );
}`}
              </CodeBlock>
            </div>
          </div>
        </StepCard>
      </div>

      {/* Next.js Specific Notes */}
      <section className="mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6">
          Next.js Specific Considerations
        </h2>

        <div className="grid gap-6">
          <div className="bg-accent/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-500" />
              Server vs Client Components
            </h3>
            <p className="text-muted-foreground mb-4">
              Most DinachiUI components work in both server and client
              components. However, interactive components require the &apos;use
              client&apos; directive.
            </p>
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-sm font-medium mb-2">
                Components that need &apos;use client&apos;
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Components with event handlers (onClick, onChange, etc.)
                </li>
                <li>
                  • Components using React hooks (useState, useEffect, etc.)
                </li>
                <li>• Toast, Dialog, and other interactive overlays</li>
                <li>• Form components with validation</li>
              </ul>
            </div>
          </div>

          <div className="bg-accent/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Tailwind Configuration (for version below 4.0)
            </h3>
            <p className="text-muted-foreground mb-4">
              Your tailwind.config.ts should include the DinachiUI color
              variables:
            </p>
            <CodeBlock language="typescript" copyKey="tailwind-config">
              {`// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // ... other colors
      },
    },
  },
  plugins: [],
};

export default config;`}
            </CodeBlock>
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Deployment</h2>
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Ready for Production</h3>
          <p className="text-muted-foreground mb-4">
            DinachiUI components are optimized for Next.js and work seamlessly
            with:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Vercel deployment</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Static site generation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Server-side rendering</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Edge runtime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Common Issues</h2>
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Hydration Errors</h3>
            <p className="text-sm text-muted-foreground mb-2">
              If you see hydration errors, ensure you&apos;re using &apos;use
              client&apos; for interactive components.
            </p>
            <CodeBlock language="typescript" copyKey="hydration-fix">
              {`// Add this to the top of interactive components
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';`}
            </CodeBlock>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              CSS Variables Not Working
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Make sure CSS variables are imported in your globals.css:
            </p>
            <CodeBlock language="css" copyKey="css-variables">
              {`/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other variables */
  }
}`}
            </CodeBlock>
          </div>
        </div>
      </section>
    </div>
  );
}
