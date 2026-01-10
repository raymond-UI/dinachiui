import PublicHeader from "@/components/reusables/PublicHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col relative w-full overflow-y-auto">
      {children}
    </div>
  );
}
