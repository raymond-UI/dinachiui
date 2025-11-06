"use client";

import Link from "next/link";
import { getComponentsByCategory, categories } from "@/lib/components-registry";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import DocPageHeader from "@/components/layout/doc-page-header";

export default function ComponentsPage() {
  return (
    <DocPageHeader
      title="Components"
      description="Beautifully designed components built with accessibility in mind. Copy and paste into your apps."
    >
      <div className="space-y-12">
        {categories.map((category) => {
          const categoryComponents = getComponentsByCategory(category);

          if (categoryComponents.length === 0) return null;

          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {category}
                </h2>
                <Badge variant="secondary">{categoryComponents.length}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryComponents.map((component) => (
                  <Link
                    href={`/docs/components/${component.name.toLowerCase()}`}
                    key={component.name}
                  >
                    <Card className="group hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {component.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {component.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

    
    </DocPageHeader>
  );
}
