import React from 'react';
import { Package, Zap, Shield, Code, CheckCircle, Settings } from 'lucide-react';
import CodeBlock from '@/components/reusables/CodeBlock';

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

export default function ViteInstallationPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Package className="w-4 h-4" />
          Vite Installation
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          DinachiUI + Vite
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete setup guide for integrating DinachiUI with Vite projects for fast development and optimized builds.
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
                <p className="font-medium text-sm">Vite 4.0+</p>
                <p className="text-xs text-muted-foreground">Latest version recommended</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">React 18+</p>
                <p className="text-xs text-muted-foreground">With React DOM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">TypeScript</p>
                <p className="text-xs text-muted-foreground">Optional but recommended</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Tailwind CSS</p>
                <p className="text-xs text-muted-foreground">Required for styling</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="space-y-8">
        <StepCard
          number="01"
          title="Create Vite Project"
          description="Start with a new Vite project or use an existing one"
          icon={Package}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Create new React + TypeScript project:
              </p>
              <CodeBlock language="bash" copyKey="create-vite">
                npm create vite@latest my-app -- --template react-ts
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Or create JavaScript project:
              </p>
              <CodeBlock language="bash" copyKey="create-vite-js">
                npm create vite@latest my-app -- --template react
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Navigate to project and install dependencies:
              </p>
              <CodeBlock language="bash" copyKey="install-deps">
                cd my-app && npm install
              </CodeBlock>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="02"
          title="Install Tailwind CSS"
          description="Set up Tailwind CSS if not already configured"
          icon={Settings}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Install Tailwind CSS:
              </p>
              <CodeBlock language="bash" copyKey="install-tailwind">
                npm install -D tailwindcss postcss autoprefixer
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Initialize Tailwind:
              </p>
              <CodeBlock language="bash" copyKey="init-tailwind">
                npx tailwindcss init -p
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Update tailwind.config.js:
              </p>
              <CodeBlock language="javascript" copyKey="tailwind-config">
{`/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`}
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Add Tailwind directives to src/index.css:
              </p>
              <CodeBlock language="css" copyKey="tailwind-css">
{`@tailwind base;
@tailwind components;
@tailwind utilities;`}
              </CodeBlock>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="03"
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
                <strong>What this does:</strong> Creates a components.json config file with Vite-specific settings:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Sets up path aliases for components and utils</li>
                <li>• Configures Tailwind config path as tailwind.config.js</li>
                <li>• Points CSS to src/index.css</li>
                <li>• Installs required dependencies (clsx, tailwind-merge, etc.)</li>
              </ul>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="04"
          title="Configure Path Aliases"
          description="Set up TypeScript path aliases for better imports"
          icon={Code}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Update vite.config.ts:
              </p>
              <CodeBlock language="typescript" copyKey="vite-config">
{`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`}
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Update tsconfig.json (if using TypeScript):
              </p>
              <CodeBlock language="json" copyKey="tsconfig">
{`{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`}
              </CodeBlock>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="05"
          title="Add Components"
          description="Install the components you need for your project"
          icon={Package}
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
          number="06"
          title="Start Using Components"
          description="Import and use DinachiUI components in your Vite app"
          icon={CheckCircle}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Update src/App.tsx:
              </p>
              <CodeBlock language="typescript" copyKey="app-example">
{`import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>DinachiUI + Vite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Enter something..." />
          <Button onClick={() => setCount(count + 1)}>
            Count: {count}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App`}
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Start the development server:
              </p>
              <CodeBlock language="bash" copyKey="start-dev">
                npm run dev
              </CodeBlock>
            </div>
          </div>
        </StepCard>
      </div>

      {/* Vite Specific Notes */}
      <section className="mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6">Vite Specific Considerations</h2>
        
        <div className="grid gap-6">
          <div className="bg-accent/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-500" />
              Hot Module Replacement (HMR)
            </h3>
            <p className="text-muted-foreground mb-4">
              DinachiUI components work seamlessly with Vite&apos;s HMR. Changes to component files will reflect instantly without losing state.
            </p>
            <div className="bg-background border border-border rounded-lg p-4">
              <p className="text-sm font-medium mb-2">HMR Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Instant updates when modifying component styles</li>
                <li>• State preservation during development</li>
                <li>• Fast feedback loop for UI changes</li>
              </ul>
            </div>
          </div>

          <div className="bg-accent/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-500" />
              Build Optimization
            </h3>
            <p className="text-muted-foreground mb-4">
              Vite&apos;s build system automatically optimizes DinachiUI components for production:
            </p>
            <CodeBlock language="bash" copyKey="build-command">
              npm run build
            </CodeBlock>
            <div className="bg-background border border-border rounded-lg p-4 mt-4">
              <p className="text-sm font-medium mb-2">Build optimizations:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tree-shaking removes unused component code</li>
                <li>• CSS is automatically purged and minified</li>
                <li>• Components are bundled efficiently</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Environment Variables */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Environment Configuration</h2>
        <div className="bg-accent/30 border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Environment Variables</h3>
          <p className="text-muted-foreground mb-4">
            You can customize DinachiUI behavior using environment variables:
          </p>
          <CodeBlock language="bash" copyKey="env-vars">
{`# .env
VITE_THEME_MODE=light
VITE_PRIMARY_COLOR=blue`}
          </CodeBlock>
          <p className="text-sm text-muted-foreground mt-2">
            Access these in your components using <code>import.meta.env.VITE_*</code>
          </p>
        </div>
      </section>

      {/* Deployment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Deployment</h2>
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Production Ready</h3>
          <p className="text-muted-foreground mb-4">
            DinachiUI components are optimized for Vite and work seamlessly with:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Netlify</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Vercel</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">GitHub Pages</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Surge.sh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Common Issues</h2>
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Path Alias Not Working</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Make sure you&apos;ve configured the path alias in both vite.config.ts and tsconfig.json:
            </p>
            <CodeBlock language="typescript" copyKey="path-fix">
{`// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
}`}
            </CodeBlock>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Tailwind Styles Not Loading</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Ensure Tailwind CSS is properly configured and imported:
            </p>
            <CodeBlock language="css" copyKey="tailwind-import">
{`/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import this in your main.tsx */
import './index.css'`}
            </CodeBlock>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Build Errors</h3>
            <p className="text-sm text-muted-foreground mb-2">
              If you encounter build errors, check your TypeScript configuration:
            </p>
            <CodeBlock language="bash" copyKey="build-fix">
{`# Clear cache and rebuild
rm -rf node_modules
npm install
npm run build`}
            </CodeBlock>
          </div>
        </div>
      </section>
    </div>
  );
}
