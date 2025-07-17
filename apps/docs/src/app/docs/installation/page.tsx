import CodeBlock from "@/components/reusables/CodeBlock";
import { ChevronRight, Code, Package, Shield, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function InstallationPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Package className="w-4 h-4" />
          DinachiUI Installation Guide
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          Choose Your Framework
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get started with DinachiUI using your preferred React framework or
          setup.
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-accent/30 border border-accent rounded-xl p-6">
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
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/docs/installation/nextjs">
          <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Next.js</h3>
                <p className="text-sm text-muted-foreground">
                  App Router & Server Components
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              Complete setup guide for Next.js 13+ with App Router, Server
              Components, and TypeScript.
            </p>
            <div className="flex items-center text-primary-500 text-sm font-medium">
              View Guide <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        <Link href="/docs/installation/vite">
          <div className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Vite</h3>
                <p className="text-sm text-muted-foreground">
                  Fast development & optimized builds
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              Setup guide for Vite projects with HMR, TypeScript, and production
              optimizations.
            </p>
            <div className="flex items-center text-primary-500 text-sm font-medium">
              View Guide <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        <div className="bg-background border border-border rounded-xl p-6 shadow-sm opacity-75">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Create React App</h3>
              <p className="text-sm text-muted-foreground">
                Classic React setup
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Coming soon: Setup guide for Create React App projects with custom
            configurations.
          </p>
          <div className="flex items-center text-muted-foreground text-sm">
            Coming Soon
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl p-6 shadow-sm opacity-75">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Remix</h3>
              <p className="text-sm text-muted-foreground">
                Full-stack React framework
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Coming soon: Setup guide for Remix projects with server-side
            rendering.
          </p>
          <div className="flex items-center text-muted-foreground text-sm">
            Coming Soon
          </div>
        </div>
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
