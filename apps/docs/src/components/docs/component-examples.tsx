"use client";

import { useState } from 'react';
import { ComponentExample } from '@/lib/components-registry';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from './code-block';
import { Copy, Check, Eye, Code } from 'lucide-react';
import { exampleComponents } from '@/lib/examples-registry';

interface ComponentExamplesProps {
  examples: ComponentExample[];
}

export function ComponentExamples({ examples }: ComponentExamplesProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string, exampleName: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(exampleName);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Examples</h2>

      <div className="space-y-8">
        {examples.map((example) => (
          <div
            key={example.name}
            className="border border-border rounded-lg overflow-hidden"
          >
            <div className="bg-background px-6 py-4 border-b border-border">
              <h3 className="text-lg font-medium text-foreground">
                {example.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {example.description}
              </p>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                <TabsList className="grid w-40 grid-cols-2">
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Code
                  </TabsTrigger>
                </TabsList>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(example.code, example.name)}
                  className="flex items-center gap-2"
                >
                  {copiedCode === example.name ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Copy
                </Button>
              </div>

              <TabsContent value="preview" className="p-6">
                <div className="flex items-center justify-center min-h-[200px] bg-background border border-border rounded-lg">
                  {(() => {
                    const ExampleComponent = exampleComponents[example.componentId as keyof typeof exampleComponents];
                    return ExampleComponent ? <ExampleComponent /> : <div>Component not found</div>;
                  })()}
                </div>
              </TabsContent>

              <TabsContent value="code" className="p-0">
                <CodeBlock code={example.code} language="typescript" />
              </TabsContent>
            </Tabs>
          </div>
        ))}
      </div>
    </section>
  );
}
