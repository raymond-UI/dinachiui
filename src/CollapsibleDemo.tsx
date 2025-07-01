import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@dinachi/components/collapsible";
import {
  Bell,
  Calendar,
  ChevronDown,
  Code,
  Database,
  Download,
  Edit3,
  Eye,
  FileText,
  MessageSquare,
  Palette,
  Settings,
  Shield,
  Trash2,
  User
} from "lucide-react";
import { useState } from "react";

export function CollapsibleDemo() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });

  const handleAccordionToggle = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="space-y-8 w-full">
      <h2 className="text-2xl font-bold">Complex Collapsible Demos</h2>
      
      {/* Nested Collapsibles */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Nested Collapsibles</h3>
        <Collapsible className="w-full max-w-2xl border rounded-lg">
          <CollapsibleTrigger className="group flex items-center gap-2 w-full px-4 py-3 text-left bg-slate-50 hover:bg-slate-100">
            <Settings className="h-4 w-4" />
            <span className="font-medium">System Configuration</span>
            <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="p-4 space-y-3">
              <Collapsible className="border rounded">
                <CollapsibleTrigger className="group flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-50">
                  <Database className="h-4 w-4" />
                  <span className="text-sm font-medium">Database Settings</span>
                  <ChevronDown className="h-3 w-3 ml-auto transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <div className="p-3 space-y-2 text-sm bg-slate-25">
                    <div className="flex justify-between">
                      <span>Connection Pool Size:</span>
                      <input type="number" defaultValue="10" className="w-16 px-2 py-1 border rounded text-xs" />
                    </div>
                    <div className="flex justify-between">
                      <span>Timeout (ms):</span>
                      <input type="number" defaultValue="5000" className="w-20 px-2 py-1 border rounded text-xs" />
                    </div>
                  </div>
                </CollapsiblePanel>
              </Collapsible>

              <Collapsible className="border rounded">
                <CollapsibleTrigger className="group flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-50">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Security Settings</span>
                  <ChevronDown className="h-3 w-3 ml-auto transition-transform duration-200 group-data-[panel-open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <div className="p-3 space-y-2 text-sm bg-slate-25">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Enable 2FA</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Force HTTPS</span>
                    </label>
                  </div>
                </CollapsiblePanel>
              </Collapsible>
            </div>
          </CollapsiblePanel>
        </Collapsible>
      </div>

      {/* Accordion Pattern */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Accordion Pattern (Only One Open)</h3>
        <div className="w-full max-w-2xl space-y-2">
          {[
            { id: 'profile', icon: User, title: 'Profile Information', content: 'Manage your personal information and account details.' },
            { id: 'notifications', icon: Bell, title: 'Notification Settings', content: 'Configure how and when you receive notifications.' },
            { id: 'appearance', icon: Palette, title: 'Appearance & Theme', content: 'Customize the look and feel of your interface.' },
            { id: 'privacy', icon: Shield, title: 'Privacy & Security', content: 'Control your privacy settings and security preferences.' }
          ].map(({ id, icon: Icon, title, content }) => (
            <Collapsible 
              key={id}
              open={activeAccordion === id}
              onOpenChange={() => handleAccordionToggle(id)}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="group flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-slate-50">
                <Icon className="h-4 w-4 text-slate-600" />
                <span className="font-medium">{title}</span>
                <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[panel-open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="px-4 pb-4 text-sm text-slate-600 border-t bg-slate-25">
                  <div className="pt-3">{content}</div>
                </div>
              </CollapsiblePanel>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Interactive Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Interactive Content Form</h3>
        <Collapsible className="w-full max-w-2xl border rounded-lg">
          <CollapsibleTrigger className="group flex items-center gap-2 w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 border-b">
            <Edit3 className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Edit Profile</span>
            <ChevronDown className="h-4 w-4 ml-auto text-blue-600 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  rows={3}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Save Changes
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </CollapsiblePanel>
        </Collapsible>
      </div>

      {/* Rich Content with Actions */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Rich Content with Actions</h3>
        <div className="w-full max-w-2xl space-y-3">
          {[
            {
              title: "Project Alpha - Website Redesign",
              status: "In Progress",
              date: "Due: Dec 15, 2024",
              team: ["John", "Sarah", "Mike"],
              tasks: 12,
              completed: 8
            },
            {
              title: "Mobile App Development",
              status: "Planning",
              date: "Due: Jan 30, 2025",
              team: ["Alice", "Bob"],
              tasks: 24,
              completed: 3
            }
          ].map((project, index) => (
            <Collapsible key={index} className="border rounded-lg shadow-sm">
              <CollapsibleTrigger className="group flex items-center gap-3 w-full px-4 py-4 text-left hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'In Progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{project.date}</span>
                    <span>{project.completed}/{project.tasks} tasks</span>
                    <div className="flex -space-x-2">
                      {project.team.map((member, i) => (
                        <div key={i} className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                          {member[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-[panel-open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="border-t bg-gray-50">
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Recent Activity</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" />
                            <span>2 new comments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            <span>Design files updated</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Meeting scheduled</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">Progress</h5>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(project.completed / project.tasks) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {Math.round((project.completed / project.tasks) * 100)}% complete
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Eye className="h-3 w-3" />
                        View Details
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        <Download className="h-3 w-3" />
                        Export
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 ml-auto">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </CollapsiblePanel>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* FAQ Style */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">FAQ Style</h3>
        <div className="w-full max-w-2xl space-y-1">
          {[
            {
              question: "How do I reset my password?",
              answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. Enter your email address and we'll send you instructions to create a new password."
            },
            {
              question: "Can I change my subscription plan?",
              answer: "Yes, you can upgrade or downgrade your subscription at any time from your account settings. Changes will be prorated and reflected in your next billing cycle."
            },
            {
              question: "Is my data secure?",
              answer: "Absolutely. We use industry-standard encryption both in transit and at rest. Your data is stored in secure, SOC 2 compliant data centers with regular security audits."
            },
            {
              question: "How do I contact support?",
              answer: "You can reach our support team through the help center, email us at support@example.com, or use the live chat feature available 24/7."
            }
          ].map((faq, index) => (
            <Collapsible key={index} className="border-b border-gray-200 last:border-b-0">
              <CollapsibleTrigger className="group flex items-center justify-between w-full px-0 py-4 text-left hover:text-blue-600">
                <span className="font-medium text-gray-900 group-hover:text-blue-600 pr-4">
                  {faq.question}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-all duration-200 group-data-[panel-open]:rotate-180 flex-shrink-0" />
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </CollapsiblePanel>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Code Snippet Collapsible */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Code Snippet Example</h3>
        <Collapsible className="w-full max-w-2xl border rounded-lg">
          <CollapsibleTrigger className="group flex items-center gap-2 w-full px-4 py-3 text-left">
            <Code className="h-4 w-4" />
            <span className="font-mono text-sm">useCollapsible.tsx</span>
            <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsiblePanel>
            <div className="p-0">
              <pre className="bg-gray-50 p-4 text-sm overflow-x-auto">
                <code className="text-gray-800">{`import { useState } from 'react';

export function useCollapsible(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  
  return {
    isOpen,
    toggle,
    open,
    close,
    setIsOpen
  };
}`}</code>
              </pre>
            </div>
          </CollapsiblePanel>
        </Collapsible>
      </div>
    </div>
  );
}