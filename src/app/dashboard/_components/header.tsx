import Link from 'next/link';
import Image from 'next/image';
import {
  Bell,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import imageData from '@/lib/placeholder-images.json';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Assistente',
  '/dashboard/matches': 'Conexões de Fé',
  '/dashboard/loja': 'Nossa Loja',
  '/dashboard/content': 'Conteúdo Exclusivo',
  '/dashboard/forum': 'Fórum de Apoio',
  '/dashboard/pricing': 'Nosso Plano',
};


export function Header() {
  const userAvatar = imageData.placeholderImages.find(p => p.id === 'avatar-1');
  const logo = imageData.placeholderImages.find(p => p.id === 'logo-nath');

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6 sticky top-0 z-40">
       <div className="w-full flex-1">
        <Link href="/dashboard" className="flex items-center gap-2">
            {logo && <Image src={logo.imageUrl} alt={logo.description} width={32} height={32} className="h-8 w-8 rounded-full" />}
            <span className="font-headline text-xl font-bold">Nossa Maternidade</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary/90"></span>
          </span>
          <span className="sr-only">Ver notificações</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Avatar do usuário" />}
                <AvatarFallback>NV</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/pricing">Assinatura</Link></DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
