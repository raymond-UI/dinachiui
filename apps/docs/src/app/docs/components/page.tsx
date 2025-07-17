'use client';

import Link from 'next/link';
import { getComponentsByCategory, categories } from '@/lib/components-registry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ComponentsPage() {

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Components</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beautifully designed components built with accessibility in mind. 
            Copy and paste into your apps.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryComponents = getComponentsByCategory(category);
            
            if (categoryComponents.length === 0) return null;

            return (
              <section key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{category}</h2>
                  <Badge variant="secondary">{categoryComponents.length}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryComponents.map((component) => (
                    <Card key={component.name} className="group hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{component.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Link href={`/docs/components/${component.name.toLowerCase()}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {component.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {component.dependencies.slice(0, 2).map((dep) => (
                              <Badge key={dep} variant="outline" className="text-xs">
                                {dep.split('/').pop()}
                              </Badge>
                            ))}
                            {component.dependencies.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{component.dependencies.length - 2}
                              </Badge>
                            )}
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <Link href={`/docs/components/${component.name.toLowerCase()}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Want to contribute?
            </h3>
            <p className="text-gray-600 mb-4">
              Help us build more components for the community.
            </p>
            <Button>
              <a href="https://github.com/dinachi/ui" target="_blank" rel="noopener noreferrer">
                Contribute on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
