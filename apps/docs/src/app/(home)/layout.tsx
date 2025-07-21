import PublicHeader from "@/components/reusables/PublicHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-background font-sans antialiased overflow-auto">
        <PublicHeader />
        {children}
      </body>
    </html>
  );
}
