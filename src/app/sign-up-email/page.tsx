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
import { useAuth, initiateEmailSignUp } from '@/firebase';
import { Loader2, ArrowLeft } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';


export default function SignUpEmailPage() {
  const logo = imageData.placeholderImages.find(p => p.id === 'logo-nath');
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
        toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Por favor, preencha todos os campos.",
        });
        return;
    }
    setIsLoading(true);
    try {
      await initiateEmailSignUp(auth, email, password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para a página de assinatura...",
      });
      router.push('/dashboard/pricing');
    } catch (error: any) {
      let description = "Ocorreu um erro ao tentar criar a conta.";
      if (error.code === 'auth/email-already-in-use') {
        description = 'Este endereço de e-mail já está em uso por outra conta.'
      }
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <Button variant="ghost" size="sm" className="absolute top-4 left-4" asChild>
            <Link href="/sign-up">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Link>
        </Button>
      <div className="w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          {logo && <Image src={logo.imageUrl} alt={logo.description} width={80} height={80} className="h-20 w-20 mx-auto rounded-full" />}
          <h1 className="font-headline text-3xl font-bold mt-4">Crie sua conta com E-mail</h1>
          <p className="text-muted-foreground mt-2">Junte-se à nossa comunidade de mães.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
             <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" type="text" placeholder="Como podemos te chamar?" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                </div>
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
                    Criar conta e assinar
                </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    