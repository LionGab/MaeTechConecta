'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Se o carregamento do usuário estiver concluído e não houver usuário, redirecione para a página de login.
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  // Enquanto o estado de autenticação é verificado, mostre um loader.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se houver um usuário, renderize o conteúdo do painel.
  if (user) {
    return <>{children}</>;
  }

  // Se não houver usuário e o carregamento estiver concluído, isso ficará visível momentaneamente
  // antes do redirecionamento. Um loader também é apropriado aqui.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
