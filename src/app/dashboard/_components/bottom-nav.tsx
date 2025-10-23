'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Clapperboard, MessagesSquare, ShoppingBag, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/matches', icon: Users, label: 'Conexões' },
  { href: '/dashboard/content', icon: Clapperboard, label: 'Conteúdo' },
  { href: '/dashboard/nath-inspira', icon: Sparkles, label: 'Nath Inspira' },
  { href: '/dashboard/loja', icon: ShoppingBag, label: 'Loja' },
  { href: '/dashboard/forum', icon: MessagesSquare, label: 'Fórum' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-md p-2 text-sm font-medium transition-colors h-full',
                isActive
                  ? 'text-accent-foreground'
                  : 'text-muted-foreground hover:text-accent-foreground/80'
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
