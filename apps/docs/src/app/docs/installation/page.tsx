import DocPageHeader from "@/components/layout/doc-page-header";
import CodeBlock from "@/components/reusables/CodeBlock";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { ChevronRight, Code, Package, Shield, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function InstallationPage() {

  const frameworks = [
    {
      name: "Next.js",
      href: "/docs/installation/nextjs",

      
    },
    {
      name: "Vite",
      href: "/docs/installation/vite",
    },
    {
      name: "Remix",
      href: "/docs/installation/remix",
    },
  ];
  return (
    <DocPageHeader
      title="Installation"
      description="Get started with DinachiUI using your preferred React framework or setup."
    >
      {/* Quick Start */}
      <div className="border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Quick Start (Any Framework)
        </h2>
        <p className="text-muted-foreground mb-4">
          If you&apos;re using a different framework or want to get started
          quickly:
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <CodeBlock language="bash" copyKey="quick-init">
              npx @dinachi/cli@latest init
            </CodeBlock>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <CodeBlock language="bash" copyKey="quick-add">
              npx @dinachi/cli@latest add button
            </CodeBlock>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <CodeBlock language="typescript" copyKey="quick-usage">
              {`import { Button } from "@/components/ui/button";`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* Framework Selection */}
      <div className="grid md:grid-cols-4 gap-6">
        {frameworks.map((framework) => (
          <Link key={framework.href} href={framework.href}>
            <Card>
              <CardHeader>
                <CardTitle>{framework.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Next Steps */}
      <div className="mt-16 bg-linear-to-r from-primary-50 to-primary-600 border rounded-xl p-8">
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
    </DocPageHeader>
  );
}
