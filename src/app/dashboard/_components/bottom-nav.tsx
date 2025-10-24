'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BotMessageSquare, Users, Clapperboard, MessagesSquare, ShoppingBag, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/matches', icon: Users, label: 'Conexões' },
  { href: '/dashboard/jornada', icon: BookOpen, label: 'Jornada' },
  { href: '/dashboard', icon: BotMessageSquare, label: 'NathIA' },
  { href: '/dashboard/loja', icon: ShoppingBag, label: 'Loja' },
  { href: '/dashboard/forum', icon: MessagesSquare, label: 'Fórum' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm md:hidden">
      <div className="container mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-md p-2 text-sm font-medium transition-colors h-full text-center min-h-[44px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary/80 active:bg-primary/10'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs text-balance leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
