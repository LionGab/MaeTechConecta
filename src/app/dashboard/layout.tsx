'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Users, BookOpen, MessagesSquare, ShoppingBag, UserCircle, Bell } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Início', icon: UserCircle },
  { href: '/dashboard/matches', icon: Users, label: 'Conexões' },
  { href: '/dashboard/jornada', icon: BookOpen, label: 'Jornada' },
  { href: '/dashboard/forum', icon: MessagesSquare, label: 'Comunidade' },
  { href: '/dashboard/loja', icon: ShoppingBag, label: 'Loja' },
];


function SideNav() {
    const pathname = usePathname();
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navItems.map((item) => {
                    const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                isActive && "bg-muted text-primary"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    )
                })}
                </nav>
            </div>
            </div>
      </div>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideNav />
            <div className="flex flex-col">
                 {children}
            </div>
        </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
