import React from "react";
import CodeBlock from "@/components/reusables/CodeBlock";
import {
  Package,
  Terminal,
  Settings,
  Zap,
  CheckCircle,
  Info,
  Code,
  FileText,
} from "lucide-react";
import DocPageHeader from "@/components/layout/doc-page-header";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const CommandCard = ({
  command,
  description,
  example,
}: {
  command: string;
  description: string;
  example: string;
}) => (
  <div className="bg-background border-[0.5px] border-border rounded-lg p-4 mb-4">
    <div className="flex items-center gap-2 mb-2">
      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
        {command}
      </code>
    </div>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>
    <CodeBlock language="bash" copyKey={command}>
      {example}
    </CodeBlock>
  </div>
);

export default function CLIPage() {
  return (
    <DocPageHeader
      title="Command Line Interface"
      description="A powerful CLI tool that copies component source code directly into your project, giving you full control and customization."
    >
      {/* Overview */}
      <section className="mb-12">
        <div className="bg-linear-to-r from-accent/10 to-accent/30 border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            How it works
          </h2>
          <p className="text-muted-foreground mb-4">
            Unlike traditional component libraries, DinachiUI CLI copies the
            actual source code into your project. This gives you full ownership
            and control over your components.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Full ownership</p>
                <p className="text-xs text-muted-foreground">
                  Code is copied to your project
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Zero runtime dependencies</p>
                <p className="text-xs text-muted-foreground">
                  Only peer dependencies for utilities
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Complete customization</p>
                <p className="text-xs text-muted-foreground">
                  Modify variants, styles, and behavior
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">TypeScript support</p>
                <p className="text-xs text-muted-foreground">
                  Full type safety out of the box
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary-500" />
          Installation
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={Terminal}
            title="Global Installation"
            description="Install once, use everywhere"
          >
            <CodeBlock language="bash" copyKey="global-install">
              npm install -g @dinachi/cli
            </CodeBlock>
            <p className="text-sm text-muted-foreground mt-2">
              Then use:{" "}
              <code className="bg-accent px-1 py-0.5 rounded text-xs">
                dinachi add button
              </code>
            </p>
          </FeatureCard>

          <FeatureCard
            icon={Zap}
            title="NPX Usage"
            description="No installation required"
          >
            <CodeBlock language="bash" copyKey="npx-usage">
              npx @dinachi/cli@latest init
            </CodeBlock>
            <p className="text-sm text-muted-foreground mt-2">
              Always uses the latest version
            </p>
          </FeatureCard>
        </div>
      </section>

      {/* Commands */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-primary-500" />
          Commands
        </h2>

        <CommandCard
          command="init"
          description="Initialize DinachiUI in your project. Creates configuration file and installs dependencies."
          example="npx @dinachi/cli@latest init"
        />

        <CommandCard
          command="add [component]"
          description="Add a specific component to your project. Copies source code and installs dependencies."
          example="npx @dinachi/cli@latest add button"
        />

        <CommandCard
          command="add --all"
          description="Install all available components at once."
          example="npx @dinachi/cli@latest add --all"
        />

        <CommandCard
          command="add --overwrite"
          description="Overwrite existing component files."
          example="npx @dinachi/cli@latest add button --overwrite"
        />
      </section>

      {/* Configuration */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary-500" />
          Configuration
        </h2>
        <p className="text-muted-foreground mb-4">
          After running{" "}
          <code className="bg-accent px-1 py-0.5 rounded text-xs">init</code>,
          you&apos;ll have a{" "}
          <code className="bg-accent px-1 py-0.5 rounded text-xs">
            components.json
          </code>{" "}
          file:
        </p>
        <CodeBlock language="json" copyKey="config-file">
          {`{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}`}
        </CodeBlock>
      </section>

      {/* Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Setup new project</h3>
            <CodeBlock language="bash" copyKey="setup-example">
              {`# Initialize DinachiUI
npx @dinachi/cli@latest init

# Add components you need
npx @dinachi/cli@latest add button input card

# Start using them
import { Button } from '@/components/ui/button'`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Add all components</h3>
            <CodeBlock language="bash" copyKey="add-all-example">
              {`# Install all components at once
npx @dinachi/cli@latest add --all

# Or install globally for shorter commands
npm install -g @dinachi/cli
dinachi add --all`}
            </CodeBlock>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Update existing component
            </h3>
            <CodeBlock language="bash" copyKey="update-example">
              {`# Overwrite existing component with latest version
npx @dinachi/cli@latest add button --overwrite

# This will replace your existing button component
# Make sure to backup any customizations first!`}
            </CodeBlock>
          </div>
        </div>
      </section>
    </DocPageHeader>
  );
}
