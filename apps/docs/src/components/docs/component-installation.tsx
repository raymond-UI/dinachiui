'use client';

import CodeBlock from '@/components/reusables/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentDoc } from '@/lib/components-registry';

interface ComponentInstallationProps {
  component: ComponentDoc;
}

export function ComponentInstallation({ component }: ComponentInstallationProps) {

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Installation</h2>
      
      <Tabs defaultValue="cli">
        <TabsList >
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cli" className="space-y-4">
          <div className="relative">
            <CodeBlock
              language="bash"
              copyKey={component.installation.cli}
            >
              {component.installation.cli}
            </CodeBlock>
          </div>
          <p className="text-sm text-muted-foreground">
            Run the CLI command above to automatically install the component and its dependencies.
          </p>
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Steps</h3>
              <ol className="space-y-2">
                {component.installation.manual.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Usage</h3>
              <CodeBlock
                copyKey={component.usage}
                language="typescript"
              >
                {component.usage}
              </CodeBlock>
              
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
