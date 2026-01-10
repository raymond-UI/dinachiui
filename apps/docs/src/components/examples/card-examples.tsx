"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DefaultCardExample() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the main content area of the card. You can add any content here.
        </p>
      </CardContent>
    </Card>
  );
}

export function CardWithFooterExample() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your details to create a new account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            placeholder="John Doe"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  );
}

export function CardVariationsExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Free Plan</CardTitle>
          <CardDescription>For personal use</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$0</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            Get Started
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Pro Plan</CardTitle>
          <CardDescription>For teams and businesses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">$29</p>
          <p className="text-sm text-muted-foreground">per month</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Subscribe</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function InteractiveCardExample() {
  return (
    <Card className="w-full max-w-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Status</CardTitle>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Active
          </span>
        </div>
        <CardDescription>Last updated 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">75%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: "75%" }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto">
          View Details →
        </Button>
      </CardFooter>
    </Card>
  );
}
