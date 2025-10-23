'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [hasVisitedPricing, setHasVisitedPricing] = useState(false);

  useEffect(() => {
    // If user loading is finished and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace('/');
      return;
    }

    // After login, if the user hasn't been to the pricing page yet, redirect them there.
    // This logic simulates a "paywall" that is shown only once after login.
    // In a real app, we would check the user's subscription status from a database.
    if (!isUserLoading && user && !hasVisitedPricing) {
      if (pathname !== '/dashboard/pricing') {
        router.replace('/dashboard/pricing');
      } else {
        // Once the user lands on the pricing page, we mark it as visited.
        setHasVisitedPricing(true);
      }
    }
  }, [user, isUserLoading, router, pathname, hasVisitedPricing]);

  // While checking authentication state, show a loader.
  if (isUserLoading || (!isUserLoading && user && !hasVisitedPricing && pathname !== '/dashboard/pricing')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there's a user and they've been through the pricing flow, render the content.
  if (user) {
    return <>{children}</>;
  }

  // This is a fallback loader, visible momentarily before the initial redirect to login.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
