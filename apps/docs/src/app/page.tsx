"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRight,
  Check,
  Code,
  Copy,
  Github,
  Shield,
  Star,
  Terminal,
  Twitter,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [cliStep, setCliStep] = useState(0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cliSteps = [
    "npx @dinachi/cli@latest init",
    "npx @dinachi/cli@latest add button",
    "import { Button } from '@/components/ui/button'",
    "<Button>Get Started</Button>",
  ];

  return (
    <TooltipProvider>
      <ToastProvider>
        <div className="flex flex-col w-full min-h-screen">
          {/* Navigation */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex">
                <Link className="mr-6 flex items-center space-x-2" href="/">
                  <div className="h-6 w-6 bg-primary rounded-sm" />
                  <span className="font-bold">DinachiUI</span>
                </Link>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          <li>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">
                                Button
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Interactive button component with variants
                              </p>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">
                                Navigation
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Navigation menu with dropdown support
                              </p>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">
                                Dialog
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Modal dialog with accessibility features
                              </p>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">
                                Toast
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Notification toasts with actions
                              </p>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Examples
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Documentation
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <nav className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost" size="sm">
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on GitHub</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost" size="sm">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container mx-auto flex max-w-[74rem] flex-col items-center gap-4 text-center">
              <Badge
                variant="secondary"
                size="lg"
                className="rounded-2xl px-4 py-1.5"
              >
                <span className="mr-2 text-xs">✨</span>
                20+ Production-Ready Components
              </Badge>
              <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Build faster with
                <br className="hidden sm:inline" />
                <span className="text-primary"> production-ready</span>
                <br className="hidden sm:inline" />
                components
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Copy, paste, and customize. No package installs. Built with
                accessibility in mind.
                <br className="hidden sm:inline" />
                Powered by Base UI and styled with Tailwind CSS.
              </p>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Button size="lg" className="h-11 px-8">
                  Browse Components
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-11 px-8">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </section>

          {/* CLI Demo Section */}
          <section className="border-t bg-muted/40">
            <div className="container mx-auto py-12 md:py-24">
              <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                  Get started in seconds
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Our CLI tool makes it easy to add components to your project.
                </p>
                <div className="rounded-lg border bg-background p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      <span className="text-sm font-medium">Terminal</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(cliSteps[cliStep])}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <code className="text-sm font-mono">
                      $ {cliSteps[cliStep]}
                    </code>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-2">
                      {cliSteps.map((_, i) => (
                        <button
                          key={i}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            i === cliStep
                              ? "bg-primary"
                              : "bg-muted-foreground/30"
                          }`}
                          onClick={() => setCliStep(i)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 md:py-24">
            <div className="container mx-auto">
              <div className="mx-auto max-w-[58rem] text-center mb-12">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                  Why choose DinachiUI?
                </h2>
                <p className="text-muted-foreground text-lg">
                  Built with modern web standards and developer experience in
                  mind.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Accessibility First</CardTitle>
                    <CardDescription>
                      Built on Base UI foundation with full ARIA support,
                      keyboard navigation, and screen reader compatibility.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Code className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Developer Experience</CardTitle>
                    <CardDescription>
                      TypeScript support, IntelliSense, and comprehensive
                      documentation. Install with one command.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Production Ready</CardTitle>
                    <CardDescription>
                      Thoroughly tested, performance optimized, and used in
                      production by teams worldwide.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          {/* Component Showcase */}
          <section className="w-full border-t bg-muted/40 py-12 md:py-24">
            <div className="container mx-auto">
              <div className="mx-auto max-w-[58rem] text-center mb-12">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                  Components in action
                </h2>
                <p className="text-muted-foreground text-lg">
                  Explore our component library with live examples.
                </p>
              </div>
              <Tabs defaultValue="buttons" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="buttons">Buttons</TabsTrigger>
                  <TabsTrigger value="forms">Forms</TabsTrigger>
                  <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="buttons" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Button Variants</CardTitle>
                        <CardDescription>
                          Different button styles for various use cases
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Button>Primary</Button>
                          <Button variant="secondary">Secondary</Button>
                          <Button variant="destructive">Destructive</Button>
                          <Button variant="outline">Outline</Button>
                          <Button variant="ghost">Ghost</Button>
                          <Button variant="link">Link</Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Button Sizes</CardTitle>
                        <CardDescription>
                          Different sizes for different contexts
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button size="sm">Small</Button>
                          <Button size="default">Default</Button>
                          <Button size="lg">Large</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="forms" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Form Controls</CardTitle>
                        <CardDescription>
                          Input fields, checkboxes, and sliders
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input placeholder="Enter your email" />
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Accept terms and conditions
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Volume</label>
                          <Slider defaultValue={[50]} max={100} step={1} />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Textarea</CardTitle>
                        <CardDescription>Multi-line text input</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea placeholder="Enter your message" rows={4} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="navigation" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Navigation Menu</CardTitle>
                      <CardDescription>
                        The navigation menu you see above, fully accessible
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This very navigation menu is built with our
                        NavigationMenu component. It supports keyboard
                        navigation, screen readers, and mobile responsive
                        design.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="feedback" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tooltips</CardTitle>
                        <CardDescription>
                          Hover over the icons above to see tooltips in action
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="outline" size="icon">
                                <Star className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add to favorites</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="outline" size="icon">
                                <Code className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View source code</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Dialogs</CardTitle>
                        <CardDescription>
                          Modal dialogs with accessibility features
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Dialog>
                          <DialogTrigger>
                            <Button>Open Dialog</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Welcome to DinachiUI</DialogTitle>
                              <DialogDescription>
                                This is a modal dialog built with our Dialog
                                component. It supports keyboard navigation,
                                focus management, and proper ARIA attributes.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button>Continue</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Call to Action */}
          <section className="border-t py-12 md:py-24">
            <div className="container mx-auto">
              <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                  Ready to build something amazing?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Get started with DinachiUI today and ship faster than ever.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
                  <Button size="lg" className="h-11 px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="h-11 px-8">
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t bg-muted/40">
            <div className="container mx-auto py-6 md:py-12">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-primary rounded-sm" />
                  <span className="font-bold">DinachiUI</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Built with ❤️ by the DinachiUI team. Open source and free to
                  use.
                </p>
              </div>
            </div>
          </footer>
        </div>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
