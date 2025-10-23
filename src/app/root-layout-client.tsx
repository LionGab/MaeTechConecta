'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/app/dashboard/_components/header';
import { BottomNav } from '@/app/dashboard/_components/bottom-nav';

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header />
          <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mb-20">
            {children}
          </main>
          <BottomNav />
        </div>
    );
  }

  return <>{children}</>;
}
