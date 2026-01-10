"use client";

import Link from "next/link";
import { getAllComponents } from "@/lib/components-registry";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DocPageHeader from "@/components/layout/doc-page-header";

export default function ComponentsPage() {
  const allComponents = getAllComponents();

  return (
    <DocPageHeader
      title="Components"
      description="Beautifully designed components built with accessibility in mind. Copy and paste into your apps."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allComponents.map((component) => (
          <Link
            href={`/docs/components/${component.slug}`}
            key={component.name}
            className="w-full group"
          >
            <Card className="group hover:shadow-lg scale-100 group-hover:scale-105 transition-all duration-300 ease-in-out p-1">
              <CardHeader className="p-2 px-4">
                <CardTitle className="text-xl group-hover:text-primary group-hover:underline transition-all duration-300 ease-in-out">{component.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </DocPageHeader>
  );
}
