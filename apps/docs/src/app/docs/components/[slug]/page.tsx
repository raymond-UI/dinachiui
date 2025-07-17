import { notFound } from 'next/navigation';
import { getComponentDoc, getAllComponents } from '@/lib/components-registry';
import { ComponentPage } from '@/components/docs/component-page';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const components = getAllComponents();
  return components.map((component) => ({
    slug: component.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentDoc(slug);
  
  if (!component) {
    return {
      title: 'Component Not Found',
    };
  }

  return {
    title: `${component.name} - DinachiUI`,
    description: component.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentDoc(slug);

  if (!component) {
    notFound();
  }

  // Get all components for navigation
  const allComponents = getAllComponents();
  const currentIndex = allComponents.findIndex(c => c.slug === slug);
  const prevComponent = currentIndex > 0 ? allComponents[currentIndex - 1] : undefined;
  const nextComponent = currentIndex < allComponents.length - 1 ? allComponents[currentIndex + 1] : undefined;

  return (
    <ComponentPage
      component={component}
      prevComponent={prevComponent}
      nextComponent={nextComponent}
    />
  );
}
