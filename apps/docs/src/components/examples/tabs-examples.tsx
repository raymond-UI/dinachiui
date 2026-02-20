"use client"

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator } from '@/components/ui/tabs';

export function DefaultTabsExample() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-2 pt-4">
        <h3 className="text-sm font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="password" className="space-y-2 pt-4">
        <h3 className="text-sm font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password and security settings.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="space-y-2 pt-4">
        <h3 className="text-sm font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your application preferences.
        </p>
      </TabsContent>
    </Tabs>
  );
}

export function ControlledTabsExample() {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="w-full max-w-md space-y-2">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as string)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <div className="rounded-md border p-4">
            <p className="text-sm">Overview content for your dashboard.</p>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="pt-4">
          <div className="rounded-md border p-4">
            <p className="text-sm">Analytics data and charts.</p>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="pt-4">
          <div className="rounded-md border p-4">
            <p className="text-sm">Generated reports and exports.</p>
          </div>
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground">Active tab: {activeTab}</p>
    </div>
  );
}

export function TabsWithIndicatorExample() {
  return (
    <Tabs defaultValue="music" className="w-full max-w-md">
      <TabsList className="relative">
        <TabsTrigger value="music">Music</TabsTrigger>
        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        <TabsTrigger value="audiobooks">Audiobooks</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="music" className="pt-4">
        <p className="text-sm text-muted-foreground">Browse your music library.</p>
      </TabsContent>
      <TabsContent value="podcasts" className="pt-4">
        <p className="text-sm text-muted-foreground">Discover new podcasts.</p>
      </TabsContent>
      <TabsContent value="audiobooks" className="pt-4">
        <p className="text-sm text-muted-foreground">Listen to audiobooks.</p>
      </TabsContent>
    </Tabs>
  );
}

export function DisabledTabsExample() {
  return (
    <Tabs defaultValue="active" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="pt-4">
        <p className="text-sm text-muted-foreground">Active content is visible here.</p>
      </TabsContent>
      <TabsContent value="archived" className="pt-4">
        <p className="text-sm text-muted-foreground">Archived items are shown here.</p>
      </TabsContent>
    </Tabs>
  );
}
