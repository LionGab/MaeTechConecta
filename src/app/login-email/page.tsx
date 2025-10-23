'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth, initiateEmailSignIn } from '@/firebase';
import { Loader2, ArrowLeft } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';


export default function LoginEmailPage() {
  const logo = imageData.placeholderImages.find(p => p.id === 'logo-nath');
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Por favor, preencha o e-mail e a senha.",
        });
        return;
    }
    setIsLoading(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para a assinatura...",
      });
       router.push('/dashboard/pricing');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "E-mail ou senha inválidos. Verifique suas credenciais e tente novamente.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-6">
         <Button variant="ghost" size="sm" className="absolute top-4 left-4" asChild>
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Link>
        </Button>
        <div className="text-center">
          {logo && <Image src={logo.imageUrl} alt={logo.description} width={80} height={80} className="h-20 w-20 mx-auto rounded-full" />}
          <h1 className="font-headline text-3xl font-bold mt-4">Entrar com E-mail</h1>
          <p className="text-muted-foreground mt-2">Acesse sua conta para continuar.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    