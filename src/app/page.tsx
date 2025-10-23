'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, initiateGoogleSignIn, initiateAppleSignIn, initiateEmailSignIn, initiateEmailSignUp, initiateInstagramSignIn } from '@/firebase';
import { Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<null | 'google' | 'apple' | 'instagram' | 'email'>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'instagram') => {
    setIsLoading(provider);
    try {
      let signInFunction;
      switch (provider) {
        case 'google':
          signInFunction = initiateGoogleSignIn;
          break;
        case 'apple':
          signInFunction = initiateAppleSignIn;
          break;
        case 'instagram':
            signInFunction = initiateInstagramSignIn;
            break;
      }
      
      await signInFunction(auth);
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para a assinatura...",
      });
      router.push('/dashboard/pricing');
    } catch (error: any) {
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

  const handleEmailSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setIsLoading('email');
    try {
        if (type === 'login') {
            await initiateEmailSignIn(auth, email, password);
        } else {
            await initiateEmailSignUp(auth, email, password);
        }
        toast({
            title: `${type === 'login' ? 'Login' : 'Cadastro'} bem-sucedido!`,
            description: "Redirecionando para a assinatura...",
        });
        router.push('/dashboard/pricing');
    } catch (error: any) {
         let description = "Ocorreu um erro. Verifique suas credenciais e tente novamente.";
         if (error.code === 'auth/email-already-in-use') {
            description = 'Este endereço de e-mail já está em uso por outra conta.'
         } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            description = 'E-mail ou senha inválidos.'
         }
        toast({
            variant: 'destructive',
            title: `Erro no ${type === 'login' ? 'login' : 'cadastro'}`,
            description,
        });
    } finally {
        setIsLoading(null);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-headline text-4xl font-bold text-pink-500">ClubNath</h1>
          <p className="text-muted-foreground">Sua comunidade exclusiva</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted rounded-full">
                <TabsTrigger value="login" className="rounded-full">Entrar</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full">Criar Conta</TabsTrigger>
            </TabsList>

            <div className="space-y-4 mt-6">
                <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')} disabled={!!isLoading}>
                    {isLoading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-5 w-5" />}
                    Continuar com Google
                </Button>
                <Button variant="outline" className="w-full bg-black text-white hover:bg-black/80 hover:text-white" onClick={() => handleSocialLogin('apple')} disabled={!!isLoading}>
                    {isLoading === 'apple' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.apple className="mr-2 h-5 w-5" />}
                    Continuar com Apple
                </Button>
                <Button className="w-full text-white gradient-instagram" onClick={() => handleSocialLogin('instagram')} disabled={!!isLoading}>
                    {isLoading === 'instagram' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icons.instagram className="mr-2 h-5 w-5" />}
                    Continuar com Instagram
                </Button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <TabsContent value="login">
                <form onSubmit={(e) => handleEmailSubmit(e, 'login')} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="pl-10"/>
                    </div>
                     <div className="relative">
                        <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="pr-10"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <Button type="submit" className="w-full text-white gradient-primary" disabled={isLoading}>
                        {isLoading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Entrar
                    </Button>
                </form>
            </TabsContent>

            <TabsContent value="signup">
                <form onSubmit={(e) => handleEmailSubmit(e, 'signup')} className="space-y-4">
                    <div className="relative">
                        <Input id="signup-name" type="text" placeholder="Nome" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                    </div>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="pl-10" />
                    </div>
                     <div className="relative">
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="pr-10" />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <Button type="submit" className="w-full text-white gradient-primary" disabled={isLoading}>
                        {isLoading === 'email' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Criar Conta
                    </Button>
                </form>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
