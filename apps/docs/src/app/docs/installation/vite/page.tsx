import React from "react";
import {
  Package,
  Zap,
  Shield,
  Code,
  CheckCircle,
  Settings,
  AlertCircle,
} from "lucide-react";
import CodeBlock from "@/components/reusables/CodeBlock";
import DocPageHeader from "@/components/layout/doc-page-header";

type StepCardProps = {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const StepCard = ({ number, title, description, children }: StepCardProps) => (
  <div className="border-dashed border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
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
    <DocPageHeader
      title="Vite Installation"
      description="Complete setup guide for integrating DinachiUI with Vite projects for fast development and optimized builds."
    >
     
      {/* Installation Steps */}
      <div className="space-y-8">
        <StepCard
          number="01"
          title="Create Vite Project"
          description="Start with a new Vite project or use an existing one"
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
            <div className="bg-accent border border-border rounded-lg p-4 mt-4">
              <p className="text-sm text-foreground">
                <strong>Note:</strong> You can also run <code className="bg-muted px-1 py-0.5 rounded">npm create vite@latest</code> without arguments for an interactive prompt to choose your framework and variant.
              </p>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="02"
          title="Install Tailwind CSS"
          description="Set up Tailwind CSS if not already configured"
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
                config file with Vite-specific settings:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Sets up path aliases for components and utils</li>
                <li>• Configures Tailwind config path as tailwind.config.js</li>
                <li>• Points CSS to src/index.css</li>
                <li>
                  • Installs required dependencies (clsx, tailwind-merge, etc.)
                </li>
              </ul>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="04"
          title="Configure Path Aliases"
          description="Set up TypeScript path aliases for better imports"
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
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Update src/App.tsx:
              </p>
              <CodeBlock language="typescript" copyKey="app-example">
                {`import { useState } from 'react'
import { Button } from '@/components/ui/button'
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

      
    </DocPageHeader>
  );
}