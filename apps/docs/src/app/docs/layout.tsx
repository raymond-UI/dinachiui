import { DocsLayout } from '@/components/layout/docs-layout';

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout>
      {children}
    </DocsLayout>
  );
}
