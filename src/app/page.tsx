'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, initiateGoogleSignIn, initiateAppleSignIn } from '@/firebase';
import { Loader2 } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';
import { Icons } from '@/components/icons';


export default function LoginPage() {
  const logo = imageData.placeholderImages.find(p => p.id === 'logo-nath');
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<null | 'google' | 'apple' | 'email'>(null);

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(provider);
    try {
      const signInFunction = provider === 'google' ? initiateGoogleSignIn : initiateAppleSignIn;
      await signInFunction(auth);
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para a assinatura...",
      });
      router.push('/dashboard/pricing');
    } catch (error: any) {
      // Handle specific errors, e.g., 'auth/popup-closed-by-user'
      if (error.code !== 'auth/popup-closed-by-user') {
          toast({
            variant: "destructive",
            title: `Erro no login com ${provider}`,
            description: "Não foi possível fazer o login. Por favor, tente novamente.",
        });
      }
    } finally {
        setIsLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          {logo && <Image src={logo.imageUrl} alt={logo.description} width={80} height={80} className="h-20 w-20 mx-auto rounded-full" />}
          <h1 className="font-headline text-3xl font-bold mt-4">Bem-vinda de volta!</h1>
          <p className="text-muted-foreground mt-2">Sua comunidade de fé e acolhimento.</p>
        </div>
        
        <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')} disabled={!!isLoading}>
                {isLoading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-5 w-5" />}
                Continuar com Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('apple')} disabled={!!isLoading}>
                {isLoading === 'apple' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.apple className="mr-2 h-5 w-5" />}
                Continuar com Apple
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <Button variant="secondary" className="w-full" asChild>
                <Link href="/login-email">Continuar com E-mail</Link>
            </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/sign-up" className="underline text-primary">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

    