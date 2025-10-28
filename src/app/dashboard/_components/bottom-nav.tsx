
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookOpen, MessagesSquare, ShoppingBag, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/matches', icon: Users, label: 'Conexões' },
  { href: '/dashboard/jornada', icon: BookOpen, label: 'Jornada' },
  { href: '/dashboard/forum', icon: MessagesSquare, label: 'Comunidade' },
  { href: '/dashboard/loja', icon: ShoppingBag, label: 'Loja' },
  { href: '/dashboard/meu-espaco', icon: UserCircle, label: 'Meu Espaço' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="container mx-auto grid h-20 grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-2 text-sm font-medium transition-colors h-full text-center',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary/80'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium text-balance">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
