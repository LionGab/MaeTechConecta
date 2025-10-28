'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BotMessageSquare, Baby, Activity, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard/jornada', icon: Baby, label: 'Jornada' },
  { href: '/dashboard/sintomas', icon: Activity, label: 'Sintomas' },
  { href: '/dashboard', icon: BotMessageSquare, label: 'NathIA' },
  { href: '/dashboard/content', icon: BookOpen, label: 'Conteúdo' },
  { href: '/dashboard/matches', icon: Users, label: 'Conexões' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-md p-2 text-sm font-medium transition-colors h-full text-center',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary/80'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs text-balance">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
