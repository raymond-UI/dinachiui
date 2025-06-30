import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator } from '@dinachi/components'

export function TabsDemo() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Tabs Component Demo</h2>
        <p className="text-gray-600 mb-6">A component for toggling between related panels on the same page.</p>
      </div>

      {/* Basic Tabs */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Basic Usage</h3>
        <Tabs defaultValue="overview" className="w-full border border-gray-200 rounded-lg">
          <TabsList className="relative">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsIndicator className="bg-green-300" />
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <h4 className="text-xl font-medium">Overview Panel</h4>
            <p className="text-gray-600">
              This is the overview tab content. Here you can see general information and statistics.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">Quick Stats</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Total Users: 1,234</li>
                <li>• Active Sessions: 89</li>
                <li>• Revenue: $12,345</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="projects" className="space-y-4">
            <h4 className="text-xl font-medium">Projects Panel</h4>
            <p className="text-gray-600">
              Manage and view your projects here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium">Project Alpha</h5>
                <p className="text-sm text-gray-600">In progress</p>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-medium">Project Beta</h5>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="account" className="space-y-4">
            <h4 className="text-xl font-medium">Account Panel</h4>
            <p className="text-gray-600">
              View and manage your account settings.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Email notifications</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span>Two-factor authentication</span>
                <input type="checkbox" />
              </div>
              <div className="flex justify-between items-center">
                <span>Marketing emails</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Controlled Tabs */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Controlled Tabs</h3>
        <p className="text-sm text-gray-600 mb-3">
          Active tab: <code className="bg-gray-100 px-2 py-1 rounded">{activeTab}</code>
        </p>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3" disabled>Tab 3 (Disabled)</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4 border rounded-lg">
              <p>This is the content for Tab 1. You can control which tab is active from outside the component.</p>
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-4 border rounded-lg">
              <p>This is the content for Tab 2. The active tab state is managed externally.</p>
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-4 border rounded-lg">
              <p>This tab is disabled and cannot be selected.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Vertical Tabs */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Vertical Orientation</h3>
        <Tabs defaultValue="general" orientation="vertical" className="flex gap-4">
          <TabsList className="flex-col h-fit">
            <TabsTrigger value="general" className="w-full justify-start">General</TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start">Security</TabsTrigger>
            <TabsTrigger value="billing" className="w-full justify-start">Billing</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="general">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">General Settings</h4>
                <p className="text-gray-600">Configure your general preferences here.</p>
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Security Settings</h4>
                <p className="text-gray-600">Manage your security and privacy settings.</p>
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Billing Settings</h4>
                <p className="text-gray-600">View and manage your billing information.</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  )
} 