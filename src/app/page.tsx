'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, initiateGoogleSignIn, initiateAppleSignIn, initiateEmailSignIn, initiateEmailSignUp, initiateInstagramSignIn } from '@/firebase';
import { Loader2, Mail, Eye, EyeOff } from 'lucide-react';
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FirebaseError } from 'firebase/app';
import imageData from '@/lib/placeholder-images.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<null | 'google' | 'apple' | 'instagram' | 'email'>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const logo = imageData.placeholderImages.find(p => p.id === 'logo-nath');
  const heroImage = imageData.placeholderImages.find(p => p.id === 'hero');

  const handleAuthSuccess = (provider: string) => {
    toast({
      title: "Login bem-sucedido!",
      description: `Você foi autenticada com ${provider}. Redirecionando...`,
    });
    router.push('/dashboard');
  }

  const handleAuthError = (error: any, provider: string) => {
    console.error(`Error with ${provider} login:`, error);
    let title = `Erro no login com ${provider}`;
    let description = "Ocorreu um erro inesperado. Tente novamente.";

    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/operation-not-allowed':
                title = 'Método de Login Desabilitado';
                description = `O login com ${provider} não está habilitado. Por favor, habilite este método no seu painel do Firebase em Authentication > Sign-in method.`;
                break;
            case 'auth/popup-closed-by-user':
            case 'auth/cancelled-popup-request':
                title = 'Login cancelado';
                description = 'A janela de login foi fechada antes da conclusão.';
                break;
            case 'auth/account-exists-with-different-credential':
                title = 'Conta já existe';
                description = 'Já existe uma conta com este e-mail, mas usando um método de login diferente.';
                break;
            case 'auth/unauthorized-domain':
                title = 'Domínio não autorizado';
                description = 'Este domínio não está autorizado. Verifique a configuração no painel do Firebase.';
                break;
            case 'auth/email-already-in-use':
                title = 'E-mail já cadastrado';
                description = 'Este e-mail já está em uso. Por favor, faça login ou use um e-mail diferente.';
                break;
            case 'auth/user-not-found':
            case 'auth/invalid-email':
                 title = 'Usuário não encontrado';
                description = 'Não encontramos uma conta com este e-mail. Verifique os dados ou crie uma conta.';
                break;
            case 'auth/wrong-password':
                title = 'Senha incorreta';
                description = 'A senha está incorreta. Verifique e tente novamente.';
                break;
            case 'auth/invalid-credential':
                 title = 'Credenciais inválidas';
                description = 'E-mail ou senha incorretos. Verifique os dados e tente novamente.';
                break;
            case 'auth/network-request-failed':
                title = 'Erro de rede';
                description = 'Não foi possível conectar. Verifique sua conexão com a internet.';
                break;
            case 'auth/weak-password':
                title = 'Senha fraca';
                description = 'Sua senha deve ter pelo menos 6 caracteres.';
                break;
             default:
                title = 'Erro de Autenticação';
                description = error.message || 'Ocorreu um erro. Por favor, tente novamente.';
                break;
        }
    }
    
    toast({
        variant: "destructive",
        title: title,
        description: description,
        duration: 9000,
    });
  }


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
      handleAuthSuccess(provider.charAt(0).toUpperCase() + provider.slice(1));

    } catch (error: any) {
        handleAuthError(error, provider.charAt(0).toUpperCase() + provider.slice(1));
    } finally {
        setIsLoading(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    if (isLoading === 'email') return;
    
    setIsLoading('email');

    try {
        if (type === 'login') {
            await initiateEmailSignIn(auth, email, password);
        } else {
            await initiateEmailSignUp(auth, email, password);
            // In a real app, you would update the user's profile with the name here.
        }
        handleAuthSuccess('E-mail');
    } catch (error: any) {
        handleAuthError(error, 'E-mail');
    } finally {
        setIsLoading(null);
        setPassword('');
    }
  }

  const onTabChange = (value: string) => {
    setActiveTab(value);
    setEmail('');
    setPassword('');
    setName('');
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
           <div className="text-center space-y-2">
            {logo && <Image src={logo.imageUrl} alt="Logo" width={64} height={64} className="mx-auto rounded-full" />}
            <h1 className="font-headline text-3xl font-bold text-primary tracking-tighter">Nossa Maternidade</h1>
            <p className="text-muted-foreground">Encontre sua tribo: uma comunidade de fé e acolhimento para mães.</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 h-auto rounded-full">
                  <TabsTrigger value="login" className="rounded-full py-2" disabled={!!isLoading}>Entrar</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-full py-2" disabled={!!isLoading}>Criar Conta</TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-3">
                  <Button variant="outline" className="w-full h-12" onClick={() => handleSocialLogin('google')} disabled={!!isLoading}>
                      {isLoading === 'google' ? <Loader2 className="mr-2 animate-spin" /> : <Icons.google className="mr-2 h-5 w-5" />}
                      Continuar com Google
                  </Button>
                  <Button variant="outline" className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 hover:text-background" onClick={() => handleSocialLogin('apple')} disabled={!!isLoading}>
                      {isLoading === 'apple' ? <Loader2 className="mr-2 animate-spin" /> : <Icons.apple className="mr-2 h-5 w-5 fill-background" />}
                      Continuar com Apple
                  </Button>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou continue com
                  </span>
                </div>
              </div>

              <TabsContent value="login">
                  <form onSubmit={(e) => handleEmailSubmit(e, 'login')} className="space-y-4">
                      <div className="space-y-2">
                          <Input id="login-email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!isLoading} className="h-12"/>
                      </div>
                       <div className="relative space-y-2">
                          <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="Sua senha" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={!!isLoading} className="h-12 pr-10"/>
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground">
                              {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                      </div>
                      <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={!!isLoading || !email || !password}>
                          {isLoading === 'email' ? <Loader2 className="mr-2 animate-spin" /> : 'Entrar'}
                      </Button>
                  </form>
              </TabsContent>

              <TabsContent value="signup">
                  <form onSubmit={(e) => handleEmailSubmit(e, 'signup')} className="space-y-4">
                      <div className="space-y-2">
                          <Input id="signup-name" type="text" placeholder="Seu nome completo" required value={name} onChange={(e) => setName(e.target.value)} disabled={!!isLoading} className="h-12"/>
                      </div>
                       <div className="space-y-2">
                          <Input id="signup-email" type="email" placeholder="seu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!isLoading} className="h-12" />
                      </div>
                       <div className="relative space-y-2">
                          <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Crie uma senha (mínimo 6 caracteres)" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} disabled={!!isLoading} className="h-12 pr-10" />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 h-5 w-5 text-muted-foreground">
                              {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                      </div>
                      <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={!!isLoading || !name || !email || password.length < 6}>
                          {isLoading === 'email' ? <Loader2 className="mr-2 animate-spin" /> : 'Criar Conta Grátis'}
                      </Button>
                  </form>
              </TabsContent>
          </Tabs>
        </div>
      </div>
       <div className="hidden bg-muted lg:block relative">
        {heroImage && <Image
          src={heroImage.imageUrl}
          alt="Uma mãe sorrindo com seu bebê no colo"
          data-ai-hint={heroImage.imageHint}
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      </div>
    </div>
  );
}
