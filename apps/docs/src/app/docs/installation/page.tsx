import CodeBlock from "@/components/reusables/CodeBlock";
import { Badge } from "@/components/ui";
import { ChevronRight, Code, Package, Zap } from "lucide-react";
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

const RequirementItem = ({
  title,
  version,
  description,
}: {
  title: string;
  version: string;
  description: string;
}) => (
  <div className="flex items-start gap-3 p-3 bg-muted/20 backdrop-blur-sm border border-border rounded-lg">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium">{title}</span>
        <span className="text-sm text-accent-foreground bg-muted px-2 py-0.5 rounded">
          {version}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default function InstallationPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Badge className="gap-2">
          <Package className="w-4 h-4" />
          DinachiUI Installation Guide
        </Badge>
        <h1 className="sr-only">DinachiUI Installation Guide</h1>
      </div>

      {/* Requirements Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Requirements</h2>
        <div className="grid gap-4">
          <RequirementItem
            title="Node.js"
            version="18.0.0+"
            description="JavaScript runtime environment for package management"
          />
          <RequirementItem
            title="React"
            version="18.0.0+"
            description="JavaScript library for building user interfaces"
          />
          <RequirementItem
            title="TypeScript"
            version="4.5.0+"
            description="Typed superset of JavaScript (optional but recommended)"
          />
        </div>
      </div>

      {/* Installation Steps */}
      <div className="space-y-8">
        <StepCard
          number="01"
          title="Initialize DinachiUI"
          description="Set up DinachiUI in your project with the CLI tool"
          icon={Package}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Using npx (recommended):
              </p>
              <CodeBlock language="bash" copyKey="npx-init">
                npx @dinachi/cli@latest init
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Or install globally:
              </p>
              <CodeBlock language="bash" copyKey="global-install">
                npm install -g @dinachi/cli
              </CodeBlock>
            </div>
            <div className="bg-accent/35 border border-border rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>What this does:</strong> Creates a components.json
                config file, installs required dependencies (clsx,
                tailwind-merge, class-variance-authority), and sets up the utils
                directory with the cn() utility function.
              </p>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="02"
          title="Add Components"
          description="Install individual components as you need them"
          icon={Zap}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Add a single component:
              </p>
              <CodeBlock language="bash" copyKey="add-component">
                npx @dinachi/cli@latest add button
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Add multiple components:
              </p>
              <CodeBlock language="bash" copyKey="add-multiple">
                npx @dinachi/cli@latest add button input card
              </CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Add all components at once:
              </p>
              <CodeBlock language="bash" copyKey="add-all">
                npx @dinachi/cli@latest add --all
              </CodeBlock>
            </div>
            <div className="bg-accent/35 border border-border rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Note:</strong> Components are copied directly into your
                project at @/components/ui, giving you full control to customize
                them.
              </p>
            </div>
          </div>
        </StepCard>

        <StepCard
          number="03"
          title="Start Using Components"
          description="Import and use DinachiUI components in your React application"
          icon={Code}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Basic usage example:
              </p>
              <CodeBlock
                language="typescript"
                copyKey="basic-usage"
              >{`import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function MyComponent() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Welcome to DinachiUI</h2>
      <div className="space-y-4">
        <Input placeholder="Enter your name" />
        <Button>Get Started</Button>
      </div>
    </Card>
  );
}`}</CodeBlock>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Component customization:
              </p>
              <CodeBlock
                language="typescript"
                copyKey="customization"
              >{`// Since components are copied to your project, you can modify them directly
// Edit: src/components/ui/button.tsx

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        // Add your custom variant
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        // Add your custom size
        xl: "h-12 px-8 py-3",
      },
    },
  }
)`}</CodeBlock>
            </div>
          </div>
        </StepCard>
      </div>

      {/* Next Steps */}
      <div className="mt-16 bg-gradient-to-r from-primary-50 to-primary-600 border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          What&apos;s Next?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
              <Code className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-semibold mb-2">Explore Components</h3>
            <p className="text-sm text-muted-foreground">
              Browse our comprehensive component library
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-semibold mb-2">Read Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Learn about customization and advanced features
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="font-semibold mb-2">Join Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with other developers and get support
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-primary-500 hover:bg-primary-600 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
            Continue to Documentation
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
