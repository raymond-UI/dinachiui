'use client';

import { useState } from 'react';
import { ComponentDoc } from '@/lib/components-registry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from './code-block';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface ComponentInstallationProps {
  component: ComponentDoc;
}

export function ComponentInstallation({ component }: ComponentInstallationProps) {
  const [copiedCli, setCopiedCli] = useState(false);
  
  const copyCliCommand = async () => {
    await navigator.clipboard.writeText(component.installation.cli);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

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
              code={component.installation.cli}
              language="bash"
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={copyCliCommand}
            >
              {copiedCli ? (
                <Check className="h-4 w-4 text-secondary-foreground" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
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
                code={component.usage}
                language="typescript"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
