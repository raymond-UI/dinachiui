import React from "react";
import { AlertTriangle, Terminal, Zap, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/20 to-background text-foreground relative overflow-hidden w-full">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary rounded-full animate-ping"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity bg-dot" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-6xl font-pixel text-primary">404</h1>
          </div>
          <h2 className="text-lg sm:text-2xl font-semibold mb-2">
            Component Not Found
          </h2>
          <p className="text-muted-foreground">
            This component seems to be missing from the library
          </p>
        </div>

        {/* Mock Terminal Interface */}
        <div className="bg-card backdrop-blur-lg rounded-xl border border-border shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center p-4 border-b border-border bg-card">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
            <Terminal className="w-5 h-5 mr-2 text-primary" />
            <span className="font-mono text-sm text-card-foreground">
              dinachi-cli
            </span>
            <div className="ml-auto text-sm text-muted-foreground">
              ~/project
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm space-y-3 bg-card">
            <div className="flex items-start">
              <span className="text-primary mr-2">$</span>
              <span className="text-foreground">
                npx @dinachi/cli@latest init
              </span>
            </div>

            <div className="text-primary pl-4">
              ✓ Initializing Dinachi components...
            </div>

            <div className="text-primary pl-4">
              ✓ Setting up configuration...
            </div>

            <div className="flex items-start pl-4">
              <span className="text-foreground">
                Searching for component...
              </span>
            </div>

            <div className="flex items-start pl-4 text-destructive">
              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" />
              <span>Error: Component not found in registry</span>
            </div>

            <div className="pl-4 text-muted-foreground">
              The component you're looking for doesn't exist in our library.
            </div>

            <div className="flex items-start pt-2">
              <span className="text-primary mr-2">$</span>
              <span className="text-foreground">npx @dinachi/cli list</span>
            </div>

            <div className="pl-4 text-foreground">
              <div className="mb-2 text-primary">Available components:</div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground text-xs">
                <div className="flex items-center">
                  <Code className="w-3 h-3 mr-1.5 text-primary" />
                  Button
                </div>
                <div className="flex items-center">
                  <Code className="w-3 h-3 mr-1.5 text-primary" />
                  Input
                </div>
                <div className="flex items-center">
                  <Code className="w-3 h-3 mr-1.5 text-primary" />
                  Card
                </div>
                <div className="flex items-center">
                  <Code className="w-3 h-3 mr-1.5 text-primary" />
                  Badge
                </div>
                <div className="flex items-center">
                  <Code className="w-3 h-3 mr-1.5 text-primary" />
                  Dialog
                </div>
                <div className="flex items-center">
                  <Code className="w-3 h-3 mr-1.5 text-primary" />
                  Tooltip
                </div>
              </div>
            </div>

            <div className="flex items-start pt-2">
              <span className="text-primary mr-2 animate-pulse">$</span>
              <span className="text-muted-foreground">_</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="default">Back to Home</Button>
          </Link>
          <Link href="/docs/components">
            <Button variant="outline">Browse Components</Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>
            Need help? Check out our documentation or explore our component
            library.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs">
            <span className="px-3 py-1 bg-secondary rounded-full border border-border">
              Production-ready
            </span>
            <span className="px-3 py-1 bg-secondary rounded-full border border-border">
              React Components
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
