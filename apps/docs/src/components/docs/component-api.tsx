'use client';

import { ComponentDoc } from '@/lib/components-registry';
import { Badge } from '@/components/ui/badge';

interface ComponentAPIProps {
  component: ComponentDoc;
}

export function ComponentAPI({ component }: ComponentAPIProps) {
  if (component.props.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6">API Reference</h2>
        <p className="text-muted-foreground">This component does not accept any props.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-6">API Reference</h2>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Prop</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Default</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {component.props.map((prop, index) => (
                <tr key={prop.name} className={index % 2 === 0 ? 'bg-background' : 'bg-muted'}>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-foreground">{prop.name}</code>
                      {prop.required && (
                        <Badge variant="destructive" className="text-xs">
                          required
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <code className="text-sm font-mono text-secondary-foreground bg-secondary px-2 py-1 rounded">
                      {prop.type}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {prop.defaultValue ? (
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {prop.defaultValue}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-md">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
