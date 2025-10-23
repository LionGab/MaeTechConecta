'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se o carregamento do usuário terminar e não houver usuário, redirecione para o login.
    if (!isUserLoading && !user) {
      router.replace('/');
      return;
    }

    // Após o login, força o redirecionamento para a página de preços se o usuário não estiver nela.
    // Esta é uma lógica simplificada para um modelo "pago no início".
    // Em um app real, verificaríamos o status da assinatura do usuário.
    if (!isUserLoading && user) {
        if (pathname !== '/dashboard/pricing') {
            router.replace('/dashboard/pricing');
        }
    }

  }, [user, isUserLoading, router, pathname]);

  // Enquanto verifica o estado de autenticação, mostra um loader.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se houver um usuário, renderiza o conteúdo (que será a página de preços ou o children se a lógica for expandida).
  if (user) {
    return <>{children}</>;
  }

  // Se não houver usuário e não estiver carregando, isso será visível momentaneamente antes do redirecionamento.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
