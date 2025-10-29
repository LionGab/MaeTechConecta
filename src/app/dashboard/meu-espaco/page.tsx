'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Bell, Heart, Shield, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import imageData from '@/lib/placeholder-images.json';

export default function MeuEspacoPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const userAvatar = imageData.placeholderImages.find(p => p.id === 'logo-nath');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
      toast({ title: 'Você saiu da sua conta.' });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({ variant: 'destructive', title: 'Erro ao sair', description: 'Não foi possível fazer logout. Tente novamente.' });
    }
  };
  
  const handleNotImplemented = () => {
      toast({
          title: 'Funcionalidade em desenvolvimento',
          description: 'Estamos trabalhando para trazer essa novidade para você em breve!',
      });
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isUserLoading) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="bg-muted h-24" />
        </CardHeader>
        <CardContent className="p-6 pt-0 text-center">
          <div className="relative -mt-12 mx-auto h-24 w-24">
            <Avatar className="h-full w-full border-4 border-card">
              <AvatarImage src={userAvatar?.imageUrl || user?.photoURL || ''} alt="Avatar do usuário" />
              <AvatarFallback className="text-3xl">{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="mt-4 font-headline text-2xl font-bold">{user?.displayName || 'Usuário'}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleNotImplemented}>
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Minha Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
           <button onClick={handleNotImplemented} className="flex w-full items-center justify-between rounded-md p-3 transition-colors hover:bg-muted">
                <span className="flex items-center gap-3"><Bell className="h-5 w-5 text-muted-foreground" /> Notificações</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <Link href="/dashboard/pricing" className="flex w-full items-center justify-between rounded-md p-3 transition-colors hover:bg-muted">
                <span className="flex items-center gap-3"><Heart className="h-5 w-5 text-muted-foreground" /> Minha Assinatura</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
             <button onClick={handleNotImplemented} className="flex w-full items-center justify-between rounded-md p-3 transition-colors hover:bg-muted">
                <span className="flex items-center gap-3"><Shield className="h-5 w-5 text-muted-foreground" /> Privacidade</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
        </CardContent>
      </Card>
      
      <Button variant="ghost" onClick={handleSignOut} className="w-full text-destructive hover:text-destructive">
          <LogOut className="mr-2 h-5 w-5" />
          Sair da conta
      </Button>
    </div>
  );
}
