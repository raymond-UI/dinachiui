import { DocsLayout } from '@/components/layout/docs-layout';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DocsLayout>
        {children}
      </DocsLayout>
    </SidebarProvider>
  );
}
